from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.decomposition import PCA
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit
import pandas as pd
import numpy as np
import warnings
import matplotlib.pyplot as plt
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from joblib import parallel_backend
import time
from sklearn.utils import resample
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
import mlflow
import mlflow.keras
from datetime import datetime
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dropout, Dense
from tensorflow.keras.optimizers import Adam

from AreasModel import AreasModel

# Configure TensorFlow for better CPU performance
tf.config.threading.set_inter_op_parallelism_threads(4)  # Number of threads for inter-op parallelism
tf.config.threading.set_intra_op_parallelism_threads(4)  # Number of threads for intra-op parallelism
tf.config.optimizer.set_jit(True)  # Enable XLA JIT compilation

from AlexandriaData import AlexandriaData
warnings.filterwarnings("ignore")
import os

class AreasLSTM(AreasModel):
    
    def __init__(self, area_name):  
        super().__init__(area_name, "LSTM")
    
    def format_data_params(self, data_params):
        return f"ts{data_params['Test_Size']}_ma{data_params['Moving_Avg']}_lg{data_params['Lags']}_pca{data_params['PCA']}"
    
    def model_params_grid_search(self, X_train, y_train, data_params):
        # Create validation split
        X_train_main, X_val, y_train_main, y_val = train_test_split(X_train, y_train, test_size=0.2, shuffle=False)
        
        parameters = {
            "lstm_units": [32, 64, 128],
            "dropout_rate": [0.1, 0.2, 0.3],
            "learning_rate": [0.001, 0.01, 0.1],
            "epochs": [50, 100],
            "batch_size": [16, 32, 64]
        }
        
        best_score = float('-inf')
        best_params = None
        
        # Reshape input for LSTM
        X_train_reshaped = X_train_main.values.reshape((X_train_main.shape[0], 1, X_train_main.shape[1]))
        X_val_reshaped = X_val.values.reshape((X_val.shape[0], 1, X_val.shape[1]))
        i = 0
        total_combinations = len(parameters["lstm_units"]) * len(parameters["dropout_rate"]) * len(parameters["learning_rate"]) * len(parameters["epochs"]) * len(parameters["batch_size"])
        
        # Format data parameters for run name
        data_params_str = self.format_data_params(data_params)
        
        for lstm_units in parameters["lstm_units"]:
            for dropout_rate in parameters["dropout_rate"]:
                for learning_rate in parameters["learning_rate"]:
                    for epochs in parameters["epochs"]:
                        for batch_size in parameters["batch_size"]:
                            i += 1
                            print(f"Testing {i}/{total_combinations}: units={lstm_units}, dropout={dropout_rate}, lr={learning_rate}, epochs={epochs}, batch={batch_size}")
                            
                            with mlflow.start_run(nested=True, run_name=f"LSTM_{data_params_str}_combination_{i}"):
                                # Log parameters
                                current_model_params = {
                                    "lstm_units": lstm_units,
                                    "dropout_rate": dropout_rate,
                                    "learning_rate": learning_rate,
                                    "epochs": epochs,
                                    "batch_size": batch_size,
                                }
                                
                                mlflow.log_params(current_model_params | data_params)
                                
                                # Build model with current parameters
                                model = Sequential([
                                    LSTM(lstm_units, input_shape=(1, X_train_main.shape[1]), return_sequences=True),
                                    Dropout(dropout_rate),
                                    LSTM(lstm_units),
                                    Dropout(dropout_rate),
                                    Dense(1)
                                ])
                                
                                model.compile(optimizer=Adam(learning_rate=learning_rate),
                                            loss='mse',
                                            metrics=['mae'])
                                
                                # Train and evaluate
                                history = model.fit(X_train_reshaped, y_train_main,
                                        epochs=epochs,
                                        batch_size=batch_size,
                                        validation_data=(X_val_reshaped, y_val),
                                        verbose=0)
                                
                                # Get predictions
                                y_pred = model.predict(X_val_reshaped)
                                
                                # Calculate both MAE and R2
                                mae = mean_absolute_error(y_val, y_pred)
                                r2 = r2_score(y_val, y_pred)
                                
                                if r2 > best_score:
                                    best_score = r2
                                    best_params = current_model_params
                                
                                # Log metrics
                                mlflow.log_metrics({
                                    "mae": mae,
                                    "r2": r2,
                                })
                                
                                print(f"MAE: {mae:.4f}, R2: {r2:.4f}")
                                    
                                # Log model
                                mlflow.keras.log_model(model, "lstm_model")
                                mlflow.end_run()
        
        print(f"Best parameters: {best_params}")
        print(f"Best R2 score: {best_score:.4f}")
        return best_params

    def run_model(self, X_train, X_test, y_train, y_test, params):
        with mlflow.start_run():
            # Log parameters
            mlflow.log_params(params)
            
            # Reshape input for LSTM [samples, time steps, features]
            X_train_reshaped = X_train.values.reshape((X_train.shape[0], 1, X_train.shape[1]))
            X_test_reshaped = X_test.values.reshape((X_test.shape[0], 1, X_test.shape[1]))
            
            # Build LSTM model
            model = Sequential([
                LSTM(params["lstm_units"], input_shape=(1, X_train.shape[1]), return_sequences=True),
                Dropout(params["dropout_rate"]),
                LSTM(params["lstm_units"]),
                Dropout(params["dropout_rate"]),
                Dense(1)
            ])
            
            # Compile model
            model.compile(optimizer=Adam(learning_rate=params["learning_rate"]),
                        loss='mse',
                        metrics=['mae'])
            
            # Train model
            history = model.fit(
                X_train_reshaped, y_train,
                epochs=params["epochs"],
                batch_size=params["batch_size"],
                validation_data=(X_test_reshaped, y_test),
                verbose=0
            )
            
            # Create input example and signature
            input_example = X_test_reshaped[:1]
            signature = mlflow.models.infer_signature(
                model_input=input_example,
                model_output=model.predict(input_example)
            )
            
            # Log model with signature and input example
            mlflow.keras.log_model(
                model,
                "lstm_model",
                signature=signature,
                input_example=input_example
            )
            
            # Evaluate model
            metrics = self.model_evaluation(X_test, y_test, model)
            mlflow.log_metrics(metrics | {
                "val_loss": history.history['val_loss'][-1],
                "val_mae": history.history['val_mae'][-1]
            })
            
            mlflow.end_run()
            return model

    def model_evaluation(self, X_test, y_test, reg):
        pred = reg.predict(X_test)
        r2, mae, rmse = r2_score(y_test, pred), mean_absolute_error(y_test, pred), mean_squared_error(y_test, pred)

        return {"R2": r2, "MAE": mae, "RMSE": rmse}
    
    def run_model_ci(self, X_train, y_train, params, future_data):
        n_bootstraps = 1000
        preds_bootstrap = []

        for i in range(n_bootstraps):
            X_resampled, y_resampled = resample(X_train, y_train, replace=True, random_state=i)

            model = xgb.XGBRegressor(base_score=0.5, booster='gbtree',
                            n_estimators=params["n_estimators"],
                            objective='reg:squarederror',
                            max_depth=params["max_depth"],
                            learning_rate=params["learning_rate"],
                            random_state=42,
                            subsample=1.0,
                            reg_alpha=0,
                            colsample_bytree=0.7,
                            reg_lambda=0.5,
                            seed=25)

            model.fit(X_resampled, y_resampled)

            preds = model.predict(future_data)
            preds_bootstrap.append(params["y_scaler"].inverse_transform([preds]))

        preds_bootstrap = np.array(preds_bootstrap)

        mean_preds = preds_bootstrap.mean(axis=0)
        std_preds = preds_bootstrap.std(axis=0)

        lower_bound = mean_preds - 1.44 * std_preds
        upper_bound = mean_preds + 1.44 * std_preds

        return (lower_bound, upper_bound, mean_preds)
        
alex = AlexandriaData(area_idx=1)
data = alex.get_area_data()
print(alex.area_name)

future_macro = alex.get_future_macro_data()

xgb = AreasXGB(area_name=alex.area_name)
best_params = xgb.fit(data)
xgb.predict(data, future_macro, best_params)
