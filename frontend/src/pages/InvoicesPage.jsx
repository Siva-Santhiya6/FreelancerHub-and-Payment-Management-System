import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sounds } from '../utils/SoundEffects';
import { useTranslation } from '../i18n/translations';
import {
  FileText, Download, Printer, Plus, CheckCircle2, Clock,
  ShieldCheck, ArrowUpRight, Search, DollarSign, Building,
  CreditCard, Eye, X, Sparkles
} from 'lucide-react';

const initialInvoices = [
  {
    id: 'INV-2026-001',
    project: 'E-Commerce Platform with React',
    client: 'Sarah Client (TechVentures Inc.)',
    freelancer: 'Raj Freelancer',
    date: '2026-09-01',
    dueDate: '2026-09-15',
    amount: 5000,
    tax: 900,
    total: 5900,
    status: 'PAID',
    escrowTx: '0x7f8a...3b21',
    items: [
      { desc: 'Milestone 1: Frontend Architecture & Auth', hours: 25, rate: 40, total: 1000 },
      { desc: 'Milestone 2: Product Catalog & Redux Store', hours: 50, rate: 40, total: 2000 },
      { desc: 'Milestone 3: Checkout & Stripe Escrow Integration', hours: 50, rate: 40, total: 2000 },
    ]
  },
  {
    id: 'INV-2026-002',
    project: 'AI Chatbot for Customer Support',
    client: 'Sarah Client (TechVentures Inc.)',
    freelancer: 'Raj Freelancer',
    date: '2026-09-05',
    dueDate: '2026-09-20',
    amount: 8000,
    tax: 1440,
    total: 9440,
    status: 'ESCROW_LOCKED',
    escrowTx: '0x99e2...14ab',
    items: [
      { desc: 'Milestone 1: NLP Intent Training Dataset', hours: 60, rate: 50, total: 3000 },
      { desc: 'Milestone 2: Multilingual Tamil/English Engine', hours: 100, rate: 50, total: 5000 },
    ]
  },
  {
    id: 'INV-2026-003',
    project: 'Mobile App UI/UX Design',
    client: 'Fintech Spark Ltd.',
    freelancer: 'Sarah Client',
    date: '2026-09-08',
    dueDate: '2026-09-22',
    amount: 2500,
    tax: 450,
    total: 2950,
    status: 'PENDING',
    escrowTx: '0x43a1...8f02',
    items: [
      { desc: 'Figma Design System & Mobile Screens (30 Screens)', hours: 50, rate: 50, total: 2500 },
    ]
  }
];

