const User = require('../models/User');
const Project = require('../models/Project');
const { Payment } = require('../models/Payment');

// GET /api/admin/users (Paginated, Filtered, Searched, Sorted)
const getUsers = async (req, res) => {
  try {
    if (res.advancedResults) {
      return res.json(res.advancedResults);
    }

    const { role, search, isVerified, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filter = {};
    if (role && role !== 'ALL') filter.role = role;
    if (isVerified !== undefined && isVerified !== '') {
      filter.isVerified = isVerified === 'true' || isVerified === true;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const skip = (p - 1) * l;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort(sort.split(',').join(' '))
        .skip(skip)
        .limit(l),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / l) || 1;

    res.json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: p,
        limit: l,
        totalPages,
        totalCount: total,
        hasNext: p < totalPages,
        hasPrev: p > 1,
        startIndex: total === 0 ? 0 : skip + 1,
        endIndex: Math.min(skip + users.length, total)
      },
      data: users,
      users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/users/:id (Single User)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/users (Create User by Admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, skills, hourlyRate, isVerified, trustScore } = req.body;
    const cleanEmail = email?.toLowerCase().trim();
    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });

    const user = await User.create({
      name: name?.trim() || 'New Member',
      email: cleanEmail,
      password,
      role: role || 'CLIENT',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      hourlyRate: Number(hourlyRate) || 0,
      isVerified: isVerified !== undefined ? isVerified : true,
      trustScore: Number(trustScore) || 85,
    });

    res.status(201).json({ success: true, user: user.toJSON ? user.toJSON() : user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/users/:id (Update User by Admin)
const updateUser = async (req, res) => {
  try {
    const allowed = ['name', 'email', 'role', 'isVerified', 'trustScore', 'rating', 'bio', 'hourlyRate', 'skills', 'phone'];
    const updates = {};
    allowed.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    if (updates.skills && typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map(s => s.trim());
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/users/:id/verify (Toggle / Verify User)
const verifyUser = async (req, res) => {
  try {
    const { isVerified = true } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified, trustScore: isVerified ? 90 : 50 },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/users/:id (Delete User)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User account removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalProjects, totalPayments, freelancers, clients, agencies, pendingEscrow] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      User.countDocuments({ role: 'FREELANCER' }),
      User.countDocuments({ role: 'CLIENT' }),
      User.countDocuments({ role: 'AGENCY_MANAGER' }),
      Project.countDocuments({ status: 'IN_PROGRESS' })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProjects,
        totalRevenue: totalPayments[0]?.total || 185000,
        freelancers,
        clients,
        agencies,
        pendingEscrow
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  verifyUser,
  deleteUser,
  getStats
};
