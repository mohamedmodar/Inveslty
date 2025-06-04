import pandas as pd
import glob
import os
import json
import re 

class AreasModelsDetails:
    def __init__(self, model_name):
        self.model_name = model_name
        self.models_details = self.load_model_details(self.model_name)

    def load_model_details(self, model_name):
        params = self.read_params_files(model_name)
        params['area'] = params['area'].apply(self.clean_area_name)
        params = self.rearrange_columns(params)
        return params
    
    def read_params_files(self, model_name):
        folder_path = f'py\\datasets\\data\\model_outputs_V7\\{model_name}'

        params_list = []
        for root, _, files in os.walk(folder_path):
            for file in files:
                if file.lower().endswith(".json"):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            data = json.load(f)
                        params = pd.DataFrame([data])
                        area_name = os.path.basename(file_path).replace('.json', '')
                        params['area'] = area_name
                        params_list.append(params)    
                    except Exception as e:
                        print(f"Error reading {file_path}: {e}")
                        
                if file.lower().endswith(".csv"):
                    file_path = os.path.join(root, file)
                    try:
                        area_prices = pd.read_csv(file_path, index_col=0)
                        area_prices["Width"] = (area_prices["Upper Bound"] - area_prices["Lower Bound"]).mean()
                    except Exception as e:
                        print(f"Error reading {file_path}: {e}")
        
        df = pd.concat(params_list, ignore_index=True)
        df["Width"] = area_prices["Width"]
        return df
                
    def clean_area_name(self, area):
        area = area.replace('-params', '')
        area = re.sub(r'\s*\(\d+\)', '', area)
        area = area.replace('-', ' ')
        
        return area.strip()
    
    def rearrange_columns(self, params):
        cols = ['area'] + [col for col in params.columns if col != 'area' and col != 'R2'] + ["R2"]
        params = params[cols]

        return params

details = AreasModelsDetails(model_name='LSTM')
print("LSTM")
print(details.models_details)
print("*******************")

details = AreasModelsDetails(model_name='XGBOOST')
print("XGBOOST")
print(details.models_details)
print("*******************")

details = AreasModelsDetails(model_name='SARIMAX')
print("SARIMAX")
print(details.models_details)
print("*******************")

details = AreasModelsDetails(model_name='NN')
print("NN")
print(details.models_details)
print("*******************")