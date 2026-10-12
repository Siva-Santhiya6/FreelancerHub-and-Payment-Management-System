const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  estimatedDuration: { type: String },
  status: { type: String, enum: ['DRAFT','SUBMITTED','SHORTLISTED','ACCEPTED','REJECTED'], default: 'SUBMITTED' },
  matchScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
