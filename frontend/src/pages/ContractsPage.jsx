import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../i18n/translations';
import {
  FileText, ShieldCheck, CheckCircle2, Download, Lock,
  PenTool, Clock, ArrowRight, Eye, Plus, Sparkles, X
} from 'lucide-react';

const sampleContracts = [
  {
    id: 'CTR-2026-001',
    title: 'Master Service & Autonomous Escrow Agreement',
    project: 'E-Commerce Platform with React',
    client: 'Sarah Client',
    freelancer: 'Raj Freelancer',
    value: '₹5,000',
    type: 'Escrow Milestone Contract',
    status: 'SIGNED',
    date: '2026-09-15',
    clauses: ['IP Ownership Transfer upon Escrow Release', 'Autonomous Milestone Verifications', '7-Day Arbitration Period']
  },
  {
    id: 'CTR-2026-002',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    project: 'Multilingual AI Chatbot for Customer Support',
    client: 'Sarah Client',
    freelancer: 'Raj Freelancer',
    value: '₹8,000',
    type: 'NDA & Data Privacy',
    status: 'PENDING_SIGNATURE',
    date: '2026-09-20',
    clauses: ['Confidentiality of AI Model Weights', 'Proprietary Dataset Protection', '2-Year Non-Compete Scope']
  }
];

export default function ContractsPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [contracts, setContracts] = useState(sampleContracts);
  const [selectedContract, setSelectedContract] = useState(null);
  const [signedState, setSignedState] = useState(false);

  const handleSign = (id) => {
    setContracts(contracts.map(c => c.id === id ? { ...c, status: 'SIGNED' } : c));
    if (selectedContract && selectedContract.id === id) {
      setSelectedContract({ ...selectedContract, status: 'SIGNED' });
    }
    setSignedState(true);
    alert('Contract digitally signed with cryptographic SHA-256 timestamp simulation!');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Lock size={12} /> {t('cryptographicallySignedFramework', 'Cryptographically Signed Legal Framework')}
          </div>
          <h1>{t('contractsTitle', 'Smart Contracts & NDA Agreements')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('contractsSubtitle', 'Manage legally binding freelance service agreements, NDAs, and digital signatures')}</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('totalActiveAgreements', 'Total Active Agreements')}</span>
            <div className="stat-icon stat-icon-purple"><FileText size={20} /></div>
          </div>
          <div className="stat-value">{contracts.length} {t('contracts', 'Contracts')}</div>
          <div className="stat-footer stat-up"><ShieldCheck size={14} /> 100% {t('escrowBacked', 'Escrow Backed')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('fullyExecuted', 'Fully Executed')}</span>
            <div className="stat-icon stat-icon-emerald"><CheckCircle2 size={20} /></div>
          </div>
          <div className="stat-value">{contracts.filter(c => c.status === 'SIGNED').length} {t('signed', 'Signed')}</div>
          <div className="stat-footer stat-up">{t('legallyEnforceable', 'Legally enforceable')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('awaitingSignature', 'Awaiting Signature')}</span>
            <div className="stat-icon stat-icon-amber"><Clock size={20} /></div>
          </div>
          <div className="stat-value">{contracts.filter(c => c.status === 'PENDING_SIGNATURE').length} {t('pending', 'Pending')}</div>
          <div className="stat-footer stat-neutral">{t('readyForESignature', 'Ready for 1-click e-signature')}</div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t('digitalAgreementsRegistry', 'Digital Agreements Registry')}</h3>
          <span className="badge badge-purple">{contracts.length} {t('records', 'Records')}</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('contractId', 'Contract ID')}</th>
                <th>{t('agreementTitle', 'Agreement Title')}</th>
                <th>{t('project', 'Project')}</th>
                <th>{t('contractValue', 'Contract Value')}</th>
                <th>{t('executionDate', 'Execution Date')}</th>
                <th>{t('status', 'Status')}</th>
                <th>{t('action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c.id} onClick={() => setSelectedContract(c)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{c.id}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{c.title}</td>
                  <td>{c.project}</td>
                  <td style={{ fontWeight: 800, color: 'var(--text)' }}>{c.value}</td>
                  <td>{c.date}</td>
                  <td>
                    <span className={`badge ${c.status === 'SIGNED' ? 'badge-success' : 'badge-amber'}`}>
                      {c.status === 'SIGNED' ? t('executed', 'Executed') : t('pendingSignature', 'Pending Signature')}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm">
                      <Eye size={12} /> {t('viewTerms', 'View Terms')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Preview Modal */}
      {selectedContract && (
        <div className="modal-overlay" onClick={() => setSelectedContract(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <span className="badge badge-info">{selectedContract.type}</span>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{selectedContract.title}</h2>
              </div>
              <button onClick={() => setSelectedContract(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}><X size={18} /></button>
            </div>

            <div style={{ background: 'var(--bg3)', padding: 18, borderRadius: 12, marginBottom: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>{t('contractScopeAndTerms', 'Contract Scope & Milestone Terms')}</div>
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 12 }}>
                This agreement constitutes a binding contract between <strong>{selectedContract.client}</strong> (Client) and <strong>{selectedContract.freelancer}</strong> (Freelancer) for the project "{selectedContract.project}". All milestone funds are held in autonomous smart escrow and released upon milestone inspection.
              </p>

              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>{t('keyEnforceableClauses', 'Key Enforceable Clauses:')}</div>
              <ul style={{ paddingLeft: 18, fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.8 }}>
                {selectedContract.clauses.map((clause, i) => (
                  <li key={i}>{clause}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
              <button className="btn btn-outline" onClick={() => alert('Downloading contract PDF...')}>
                <Download size={14} /> {t('downloadPdf', 'Download PDF')}
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline" onClick={() => setSelectedContract(null)}>{t('close', 'Close')}</button>
                {selectedContract.status === 'PENDING_SIGNATURE' && (
                  <button className="btn btn-primary" onClick={() => handleSign(selectedContract.id)}>
                    <PenTool size={14} /> {t('eSignAgreement', 'E-Sign Agreement')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
