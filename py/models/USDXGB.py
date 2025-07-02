from py.data.USDData import USDData
from py.models.ModelXGB import ModelXGB

currency = "USD"
usd = USDData(currency)
data = usd.get_usd_data()
print(usd.currency)
data.to_csv("goldxgb_data.csv")

future_macro = usd.get_future_macro_data()
xgb = ModelXGB(tag=currency, target=currency)
best_params = xgb.fit(data)
xgb.predict(data, future_macro, best_params)