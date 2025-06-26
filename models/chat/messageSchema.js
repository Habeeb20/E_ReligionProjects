import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);



