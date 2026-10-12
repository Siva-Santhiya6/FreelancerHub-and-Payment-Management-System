import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../i18n/translations';
import {
  ShieldAlert, Plus, CheckCircle2, Clock, AlertTriangle,
  Scale, FileText, ArrowRight, MessageSquare, Send, Sparkles, X
} from 'lucide-react';

const sampleDisputes = [
  {
    id: 'DSP-8921',
    project: 'E-Commerce Platform with React',
    client: 'Sarah Client',
    freelancer: 'Raj Freelancer',
    amount: '₹2,000',
    reason: 'Milestone 2 Deliverable revision delayed by 3 days',
    status: 'UNDER_REVIEW',
    filedDate: '2026-09-18',
    mediator: 'Admin User',
    verdict: 'Pending evidence submission from both parties',
  },
  {
    id: 'DSP-4412',
    project: 'Fintech Mobile App UI/UX',
    client: 'Sarah Client',
    freelancer: 'Ananya Sharma',
    amount: '₹1,500',
    reason: 'Scope adjustment regarding responsive tablet layouts',
    status: 'RESOLVED',
    filedDate: '2026-09-10',
    mediator: 'Payment Manager',
    verdict: 'Mutual agreement reached. 50% milestone released and 3 days extension granted.',
  }
];

export default function DisputesPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [disputes, setDisputes] = useState(sampleDisputes);
  const [modalOpen, setModalOpen] = useState(false);
  const [newDispute, setNewDispute] = useState({ project: '', amount: '', reason: '' });
  const [selectedDispute, setSelectedDispute] = useState(null);

  const handleFileDispute = (e) => {
    e.preventDefault();
    if (!newDispute.project || !newDispute.reason) return;
    const d = {
      id: `DSP-${Math.floor(1000 + Math.random() * 9000)}`,
      project: newDispute.project,
      client: user?.role === 'CLIENT' ? user.name : 'Client User',
      freelancer: user?.role === 'FREELANCER' ? user.name : 'Raj Freelancer',
      amount: newDispute.amount ? `₹${newDispute.amount}` : '₹2,500',
      reason: newDispute.reason,
      status: 'UNDER_REVIEW',
      filedDate: new Date().toISOString().split('T')[0],
      mediator: 'Admin Mediator',
      verdict: 'Case filed. Escrow funds temporarily protected.',
    };
    setDisputes([d, ...disputes]);
    setNewDispute({ project: '', amount: '', reason: '' });
    setModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Scale size={12} /> {t('autonomousEscrowArbiter', 'Autonomous Escrow Arbiter')}
          </div>
          <h1>{t('disputesTitle', 'Dispute & Mediation Center')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('disputesSubtitle', 'Impartial contract arbitration, evidence investigation, and escrow dispute resolutions')}</p>
        </div>

        <button className="btn btn-danger" onClick={() => setModalOpen(true)}>
          <ShieldAlert size={15} /> {t('fileDisputeBtn', 'File Escrow Dispute')}
        </button>
      </div>

      {/* KPI Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('totalDisputes', 'Total Disputes')}</span>
            <div className="stat-icon stat-icon-amber"><ShieldAlert size={20} /></div>
          </div>
          <div className="stat-value">{disputes.length} {t('cases', 'Cases')}</div>
          <div className="stat-footer stat-neutral">{t('protectedViaSmartContracts', 'Protected via smart contracts')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('pendingArbitration', 'Pending Arbitration')}</span>
            <div className="stat-icon stat-icon-purple"><Clock size={20} /></div>
          </div>
          <div className="stat-value">{disputes.filter(d => d.status === 'UNDER_REVIEW').length} {t('activeStatus', 'Active')}</div>
          <div className="stat-footer stat-up">{t('medianResolution24h', 'Median resolution < 24h')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('resolvedImpartially', 'Resolved Impartially')}</span>
            <div className="stat-icon stat-icon-emerald"><CheckCircle2 size={20} /></div>
          </div>
          <div className="stat-value">{disputes.filter(d => d.status === 'RESOLVED').length} {t('cases', 'Cases')}</div>
          <div className="stat-footer stat-up">99.4% {t('satisfactionRate', 'Client & Freelancer Satisfaction')}</div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t('arbitrationRecords', 'Active & Historical Arbitration Records')}</h3>
          <span className="badge badge-purple">{disputes.length} {t('cases', 'Cases')}</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('caseId', 'Case ID')}</th>
                <th>{t('project', 'Project')}</th>
                <th>{t('disputedAmount', 'Disputed Amount')}</th>
                <th>{t('reason', 'Reason')}</th>
                <th>{t('filedDate', 'Filed Date')}</th>
                <th>{t('status', 'Status')}</th>
                <th>{t('action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map(d => (
                <tr key={d.id} onClick={() => setSelectedDispute(d)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{d.id}</td>
                  <td style={{ fontWeight: 700 }}>{d.project}</td>
                  <td style={{ fontWeight: 800, color: 'var(--danger)' }}>{d.amount}</td>
                  <td style={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.reason}</td>
                  <td>{d.filedDate}</td>
                  <td>
                    <span className={`badge ${d.status === 'RESOLVED' ? 'badge-success' : 'badge-amber'}`}>
                      {d.status === 'RESOLVED' ? t('resolved', 'RESOLVED') : t('underReview', 'UNDER_REVIEW')}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm">
                      {t('inspect', 'Inspect')} <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Details Modal */}
      {selectedDispute && (
        <div className="modal-overlay" onClick={() => setSelectedDispute(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom: 6 }}>{selectedDispute.id}</span>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>{selectedDispute.project}</h2>
              </div>
              <button onClick={() => setSelectedDispute(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}><X size={18} /></button>
            </div>

            <div style={{ background: 'var(--bg3)', padding: 16, borderRadius: 12, marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>{t('disputeSummary', 'Dispute Summary')}</div>
              <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.6 }}>{selectedDispute.reason}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 12, background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{t('disputedEscrow', 'Disputed Escrow')}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--danger)' }}>{selectedDispute.amount}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{t('assignedMediator', 'Assigned Mediator')}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{selectedDispute.mediator}</div>
              </div>
            </div>

            <div style={{ background: 'var(--primary-light)', padding: 16, borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 4 }}>{t('mediationVerdict', 'Mediation Verdict')}</div>
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{selectedDispute.verdict}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setSelectedDispute(null)}>{t('close', 'Close')}</button>
            </div>
          </div>
        </div>
      )}

      {/* File Dispute Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>{t('fileDisputeBtn', 'File Escrow Dispute')}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleFileDispute} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">{t('projectName', 'Project Name')}</label>
                <input className="form-input" required placeholder="e.g. E-Commerce Platform with React" value={newDispute.project} onChange={e => setNewDispute({ ...newDispute, project: e.target.value })} />
              </div>

              <div>
                <label className="form-label">{t('disputedEscrowAmount', 'Disputed Escrow Amount (₹)')}</label>
                <input className="form-input" type="number" placeholder="2000" value={newDispute.amount} onChange={e => setNewDispute({ ...newDispute, amount: e.target.value })} />
              </div>

              <div>
                <label className="form-label">{t('detailedReason', 'Detailed Reason & Evidence Summary')}</label>
                <textarea className="form-textarea" required rows={4} placeholder="Explain the milestone discrepancy or timeline delay..." value={newDispute.reason} onChange={e => setNewDispute({ ...newDispute, reason: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>{t('cancel', 'Cancel')}</button>
                <button type="submit" className="btn btn-danger"><ShieldAlert size={15} /> {t('submitForArbitration', 'Submit for Arbitration')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
