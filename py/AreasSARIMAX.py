from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.metrics import mean_squared_error
import mlflow
import mlflow.sklearn
from pmdarima import auto_arima
import warnings
warnings.filterwarnings("ignore")

from AlexandriaData import AlexandriaData
from AreasModel import AreasModel

class AreasSARIMAX(AreasModel):
    
    def __init__(self, area_name):  
        super().__init__(area_name, "SARIMAX")
    
    def run_model(self, X_train, X_test, y_train, y_test, params):
        with mlflow.start_run(nested=True, run_name=f"SARIMAX_model_{params['Test_Size']}_{params['Moving_Avg']}_{params['Lags']}_{params['PCA']}"):
            mlflow.log_params(params)
            
            X_train = X_train.drop(["Year", "Quarter"], axis=1)
            X_test = X_test.drop(["Year", "Quarter"], axis=1)
            
            model = auto_arima(
                y_train,
                exogenous=X_train,
                start_p=0, max_p=3,
                start_q=0, max_q=3,
                d=None,
                seasonal=True,
                m=4,
                start_P=0, max_P=1,
                start_Q=0, max_Q=1,
                D=None,
                trace=False,
                error_action='ignore',
                suppress_warnings=False,
                stepwise=True,           
                max_order=6,     
                n_fits=100,              
                information_criterion='aic', 
            )
            
            print(model.summary())
            
            current_model_params = {
                "order": model.order,
                "seasonal_order": model.seasonal_order,
            }
                                
            mlflow.log_params(current_model_params | params)
            
            metrics = self.model_evaluation(X_test, y_test, model)
            mlflow.log_metrics(metrics)
            mlflow.sklearn.log_model(model, artifact_path="model")
            mlflow.end_run()
            return model

    def model_evaluation(self, X_test, y_test, model):
        n_test = len(y_test)
        pred, conf_int = model.predict(
            n_periods=n_test,
            exogenous=X_test,
            return_conf_int=True
        )
        
        print(pred, y_test)

        r2, mae, rmse = r2_score(y_test, pred), mean_absolute_error(y_test, pred), mean_squared_error(y_test, pred)

        return {"R2": r2, "MAE": mae, "RMSE": rmse}

    def run_model_ci(self, params, future_data, X=None, y=None):
        model = params["model"]     

        forecast, conf_int = model.predict(
            n_periods=12,
            exogenous=future_data,
            return_conf_int=True,
            alpha=0.05
        )

        for i in range(12):
            print(f"Quarter {i+1} forecast: {forecast[i]:.2f}, "
                f"95% CI: [{conf_int[i,0]:.2f}, {conf_int[i,1]:.2f}]")
            
        mean_preds = params["y_scaler"].inverse_transform(forecast.reshape(-1, 1)).flatten()
        lower_bounds = params["y_scaler"].inverse_transform(conf_int[:, 0].reshape(-1, 1)).flatten()  
        upper_bound = params["y_scaler"].inverse_transform(conf_int[:, 1].reshape(-1, 1)).flatten()

        return (lower_bounds, upper_bound, mean_preds)
        
for i in range(0, 7):
    alex = AlexandriaData(area_idx=i)
    data = alex.get_area_data()

    print(alex.area_name)

    future_macro = alex.get_future_macro_data()

    sarimax = AreasSARIMAX(area_name=alex.area_name)
    best_params = sarimax.fit(data)
    sarimax.predict(data, future_macro, best_params)
