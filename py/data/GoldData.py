import pandas as pd
import numpy as np

class GoldData():
    
    def __init__(self, gold_k):    
        self.gold_k = gold_k
    
    def load_data(self):
        macro = pd.read_csv("py\\datasets\\data\\macro_timeseries\\macrodata_timeseries_imputed_2009_2024.csv", index_col=0)
        gold = pd.read_csv("py\\datasets\\data\\gold_timeseries\\gold_prices_1998_2025_24k_21k_18k.csv", index_col=0)
        return macro, gold

    def preprocess_data(self, macro, gold):
        gold = gold[[self.gold_k, "Date"]]
        gold = self.merge_gold_macro(macro, gold)
        gold.attrs['k'] = self.gold_k
        
        return gold
    
    def merge_gold_macro(self, macro, gold):
        gold = pd.merge(macro, gold, on="Date", how="left")
        gold['Year'] = gold['Date'].str[:4]
        gold['Quarter'] = gold['Date'].str[5:].astype(int)
        gold = gold.drop_duplicates(subset=["Date"]).reset_index(drop=True)
        
        return gold
    
    def get_gold_data(self):
        macro, gold = self.load_data()
        return self.preprocess_data(macro, gold)
    
    def get_future_macro_data(self):
        future_macro = pd.read_csv("py\\datasets\\data\\macro_timeseries\\macrodata_timeseries_forecast_2025_2028.csv")
        future_macro = future_macro.rename(columns={"Real Estate Activitie":"Egypt's Real Estate Activities (GDP) (Millions EGP)",
                                "Points":"Aqarmap Index"})
        
        future_macro = future_macro.set_index('Date')
        future_macro.index = future_macro.index.astype(str)
        future_macro.index.name = "Date"
        
        future_macro['Year'] = future_macro.index.str[:4].astype(int)
        future_macro['Quarter'] = future_macro.index.str[5:].astype(int)

        return future_macro
