import pandas as pd
import numpy as np

class AlexandriaData():
    
    def __init__(self, area_idx):    
        self.area_idx = area_idx
        self.area_name = None
    
    def load_data(self):
        macro = pd.read_csv("py\\datasets\\data\\macro_timeseries\\macrodata_timeseries_imputed_2017_2024.csv", index_col=0)
        areas_prices = pd.read_csv("py\\datasets\\data\\imputed_area_timeseries\\ppm_2017_2024_areas.csv", index_col=0)
        return macro, areas_prices

    def preprocess_data(self, macro, areas_prices):
        areas = areas_prices.columns
        area = areas[self.area_idx]
        areas_prices = areas_prices.reset_index()
        areas_prices = areas_prices[[area, "Date"]]
        areas_prices = areas_prices.melt(id_vars='Date', var_name='Area', value_name='Price Per Meter')

        alex = self.merge_alex_prices(macro, areas_prices)
        alex.attrs['area'] = area
        self.area_name = area

        # alex = alex.dropna(subset=['Inflation Rate (Core)'])
        
        return alex
    
    def merge_alex_prices(self, macro, areas_prices):
        alex = pd.merge(macro, areas_prices, on="Date", how="left")
        alex = alex.drop(["Area"], axis=1)
        alex = alex.dropna(subset=['Price Per Meter'])
        alex['Year'] = alex['Date'].str[:4]
        alex['Quarter'] = alex['Date'].str[5:].astype(int)
        alex = alex.drop_duplicates(subset=["Date"]).reset_index(drop=True)
        
        return alex
    
    def get_area_data(self):
        macro, areas_prices = self.load_data()
        return self.preprocess_data(macro, areas_prices)
    
    def get_future_macro_data(self):
        future_macro = pd.read_csv("py\\datasets\\data\\macro_timeseries\\macrodata_timeseries_forecast_2025_2028.csv")
        # future_macro = future_macro.dropna(subset=['Inflation Rate (Core)'])
        future_macro = future_macro.rename(columns={"Real Estate Activitie":"Egypt's Real Estate Activities (GDP) (Millions EGP)",
                                "Points":"Aqarmap Index"})
        
        future_macro = future_macro.set_index('Date')
        future_macro.index = future_macro.index.astype(str)
        future_macro.index.name = "Date"
        
        future_macro['Year'] = future_macro.index.str[:4].astype(int)
        future_macro['Quarter'] = future_macro.index.str[5:].astype(int)

        return future_macro
