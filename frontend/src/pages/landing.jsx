import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

.sw-home * { box-sizing: border-box; margin: 0; padding: 0; }
.sw-home {
  font-family: 'DM Sans', sans-serif;
  background: #0a0a10;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── NAVBAR ── */
.sw-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 58px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background: rgba(10,10,16,0.92);
  backdrop-filter: blur(12px);
  z-index: 100;
}

.sw-nav-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
}

.sw-nav-logo {
  width: 30px; height: 30px;
  background: #534AB7;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.sw-nav-name {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
  letter-spacing: -0.01em;
}

.sw-nav-name span { color: #9f98e8; }

.sw-nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sw-nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 7px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.65);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.sw-nav-btn:hover {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.9);
  border-color: rgba(255,255,255,0.18);
}

.sw-nav-btn.logout {
  color: rgba(240,112,112,0.75);
  border-color: rgba(240,112,112,0.2);
  background: rgba(240,112,112,0.06);
}

.sw-nav-btn.logout:hover {
  background: rgba(240,112,112,0.12);
  color: #f07070;
  border-color: rgba(240,112,112,0.35);
}

/* ── HERO ── */
.sw-hero {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 4rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  gap: 4rem;
}

/* ── LEFT ── */
.sw-hero-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sw-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9f98e8;
  margin-bottom: 1.25rem;
}

.sw-eyebrow-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #5fcf99;
  animation: sw-pulse 2s infinite;
}

@keyframes sw-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.sw-headline {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  line-height: 1.15;
  color: #fff;
  margin-bottom: 1rem;
}

.sw-headline em {
  font-style: italic;
  color: #9f98e8;
}

.sw-subtext {
  font-size: 14.5px;
  color: rgba(255,255,255,0.38);
  line-height: 1.7;
  max-width: 380px;
  margin-bottom: 2.5rem;
}

/* ── JOIN BOX ── */
.sw-join-box {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 1.5rem;
  max-width: 420px;
}

.sw-join-label {
  font-size: 11.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.75rem;
  display: block;
}

.sw-join-row {
  display: flex;
  gap: 8px;
}

.sw-join-input {
  flex: 1;
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  letter-spacing: 0.04em;
}

.sw-join-input::placeholder { color: rgba(255,255,255,0.2); }
.sw-join-input:focus {
  border-color: #534AB7;
  box-shadow: 0 0 0 3px rgba(83,74,183,0.18);
}

.sw-join-btn {
  padding: 10px 22px;
  background: #534AB7;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap;
}

.sw-join-btn:hover { background: #4338a0; }
.sw-join-btn:active { transform: scale(0.98); }
.sw-join-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.sw-join-hint {
  margin-top: 0.75rem;
  font-size: 12px;
  color: rgba(255,255,255,0.2);
  line-height: 1.5;
}

/* ── DIVIDER ── */
.sw-join-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 1rem 0;
}
.sw-join-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
.sw-join-divider-text { font-size: 11.5px; color: rgba(255,255,255,0.2); }

.sw-new-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: rgba(255,255,255,0.55);
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.sw-new-btn:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.8);
}

/* ── RIGHT: illustration ── */
.sw-hero-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sw-illus-wrap {
  position: relative;
  width: 100%;
  max-width: 420px;
}

.sw-illus-bg {
  position: absolute;
  inset: -40px;
  background:
    radial-gradient(ellipse 70% 60% at 50% 50%, rgba(83,74,183,0.22) 0%, transparent 70%);
  pointer-events: none;
}

.sw-illus-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.sw-illus-tile {
  border-radius: 12px;
  background: #111118;
  border: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/10;
  display: flex;
  align-items: flex-end;
  padding: 8px;
}

.sw-illus-tile:first-child {
  grid-column: span 2;
  aspect-ratio: 16/7;
}

