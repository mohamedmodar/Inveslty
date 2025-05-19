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

            model = XGBRegressor(base_score=0.5, booster='gbtree',
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
        
alex = AlexandriaData(area_idx=8)
data = alex.get_area_data()
print(alex.area_name)

future_macro = alex.get_future_macro_data()

xgb = AreasXGB(area_name=alex.area_name)
best_params = xgb.fit(data)
xgb.predict(data, future_macro, best_params)
