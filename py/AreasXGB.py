from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.decomposition import PCA
import xgboost as xgb
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit
from sklearn.linear_model import LassoCV
import pandas as pd
import numpy as np
import warnings
import matplotlib.pyplot as plt
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from joblib import parallel_backend
from tqdm import tqdm
import time
from sklearn.utils import resample
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
import mlflow
import mlflow.xgboost
import mlflow.keras
from datetime import datetime

from AlexandriaData import AlexandriaData
from AreasModel import AreasModel
warnings.filterwarnings("ignore")

class AreasXGB(AreasModel):
    
    def __init__(self, area_name):  
        super().__init__(area_name, "XGBoost")
    
    def fit(self, alex):
        return self.grid_search(alex)
    
    def impute_alex_data(self, alex):
        imp = IterativeImputer(max_iter=10, random_state=0)
        X = alex.drop('Date', axis=1)
        data_imputed = pd.DataFrame(imp.fit_transform(X), columns=X.columns)

        data_imputed["Date"] = alex["Date"]
        return data_imputed
    
    def perform_moving_average(self, alex, ma_window):
        if ma_window:
            for col in alex.columns:
                if col in ["Date", "Year", "Quarter", "Price Per Meter"]:
                    continue

                ma = col + "_ma"
                alex[ma] = alex[col].rolling(window=ma_window).mean()

            alex = self.impute_alex_data(alex)
            
        return alex

    def perform_lags(self, alex, lags_n):
        lags = self.lags_compute(alex, lags_n)

        X_scaled, X, y = self.lags_preprocessing(lags, alex)

        selected_lags = self.lags_run_lasso(X_scaled, X, y)

        lags = lags.drop(columns=[col for col in lags.columns if col not in selected_lags], axis=1)
        alex = pd.concat([alex, lags], axis=1)
        alex.set_index("Date", inplace=True)

        return alex
    
    def lags_compute(self, alex, lags_n):
        lags = {}
        for col in alex.columns:
            if col in ["Date", "Year", "Quarter", "Price Per Meter"]:
                continue

            for i in range(1, lags_n):
                lag = col + "_lag_" + str(i)
                lags[lag] = alex[col].shift(i)

        return pd.concat(lags, axis=1)
    
    def lags_preprocessing(self, lags, alex):
        X = lags
        X.fillna(0, inplace=True)
        y = alex['Price Per Meter']

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        return X_scaled, X, y
    
    def lags_run_lasso(self, X_scaled, X, y):
        tscv = TimeSeriesSplit(n_splits=5)

        lasso = LassoCV(cv=tscv)
        lasso.fit(X_scaled, y)

        coef = pd.Series(lasso.coef_, index=X.columns)
        selected_lags = coef[coef != 0].index.tolist()
        
        return selected_lags
    
    def data_preprocessing(self, alex, pca_comp, test_size):
        X = alex.drop(["Price Per Meter"], axis=1)
        y = alex["Price Per Meter"]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, shuffle=False)
        y_train = np.reshape(y_train, (y_train.shape[0], 1))
        y_test = np.reshape(y_test, (y_test.shape[0], 1))

        X_train = self.create_pca_comp(X_train, pca_comp)
        X_test = self.create_pca_comp(X_test, pca_comp)
        
        (X_train, X_test, y_train, y_test, x_scaler, y_scaler) = self.scale_data(X_train, X_test, y_train, y_test)

        for df in [X_train, X_test]:
            for col in ["Quarter", "Year"]:
                df[col] = df[col].astype(int)

        return (X_train, X_test, y_train, y_test, x_scaler, y_scaler)
    
    def create_pca_comp(self, X, pca_comp):
        date = X[['Year', 'Quarter']]
        pca = PCA(n_components=pca_comp)
        X.fillna(0, inplace=True)
        X_pca = pca.fit_transform(X.drop(["Year", "Quarter"], axis=1))

        df_pca = pd.DataFrame(X_pca, columns=[f'pca_{i+1}' for i in range(X_pca.shape[1])])
        X = pd.concat([date.reset_index(drop=True), df_pca], axis=1)

        X.replace(0, np.nan, inplace=True)

        return X
    
    def scale_data(self, X_train, X_test, y_train, y_test):
        x_scaler = MinMaxScaler()
        X_train = pd.DataFrame(x_scaler.fit_transform(X_train),
                            columns=X_train.columns,
                            index=X_train.index)
        X_test = pd.DataFrame(x_scaler.fit_transform(X_test),
                            columns=X_test.columns,
                            index=X_test.index)

        y_scaler = MinMaxScaler()
        y_test = y_scaler.fit_transform(y_test)
        y_train = y_scaler.fit_transform(y_train)

        return (X_train, X_test, y_train, y_test, x_scaler, y_scaler)
    
    def model_params_grid_search(self, X_train, y_train, params=None):
        cv_split = TimeSeriesSplit(n_splits=4)
        model = XGBRegressor()
        parameters = {
            "max_depth": [3, 4, 5, 7],
            "learning_rate": [0.01, 0.05, 0.1, 0.2, 0.3],
            "n_estimators": [50, 100, 200],
        }
                 
        grid_search = GridSearchCV(estimator=model, cv=cv_split, param_grid=parameters, scoring='r2', verbose=1)
        grid_search.fit(X_train, y_train)
        
        return grid_search.best_params_
    
    def run_model(self, X_train, X_test, y_train, y_test, params):
        with mlflow.start_run():
            mlflow.log_params(params)
        
            reg = XGBRegressor(base_score=0.5, booster='gbtree',
                           n_estimators=params["n_estimators"],
                           early_stopping_rounds=10,
                           objective='reg:squarederror',
                           max_depth=params["max_depth"],
                           learning_rate=params["learning_rate"],
                           random_state=42,
                           subsample=1.0,
                           reg_alpha=0,
                           colsample_bytree=0.7,
                           reg_lambda=0.5,
                           seed=25)
            
            reg.fit(X_train, y_train,
                eval_set=[(X_train, y_train), (X_test, y_test)],
                verbose=False)

            # Create input example and signature
            input_example = X_test.iloc[:1]
            signature = mlflow.models.infer_signature(
                model_input=input_example,
                model_output=reg.predict(input_example)
            )

            # Log model with signature and input example
            mlflow.xgboost.log_model(
                reg, 
                "model",
                signature=signature,
                input_example=input_example
            )
            
            metrics = self.model_evaluation(X_test, y_test, reg)
            mlflow.log_metrics(metrics)
            
            mlflow.end_run()
            return reg

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
