import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import OAuthButtons from '../../components/auth/OAuthButtons';
import { UserPlus, Sparkles, Briefcase, User, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CLIENT' });

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 24px var(--primary-glow)' }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>Create Your Account</h1>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>Join the smart escrow freelance network</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role selector buttons */}
          <div className="form-group">
            <label className="form-label">I want to</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'CLIENT' })}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: `1.5px solid ${form.role === 'CLIENT' ? 'var(--primary)' : 'var(--border)'}`,
                  background: form.role === 'CLIENT' ? 'var(--primary-light)' : 'var(--bg3)',
                  color: form.role === 'CLIENT' ? 'var(--primary)' : 'var(--text)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 12.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  justifyContent: 'center'
                }}
              >
                <Briefcase size={16} /> Hire Talent
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'FREELANCER' })}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: `1.5px solid ${form.role === 'FREELANCER' ? 'var(--primary)' : 'var(--border)'}`,
                  background: form.role === 'FREELANCER' ? 'var(--primary-light)' : 'var(--bg3)',
                  color: form.role === 'FREELANCER' ? 'var(--primary)' : 'var(--text)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 12.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  justifyContent: 'center'
                }}
              >
                <User size={16} /> Work as Freelancer
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. John Smith"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14, marginTop: 10 }}
          >
            {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <><UserPlus size={16} /> Register & Join</>}
          </button>
        </form>

        {/* OAuth Buttons (Google & GitHub 1-Click Single Sign-On) */}
        <OAuthButtons defaultRole={form.role} />

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)', marginTop: 20 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
