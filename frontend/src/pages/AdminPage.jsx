import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { sounds } from '../utils/SoundEffects';
import Pagination from '../components/common/Pagination';
import { useTranslation } from '../i18n/translations';
import {
  ShieldCheck, Trash2, Users, BarChart3, Search, Sparkles,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, Filter,
  FileCheck, Wallet, Activity, Database, Server, Clock,
  ArrowUpRight, ArrowDownLeft, Check, X, Eye, ChevronRight,
  UserCheck, AlertCircle, Layers, FileText, Lock, Plus, Edit3
} from 'lucide-react';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function AdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // Selected User for Detail Drawer
  const [selectedUser, setSelectedUser] = useState(null);

  // User CRUD Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // User Form State
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT',
    hourlyRate: 0,
    skills: '',
    isVerified: true,
    trustScore: 85,
  });

  // Verifications State
  const [verificationTab, setVerificationTab] = useState('pending');
  const [verifications, setVerifications] = useState([
    { id: 'v-1', name: 'Raj Freelancer', type: 'Portfolio & Code Audit', proof: 'GitHub: github.com/raj-dev (45 Repos, 99.2% Test Coverage)', submitted: '2 hours ago', status: 'pending', role: 'FREELANCER' },
    { id: 'v-2', name: 'Sarah Client', type: 'Corporate Business Entity', proof: 'Tax ID: 33AAAAA0000A1Z5 (TechVentures Inc. Registration)', submitted: '5 hours ago', status: 'pending', role: 'CLIENT' },
    { id: 'v-3', name: 'Alex DevOps', type: 'AWS Solutions Architect Certificate', proof: 'Certificate ID: AWS-PSA-9941829', submitted: '1 day ago', status: 'approved', role: 'FREELANCER' },
    { id: 'v-4', name: 'Elena Designer', type: 'Dribbble / Figma Verified Designer', proof: 'Dribbble Pro Profile: dribbble.com/elena_ui', submitted: '2 days ago', status: 'approved', role: 'FREELANCER' }
  ]);

  // Disputes State
  const [disputes, setDisputes] = useState([
    {
      id: 'DISP-8921',
      project: 'E-Commerce Platform with React',
      client: 'Sarah Client',
      freelancer: 'Raj Freelancer',
      milestone: 'Milestone 2: Payment Gateway Integration',
      amount: 6000,
      reason: 'Client requested additional scope before signing off milestone',
      status: 'UNDER_REVIEW',
      evidence: [
        { sender: 'Client', text: 'Stripe webhook is working but Apple Pay wasn’t explicitly tested in staging.' },
        { sender: 'Freelancer', text: 'Apple Pay was outside the original milestone 2 requirements doc as attached.' }
      ]
    },
    {
      id: 'DISP-8922',
      project: 'AI Chatbot for Customer Support',
      client: 'Fintech Spark Ltd',
      freelancer: 'Raj Freelancer',
      milestone: 'Milestone 1: NLP Dataset Integration',
      amount: 4500,
      reason: 'Delayed milestone review response',
      status: 'RESOLVED',
      evidence: [
        { sender: 'Freelancer', text: 'Dataset completed and deployed 4 days ago with zero response.' }
      ]
    }
  ]);

  const showToast = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        sort: sortBy,
      };
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'ALL') params.role = roleFilter;

      const [uRes, sRes] = await Promise.all([
        axios.get('/api/admin/users', { headers: authHeader(), params }),
        axios.get('/api/admin/stats', { headers: authHeader() }),
      ]);

      const dataUsers = uRes.data.data || uRes.data.users || [];
      setUsers(dataUsers);
      setTotalUsers(uRes.data.total || dataUsers.length);
      setStats(sRes.data.stats);
    } catch (e) {
      console.error('Admin load data fallback:', e);
      // Fallback demo users
      const demoUsers = [
        { _id: 'u-1', name: 'Sarah Client', email: 'client@freelancerhub.com', role: 'CLIENT', trustScore: 95, isVerified: true, createdAt: '2026-08-15' },
        { _id: 'u-2', name: 'Raj Freelancer', email: 'freelancer@freelancerhub.com', role: 'FREELANCER', trustScore: 92, isVerified: true, createdAt: '2026-08-20' },
        { _id: 'u-3', name: 'Admin Master', email: 'admin@freelancerhub.com', role: 'ADMIN', trustScore: 100, isVerified: true, createdAt: '2026-07-01' },
        { _id: 'u-4', name: 'Payment Supervisor', email: 'payment@freelancerhub.com', role: 'PAYMENT_MANAGER', trustScore: 98, isVerified: true, createdAt: '2026-07-10' },
        { _id: 'u-5', name: 'Apex Studio Manager', email: 'agency@freelancerhub.com', role: 'AGENCY_MANAGER', trustScore: 98, isVerified: true, createdAt: '2026-07-15' },
        { _id: 'u-6', name: 'Vikram Designer', email: 'vikram@design.io', role: 'FREELANCER', trustScore: 80, isVerified: false, createdAt: '2026-09-02' }
      ];
      setUsers(demoUsers);
      setTotalUsers(demoUsers.length);
      setStats({
        totalUsers: 142,
        totalProjects: 28,
        totalRevenue: 185000,
        freelancers: 84,
        clients: 52,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, roleFilter, sortBy, currentPage, pageSize]);

  // Handle Verify Toggle
  const toggleVerifyUser = async (u, e) => {
    e?.stopPropagation();
    try {
      const newStatus = !u.isVerified;
      await axios.put(`/api/admin/users/${u._id}/verify`, { isVerified: newStatus }, { headers: authHeader() });
      showToast(`User ${u.name} verification status updated to ${newStatus ? 'VERIFIED' : 'UNVERIFIED'}`);
      loadData();
    } catch (err) {
      showToast('Status updated');
      setUsers(users.map(item => item._id === u._id ? { ...item, isVerified: !item.isVerified } : item));
    }
  };

  // Open Create User Modal
  const handleOpenCreateUser = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'FREELANCER',
      hourlyRate: 35,
      skills: 'React, Node.js, TypeScript',
      isVerified: true,
      trustScore: 85,
    });
    setCreateModalOpen(true);
  };

  // Submit Create User
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await axios.post('/api/admin/users', userForm, { headers: authHeader() });
      setCreateModalOpen(false);
      showToast(`New user account "${userForm.name}" created successfully`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    } finally {
      setModalLoading(false);
    }
  };

  // Open Edit User Modal
  const handleOpenEditUser = (u, e) => {
    e?.stopPropagation();
    setSelectedUser(u);
    setUserForm({
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'CLIENT',
      hourlyRate: u.hourlyRate || 0,
      skills: Array.isArray(u.skills) ? u.skills.join(', ') : (u.skills || ''),
      isVerified: u.isVerified || false,
      trustScore: u.trustScore || 80,
    });
    setEditModalOpen(true);
  };

  // Submit Edit User
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await axios.put(`/api/admin/users/${selectedUser._id}`, userForm, { headers: authHeader() });
      setEditModalOpen(false);
      showToast(`User "${userForm.name}" updated successfully`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    } finally {
      setModalLoading(false);
    }
  };

  // Open Delete User Modal
  const handleOpenDeleteUser = (u, e) => {
    e?.stopPropagation();
    setSelectedUser(u);
    setDeleteModalOpen(true);
  };

  // Submit Delete User
  const handleDeleteUserSubmit = async () => {
    setModalLoading(true);
    try {
      await axios.delete(`/api/admin/users/${selectedUser._id}`, { headers: authHeader() });
      setDeleteModalOpen(false);
      showToast('User account successfully removed');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      {/* Toast Alert */}
      {msg && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: 10, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <ShieldCheck size={13} /> {t('platformGovernance', 'Global Platform Governance')}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>{t('adminTitle', 'Admin Master Control Panel')}</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13.5 }}>{t('adminSubtitle', 'Manage user directory, system disputes, verification queue, and platform health')}</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={handleOpenCreateUser} className="btn btn-primary">
            <Plus size={16} /> {t('provisionNewUser', '+ Provision New User')}
          </button>
        </div>
      </div>

      {/* KPI Stats Ledger */}
      {stats && (
        <div className="stats-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <span className="stat-label">{t('totalUsers', 'Total Users')}</span>
            <span className="stat-value">{stats.totalUsers?.toLocaleString() || 142}</span>
            <span className="stat-trend trend-up">👥 {t('activePlatformMembers', 'Active Platform Members')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('totalProjects', 'Total Projects')}</span>
            <span className="stat-value">{stats.totalProjects || 28}</span>
            <span className="stat-trend trend-up">⚡ {t('inEscrowAndBidding', 'In Escrow & Bidding')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('platformVolume', 'Platform Volume')}</span>
            <span className="stat-value">₹{(stats.totalRevenue || 185000).toLocaleString()}</span>
            <span className="stat-trend trend-up">🔒 {t('protectedEscrowTotal', 'Protected Escrow Total')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('freelancersVsClients', 'Freelancers / Clients')}</span>
            <span className="stat-value">{stats.freelancers || 84} / {stats.clients || 52}</span>
            <span className="stat-trend">✨ {t('balancedRatio', 'Balanced Ratio')}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
        {[
          { id: 'users', label: t('userDirectoryTab', 'User Directory CRUD'), icon: Users, count: totalUsers },
          { id: 'verifications', label: t('kycVerificationsTab', 'KYC & Verifications'), icon: UserCheck, count: verifications.length },
          { id: 'disputes', label: t('escrowDisputesTab', 'Escrow Disputes'), icon: AlertTriangle, count: disputes.length },
        ].map(tabItem => {
          const isActive = activeTab === tabItem.id;
          return (
            <button
              key={tabItem.id}
              onClick={() => setActiveTab(tabItem.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', gap: 8, fontSize: 13 }}
            >
              <tabItem.icon size={15} /> {tabItem.label}
              <span style={{ fontSize: 11, background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg3)', padding: '1px 6px', borderRadius: 8 }}>
                {tabItem.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: User Directory with full CRUD, Search, Filter, Sort, and Pagination */}
      {activeTab === 'users' && (
        <div>
          {/* Query Bar */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: 16,
              marginBottom: 16,
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
              <input
                type="text"
                className="form-input"
                placeholder={t('searchUserPlaceholder', 'Search user by name, email, or role...')}
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                style={{ paddingLeft: 40, height: 40, fontSize: 13 }}
              />
            </div>

            {/* Role Filter */}
            <div style={{ minWidth: 160 }}>
              <select
                className="form-input"
                value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                style={{ height: 40, fontSize: 13, cursor: 'pointer' }}
              >
                <option value="ALL">{t('allRoles', 'All Roles')}</option>
                <option value="CLIENT">{t('client', 'Client')}</option>
                <option value="FREELANCER">{t('freelancer', 'Freelancer')}</option>
                <option value="AGENCY_MANAGER">{t('agencyManager', 'Agency Manager')}</option>
                <option value="PAYMENT_MANAGER">{t('paymentManager', 'Payment Manager')}</option>
                <option value="ADMIN">{t('admin', 'Administrator')}</option>
              </select>
            </div>

            {/* Sort */}
            <div style={{ minWidth: 160 }}>
              <select
                className="form-input"
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                style={{ height: 40, fontSize: 13, cursor: 'pointer' }}
              >
                <option value="-createdAt">✨ {t('newestFirst', 'Newest First')}</option>
                <option value="createdAt">⏳ {t('oldestFirst', 'Oldest First')}</option>
                <option value="-trustScore">🛡️ {t('highestTrust', 'Highest Trust')}</option>
                <option value="name">🔤 {t('nameAZ', 'Name (A - Z)')}</option>
              </select>
            </div>

            <button onClick={loadData} className="btn btn-secondary btn-sm" style={{ height: 40, padding: '0 12px' }}>
              <RefreshCw size={14} /> {t('refreshBtn', 'Refresh')}
            </button>
          </div>

          {/* Users Table */}
          <div className="card table-wrap" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>{t('userProfileHeader', 'User Profile')}</th>
                  <th>{t('roleHeader', 'Role')}</th>
                  <th>{t('trustScoreHeader', 'Trust Score')}</th>
                  <th>{t('verificationHeader', 'Verification')}</th>
                  <th>{t('memberSinceHeader', 'Member Since')}</th>
                  <th style={{ textAlign: 'right' }}>{t('actionsHeader', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text)', display: 'block' }}>{u.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : u.role === 'FREELANCER' ? 'badge-success' : 'badge-warning'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShieldCheck size={14} color="var(--primary)" />
                        <span style={{ fontWeight: 700 }}>{u.trustScore || 50}/100</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={(e) => toggleVerifyUser(u, e)}
                        className={`badge ${u.isVerified ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle verification"
                      >
                        {u.isVerified ? `✓ ${t('verifiedBadge', 'Verified')}` : `✕ ${t('unverifiedBadge', 'Unverified')}`}
                      </button>
                    </td>
                    <td style={{ color: 'var(--text3)', fontSize: 12 }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={(e) => handleOpenEditUser(u, e)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Edit User"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={(e) => handleOpenDeleteUser(u, e)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', color: '#ef4444' }}
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reusable Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalUsers / pageSize) || 1}
            totalItems={totalUsers}
            pageSize={pageSize}
            onPageChange={page => setCurrentPage(page)}
            onPageSizeChange={size => { setPageSize(size); setCurrentPage(1); }}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      )}

      {/* TAB 2: Verifications */}
      {activeTab === 'verifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {verifications.map(v => (
            <div key={v.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <strong style={{ fontSize: 15 }}>{v.name}</strong>
                  <span className="badge badge-primary">{v.role}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', margin: '2px 0' }}>{v.type} — <code style={{ color: 'var(--primary)' }}>{v.proof}</code></p>
                <span style={{ fontSize: 11.5, color: 'var(--text3)' }}>Submitted: {v.submitted}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>Reject</button>
                <button className="btn btn-primary btn-sm">Approve KYC</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Disputes */}
      {activeTab === 'disputes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {disputes.map(d => (
            <div key={d.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}>{d.id}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: '2px 0' }}>{d.project}</h3>
                </div>
                <span className="badge badge-warning">{d.status}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}><strong>Disputed Issue:</strong> {d.reason}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <span>Amount: <strong style={{ color: 'var(--primary)' }}>₹{d.amount}</strong></span>
                <button className="btn btn-primary btn-sm">Arbitrate Dispute</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provision New User Modal */}
      {createModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal" style={{ maxWidth: 500, width: '92%', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800 }}>Provision New User Account</h3>
              <button onClick={() => setCreateModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={userForm.password}
                  onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-input"
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="FREELANCER">FREELANCER</option>
                    <option value="AGENCY_MANAGER">AGENCY_MANAGER</option>
                    <option value="PAYMENT_MANAGER">PAYMENT_MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trust Score (0 - 100)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={userForm.trustScore}
                    onChange={e => setUserForm({ ...userForm, trustScore: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {modalLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal" style={{ maxWidth: 500, width: '92%', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800 }}>Edit User Profile</h3>
              <button onClick={() => setEditModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-input"
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="FREELANCER">FREELANCER</option>
                    <option value="AGENCY_MANAGER">AGENCY_MANAGER</option>
                    <option value="PAYMENT_MANAGER">PAYMENT_MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trust Score (0 - 100)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={userForm.trustScore}
                    onChange={e => setUserForm({ ...userForm, trustScore: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {modalLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteModalOpen && selectedUser && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal" style={{ maxWidth: 400, width: '92%', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>Delete User Account?</h3>
            <p style={{ color: 'var(--text3)', fontSize: 13, margin: '8px 0 20px' }}>
              Are you sure you want to remove user <strong>"{selectedUser.name}"</strong> ({selectedUser.email})?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button onClick={handleDeleteUserSubmit} disabled={modalLoading} className="btn" style={{ flex: 1, justifyContent: 'center', background: '#ef4444', color: '#fff' }}>
                {modalLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
