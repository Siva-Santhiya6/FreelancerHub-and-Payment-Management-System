const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  skills: [{ type: String }],
  budget: { type: Number, required: true },
  deadline: { type: Date },
  teamSize: { type: Number, default: 1 },
  status: { type: String, enum: ['OPEN','IN_PROGRESS','COMPLETED','CANCELLED','ON_HOLD'], default: 'OPEN' },
  healthStatus: { type: String, enum: ['HEALTHY','AT_RISK','CRITICAL'], default: 'HEALTHY' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  proposalIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }],
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  milestoneIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
