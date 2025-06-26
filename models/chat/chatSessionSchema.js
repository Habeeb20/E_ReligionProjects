import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },

  paymentReference: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ChatSession', chatSessionSchema);