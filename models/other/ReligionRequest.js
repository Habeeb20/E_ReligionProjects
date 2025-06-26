// models/other/ReligionRequest.js
import mongoose from 'mongoose';

const religionRequestSchema = new mongoose.Schema({
  religion: { type: String, required: true },
  state: { type: String, required: true },
  LGA: { type: String, required: true },
  phone: { type: String, required: true },
  requestDate: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.model('ReligionRequest', religionRequestSchema);