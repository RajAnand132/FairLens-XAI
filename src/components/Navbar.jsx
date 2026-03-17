import React, { useContext, useRef, useEffect } from 'react';
import { Moon, Sun, Bell, LayoutGrid, ShieldCheck, UserCircle, LogOut, X, Search, Terminal } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

const ROLE_META = {
  admin:     { label: 'Admin',    color: 'var(--danger)',    icon: ShieldCheck },
  officer:   { label: 'Officer',  color: 'var(--secondary)', icon: ShieldCheck },
  applicant: { label: null,       color: 'var(--primary)',   icon: UserCircle  },
};

const Navbar = ({ user, session, onLogout, notifications = [], onMarkRead }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showNotifs, setShowNotifs] = React.useState(false);
  const location = useLocation();
  const role            = session?.role || 'applicant';
  const userId          = session?.userId;

  // Notification Filtering
  const filteredNotifs = notifications.filter(n => {
    // 1. Global (no target)
    if (!n.targetRole && !n.targetUserId) return true;
    // 2. Role-specific
    if (n.targetRole === role) return true;
    // 3. User-specific
    if (n.targetUserId === userId) return true;
    return false;
  });

  const isAdmin         = role === 'admin';
  const isOfficerRole   = role === 'officer' || isAdmin;
  const isOnOfficerPage = location.pathname === '/officer';
  const rm              = ROLE_META[role] || ROLE_META.applicant;
  const RoleIcon        = rm.icon;
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    if (showNotifs) {
      document.addEventListener('mousedown', handleClickOutside, true);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [showNotifs]);

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <div className="brand-mark">FL</div>
        <div>
          <span className="brand-name">FairLens</span>
          <span className="brand-sub">XAI Loan Platform</span>
        </div>
      </div>

      {/* Center: Search & Context bar */}
      <div className="navbar-center">
        <div className="navbar-search-bar">
          <Search size={14} className="search-icon" />
          <input type="text" placeholder="Search cases, records or analysis..." />
        </div>
        <div className="system-status-pill">
          <div className="pulse-dot" />
          <span><span className="hide-mobile" style={{ opacity: 0.5, marginRight: '4px' }}>TELEMETRY</span> LIVE</span>
        </div>
      </div>

      {/* Controls */}
      <div className="navbar-controls">
        {/* Portal toggle — officer only */}
        {isOfficerRole && (
          <Link
            to={isOnOfficerPage ? '/applicant' : '/officer'}
            className="nav-portal-btn"
            title={isOnOfficerPage ? "Return to Applicant Dashboard View" : "Access Officer Command Center"}
          >
            {isOnOfficerPage ? <LayoutGrid size={14} /> : <ShieldCheck size={14} />}
            <span className="nav-label-text hide-mobile">
              {isOnOfficerPage ? 'Applicant View' : 'Officer Portal'}
            </span>
          </Link>
        )}

        <div 
          className="nav-icon-btn" 
          onClick={() => { setShowNotifs(!showNotifs); onMarkRead(); }}
          style={{ position: 'relative' }}
          title="System Insights & Real-time Notifications"
        >
          <Bell size={18} className={filteredNotifs.some(n => !n.read) ? 'pulse-icon' : ''} />
          {filteredNotifs.some(n => !n.read) && (
            <div style={{
              position: 'absolute', top: '2px', right: '2px',
              width: '8px', height: '8px', background: 'var(--danger)',
              borderRadius: '50%', border: '2px solid var(--bg-card)'
            }} />
          )}

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="notif-dropdown animate-in" ref={notifRef} onClick={(e) => e.stopPropagation()}>
              <div className="notif-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Insights & Events</h3>
                <button 
                  onClick={() => setShowNotifs(false)}
                  style={{ 
                    background: 'none', border: 'none', color: 'var(--text-dim)', 
                    cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' 
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="notif-list">
                {filteredNotifs.length === 0 ? (
                  <div className="notif-empty">No recent activity</div>
                ) : (
                  filteredNotifs.map(n => (
                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                      <div className="notif-icon-wrap" style={{ 
                        background: n.type === 'success' ? 'var(--success-dim)' : 
                                    n.type === 'danger' ? 'rgba(244,63,94,0.1)' : 'rgba(99,102,241,0.1)' 
                      }}>
                        <Bell size={12} color={
                          n.type === 'success' ? 'var(--success)' : 
                          n.type === 'danger' ? 'var(--danger)' : 'var(--primary)'
                        } />
                      </div>
                      <div className="notif-content">
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-msg">{n.message}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          className="nav-icon-btn" 
          onClick={toggleTheme} 
          style={{ cursor: 'pointer' }}
          title={theme === 'dark' ? "Switch to Light Mode Aesthetic" : "Switch to Deep Midnight Theme"}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </div>

        {/* Role badge */}
        <div 
          className="nav-user-badge-luxe"
          title={isAdmin ? "System Administrator - Manage App Users & Bank Officers" : "User Identity Account"}
        >
          <div className="user-avatar-mini" style={{ background: `linear-gradient(135deg, ${rm.color}, transparent)` }}>
            <RoleIcon size={12} color="white" />
          </div>
          <div className="user-info-mini hide-mobile">
            <span className="user-role-label" style={{ color: rm.color }}>{rm.label || 'User'}</span>
            <span className="user-name-mini">{session?.name || user?.name || 'Applicant'}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="nav-logout-btn"
          title="Secure Session Termination & Exit"
        >
          <LogOut size={14} />
          <span className="hide-mobile">Log out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
