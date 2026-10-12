const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const User = require('../models/User');

// AI-based skill match score calculation
const calcMatchScore = (freelancerSkills, projectSkills) => {
  if (!projectSkills?.length || !freelancerSkills?.length) return 75;
  const match = freelancerSkills.filter(s =>
    projectSkills.map(p => p.toLowerCase()).includes(s.toLowerCase())
  );
  const score = Math.round((match.length / projectSkills.length) * 100);
  return Math.max(score, 50);
};

// POST /api/proposals (Create Proposal)
const createProposal = async (req, res) => {
  try {
    const { projectId, coverLetter, bidAmount, estimatedDuration } = req.body;
    if (!projectId || !coverLetter || !bidAmount) {
      return res.status(400).json({ success: false, message: 'Project ID, cover letter, and bid amount are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const existing = await Proposal.findOne({ projectId, freelancerId: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already submitted a proposal for this project' });

    const matchScore = calcMatchScore(req.user.skills, project.skills);
    const proposal = await Proposal.create({
      projectId,
      freelancerId: req.user._id,
      coverLetter: coverLetter.trim(),
      bidAmount: Number(bidAmount),
      estimatedDuration: estimatedDuration || '7 days',
      matchScore,
      status: 'SUBMITTED'
    });

    // Add proposal to project
    project.proposalIds.push(proposal._id);
    await project.save();

    const populated = await Proposal.findById(proposal._id)
      .populate('freelancerId', 'name rating skills trustScore profileImage experience hourlyRate isVerified')
      .populate('projectId', 'title budget category status');

    res.status(201).json({ success: true, proposal: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/proposals (All Proposals with advanced results)
const getProposals = async (req, res) => {
  try {
    if (res.advancedResults) {
      return res.json(res.advancedResults);
    }
    const { status, projectId, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (projectId) filter.projectId = projectId;
    if (search) {
      filter.coverLetter = { $regex: search, $options: 'i' };
    }

    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const skip = (p - 1) * l;

    const [proposals, total] = await Promise.all([
      Proposal.find(filter)
        .populate('freelancerId', 'name rating skills trustScore profileImage experience hourlyRate isVerified')
        .populate('projectId', 'title budget category status')
        .sort(sort.split(',').join(' '))
        .skip(skip)
        .limit(l),
      Proposal.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / l) || 1;

    res.json({
      success: true,
      count: proposals.length,
      total,
      pagination: {
        page: p,
        limit: l,
        totalPages,
        totalCount: total,
        hasNext: p < totalPages,
        hasPrev: p > 1,
        startIndex: total === 0 ? 0 : skip + 1,
        endIndex: Math.min(skip + proposals.length, total)
      },
      data: proposals,
      proposals
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/proposals/project/:projectId
const getProjectProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ projectId: req.params.projectId })
      .populate('freelancerId', 'name rating skills trustScore profileImage experience hourlyRate isVerified')
      .sort({ matchScore: -1, createdAt: -1 });
    res.json({ success: true, count: proposals.length, proposals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/proposals/:id/status (Accept / Reject / Shortlist)
const updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['DRAFT', 'SUBMITTED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const proposal = await Proposal.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('freelancerId', 'name rating skills trustScore profileImage isVerified')
      .populate('projectId', 'title budget category status');

    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    if (status === 'ACCEPTED') {
      await Project.findByIdAndUpdate(proposal.projectId, { status: 'IN_PROGRESS' });
    }

    res.json({ success: true, proposal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/proposals/:id (Freelancer edit proposal)
const updateProposal = async (req, res) => {
  try {
    let proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    if (proposal.freelancerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this proposal' });
    }

    const allowed = ['bidAmount', 'coverLetter', 'estimatedDuration'];
    allowed.forEach(f => {
      if (req.body[f] !== undefined) proposal[f] = req.body[f];
    });

    await proposal.save();
    proposal = await Proposal.findById(proposal._id)
      .populate('freelancerId', 'name rating skills trustScore profileImage isVerified')
      .populate('projectId', 'title budget category status');

    res.json({ success: true, proposal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/proposals/:id (Withdraw / Delete Proposal)
const deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    if (proposal.freelancerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this proposal' });
    }

    // Remove from project's proposalIds
    await Project.findByIdAndUpdate(proposal.projectId, { $pull: { proposalIds: proposal._id } });
    await Proposal.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Proposal successfully withdrawn and removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/proposals/my (Freelancer's proposals)
const getMyProposals = async (req, res) => {
  try {
    const { status, search, sort = '-createdAt' } = req.query;
    const filter = { freelancerId: req.user._id };
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.coverLetter = { $regex: search, $options: 'i' };
    }

    const proposals = await Proposal.find(filter)
      .populate('projectId', 'title status budget category skills deadline clientId')
      .sort(sort.split(',').join(' '));

    res.json({ success: true, count: proposals.length, proposals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createProposal,
  getProposals,
  getProjectProposals,
  updateProposalStatus,
  updateProposal,
  deleteProposal,
  getMyProposals
};
