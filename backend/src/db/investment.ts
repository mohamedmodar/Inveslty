import mongoose from 'mongoose';

const InvestmentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investment_goal: { type: String, required: true },
  risk_tolerance: { type: String, required: true },
  time_horizon: { type: String, required: true },
  liquidity: { type: String, required: true },
  investment_capital: { type: Number, required: true },
  priority: { type: String, required: true },
  experience: { type: String, required: true },
  return_type: { type: String, required: true },
  additional_requests: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export const InvestmentProfileModel = mongoose.model('InvestmentProfile', InvestmentProfileSchema);

export const createInvestmentProfile = (values: Record<string, any>) =>
  new InvestmentProfileModel(values).save().then((profile) => profile.toObject());

export const getInvestmentProfileByUserId = (userId: string) : Promise<any> => InvestmentProfileModel.findOne({ userId }); 