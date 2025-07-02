from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.metrics import mean_squared_error
import mlflow
import mlflow.sklearn
from pmdarima import auto_arima
from statsmodels.tsa.arima.model import ARIMA
import warnings
warnings.filterwarnings("ignore")

from py.models.ModelPipeline import ModelPipeline

class ModelARIMA(ModelPipeline):
    
    def __init__(self, tag, target):  
        super().__init__(tag, target, "ARIMA")
    
    def run_model(self, X_train, X_test, y_train, y_test, params):
        data_params_str = self.format_data_params(params)
        with mlflow.start_run(nested=True, run_name=data_params_str):
            mlflow.log_params(params)
            
            X_train = X_train.drop(["Year", "Quarter"], axis=1)
            X_test = X_test.drop(["Year", "Quarter"], axis=1)
            
            model = auto_arima(
                y_train,
                start_p=1, max_p=3,
                start_q=1, max_q=3,
                d=1,
                seasonal=True,
                m=4,
                start_P=0, max_P=1,
                start_Q=0, max_Q=1,
                D=1,
                trace=False,
                error_action='ignore',
                suppress_warnings=False,
                stepwise=True,           
                max_order=None,     
                n_fits=20,              
            )
            
            # model = auto_arima(
            #     y_train,
            #     start_p=1, max_p=5,  # Non-seasonal AR order range
            #     start_q=1, max_q=5,  # Non-seasonal MA order range
            #     d=None,                 # Explicitly set non-seasonal differencing order (common for trend)
            #     seasonal=False,      # Explicitly set to False to disable seasonality
            #     # m, start_P, max_P, start_Q, max_Q, D are not needed when seasonal=False
            #     trace=True,          # Show model fitting process
            #     error_action='ignore',
            #     suppress_warnings=True,
            #     stepwise=True,
            #     information_criterion='aic',
            #     max_order=None,
            #     n_fits=20
            # )

            # model = ARIMA(y_train, order=(4,2,4))
            # model = model.fit()   
            
            # history = [y for y in y_train]
            
            # predictions = []
            # for t in range(len(y_test)):
            #     model = ARIMA(history, order=(0,2,1))
            #     model = model.fit()
            #     output = model.forecast(1, alpha=0.05)
            #     predictions.append(output[0])
            #     obs = y_test[t][0]
            #     history.append(obs)
            #     print('predicted=%f, expected=%f' % (output[0], obs))

            
            current_model_params = {
                "order": model.order,
                "seasonal_order": model.seasonal_order,
            }
                                
            mlflow.log_params(current_model_params | params)
            # mlflow.log_params(params)
            
            metrics = self.model_evaluation(X_train, y_test, model)
            mlflow.log_metrics(metrics)
            mlflow.sklearn.log_model(model, artifact_path="model")
            mlflow.end_run()
            return model

    def model_evaluation(self, X_test, y_test, model):
        n_test = len(y_test)
        forecast, conf_int = model.predict(
            n_periods=n_test,
            return_conf_int=True,
            alpha=0.05
        )
                
        r2, mae, rmse = r2_score(y_test, forecast), mean_absolute_error(y_test, forecast), mean_squared_error(y_test, forecast)

        return {"R2": r2, "MAE": mae, "RMSE": rmse}

    def run_model_ci(self, X, y, params, future_data):
        model = params["model"]     

        forecast, conf_int = model.predict(
            n_periods=len(future_data),
            return_conf_int=True,
            alpha=0.05
        )
            
        mean_preds = params["y_scaler"].inverse_transform(forecast.reshape(-1, 1)).flatten()
        lower_bounds = params["y_scaler"].inverse_transform(conf_int[:, 0].reshape(-1, 1)).flatten()  
        upper_bound = params["y_scaler"].inverse_transform(conf_int[:, 1].reshape(-1, 1)).flatten()
        
        # mean_preds = forecast.reshape(-1, 1).flatten()
        # lower_bounds = conf_int[:, 0].reshape(-1, 1).flatten()  
        # upper_bound = conf_int[:, 1].reshape(-1, 1).flatten()
        
        return (lower_bounds, upper_bound, mean_preds)