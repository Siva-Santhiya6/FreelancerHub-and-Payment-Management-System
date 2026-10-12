import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toggleTheme, toggleSidebar, setLanguage } from '../store/slices/uiSlice';
import { useTranslation, SUPPORTED_LANGUAGES } from '../i18n/translations';
import AIWidget from '../components/ai/AIWidget';
import {
  LayoutDashboard, Search, Briefcase, Plus, CreditCard, FileText,
  Users, Scale, Award, BarChart3, Lock, Clock, MessageSquare,
  Globe, Sun, Moon, Bell, CheckCheck, X, ShieldCheck, User,
  Settings, LogOut, Sparkles, Building, ReceiptText, Wallet,
  Layers, ChevronRight, Activity, Shield
} from 'lucide-react';

const getRoleNav = (role, t) => {
  const configs = {
    CLIENT: [
      { section: t('workspaceAndContracts', 'WORKSPACE & CONTRACTS'), items: [
        { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard', 'Dashboard') },
        { to: '/marketplace', icon: Search, label: t('marketplace', 'Marketplace') },
        { to: '/projects/create', icon: Plus, label: t('postProject', 'Post Project') },
        { to: '/my-projects', icon: Briefcase, label: t('myProjects', 'My Projects') },
        { to: '/contracts', icon: Lock, label: t('contractsAndNda', 'Contracts & NDA') },
      ]},
      { section: t('financeAndEscrow', 'FINANCE & ESCROW'), items: [
        { to: '/payments', icon: CreditCard, label: t('paymentsAndEscrow', 'Payments & Escrow') },
        { to: '/invoices', icon: ReceiptText, label: t('invoicesAndBilling', 'Invoices & Billing') },
        { to: '/disputes', icon: Scale, label: t('disputesAndClaims', 'Disputes & Claims') },
        { to: '/analytics', icon: BarChart3, label: t('revenueAnalytics', 'Financial Analytics') },
      ]},
      { section: t('communication', 'COMMUNICATION'), items: [
        { to: '/messages', icon: MessageSquare, label: t('directMessages', 'Direct Messages') },
        { to: '/community', icon: Globe, label: t('communityHub', 'Community Hub') },
      ]}
    ],
    FREELANCER: [
      { section: t('workspaceAndJobs', 'WORKSPACE & JOBS'), items: [
        { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard', 'Dashboard') },
        { to: '/marketplace', icon: Search, label: t('findWork', 'Find Work') },
        { to: '/proposals', icon: FileText, label: t('myProposals', 'My Proposals') },
        { to: '/my-projects', icon: Briefcase, label: t('activeProjects', 'Active Projects') },
        { to: '/contracts', icon: Lock, label: t('contractsAndESign', 'Contracts & E-Sign') },
      ]},
      { section: t('financeAndMilestones', 'FINANCE & MILESTONES'), items: [
        { to: '/timesheets', icon: Clock, label: t('timesheetsAndHours', 'Timesheets & Hours') },
        { to: '/payments', icon: CreditCard, label: t('escrowPayouts', 'Escrow Payouts') },
        { to: '/invoices', icon: ReceiptText, label: t('taxAndInvoices', 'Tax & Invoices') },
        { to: '/skills-assessment', icon: Award, label: t('skillCredentials', 'Skill Credentials') },
      ]},
      { section: t('collaboration', 'COLLABORATION'), items: [
        { to: '/messages', icon: MessageSquare, label: t('clientMessages', 'Client Messages') },
        { to: '/community', icon: Globe, label: t('communityFeed', 'Community Feed') },
      ]}
    ],
    AGENCY_MANAGER: [
      { section: t('agencyWorkspace', 'AGENCY WORKSPACE'), items: [
        { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard', 'Dashboard') },
        { to: '/agency', icon: Building, label: t('agencyStudio', 'Agency Studio') },
        { to: '/marketplace', icon: Search, label: t('marketplace', 'Marketplace') },
        { to: '/my-projects', icon: Briefcase, label: t('teamProjects', 'Team Projects') },
        { to: '/contracts', icon: Lock, label: t('enterpriseContracts', 'Enterprise Contracts') },
      ]},
      { section: t('financeAndBilling', 'FINANCE & BILLING'), items: [
        { to: '/timesheets', icon: Clock, label: t('teamTimesheets', 'Team Timesheets') },
        { to: '/payments', icon: CreditCard, label: t('escrowSettlements', 'Escrow Settlements') },
        { to: '/invoices', icon: ReceiptText, label: t('invoices', 'Invoices') },
        { to: '/analytics', icon: BarChart3, label: t('revenueAnalytics', 'Revenue Analytics') },
      ]},
      { section: t('platformGovernance', 'GOVERNANCE'), items: [
        { to: '/disputes', icon: Scale, label: t('disputes', 'Disputes') },
        { to: '/community', icon: Globe, label: t('community', 'Community') },
      ]}
    ],
    PAYMENT_MANAGER: [
      { section: t('escrowAndTreasury', 'ESCROW & TREASURY'), items: [
        { to: '/dashboard', icon: LayoutDashboard, label: t('treasuryDashboard', 'Treasury Dashboard') },
        { to: '/escrow-governance', icon: Wallet, label: t('escrowVaults', 'Escrow Vaults') },
        { to: '/payments', icon: CreditCard, label: t('disbursements', 'Disbursements') },
        { to: '/invoices', icon: ReceiptText, label: t('taxLedger', 'Tax Ledger') },
      ]},
      { section: t('arbitrationAndStats', 'ARBITRATION & STATS'), items: [
        { to: '/disputes', icon: Scale, label: t('disputeArbitration', 'Escrow Arbitration') },
        { to: '/analytics', icon: BarChart3, label: t('platformReserves', 'Platform Reserves') },
      ]}
    ],
    ADMIN: [
      { section: t('platformGovernance', 'PLATFORM GOVERNANCE'), items: [
        { to: '/dashboard', icon: LayoutDashboard, label: t('executiveCockpit', 'Executive Cockpit') },
        { to: '/admin', icon: ShieldCheck, label: t('adminMasterPanel', 'Admin Master Panel') },
        { to: '/escrow-governance', icon: Wallet, label: t('escrowVaults', 'Escrow Vaults') },
        { to: '/marketplace', icon: Search, label: t('marketplace', 'Marketplace') },
        { to: '/agency', icon: Building, label: t('agencyNetwork', 'Agency Network') },
      ]},
      { section: t('auditAndCompliance', 'AUDIT & COMPLIANCE'), items: [
        { to: '/disputes', icon: Scale, label: t('disputeArbitration', 'Dispute Arbitration') },
        { to: '/contracts', icon: Lock, label: t('contractAudits', 'Contract Audits') },
        { to: '/payments', icon: CreditCard, label: t('globalSettlements', 'Global Settlements') },
        { to: '/analytics', icon: BarChart3, label: t('ecosystemAnalytics', 'Ecosystem Analytics') },
      ]}
    ]
  };
  return configs[role] || configs.CLIENT;
};

const initialNotifications = [
  { id: 1, title: 'Escrow Milestone Funded', desc: 'Sarah Client deposited ₹15,000 in smart escrow for E-Commerce Platform.', time: '2m ago', unread: true, type: 'escrow' },
  { id: 2, title: 'Milestone Review Requested', desc: 'Milestone "Payment Gateway & Webhooks" submitted for verification.', time: '25m ago', unread: true, type: 'milestone' },
  { id: 3, title: 'AI Match Recommendation', desc: '98% compatibility match on Multilingual NLP Chatbot project.', time: '1h ago', unread: true, type: 'proposal' },
  { id: 4, title: 'Tier 1 Credential Verified', desc: 'Identity and skill assessment passed with 100% test score.', time: '4h ago', unread: false, type: 'system' }
];

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(s => s.auth);
  const { theme, language } = useSelector(s => s.ui);
  const { t } = useTranslation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const sections = getRoleNav(user?.role || 'CLIENT', t);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SS';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const quickSearchResults = [
    { title: 'Enterprise E-Commerce Platform', type: 'Project', link: '/marketplace', desc: '₹25,000 • React & Node.js' },
    { title: 'Multilingual AI Chatbot (NLP)', type: 'Project', link: '/marketplace', desc: '₹18,000 • Python & FastAPI' },
    { title: 'Smart Contracts & Escrow Agreement', type: 'Contract', link: '/contracts', desc: 'Cryptographically protected' },
    { title: 'Escrow Governance & Payout Vaults', type: 'Escrow', link: '/escrow-governance', desc: 'Authorize milestone releases' },
    { title: 'Skill Assessment & Credential Quizzes', type: 'Skills', link: '/skills-assessment', desc: 'Boost trust score' },
    { title: 'Agency Talent Management Hub', type: 'Agency', link: '/agency', desc: 'Manage enterprise specialists' },
  ].filter(r => searchQuery === '' || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="app-layout">
      {/* Production Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <NavLink to="/dashboard" className="sidebar-logo-brand">
            <div className="sidebar-logo-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h2>FreelancerHub</h2>
              <span>Enterprise Escrow Platform</span>
            </div>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {sections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: 12 }}>
              <div className="nav-section">{sec.section}</div>
              {sec.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}

          <div className="nav-section">{t('preferences', 'PREFERENCES')}</div>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <User size={16} /> {t('profileAndKyc', 'Profile & KYC')}
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={16} /> {t('platformSettings', 'Platform Settings')}
          </NavLink>

          <button
            className="nav-item"
            onClick={() => { dispatch(logout()); navigate('/login'); }}
            style={{ color: 'var(--danger)', marginTop: 'auto', paddingTop: 14 }}
          >
            <LogOut size={16} /> {t('signOut', 'Sign Out')}
          </button>
        </nav>

        {/* Sidebar User Profile Card */}
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Santhiya Siva'}</div>
            <span className="user-role-badge">
              <ShieldCheck size={11} /> {user?.role === 'AGENCY_MANAGER' ? 'AGENCY' : user?.role || 'FREELANCER'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-content">
        {/* Topbar Command Island */}
        <header className="topbar">
          {/* Global Search Command Bar */}
          <div className="topbar-search-trigger" onClick={() => setSearchOpen(true)}>
            <Search size={15} style={{ flexShrink: 0, color: 'var(--text3)' }} />
            <span className="search-placeholder">{t('searchPlaceholder', 'Search projects, contracts, proposals...')}</span>
            <span className="kbd-shortcut">Ctrl K</span>
          </div>

          <div className="topbar-actions">
            {/* Live Network Beacon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: 'var(--text2)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
              {t('mainnetLive', 'Mainnet Live')}
            </div>

            {/* Role Badge */}
            <span
              className="badge badge-primary"
              style={{
                padding: '5px 12px',
                gap: 6,
                fontSize: 11.5,
                fontWeight: 800,
              }}
            >
              <ShieldCheck size={13} />
              {user?.role === 'AGENCY_MANAGER' ? t('agencyManager', 'AGENCY LEAD') : user?.role === 'PAYMENT_MANAGER' ? t('paymentManager', 'PAYMENT MGR') : t(user?.role?.toLowerCase() || 'freelancer', user?.role || 'FREELANCER')}
            </span>

            {/* Language Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', gap: 4 }}>
              <Globe size={14} color="var(--primary)" />
              <select
                value={language}
                onChange={e => dispatch(setLanguage(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none' }}
                title="Select Platform Language"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} style={{ background: 'var(--card-bg)', color: 'var(--text)' }}>
                    {lang.flag} {lang.native} ({lang.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              className="btn btn-outline btn-sm"
              onClick={() => dispatch(toggleTheme())}
              title={t('toggleTheme', 'Toggle Dark/Light Mode')}
              style={{ padding: '6px 10px', borderRadius: 8 }}
            >
              {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="var(--primary)" />}
            </button>

            {/* Notification Bell */}
            <button
              className="btn btn-outline btn-sm"
              style={{ position: 'relative', padding: '6px 10px', borderRadius: 8 }}
              onClick={() => setNotifOpen(true)}
              title={t('notifications', 'Notifications')}
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: '50%', background: 'var(--danger)', color: 'white', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Trust Score badge */}
            <span
              className="badge badge-success"
              style={{ padding: '5px 10px', cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
              title="Tier 1 KYC Verified Profile"
            >
              <Award size={12} /> {t('trust', 'Trust')} {user?.trustScore || 92}
            </span>
          </div>
        </header>

        {/* Page Content Viewport */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {/* Global Spotlight Search Modal (Ctrl + K) */}
      {searchOpen && (
        <div className="modal-overlay" onClick={() => setSearchOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)', gap: 12 }}>
              <Search size={18} color="var(--primary)" />
              <input
                autoFocus
                placeholder="Search across all 20+ ecosystem pages, escrow, projects..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14.5, color: 'var(--text)', fontWeight: 500 }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '14px 18px', maxHeight: 360, overflowY: 'auto' }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--text4)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.8 }}>
                Suggested Platform Routes ({quickSearchResults.length})
              </div>
              {quickSearchResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text3)', fontSize: 13 }}>
                  No matching results found for "{searchQuery}"
                </div>
              ) : (
                quickSearchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => { navigate(res.link); setSearchOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s', background: 'var(--bg3)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg3)'}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{res.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{res.desc}</div>
                    </div>
                    <span className="badge badge-info" style={{ fontSize: 11 }}>{res.type}</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', background: 'var(--bg3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text3)' }}>
              <span>Press <strong style={{ color: 'var(--text)' }}>ESC</strong> to close</span>
              <span>Navigate with arrow keys</span>
            </div>
          </div>
        </div>
      )}

      {/* Notification Center Drawer */}
      {notifOpen && (
        <>
          <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={() => setNotifOpen(false)} />
          <div className="notification-drawer">
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Notification Center</h3>
                <p style={{ fontSize: 12, color: 'var(--text3)', margin: '2px 0 0' }}>{unreadCount} unread security and escrow events</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={markAllAsRead} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: 11 }}>
                  <CheckCheck size={13} /> Read All
                </button>
                <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: n.unread ? 'var(--primary-light)' : 'var(--bg3)',
                    border: '1px solid var(--border)',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text)' }}>{n.title}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--text4)' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Global AI Assistant Floating Copilot */}
      <AIWidget />
    </div>
  );
}
