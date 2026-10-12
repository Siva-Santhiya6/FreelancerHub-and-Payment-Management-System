import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';

import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';

import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CreateProjectPage from './pages/CreateProjectPage';
import MyProjectsPage from './pages/MyProjectsPage';
import ProposalsPage from './pages/ProposalsPage';
import PaymentsPage from './pages/PaymentsPage';
import InvoicesPage from './pages/InvoicesPage';
import AgencyPage from './pages/AgencyPage';
import DisputesPage from './pages/DisputesPage';
import SkillsAssessmentPage from './pages/SkillsAssessmentPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ContractsPage from './pages/ContractsPage';
import TimesheetsPage from './pages/TimesheetsPage';
import CommunityPage from './pages/CommunityPage';
import EscrowGovernancePage from './pages/EscrowGovernancePage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';

import AIWidget from './components/ai/AIWidget';

const ProtectedRoute = ({ children, roles }) => {
  const { user, token, initialChecked } = useSelector(s => s.auth);
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (!user) {
    if (initialChecked) {
      return <Navigate to="/login" replace />;
    }
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Verifying credentials...</p>
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, marginTop: 8 }}
        >
          Go to Login Screen
        </button>
      </div>
    );
  }
  
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const { theme, fontSize, palette } = useSelector(s => s.ui);
  const { token } = useSelector(s => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [token]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-palette', palette || 'aurora');
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  }, [theme, fontSize, palette]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          
          {/* Main 20+ Ecosystem Routes */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="projects/create" element={<ProtectedRoute roles={['CLIENT', 'AGENCY_MANAGER', 'ADMIN']}><CreateProjectPage /></ProtectedRoute>} />
          <Route path="my-projects" element={<MyProjectsPage />} />
          <Route path="proposals" element={<ProposalsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="agency" element={<AgencyPage />} />
          <Route path="disputes" element={<DisputesPage />} />
          <Route path="skills-assessment" element={<SkillsAssessmentPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="timesheets" element={<TimesheetsPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="escrow-governance" element={<ProtectedRoute roles={['PAYMENT_MANAGER', 'ADMIN']}><EscrowGovernancePage /></ProtectedRoute>} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin" element={<ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      {/* Globally Accessible AI Assistant Floating Widget */}
      <AIWidget />
    </>
  );
}
