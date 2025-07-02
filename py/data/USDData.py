import pandas as pd
import numpy as np

class USDData():
    
    def __init__(self, currency):    
        self.currency = currency
    
    def load_data(self):
        macro = pd.read_csv("py\\datasets\\data\\macro_timeseries\\macrodata_timeseries_v2_imputed_2009_2024.csv", index_col=0)
        usd = pd.read_csv("py\\datasets\\data\\usd\\usd_historical_1991.csv", index_col=0)
        return macro, usd

    def preprocess_data(self, macro, usd):
        usd = usd[[self.currency, "Date"]]
        usd = self.merge_usd_macro(macro, usd)
        usd = usd.drop(["Aqarmap's Index", "EGY-GDP's Real Estate Activitie"], axis=1)
        usd.attrs['currency'] = self.currency

        return usd
    
    def merge_usd_macro(self, macro, usd):
        usd = pd.merge(macro, usd, on="Date", how="left")
        usd['Year'] = usd['Date'].str[:4]
        usd['Quarter'] = usd['Date'].str[5:].astype(int)
        usd = usd.drop_duplicates(subset=["Date"]).reset_index(drop=True)
        
        return usd
    
    def get_usd_data(self):
        macro, usd = self.load_data()
        return self.preprocess_data(macro, usd)
    
    def get_future_macro_data(self):
        future_macro = pd.read_csv("py\\datasets\\data\\macro_timeseries\\macrodata_timeseries_forecast_2025_2028.csv")
        future_macro = future_macro.rename(columns={"Real Estate Activitie":"Egypt's Real Estate Activities (GDP) (Millions EGP)",
                                "Points":"Aqarmap Index"})
        future_macro = future_macro.drop(["Aqarmap's Index", "EGY-GDP's Real Estate Activitie"], axis=1)

        future_macro = future_macro.set_index('Date')
        future_macro.index = future_macro.index.astype(str)
        future_macro.index.name = "Date"
        
        future_macro['Year'] = future_macro.index.str[:4].astype(int)
        future_macro['Quarter'] = future_macro.index.str[5:].astype(int)

        return future_macro