export default function InvoicesPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [newInv, setNewInv] = useState({
    project: '',
    client: user?.name || 'Client',
    freelancer: 'Raj Freelancer',
    amount: 3000,
    desc: 'Full-stack Platform Feature Delivery',
  });

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const invAmount = Number(newInv.amount);
    const tax = Math.round(invAmount * 0.18);
    const created = {
      id: `INV-2026-00${invoices.length + 1}`,
      project: newInv.project || 'Custom Project Delivery',
      client: newInv.client,
      freelancer: newInv.freelancer,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: invAmount,
      tax: tax,
      total: invAmount + tax,
      status: 'ESCROW_LOCKED',
      escrowTx: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6),
      items: [
        { desc: newInv.desc, hours: 40, rate: Math.round(invAmount / 40), total: invAmount }
      ]
    };
    setInvoices([created, ...invoices]);
    setCreateModalOpen(false);
    setSelectedInvoice(created);
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = inv.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        inv.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalBilled = invoices.reduce((acc, i) => acc + i.total, 0);
  const totalInEscrow = invoices.filter(i => i.status === 'ESCROW_LOCKED').reduce((acc, i) => acc + i.total, 0);

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>{t('invoicesAndBilling', 'Smart Escrow Invoices & Receipts')}</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text3)', marginTop: 4 }}>
            {t('invoicesSubtitle', 'Verifiable, tax-compliant invoices secured by FreelancerHub Smart Vault.')}
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => { sounds.playClick(); setCreateModalOpen(true); }}>
          <Plus size={16} /> {t('generateInvoice', 'Generate New Invoice')}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="metric-grid" style={{ marginBottom: 24 }}>
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
            <span className="metric-label">{t('totalInvoicedVolume', 'Total Invoiced Volume')}</span>
            <FileText size={18} />
          </div>
          <div className="metric-val">₹{totalBilled.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>100% {t('taxCompliant', 'Tax Compliant')}</div>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning)' }}>
            <span className="metric-label">{t('activeEscrowLocked', 'Active Escrow Locked')}</span>
            <ShieldCheck size={18} />
          </div>
          <div className="metric-val" style={{ color: 'var(--warning)' }}>₹{totalInEscrow.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>{t('awaitingMilestoneApproval', 'Awaiting client milestone approval')}</div>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
            <span className="metric-label">{t('completedSettlements', 'Completed Settlements')}</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="metric-val" style={{ color: 'var(--success)' }}>{invoices.filter(i => i.status === 'PAID').length}</div>
          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>0 {t('disputes', 'Chargebacks / Disputes')}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['ALL', 'PAID', 'ESCROW_LOCKED', 'PENDING'].map(status => (
            <button
              key={status}
              className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { sounds.playClick(); setFilterStatus(status); }}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 34, height: 36, fontSize: 12.5 }}
            placeholder="Search by invoice ID or project..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Invoice Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <th style={{ padding: '14px 20px' }}>Invoice ID</th>
                <th style={{ padding: '14px 20px' }}>Project & Client</th>
                <th style={{ padding: '14px 20px' }}>Date</th>
                <th style={{ padding: '14px 20px' }}>Amount</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--primary)' }}>
                    {inv.id}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{inv.project}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{inv.client}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text3)' }}>{inv.date}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text)' }}>₹{inv.total.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: 'var(--text4)' }}>Base: ₹{inv.amount.toLocaleString()} + Tax: ₹{inv.tax}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {inv.status === 'PAID' && <span className="badge badge-success">✓ Paid</span>}
                    {inv.status === 'ESCROW_LOCKED' && <span className="badge badge-warning">🔒 Escrow Vault</span>}
                    {inv.status === 'PENDING' && <span className="badge badge-neutral">⏳ Pending</span>}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { sounds.playClick(); setSelectedInvoice(inv); }}
                    >
                      <Eye size={13} /> View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail / Print Modal */}
      {selectedInvoice && (
        <div className="modal-backdrop" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 720, padding: 36 }}>
            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="badge badge-primary" style={{ fontSize: 12, padding: '6px 12px' }}>
                  {selectedInvoice.id}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>Smart Escrow Verified</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                  <Printer size={14} /> Print / Export PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedInvoice(null)}>
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div id="invoice-sheet" style={{ background: 'var(--bg2)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>FreelancerHub</h2>
                  <p style={{ fontSize: 12, color: 'var(--text3)' }}>Decentralized Escrow & Freelance Network</p>
                  <p style={{ fontSize: 12, color: 'var(--text3)' }}>GSTIN: 33AAAAA0000A1Z5</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>TAX INVOICE</h3>
                  <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono', marginTop: 4 }}>{selectedInvoice.id}</p>
                  <p style={{ fontSize: 12, color: 'var(--text3)' }}>Date: {selectedInvoice.date}</p>
                  <p style={{ fontSize: 12, color: 'var(--text3)' }}>Due: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28, padding: 16, background: 'var(--bg3)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Billed To:</div>
                  <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>{selectedInvoice.client}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>Verified Platform Employer</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Payee / Provider:</div>
                  <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>{selectedInvoice.freelancer}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>FreelancerHub Verified Pro</div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24, fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text3)', fontSize: 11.5 }}>
                    <th style={{ padding: '8px 0' }}>Description</th>
                    <th style={{ padding: '8px 0', textAlign: 'center' }}>Hours</th>
                    <th style={{ padding: '8px 0', textAlign: 'center' }}>Rate</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600 }}>{item.desc}</td>
                      <td style={{ padding: '12px 0', textAlign: 'center', color: 'var(--text3)' }}>{item.hours}h</td>
                      <td style={{ padding: '12px 0', textAlign: 'center', color: 'var(--text3)' }}>₹{item.rate}/h</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700 }}>₹{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text3)' }}>
                    <span>Subtotal:</span>
                    <span>₹{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text3)' }}>
                    <span>GST (18%):</span>
                    <span>₹{selectedInvoice.tax.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text3)' }}>
                    <span>Platform Fee:</span>
                    <span style={{ color: 'var(--success)' }}>₹0 (0% Promo)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 16, borderTop: '1px solid var(--border)', paddingTop: 8, color: 'var(--primary)' }}>
                    <span>Total:</span>
                    <span>₹{selectedInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Escrow Hash Stamp */}
              <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)' }}>
                <ShieldCheck size={20} color="var(--success)" />
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                  Smart Vault Verification: <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text2)', fontWeight: 700 }}>{selectedInvoice.escrowTx}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {createModalOpen && (
        <div className="modal-backdrop" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Create New Escrow Invoice</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setCreateModalOpen(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateInvoice}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  className="form-input"
                  required
                  placeholder="e.g. Next.js SaaS Web Application"
                  value={newInv.project}
                  onChange={e => setNewInv({ ...newInv, project: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deliverable Scope / Milestone Description</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: 70 }}
                  value={newInv.desc}
                  onChange={e => setNewInv({ ...newInv, desc: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input
                    className="form-input"
                    value={newInv.client}
                    onChange={e => setNewInv({ ...newInv, client: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={newInv.amount}
                    onChange={e => setNewInv({ ...newInv, amount: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCreateModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Sparkles size={15} /> Generate Tax Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
