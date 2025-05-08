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
        self.start_at_year = start_at_year
        # Gross Domestic Product
        self.gdp = self.load_gdp()
        # Domestic Liquidity and Money Supply
        self.dl = self.load_dl()
        # Aqarmap's real-estate points 
        self.aqarmap = self.load_aqarmap()
        # # Alexandria's GDP
        # self.alex_gdp = self.load_alex_gdp()
        # Inflation Rate
        self.inflation_rate = self.load_inflation_rate()
        # merge macro data
        self.macro = self.merge_macro_data()
            
    def load_gdp(self):
        gdp = pd.read_csv("py\\datasets\\macro-factors\\Gross Domestic Product.csv")
        gdp = gdp[gdp["Sector"] == "Total"]
        gdp = self.arrange_date_gdp(gdp)
        gdp.columns = ["EGY-GDP's " + name if name != "Date" else name for name in gdp.columns]
        return gdp
        
    def arrange_date_gdp(self, gdp):
        gdp["Year"] = gdp["Year"].str.split("/").str[0]
        gdp["Year"] = gdp["Year"].astype(int)
        gdp = gdp[gdp["Year"] >= self.start_at_year]
        gdp["Year"] = gdp["Year"].astype(str)
        gdp["Date"] = pd.PeriodIndex(gdp["Year"] + gdp["Quarter"], freq="Q")
        gdp = gdp[["Real Estate Activitie", "Real Estate Ownership","Business Services",  "Date"]]
        gdp = gdp.reset_index(drop=True)
        gdp["Date"] = pd.PeriodIndex(gdp["Date"], freq="Q-DEC")
        gdp = gdp[["Real Estate Activitie", "Date"]]
        return gdp
    
    def load_dl(self):
        dl = pd.read_csv("py\\datasets\\macro-factors\\Domestic Liquidity.csv")
        dl = self.clean_dl(dl)
        dl = self.arrange_date_dl(dl)
        return dl
    
    def clean_dl(self, dl):
        dl = dl.T.reset_index(drop=True)
        dl.columns = dl.iloc[0]
        dl = dl[1:].reset_index(drop=True)
        dl = dl[list(dl.columns[3:7])]
        dl = dl[2:].reset_index(drop=True)
        
        dl["End of"] = dl["End of"].astype(int)
        dl = dl[dl["End of"] >= self.start_at_year].reset_index(drop=True)
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
    
    def load_aqarmap(self):
        aqarmap_indx = pd.read_csv("py\\datasets\\macro-factors\\Aqarmap Index.csv")
        aqarmap_indx = aqarmap_indx[aqarmap_indx["Points"] > 10]
        aqarmap_indx['Date'] = pd.to_datetime(aqarmap_indx['Year'].astype(str) + '-' + aqarmap_indx['Month'].astype(str))

        aqarmap_indx = aqarmap_indx.groupby(aqarmap_indx['Date'].dt.to_period('Q'))['Points'].mean().reset_index()
        aqarmap_indx = self.arrange_date_aqarmap(aqarmap_indx)
        
        aqarmap_indx = aqarmap_indx.rename(columns={"Points": "Aqarmap's Index"})
        
        return aqarmap_indx
    
    def arrange_date_aqarmap(self, aqarmap_indx):
        start_period = pd.Period((str(self.start_at_year) + 'Q1'), freq='Q')
        end_period = pd.Period('2024Q4', freq='Q')

        aqarmap_indx = aqarmap_indx[(aqarmap_indx['Date'] >= start_period) & (aqarmap_indx['Date'] <= end_period)].reset_index(drop=True)
        return aqarmap_indx
    
    def load_alex_gdp(self):
        alex_gdp = pd.read_csv("py\\datasets\\macro-factors\\Alexandria's GDP.csv")

        alex_gdp = alex_gdp[["Year", "Real Estate Ownership", "Total Governorate GDP"]]        
        alex_gdp = self.arrange_date_alex_gdp(alex_gdp)
        
        alex_gdp = alex_gdp.rename(columns={"Real Estate Ownership": "Alexandria's Real Estate Ownership", "Total Governorate GDP": "Alexandria's GDP"})
        
        return alex_gdp
        
    def arrange_date_alex_gdp(self, alex_gdp):
        alex_gdp['Date'] = alex_gdp['Year'].apply(lambda x: x.split('/')[1])
        alex_gdp['Date'] = alex_gdp['Date'].astype(int)
        alex_gdp = alex_gdp[alex_gdp["Date"] >= self.start_at_year]
        alex_gdp["Date"] = alex_gdp["Date"].astype(str) + "Q4"
        alex_gdp = alex_gdp.drop(["Year"], axis=1)
        alex_gdp['Date'] = pd.PeriodIndex(alex_gdp['Date'], freq='Q-DEC')
        return alex_gdp
    
    def load_inflation_rate(self):
        inflation_rate = pd.read_excel("py\\datasets\\macro-factors\\Inflations Historical.xlsx", header=1)
        inflation_rate = inflation_rate[["Date", "Core (m/m)"]]
        inflation_rate = inflation_rate.dropna()
        inflation_rate["Core (m/m)"] = inflation_rate["Core (m/m)"].str.replace("%", "").astype(float)
        
        inflation_rate = self.arrange_date_inflation_rate(inflation_rate)
        inflation_rate = inflation_rate.rename(columns={"Core (m/m)": "Inflation Rate (Core)"})
        return inflation_rate
    
    def arrange_date_inflation_rate(self, inflation_rate):
        start_period = pd.Period((str(self.start_at_year) + 'Q1'), freq='Q')
        end_period = pd.Period('2024Q4', freq='Q')
        inflation_rate['Date'] = pd.to_datetime(inflation_rate['Date'], format='%b %Y')
        inflation_rate = inflation_rate.groupby(inflation_rate['Date'].dt.to_period('Q'))['Core (m/m)'].apply(lambda x: (1 + x).prod() - 1).reset_index()
        inflation_rate = inflation_rate[(inflation_rate['Date'] >= start_period) & (inflation_rate['Date'] <= end_period)].reset_index(drop=True)

        return inflation_rate
            
    def merge_macro_data(self):
        macro = pd.merge(self.gdp, self.dl, on="Date", how="left")
        # macro = pd.merge(macro, self.alex_gdp, on="Date", how="left")
        macro = pd.merge(macro, self.aqarmap, on="Date", how="left")
        macro = pd.merge(macro, self.inflation_rate, on="Date", how="left")
        macro = macro.sort_values(by='Date').reset_index(drop=True)

        return macro
    
    def impute_macro_data(self, macro):
        timestamps = macro["Date"]
        macro = macro.drop(["Date"], axis=1)
        imputer = IterativeImputer(max_iter=10, random_state=0)
        macro = pd.DataFrame(imputer.fit_transform(macro), columns=macro.columns)
        macro["Date"] = timestamps
        return macro
    
    def get_macro(self):
        return self.macro
    
    def save_macro_data(self, macro_data, title):
        folder_path = "py\\datasets\\data\\macro_timeseries"
        file_path = os.path.join(folder_path, ("macrodata_timeseries_" + title + "_" + str(self.start_at_year) + "_2024.csv"))
        os.makedirs(folder_path, exist_ok=True)
        macro_data.to_csv(file_path)
        print("Macroeconomic time series is saved !")
            
macro = Macroeconomics(start_at_year=2017)
macro.save_macro_data(macro.get_macro(), "og")

macro_imp = macro.impute_macro_data(macro.get_macro())
macro.save_macro_data(macro_imp, "imputed")
