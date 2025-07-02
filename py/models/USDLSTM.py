from py.data.USDData import USDData
from py.models.ModelLSTM import ModelLSTM

currency = "USD"
usd = USDData(currency)
data = usd.get_usd_data()
print(usd.currency)

future_macro = usd.get_future_macro_data()
lstm = ModelLSTM(tag=currency, target=currency)
best_params = lstm.fit(data)
lstm.predict(data, future_macro, best_params)