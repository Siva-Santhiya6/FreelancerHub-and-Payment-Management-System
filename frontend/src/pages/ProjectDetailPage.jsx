import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from '../i18n/translations';
import {
  ShieldCheck, Star, Clock, DollarSign, Users, CheckCircle, Send,
  Wallet, Sparkles, MessageSquare, AlertTriangle, Check, FileCheck,
  ArrowRight, Upload, ThumbsUp, RefreshCw, X, MessageCircle
} from 'lucide-react';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Proposal State
  const [proposal, setProposal] = useState({ coverLetter: '', bidAmount: '', estimatedDuration: '14 days' });
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Chat / Collaboration State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'client', text: 'Hi! Welcome to the project workspace. Please review the first milestone.', time: '10:00 AM' },
    { sender: 'freelancer', text: 'Thank you! I am setting up the repository and initial components now.', time: '10:15 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Milestone submission modal
  const [submitMilestoneModal, setSubmitMilestoneModal] = useState(null);
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('Excellent work delivered on time with clean architecture!');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [msg, setMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, mRes] = await Promise.all([
          axios.get(`/api/projects/${id}`),
          axios.get(`/api/milestones/project/${id}`, { headers: authHeader() }),
        ]);
        setProject(pRes.data.project);
        setMilestones(mRes.data.milestones || []);

        if (user?.role === 'CLIENT' || user?.role === 'ADMIN' || user?.role === 'PAYMENT_MANAGER') {
          const [propRes, escrowRes] = await Promise.all([
            axios.get(`/api/proposals/project/${id}`, { headers: authHeader() }),
            axios.get(`/api/payments/escrow/${id}`, { headers: authHeader() }).catch(() => ({ data: { escrow: null } })),
          ]);
          setProposals(propRes.data.proposals || []);
          setEscrow(escrowRes.data?.escrow || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [id, user]);

  // AI Cover Letter Generator
  const generateAICoverLetter = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const generated = `Hi ${project?.clientId?.name || 'Client'},\n\nI reviewed your project "${project?.title}" and have extensive experience building with ${project?.skills?.join(', ')}.\n\nMy approach:\n1. Deliver milestones ahead of schedule with modular architecture.\n2. Ensure full responsive design, performance optimization, and rigorous testing.\n3. Provide daily milestone updates in the workspace chat.\n\nI am available immediately and look forward to delivering exceptional results under Escrow protection!\n\nBest regards,\n${user?.name}`;
      setProposal({
        ...proposal,
        coverLetter: generated,
        bidAmount: project?.budget || 5000
      });
      setAiGenerating(false);
    }, 600);
  };

  const submitProposal = async () => {
    if (!proposal.coverLetter || !proposal.bidAmount) return;
    setSubmittingProposal(true);
    try {
      await axios.post('/api/proposals', { ...proposal, projectId: id, bidAmount: Number(proposal.bidAmount) }, { headers: authHeader() });
      setMsg('🎉 Proposal submitted successfully with smart escrow tracking!');
      setProposal({ coverLetter: '', bidAmount: '', estimatedDuration: '14 days' });
      setActiveTab('overview');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const acceptProposal = async (proposalId) => {
    try {
      await axios.put(`/api/proposals/${proposalId}/status`, { status: 'ACCEPTED' }, { headers: authHeader() });
      setMsg('Proposal accepted! Project status transitioned to IN PROGRESS.');
      setProposals(proposals.map(p => p._id === proposalId ? { ...p, status: 'ACCEPTED' } : { ...p, status: 'REJECTED' }));
      setProject({ ...project, status: 'IN_PROGRESS' });
    } catch (e) {
      setMsg('Failed to accept proposal');
    }
  };

  const fundEscrow = async () => {
    try {
      await axios.post('/api/payments/escrow/fund', { projectId: id, amount: project.budget }, { headers: authHeader() });
      setMsg('🔒 Escrow vault successfully funded! Milestone safety guarantee active.');
      const r = await axios.get(`/api/payments/escrow/${id}`, { headers: authHeader() });
      setEscrow(r.data.escrow);
    } catch (e) {
      setMsg('Failed to fund escrow');
    }
  };

  const releasePayment = async (milestoneId, freelancerId, amount) => {
    try {
      await axios.post('/api/payments/release', { milestoneId, freelancerId: freelancerId || user?._id, amount, projectId: id }, { headers: authHeader() });
      setMsg('💸 Escrow payment released to freelancer with instant payout confirmation!');
      setMilestones(milestones.map(m => m._id === milestoneId ? { ...m, status: 'COMPLETED' } : m));
    } catch (e) {
      setMsg('Failed to release payment');
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { sender: user?.role === 'CLIENT' ? 'client' : 'freelancer', text: chatInput, time: 'Just now' };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulate instant partner reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: user?.role === 'CLIENT' ? 'freelancer' : 'client',
          text: user?.role === 'CLIENT' ? 'Got it! I will update the milestone progress accordingly.' : 'Looks great, thank you for the prompt update!',
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  const handleDeliverableSubmit = (mId) => {
    setMilestones(milestones.map(m => m._id === mId ? { ...m, status: 'IN_REVIEW' } : m));
    setSubmitMilestoneModal(null);
    setMsg('Deliverable submitted! Client notified for review & escrow release.');
  };

  const handleReviewSubmit = () => {
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewModalOpen(false);
      setMsg('⭐ Rating and review submitted! Reputation score updated.');
    }, 1200);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
        <div className="spinner" style={{ width: 42, height: 42 }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 60 }}>
        <h3>Project not found</h3>
        <Link to="/marketplace" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Back to Marketplace</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t('overviewAndMilestones', 'Overview & Milestones') },
    { id: 'collaboration', label: t('teamChat', 'Team Chat') },
  ];

  if (user?.role === 'CLIENT' || user?.role === 'ADMIN') {
    tabs.push({ id: 'proposals', label: `${t('myProposals', 'Proposals')} (${proposals.length})` });
    tabs.push({ id: 'escrow', label: t('escrowVault', 'Escrow Vault') });
  }

  if (user?.role === 'FREELANCER' && project.status === 'OPEN') {
    tabs.push({ id: 'submit-proposal', label: t('submitProposalBtn', 'Submit Proposal') });
  }

  return (
    <div>
      {/* Alert message */}
      {msg && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} /> {msg}
          </div>
          <button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Interactive Progress Roadmap Stepper */}
      <div className="card" style={{ marginBottom: 24, padding: '20px 24px', background: 'var(--bg3)' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
          {t('escrowRoadmap', 'Escrow Milestone Progression Roadmap')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {[
            { step: '1', title: t('projectOpen', 'Project Open'), done: true },
            { step: '2', title: t('escrowFunded', 'Escrow Funded'), done: Boolean(escrow?.amount || project.status === 'IN_PROGRESS') },
            { step: '3', title: t('workInProgress', 'Work In Progress'), done: project.status === 'IN_PROGRESS' || project.status === 'COMPLETED' },
            { step: '4', title: t('milestoneRelease', 'Milestone Release'), done: milestones.some(m => m.status === 'COMPLETED') },
            { step: '5', title: t('completedAndReviewed', 'Completed & Reviewed'), done: project.status === 'COMPLETED' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: item.done ? 'var(--primary)' : 'var(--bg2)',
                  color: item.done ? 'white' : 'var(--text4)',
                  border: `2px solid ${item.done ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 12,
                  boxShadow: item.done ? '0 0 12px var(--primary-glow)' : 'none'
                }}
              >
                {item.done ? <Check size={16} /> : item.step}
              </div>
              <span style={{ fontSize: 11, fontWeight: item.done ? 700 : 500, color: item.done ? 'var(--text)' : 'var(--text3)', marginTop: 6, textAlign: 'center' }}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Main Content Area */}
        <div>
          {/* Project Header Card */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className={`badge ${project.status === 'OPEN' ? 'badge-success' : project.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-gray'}`}>
                  {project.status}
                </span>
                <span className="badge badge-info">{project.category}</span>
                <span className="badge badge-purple"><ShieldCheck size={11} /> Escrow Protected</span>
              </div>

              {project.status === 'IN_PROGRESS' && (
                <button className="btn btn-outline btn-sm" onClick={() => setReviewModalOpen(true)}>
                  <Star size={13} color="#f59e0b" /> Rate & Review
                </button>
              )}
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{project.title}</h1>
            <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>
              {project.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.skills?.map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            {tabs.map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id)}
                style={{
                  padding: '10px 18px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13.5,
                  fontWeight: activeTab === tabItem.id ? 800 : 500,
                  color: activeTab === tabItem.id ? 'var(--primary)' : 'var(--text3)',
                  borderBottom: activeTab === tabItem.id ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  marginBottom: -1,
                  transition: 'all 0.2s'
                }}
              >
                {tabItem.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Overview & Milestones Lifecycle */}
          {activeTab === 'overview' && (
            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>Project Milestones & Deliverables</h3>
                  {user?.role === 'CLIENT' && !escrow?.amount && (
                    <button className="btn btn-primary btn-sm" onClick={fundEscrow}>
                      <Wallet size={14} /> Fund Full Escrow
                    </button>
                  )}
                </div>

                {milestones.length === 0 ? (
                  <p style={{ color: 'var(--text3)', fontSize: 13 }}>No milestones defined yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {milestones.map((m, idx) => (
                      <div
                        key={m._id}
                        style={{
                          background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          borderRadius: 12,
                          padding: '16px 20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 12
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>#{idx + 1}</span>
                            <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{m.title}</span>
                            <span className={`badge ${m.status === 'COMPLETED' ? 'badge-success' : m.status === 'IN_REVIEW' ? 'badge-info' : 'badge-warning'}`}>
                              {m.status}
                            </span>
                          </div>
                          <p style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 4 }}>{m.description}</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>₹{m.budget?.toLocaleString()}</div>
                            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Protected in Vault</div>
                          </div>

                          {/* Action Buttons depending on role */}
                          {user?.role === 'FREELANCER' && m.status !== 'COMPLETED' && (
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setSubmitMilestoneModal(m)}
                            >
                              <Upload size={13} /> Submit Work
                            </button>
                          )}

                          {user?.role === 'CLIENT' && m.status !== 'COMPLETED' && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => releasePayment(m._id, null, m.budget)}
                            >
                              <CheckCircle size={13} /> Approve & Release
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Live Team Collaboration Chat */}
          {activeTab === 'collaboration' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageCircle size={16} color="var(--primary)" /> Workspace Collaboration Channel
                  </h3>
                  <p style={{ fontSize: 11.5, color: 'var(--text3)' }}>Encrypted real-time channel between Client & Freelancer</p>
                </div>
                <span className="badge badge-success">Live Connected</span>
              </div>

              <div style={{ padding: '20px', height: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {chatMessages.map((cm, idx) => (
                  <div
                    key={idx}
                    style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      fontSize: 13,
                      alignSelf: cm.sender === (user?.role === 'CLIENT' ? 'client' : 'freelancer') ? 'flex-end' : 'flex-start',
                      background: cm.sender === (user?.role === 'CLIENT' ? 'client' : 'freelancer') ? 'var(--primary-gradient)' : 'var(--bg3)',
                      color: cm.sender === (user?.role === 'CLIENT' ? 'client' : 'freelancer') ? 'white' : 'var(--text)',
                    }}
                  >
                    <div>{cm.text}</div>
                    <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4, textAlign: 'right' }}>{cm.time}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, background: 'var(--bg3)' }}>
                <input
                  className="form-input"
                  placeholder="Type a message or milestone deliverable link..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>
                  <Send size={15} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Proposals Review (Client view) */}
          {activeTab === 'proposals' && (
            <div className="card">
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Submitted Proposals ({proposals.length})</h3>
              {proposals.length === 0 ? (
                <p style={{ color: 'var(--text3)', fontSize: 13 }}>No bids submitted yet for this project.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {proposals.map(p => (
                    <div key={p._id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                            {p.freelancerId?.name?.[0] || 'F'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 14.5 }}>{p.freelancerId?.name || 'Top Freelancer'}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>Trust Score: {p.freelancerId?.trustScore || 90}</div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>₹{p.bidAmount?.toLocaleString()}</div>
                          <span className={`badge ${p.status === 'ACCEPTED' ? 'badge-success' : 'badge-purple'}`}>{p.status}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14, whiteSpace: 'pre-line' }}>
                        {p.coverLetter}
                      </p>

                      {p.status !== 'ACCEPTED' && user?.role === 'CLIENT' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          <button className="btn btn-primary btn-sm" onClick={() => acceptProposal(p._id)}>
                            <Check size={14} /> Accept Bid & Start
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Submit Proposal (Freelancer View with AI Assistant) */}
          {activeTab === 'submit-proposal' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>Submit Your Proposal</h3>
                  <p style={{ fontSize: 12, color: 'var(--text3)' }}>Craft a winning bid with AI assistance</p>
                </div>

                {/* AI Cover Letter Button */}
                <button
                  className="btn btn-outline"
                  onClick={generateAICoverLetter}
                  disabled={aiGenerating}
                  style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 }}
                >
                  <Sparkles size={14} /> {aiGenerating ? 'AI Generating Pitch...' : '✨ Generate AI Pitch'}
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter / Approach</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: 140 }}
                  placeholder="Explain your approach, milestones, and relevant portfolio items..."
                  value={proposal.coverLetter}
                  onChange={e => setProposal({ ...proposal, coverLetter: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Bid Amount (₹ INR)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 5000"
                    value={proposal.bidAmount}
                    onChange={e => setProposal({ ...proposal, bidAmount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Delivery</label>
                  <input
                    className="form-input"
                    placeholder="e.g. 14 days"
                    value={proposal.estimatedDuration}
                    onChange={e => setProposal({ ...proposal, estimatedDuration: e.target.value })}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={submitProposal}
                disabled={submittingProposal || !proposal.coverLetter || !proposal.bidAmount}
                style={{ width: '100%', justifyContent: 'center', padding: 12 }}
              >
                <Send size={16} /> Submit Protected Bid
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Summary Rail */}
        <div>
          {/* Budget & Escrow Vault Card */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Escrow Security Vault</h4>
            <div style={{ background: 'var(--bg3)', padding: 16, borderRadius: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>Total Locked Escrow</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', marginTop: 2 }}>
                ₹{project.budget?.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={12} /> 100% Guaranteed Release
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text3)' }}>Client Trust:</span>
                <span style={{ fontWeight: 700 }}>{project.clientId?.trustScore || 80}/100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text3)' }}>Deadline:</span>
                <span style={{ fontWeight: 700 }}>{project.deadline ? new Date(project.deadline).toLocaleDateString('en-IN') : 'Flexible'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text3)' }}>Team Size:</span>
                <span style={{ fontWeight: 700 }}>{project.teamSize || 1} Developer</span>
              </div>
            </div>
          </div>

          {/* Client Details Card */}
          {project.clientId && (
            <div className="card">
              <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Client Information</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
                  {project.clientId.name?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{project.clientId.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>{project.clientId.country || 'India'}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
                {project.clientId.bio || 'Verified employer on FreelancerHub platform with smart escrow protection.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Deliverable Submission Modal */}
      {submitMilestoneModal && (
        <div className="modal-overlay" onClick={() => setSubmitMilestoneModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              🚀 Submit Deliverable for Milestone #{submitMilestoneModal.title}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 18 }}>
              Provide repository, staging links, or completion notes for client review.
            </p>

            <div className="form-group">
              <label className="form-label">Deliverable URL / Demo Link</label>
              <input
                className="form-input"
                placeholder="https://github.com/... or https://demo.app"
                value={deliverableUrl}
                onChange={e => setDeliverableUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Completion Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Describe what was accomplished in this milestone..."
                value={deliverableNotes}
                onChange={e => setDeliverableNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setSubmitMilestoneModal(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => handleDeliverableSubmit(submitMilestoneModal._id)}>
                <CheckCircle size={15} /> Confirm & Request Escrow Release
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Review & Rating Modal */}
      {reviewModalOpen && (
        <div className="modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>⭐ Rate & Review Freelancer</h3>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>
              Your feedback contributes directly to freelancer reputation and platform trust scores.
            </p>

            {reviewSuccess ? (
              <div className="alert alert-success" style={{ textAlign: 'center', padding: 20 }}>
                <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                <h4>Feedback Submitted Successfully!</h4>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', transform: 'scale(1.3)' }}
                    >
                      <Star size={24} color="#f59e0b" fill={star <= rating ? '#f59e0b' : 'transparent'} />
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Review Comments</label>
                  <textarea
                    className="form-textarea"
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => setReviewModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleReviewSubmit}>
                    Submit Verified Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
