from py.data.GoldData import GoldData
from py.models.ModelLSTM import ModelLSTM

gold = GoldData(gold_k="18k")
data = gold.get_gold_data()

print(gold.gold_k)

future_macro = gold.get_future_macro_data()
lstm = ModelLSTM(tag="18k", target="18k")
best_params = lstm.fit(data)
lstm.predict(data, future_macro, best_params)
