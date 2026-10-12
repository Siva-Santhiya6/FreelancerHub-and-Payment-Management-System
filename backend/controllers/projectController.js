const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Milestone = require('../models/Milestone');

// GET /api/projects (Paginated, Filtered, Searched, Sorted)
const getProjects = async (req, res) => {
  try {
    if (res.advancedResults) {
      return res.json(res.advancedResults);
    }

    const { status, category, skills, search, page = 1, limit = 10, sort = '-createdAt', minBudget, maxBudget } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category && category !== 'All') filter.category = category;
    if (skills) {
      const sArr = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (sArr.length > 0) filter.skills = { $in: sArr };
    }
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const skip = (p - 1) * l;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('clientId', 'name profileImage rating trustScore isVerified country')
        .sort(sort.split(',').join(' '))
        .skip(skip)
        .limit(l),
      Project.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / l) || 1;

    res.json({
      success: true,
      count: projects.length,
      total,
      pagination: {
        page: p,
        limit: l,
        totalPages,
        totalCount: total,
        hasNext: p < totalPages,
        hasPrev: p > 1,
        startIndex: total === 0 ? 0 : skip + 1,
        endIndex: Math.min(skip + projects.length, total)
      },
      data: projects,
      projects // backward compatibility
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/:id (Single Project details)
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name profileImage rating trustScore isVerified country bio email')
      .populate('milestoneIds')
      .populate({
        path: 'proposalIds',
        populate: { path: 'freelancerId', select: 'name rating skills trustScore profileImage experience hourlyRate isVerified' }
      });

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/projects (Create Project)
const createProject = async (req, res) => {
  try {
    const { title, description, category, skills, budget, deadline, teamSize } = req.body;
    if (!title || !description || !category || !budget) {
      return res.status(400).json({ success: false, message: 'Title, description, category, and budget are required' });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      category,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      budget: Number(budget),
      deadline: deadline ? new Date(deadline) : undefined,
      teamSize: Number(teamSize) || 1,
      clientId: req.user._id,
      status: 'OPEN',
      healthStatus: 'HEALTHY',
      progress: 0
    });

    const populated = await Project.findById(project._id).populate('clientId', 'name profileImage rating trustScore isVerified');
    res.status(201).json({ success: true, project: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/projects/:id (Update Project)
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Authorization check: user must be project owner or admin
    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this project' });
    }

    const updates = { ...req.body };
    if (updates.skills && typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map(s => s.trim());
    }

    project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('clientId', 'name profileImage rating trustScore isVerified');

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/projects/:id (Delete Project with cascade cleanup)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this project' });
    }

    // Cascade delete milestones and proposals
    await Promise.all([
      Milestone.deleteMany({ projectId: project._id }),
      Proposal.deleteMany({ projectId: project._id }),
      Project.findByIdAndDelete(project._id)
    ]);

    res.json({ success: true, message: 'Project and all related data successfully deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/my (User's projects)
const getMyProjects = async (req, res) => {
  try {
    const filter = req.user.role === 'CLIENT'
      ? { clientId: req.user._id }
      : req.user.role === 'ADMIN'
        ? {}
        : {}; // If freelancer or others, return active projects

    const { status, search } = req.query;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(filter)
      .populate('clientId', 'name profileImage rating isVerified')
      .populate('milestoneIds')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, getMyProjects };
