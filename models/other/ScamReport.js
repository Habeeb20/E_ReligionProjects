import mongoose from "mongoose";

const scamReportSchema = new mongoose.Schema({
  complaints: {
    type: String,
    required: true,
    trim: true,
  },
  observations: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfIncident: {
    type: Date,
    required: true,
  },
  reportDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});


export default mongoose.model('ScamReport', scamReportSchema);
