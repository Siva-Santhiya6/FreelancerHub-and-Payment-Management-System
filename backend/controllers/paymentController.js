const { Payment, Escrow } = require('../models/Payment');
const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const { Notification } = require('../models/Review');

// POST /api/payments/escrow/fund
const fundEscrow = async (req, res) => {
  try {
    const { projectId, amount } = req.body;
    let escrow = await Escrow.findOne({ projectId });

    if (!escrow) {
      escrow = await Escrow.create({ projectId, clientId: req.user._id, totalAmount: amount, fundedAmount: amount, pendingAmount: amount, status: 'FUNDED' });
    } else {
      escrow.fundedAmount += amount;
      escrow.pendingAmount += amount;
      escrow.status = 'FUNDED';
      await escrow.save();
    }

    res.json({ success: true, escrow, message: 'Escrow funded successfully (simulated)' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/payments/release
const releasePayment = async (req, res) => {
  try {
    const { milestoneId, freelancerId, amount, projectId } = req.body;

    const payment = await Payment.create({
      projectId, milestoneId,
      clientId: req.user._id,
      freelancerId,
      amount,
      status: 'COMPLETED',
      transactionId: `TXN_${Date.now()}`,
      paymentMethod: 'ESCROW_RELEASE',
    });

    // Update escrow
    const escrow = await Escrow.findOne({ projectId });
    if (escrow) {
      escrow.releasedAmount += amount;
      escrow.pendingAmount = Math.max(0, escrow.pendingAmount - amount);
      if (escrow.pendingAmount === 0) escrow.status = 'RELEASED';
      await escrow.save();
    }

    // Update milestone
    await Milestone.findByIdAndUpdate(milestoneId, { status: 'COMPLETED' });

    res.json({ success: true, payment, message: 'Payment released to freelancer (simulated)' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/payments/escrow/:projectId
const getEscrow = async (req, res) => {
  try {
    const escrow = await Escrow.findOne({ projectId: req.params.projectId }).populate('projectId', 'title');
    res.json({ success: true, escrow });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/payments/transactions
const getTransactions = async (req, res) => {
  try {
    const filter = req.user.role === 'PAYMENT_MANAGER' ? {} :
      req.user.role === 'CLIENT' ? { clientId: req.user._id } :
      { freelancerId: req.user._id };

    const payments = await Payment.find(filter)
      .populate('projectId', 'title')
      .populate('clientId', 'name')
      .populate('freelancerId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/payments/stats
const getPaymentStats = async (req, res) => {
  try {
    const total = await Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const byStatus = await Payment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$amount' } } }]);
    res.json({ success: true, totalRevenue: total[0]?.total || 0, byStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { fundEscrow, releasePayment, getEscrow, getTransactions, getPaymentStats };
