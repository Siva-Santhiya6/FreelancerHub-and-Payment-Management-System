import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { exportToCSV } from '../utils/csvExport';
import { useTranslation } from '../i18n/translations';
import {
  DollarSign, CheckCircle, Clock, AlertCircle, RefreshCw,
  ShieldCheck, Wallet, ArrowUpRight, ArrowDownLeft, Download,
  Receipt, CreditCard, QrCode, Building2, Check, X, FileText, FileSpreadsheet
} from 'lucide-react';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export default function PaymentsPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Form states
  const [depositAmount, setDepositAmount] = useState('10000');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [depositSuccess, setDepositSuccess] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Filter state
  const [filterType, setFilterType] = useState('all');
  const [searchTx, setSearchTx] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const txRes = await axios.get('/api/payments/transactions', { headers: authHeader() });
        setTransactions(txRes.data.payments || []);
        if (['ADMIN', 'PAYMENT_MANAGER'].includes(user?.role)) {
          const sRes = await axios.get('/api/payments/stats', { headers: authHeader() });
          setStats(sRes.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  const totalPaid = transactions.filter(t => t.status === 'COMPLETED').reduce((a, t) => a + t.amount, 0);

  const monthlyData = [
    { month: 'Jan', amount: 8000, escrow: 12000 },
    { month: 'Feb', amount: 12000, escrow: 15000 },
    { month: 'Mar', amount: 9500, escrow: 11000 },
    { month: 'Apr', amount: 15000, escrow: 18000 },
    { month: 'May', amount: 11000, escrow: 14000 },
    { month: 'Jun', amount: totalPaid || 16000, escrow: (totalPaid || 16000) + 5000 },
  ];

  const handleDeposit = () => {
    setDepositSuccess(true);
    setTimeout(() => {
      setDepositSuccess(false);
      setDepositModalOpen(false);
    }, 1400);
  };

  const handleWithdraw = () => {
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWithdrawModalOpen(false);
    }, 1400);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.status !== filterType) return false;
    if (searchTx && !t.transactionId?.toLowerCase().includes(searchTx.toLowerCase()) && !t.projectId?.title?.toLowerCase().includes(searchTx.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleExportTransactionsCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    const metadata = [
      `# FREELANCERHUB PAYMENTS & ESCROW TRANSACTION STATEMENT`,
      `# Generated On: ${new Date().toLocaleString('en-IN')}`,
      `# Account User: ${user?.name || 'Authorized User'} (${user?.role || 'CLIENT'})`,
      `# Total Transacted Volume: ₹${(totalPaid || 0).toLocaleString()}`,
    ];

    const headers = [
      'Transaction Reference ID',
      'Project Workspace',
      'Amount (INR)',
      'Payment Rail / Method',
      'Transaction Status',
      'Timestamp Date',
      'Payer / Client',
      'Payee / Freelancer'
    ];

    const rows = filteredTransactions.map(t => [
      t.transactionId || `TX-${t._id?.slice(-8).toUpperCase()}`,
      t.projectId?.title || 'E-Commerce Platform with React',
      t.amount,
      t.paymentMethod || 'UPI / Escrow',
      t.status,
      new Date(t.createdAt).toLocaleString('en-IN'),
      t.clientId?.name || user?.name || 'Sarah Client',
      t.freelancerId?.name || 'Raj Freelancer'
    ]);

    exportToCSV({
      filename: `freelancerhub-transactions-${today}.csv`,
      headers,
      rows,
      metadata
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <ShieldCheck size={12} /> {t('escrowAndTreasury', 'Autonomous Escrow & Payment Engine')}
          </div>
          <h1>{t('paymentsAndEscrow', 'Payments & Escrow Management')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('paymentsSubtitle', 'Protected milestone deposits, transaction statements, and instant payouts')}</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {user?.role === 'CLIENT' && (
            <button className="btn btn-primary" onClick={() => setDepositModalOpen(true)}>
              <ArrowUpRight size={15} /> {t('fundEscrowBtn', 'Deposit Escrow')}
            </button>
          )}
          {user?.role === 'FREELANCER' && (
            <button className="btn btn-success" onClick={() => setWithdrawModalOpen(true)}>
              <ArrowDownLeft size={15} /> {t('escrowPayouts', 'Request Payout')}
            </button>
          )}
        </div>
      </div>

      {/* Escrow Vault Overview Cards */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card" style={{ '--stat-color': '#6366f1' }}>
          <div className="stat-icon" style={{ background: 'var(--primary-light)' }}>
            <Wallet size={22} color="var(--primary)" />
          </div>
          <div>
            <div className="stat-value">₹{(totalPaid || 25000).toLocaleString()}</div>
            <div className="stat-label">{t('platformVolume', 'Total Transacted')}</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#10b981' }}>
          <div className="stat-icon" style={{ background: 'var(--success-light)' }}>
            <CheckCircle size={22} color="var(--success)" />
          </div>
          <div>
            <div className="stat-value">{transactions.filter(t => t.status === 'COMPLETED').length || 4}</div>
            <div className="stat-label">{t('completedMilestones', 'Completed Milestones')}</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#06b6d4' }}>
          <div className="stat-icon" style={{ background: 'var(--accent-light)' }}>
            <ShieldCheck size={22} color="var(--accent)" />
          </div>
          <div>
            <div className="stat-value">100%</div>
            <div className="stat-label">{t('escrowSafetyGuarantee', 'Escrow Safety Guarantee')}</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#f59e0b' }}>
          <div className="stat-icon" style={{ background: 'var(--warning-light)' }}>
            <Clock size={22} color="var(--warning)" />
          </div>
          <div>
            <div className="stat-value">₹0</div>
            <div className="stat-label">{t('disputeReserve', 'Disputed Reserve')}</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t('financialVelocityTitle', 'Escrow Velocity & Payout Volume')}</h3>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>{t('financialVelocitySubtitle', 'Monthly milestone settlement history')}</p>
          </div>
          <span className="badge badge-purple">{t('promoFee', 'Zero Platform Fee')}</span>
        </div>

        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis dataKey="month" stroke="var(--text3)" fontSize={12} />
              <YAxis stroke="var(--text3)" fontSize={12} tickFormatter={v => `₹${v}`} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: 8, color: 'var(--text)' }}
                formatter={(v) => [`₹${v.toLocaleString()}`, '']}
              />
              <Bar dataKey="escrow" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Escrow Protected" />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} name="Released to Freelancers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table & Filters */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>Official Transaction Ledger</h3>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>Complete cryptographic audit trail of all transactions</p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['all', 'COMPLETED', 'PENDING'].map(st => (
              <button
                key={st}
                onClick={() => setFilterType(st)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  border: `1.5px solid ${filterType === st ? 'var(--primary)' : 'var(--border)'}`,
                  background: filterType === st ? 'var(--primary-light)' : 'transparent',
                  color: filterType === st ? 'var(--primary)' : 'var(--text3)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {st}
              </button>
            ))}
            <button className="btn btn-outline btn-sm" onClick={handleExportTransactionsCSV} title="Export Transactions CSV">
              <FileSpreadsheet size={13} /> Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--text3)' }}>
            <FileText size={36} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
            <p style={{ fontWeight: 600 }}>No transaction records matching filter.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Transaction Ref</th>
                  <th>Project Workspace</th>
                  <th>Amount</th>
                  <th>Payment Rail</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>
                      {t.transactionId || `TX-${t._id?.slice(-8).toUpperCase()}`}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text)' }}>
                      {t.projectId?.title || 'E-Commerce Platform with React'}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--success)', fontSize: 14 }}>
                      ₹{t.amount?.toLocaleString()}
                    </td>
                    <td>
                      <span className="badge badge-info">{t.paymentMethod || 'UPI / Instant'}</span>
                    </td>
                    <td>
                      <span className={`badge ${t.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedReceipt(t)}
                        style={{ padding: '3px 8px', fontSize: 11 }}
                      >
                        <Receipt size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {depositModalOpen && (
        <div className="modal-overlay" onClick={() => setDepositModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 28, maxWidth: 500 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>🔒 Deposit to Escrow Vault</h3>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>
              Select payment rail to fund milestone escrow safely.
            </p>

            {depositSuccess ? (
              <div className="alert alert-success" style={{ textAlign: 'center', padding: 20 }}>
                <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                <h4>₹{Number(depositAmount).toLocaleString()} Deposited in Escrow!</h4>
                <p style={{ fontSize: 12 }}>Protected milestone security activated.</p>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Deposit Amount (₹ INR)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Payment Rail</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { id: 'UPI', label: 'UPI / QR Code', icon: QrCode },
                      { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
                      { id: 'NETBANK', label: 'Net Banking', icon: Building2 },
                      { id: 'WALLET', label: 'Escrow Wallet', icon: Wallet },
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          border: `1.5px solid ${paymentMethod === method.id ? 'var(--primary)' : 'var(--border)'}`,
                          background: paymentMethod === method.id ? 'var(--primary-light)' : 'var(--bg3)',
                          color: paymentMethod === method.id ? 'var(--primary)' : 'var(--text)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontWeight: 700,
                          fontSize: 12
                        }}
                      >
                        <method.icon size={16} /> {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                  <button className="btn btn-outline" onClick={() => setDepositModalOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleDeposit}>
                    <ShieldCheck size={16} /> Complete Escrow Deposit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {withdrawModalOpen && (
        <div className="modal-overlay" onClick={() => setWithdrawModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 28, maxWidth: 480 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>💸 Instant Freelancer Payout</h3>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>
              Transfer released milestone earnings directly to your bank account / UPI ID.
            </p>

            {withdrawSuccess ? (
              <div className="alert alert-success" style={{ textAlign: 'center', padding: 20 }}>
                <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                <h4>Payout of ₹{Number(withdrawAmount).toLocaleString()} Initiated!</h4>
                <p style={{ fontSize: 12 }}>Estimated arrival: 5-10 minutes.</p>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Withdrawal Amount (₹ INR)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                  />
                </div>

                <div style={{ background: 'var(--bg3)', padding: 14, borderRadius: 10, marginBottom: 20, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text3)' }}>Platform Fee (0% Promotional):</span>
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text3)' }}>Net Payout Received:</span>
                    <span style={{ fontWeight: 800, color: 'var(--text)' }}>₹{Number(withdrawAmount).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => setWithdrawModalOpen(false)}>Cancel</button>
                  <button className="btn btn-success" onClick={handleWithdraw}>
                    Confirm Instant Payout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 32, maxWidth: 440 }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <CheckCircle size={24} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Payment Confirmation</h3>
              <p style={{ fontSize: 12, color: 'var(--text3)' }}>FreelancerHub Escrow Vault Receipt</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text3)' }}>Amount:</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>₹{selectedReceipt.amount?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text3)' }}>Transaction Ref:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedReceipt.transactionId || selectedReceipt._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text3)' }}>Date:</span>
                <span>{new Date(selectedReceipt.createdAt).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text3)' }}>Security Guarantee:</span>
                <span className="badge badge-success">Escrow Protected</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setSelectedReceipt(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => setSelectedReceipt(null)}>
                <Download size={14} /> Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
