const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED'], default: 'PENDING' },
  paymentMethod: { type: String, default: 'SIMULATED' },
  transactionId: { type: String },
}, { timestamps: true });

const escrowSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalAmount: { type: Number, default: 0 },
  fundedAmount: { type: Number, default: 0 },
  releasedAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['UNFUNDED','PARTIALLY_FUNDED','FUNDED','RELEASED','DISPUTED'], default: 'UNFUNDED' },
}, { timestamps: true });

module.exports = {
  Payment: mongoose.model('Payment', paymentSchema),
  Escrow: mongoose.model('Escrow', escrowSchema),
};
