const express = require('express');
const router = express.Router();
const { protect, optionalProtect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

// Models for advanced query middleware
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const User = require('../models/User');
const Milestone = require('../models/Milestone');
const { Review } = require('../models/Review');

// Controllers
const {
  register,
  login,
  oauthLogin,
  getOAuthUrl,
  getMe,
  updateProfile
} = require('../controllers/authController');

const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects
} = require('../controllers/projectController');

const {
  createProposal,
  getProposals,
  getProjectProposals,
  updateProposalStatus,
  updateProposal,
  deleteProposal,
  getMyProposals
} = require('../controllers/proposalController');

const {
  fundEscrow,
  releasePayment,
  getEscrow,
  getTransactions,
  getPaymentStats
} = require('../controllers/paymentController');

const { chat } = require('../controllers/aiController');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  verifyUser,
  deleteUser,
  getStats
} = require('../controllers/adminController');

// 1. Authentication & OAuth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/oauth', oauthLogin);
router.post('/auth/google', oauthLogin);
router.get('/auth/oauth/url', getOAuthUrl);
router.get('/auth/me', protect, getMe);
router.put('/auth/profile', protect, updateProfile);

// 2. Project Routes (CRUD + Pagination, Filtering, Searching, Sorting)
router.get(
  '/projects',
  advancedResults(
    Project,
    [
      { path: 'clientId', select: 'name profileImage rating trustScore isVerified country' },
      { path: 'milestoneIds' }
    ],
    ['title', 'description', 'category']
  ),
  getProjects
);
router.get('/projects/my', protect, getMyProjects);
router.get('/projects/:id', getProject);
router.post('/projects', protect, authorize('CLIENT', 'ADMIN'), createProject);
router.put('/projects/:id', protect, updateProject);
router.delete('/projects/:id', protect, deleteProject);

// 3. Proposal Routes (CRUD + Status Workflow)
router.post('/proposals', protect, authorize('FREELANCER'), createProposal);
router.get(
  '/proposals',
  protect,
  advancedResults(
    Proposal,
    [
      { path: 'freelancerId', select: 'name rating skills trustScore profileImage experience hourlyRate isVerified' },
      { path: 'projectId', select: 'title budget category status' }
    ],
    ['coverLetter']
  ),
  getProposals
);
router.get('/proposals/my', protect, getMyProposals);
router.get('/proposals/project/:projectId', protect, getProjectProposals);
router.put('/proposals/:id/status', protect, authorize('CLIENT', 'ADMIN'), updateProposalStatus);
router.put('/proposals/:id', protect, updateProposal);
router.delete('/proposals/:id', protect, deleteProposal);

// 4. Payments & Escrow Routes
router.post('/payments/escrow/fund', protect, authorize('CLIENT', 'ADMIN'), fundEscrow);
router.post('/payments/release', protect, authorize('CLIENT', 'ADMIN'), releasePayment);
router.get('/payments/escrow/:projectId', protect, getEscrow);
router.get('/payments/transactions', protect, getTransactions);
router.get('/payments/stats', protect, authorize('PAYMENT_MANAGER', 'ADMIN'), getPaymentStats);

// 5. Admin Routes (CRUD + Stats)
router.get(
  '/admin/users',
  protect,
  authorize('ADMIN'),
  advancedResults(User, null, ['name', 'email', 'bio', 'role']),
  getUsers
);
router.get('/admin/users/:id', protect, authorize('ADMIN'), getUser);
router.post('/admin/users', protect, authorize('ADMIN'), createUser);
router.put('/admin/users/:id', protect, authorize('ADMIN'), updateUser);
router.put('/admin/users/:id/verify', protect, authorize('ADMIN'), verifyUser);
router.delete('/admin/users/:id', protect, authorize('ADMIN'), deleteUser);
router.get('/admin/stats', protect, authorize('ADMIN'), getStats);

// 6. Freelancers Search & Directory (Public / Authenticated)
router.get(
  '/freelancers',
  advancedResults(User, null, ['name', 'bio', 'skills']),
  async (req, res) => {
    if (res.advancedResults) {
      return res.json(res.advancedResults);
    }
    try {
      const { skills, search, sort = '-rating' } = req.query;
      const filter = { role: 'FREELANCER' };
      if (skills) filter.skills = { $in: skills.split(',').map(s => s.trim()) };
      if (search) filter.name = { $regex: search, $options: 'i' };
      const freelancers = await User.find(filter).select('-password').sort(sort.split(',').join(' '));
      res.json({ success: true, count: freelancers.length, freelancers });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// 7. Milestone CRUD Routes
router.get('/milestones/project/:projectId', protect, async (req, res) => {
  try {
    const milestones = await Milestone.find({ projectId: req.params.projectId })
      .populate('assignedMembers', 'name profileImage rating isVerified')
      .sort({ createdAt: 1 });
    res.json({ success: true, count: milestones.length, milestones });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/milestones', protect, authorize('CLIENT', 'ADMIN'), async (req, res) => {
  try {
    const milestone = await Milestone.create(req.body);
    await Project.findByIdAndUpdate(req.body.projectId, { $push: { milestoneIds: milestone._id } });
    res.status(201).json({ success: true, milestone });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/milestones/:id', protect, async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
    res.json({ success: true, milestone });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/milestones/:id', protect, authorize('CLIENT', 'ADMIN'), async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
    await Project.findByIdAndUpdate(milestone.projectId, { $pull: { milestoneIds: milestone._id } });
    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Milestone deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. Reviews
router.post('/reviews', protect, async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, reviewerId: req.user._id });
    const reviews = await Review.find({ revieweeId: req.body.revieweeId });
    if (reviews.length > 0) {
      const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
      await User.findByIdAndUpdate(req.body.revieweeId, { rating: Math.round(avg * 10) / 10 });
    }
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/reviews/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId }).populate('reviewerId', 'name profileImage');
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 9. AI Assistant
router.post('/ai/chat', optionalProtect, chat);

module.exports = router;
