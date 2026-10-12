import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import { useTranslation } from '../i18n/translations';
import {
  Star, ShieldCheck, Save, X, Sparkles, CheckCircle2,
  Award, Briefcase, DollarSign, Globe, User, Plus, Trash2
} from 'lucide-react';

const SKILL_SUGGESTIONS = ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Python', 'TailwindCSS', 'Figma', 'UI/UX', 'GraphQL', 'Next.js', 'AWS', 'Docker'];

export default function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    skills: user?.skills || ['React', 'Node.js', 'MongoDB'],
    experience: user?.experience || 4,
    hourlyRate: user?.hourlyRate || 35,
    availability: user?.availability || 'AVAILABLE',
    country: user?.country || 'India'
  });

  const [skillInput, setSkillInput] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const addSkill = (skillToAdd) => {
    const s = (skillToAdd || skillInput).trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skillToRemove) });
  };

  const handleSave = async () => {
    setSaving(true);
    await dispatch(updateProfile(form));
    setMsg('🎉 Profile & Trust score updated successfully!');
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Sparkles size={12} /> {t('autonomousReputationIndex', 'Autonomous Reputation & Trust Index')}
          </div>
          <h1>{t('profileTitle', 'Public Profile & Settings')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('profileSubtitle', 'Showcase your technical capabilities and build verified escrow credibility')}</p>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <><Save size={15} /> {t('saveChanges', 'Save Changes')}</>}
        </button>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Profile Header Hero Card */}
      <div className="card" style={{ marginBottom: 24, padding: '28px 32px' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 84, height: 84, borderRadius: 24, background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 32, fontWeight: 800, boxShadow: '0 8px 24px var(--primary-glow)' }}>
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{user?.name}</h2>
              {user?.isVerified && (
                <span className="badge badge-success">
                  <ShieldCheck size={12} /> {t('verifiedIdentity', 'Verified Identity')}
                </span>
              )}
              <span className="badge badge-purple">{user?.role}</span>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>{user?.email} • {form.country || 'India'}</p>

            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              <span className="badge badge-warning" style={{ fontSize: 12, padding: '4px 10px' }}>
                <Star size={13} fill="#f59e0b" color="#f59e0b" /> {user?.rating || 4.9} {t('rating', 'Rating')}
              </span>
              <span className="badge badge-purple" style={{ fontSize: 12, padding: '4px 10px' }}>
                <Award size={13} /> {t('trustScoreHeader', 'Trust Score')}: {user?.trustScore || 90}/100
              </span>
            </div>
          </div>
        </div>

        {/* Profile Strength Progress Bar */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
            <span style={{ color: 'var(--text3)', fontWeight: 600 }}>{t('profileStrength', 'Profile Strength & Escrow Eligibility')}</span>
            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>95% ({t('excellent', 'Excellent')})</span>
          </div>
          <div className="progress-bar" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: '95%' }} />
          </div>
        </div>
      </div>

      {/* Trust & Reputation Breakdown Grid */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ '--stat-color': '#10b981' }}>
          <div className="stat-icon" style={{ background: 'var(--success-light)' }}>
            <CheckCircle2 size={22} color="var(--success)" />
          </div>
          <div>
            <div className="stat-value">100%</div>
            <div className="stat-label">{t('milestoneSuccessRate', 'Milestone Success Rate')}</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#6366f1' }}>
          <div className="stat-icon" style={{ background: 'var(--primary-light)' }}>
            <ShieldCheck size={22} color="var(--primary)" />
          </div>
          <div>
            <div className="stat-value">0</div>
            <div className="stat-label">{t('escrowDisputesTab', 'Escrow Disputes')}</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#06b6d4' }}>
          <div className="stat-icon" style={{ background: 'var(--accent-light)' }}>
            <Briefcase size={22} color="var(--accent)" />
          </div>
          <div>
            <div className="stat-value">{form.experience || 4} {t('years', 'Years')}</div>
            <div className="stat-label">{t('verifiedExperience', 'Verified Experience')}</div>
          </div>
        </div>
      </div>

      {/* Edit Form Card */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>{t('personalProfessionalDetails', 'Personal & Professional Details')}</h3>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('fullName', 'Full Name')}</label>
            <input
              className="form-input"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('phoneNumber', 'Phone Number')}</label>
            <input
              className="form-input"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 9876543210"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('bioSummary', 'Bio & Professional Summary')}</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Describe your technical background, accomplishments, and preferred projects..."
          />
        </div>

        {user?.role === 'FREELANCER' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('experienceYears', 'Experience (Years)')}</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('hourlyRate', 'Hourly Rate ($ USD / ₹ INR Equivalent)')}</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  value={form.hourlyRate}
                  onChange={e => setForm({ ...form, hourlyRate: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('availabilityStatus', 'Availability Status')}</label>
              <select
                className="form-select"
                value={form.availability}
                onChange={e => setForm({ ...form, availability: e.target.value })}
              >
                <option value="AVAILABLE">🟢 {t('availableNewContracts', 'Available for new contracts')}</option>
                <option value="BUSY">🟡 {t('busyActiveMilestones', 'Busy on active milestones')}</option>
                <option value="UNAVAILABLE">🔴 {t('unavailable', 'Unavailable')}</option>
              </select>
            </div>

            {/* Skills Manager with Quick Add Chips */}
            <div className="form-group">
              <label className="form-label">{t('skillsTechStack', 'Skills & Tech Stack')}</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  className="form-input"
                  placeholder="Type a skill and press Enter..."
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button type="button" className="btn btn-secondary" onClick={() => addSkill()}>
                  <Plus size={15} /> {t('add', 'Add')}
                </button>
              </div>

              {/* Active Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {form.skills.map(s => (
                  <span
                    key={s}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 12px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      border: '1px solid rgba(99, 102, 241, 0.25)'
                    }}
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', padding: 0 }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Suggestions */}
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, marginBottom: 6 }}>{t('popularTechStacks', 'Popular Tech Stacks:')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 7).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill(s)}
                    style={{ padding: '3px 9px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 11, cursor: 'pointer', color: 'var(--text3)', fontWeight: 600 }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">{t('countryRegion', 'Country / Region')}</label>
          <input
            className="form-input"
            value={form.country}
            onChange={e => setForm({ ...form, country: e.target.value })}
            placeholder="India"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <><Save size={15} /> {t('saveAllChanges', 'Save All Changes')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
