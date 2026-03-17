import React from 'react';
import { UserCircle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const ROLES = [
  {
    key: 'applicant',
    icon: UserCircle,
    title: 'Loan Applicant',
    subtitle: 'Apply & Track',
    description: 'Check your loan eligibility, run a fairness audit on your profile, explore what-if scenarios, and chat with our AI financial advisor.',
    points: ['Personal loan audit', 'AI-powered improvement tips', 'Real-time what-if simulator'],
    accent: 'var(--primary)',
    accentBg: 'rgba(16,185,129,0.08)',
    accentBorder: 'rgba(16,185,129,0.25)',
  },
  {
    key: 'officer',
    icon: ShieldCheck,
    title: 'Loan Officer',
    subtitle: 'Review & Decide',
    description: 'Review applicant profiles, get AI second opinions on decisions, manage the accounts registry, and monitor fairness metrics across all cases.',
    points: ['Full applicant registry', 'AI Technical Oracle', 'Approve / flag decisions'],
    accent: 'var(--secondary)',
    accentBg: 'rgba(99,102,241,0.08)',
    accentBorder: 'rgba(99,102,241,0.25)',
  },
];

const RoleSelect = ({ onSelect }) => {
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '56px', height: '56px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          borderRadius: '16px',
          fontSize: '1.4rem', fontWeight: 900, color: '#fff',
          marginBottom: '1.25rem',
          boxShadow: '0 8px 32px rgba(16,185,129,0.3)',
        }}>
          FL
        </div>
        <h1 style={{
          fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)',
          margin: '0 0 0.5rem', letterSpacing: '-0.5px',
        }}>
          FairLens <span style={{ color: 'var(--primary)' }}>XAI</span>
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: 0 }}>
          Explainable AI · Loan Assessment Platform
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          marginTop: '0.85rem',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '20px', padding: '0.3rem 0.85rem',
          fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600,
        }}>
          <Sparkles size={11} /> Select your role to continue
        </div>
      </div>

      {/* Role cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '720px',
      }}>
        {ROLES.map(role => {
          const Icon = role.icon;
          const isHovered = hovered === role.key;
          return (
            <div
              key={role.key}
              onMouseEnter={() => setHovered(role.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(role.key)}
              style={{
                background: isHovered ? role.accentBg : 'var(--bg-card)',
                border: `1px solid ${isHovered ? role.accent : 'var(--border-card)'}`,
                borderRadius: 'var(--radius-xl, 20px)',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                transform: isHovered ? 'translateY(-4px)' : 'none',
                boxShadow: isHovered ? `0 16px 40px ${role.accentBg}` : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(90deg, ${role.accent}, transparent)`,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.25s ease',
              }} />

              {/* Icon */}
              <div style={{
                width: '52px', height: '52px',
                borderRadius: '14px',
                background: role.accentBg,
                border: `1px solid ${role.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
                transition: 'all 0.25s ease',
                boxShadow: isHovered ? `0 4px 16px ${role.accentBg}` : 'none',
              }}>
                <Icon size={24} color={role.accent} />
              </div>

              {/* Text */}
              <div style={{
                fontSize: '0.65rem', fontWeight: 700,
                color: role.accent,
                textTransform: 'uppercase', letterSpacing: '1px',
                marginBottom: '0.3rem',
              }}>
                {role.subtitle}
              </div>
              <h2 style={{
                fontSize: '1.35rem', fontWeight: 800,
                color: 'var(--text-main)', margin: '0 0 0.75rem',
                letterSpacing: '-0.3px',
              }}>
                {role.title}
              </h2>
              <p style={{
                fontSize: '0.82rem', color: 'var(--text-muted)',
                lineHeight: 1.65, margin: '0 0 1.25rem',
              }}>
                {role.description}
              </p>

              {/* Feature points */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {role.points.map(p => (
                  <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: role.accent, flexShrink: 0 }} />
                    {p}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: isHovered ? role.accent : 'var(--bg-elevated)',
                border: `1px solid ${isHovered ? role.accent : 'var(--border-glass)'}`,
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.25s ease',
              }}>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 700,
                  color: isHovered ? '#fff' : role.accent,
                  transition: 'color 0.25s ease',
                }}>
                  Continue as {role.title}
                </span>
                <ArrowRight size={16} color={isHovered ? '#fff' : role.accent} style={{ transition: 'transform 0.2s ease', transform: isHovered ? 'translateX(3px)' : 'none' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p style={{ marginTop: '2rem', fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center' }}>
        Your role preference is saved locally in your browser. You can switch anytime.
      </p>
    </div>
  );
};

export default RoleSelect;
