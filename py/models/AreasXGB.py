from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import TimeSeriesSplit
import warnings
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.utils import resample
import mlflow
import mlflow.xgboost

from AlexandriaData import AlexandriaData
from AreasModel import AreasModel
warnings.filterwarnings("ignore")

class AreasXGB(AreasModel):
    
    def __init__(self, area_name):  
        super().__init__(area_name, "XGBoost")
    
    def model_params_grid_search(self, X_train, y_train, params=None):
        params = self.set_grid_search_params()
        
        grid_search = self.run_grid_search_model(X_train, y_train, params)
        
        return grid_search.best_params_
    
    def set_grid_search_params(self):
        return {
            "max_depth": [3, 4, 5, 7],
            "learning_rate": [0.01, 0.05, 0.1, 0.2, 0.3],
            "n_estimators": [50, 100, 200],
        }
        
    def run_grid_search_model(self, X_train, y_train, params):
        model = XGBRegressor()
        
        cv_split = TimeSeriesSplit(n_splits=4)
        grid_search = GridSearchCV(estimator=model, cv=cv_split, param_grid=params, scoring='r2', verbose=1)
        grid_search.fit(X_train, y_train)
        
        return grid_search
    
    def run_model(self, X_train, X_test, y_train, y_test, params):
        with mlflow.start_run(nested=True, run_name=f"XGBoost_model_{params['Test_Size']}_{params['Moving_Avg']}_{params['Lags']}_{params['PCA']}"):
            mlflow.log_params(params)
        
            # create the model
            reg = self.create_model(params)
            
            # fit the model
            self.train_model(reg, X_train, y_train, X_test, y_test)
            
            # model evaluation
            metrics = self.model_evaluation(X_test, y_test, reg)
            mlflow.log_metrics(metrics)
            
            mlflow.xgboost.log_model(reg, "model")
            mlflow.end_run()
            return reg
        
    def create_model(self, params):
        return XGBRegressor(
            base_score=0.5, booster='gbtree',
            n_estimators=params["n_estimators"],
            objective='reg:squarederror',
            max_depth=params["max_depth"],
            learning_rate=params["learning_rate"],
            random_state=42,
            subsample=1.0,
            reg_alpha=0,
            colsample_bytree=0.7,
            reg_lambda=0.5,
            seed=25
        )
        
    def train_model(self, reg, X_train, y_train, X_test, y_test):
        if X_test is not None and y_test is not None:
            reg.fit(X_train, y_train,
                    eval_set=[(X_train, y_train), (X_test, y_test)],
                    verbose=False)
            
        # for CI (no eval_set)
        else:
            reg.fit(X_train, y_train)
            

    def model_evaluation(self, X_test, y_test, reg):
        pred = reg.predict(X_test)
        r2, mae, rmse = r2_score(y_test, pred), mean_absolute_error(y_test, pred), mean_squared_error(y_test, pred)

        return {"R2": r2, "MAE": mae, "RMSE": rmse}

    def run_model_ci(self, X, y, params, future_data):
        n_bootstraps = 100 
        preds_bootstrap = []

        for i in range(n_bootstraps):
            # resample x, y
            X_resampled, y_resampled = resample(X, y, replace=True, random_state=i)

            # create the model
            reg = self.create_model(params)

            # train the model
            self.train_model(reg, X_resampled, y_resampled, None, None)

            # get pred
            preds = self.get_ci_prediction(reg, params, future_data)
            preds_bootstrap.append(preds)

        (lower_bound, upper_bound, mean_preds) = self.create_bounds_ci(preds_bootstrap)

        return (lower_bound, upper_bound, mean_preds)
    
    def get_ci_prediction(self, reg, params, future_data):
        preds = reg.predict(future_data)
        preds = params["y_scaler"].inverse_transform([preds])
        
        return preds
        
for i in range(0, 7):
    alex = AlexandriaData(area_idx=i)
    data = alex.get_area_data()

    print(alex.area_name)

    future_macro = alex.get_future_macro_data()

    xgb = AreasXGB(area_name=alex.area_name)
    best_params = xgb.fit(data)
    xgb.predict(data, future_macro, best_params)
