import pandas as pd
import os
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from sklearn.linear_model import BayesianRidge
import numpy as np
import warnings
warnings.filterwarnings("ignore")

class Macroeconomics():
    
    def __init__(self, start_at_year):
        # Gross Domestic Product
        self.gdp = self.load_gdp(start_at_year)
        # Domestic Liquidity and Money Supply
        self.dl = self.load_dl(start_at_year)
        # Inflation Rate, Aqarmap Points, Alexandria's GDP
        self.other_factors = self.load_other_factors()
        # Aqarmap's real-estate points 
        self.aqarmap = self.load_aqarmap(start_at_year)
        # merge macro data
        self.macro = self.merge_macro_data()
        
        print(self.aqarmap)
    
    def load_gdp(self, start_at_year):
        gdp = pd.read_csv("py\\datasets\\macro-factors\\Gross Domestic Product.csv")
        gdp = gdp[gdp["Sector"] == "Total"]
        gdp = self.arrange_date_gdp(gdp, start_at_year)
        return gdp
        
    def arrange_date_gdp(self, gdp, start_at_year):
        gdp["Year"] = gdp["Year"].str.split("/").str[0]
        gdp["Year"] = gdp["Year"].astype(int)
        gdp = gdp[gdp["Year"] >= start_at_year]
        gdp["Year"] = gdp["Year"].astype(str)
        gdp["Date"] = pd.PeriodIndex(gdp["Year"] + gdp["Quarter"], freq="Q")
        gdp = gdp[["Real Estate Activitie", "Date"]]
        gdp = gdp.reset_index(drop=True)
        gdp["Date"] = pd.PeriodIndex(gdp["Date"], freq="Q-DEC")
        gdp = gdp[["Real Estate Activitie", "Date"]]
        return gdp
    
    def load_dl(self, start_at_year):
        dl = pd.read_csv("py\\datasets\\macro-factors\\Domestic Liquidity.csv")
        dl = self.clean_dl(dl, start_at_year)
        dl = self.arrange_date_dl(dl)
        return dl
    
    def clean_dl(self, dl, start_at_year):
        dl = dl.T.reset_index(drop=True)
        dl.columns = dl.iloc[0]
        dl = dl[1:].reset_index(drop=True)
        dl = dl[list(dl.columns[3:7])]
        dl = dl[2:].reset_index(drop=True)
        
        dl["End of"] = dl["End of"].astype(int)
        dl = dl[dl["End of"] >= start_at_year].reset_index(drop=True)
        dl.columns = ["Year", "NaN", "NaN", "Month", "Domestic Liquidity", "Money Supply"]
        dl = dl.drop(["NaN"], axis=1)
        
        dl["Domestic Liquidity"] = dl["Domestic Liquidity"].astype(int)
        dl["Money Supply"] = dl["Money Supply"].astype(int)
        
        return dl
    
    def arrange_date_dl(self, dl):
        def clean_months(month):
            month = month
            if "." not in month:
                return month[:3]
            return month

        dl["Month"] = dl["Month"].apply(clean_months)
        dl["Month"] = dl["Month"].str.replace(r"\.$", "", regex=True)
        dl["Month"] = pd.to_datetime(dl["Month"], format="%b", errors="coerce").dt.month
        dl["Month"] = dl["Month"].fillna(9).astype(int)
        dl["Date"] = pd.to_datetime(dl[["Year", "Month"]].astype(str).agg("-".join, axis=1)).dt.to_period("Q")
        dl = dl.groupby("Date")[["Domestic Liquidity", "Money Supply"]].mean().reset_index()
                
        return dl
    
    def load_other_factors(self):
        other_factors = pd.read_csv("py\\datasets\\macro-factors\\alex_ppm_ir_aqarmap_points_alexgdp.csv", index_col=0)
        other_factors["Date"] = pd.PeriodIndex(other_factors["Date"], freq="Q-DEC")
        
        return other_factors
    
    def load_aqarmap(self, start_at_year):
        aqarmap_indx = pd.read_csv("py\\datasets\\macro-factors\\aqarmap_price_index.csv")
        aqarmap_indx['Date'] = pd.to_datetime(aqarmap_indx['Year'].astype(str) + '-' + aqarmap_indx['Month'].astype(str))

        aqarmap_indx = aqarmap_indx.groupby(aqarmap_indx['Date'].dt.to_period('Q'))['Points'].mean().reset_index()
        aqarmap_indx = self.arrange_date_aqarmap(aqarmap_indx, start_at_year)
        
        return aqarmap_indx
    
    def arrange_date_aqarmap(self, aqarmap_indx, start_at_year):
        start_period = pd.Period((str(start_at_year) + 'Q1'), freq='Q')
        end_period = pd.Period('2024Q4', freq='Q')

        aqarmap_indx = aqarmap_indx[(aqarmap_indx['Date'] >= start_period) & (aqarmap_indx['Date'] <= end_period)].reset_index(drop=True)
        return aqarmap_indx
    
    def merge_macro_data(self):
        macro = pd.merge(self.other_factors, self.dl, on="Date", how="left")
        macro = pd.merge(macro, self.gdp, on="Date", how="left")
        macro = macro.drop(["Price Per Meter"], axis=1)
        return macro
    
    def impute_macro_data(self, macro):
        timestamps = macro["Date"]
        macro = macro.drop(["Date"], axis=1)
        imputer = IterativeImputer(max_iter=10, random_state=0)
        macro = pd.DataFrame(imputer.fit_transform(macro), columns=macro.columns)
        macro["Date"] = timestamps
        return macro
        
macro = Macroeconomics(start_at_year=2017)