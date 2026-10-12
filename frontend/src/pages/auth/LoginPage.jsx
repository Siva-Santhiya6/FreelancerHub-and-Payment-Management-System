import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import OAuthButtons from '../../components/auth/OAuthButtons';
import {
  LogIn, Eye, EyeOff, Sparkles, ShieldCheck,
  User, Briefcase, Wallet, ArrowRight
} from 'lucide-react';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  const demoLogin = (role) => {
    const accounts = {
      CLIENT: { email: 'client@freelancerhub.com', password: 'Client@123' },
      FREELANCER: { email: 'freelancer@freelancerhub.com', password: 'Freelancer@123' },
      AGENCY_MANAGER: { email: 'agency@freelancerhub.com', password: 'Agency@123' },
      PAYMENT_MANAGER: { email: 'payment@freelancerhub.com', password: 'Payment@123' },
      ADMIN: { email: 'admin@freelancerhub.com', password: 'Admin@123' },
    };
    dispatch(loginUser(accounts[role]));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 24px var(--primary-glow)' }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>FreelancerHub</h1>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>Enterprise Freelance & Escrow Ecosystem</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="name@domain.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14, marginTop: 6 }}
          >
            {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <><LogIn size={16} /> Sign In to Workspace</>}
          </button>
        </form>

        {/* OAuth Buttons (Google & GitHub 1-Click Single Sign-On) */}
        <OAuthButtons defaultRole="CLIENT" />

        {/* 1-Click Demo Logins for all 5 roles */}
        <div style={{ margin: '20px 0 16px', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginBottom: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            ⚡ Instant 1-Click 5 Demo Roles
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { role: 'CLIENT', label: 'Client (Sarah)', icon: Briefcase },
              { role: 'FREELANCER', label: 'Freelancer (Raj)', icon: User },
              { role: 'AGENCY_MANAGER', label: 'Agency Manager', icon: Sparkles },
              { role: 'PAYMENT_MANAGER', label: 'Payment Mgr', icon: Wallet },
              { role: 'ADMIN', label: 'Admin Leader', icon: ShieldCheck },
            ].map(item => (
              <button
                key={item.role}
                onClick={() => demoLogin(item.role)}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center', fontSize: 11.5, padding: '7px 10px', gap: 6 }}
              >
                <item.icon size={13} color="var(--primary)" /> {item.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
}
