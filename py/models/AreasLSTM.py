from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.metrics import mean_squared_error
from sklearn.utils import resample
import mlflow
import mlflow.keras
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dropout, Dense
from tensorflow.keras.optimizers import Adam
import logging
logging.getLogger("mlflow").setLevel(logging.ERROR)
import warnings
warnings.filterwarnings("ignore")

from AreasModel import AreasModel
from AlexandriaData import AlexandriaData

class AreasLSTM(AreasModel):
    
    def __init__(self, area_name):  
        super().__init__(area_name, "LSTM")
        
        # Add early stopping callback for model
        self.early_stopping = self.set_early_stopping()
        
    def set_early_stopping(self):
        return tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        )
    
    def model_params_grid_search(self, X_train, y_train, data_params):
        # Create validation split
        X_train_main, X_val, y_train_main, y_val = train_test_split(X_train, y_train, test_size=0.2, shuffle=False)
        
        # set params for the grid search
        params = self.set_grid_search_params()
        
        # keep track of best score and its params
        best_score = float('-inf')
        best_params = None
        
        # Reshape input for LSTM
        X_train_reshaped, X_val_reshaped = self.reshape_X_for_grid_search(X_train_main, X_val)
        
        # keep track of progress
        i = 0
        total_combinations = len(params["lstm_units"]) * len(params["dropout_rate"]) * len(params["learning_rate"]) * len(params["epochs"]) * len(params["batch_size"])
        
        # # Format data parameters for run name
        # data_params_str = self.format_data_params(data_params)
        
        for lstm_units in params["lstm_units"]:
            for dropout_rate in params["dropout_rate"]:
                for learning_rate in params["learning_rate"]:
                    for epochs in params["epochs"]:
                        for batch_size in params["batch_size"]:
                            i += 1
                            print(f"Testing {i}/{total_combinations}: units={lstm_units}, dropout={dropout_rate}, lr={learning_rate}, epochs={epochs}, batch={batch_size}")
                            
                            with mlflow.start_run(nested=True):
                                # log parameters
                                current_model_params = {
                                    "lstm_units": lstm_units,
                                    "dropout_rate": dropout_rate,
                                    "learning_rate": learning_rate,
                                    "epochs": epochs,
                                    "batch_size": batch_size,
                                }
                                
                                mlflow.log_params(current_model_params | data_params)
                                
                                model, metrics = self.run_grid_search_model(
                                    current_model_params,
                                    X_train, X_train_reshaped, y_train_main, X_val_reshaped, y_val
                                )
                                
                                # if this iteration has a better score, change the best score and the best params
                                if metrics["R2"] > best_score:
                                    best_score = metrics["R2"]
                                    best_params = current_model_params
                                    
                                # Log metrics
                                mlflow.log_metrics(metrics)
                                
                                # Log model
                                mlflow.keras.log_model(model, "lstm_model")
                                mlflow.end_run()
                                
                                # Clear memory
                                del model
                                tf.keras.backend.clear_session()
        
        print(f"Best parameters: {best_params}")
        print(f"Best R2 score: {best_score:.4f}")
        return best_params
    
    def set_grid_search_params(self):
        return {
            "lstm_units": [8, 16],  # Reduced from [32, 64, 128] # [8, 16],
            "dropout_rate": [0.1],  # Reduced from [0.1, 0.2, 0.3]
            "learning_rate": [0.01],  # Reduced from [0.001, 0.01, 0.1]
            "epochs": [20],
            "batch_size": [4, 8]  # Reduced from [16, 32, 64] # [4, 8] 
        }
        
    def reshape_X_for_grid_search(self, X_train_main, X_val):
        X_train_reshaped = X_train_main.values.reshape((X_train_main.shape[0], 1, X_train_main.shape[1]))
        X_val_reshaped = X_val.values.reshape((X_val.shape[0], 1, X_val.shape[1]))
        
        return X_train_reshaped, X_val_reshaped
    
    def run_grid_search_model(self, params, X_train, X_train_reshaped, y_train_main, X_val_reshaped, y_val):
        # build model with current parameters
        model = self.create_model_layers(params, X_train.shape[1])
        
        # compile model
        self.compile_model(model, params)
        
        # train with early stopping
        history = self.train_model(model, X_train_reshaped, y_train_main, None, None, params)
        
        # evaluate model
        metrics = self.model_evaluation(X_val_reshaped, y_val, model)
        
        print(f"MAE: {metrics['MAE']:.4f}, R2: {metrics['R2']:.4f}")
        
        return model, metrics

    def run_model(self, X_train, X_test, y_train, y_test, params):
        with mlflow.start_run():
            # log parameters
            mlflow.log_params(params)
            
            # reshape input for LSTM [samples, time steps, features]
            X_train_reshaped, X_test_reshaped = self.reshape_train_data_for_model(X_train, X_test)

            # build LSTM model
            model = self.create_model_layers(params, X_train.shape[1])
            
            # compile model
            self.compile_model(model, params)
            
            # train model
            history = self.train_model(model, X_train_reshaped, y_train, X_test_reshaped, y_test, params)
            
            # evaluate model
            metrics = self.model_evaluation(X_test_reshaped, y_test, model)
            mlflow.log_metrics(metrics)
            
            # log model without input example
            mlflow.keras.log_model(model, "lstm_model")
            
            mlflow.end_run()
        return model
        
    def reshape_train_data_for_model(self, X_train, X_test):
        X_train_reshaped = X_train.values.reshape((X_train.shape[0], 1, X_train.shape[1]))
        X_test_reshaped = X_test.values.reshape((X_test.shape[0], 1, X_test.shape[1]))

        return X_train_reshaped, X_test_reshaped
        
    def create_model_layers(self, params, input_shape):
        return Sequential([
                LSTM(params["lstm_units"], input_shape=(1, input_shape), return_sequences=True),
                Dropout(params["dropout_rate"]),
                LSTM(params["lstm_units"]),
                Dropout(params["dropout_rate"]),
                Dense(1)
        ])

    def compile_model(self, model, params):
        model.compile(optimizer=Adam(learning_rate=params["learning_rate"]),
                        loss='mse',
                        metrics=['mae'])
        
    def train_model(self, model, X_train, y_train, X_test, y_test, params):
        if X_test is not None and y_test is not None:
            return model.fit(
                X_train, y_train,
                validation_data=(X_test, y_test),
                epochs=params["epochs"],
                batch_size=params["batch_size"],
                callbacks=[self.early_stopping],
                verbose=0
            )
        # for CI (no validation data)
        else:
            return model.fit(
                X_train, y_train,
                epochs=params["epochs"],
                batch_size=params["batch_size"],
                callbacks=[self.early_stopping],
                verbose=0
            )
        
    def model_evaluation(self, X_test, y_test, model):
        pred = model.predict(X_test)
        r2, mae, rmse = r2_score(y_test, pred), mean_absolute_error(y_test, pred), mean_squared_error(y_test, pred)

        return {"R2": r2, "MAE": mae, "RMSE": rmse}
    
    def run_model_ci(self, X, y, params, future_data):
        n_bootstraps = 100
        preds_bootstrap = []

        # reshape data
        X_train_reshaped, future_data_reshaped = self.reshape_X_for_ci(X, future_data)

        for i in range(n_bootstraps):
            print(f"Bootstrapping {i+1}/{n_bootstraps}")
            X_resampled, y_resampled = resample(X_train_reshaped, y, replace=True, random_state=i)

            # build model
            model = self.create_model_layers(params, X.shape[1])
            
            # compile model
            self.compile_model(model, params)
            
            # train model
            history = self.train_model(model, X_resampled, y_resampled, None, None, params)

            # get predictions
            preds = model.predict(future_data_reshaped)
            preds_bootstrap.append(params["y_scaler"].inverse_transform(preds))
            
            # clear memory
            del model
            tf.keras.backend.clear_session()

        (lower_bound, upper_bound, mean_preds) = self.create_bounds_ci(preds_bootstrap)

        return (lower_bound, upper_bound, mean_preds)
    
    def reshape_X_for_ci(self, X_train, future_data):
        X_train_reshaped = X_train.values.reshape((X_train.shape[0], 1, X_train.shape[1]))
        future_data_reshaped = future_data.values.reshape((future_data.shape[0], 1, future_data.shape[1]))
        
        return X_train_reshaped, future_data_reshaped
        
for i in range(3, 4):
    alex = AlexandriaData(area_idx=i)
    data = alex.get_area_data()
    
    print(alex.area_name)

    future_macro = alex.get_future_macro_data()

    lstm = AreasLSTM(area_name=alex.area_name)
    best_params = lstm.fit(data)
    lstm.predict(data, future_macro, best_params)
