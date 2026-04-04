import * as React from 'react';
import { AuthContext } from '../contexts/AuthContext';

const styles = {
  '@import': "url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap')",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .auth-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #f5f4f0;
  }

  /* ── LEFT PANEL ── */
  .auth-left {
    flex: 1.1;
    background: #0f0e1a;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 3rem;
  }

  .auth-left-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 30%, rgba(83,74,183,0.45) 0%, transparent 70%),
      radial-gradient(ellipse 60% 80% at 80% 70%, rgba(15,110,86,0.3) 0%, transparent 70%);
  }

  .auth-left-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .auth-left-content { position: relative; z-index: 1; }

  .auth-left-orbs {
    position: absolute;
    top: 12%;
    right: 10%;
    width: 160px;
    height: 160px;
  }

  .orb {
    border-radius: 50%;
    position: absolute;
  }

  .orb-1 {
    width: 90px; height: 90px;
    background: rgba(159,152,232,0.2);
    border: 1px solid rgba(159,152,232,0.3);
    top: 0; right: 0;
  }

  .orb-2 {
    width: 60px; height: 60px;
    background: rgba(29,158,117,0.15);
    border: 1px solid rgba(29,158,117,0.25);
    top: 60px; right: -20px;
  }

  .orb-3 {
    width: 130px; height: 130px;
    background: rgba(159,152,232,0.08);
    border: 1px solid rgba(159,152,232,0.15);
    top: -30px; right: 40px;
  }

  .auth-left-eyebrow {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 0.75rem;
    font-weight: 400;
  }

  .auth-left-headline {
    font-family: 'DM Serif Display', serif;
    font-size: 2.6rem;
    line-height: 1.2;
    color: rgba(255,255,255,0.95);
    margin-bottom: 1rem;
  }

  .auth-left-headline em {
    font-style: italic;
    color: #9f98e8;
  }

  .auth-left-desc {
    font-size: 13.5px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    max-width: 280px;
  }

  /* ── RIGHT PANEL ── */
  .auth-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 3.5rem;
    background: #ffffff;
  }

  /* ── LOGO ── */
  .auth-logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #534AB7;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.2rem;
  }

  /* ── TAB ROW ── */
  .tab-row {
    display: flex;
    background: #f3f2f0;
    border-radius: 8px;
    padding: 3px;
    margin-bottom: 2rem;
  }

  .tab-btn {
    flex: 1;
    padding: 8px 0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 400;
    transition: all 0.18s ease;
    background: transparent;
    color: #888;
  }

  .tab-btn.active {
    background: #ffffff;
    color: #111;
    font-weight: 500;
    border: 0.5px solid rgba(0,0,0,0.08);
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
  }

  /* ── FORM HEADER ── */
  .form-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.75rem;
    color: #111;
    margin-bottom: 0.3rem;
    font-weight: 400;
  }

  .form-subtitle {
    font-size: 13px;
    color: #888;
    margin-bottom: 1.8rem;
    line-height: 1.5;
  }

  /* ── FIELDS ── */
  .field-group { margin-bottom: 1rem; }

  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #555;
    margin-bottom: 0.4rem;
    letter-spacing: 0.03em;
  }

  .field-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e0deda;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    background: #ffffff;
    color: #111;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    appearance: none;
  }

  .field-input:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 3px rgba(83,74,183,0.12);
  }

  .field-input::placeholder { color: #bbb; }

  /* ── ERROR ── */
  .error-msg {
    font-size: 12px;
    color: #c0392b;
    margin-top: 0.35rem;
  }

  /* ── SUBMIT ── */
  .submit-btn {
    width: 100%;
    padding: 11px;
    border: none;
    border-radius: 8px;
    background: #534AB7;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 1.4rem;
    transition: background 0.15s, transform 0.1s;
    letter-spacing: 0.01em;
  }

  .submit-btn:hover { background: #4338a0; }
  .submit-btn:active { transform: scale(0.99); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── DIVIDER ── */
  .divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 1.4rem 0;
  }

  .divider-line { flex: 1; height: 1px; background: #eee; }
  .divider-text { font-size: 12px; color: #bbb; }

  /* ── SOCIAL BUTTONS ── */
  .social-row { display: flex; gap: 8px; }

  .social-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 9px 0;
    border: 1px solid #e0deda;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #555;
    transition: background 0.15s, border-color 0.15s;
  }

  .social-btn:hover { background: #f8f7f5; border-color: #c8c5bf; }

  /* ── TOAST ── */
  .toast-wrap {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    pointer-events: none;
  }

  .toast {
    background: #1a1a2e;
    color: rgba(255,255,255,0.9);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    padding: 10px 22px;
    border-radius: 100px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .toast.show { opacity: 1; transform: translateY(0); }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .auth-left { display: none; }
    .auth-right { padding: 2.5rem 1.8rem; }
  }
`;

// ── SVG Icons ──────────────────────────────────────────────
const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.5" />
    <path d="M6 10c0-2.2 1.8-4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 10c0 2.2-1.8 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="10" r="1.5" fill="white" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#24292e">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ── Toast Component ─────────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <div className="toast-wrap">
      <div className={`toast${visible ? ' show' : ''}`}>{message}</div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
export default function Authentication() {
  const [formState, setFormState] = React.useState(0); // 0 = login, 1 = signup
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState({ visible: false, message: '' });

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3500);
  };

  const switchTab = (state) => {
    setFormState(state);
    setError('');
    setName('');
    setUsername('');
    setPassword('');
  };

  const handleAuth = async () => {
    setError('');

    if (!username || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formState === 1 && !name) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(name, username, password);
        console.log(result);
        showToast(result || 'Account created — welcome!');
        switchTab(0);
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAuth();
  };

  return (
    <>
      {/* Inject CSS */}
      <style>{css}</style>

      <div className="auth-root">
        {/* ── Left Panel ── */}
        <div className="auth-left">
          <div className="auth-left-bg" />
          <div className="auth-left-grid" />
          <div className="auth-left-orbs">
            <div className="orb orb-3" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
          </div>
          <div className="auth-left-content">
            <p className="auth-left-eyebrow">Syncro Web &middot; Stay in sync</p>
            <h1 className="auth-left-headline">
              Everything,<br /><em>in sync.</em>
            </h1>
            <p className="auth-left-desc">
              Syncro Web keeps your team, tools, and projects perfectly aligned — all in one place.
            </p>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="auth-right">
          {/* Logo + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.2rem' }}>
            <div className="auth-logo" style={{ marginBottom: 0 }}>
              <LogoIcon />
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '15px', color: '#111', letterSpacing: '-0.01em' }}>
              Syncro <span style={{ color: '#534AB7' }}>Web</span>
            </span>
          </div>

          {/* Tab switcher */}
          <div className="tab-row">
            <button
              className={`tab-btn${formState === 0 ? ' active' : ''}`}
              onClick={() => switchTab(0)}
            >
              Sign in
            </button>
            <button
              className={`tab-btn${formState === 1 ? ' active' : ''}`}
              onClick={() => switchTab(1)}
            >
              Sign up
            </button>
          </div>

          {/* Form header */}
          {formState === 0 ? (
            <>
              <h2 className="form-title">Welcome back</h2>
              <p className="form-subtitle">Enter your credentials to continue.</p>
            </>
          ) : (
            <>
              <h2 className="form-title">Create account</h2>
              <p className="form-subtitle">Fill in your details to get started.</p>
            </>
          )}

          {/* Full name (sign up only) */}
          {formState === 1 && (
            <div className="field-group">
              <label className="field-label" htmlFor="inp-name">Full name</label>
              <input
                className="field-input"
                id="inp-name"
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
          )}

          {/* Username */}
          <div className="field-group">
            <label className="field-label" htmlFor="inp-username">Username</label>
            <input
              className="field-input"
              id="inp-username"
              type="text"
              placeholder="you@example.com"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus={formState === 0}
            />
          </div>

          {/* Password */}
          <div className="field-group">
            <label className="field-label" htmlFor="inp-password">Password</label>
            <input
              className="field-input"
              id="inp-password"
              type="password"
              placeholder="••••••••"
              autoComplete={formState === 0 ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {error && <p className="error-msg">{error}</p>}
          </div>

          {/* Submit */}
          <button
            className="submit-btn"
            onClick={handleAuth}
            disabled={loading}
          >
            {loading
              ? (formState === 0 ? 'Signing in…' : 'Creating account…')
              : (formState === 0 ? 'Sign in' : 'Create account')}
          </button>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or continue with</span>
            <div className="divider-line" />
          </div>

          {/* Social buttons */}
          <div className="social-row">
            <button className="social-btn">
              <GoogleIcon />
              Google
            </button>
            <button className="social-btn">
              <GitHubIcon />
              GitHub
            </button>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}