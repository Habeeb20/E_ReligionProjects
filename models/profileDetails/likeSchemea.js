
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Like', likeSchema);