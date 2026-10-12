import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleTheme, setTheme, setPalette, increaseFontSize,
  decreaseFontSize, setLanguage, toggleSound
} from '../store/slices/uiSlice';
import { updateProfile } from '../store/slices/authSlice';
import { sounds } from '../utils/SoundEffects';
import { SUPPORTED_LANGUAGES, useTranslation } from '../i18n/translations';
import {
  User, Sun, Moon, Type, Globe, Bell, Shield, ShieldCheck,
  Volume2, VolumeX, CreditCard, Lock, Smartphone, Laptop,
  Check, Save, Sparkles, Sliders, Key, AlertCircle, CheckCircle2,
  Trash2, RefreshCw, Palette, Layers, Wallet, QrCode
} from 'lucide-react';

export default function SettingsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { theme, palette, fontSize, language, soundEnabled } = useSelector(s => s.ui);
  const { user } = useSelector(s => s.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [msg, setMsg] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(80);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Sarah Client',
    email: user?.email || 'client@freelancerhub.com',
    phone: user?.phone || '+91 98765 43210',
    bio: user?.bio || 'Senior Product Architect building scalable cloud & AI ecosystems.',
    country: user?.country || 'India',
    hourlyRate: user?.hourlyRate || 45,
    availability: user?.availability || 'AVAILABLE'
  });

  // Password state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // Notifications state
  const [notifSettings, setNotifSettings] = useState({
    projectUpdates: true,
    paymentAlerts: true,
    milestoneSubmissions: true,
    chatMessages: true,
    securityAlerts: true,
    weeklyDigest: false
  });

  // Payout info state
  const [payoutInfo, setPayoutInfo] = useState({
    upiId: 'sarah.client@okhdfcbank',
    bankAccount: '•••• •••• 8921',
    ifsc: 'HDFC0001234',
    taxId: '33AAAAA0000A1Z5'
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const showToast = (text) => {
    sounds.playSuccess();
    setMsg(text);
    setTimeout(() => setMsg(''), 3500);
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    sounds.playClick();
    await dispatch(updateProfile(profileForm));
    showToast('🎉 Profile information updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwords.new || passwords.new !== passwords.confirm) {
      alert('Passwords do not match');
      return;
    }
    sounds.playSuccess();
    setPasswords({ current: '', new: '', confirm: '' });
    showToast('Security password updated successfully!');
  };

  const testAudioTone = () => {
    sounds.playEscrowRelease();
  };

  const palettesList = [
    { id: 'aurora', name: 'Aurora Purple', primary: '#8b5cf6', accent: '#06b6d4', desc: 'Default Cyber Luxury' },
    { id: 'emerald', name: 'Emerald Escrow', primary: '#10b981', accent: '#f59e0b', desc: 'Secure & Balanced' },
    { id: 'sunset', name: 'Sunset Crimson', primary: '#f43f5e', accent: '#fb923c', desc: 'High Energy & Vibrant' },
    { id: 'ocean', name: 'Ocean Electric', primary: '#2563eb', accent: '#38bdf8', desc: 'Deep Tech & Modern' },
    { id: 'titanium', name: 'Titanium Slate', primary: '#3b82f6', accent: '#94a3b8', desc: 'Minimalist Monochrome' }
  ];

  const tabs = [
    { id: 'profile', label: t('profileAndKyc', 'Profile & Identity'), icon: User },
    { id: 'appearance', label: t('themeAndPalettes', 'Theme & Palettes'), icon: Palette },
    { id: 'typography', label: t('typographyAndScaling', 'Typography & Scaling'), icon: Type },
    { id: 'language', label: t('languageAndLocale', 'Language & Locale'), icon: Globe },
    { id: 'notifications', label: t('notificationAlerts', 'Notification Alerts'), icon: Bell },
    { id: 'security', label: t('securityAnd2FA', 'Security & 2FA'), icon: Lock },
    { id: 'sound', label: t('soundAndAudioFX', 'Sound & Audio FX'), icon: Volume2 },
    { id: 'payments', label: t('payoutsAndEscrowVault', 'Payouts & Escrow Vault'), icon: Wallet }
  ];

  return (
    <div style={{ maxWidth: 1120 }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Sliders size={13} /> {t('platformSettings', 'Platform Settings & Preferences')}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>{t('systemCustomizationCenter', 'System Customization Center')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('settingsSubtitle', 'Manage your personal profile, security credentials, dynamic themes, and payout channels')}</p>
        </div>
      </div>

      {msg && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={16} /> {msg}
        </div>
      )}

      {/* Main Settings Split View (Left Nav + Right Content) */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left Vertical Nav */}
        <div className="card" style={{ padding: '12px 8px', position: 'sticky', top: 90 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text4)', padding: '8px 14px 6px', letterSpacing: 0.5 }}>
            Settings Sections
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tabs.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { sounds.playClick(); setActiveTab(tab.id); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: active ? 'var(--primary-light)' : 'transparent',
                    color: active ? 'var(--primary)' : 'var(--text3)',
                    fontWeight: active ? 800 : 600,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    position: 'relative'
                  }}
                >
                  <tab.icon size={16} color={active ? 'var(--primary)' : 'var(--text3)'} />
                  <span>{tab.label}</span>
                  {active && (
                    <div style={{ position: 'absolute', right: 10, width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* TAB 1: PROFILE & IDENTITY */}
          {activeTab === 'profile' && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Profile & Public Identity</h3>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Update how other clients and freelancers see your credentials</p>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                  <div style={{ width: 68, height: 68, borderRadius: 20, background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800 }}>
                    {profileForm.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 800 }}>{profileForm.name}</h4>
                    <p style={{ fontSize: 12.5, color: 'var(--text3)' }}>Role: {user?.role || 'CLIENT'} • Trust Score: {user?.trustScore || 90}/100</p>
                    <span className="badge badge-verified" style={{ marginTop: 6, fontSize: 11 }}>
                      <ShieldCheck size={11} /> Escrow Verified Member
                    </span>
                  </div>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-input"
                      type="email"
                      value={profileForm.email}
                      disabled
                      style={{ opacity: 0.7 }}
                    />
                  </div>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      className="form-input"
                      value={profileForm.phone}
                      onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country / Region</label>
                    <input
                      className="form-input"
                      value={profileForm.country}
                      onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio & Executive Summary</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={profileForm.bio}
                    onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                  <button type="submit" className="btn btn-primary">
                    <Save size={15} /> Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: THEME & PALETTES */}
          {activeTab === 'appearance' && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Appearance & Themes</h3>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Choose light or dark mode and select your favorite color palette preset</p>
              </div>

              {/* Mode Toggle */}
              <div style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ marginBottom: 12 }}>Base Display Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div
                    onClick={() => { sounds.playClick(); dispatch(setTheme('dark')); }}
                    style={{
                      padding: 18,
                      borderRadius: 'var(--radius)',
                      background: '#070a12',
                      border: `2px solid ${theme === 'dark' ? 'var(--primary)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      color: 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Moon size={16} color="#8b5cf6" /> Cyber Obsidian (Dark)
                      </span>
                      {theme === 'dark' && <CheckCircle2 size={18} color="var(--primary)" />}
                    </div>
                    <p style={{ fontSize: 12, color: '#94a3b8' }}>High contrast dark theme tailored for prolonged focus</p>
                  </div>

                  <div
                    onClick={() => { sounds.playClick(); dispatch(setTheme('light')); }}
                    style={{
                      padding: 18,
                      borderRadius: 'var(--radius)',
                      background: '#ffffff',
                      border: `2px solid ${theme === 'light' ? 'var(--primary)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      color: '#0f172a'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Sun size={16} color="#fbbf24" /> Crisp Studio (Light)
                      </span>
                      {theme === 'light' && <CheckCircle2 size={18} color="var(--primary)" />}
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b' }}>Clean daylight theme with crisp clarity and shadows</p>
                  </div>
                </div>
              </div>

              {/* Palette Preset Swatches */}
              <div>
                <label className="form-label" style={{ marginBottom: 12 }}>Interactive Theme Color Presets</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {palettesList.map(p => {
                    const active = (palette || 'aurora') === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          sounds.playClick();
                          dispatch(setPalette(p.id));
                          showToast(`Activated ${p.name} palette!`);
                        }}
                        style={{
                          padding: 16,
                          borderRadius: 'var(--radius-sm)',
                          border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                          background: active ? 'var(--primary-light)' : 'var(--bg3)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: p.primary, border: '2px solid white' }} />
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: p.accent, border: '2px solid white' }} />
                          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginLeft: 'auto' }}>
                            {active && <Check size={14} color="var(--primary)" />}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: active ? 'var(--primary)' : 'var(--text)' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{p.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY & SCALING */}
          {activeTab === 'typography' && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Typography & Display Scaling</h3>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Adjust visual density and interface text sizing across the entire workspace</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: 18, background: 'var(--bg3)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Font Size Scale</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text3)' }}>Current active size: <strong style={{ color: 'var(--primary)' }}>{fontSize}px</strong></div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => dispatch(decreaseFontSize())}>A -</button>
                  <span style={{ padding: '6px 16px', background: 'var(--bg2)', borderRadius: 8, fontSize: 14, fontWeight: 800 }}>{fontSize}px</span>
                  <button className="btn btn-outline btn-sm" onClick={() => dispatch(increaseFontSize())}>A +</button>
                </div>
              </div>

              {/* Font Size Presets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { size: 12, label: 'Compact' },
                  { size: 14, label: 'Standard (Default)' },
                  { size: 16, label: 'Medium Large' },
                  { size: 18, label: 'High Readability' }
                ].map(item => (
                  <button
                    key={item.size}
                    onClick={() => {
                      sounds.playClick();
                      document.documentElement.style.setProperty('--font-size', `${item.size}px`);
                      localStorage.setItem('fontSize', item.size);
                      showToast(`Text size set to ${item.size}px`);
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: 10,
                      border: `1.5px solid ${fontSize === item.size ? 'var(--primary)' : 'var(--border)'}`,
                      background: fontSize === item.size ? 'var(--primary-light)' : 'var(--bg3)',
                      color: fontSize === item.size ? 'var(--primary)' : 'var(--text)',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    {item.label} ({item.size}px)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LANGUAGE & LOCALE */}
          {activeTab === 'language' && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>Multilingual & AI Assistant Locale ({SUPPORTED_LANGUAGES.length} Languages)</h3>
                  <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Select your primary interface language and voice speech synthesizer locale</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <Globe size={15} color="var(--primary)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                    Active: {SUPPORTED_LANGUAGES.find(l => l.code === language)?.native || 'English'} ({SUPPORTED_LANGUAGES.find(l => l.code === language)?.label || 'EN'})
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                {SUPPORTED_LANGUAGES.map(lang => {
                  const active = language === lang.code;
                  return (
                    <div
                      key={lang.code}
                      onClick={() => {
                        sounds.playClick();
                        dispatch(setLanguage(lang.code));
                        showToast(`Language switched to ${lang.native} (${lang.label})!`);
                      }}
                      style={{
                        padding: 18,
                        borderRadius: 'var(--radius)',
                        border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                        background: active ? 'var(--primary-light)' : 'var(--bg3)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        position: 'relative',
                        boxShadow: active ? '0 4px 16px var(--primary-glow)' : 'none',
                      }}
                    >
                      {active && (
                        <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div style={{ fontSize: 30, marginBottom: 6 }}>{lang.flag}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: active ? 'var(--primary)' : 'var(--text)' }}>
                        {lang.native}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginTop: 2 }}>{lang.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{lang.desc}</div>
                      <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 4, fontFamily: 'monospace' }}>Locale: {lang.locale}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Notification & Alert Preferences</h3>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Configure real-time push and email notifications for milestone events</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { key: 'projectUpdates', label: 'Project Status Updates', desc: 'Notifications when contracts change status or proposals are accepted.' },
                  { key: 'paymentAlerts', label: 'Escrow & Payment Deposits', desc: 'Instant alerts when funds are locked in vault or milestone payouts are released.' },
                  { key: 'milestoneSubmissions', label: 'Milestone Deliverable Submissions', desc: 'Alerts when code repos or designs are submitted for review.' },
                  { key: 'chatMessages', label: 'Workspace Direct Messages', desc: 'Sound and popup notifications for new partner chat messages.' },
                  { key: 'securityAlerts', label: 'Security & Login Alerts', desc: 'Immediate notification on unrecognized device login attempts.' },
                  { key: 'weeklyDigest', label: 'Weekly Performance Digest', desc: 'Email summary of earnings, proposals sent, and platform trust score.' }
                ].map(item => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 18px',
                      background: 'var(--bg3)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13.5 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{item.desc}</div>
                    </div>

                    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={notifSettings[item.key]}
                        onChange={() => {
                          sounds.playClick();
                          setNotifSettings({ ...notifSettings, [item.key]: !notifSettings[item.key] });
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: notifSettings[item.key] ? 'var(--primary)' : 'var(--bg4)',
                          borderRadius: 24,
                          transition: '0.2s'
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          content: '',
                          height: 18,
                          width: 18,
                          left: notifSettings[item.key] ? 23 : 3,
                          bottom: 3,
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.2s'
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & SESSIONS */}
          {activeTab === 'security' && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Account Security & Active Sessions</h3>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Update cryptographic credentials, enable two-factor authentication, and monitor sessions</p>
              </div>

              {/* Password change form */}
              <form onSubmit={handleChangePassword} style={{ marginBottom: 32 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Change Security Password</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 11.5 }}>Current Password</label>
                    <input
                      className="form-input"
                      type="password"
                      value={passwords.current}
                      onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11.5 }}>New Password</label>
                    <input
                      className="form-input"
                      type="password"
                      value={passwords.new}
                      onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="Min 8 characters"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11.5 }}>Confirm Password</label>
                    <input
                      className="form-input"
                      type="password"
                      value={passwords.confirm}
                      onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-outline btn-sm">
                  <Key size={13} /> Update Password
                </button>
              </form>

              {/* 2FA Toggle */}
              <div style={{ padding: 18, background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Shield size={16} color="var(--primary)" /> Two-Factor Authentication (2FA)
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                    Secure milestone releases with authenticator app cryptographic OTP verification.
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn btn-sm ${twoFactorEnabled ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => {
                    sounds.playClick();
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(twoFactorEnabled ? '2FA disabled' : '2FA Enabled with Authenticator App!');
                  }}
                >
                  {twoFactorEnabled ? <><Check size={13} /> 2FA Active</> : 'Enable 2FA'}
                </button>
              </div>

              {/* Active Sessions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800 }}>Active Logged-In Sessions</h4>
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => showToast('Terminated all remote sessions!')}>
                    Terminate Other Sessions
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg3)', borderRadius: 8, fontSize: 12.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Laptop size={16} color="var(--primary)" />
                      <div>
                        <strong>Windows PC (Chrome 128.0)</strong>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Current Session • IP: 106.51.24.18 (Chennai, India)</div>
                      </div>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: 10 }}>Active Now</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg3)', borderRadius: 8, fontSize: 12.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Smartphone size={16} color="var(--text3)" />
                      <div>
                        <strong>iPhone 15 Pro (Safari Mobile)</strong>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Last active 3 hours ago • IP: 106.51.24.20</div>
                      </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 11, fontWeight: 700 }} onClick={() => showToast('Session revoked.')}>
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SOUND & AUDIO FX */}
          {activeTab === 'sound' && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Sound Effects & Micro-Audio FX</h3>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Configure synthesizer sound effects for button clicks, messages, and milestone payouts</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: 18, background: 'var(--bg3)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {soundEnabled ? <Volume2 size={18} color="var(--primary)" /> : <VolumeX size={18} color="var(--text4)" />}
                    <span>UI Interaction Sounds</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 2 }}>
                    Synthesizes tone frequencies using Web Audio API (Zero audio lag).
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn btn-sm ${soundEnabled ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    dispatch(toggleSound());
                  }}
                >
                  {soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>

              {/* Volume Slider & Test Button */}
              <div style={{ padding: 18, background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0 }}>Master Audio Volume</label>
                  <strong style={{ color: 'var(--primary)' }}>{volumeLevel}%</strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumeLevel}
                  onChange={e => setVolumeLevel(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={testAudioTone}>
                    <Sparkles size={13} /> Test Milestone Chime
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: PAYOUTS & ESCROW VAULT */}
          {activeTab === 'payments' && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Payout Accounts & Smart Escrow Vault</h3>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Manage verified bank accounts, UPI IDs, and tax compliance registrations</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">Instant UPI ID (IMPS / VPA)</label>
                  <div style={{ position: 'relative' }}>
                    <QrCode size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text4)' }} />
                    <input
                      className="form-input"
                      value={payoutInfo.upiId}
                      onChange={e => setPayoutInfo({ ...payoutInfo, upiId: e.target.value })}
                      style={{ paddingLeft: 36 }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Linked Bank Account</label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text4)' }} />
                    <input
                      className="form-input"
                      value={payoutInfo.bankAccount}
                      onChange={e => setPayoutInfo({ ...payoutInfo, bankAccount: e.target.value })}
                      style={{ paddingLeft: 36 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="form-group">
                  <label className="form-label">Bank IFSC Code</label>
                  <input
                    className="form-input"
                    value={payoutInfo.ifsc}
                    onChange={e => setPayoutInfo({ ...payoutInfo, ifsc: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GSTIN / Tax Identification</label>
                  <input
                    className="form-input"
                    value={payoutInfo.taxId}
                    onChange={e => setPayoutInfo({ ...payoutInfo, taxId: e.target.value })}
                  />
                </div>
              </div>

              {/* Escrow guarantee note */}
              <div style={{ padding: '16px 20px', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <ShieldCheck size={24} color="var(--primary)" flexShrink={0} />
                <div style={{ fontSize: 12.5, color: 'var(--text)' }}>
                  All payout requests are processed automatically upon client milestone sign-off. Platform escrow guarantees 100% solvency under smart contract ledgers.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-primary" onClick={() => showToast('Payout details securely updated!')}>
                  <Save size={15} /> Save Payout Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
