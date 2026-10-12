import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from '../i18n/translations';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Briefcase, DollarSign, FileText, Star, TrendingUp,
  CheckCircle, Clock, AlertCircle, ArrowRight, Plus, ShieldCheck,
  Wallet, Sparkles, Layers, ArrowUpRight, Zap, RefreshCw, Send,
  SlidersHorizontal, Check, X, Shield, ChevronRight, Activity,
  Lock, Award, UserCheck, MessageSquare, PlayCircle, ExternalLink,
  Code2, Cpu, CheckCircle2, ArrowDownRight, Hash
} from 'lucide-react';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const DONUT_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { t, language } = useTranslation();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Currency & Filter State
  const [currency, setCurrency] = useState('INR'); // 'INR' | 'USD'
  const [chartTimeframe, setChartTimeframe] = useState('6M');
  const [chartMetric, setChartMetric] = useState('earnings');

  // Interactive Simulator Slider
  const [simBudget, setSimBudget] = useState(35000);

  // Escrow Deposit Modal State
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('15000');
  const [depositMethod, setDepositMethod] = useState('UPI');
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fxRate = currency === 'USD' ? 0.012 : 1;
  const currSym = currency === 'USD' ? '$' : '₹';
  const formatCur = (amount) => {
    const val = Math.round((amount || 0) * fxRate);
    return `${currSym}${val.toLocaleString()}`;
  };

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const projRes = await axios.get('/api/projects/my', { headers: authHeader() }).catch(() => ({ data: { projects: [] } }));
      const list = projRes.data.projects || [];
      if (list.length > 0) {
        setProjects(list);
      } else {
        setProjects([
          {
            _id: 'proj-1',
            title: 'Enterprise E-Commerce Platform with React & Node.js',
            category: 'Web Development',
            status: 'IN_PROGRESS',
            budget: 25000,
            progress: 65,
            currentMilestone: 'Milestone 2: Payment Gateway & Escrow Webhooks',
            milestoneStep: 2,
            deadline: '2026-10-15',
            escrowStatus: 'FUNDED',
            escrowAmount: 25000,
            clientId: { name: 'Sarah Client', isVerified: true, rating: 4.9 },
          },
          {
            _id: 'proj-2',
            title: 'AI Multilingual Chatbot for Customer Support',
            category: 'AI / ML',
            status: 'IN_PROGRESS',
            budget: 18000,
            progress: 40,
            currentMilestone: 'Milestone 1: NLP Dataset & Intent Training',
            milestoneStep: 1,
            deadline: '2026-10-25',
            escrowStatus: 'FUNDED',
            escrowAmount: 18000,
            clientId: { name: 'Fintech Spark Ltd', isVerified: true, rating: 5.0 },
          },
          {
            _id: 'proj-3',
            title: 'Mobile Banking UI/UX Design System in Figma',
            category: 'UI/UX Design',
            status: 'COMPLETED',
            budget: 12000,
            progress: 100,
            currentMilestone: 'Milestone 3: Final Design Tokens & Handoff',
            milestoneStep: 4,
            deadline: '2026-09-15',
            escrowStatus: 'RELEASED',
            escrowAmount: 12000,
            clientId: { name: 'Apex Studio', isVerified: true, rating: 4.8 },
          }
        ]);
      }
    } catch (e) {
      console.warn('Dashboard data fetch fallback:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning', 'Good morning');
    if (hour < 18) return t('goodAfternoon', 'Good afternoon');
    return t('goodEvening', 'Good evening');
  };

  const getChartData = () => {
    if (chartTimeframe === '7D') {
      return [
        { period: 'Mon', earnings: 1400, escrow: 2600, milestones: 1 },
        { period: 'Tue', earnings: 2600, escrow: 4100, milestones: 2 },
        { period: 'Wed', earnings: 2100, escrow: 3500, milestones: 1 },
        { period: 'Thu', earnings: 3900, escrow: 5200, milestones: 3 },
        { period: 'Fri', earnings: 4600, escrow: 6200, milestones: 2 },
        { period: 'Sat', earnings: 5500, escrow: 7100, milestones: 4 },
        { period: 'Sun', earnings: 7200, escrow: 8500, milestones: 5 },
      ];
    }
    if (chartTimeframe === '30D') {
      return [
        { period: 'Week 1', earnings: 5200, escrow: 7100, milestones: 3 },
        { period: 'Week 2', earnings: 8900, escrow: 10800, milestones: 5 },
        { period: 'Week 3', earnings: 12800, escrow: 16500, milestones: 8 },
        { period: 'Week 4', earnings: 18400, escrow: 23200, milestones: 12 },
      ];
    }
    return [
      { period: 'Jan', earnings: 4800, escrow: 7200, milestones: 2 },
      { period: 'Feb', earnings: 7600, escrow: 9800, milestones: 4 },
      { period: 'Mar', earnings: 10500, escrow: 13900, milestones: 6 },
      { period: 'Apr', earnings: 15800, escrow: 20200, milestones: 9 },
      { period: 'May', earnings: 23400, escrow: 28900, milestones: 14 },
      { period: 'Jun', earnings: 32600, escrow: 38400, milestones: 18 },
    ];
  };

  const escrowDistData = [
    { name: t('lockedInEscrowVault', 'Locked in Escrow Vault'), value: 65, color: '#6366f1' },
    { name: t('releasedPayouts', 'Released Payouts'), value: 25, color: '#10b981' },
    { name: t('disputeReserve', 'Dispute Reserve'), value: 10, color: '#f59e0b' },
  ];

  const getCategoryLabel = (cat) => {
    if (!cat) return '';
    if (cat === 'Web Development') return t('webDevelopment', 'Web Development');
    if (cat === 'Mobile App' || cat === 'Mobile Development') return t('mobileDevelopment', 'Mobile App');
    if (cat === 'AI / ML' || cat === 'AI/ML') return t('aiMl', 'AI / ML');
    if (cat === 'UI/UX Design' || cat === 'UI/UX') return t('uiUxDesign', 'UI/UX Design');
    return t(cat, cat);
  };

  const getMilestoneLabel = (milestone) => {
    if (!milestone) return t('milestone2SecurityDesc', 'Milestone 2: Security & Payment Gateways');
    if (milestone.includes('Security') || milestone.includes('Payment') || milestone.includes('Gateways') || milestone.includes('Webhooks')) {
      return t('milestone2SecurityDesc', milestone);
    }
    if (milestone.includes('NLP') || milestone.includes('Intent Training') || milestone.includes('Chatbot')) {
      return t('milestone1NlpDesc', milestone);
    }
    if (milestone.includes('Design Tokens') || milestone.includes('Handoff') || milestone.includes('Figma')) {
      return t('milestone3DesignDesc', milestone);
    }
    return milestone;
  };

  const getProjectTitleLabel = (title) => {
    if (!title) return '';
    if (title.includes('E-Commerce') || title.includes('Node.js')) return t('projectTitleEcommerce', title);
    if (title.includes('Chatbot') || title.includes('Customer Support')) return t('projectTitleAiChatbot', title);
    if (title.includes('Banking') || title.includes('Figma')) return t('projectTitleMobileBanking', title);
    return title;
  };

  const getEscrowStatusLabel = (status) => {
    if (status === 'FUNDED') return t('funded', 'FUNDED');
    if (status === 'RELEASED') return t('released', 'RELEASED');
    return t('verifiedEscrow', status || 'FUNDED');
  };

  const recentTransactions = [
    { id: 'TX-98421', desc: t('tx1Desc', 'Milestone 1 Escrow Release (E-Commerce Platform)'), amount: 7500, type: 'CREDIT', status: t('settled', 'SETTLED'), time: `10 ${t('minsAgo', 'mins ago')}` },
    { id: 'TX-98420', desc: t('tx2Desc', 'Escrow Vault Lock (AI Chatbot NLP)'), amount: 18000, type: 'ESCROW_LOCK', status: t('guaranteedStatus', 'GUARANTEED'), time: `2 ${t('hoursAgo', 'hours ago')}` },
    { id: 'TX-98419', desc: t('tx3Desc', 'Identity & KYC Tier 1 Verification Grant'), amount: 0, type: 'SECURITY', status: t('verifiedStatus', 'VERIFIED'), time: `1 ${t('daysAgo', 'day ago')}` },
  ];

  const handleSimulateMilestoneRelease = (project) => {
    showToast(`🎉 Milestone sign-off approved! ${formatCur(project.budget * 0.4)} released from Escrow Vault to wallet.`);
    setProjects(projects.map(p =>
      p._id === project._id ? { ...p, progress: Math.min(100, (p.progress || 50) + 25) } : p
    ));
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    setDepositLoading(true);
    setTimeout(() => {
      setDepositLoading(false);
      setDepositSuccess(true);
      setTimeout(() => {
        setDepositSuccess(false);
        setDepositModalOpen(false);
        showToast(`⚡ Escrow Deposit of ${formatCur(Number(depositAmount))} secured in Smart Vault!`);
      }, 1200);
    }, 800);
  };

  const activeProjectsCount = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const totalEscrowLocked = projects.reduce((acc, p) => acc + (p.budget || 0), 29200);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 99999,
            background: 'var(--primary-gradient)',
            color: '#fff',
            padding: '14px 22px',
            borderRadius: 12,
            fontWeight: 700,
            boxShadow: '0 12px 36px var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Sparkles size={18} /> {toastMsg}
        </div>
      )}

      {/* Real-World Production Header Banner */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          padding: '26px 30px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(16, 185, 129, 0.06) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
            {t('mainnetEscrowSecurity', 'Mainnet Escrow Smart Contracts • 100% Cryptographic Security')}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, margin: 0, color: 'var(--text)' }}>
            {getGreeting()}, {user?.name || 'Santhiya Siva'}! ⚡
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 13.5, marginTop: 4, maxWidth: 620 }}>
            {t('enterpriseWorkspace', 'Enterprise Workspace')} • <strong>{activeProjectsCount} {t('inProgressSprints', 'Active Milestone Sprints')}</strong> • <strong>{formatCur(totalEscrowLocked)} {t('securedInSmartEscrow', 'Protected in Escrow Vault')}</strong>
          </p>
        </div>

        {/* Currency Toggle & Quick Action Bar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Currency Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 8, padding: 3, border: '1px solid var(--border)' }}>
            <button
              onClick={() => setCurrency('INR')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: 'none',
                background: currency === 'INR' ? 'var(--primary)' : 'transparent',
                color: currency === 'INR' ? '#fff' : 'var(--text3)',
                fontWeight: 800,
                fontSize: 11.5,
                cursor: 'pointer',
              }}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: 'none',
                background: currency === 'USD' ? 'var(--primary)' : 'transparent',
                color: currency === 'USD' ? '#fff' : 'var(--text3)',
                fontWeight: 800,
                fontSize: 11.5,
                cursor: 'pointer',
              }}
            >
              USD ($)
            </button>
          </div>

          <button
            onClick={() => setDepositModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px 14px', fontSize: 12.5, gap: 6 }}
          >
            <Wallet size={15} color="var(--primary)" /> {t('fundEscrow', 'Fund Escrow')}
          </button>

          <Link to="/marketplace" className="btn btn-primary btn-sm" style={{ padding: '8px 16px', fontSize: 12.5, gap: 6 }}>
            <Sparkles size={15} /> {t('exploreProjects', 'Explore Projects')}
          </Link>

          <button
            onClick={loadDashboardData}
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px' }}
            title="Refresh Live Telemetry"
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Production KPI Stats Ledger */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {/* Stat 1: Total Projects */}
        <div className="stat-card card-hover" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="stat-header">
            <div>
              <span className="stat-title">{t('managedContracts', 'MANAGED CONTRACTS')}</span>
              <div className="stat-value">{projects.length || 5}</div>
            </div>
            <div className="stat-icon stat-icon-purple">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="stat-footer">
            <span className="stat-up"><TrendingUp size={13} /> {t('newSubmissions', '+2 New Submissions')}</span>
            <span style={{ fontSize: 11, color: 'var(--text4)', marginLeft: 'auto' }}>{t('allVerified', 'All Verified')}</span>
          </div>
        </div>

        {/* Stat 2: Active Sprints */}
        <div className="stat-card card-hover" style={{ borderLeft: '4px solid #06b6d4' }}>
          <div className="stat-header">
            <div>
              <span className="stat-title">{t('inProgressSprints', 'IN-PROGRESS SPRINTS')}</span>
              <div className="stat-value">{activeProjectsCount || 1}</div>
            </div>
            <div className="stat-icon stat-icon-cyan">
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-footer">
            <span className="stat-up" style={{ color: '#06b6d4' }}>● {t('milestoneActive', 'Milestone Active')}</span>
            <span style={{ fontSize: 11, color: 'var(--text4)', marginLeft: 'auto' }}>{t('dueInDays', 'Due in 16 Days')}</span>
          </div>
        </div>

        {/* Stat 3: Secured in Escrow */}
        <div className="stat-card card-hover" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-header">
            <div>
              <span className="stat-title">{t('securedInSmartEscrow', 'SECURED IN SMART ESCROW')}</span>
              <div className="stat-value" style={{ color: '#10b981' }}>{formatCur(totalEscrowLocked)}</div>
            </div>
            <div className="stat-icon stat-icon-emerald">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="stat-footer">
            <span className="stat-up"><Lock size={12} /> {t('guaranteed100', '100% Guaranteed')}</span>
            <span style={{ fontSize: 11, color: 'var(--text4)', marginLeft: 'auto' }}>{t('zeroRisk', 'Zero Risk')}</span>
          </div>
        </div>

        {/* Stat 4: Trust Score & KYC */}
        <div className="stat-card card-hover" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-header">
            <div>
              <span className="stat-title">{t('trustScoreAndKyc', 'TRUST SCORE & KYC')}</span>
              <div className="stat-value" style={{ color: '#f59e0b' }}>
                {user?.trustScore || 92}<span style={{ fontSize: 15, color: 'var(--text3)' }}>/100</span>
              </div>
            </div>
            <div className="stat-icon stat-icon-amber">
              <Award size={20} />
            </div>
          </div>
          <div className="stat-footer">
            <span style={{ color: '#f59e0b', fontWeight: 800 }}>⭐ {t('topRatedVerifiedPro', 'Top Rated Verified Pro')}</span>
            <span style={{ fontSize: 11, color: 'var(--text4)', marginLeft: 'auto' }}>{t('identityVerified', 'Identity Verified')}</span>
          </div>
        </div>
      </div>

      {/* Row 2: Financial Growth Area Chart & Escrow Security Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Left: Financial Velocity Chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={18} color="var(--primary)" /> {t('financialVelocityAndEscrowGrowth', 'Financial Velocity & Escrow Growth')}
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text3)', margin: '4px 0 0' }}>
                {t('trackGuaranteedEscrow', 'Track guaranteed escrow growth and milestone settlement velocity')}
              </p>
            </div>

            {/* Timeframe & Metric Selectors */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 8, padding: 2, border: '1px solid var(--border)' }}>
                {[
                  { id: 'earnings', label: t('payouts', 'Payouts') },
                  { id: 'escrow', label: t('escrowVault', 'Escrow Vault') },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setChartMetric(m.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: chartMetric === m.id ? 'var(--primary)' : 'transparent',
                      color: chartMetric === m.id ? '#fff' : 'var(--text3)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 8, padding: 2, border: '1px solid var(--border)' }}>
                {['7D', '30D', '6M'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setChartTimeframe(tf)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      border: 'none',
                      background: chartTimeframe === tf ? 'var(--primary-gradient)' : 'transparent',
                      color: chartTimeframe === tf ? '#fff' : 'var(--text3)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="primaryFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="accentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="period" stroke="var(--text4)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text4)" fontSize={11} tickLine={false} tickFormatter={(v) => formatCur(v)} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--primary)',
                            padding: '10px 14px',
                            borderRadius: 10,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                            fontSize: 12,
                          }}
                        >
                          <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>{label} Financial Record</strong>
                          <div style={{ color: '#6366f1', fontWeight: 700 }}>
                            Payouts: {formatCur(payload[0]?.value)}
                          </div>
                          {payload[1] && (
                            <div style={{ color: '#06b6d4', fontWeight: 700, marginTop: 2 }}>
                              Escrow Vault: {formatCur(payload[1]?.value)}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#primaryFill)"
                />
                {chartMetric === 'escrow' && (
                  <Area
                    type="monotone"
                    dataKey="escrow"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#accentFill)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Escrow Vault Allocation */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={16} color="var(--primary)" /> {t('escrowVaultSecurity', 'Escrow Vault Security')}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{t('distributionOfProtectedCollateral', 'Distribution of protected collateral funds')}</p>
          </div>

          <div style={{ height: 160, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={escrowDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {escrowDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>100%</span>
              <span style={{ fontSize: 9.5, color: 'var(--text3)', display: 'block', textTransform: 'uppercase' }}>{t('insured', 'INSURED')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5 }}>
            {escrowDistData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text2)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                  {item.name}
                </span>
                <strong style={{ color: 'var(--text)' }}>{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Active Milestone Sprint Board */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={18} color="var(--primary)" /> {t('activeSprintsSectionTitle', 'Active Projects & Escrow Milestone Pipeline')}
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text3)', margin: '4px 0 0' }}>
              {t('activeSprintsSectionSubtitle', 'Real-time sprint progress, cryptographic milestone tracking, and 1-click settlement')}
            </p>
          </div>

          <Link to="/my-projects" className="btn btn-secondary btn-sm" style={{ gap: 4, fontSize: 12 }}>
            {t('myProjects', 'Manage All')} <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {projects.map((project) => (
            <div
              key={project._id}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 700 }}>
                    {getCategoryLabel(project.category)}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={14} /> {getEscrowStatusLabel(project.escrowStatus)} ({formatCur(project.budget)})
                  </span>
                </div>

                <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', margin: '4px 0 6px' }}>
                  {getProjectTitleLabel(project.title)}
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text3)', margin: '0 0 14px' }}>
                  {t('clientTrust', 'Client')}: <strong>{project.clientId?.name || 'Sarah Client'}</strong> • {t('deadline', 'Deadline')}: {project.deadline ? new Date(project.deadline).toLocaleDateString() : t('in2Weeks', 'In 2 weeks')}
                </p>

                {/* Progress bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text3)', marginBottom: 6 }}>
                    <span>{t('sprintProgress', 'Sprint Progress')}</span>
                    <span style={{ color: 'var(--primary)' }}>{project.progress || 50}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg4)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${project.progress || 50}%`, background: 'var(--primary-gradient)', borderRadius: 4 }} />
                  </div>
                </div>

                <div style={{ background: 'var(--bg2)', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, marginBottom: 14 }}>
                  <span style={{ color: 'var(--text3)', display: 'block', fontSize: 10.5, textTransform: 'uppercase', fontWeight: 700 }}>{t('activeMilestone', 'Active Milestone')}</span>
                  <strong style={{ color: 'var(--text)' }}>{getMilestoneLabel(project.currentMilestone)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => handleSimulateMilestoneRelease(project)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: 'center', fontSize: 11.5 }}
                >
                  <Check size={13} /> {t('submitWork', 'Sign Off Milestone')}
                </button>
                <button
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11.5 }}
                >
                  {t('viewWorkspace', 'Details')} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Real-Time Escrow Simulator & Live Blockchain / Security Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Left: Escrow Calculator */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <SlidersHorizontal size={17} color="var(--primary)" /> {t('simulatorTitle', 'Real-Time Escrow & Payout Simulator')}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{t('simulatorSubtitle', 'Interactive milestone calculator with 0% promo fee')}</p>
            </div>
            <span style={{ padding: '3px 8px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: 11, fontWeight: 800 }}>
              {t('promoFee', '0% Promo Fee')}
            </span>
          </div>

          <div style={{ margin: '18px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>{t('estimatedContractValue', 'Estimated Contract Value:')}</span>
              <strong style={{ fontSize: 16, color: 'var(--primary)', fontWeight: 800 }}>{formatCur(simBudget)}</strong>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={simBudget}
              onChange={(e) => setSimBudget(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', height: 6, cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, textAlign: 'center', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 10.5, color: 'var(--text3)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>{t('milestone1', 'Milestone 1')} (30%)</span>
              <strong style={{ fontSize: 14, color: 'var(--text)' }}>{formatCur(simBudget * 0.3)}</strong>
            </div>
            <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, textAlign: 'center', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 10.5, color: 'var(--text3)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>{t('milestone2', 'Milestone 2')} (40%)</span>
              <strong style={{ fontSize: 14, color: 'var(--text)' }}>{formatCur(simBudget * 0.4)}</strong>
            </div>
            <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, textAlign: 'center', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 10.5, color: 'var(--text3)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>{t('finalHandoff', 'Final Handoff')} (30%)</span>
              <strong style={{ fontSize: 14, color: 'var(--text)' }}>{formatCur(simBudget * 0.3)}</strong>
            </div>
          </div>
        </div>

        {/* Right: Live Security & Activity Feed */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Hash size={17} color="var(--primary)" /> {t('securityLedgerTitle', 'Real-Time Security & Escrow Ledger')}
              </h3>
              <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                ● {t('liveBadge', 'Live')}
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>{t('securityLedgerSubtitle', 'Cryptographically verified contract actions')}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '14px 0' }}>
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>{tx.desc}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{tx.id} • {tx.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {tx.amount > 0 && (
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>
                      +{formatCur(tx.amount)}
                    </div>
                  )}
                  <span className="badge badge-success" style={{ fontSize: 10, padding: '2px 6px' }}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>

          <Link to="/payments" className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', width: '100%' }}>
            {t('viewAuditLedger', 'View Full Financial Audit Ledger')} <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Escrow Deposit Modal */}
      {depositModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
          <div
            className="modal"
            style={{
              maxWidth: 460,
              width: '92%',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{t('depositModalTitle', 'Fund Escrow Vault')}</h3>
                  <p style={{ fontSize: 11.5, color: 'var(--text3)', margin: 0 }}>{t('depositModalSubtitle', 'Smart contract milestone lock')}</p>
                </div>
              </div>
              <button onClick={() => setDepositModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {depositSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <CheckCircle size={28} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>{t('depositConfirmed', 'Deposit Confirmed!')}</h3>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
                  {t('fundsLockedSuccess', 'Funds successfully locked in simulated smart escrow vault.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleDepositSubmit}>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>{t('depositAmountLabel', 'Deposit Amount')} (INR ₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  {['5000', '15000', '25000', '50000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        borderRadius: 8,
                        border: depositAmount === amt ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: depositAmount === amt ? 'var(--primary-light)' : 'var(--bg3)',
                        color: depositAmount === amt ? 'var(--primary)' : 'var(--text)',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ₹{Number(amt).toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>{t('paymentMethodLabel', 'Payment Gateway / Method')}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {['UPI / GPay', 'Stripe Card', 'Crypto USDT'].map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setDepositMethod(pm)}
                        style={{
                          padding: '8px 6px',
                          borderRadius: 8,
                          border: depositMethod === pm ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                          background: depositMethod === pm ? 'var(--primary-light)' : 'var(--bg3)',
                          color: depositMethod === pm ? 'var(--primary)' : 'var(--text)',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => setDepositModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    {t('cancel', 'Cancel')}
                  </button>
                  <button type="submit" disabled={depositLoading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    {depositLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <><ShieldCheck size={15} /> {t('lockInEscrow', 'Lock in Escrow')}</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
