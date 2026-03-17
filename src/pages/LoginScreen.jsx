import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus, LogIn, Sparkles, ChevronRight } from 'lucide-react';
import { loadUsers, saveUsers, saveSession, SEED_USERS } from '../data/seedUsers';

const DEMO_ACCOUNTS = [
  { label: 'Admin',                 username: 'admin',          password: 'admin@123',   color: 'var(--danger)'    },
  { label: 'Raj Sharma (Senior Officer)', username: 'raj.sharma',      password: 'officer@123', color: 'var(--secondary)' },
  { label: 'Priya Mehta (Junior Officer)',username: 'priya.mehta',     password: 'officer@123', color: 'var(--secondary)' },
  { label: 'Sarah Chen (User)',     username: 'sarah.chen',      password: 'demo@123',    color: 'var(--primary)'   },
  { label: 'Marcus Miller (User)',  username: 'marcus.miller',   password: 'demo@123',    color: 'var(--primary)'   },
  { label: 'Priya Patel (User)',    username: 'priya.patel',     password: 'demo@123',    color: 'var(--primary)'   },
];

const Field = ({ label, type, value, onChange, placeholder, error }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: isPassword ? '0.75rem 2.5rem 0.75rem 1rem' : '0.75rem 1rem',
            background: 'var(--bg-elevated)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border-card)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)', fontSize: '0.88rem',
            outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => !error && (e.target.style.borderColor = 'var(--primary)')}
          onBlur={e  => !error && (e.target.style.borderColor = 'var(--border-card)')}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{
              position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 0,
            }}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [tab, setTab]         = useState('signin');   // 'signin' | 'register'
  const [showDemo, setShowDemo] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [errors, setErrors]     = useState({});
  const [globalErr, setGlobalErr] = useState('');

  const fillDemo = (acc) => {
    setTab('signin');
    setUsername(acc.username);
    setPassword(acc.password);
    setErrors({});
    setGlobalErr('');
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setGlobalErr('');
    const users = loadUsers();
    const user  = users.find(u => u.username === username.trim() && u.password === password);
    if (!user) { setGlobalErr('Invalid username or password.'); return; }
    const session = { userId: user.id, username: user.username, name: user.name, role: user.role, avatar: user.avatar };
    saveSession(session);
    onLogin(session);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim())                        errs.name      = 'Name is required.';
    if (!username.trim())                    errs.username  = 'Username is required.';
    if (username.includes(' '))              errs.username  = 'No spaces allowed.';
    if (password.length < 6)                 errs.password  = 'Minimum 6 characters.';
    if (password !== confirmPw)              errs.confirmPw = 'Passwords do not match.';

    const users = loadUsers();
    if (users.find(u => u.username === username.trim())) errs.username = 'Username already taken.';

    if (Object.keys(errs).length) { setErrors(errs); return; }

    const newUser = {
      id: `usr-app-${Date.now()}`,
      username: username.trim(),
      password,
      name: name.trim(),
      role: 'applicant',
      avatar: name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    };
    saveUsers([...users, newUser]);
    const session = { userId: newUser.id, username: newUser.username, name: newUser.name, role: newUser.role, avatar: newUser.avatar };
    saveSession(session);
    onLogin(session);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-app)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            borderRadius: '14px', fontSize: '1.2rem', fontWeight: 900, color: '#fff',
            marginBottom: '1rem', boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
          }}>FL</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.3rem', letterSpacing: '-0.5px' }}>
            FairLens <span style={{ color: 'var(--primary)' }}>XAI</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', margin: 0 }}>
            Explainable AI · Loan Assessment Platform
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl, 20px)', overflow: 'hidden',
        }}>

          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border-card)' }}>
            {[['signin','Sign In', LogIn], ['register','New Account', UserPlus]].map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setErrors({}); setGlobalErr(''); }}
                style={{
                  padding: '1rem', background: tab === key ? 'var(--bg-elevated)' : 'transparent',
                  border: 'none', borderBottom: tab === key ? '2px solid var(--primary)' : '2px solid transparent',
                  color: tab === key ? 'var(--primary)' : 'var(--text-dim)',
                  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div style={{ padding: '1.75rem' }}>
            {globalErr && (
              <div style={{
                padding: '0.65rem 1rem', marginBottom: '1rem',
                background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)',
                borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--danger)',
              }}>{globalErr}</div>
            )}

            <form onSubmit={tab === 'signin' ? handleSignIn : handleRegister}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {tab === 'register' && (
                <Field label="Full Name" type="text" value={name} onChange={setName}
                  placeholder="e.g. Raj" error={errors.name} />
              )}
              <Field label="Username" type="text" value={username} onChange={setUsername}
                placeholder={tab === 'signin' ? 'Enter username' : 'Choose a username'} error={errors.username} />
              <Field label="Password" type="password" value={password} onChange={setPassword}
                placeholder="Enter password" error={errors.password} />
              {tab === 'register' && (
                <Field label="Confirm Password" type="password" value={confirmPw} onChange={setConfirmPw}
                  placeholder="Re-enter password" error={errors.confirmPw} />
              )}

              <button
                type="submit"
                style={{
                  width: '100%', padding: '0.85rem',
                  background: 'linear-gradient(135deg, var(--primary), #059669)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  color: '#fff', fontWeight: 800, fontSize: '0.88rem',
                  cursor: 'pointer', letterSpacing: '0.3px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontFamily: 'inherit', marginTop: '0.25rem',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {tab === 'signin' ? <><LogIn size={15} /> Sign In</> : <><UserPlus size={15} /> Create Account</>}
              </button>
            </form>
          </div>
        </div>

        {/* Demo accounts toggle */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setShowDemo(!showDemo)}
            style={{
              background: 'none', border: 'none', color: 'var(--primary)',
              fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.8px', cursor: 'pointer', fontFamily: 'inherit',
              padding: '0.5rem', opacity: 0.9, transition: 'all 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.textDecoration = 'none'; }}
          >
            {showDemo ? 'Hide Simulation Data' : 'Use Existing Records (Demo)'}
            <ChevronRight size={12} style={{ transform: showDemo ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Demo accounts strip */}
        {showDemo && (
          <div className="animate-in" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.username}
                  onClick={() => fillDemo(acc)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: 'var(--bg-card)',
                    border: `1px solid ${acc.color}40`,
                    borderRadius: '20px',
                    fontSize: '0.68rem', fontWeight: 700,
                    color: acc.color,
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${acc.color}12`}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
