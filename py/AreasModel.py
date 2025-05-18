import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow logging
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN optimizations

from datetime import datetime
from matplotlib import pyplot as plt
import mlflow
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import StandardScaler
from sklearn.impute import IterativeImputer
from sklearn.linear_model import LassoCV
from sklearn.model_selection import TimeSeriesSplit, train_test_split
from sklearn.preprocessing import MinMaxScaler
import json

class AreasModel():
    
    def __init__(self, area_name, model_name):
        # Set up MLflow tracking
        mlflow.set_tracking_uri("file:./mlruns")
        self.experiment_name = f"{model_name}_{area_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        mlflow.set_experiment(self.experiment_name)
        self.area_name = area_name
        self.model_name = model_name
        
        self.output_dir = os.path.join("py\\datasets\\data\\model_outputs", model_name, area_name)
        os.makedirs(self.output_dir, exist_ok=True)
    
    def fit(self, alex):
        return self.grid_search(alex)
        
    def model_params_grid_search(self, X_train, y_train):
        raise NotImplementedError("Model params grid search must be implemented by subclasses.")
    
    def run_model(self, X_train, X_test, y_train, y_test, params):
        raise NotImplementedError("Run model must be implemented by subclasses.")
    
    def model_evaluation(self, X_test, y_test, reg):
        raise NotImplementedError("Model evaluation must be implemented by subclasses.")
    
    def format_data_params(self, data_params):
        return f"ts{data_params['Test_Size']}_ma{data_params['Moving_Avg']}_lg{data_params['Lags']}_pca{data_params['PCA']}"
    
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
    
    def get_best_params(self, itrs):
        sorted_itrs = sorted(itrs, key=lambda x: x['R2'], reverse=True)
        params = sorted_itrs[0]
        return params
    
    def grid_search(self, alex):
        itrs = []
        for size in np.arange(0.05, 0.25, 0.05):
            for ma_window in [0, 4, 8, 12]:
                for i in range(4, 21, 4):
                    alex_ = alex.copy()
                    alex_ = self.perform_moving_average(alex_, ma_window)
                    alex_ = self.perform_lags(alex_, i)
                    loop_pca_untill = int(size * alex_.shape[0]) + 1
                    for comp in range(5, loop_pca_untill):
                        print("----------------------")
                        params = {"Test_Size": size, "Moving_Avg": ma_window, "Lags": i, "PCA": comp}                        
                        (X_train, X_test, y_train, y_test, x_scaler, y_scaler) = self.data_preprocessing(alex_, comp, size)

                        print("Getting best model parameters")
                        best_model_params = self.model_params_grid_search(X_train, y_train, params)
                        best_model_params = params | best_model_params
                        
                        model = self.run_model(X_train, X_test, y_train, y_test, best_model_params)
                        X_test = X_test.to_numpy().reshape((X_test.shape[0], 1, X_test.shape[1]))
                        metrics = self.model_evaluation(X_test, y_test, model)
                        best_model_params = best_model_params | metrics
                        itrs.append(best_model_params | {"X_scaler": x_scaler, "y_scaler": y_scaler})
                        print(itrs[-1])
                        print("Test_Size=" + str(size) + " - Moving_Avg=" + str(ma_window) + " - Lags=" + str(i) + " - PCA=" + str(comp) + " - Metrics=" + str(metrics))
                    print("----------------------\n")

        params = self.get_best_params(itrs)
        print("Best params : " + str(params))
        return params
    
    def mlflow_input_example(self, X_test, model):
        input_example =  X_test[:1].values.reshape((1, 1, X_test.shape[1]))
        signature = mlflow.models.infer_signature(
            model_input=input_example,
            model_output=model.predict(input_example)
        )
        
        return signature, input_example
    
    def predict(self, alex, future_macro, params):
        future_macro_pca, future_macro = self.get_future_data(future_macro, params)
        (X_train, X_test, y_train, y_test, x_scaler, y_scaler) = self.process_alex_data_for_prediction(alex, params)
        
        (lower_bound, upper_bound, means_preds, q_labels) = self.get_ci_bounds(X_train, y_train, params, future_macro_pca, future_macro)
        self.get_ci_chart(lower_bound, upper_bound, means_preds, alex.attrs['area'], q_labels)
        
        self.save_ci_data(lower_bound, upper_bound, means_preds, q_labels)
        self.save_best_params(params)
        
    def process_alex_data_for_prediction(self, alex, params):
        alex_ = alex.copy()
        alex_ = self.perform_moving_average(alex_, params["Moving_Avg"])
        alex_ = self.perform_lags(alex_, params["Lags"])
        (X_train, X_test, y_train, y_test, x_scaler, y_scaler) = self.data_preprocessing(alex_, params["PCA"], params["Test_Size"])
        return (X_train, X_test, y_train, y_test, x_scaler, y_scaler)
        
    def get_ci_bounds(self, X_train, y_train, params, future_macro_pca, future_macro):
        (lower_bound, upper_bound, means_preds) = self.get_ci(X_train, y_train, params, future_macro_pca)
        q_labels = list(future_macro.index[-len(means_preds):])
        means_preds = list(means_preds)
        for i in range(len(means_preds)):
            print(q_labels[i] + " => (" + str(round(lower_bound[i], 2)) + ", " + str(round(upper_bound[i], 2)) + ") L.E.")       
        return (lower_bound, upper_bound, means_preds, q_labels)
        
    def get_future_data(self, future_macro, params):
        future_macro = self.perform_future_macro_lags(future_macro, params)
        future_macro = self.perform_future_macro_moving_avg(future_macro, params) if params["Moving_Avg"] else future_macro
        future_macro_pca, future_macro = self.perform_future_macro_preprocessing(future_macro, params)
        return future_macro_pca, future_macro
        
    def perform_future_macro_lags(self, future_macro, params):
        macro_test_lags = {}
        for col in future_macro.columns:
            for i in range(1, params["Lags"]):
                lag = col + "_lag_" + str(i)
                macro_test_lags[lag] = future_macro[col].shift(i)

        return pd.concat([future_macro, pd.concat(macro_test_lags, axis=1)], axis=1)
    
    def perform_future_macro_moving_avg(self, future_macro, params):
        for col in future_macro.columns:
            if col in ["Date", "Year", "Quarter"]:
                continue

            future_macro[col + "_ma"] = future_macro[col].rolling(window=params["Moving_Avg"]).mean()

        return future_macro
    
    def perform_future_macro_preprocessing(self, future_macro, params):
        future_macro.fillna(0, inplace=True)
        pca = PCA(n_components=params["PCA"])
        future_macro_pca = pca.fit_transform(future_macro.drop(["Year", "Quarter"], axis=1))

        df_pca = pd.DataFrame(future_macro_pca, columns=[f'pca_{i+1}' for i in range(future_macro_pca.shape[1])])
        future_macro_pca = pd.concat([future_macro[['Year', 'Quarter']].reset_index(drop=True), df_pca], axis=1)

        future_macro_pca.replace(0, np.nan, inplace=True)

        future_macro_pca = pd.DataFrame(params["X_scaler"].fit_transform(future_macro_pca),
                            columns=future_macro_pca.columns,
                            index=future_macro_pca.index)

        return (future_macro_pca, future_macro)
    
    def run_model_ci(self, X_train, y_train, params, future_data):
        raise NotImplementedError("Run model CI must be implemented by subclasses.")
    
    def get_ci(self, X, y, params, future_macro):
        (lower_bound, upper_bound, means_preds) = self.run_model_ci(X, y, params, future_macro)
        means_preds, lower_bound, upper_bound = means_preds.flatten() * 2.43, lower_bound.flatten() * 2.43, upper_bound.flatten() * 2.43
        return (lower_bound, upper_bound, means_preds)

    def get_ci_chart(self, lower_bound, upper_bound, means_preds, area, q_labels):
        plt.plot(means_preds, label='Mean Prediction')
        plt.xticks(ticks=range(len(means_preds)), labels=q_labels, rotation=30)
        plt.fill_between(range(len(means_preds)), lower_bound, upper_bound, alpha=0.3, label='Confidence Interval')
        plt.title(area)
        plt.legend()
        chart_path = self.save_at_path("chart.png")
        plt.savefig(chart_path, dpi=300, bbox_inches='tight')
        plt.show()

    def save_ci_data(self, lower_bound, upper_bound, means_preds, q_labels):
        forecast = pd.DataFrame()
        forecast["Date"] = q_labels
        forecast["Lower Bound"] = lower_bound
        forecast["Upper Bound"] = upper_bound
        forecast["Point Estimation"] = means_preds
        forecast_df_path = self.save_at_path("forecast.csv")
        forecast.to_csv(forecast_df_path)
        
    def save_best_params(self, params):
        params_to_save = {k: v for k, v in params.items() if k not in ['X_scaler', 'y_scaler']}
        params_path = self.save_at_path("params.json")
        with open(params_path, "w") as f:
            json.dump(params_to_save, f, indent=4)

    def save_at_path(self, filename):
        filename = self.area_name + "-" + filename
        return os.path.join(self.output_dir, filename)