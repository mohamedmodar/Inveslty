import pandas as pd

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

            area_prices_sorted = area_prices.sort_values(by='Price Per Meter', na_position='last')
            area_prices = area_prices_sorted.drop_duplicates(subset=['Date'], keep='first')
            area_prices = area_prices.sort_values(by='Date').reset_index(drop = True)
            area_prices = area_prices.rename(columns={area_prices.columns[1]: area})
            area_prices = pd.DataFrame({area: area_prices[area], "Date": area_prices["Date"]})
            areas_df_list.append(area_prices)
            area_prices_path = area + "-time-series.csv"
            area_prices.to_csv(area_prices_path)
            print(area_prices_path + " Saved")
            
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
    
    def change_date_to_quarter(self, timestamps_t_mean, years):
        date_sample = list(timestamps_t_mean["Date"])[0]
        if date_sample.split(" ") == 1: # timestamps like 2025, 2024
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