import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../i18n/translations';
import {
  Clock, Play, Square, Plus, CheckCircle2, Calendar,
  DollarSign, FileText, ArrowRight, Sparkles, X, User
} from 'lucide-react';

const initialLogs = [
  { id: 1, project: 'E-Commerce Platform with React', task: 'Implemented Redux slice & API interceptors', hours: 4.5, rate: '₹1,200/hr', total: '₹5,400', date: '2026-09-21', status: 'APPROVED' },
  { id: 2, project: 'E-Commerce Platform with React', task: 'Created responsive shopping cart checkout modal', hours: 3.0, rate: '₹1,200/hr', total: '₹3,600', date: '2026-09-20', status: 'APPROVED' },
  { id: 3, project: 'Multilingual AI Chatbot', task: 'Dataset preprocessing and tokenization in Tamil', hours: 5.0, rate: '₹1,500/hr', total: '₹7,500', date: '2026-09-19', status: 'PENDING' },
];

export default function TimesheetsPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [logs, setLogs] = useState(initialLogs);
  const [isTracking, setIsTracking] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeTask, setActiveTask] = useState('Frontend Component Development');
  const [modalOpen, setModalOpen] = useState(false);
  const [newLog, setNewLog] = useState({ project: 'E-Commerce Platform with React', task: '', hours: '2' });

  // Live timer effect
  useEffect(() => {
    let interval = null;
    if (isTracking) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStopTracker = () => {
    setIsTracking(false);
    const hoursLogged = Math.max(0.5, Math.round((timerSeconds / 3600) * 10) / 10);
    const newEntry = {
      id: Date.now(),
      project: 'E-Commerce Platform with React',
      task: activeTask,
      hours: hoursLogged,
      rate: '₹1,200/hr',
      total: `₹${Math.round(hoursLogged * 1200).toLocaleString()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };
    setLogs([newEntry, ...logs]);
    setTimerSeconds(0);
    alert(`Logged ${hoursLogged} hrs for "${activeTask}" into weekly timesheet!`);
  };

  const handleAddManualLog = (e) => {
    e.preventDefault();
    if (!newLog.task) return;
    const hours = Number(newLog.hours);
    const entry = {
      id: Date.now(),
      project: newLog.project,
      task: newLog.task,
      hours,
      rate: '₹1,200/hr',
      total: `₹${Math.round(hours * 1200).toLocaleString()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };
    setLogs([entry, ...logs]);
    setNewLog({ project: 'E-Commerce Platform with React', task: '', hours: '2' });
    setModalOpen(false);
  };

  const totalLoggedHours = logs.reduce((acc, l) => acc + l.hours, 0);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Clock size={12} /> {t('autonomousTimeTracking', 'Autonomous Time & Activity Tracking')}
          </div>
          <h1>{t('timesheetsTracking', 'Timesheets & Live Worklogs')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('timesheetsSubtitle', 'Track billable hours, generate automated timesheets, and sync milestone verifications')}</p>
        </div>

        <button className="btn btn-outline" onClick={() => setModalOpen(true)}>
          <Plus size={15} /> {t('logManualHours', 'Log Manual Hours')}
        </button>
      </div>

      {/* Live Stopwatch Tracker Bar */}
      <div className="card" style={{ marginBottom: 24, padding: '20px 24px', background: 'var(--bg2)', border: '1.5px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: isTracking ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isTracking ? 'var(--danger)' : 'var(--primary)' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>{t('activeLiveTimer', 'Active Live Timer')}</div>
              <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'monospace', color: 'var(--text)' }}>
                {formatTimer(timerSeconds)}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 260, maxWidth: 400 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>{t('currentTaskDescription', 'Current Task Description')}</label>
            <input
              className="form-input"
              value={activeTask}
              onChange={e => setActiveTask(e.target.value)}
              disabled={isTracking}
              placeholder="What are you currently developing?"
            />
          </div>

          <div>
            {!isTracking ? (
              <button className="btn btn-primary" onClick={() => setIsTracking(true)} style={{ padding: '10px 20px' }}>
                <Play size={16} /> {t('startTimer', 'Start Timer')}
              </button>
            ) : (
              <button className="btn btn-danger" onClick={handleStopTracker} style={{ padding: '10px 20px' }}>
                <Square size={16} /> {t('stopAndLogHours', 'Stop & Log Hours')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('totalHoursThisWeek', 'Total Hours This Week')}</span>
            <div className="stat-icon stat-icon-purple"><Clock size={20} /></div>
          </div>
          <div className="stat-value">{totalLoggedHours} {t('hours', 'Hours')}</div>
          <div className="stat-footer stat-up">+4.5 hrs {t('vsLastPeriod', 'compared to last week')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('billableTotalAmount', 'Billable Total Amount')}</span>
            <div className="stat-icon stat-icon-emerald"><DollarSign size={20} /></div>
          </div>
          <div className="stat-value">₹{Math.round(totalLoggedHours * 1200).toLocaleString()}</div>
          <div className="stat-footer stat-up"><CheckCircle2 size={14} /> {t('escrowGuaranteed', 'Escrow Guaranteed')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('timesheetApprovalStatus', 'Timesheet Approval Status')}</span>
            <div className="stat-icon stat-icon-blue"><CheckCircle2 size={20} /></div>
          </div>
          <div className="stat-value">85% {t('approved', 'Approved')}</div>
          <div className="stat-footer stat-neutral">1 {t('pendingClientInspection', 'pending client inspection')}</div>
        </div>
      </div>

      {/* Worklogs Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t('weeklyWorklogLedger', 'Weekly Worklog Ledger')}</h3>
          <span className="badge badge-purple">{logs.length} {t('entries', 'Entries')}</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('date', 'Date')}</th>
                <th>{t('project', 'Project')}</th>
                <th>{t('taskSummary', 'Task Summary')}</th>
                <th>{t('hours', 'Hours')}</th>
                <th>{t('rate', 'Rate')}</th>
                <th>{t('totalEarned', 'Total Earned')}</th>
                <th>{t('status', 'Status')}</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 600 }}>{log.date}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{log.project}</td>
                  <td>{log.task}</td>
                  <td style={{ fontWeight: 800 }}>{log.hours} hrs</td>
                  <td>{log.rate}</td>
                  <td style={{ fontWeight: 800, color: 'var(--text)' }}>{log.total}</td>
                  <td>
                    <span className={`badge ${log.status === 'APPROVED' ? 'badge-success' : 'badge-amber'}`}>
                      {log.status === 'APPROVED' ? t('approved', 'APPROVED') : t('pending', 'PENDING')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Hour Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>{t('logBillableHours', 'Log Billable Hours')}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddManualLog} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">{t('project', 'Project')}</label>
                <input className="form-input" required value={newLog.project} onChange={e => setNewLog({ ...newLog, project: e.target.value })} />
              </div>

              <div>
                <label className="form-label">{t('taskDeliverable', 'Task Deliverable')}</label>
                <input className="form-input" required placeholder="e.g. Unit tests and API documentation" value={newLog.task} onChange={e => setNewLog({ ...newLog, task: e.target.value })} />
              </div>

              <div>
                <label className="form-label">{t('hoursSpent', 'Hours Spent')}</label>
                <input className="form-input" type="number" step="0.5" min="0.5" max="24" required value={newLog.hours} onChange={e => setNewLog({ ...newLog, hours: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>{t('cancel', 'Cancel')}</button>
                <button type="submit" className="btn btn-primary"><CheckCircle2 size={14} /> {t('submitWorklog', 'Submit Worklog')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
