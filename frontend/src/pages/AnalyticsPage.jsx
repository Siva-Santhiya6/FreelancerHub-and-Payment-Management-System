import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../i18n/translations';
import { exportToCSV } from '../utils/csvExport';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import {
  TrendingUp, DollarSign, Briefcase, Award, ShieldCheck,
  Calendar, Download, ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

const revenueDataSets = {
  '1M': [
    { month: 'Week 1', earnings: 42000, escrow: 55000, spend: 30000, date: '2026-09-01 to 2026-09-07', projects: 4, growth: '+12.5%' },
    { month: 'Week 2', earnings: 48000, escrow: 62000, spend: 34000, date: '2026-09-08 to 2026-09-14', projects: 5, growth: '+14.3%' },
    { month: 'Week 3', earnings: 55000, escrow: 68000, spend: 39000, date: '2026-09-15 to 2026-09-21', projects: 6, growth: '+14.5%' },
    { month: 'Week 4', earnings: 65000, escrow: 75000, spend: 42000, date: '2026-09-22 to 2026-09-28', projects: 8, growth: '+18.2%' },
  ],
  '6M': [
    { month: 'Apr 2026', earnings: 45000, escrow: 60000, spend: 32000, date: '2026-04-01', projects: 12, growth: '+8.4%' },
    { month: 'May 2026', earnings: 62000, escrow: 78000, spend: 41000, date: '2026-05-01', projects: 16, growth: '+37.7%' },
    { month: 'Jun 2026', earnings: 85000, escrow: 110000, spend: 58000, date: '2026-06-01', projects: 22, growth: '+37.1%' },
    { month: 'Jul 2026', earnings: 120000, escrow: 145000, spend: 89000, date: '2026-07-01', projects: 28, growth: '+41.2%' },
    { month: 'Aug 2026', earnings: 165000, escrow: 195000, spend: 112000, date: '2026-08-01', projects: 35, growth: '+37.5%' },
    { month: 'Sep 2026', earnings: 210000, escrow: 260000, spend: 145000, date: '2026-09-01', projects: 42, growth: '+27.3%' },
  ],
  '1Y': [
    { month: 'Q4 2025', earnings: 95000, escrow: 130000, spend: 75000, date: '2025-10-01 to 2025-12-31', projects: 30, growth: '+15.0%' },
    { month: 'Q1 2026', earnings: 192000, escrow: 248000, spend: 131000, date: '2026-01-01 to 2026-03-31', projects: 50, growth: '+102.1%' },
    { month: 'Q2 2026', earnings: 267000, escrow: 333000, spend: 188000, date: '2026-04-01 to 2026-06-30', projects: 66, growth: '+39.1%' },
    { month: 'Q3 2026', earnings: 495000, escrow: 600000, spend: 346000, date: '2026-07-01 to 2026-09-30', projects: 105, growth: '+85.4%' },
  ]
};

const categoryData = [
  { name: 'Web Development', value: 45, color: '#6366f1', volume: '₹381,600' },
  { name: 'AI/ML Engineering', value: 25, color: '#ec4899', volume: '₹212,000' },
  { name: 'UI/UX Design', value: 15, color: '#06b6d4', volume: '₹127,200' },
  { name: 'Cloud & DevOps', value: 15, color: '#10b981', volume: '₹127,200' },
];

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [timeRange, setTimeRange] = useState('6M');
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const activeRevenueData = revenueDataSets[timeRange] || revenueDataSets['6M'];

  const handleExportCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    const timeLabel = timeRange === '1M' ? 'Last 30 Days' : timeRange === '1Y' ? 'This Year (4 Quarters)' : 'Last 6 Months';

    const metadata = [
      `# FREELANCERHUB PLATFORM REVENUE & TELEMETRY REPORT`,
      `# Export Timestamp: ${new Date().toLocaleString('en-IN')}`,
      `# Time Range: ${timeLabel}`,
      `# Exported By: ${user?.name || 'Administrator'} (${user?.role || 'ADMIN'})`,
      `# Overall Gross Volume: ₹848,000 | Escrow Settlement Rate: 99.8% | Trust Index: 97.6/100`,
    ];

    const headers = [
      'Period / Month',
      'Timeline Coverage',
      'Completed Projects',
      'Settled Earnings (INR)',
      'Escrow Locked Volume (INR)',
      'Client Project Spend (INR)',
      'Net Growth Rate',
      'Audit Compliance Status'
    ];

    const rows = activeRevenueData.map(item => [
      item.month,
      item.date,
      item.projects,
      item.earnings,
      item.escrow,
      item.spend,
      item.growth,
      '100% Verified Escrow'
    ]);

    // Append Category Summary rows
    rows.push(['---', '---', '---', '---', '---', '---', '---', '---']);
    rows.push(['CATEGORY / INDUSTRY SUMMARY', 'MARKET SHARE (%)', 'ESTIMATED VOLUME (INR)', 'STATUS', '', '', '', '']);
    categoryData.forEach(c => {
      rows.push([c.name, `${c.value}%`, c.volume, 'Active Domain', '', '', '', '']);
    });

    exportToCSV({
      filename: `freelancerhub-analytics-${timeRange.toLowerCase()}-${today}.csv`,
      headers,
      rows,
      metadata
    });

    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 3500);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Sparkles size={12} /> {t('financialIntelligence', 'Financial Intelligence & Telemetry')}
          </div>
          <h1>{t('analyticsTitle', 'Platform Revenue & Performance Analytics')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('analyticsSubtitle', 'Comprehensive analytics on earnings, escrow funding velocity, and project ROI')}</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select className="form-select" value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{ width: 130 }}>
            <option value="1M">{t('last30Days', 'Last 30 Days')}</option>
            <option value="6M">{t('last6Months', 'Last 6 Months')}</option>
            <option value="1Y">{t('thisYear', 'This Year')}</option>
          </select>
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <Download size={15} /> {t('exportCsv', 'Export CSV')}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {exportedSuccess && (
        <div className="alert alert-success" style={{ animation: 'slideUpFade 0.2s ease', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={18} />
          <span><strong>{t('reportDownloaded', 'Report Downloaded!')}</strong> {t('datasetExportedNotice', 'Your complete CSV analytics dataset was exported with Microsoft Excel & Google Sheets UTF-8 formatting.')}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('grossVolume', 'Gross Volume')}</span>
            <div className="stat-icon stat-icon-emerald"><DollarSign size={20} /></div>
          </div>
          <div className="stat-value">₹848,000</div>
          <div className="stat-footer stat-up"><ArrowUpRight size={14} /> +32.4% {t('vsLastPeriod', 'vs last period')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('escrowSettlementRate', 'Escrow Settlement Rate')}</span>
            <div className="stat-icon stat-icon-purple"><ShieldCheck size={20} /></div>
          </div>
          <div className="stat-value">99.8%</div>
          <div className="stat-footer stat-up"><ArrowUpRight size={14} /> {t('zeroDefaults', 'Zero unresolved defaults')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('avgMilestoneVelocity', 'Avg. Milestone Velocity')}</span>
            <div className="stat-icon stat-icon-blue"><Briefcase size={20} /></div>
          </div>
          <div className="stat-value">4.2 {t('days', 'Days')}</div>
          <div className="stat-footer stat-up">22% {t('fasterMilestoneSignoff', 'faster milestone signoff')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('platformTrustIndex', 'Platform Trust Index')}</span>
            <div className="stat-icon stat-icon-amber"><Award size={20} /></div>
          </div>
          <div className="stat-value">97.6 / 100</div>
          <div className="stat-footer stat-up">{t('gradeAReputation', 'Grade A+ verified reputation')}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Main Revenue Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t('revenueEscrowGrowth', 'Revenue & Escrow Volume Growth')}</h3>
              <p style={{ fontSize: 12, color: 'var(--text3)' }}>{t('monthlyGrossEscrowVolume', 'Monthly gross volume and locked escrow deposits (INR)')}</p>
            </div>
            <span className="badge badge-purple">{timeRange} {t('view', 'View')}</span>
          </div>

          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={activeRevenueData}>
                <defs>
                  <linearGradient id="colorEscrow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text3)" />
                <YAxis stroke="var(--text3)" tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} formatter={v => [`₹${v.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="escrow" name={t('escrowVolume', 'Escrow Volume')} stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorEscrow)" />
                <Area type="monotone" dataKey="earnings" name={t('settledEarnings', 'Settled Earnings')} stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{t('volumeByIndustry', 'Volume by Industry')}</h3>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>{t('contractDistributions', 'Contract distributions')}</p>

          <div style={{ height: 190, width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={4}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {categoryData.map(c => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                  {c.name}
                </span>
                <strong style={{ color: 'var(--text)' }}>{c.value}% ({c.volume})</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Records Ledger Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t('periodTelemetryRecords', 'Period Telemetry & Settlement Records')}</h3>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>{t('itemizedFinancialLedgerNotice', 'Itemized platform financial ledger available for CSV export')}</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
            <FileSpreadsheet size={13} /> {t('downloadTableCsv', 'Download Table CSV')}
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('timelinePeriod', 'Timeline Period')}</th>
                <th>{t('coverageDates', 'Coverage Dates')}</th>
                <th>{t('deliveredProjects', 'Delivered Projects')}</th>
                <th>{t('settledEarnings', 'Settled Earnings')}</th>
                <th>{t('escrowVaultVolume', 'Escrow Vault Volume')}</th>
                <th>{t('clientSpend', 'Client Spend')}</th>
                <th>{t('growthRate', 'Growth Rate')}</th>
                <th>{t('auditStatus', 'Audit Status')}</th>
              </tr>
            </thead>
            <tbody>
              {activeRevenueData.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{item.month}</td>
                  <td style={{ fontSize: 12, color: 'var(--text3)' }}>{item.date}</td>
                  <td style={{ fontWeight: 700 }}>{item.projects} {t('projects', 'Projects')}</td>
                  <td style={{ fontWeight: 800, color: 'var(--success)' }}>₹{item.earnings.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>₹{item.escrow.toLocaleString()}</td>
                  <td style={{ color: 'var(--text2)' }}>₹{item.spend.toLocaleString()}</td>
                  <td>
                    <span className="badge badge-success" style={{ gap: 3 }}>
                      <ArrowUpRight size={11} /> {item.growth}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-verified">
                      <ShieldCheck size={11} /> 100% {t('audited', 'Audited')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
