import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sounds } from '../utils/SoundEffects';
import Pagination from '../components/common/Pagination';
import AIProposalWriterModal from '../components/ai/AIProposalWriterModal';
import { useTranslation } from '../i18n/translations';
import {
  FileText, Clock, DollarSign, Sparkles, ArrowRight, CheckCircle2,
  XCircle, AlertCircle, Send, Check, ChevronRight, User, ShieldCheck,
  Award, Edit3, Trash2, Eye, MessageSquare, ChevronDown, ChevronUp,
  Search, SlidersHorizontal, Wand2, RefreshCw, Layers, X
} from 'lucide-react';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function ProposalsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Edit Bid Modal state
  const [editingProposal, setEditingProposal] = useState(null);
  const [editBidAmount, setEditBidAmount] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editCoverLetter, setEditCoverLetter] = useState('');

  // Delete / Withdraw Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProposalToDelete, setSelectedProposalToDelete] = useState(null);

  // AI Proposal Writer Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedAiProject, setSelectedAiProject] = useState(null);

  // Toast message
  const [toastMsg, setToastMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const loadProposals = async () => {
    try {
      setLoading(true);
      const r = await axios.get('/api/proposals/my', { headers: authHeader() });
      if (r.data.proposals && r.data.proposals.length > 0) {
        setProposals(r.data.proposals);
      } else {
        // High quality demonstration dataset if empty
        setProposals([
          {
            _id: 'prop-1',
            projectId: {
              _id: 'proj-101',
              title: 'Enterprise E-Commerce Platform with React & Node.js',
              category: 'Web Development',
              budget: 25000,
              skills: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux']
            },
            bidAmount: 24000,
            estimatedDuration: '14 days',
            status: 'SHORTLISTED',
            matchScore: 94,
            createdAt: '2026-09-10T10:30:00Z',
            coverLetter: `Dear Hiring Team,\n\nI reviewed the project requirements and have built 4+ enterprise-grade SaaS platforms with React, Node.js, and Stripe Escrow.\n\nExecution Plan:\n1. Milestone 1: Authentication & Schema Design (3 Days)\n2. Milestone 2: Product Catalog & Redux State (5 Days)\n3. Milestone 3: Escrow Checkout & Automated Testing (6 Days)\n\nAvailable immediately with daily progress standups.`
          },
          {
            _id: 'prop-2',
            projectId: {
              _id: 'proj-102',
              title: 'AI Multilingual Chatbot for Customer Support',
              category: 'AI / ML',
              budget: 18000,
              skills: ['Python', 'NLP', 'TensorFlow', 'FastAPI', 'React']
            },
            bidAmount: 17500,
            estimatedDuration: '21 days',
            status: 'ACCEPTED',
            matchScore: 98,
            createdAt: '2026-09-08T14:15:00Z',
            coverLetter: `Hi there!\n\nI specialize in conversational NLP pipelines supporting Tamil, Hindi, and English intents. I can deliver high-accuracy fine-tuned models with <50ms response latency.`
          },
          {
            _id: 'prop-3',
            projectId: {
              _id: 'proj-103',
              title: 'Mobile Banking UI/UX Design System in Figma',
              category: 'Design & UI/UX',
              budget: 12000,
              skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping']
            },
            bidAmount: 11000,
            estimatedDuration: '10 days',
            status: 'SUBMITTED',
            matchScore: 88,
            createdAt: '2026-09-14T08:00:00Z',
            coverLetter: `Hello! I have created verified design systems for top fintech startups with accessibility compliance (WCAG AA), micro-animations, and complete design tokens.`
          },
          {
            _id: 'prop-4',
            projectId: {
              _id: 'proj-104',
              title: 'Kubernetes Cloud Deployment & CI/CD Pipeline',
              category: 'DevOps & Cloud',
              budget: 15000,
              skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform']
            },
            bidAmount: 15000,
            estimatedDuration: '12 days',
            status: 'SUBMITTED',
            matchScore: 91,
            createdAt: '2026-09-12T16:45:00Z',
            coverLetter: `Hi,\n\nI am an AWS Certified Solutions Architect with 6+ years setting up scalable EKS clusters, Helm charts, and GitHub Actions CI/CD workflows.`
          }
        ]);
      }
    } catch (e) {
      console.warn('Failed to fetch proposals, using demo fallback:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  // Filter & Search Logic
  let filtered = proposals.filter(p => {
    if (activeFilter !== 'all' && p.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.projectId?.title?.toLowerCase().includes(q);
      const matchCover = p.coverLetter?.toLowerCase().includes(q);
      const matchCategory = p.projectId?.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchCover && !matchCategory) return false;
    }
    return true;
  });

  // Sort Logic
  if (sortBy === 'recent') {
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (sortBy === 'bid-high') {
    filtered.sort((a, b) => (b.bidAmount || 0) - (a.bidAmount || 0));
  } else if (sortBy === 'bid-low') {
    filtered.sort((a, b) => (a.bidAmount || 0) - (b.bidAmount || 0));
  } else if (sortBy === 'match') {
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  // Pagination calculation
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProposals = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Open Edit Bid Modal
  const handleOpenEdit = (p, e) => {
    e?.stopPropagation();
    setEditingProposal(p);
    setEditBidAmount(p.bidAmount);
    setEditDuration(p.estimatedDuration || '7 days');
    setEditCoverLetter(p.coverLetter || '');
  };

  // Submit Edit Bid
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await axios.put(`/api/proposals/${editingProposal._id}`, {
        bidAmount: Number(editBidAmount),
        estimatedDuration: editDuration,
        coverLetter: editCoverLetter,
      }, { headers: authHeader() });
      setEditingProposal(null);
      showToast('Proposal bid details updated successfully!');
      loadProposals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update proposal');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Withdraw Modal
  const handleOpenDelete = (p, e) => {
    e?.stopPropagation();
    setSelectedProposalToDelete(p);
    setDeleteModalOpen(true);
  };

  // Confirm Withdraw / Delete
  const handleConfirmDelete = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`/api/proposals/${selectedProposalToDelete._id}`, { headers: authHeader() });
      setDeleteModalOpen(false);
      showToast('Proposal withdrawn and removed successfully.');
      loadProposals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw proposal');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: 10, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <FileText size={13} /> {t('myProposals', 'Bid Submissions & Cover Letters')}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>{t('myProposals', 'My Submitted Proposals')}</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13.5 }}>{t('proposalsSubtitle', 'Track active client reviews, adjust bid quotes, and monitor contract conversions')}</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/marketplace" className="btn btn-primary">
            <Sparkles size={15} /> {t('findWork', 'Find Projects & Bid')}
          </Link>
        </div>
      </div>

      {/* Query Bar: Search, Status Filter, Sort */}
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
              placeholder={t('searchProposalsPlaceholder', 'Search proposals by project title or proposal text...')}
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
              <option value="recent">✨ Newest First</option>
              <option value="bid-high">💰 Highest Bid</option>
              <option value="bid-low">💵 Lowest Bid</option>
              <option value="match">⚡ Top Match Score</option>
            </select>
          </div>

          <button onClick={loadProposals} className="btn btn-secondary btn-sm" style={{ height: 40, padding: '0 12px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          {[
            { id: 'all', label: 'All Proposals', count: proposals.length },
            { id: 'SUBMITTED', label: 'Under Review', count: proposals.filter(p => p.status === 'SUBMITTED').length },
            { id: 'SHORTLISTED', label: 'Shortlisted', count: proposals.filter(p => p.status === 'SHORTLISTED').length },
            { id: 'ACCEPTED', label: 'Accepted', count: proposals.filter(p => p.status === 'ACCEPTED').length },
            { id: 'REJECTED', label: 'Archived', count: proposals.filter(p => p.status === 'REJECTED').length },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveFilter(tab.id); setCurrentPage(1); }}
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

      {/* Proposals List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text3)' }}>Loading submitted bids...</p>
        </div>
      ) : paginatedProposals.length === 0 ? (
        <div className="empty-state" style={{ padding: 48, background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <Layers size={48} style={{ color: 'var(--text3)', margin: '0 auto 12px', opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>No Proposals Found</h3>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>No bids match your selected status or search keywords.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {paginatedProposals.map((p) => {
            const isExpanded = expandedId === p._id;
            return (
              <div key={p._id} className="card" style={{ padding: 20 }}>
                {/* Proposal Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className={`badge ${p.status === 'ACCEPTED' ? 'badge-success' : p.status === 'SHORTLISTED' ? 'badge-warning' : 'badge-primary'}`}>
                        {p.status}
                      </span>
                      {p.matchScore && (
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: '#22c55e' }}>
                          ⚡ {p.matchScore}% Skill Match
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', margin: '4px 0' }}>
                      {p.projectId?.title || 'Project Proposal'}
                    </h3>
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                      📁 {p.projectId?.category || 'Development'} • Submitted on {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Bid Details & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 11, color: 'var(--text3)', display: 'block', fontWeight: 600 }}>Your Bid</span>
                      <strong style={{ fontSize: 18, color: 'var(--primary)', fontWeight: 900 }}>
                        ₹{p.bidAmount?.toLocaleString()}
                      </strong>
                      <span style={{ fontSize: 11, color: 'var(--text3)', display: 'block' }}>
                        ⏱️ {p.estimatedDuration || '7 days'}
                      </span>
                    </div>

                    <button onClick={(e) => handleOpenEdit(p, e)} className="btn btn-secondary btn-sm" title="Edit Bid">
                      <Edit3 size={13} /> Edit
                    </button>
                    <button onClick={(e) => handleOpenDelete(p, e)} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }} title="Withdraw Bid">
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p._id)}
                      className="btn btn-secondary btn-sm"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Cover Letter Details */}
                {isExpanded && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                      Submitted Cover Letter & Milestone Pitch
                    </h4>
                    <div style={{ background: 'var(--bg3)', padding: 14, borderRadius: 'var(--radius-sm)', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line', color: 'var(--text)' }}>
                      {p.coverLetter}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
        pageSizeOptions={[4, 6, 12, 24]}
      />

      {/* Edit Proposal Modal */}
      {editingProposal && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal" style={{ maxWidth: 500, width: '92%', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800 }}>Edit Proposal Quote</h3>
              <button onClick={() => setEditingProposal(null)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Bid Amount (INR ₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editBidAmount}
                    onChange={e => setEditBidAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editDuration}
                    onChange={e => setEditDuration(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter</label>
                <textarea
                  className="form-input"
                  rows={5}
                  value={editCoverLetter}
                  onChange={e => setEditCoverLetter(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setEditingProposal(null)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {actionLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : 'Update Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedProposalToDelete && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal" style={{ maxWidth: 400, width: '92%', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>Withdraw Proposal?</h3>
            <p style={{ color: 'var(--text3)', fontSize: 13, margin: '8px 0 20px' }}>
              Are you sure you want to withdraw your bid on <strong>"{selectedProposalToDelete.projectId?.title}"</strong>?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button onClick={handleConfirmDelete} disabled={actionLoading} className="btn" style={{ flex: 1, justifyContent: 'center', background: '#ef4444', color: '#fff' }}>
                {actionLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
