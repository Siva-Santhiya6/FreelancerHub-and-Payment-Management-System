const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  budget: { type: Number, required: true },
  deadline: { type: Date },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: {
    type: String,
    enum: ['NOT_STARTED','IN_PROGRESS','SUBMITTED','UNDER_REVIEW','REVISION_REQUIRED','APPROVED','COMPLETED'],
    default: 'NOT_STARTED'
  },
  assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deliverables: [{ type: String }],
  comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
