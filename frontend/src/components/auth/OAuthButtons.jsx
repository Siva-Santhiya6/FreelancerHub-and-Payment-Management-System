import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { oauthLoginUser } from '../../store/slices/authSlice';
import { Sparkles, Check, X, Shield, User, Briefcase, Key, ExternalLink, AlertCircle, HelpCircle } from 'lucide-react';

export default function OAuthButtons({ defaultRole = 'CLIENT', onSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  
  // Google Client ID (from .env or localStorage)
  const [googleClientId, setGoogleClientId] = useState(() => {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('GOOGLE_CLIENT_ID') || '';
  });
  
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Keep selectedRole updated if defaultRole changes
  useEffect(() => {
    setSelectedRole(defaultRole);
  }, [defaultRole]);

  // Initiate real Google OAuth 2.0 flow
  const handleGoogleClick = () => {
    setAuthError('');
    const activeClientId = (googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('GOOGLE_CLIENT_ID') || '').trim();

    // 1. If Client ID is present and Google SDK is loaded, launch official Google popup
    if (activeClientId && window.google?.accounts?.oauth2) {
      try {
        setLoading(true);
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: activeClientId,
          scope: 'openid email profile',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                // Fetch verified profile from official Google OAuth API
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                
                if (!userInfoRes.ok) {
                  throw new Error('Could not fetch profile from Google');
                }

                const userInfo = await userInfoRes.json();
                
                if (userInfo.email) {
                  const payload = {
                    provider: 'google',
                    email: userInfo.email,
                    name: userInfo.name || userInfo.email.split('@')[0],
                    avatar: userInfo.picture || '',
                    role: selectedRole,
                    providerId: userInfo.sub,
                  };
                  
                  const res = await dispatch(oauthLoginUser(payload)).unwrap();
                  if (onSuccess) onSuccess(res);
                  else navigate('/dashboard');
                  return;
                }
              } catch (err) {
                console.error('Failed to authenticate with Google profile:', err);
                setAuthError(typeof err === 'string' ? err : 'Failed to fetch Google profile. Please try again.');
              } finally {
                setLoading(false);
              }
            } else {
              setLoading(false);
            }
          },
          error_callback: (err) => {
            console.warn('Google OAuth popup notification:', err);
            setLoading(false);
            if (err?.type === 'popup_closed') {
              setAuthError('Google sign-in popup was closed.');
            } else {
              setAuthError(err?.message || 'Google authentication encountered an issue.');
            }
          }
        });

        // Open official Google Account Chooser popup
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Error launching Google Identity Services client:', err);
        setLoading(false);
      }
    }

    // 2. If Google Client ID is not configured yet, open configuration modal
    setModalOpen(true);
  };

  const handleSaveClientIdAndLaunch = (e) => {
    e?.preventDefault();
    if (!googleClientId.trim()) {
      setAuthError('Please enter a valid Google OAuth Client ID');
      return;
    }
    
    const cleanId = googleClientId.trim();
    localStorage.setItem('GOOGLE_CLIENT_ID', cleanId);
    setModalOpen(false);
    setAuthError('');
    
    // Automatically trigger Google OAuth popup
    setTimeout(() => {
      handleGoogleClick();
    }, 150);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 14px' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
          Or Continue With
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
        {/* Real Official Google OAuth Button */}
        <button
          type="button"
          id="btn-google-signin"
          onClick={handleGoogleClick}
          disabled={loading}
          className="btn btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '11px 16px',
            fontSize: 13.5,
            fontWeight: 700,
            background: 'var(--bg3)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? (
            <div className="spinner" style={{ width: 18, height: 18 }} />
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </div>

      {authError && (
        <div className="alert alert-error" style={{ marginTop: 10, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={14} /> {authError}
        </div>
      )}

      {/* Real Google Cloud OAuth Setup Modal */}
      {modalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div
            className="modal"
            style={{
              maxWidth: 480,
              width: '92%',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 26,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800 }}>Connect Real Google OAuth 2.0</h3>
                  <p style={{ fontSize: 12, color: 'var(--text3)' }}>Official Google Account Chooser & Auth</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'var(--bg3)', padding: 14, borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 16 }}>
              <p style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.5, marginBottom: 8 }}>
                To open the real <strong>accounts.google.com</strong> login popup in your browser, connect your <strong>Google OAuth Client ID</strong>:
              </p>
              <ol style={{ paddingLeft: 18, fontSize: 12, color: 'var(--text3)', lineHeight: 1.7, margin: 0 }}>
                <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Google Cloud Console → Credentials <ExternalLink size={11} style={{ display: 'inline' }} /></a></li>
                <li>Create an <strong>OAuth Client ID</strong> (Web Application) with Authorized Origin: <code>http://localhost:5173</code></li>
                <li>Paste the Client ID below to launch the live Google Sign-In popup:</li>
              </ol>
            </div>

            <form onSubmit={handleSaveClientIdAndLaunch}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Google Client ID</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. 1234567890-abcdefg.apps.googleusercontent.com"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  required
                  autoFocus
                  style={{ fontSize: 12.5 }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Account Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { role: 'CLIENT', label: 'Client / Employer', icon: Briefcase },
                    { role: 'FREELANCER', label: 'Freelancer / Pro', icon: User },
                    { role: 'AGENCY_MANAGER', label: 'Agency Lead', icon: Sparkles },
                    { role: 'ADMIN', label: 'Administrator', icon: Shield },
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setSelectedRole(r.role)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedRole === r.role ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: selectedRole === r.role ? 'var(--primary-light)' : 'var(--bg3)',
                        color: selectedRole === r.role ? 'var(--primary)' : 'var(--text)',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <r.icon size={13} /> {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.6, justifyContent: 'center' }}
                >
                  Save & Launch Google Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
