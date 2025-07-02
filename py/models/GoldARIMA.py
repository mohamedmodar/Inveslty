from py.data.GoldData import GoldData
from py.models.ModelARIMA import ModelARIMA

k = "18k"
gold = GoldData(gold_k=k)
data = gold.get_gold_data()

print(gold.gold_k)

future_macro = gold.get_future_macro_data()
lstm = ModelARIMA(tag=k, target=k)
best_params = lstm.fit(data)
lstm.predict(data, future_macro, best_params)
