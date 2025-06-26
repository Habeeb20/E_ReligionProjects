import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Paystack', 'Bank Account', 'Other'], required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
});

export default mongoose.model('Transaction', transactionSchema);