import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../i18n/translations';
import { exportToCSV } from '../utils/csvExport';
import {
  Wallet, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight,
  DollarSign, RefreshCw, FileText, Lock, Filter, Search, Sparkles, FileSpreadsheet
} from 'lucide-react';

const escrowQueue = [
  { id: 'ESC-901', project: 'E-Commerce Platform with React', client: 'Sarah Client', freelancer: 'Raj Freelancer', milestone: 'Frontend Setup & Authentication', amount: '₹1,000', status: 'RELEASED', compliance: '100% Verified', date: '2026-09-18' },
  { id: 'ESC-902', project: 'E-Commerce Platform with React', client: 'Sarah Client', freelancer: 'Raj Freelancer', milestone: 'Product Catalog & Cart', amount: '₹2,000', status: 'LOCKED', compliance: 'Awaiting Milestone Delivery', date: '2026-09-20' },
  { id: 'ESC-903', project: 'Multilingual AI Chatbot', client: 'Sarah Client', freelancer: 'Raj Freelancer', milestone: 'Tamil NLP Audio Engine', amount: '₹4,000', status: 'UNDER_AUDIT', compliance: 'Pending Client Verification', date: '2026-09-21' },
];

export default function EscrowGovernancePage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [queue, setQueue] = useState(escrowQueue);

  const handleAuthorizeRelease = (id) => {
    setQueue(queue.map(item => item.id === id ? { ...item, status: 'RELEASED', compliance: 'Authorized by Officer' } : item));
    alert(`Escrow release authorized for ${id}. Funds dispatched to freelancer wallet!`);
  };

  const handleExportCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    const metadata = [
      `# FREELANCERHUB ESCROW GOVERNANCE & COMPLIANCE LEDGER`,
      `# Export Timestamp: ${new Date().toLocaleString('en-IN')}`,
      `# Authorized Officer: ${user?.name || 'Administrator'} (${user?.role || 'ADMIN'})`,
      `# Vault Health: 100% Collateralized | Zero Fraud Incidents`,
    ];

    const headers = [
      'Escrow Vault ID',
      'Project Workspace',
      'Milestone Deliverable',
      'Client Depositor',
      'Freelancer Payee',
      'Secured Escrow Amount',
      'Compliance Status',
      'Payout State',
      'Timestamp Date'
    ];

    const rows = queue.map(item => [
      item.id,
      item.project,
      item.milestone,
      item.client,
      item.freelancer,
      item.amount,
      item.compliance,
      item.status,
      item.date
    ]);

    exportToCSV({
      filename: `freelancerhub-escrow-ledger-${today}.csv`,
      headers,
      rows,
      metadata
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Lock size={12} /> {t('financialCompliance', 'Financial Compliance & Escrow Protocol')}
          </div>
          <h1>{t('escrowGovernanceTitle', 'Escrow Governance & Payout Authorization')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('escrowGovernanceSubtitle', 'Audit escrow milestones, verify proof of deliverable compliance, and authorize payouts')}</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('totalEscrowVaultBalance', 'Total Escrow Vault Balance')}</span>
            <div className="stat-icon stat-icon-emerald"><Wallet size={20} /></div>
          </div>
          <div className="stat-value">₹385,000</div>
          <div className="stat-footer stat-up"><ShieldCheck size={14} /> 100% {t('collateralized', 'Collateralized')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('authorizedReleases', 'Authorized Releases')}</span>
            <div className="stat-icon stat-icon-purple"><CheckCircle2 size={20} /></div>
          </div>
          <div className="stat-value">₹124,000</div>
          <div className="stat-footer stat-up">{t('zeroFraudIncidents', 'Zero fraud incidents')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('underComplianceAudit', 'Under Compliance Audit')}</span>
            <div className="stat-icon stat-icon-amber"><AlertTriangle size={20} /></div>
          </div>
          <div className="stat-value">₹18,500</div>
          <div className="stat-footer stat-neutral">1 {t('auditInQueue', 'audit in queue')}</div>
        </div>
      </div>

      {/* Escrow Ledger */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t('escrowMilestoneReleaseQueue', 'Escrow Milestone Release Queue')}</h3>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>{t('officialCollateralizedRecords', 'Official collateralized escrow settlement records')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-purple">{queue.length} {t('records', 'Records')}</span>
            <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
              <FileSpreadsheet size={13} /> {t('exportCsv', 'Export CSV')}
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('escrowId', 'Escrow ID')}</th>
                <th>{t('projectAndMilestone', 'Project & Milestone')}</th>
                <th>{t('client', 'Client')}</th>
                <th>{t('freelancer', 'Freelancer')}</th>
                <th>{t('amount', 'Amount')}</th>
                <th>{t('complianceStatus', 'Compliance Status')}</th>
                <th>{t('action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{item.id}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.project}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.milestone}</div>
                  </td>
                  <td>{item.client}</td>
                  <td>{item.freelancer}</td>
                  <td style={{ fontWeight: 800, color: 'var(--text)' }}>{item.amount}</td>
                  <td>
                    <span className={`badge ${item.status === 'RELEASED' ? 'badge-success' : item.status === 'UNDER_AUDIT' ? 'badge-amber' : 'badge-info'}`}>
                      {item.compliance}
                    </span>
                  </td>
                  <td>
                    {item.status !== 'RELEASED' ? (
                      <button className="btn btn-primary btn-sm" onClick={() => handleAuthorizeRelease(item.id)}>
                        <CheckCircle2 size={13} /> {t('authorizePayout', 'Authorize Payout')}
                      </button>
                    ) : (
                      <span className="badge badge-success">{t('dispatched', 'Dispatched')}</span>
                    )}
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
