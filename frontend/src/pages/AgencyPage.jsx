import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../i18n/translations';
import {
  Users, Plus, ShieldCheck, DollarSign, Award, Briefcase,
  Layers, CheckCircle2, TrendingUp, BarChart3, Mail, ArrowRight,
  Sparkles, Star, UserCheck, X
} from 'lucide-react';

const initialMembers = [
  { id: 1, name: 'Raj Freelancer', role: 'Lead Architect', skills: ['React', 'Node.js', 'MongoDB'], projects: 3, earnings: '₹140,000', rating: 4.9, status: 'Active' },
  { id: 2, name: 'Ananya Sharma', role: 'UI/UX Lead Designer', skills: ['Figma', 'Design Systems', 'Micro-animations'], projects: 2, earnings: '₹95,000', rating: 4.8, status: 'Active' },
  { id: 3, name: 'Karthik Raman', role: 'DevOps & Cloud Engineer', skills: ['AWS', 'Docker', 'Kubernetes'], projects: 2, earnings: '₹110,000', rating: 4.9, status: 'Active' },
  { id: 4, name: 'Priya Sundaram', role: 'AI & Data Specialist', skills: ['Python', 'NLP', 'FastAPI'], projects: 1, earnings: '₹75,000', rating: 4.7, status: 'Available' },
];

export default function AgencyPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [members, setMembers] = useState(initialMembers);
  const [modalOpen, setModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', skills: '', status: 'Active' });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;
    const member = {
      id: Date.now(),
      name: newMember.name,
      role: newMember.role,
      skills: newMember.skills.split(',').map(s => s.trim()),
      projects: 0,
      earnings: '₹0',
      rating: 5.0,
      status: newMember.status,
    };
    setMembers([member, ...members]);
    setNewMember({ name: '', role: '', skills: '', status: 'Active' });
    setModalOpen(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Sparkles size={12} /> {t('enterpriseWorkspace', 'Enterprise Agency Workspace')}
          </div>
          <h1>{t('agencyTitle', 'Agency & Team Management')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('agencySubtitle', 'Manage agency talent, allocate enterprise contracts, and track revenue splits')}</p>
        </div>

        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={15} /> {t('addAgencyTalent', '+ Add Agency Talent')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('agencyTalentRoster', 'AGENCY TALENT ROSTER')}</span>
            <div className="stat-icon stat-icon-purple"><Users size={20} /></div>
          </div>
          <div className="stat-value">{members.length} {t('members', 'Members')}</div>
          <div className="stat-footer stat-up"><UserCheck size={14} /> 100% {t('verifiedSpecialists', 'Verified Specialists')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('activeAgencyContracts', 'ACTIVE AGENCY CONTRACTS')}</span>
            <div className="stat-icon stat-icon-blue"><Briefcase size={20} /></div>
          </div>
          <div className="stat-value">8 {t('projects', 'Projects')}</div>
          <div className="stat-footer stat-up"><TrendingUp size={14} /> ₹420,000 {t('contractValue', 'Contract Value')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('totalAgencyRevenue', 'TOTAL AGENCY REVENUE')}</span>
            <div className="stat-icon stat-icon-emerald"><DollarSign size={20} /></div>
          </div>
          <div className="stat-value">₹850,000</div>
          <div className="stat-footer stat-up"><TrendingUp size={14} /> +24% {t('growthThisMonth', 'Growth this month')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('agencyTrustRating', 'AGENCY TRUST RATING')}</span>
            <div className="stat-icon stat-icon-amber"><Star size={20} /></div>
          </div>
          <div className="stat-value">4.9 / 5.0</div>
          <div className="stat-footer stat-up"><ShieldCheck size={14} /> {t('tier1TopRated', 'Top Rated Enterprise')}</div>
        </div>
      </div>

      {/* Team Roster Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t('agencyTableTitle', 'Agency Specialists & Deliverable Leads')}</h3>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>{t('assignTeamDesc', 'Assign team members to funded escrow client projects')}</p>
          </div>
          <span className="badge badge-purple">{members.length} {t('specialists', 'Specialists')}</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('specialistHeader', 'SPECIALIST')}</th>
                <th>{t('roleFocusHeader', 'ROLE / FOCUS')}</th>
                <th>{t('coreStackHeader', 'CORE STACK')}</th>
                <th>{t('activeProjectsHeader', 'ACTIVE PROJECTS')}</th>
                <th>{t('revenueGeneratedHeader', 'REVENUE GENERATED')}</th>
                <th>{t('ratingHeader', 'RATING')}</th>
                <th>{t('statusHeader', 'STATUS')}</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="user-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>specialist@{m.name.toLowerCase().replace(' ', '')}.com</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{m.role}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {m.skills.map((s, i) => <span key={i} className="tag">{s}</span>)}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{m.projects} {t('activeStatus', 'Active')}</td>
                  <td style={{ fontWeight: 800, color: 'var(--text)' }}>{m.earnings}</td>
                  <td>
                    <span className="badge badge-amber" style={{ gap: 4 }}>
                      <Star size={11} fill="#f59e0b" /> {m.rating}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${m.status === 'Active' ? 'badge-success' : 'badge-info'}`}>
                      {t(m.status === 'Active' ? 'activeStatus' : 'availableStatus', m.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>{t('addAgencyTalent', 'Add Agency Specialist')}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">{t('fullName', 'Full Name')}</label>
                <input className="form-input" required placeholder="e.g. Senthil Nathan" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
              </div>

              <div>
                <label className="form-label">{t('professionalRole', 'Professional Role')}</label>
                <input className="form-input" required placeholder="e.g. Senior Mobile Lead" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} />
              </div>

              <div>
                <label className="form-label">{t('skillsCommaSeparated', 'Skills (comma separated)')}</label>
                <input className="form-input" placeholder="e.g. React Native, Swift, Kotlin" value={newMember.skills} onChange={e => setNewMember({ ...newMember, skills: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>{t('cancel', 'Cancel')}</button>
                <button type="submit" className="btn btn-primary"><UserCheck size={15} /> {t('saveSpecialist', 'Save Specialist')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
