import os
import pandas as pd
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from sklearn.linear_model import BayesianRidge
import numpy as np

class TimeSeries():
    
    def __init__(self):    
        # gather data from all the files
        (self.alex_prices_5_years, self.alex_prices_2_years, self.alex_prices_1_years) = self.get_all_alex_areas_prices()
        # extract timestamps of each prices period
        self.timestamps_5 = self.alex_prices_5_years.columns[2:]
        self.timestamps_2 = self.alex_prices_2_years.columns[2:]
        self.timestamps_1 = self.alex_prices_1_years.columns[2:]
        # get the name of all the areas
        self.areas = list(set(self.alex_prices_5_years["Area"]))

    def clean_prices(self, price):
        # clean prices columns by removing "EGP" and making them int
        return price.replace(',', '').split(" ")[1] if (len(price.split(" ")) > 1) else 0

    def process_price_columns_by_year(self, alex_prices_x_years):
        timestamps = alex_prices_x_years.columns[2:]
        for year in timestamps:
            alex_prices_x_years[year] = alex_prices_x_years[year].apply(self.clean_prices)
            alex_prices_x_years[year] = alex_prices_x_years[year].astype(int)
        return alex_prices_x_years

    def extract_x_years(self, x_years_csv):
        alex_prices_x_years = pd.read_csv(x_years_csv)
        
        # edit the title of hay sharq
        alex_prices_x_years.loc[alex_prices_x_years["Area"] == "Hay Sharq", "Area"] = "hay-sharq"
        
        # remove alexandria-compounds from dataset
        alex_prices_x_years = alex_prices_x_years[alex_prices_x_years['Area'] != 'alexandria-compounds']
        
        # go over timestamps and clean prices
        alex_prices_x_years = self.process_price_columns_by_year(alex_prices_x_years)
        
        # remove 1 and bigger than 4 bedrooms prices
        alex_prices_x_years = alex_prices_x_years[alex_prices_x_years["Bedrooms No."] > 1]
        alex_prices_x_years = alex_prices_x_years[alex_prices_x_years["Bedrooms No."] < 4]
            
        return alex_prices_x_years

    def get_all_alex_areas_prices(self):
        alex_prices_5_years = self.extract_x_years("py\\datasets\\areas-x-years\\Alexandria Areas - 5Y.csv")
        alex_prices_2_years = self.extract_x_years("py\\datasets\\areas-x-years\\Alexandria Areas - 2Y.csv")
        alex_prices_1_years = self.extract_x_years("py\\datasets\\areas-x-years\\Alexandria Areas - 1Y.csv")
        return (alex_prices_5_years, alex_prices_2_years, alex_prices_1_years)
    
    def get_mean_prices_for_each_area(self):
        areas_df_list = []
        for area in self.areas:
            # 5 years prices
            alex_prices_5y_transpose_mean_q = self.get_area_mean_prices(area, self.alex_prices_5_years, self.timestamps_5)
            
            # 2 years prices
            alex_prices_2y_transpose_mean_q = self.get_area_mean_prices(area, self.alex_prices_2_years, self.timestamps_2)

            # 1 year prices
            alex_prices_1y_transpose_mean_q = self.get_area_mean_prices(area, self.alex_prices_1_years, self.timestamps_1)
            
            # merge area prices
            area_prices = self.merge_area_prices(
                alex_prices_1y_transpose_mean_q, alex_prices_2y_transpose_mean_q, alex_prices_5y_transpose_mean_q
            )

            areas_sorted = self.sort_area_prices_by_date(area, area_prices)
            areas_df_list.append(areas_sorted)
                        
            self.save_as_csv(areas_sorted, "areas-timeseries", (area + "-timeseries.csv"))
            print(area, " saved")
            
        return areas_df_list
            
    def get_area_mean_prices(self, area, prices, timestamps):
        alex_prices_xy_transpose = self.transpose_timestamps(area, prices, timestamps)
        alex_prices_xy_transpose_mean = self.transposed_timestamps_mean(alex_prices_xy_transpose)
        alex_prices_xy_transpose_mean_q = self.change_date_to_quarter(alex_prices_xy_transpose_mean)
        return alex_prices_xy_transpose_mean_q
        
    def transpose_timestamps(self, area, prices_x_years, timestamps):
        return prices_x_years[self.alex_prices_5_years["Area"] == area].T.loc[timestamps]
    
    def transposed_timestamps_mean(self, timestamps_t):
        timestamps_t_mean = timestamps_t.T.mean().reset_index()
        timestamps_t_mean.columns = ["Date", "Price Per Meter"]
        timestamps_t_mean = timestamps_t_mean.drop_duplicates(subset=["Price Per Meter"], keep='last')
        return timestamps_t_mean
    
    def change_date_to_quarter(self, timestamps_t_mean):
        date_sample = list(timestamps_t_mean["Date"])[0]
        if len(date_sample.split(" ")) == 1: # timestamps like 2025, 2024
            timestamps_t_mean['Date'] = timestamps_t_mean['Date'].astype(str) + 'Q4'
            timestamps_t_mean_q = timestamps_t_mean.rename(columns={timestamps_t_mean.columns[1]: 'Price Per Meter'})
        else: # timestamps like Jul 2024, Mar 2022
            timestamps_t_mean['Date'] = pd.to_datetime(timestamps_t_mean['Date'], format='%b %Y')
            timestamps_t_mean_q = timestamps_t_mean.groupby(timestamps_t_mean['Date'].dt.to_period('Q').astype(str))['Price Per Meter'].mean().reset_index()
        return timestamps_t_mean_q
        
    def merge_area_prices(self, prices_1y_transpose_mean_q, prices_2y_transpose_mean_q, prices_5y_transpose_mean_q):
        area_prices = pd.concat([prices_2y_transpose_mean_q, prices_5y_transpose_mean_q], axis=0)
        area_prices = pd.concat([area_prices, prices_1y_transpose_mean_q], axis=0)
        return area_prices
    
    def sort_area_prices_by_date(self, area, area_prices):
        area_prices_sorted = area_prices.sort_values(by='Price Per Meter', na_position='last')
        area_prices_sorted = area_prices_sorted.drop_duplicates(subset=['Date'], keep='first')
        area_prices_sorted = area_prices_sorted.sort_values(by='Date').reset_index(drop = True)
        area_prices_sorted = area_prices_sorted.rename(columns={area_prices.columns[1]: area})
        area_prices_sorted = pd.DataFrame({area: area_prices_sorted[area], "Date": area_prices_sorted["Date"]})
        
        return area_prices_sorted
    
    def save_as_csv(self, df, folder, file):
        folder_path = "py\\datasets\\data\\" + folder
        file_path = os.path.join(folder_path, file)
        os.makedirs(folder_path, exist_ok=True)
        df.to_csv(file_path)
        
    def impute_timeseries(self, areas_df_list):
        alex_prices = self.merge_areas_timeseries(areas_df_list)
        
        macro = pd.read_csv("py\\datasets\\macro\\macroeconomics.csv", index_col=0)
        
        alex_prices = self.normalize_prices(alex_prices)
        
        imputed_areas = self.impute_each_area(alex_prices, macro)
        
        self.save_as_csv(imputed_areas, "imputed_area_timeseries", "ppm_2017_2024_areas.csv")
        
        print("Areas timeseries has been imputed")
        
        return imputed_areas
    
    def impute_each_area(self, alex_prices, macro):
        areas_df = []
        areas = alex_prices.drop(["Date"], axis=1).columns
        timeseries_timestamps = pd.date_range("2017-01-01", freq="QE-DEC", periods=32).to_period('Q')
        for area in areas:
            alex_prices_to_impute = alex_prices[[area, "Date"]].replace(0, np.nan)
            areas_macro = pd.merge(alex_prices_to_impute, macro, on='Date', how='outer').drop_duplicates(subset=["Date"]).reset_index(drop=True)
            prices_imputed = self.impute(areas_macro)
            areas_df.append(pd.Series(list(prices_imputed[area]), name=area))
            
        combined_imputed_areas = pd.concat(areas_df, axis=1)
        combined_imputed_areas["Date"] = timeseries_timestamps
        return combined_imputed_areas
    
    def normalize_prices(self, alex_prices):
        alex_prices["hay-gharb"] = alex_prices[['hay-gharb', 'hay-el-gomrok', 'hay-al-agami']].mean(axis=1)
        alex_prices["hay-sharq"] = alex_prices[['hay-sharq', 'hay-awal-el-montazah', "hay-than-el-montazah", 'hay-wasat', "hay-el-gomrok"]].mean(axis=1)
        alex_prices['hay-al-amereyah'] = alex_prices[['hay-al-amereyah', 'hay-al-agami', "hay-gharb", "hay-awal-el-montazah"]].mean(axis=1)
        alex_prices['hay-than-el-montazah'] = alex_prices[['hay-than-el-montazah', "hay-awal-el-montazah"]].mean(axis=1)
        alex_prices.loc[:15, "hay-el-gomrok"] = alex_prices.iloc[:16][['hay-el-gomrok', 'hay-wasat', "hay-gharb"]].mean(axis=1)
        return alex_prices
    
    def impute(self, data):
        imp = IterativeImputer(max_iter=50, random_state=0)
        X = data.drop('Date', axis=1)
        prices_imputed = pd.DataFrame(imp.fit_transform(X), columns=X.columns)
        
        prices_imputed = np.clip(prices_imputed, 0, None)
        
        prices_imputed["Date"] = data["Date"]
        return prices_imputed
    
    def merge_areas_timeseries(self, areas_df_list):
        alex_prices = pd.concat(areas_df_list, axis=1)
        alex_prices = alex_prices.loc[:, ~alex_prices.columns.duplicated()]
        return alex_prices
        
time = TimeSeries()
areas_df_list = time.get_mean_prices_for_each_area()
imputed_timeseris = time.impute_timeseries(areas_df_list)