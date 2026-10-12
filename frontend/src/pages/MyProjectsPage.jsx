import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyProjects, createProject, updateProject, deleteProject } from '../store/slices/projectSlice';
import Pagination from '../components/common/Pagination';
import { useTranslation } from '../i18n/translations';
import {
  Plus, ArrowRight, Briefcase, Clock, CheckCircle2,
  DollarSign, Sparkles, AlertCircle, Layers, Grid, List,
  Kanban, Search, Filter, MessageSquare, CreditCard,
  ShieldCheck, User, ChevronRight, Check, ArrowUpRight, ExternalLink,
  Edit3, Trash2, X, AlertTriangle, RefreshCw
} from 'lucide-react';

const CATEGORIES = ['Web Development', 'Mobile App', 'AI / ML', 'Design & UI/UX', 'DevOps & Cloud', 'Data Science', 'Marketing & SEO'];

export default function MyProjectsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myProjects, loading } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);

  // Filter, Search, Sort, Pagination State
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // CRUD Modals State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Form State for Create & Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    budget: '',
    skills: '',
    deadline: '',
    status: 'OPEN',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  useEffect(() => {
    dispatch(fetchMyProjects());
  }, [dispatch]);

  // Demo fallback dataset if database empty
  const rawList = myProjects && myProjects.length > 0 ? myProjects : [
    {
      _id: 'demo-1',
      title: 'Enterprise E-Commerce Platform with React & Node.js',
      category: 'Web Development',
      status: 'IN_PROGRESS',
      budget: 25000,
      progress: 65,
      deadline: '2026-10-15',
      skills: ['React', 'Node.js', 'MongoDB', 'Redux'],
      clientId: { name: 'Sarah Client', isVerified: true },
      createdAt: '2026-09-01'
    },
    {
      _id: 'demo-2',
      title: 'AI Multilingual Chatbot for Customer Support',
      category: 'AI / ML',
      status: 'IN_PROGRESS',
      budget: 18000,
      progress: 40,
      deadline: '2026-10-25',
      skills: ['Python', 'NLP', 'TensorFlow', 'FastAPI'],
      clientId: { name: 'Sarah Client', isVerified: true },
      createdAt: '2026-09-05'
    },
    {
      _id: 'demo-3',
      title: 'Mobile Banking UI/UX Design & Prototype',
      category: 'Design & UI/UX',
      status: 'COMPLETED',
      budget: 12000,
      progress: 100,
      deadline: '2026-09-15',
      skills: ['Figma', 'UI/UX', 'Prototyping'],
      clientId: { name: 'Sarah Client', isVerified: true },
      createdAt: '2026-08-20'
    },
    {
      _id: 'demo-4',
      title: 'Kubernetes CI/CD Pipeline & Cloud Architecture Setup',
      category: 'DevOps & Cloud',
      status: 'OPEN',
      budget: 15000,
      progress: 10,
      deadline: '2026-11-01',
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'],
      clientId: { name: 'Sarah Client', isVerified: true },
      createdAt: '2026-09-12'
    }
  ];

  // Filtering & Searching Logic
  let filtered = rawList.filter(p => {
    if (activeTab !== 'all' && p.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchCategory = p.category?.toLowerCase().includes(q);
      const matchSkills = p.skills?.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCategory && !matchSkills) return false;
    }
    return true;
  });

  // Sorting Logic
  if (sortBy === 'recent') {
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (sortBy === 'budget-high') {
    filtered.sort((a, b) => (b.budget || 0) - (a.budget || 0));
  } else if (sortBy === 'budget-low') {
    filtered.sort((a, b) => (a.budget || 0) - (b.budget || 0));
  } else if (sortBy === 'progress') {
    filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
  }

  // Pagination calculation
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProjects = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Open Create Project Modal
  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Web Development',
      budget: '',
      skills: '',
      deadline: '',
      status: 'OPEN'
    });
    setCreateModalOpen(true);
  };

  // Submit Create Project
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget),
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      };
      await dispatch(createProject(payload)).unwrap();
      setCreateModalOpen(false);
      showToast('Project published to marketplace successfully!');
      dispatch(fetchMyProjects());
    } catch (err) {
      alert(err || 'Failed to create project');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Project Modal
  const handleOpenEdit = (project, e) => {
    e?.stopPropagation();
    setSelectedProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'Web Development',
      budget: project.budget || '',
      skills: Array.isArray(project.skills) ? project.skills.join(', ') : (project.skills || ''),
      deadline: project.deadline ? project.deadline.substring(0, 10) : '',
      status: project.status || 'OPEN',
    });
    setEditModalOpen(true);
  };

  // Submit Edit Project
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const updates = {
        ...formData,
        budget: Number(formData.budget),
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      };
      await dispatch(updateProject({ id: selectedProject._id, updates })).unwrap();
      setEditModalOpen(false);
      showToast('Project updated successfully!');
      dispatch(fetchMyProjects());
    } catch (err) {
      alert(err || 'Failed to update project');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (project, e) => {
    e?.stopPropagation();
    setSelectedProject(project);
    setDeleteModalOpen(true);
  };

  // Confirm Delete Project
  const handleConfirmDelete = async () => {
    setActionLoading(true);
    try {
      await dispatch(deleteProject(selectedProject._id)).unwrap();
      setDeleteModalOpen(false);
      showToast('Project deleted successfully.');
      dispatch(fetchMyProjects());
    } catch (err) {
      alert(err || 'Failed to delete project');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Toast notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: 10, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Briefcase size={13} /> {t('workspaceAndContracts', 'Project Management & Oversight')}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>{t('myProjects', 'My Managed Projects')}</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13.5 }}>{t('manageActiveContracts', 'Manage active contracts, create listings, and monitor milestones')}</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={16} /> {t('postProject', 'Create New Project')}
          </button>
        </div>
      </div>

      {/* Query Bar: Search, Status Filter, Sort, View Mode */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 16,
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input
              type="text"
              className="form-input"
              placeholder={t('searchProjectsPlaceholder', 'Search projects by title, skill, or keyword...')}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: 40, height: 40, fontSize: 13 }}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ minWidth: 160 }}>
            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              style={{ height: 40, fontSize: 13, cursor: 'pointer' }}
            >
              <option value="recent">✨ {t('newestFirst', 'Newest First')}</option>
              <option value="budget-high">💰 {t('budgetHighLow', 'Highest Budget')}</option>
              <option value="budget-low">💵 {t('budgetLowHigh', 'Lowest Budget')}</option>
              <option value="progress">📊 {t('highestProgress', 'Highest Progress')}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: 3, border: '1px solid var(--border)' }}>
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '5px 10px', border: 'none' }}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={15} />
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '5px 10px', border: 'none' }}
              onClick={() => setViewMode('list')}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          {[
            { id: 'all', label: 'All Projects', count: rawList.length },
            { id: 'OPEN', label: 'Open / Bidding', count: rawList.filter(p => p.status === 'OPEN').length },
            { id: 'IN_PROGRESS', label: 'In Progress', count: rawList.filter(p => p.status === 'IN_PROGRESS').length },
            { id: 'COMPLETED', label: 'Completed', count: rawList.filter(p => p.status === 'COMPLETED').length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? 'none' : '1px solid var(--border)',
                  background: isActive ? 'var(--primary)' : 'var(--bg3)',
                  color: isActive ? '#fff' : 'var(--text2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {tab.label}
                <span style={{ fontSize: 11, opacity: 0.8, background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--border)', padding: '1px 6px', borderRadius: 10 }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects List / Grid */}
      {paginatedProjects.length === 0 ? (
        <div className="empty-state" style={{ padding: 48, background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <Layers size={48} style={{ color: 'var(--text3)', margin: '0 auto 12px', opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>No Projects Found</h3>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>No projects match your current tab or search criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {paginatedProjects.map((project) => (
            <div
              key={project._id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 20,
                position: 'relative',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    background: project.status === 'IN_PROGRESS' ? 'rgba(59, 130, 246, 0.15)' : project.status === 'COMPLETED' ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg3)',
                    color: project.status === 'IN_PROGRESS' ? '#3b82f6' : project.status === 'COMPLETED' ? '#22c55e' : 'var(--text2)',
                  }}
                >
                  {project.status}
                </span>

                {/* Edit & Delete Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    onClick={(e) => handleOpenEdit(project, e)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px' }}
                    title="Edit Project Details"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={(e) => handleOpenDelete(project, e)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px', color: '#ef4444' }}
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, color: 'var(--text)' }}>
                {project.title}
              </h3>
              <span style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 14 }}>
                📁 {project.category}
              </span>

              {/* Progress Bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text3)' }}>Progress</span>
                  <span style={{ color: 'var(--primary)' }}>{project.progress || 0}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${project.progress || 0}%`, background: 'var(--primary-gradient)', borderRadius: 4 }} />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text3)', display: 'block' }}>Budget</span>
                  <strong style={{ fontSize: 16, color: 'var(--primary)', fontWeight: 800 }}>
                    ₹{project.budget?.toLocaleString()}
                  </strong>
                </div>

                <button
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: 4 }}
                >
                  Manage <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paginatedProjects.map((project) => (
            <div
              key={project._id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 8, background: 'var(--bg3)', fontSize: 11, fontWeight: 700 }}>
                    {project.category}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>
                    ● {project.status}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  {project.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, color: 'var(--text3)', display: 'block' }}>Budget</span>
                  <strong style={{ fontSize: 15, color: 'var(--primary)', fontWeight: 800 }}>
                    ₹{project.budget?.toLocaleString()}
                  </strong>
                </div>

                <button onClick={(e) => handleOpenEdit(project, e)} className="btn btn-secondary btn-sm">
                  <Edit3 size={13} /> Edit
                </button>
                <button onClick={(e) => handleOpenDelete(project, e)} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
                  <Trash2 size={13} />
                </button>
                <button onClick={() => navigate(`/projects/${project._id}`)} className="btn btn-primary btn-sm">
                  View <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
        pageSizeOptions={[6, 12, 24]}
      />

      {/* Create Project Modal */}
      {createModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal" style={{ maxWidth: 540, width: '92%', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800 }}>Create New Project</h3>
              </div>
              <button onClick={() => setCreateModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Next.js SaaS with Stripe Escrow"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Budget (INR ₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="25000"
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="React, Node.js, MongoDB, AWS"
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Scope & Deliverables</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Describe your project goals, milestones, and deliverables..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {actionLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <><Plus size={15} /> Publish Project</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal" style={{ maxWidth: 540, width: '92%', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800 }}>Edit Project Details</h3>
              <button onClick={() => setEditModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Budget (INR ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {actionLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <><Check size={15} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedProject && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal" style={{ maxWidth: 420, width: '92%', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>Delete This Project?</h3>
            <p style={{ color: 'var(--text3)', fontSize: 13, margin: '8px 0 20px' }}>
              Are you sure you want to delete <strong>"{selectedProject.title}"</strong>? This will permanently remove all associated milestones and bids.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button onClick={handleConfirmDelete} disabled={actionLoading} className="btn" style={{ flex: 1, justifyContent: 'center', background: '#ef4444', color: '#fff' }}>
                {actionLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
