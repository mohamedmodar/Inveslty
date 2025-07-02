from py.data.USDData import USDData
from py.models.ModelNN import ModelNN

currency = "USD"
gold = USDData(currency)
data = gold.get_usd_data()

print(gold.currency)

future_macro = gold.get_future_macro_data()
lstm = ModelNN(tag=currency, target=currency)
best_params = lstm.fit(data)
lstm.predict(data, future_macro, best_params)