.sw-illus-avatar {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sw-illus-initials {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px;
  font-weight: 500;
}

.sw-illus-name {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  background: rgba(0,0,0,0.45);
  padding: 3px 8px;
  border-radius: 100px;
  backdrop-filter: blur(4px);
  position: relative;
  z-index: 1;
}

.sw-illus-badge {
  position: absolute;
  top: 10px; right: 10px;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #5fcf99;
  border: 2px solid #111118;
}

/* ── STATS ── */
.sw-stats {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.sw-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sw-stat-num {
  font-family: 'DM Serif Display', serif;
  font-size: 1.4rem;
  color: #fff;
}

.sw-stat-label {
  font-size: 11.5px;
  color: rgba(255,255,255,0.3);
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .sw-hero { flex-direction: column; padding: 2rem 1.5rem; gap: 2.5rem; }
  .sw-hero-right { display: none; }
  .sw-stats { flex-wrap: wrap; }
}
`;

/* ── Icons ── */
const SyncroLogo = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.5" />
    <path d="M6 10c0-2.2 1.8-4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 10c0 2.2-1.8 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="10" r="1.5" fill="white" />
  </svg>
);

const IconHistory = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="12 8 12 12 14 14" />
    <path d="M3.05 11a9 9 0 1 0 .5-4H1" />
    <polyline points="1 3 1 7 5 7" />
  </svg>
);

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ── Illustration tiles data ── */
const tiles = [
  { initials: 'SW', bg: 'rgba(83,74,183,0.2)', color: '#9f98e8', name: 'Sarah W.' },
  { initials: 'MK', bg: 'rgba(29,158,117,0.2)', color: '#5fcf99', name: 'Mike K.' },
  { initials: 'AL', bg: 'rgba(240,112,112,0.15)', color: '#f09090', name: 'Amy L.' },
];

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return;
    setLoading(true);
    try {
      await addToUserHistory(meetingCode);
      navigate(`/${meetingCode}`);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleNewMeeting = () => {
    const code = Math.random().toString(36).substring(2, 10);
    navigate(`/${code}`);
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleJoinVideoCall(); };

  return (
    <div className="sw-home">
      <style>{css}</style>

      {/* ── Navbar ── */}
      <nav className="sw-nav">
        <div className="sw-nav-brand">
          <div className="sw-nav-logo"><SyncroLogo size={16} /></div>
          <span className="sw-nav-name">Syncro <span>Web</span></span>
        </div>

        <div className="sw-nav-right">
          <button className="sw-nav-btn" onClick={() => navigate('/history')}>
            <IconHistory />
            History
          </button>
          <button
            className="sw-nav-btn logout"
            onClick={() => { localStorage.removeItem('token'); navigate('/auth'); }}
          >
            <IconLogout />
            Logout
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="sw-hero">

        {/* Left */}
        <div className="sw-hero-left">
          <div className="sw-eyebrow">
            <div className="sw-eyebrow-dot" />
            Syncro Web · Video Meetings
          </div>

          <h1 className="sw-headline">
            Meet, sync,<br />and <em>collaborate</em><br />in real time.
          </h1>

          <p className="sw-subtext">
            Crystal-clear video calls for teams of any size. Join a meeting instantly — no downloads, no friction.
          </p>

          <div className="sw-join-box">
            <span className="sw-join-label">Join a meeting</span>
            <div className="sw-join-row">
              <input
                className="sw-join-input"
                type="text"
                placeholder="Enter meeting code"
                value={meetingCode}
                onChange={e => setMeetingCode(e.target.value)}
                onKeyDown={handleKey}
                autoFocus
              />
              <button
                className="sw-join-btn"
                onClick={handleJoinVideoCall}
                disabled={!meetingCode.trim() || loading}
              >
                {loading ? 'Joining…' : 'Join'}
              </button>
            </div>
            <p className="sw-join-hint">Ask the meeting host for the code to join.</p>

            <div className="sw-join-divider">
              <div className="sw-join-divider-line" />
              <span className="sw-join-divider-text">or</span>
              <div className="sw-join-divider-line" />
            </div>

            <button className="sw-new-btn" onClick={handleNewMeeting}>
              <IconPlus />
              Start a new meeting
            </button>
          </div>
        </div>

        {/* Right: mock video grid illustration */}
        <div className="sw-hero-right">
          <div className="sw-illus-wrap">
            <div className="sw-illus-bg" />
            <div className="sw-illus-grid">
              {tiles.map((t, i) => (
                <div
                  key={i}
                  className="sw-illus-tile"
                  style={i === 0 ? { gridColumn: 'span 2' } : {}}
                >
                  <div className="sw-illus-avatar">
                    <div className="sw-illus-initials" style={{ background: t.bg, color: t.color }}>
                      {t.initials}
                    </div>
                  </div>
                  <div className="sw-illus-badge" />
                  <span className="sw-illus-name">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Stats bar ── */}
      <div className="sw-stats">
        {[
          { num: '100ms', label: 'Avg. latency' },
          { num: 'HD', label: 'Video quality' },
          { num: '∞', label: 'Meeting duration' },
          { num: 'E2E', label: 'Encrypted' },
        ].map((s, i) => (
          <div key={i} className="sw-stat">
            <span className="sw-stat-num">{s.num}</span>
            <span className="sw-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(HomeComponent);