import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { oauthLoginUser } from '../../store/slices/authSlice';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('Verifying Google authorization token...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // 1. Check for token in URL hash (Implicit / Token Flow: #access_token=...)
        const hashParams = new URLSearchParams(location.hash.replace('#', ''));
        const accessToken = hashParams.get('access_token');

        // 2. Check for code or token in search params (?code=... or ?token=...)
        const searchParams = new URLSearchParams(location.search);
        const searchToken = searchParams.get('token') || searchParams.get('access_token');
        const token = accessToken || searchToken;

        if (token) {
          setStatus('Fetching authenticated profile from Google APIs...');
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!userInfoRes.ok) {
            throw new Error('Failed to retrieve Google profile with access token.');
          }

          const userInfo = await userInfoRes.json();
          if (userInfo.email) {
            setStatus(`Authenticated as ${userInfo.email}. Setting up workspace session...`);
            
            const payload = {
              provider: 'google',
              email: userInfo.email,
              name: userInfo.name || userInfo.email.split('@')[0],
              avatar: userInfo.picture || '',
              role: localStorage.getItem('oauth_pending_role') || 'CLIENT',
              providerId: userInfo.sub,
            };

            await dispatch(oauthLoginUser(payload)).unwrap();
            localStorage.removeItem('oauth_pending_role');
            navigate('/dashboard');
            return;
          }
        }

        setError('No valid Google OAuth token received in callback. Please try signing in again.');
      } catch (err) {
        console.error('OAuth Callback Processing Error:', err);
        setError(err.message || 'Google OAuth authentication failed.');
      }
    };

    handleOAuthCallback();
  }, [location, dispatch, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ maxWidth: 460, width: '90%', textAlign: 'center', padding: 36 }}>
        <div style={{ width: 54, height: 54, borderRadius: 18, background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px var(--primary-glow)' }}>
          <Sparkles size={28} />
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Google Authentication</h2>

        {!error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 16 }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
            <p style={{ color: 'var(--text2)', fontSize: 13.5 }}>{status}</p>
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 16 }}>
              <AlertCircle size={16} /> {error}
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Return to Login Screen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
