import React, { useState } from 'react';
import { ShieldCheck, Clock, Briefcase, CheckCircle, RefreshCw } from 'lucide-react';

const LEVEL_META = {
  Senior: { color: 'var(--primary)',   bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)' },
  Junior: { color: 'var(--secondary)', bg: 'rgba(99,102,241,0.10)',  border: 'rgba(99,102,241,0.25)' },
};

const OfficerSelector = ({ officers = [], assignedOfficerId, allCases = [], onAssign }) => {
  const [selected, setSelected] = useState(assignedOfficerId || null);
  const [submitted, setSubmitted] = useState(!!assignedOfficerId);

  const getWorkload = (officerId) =>
    allCases.filter(c => c.assignedOfficerId === officerId).length;

  const handleAssign = () => {
    if (!selected) return;
    onAssign(selected);
    setSubmitted(true);
  };

  const handleChange = () => setSubmitted(false);

  const assignedOfficer = officers.find(o => o.id === selected);

  return (
    <div className="card-luxe" style={{ marginTop: '1.5rem' }}>
      <h3 className="card-title">
        <ShieldCheck size={14} /> Assign a Loan Officer
      </h3>

      {submitted && assignedOfficer ? (
        /* Confirmed state */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem', borderRadius: 'var(--radius-md)',
            background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: '#fff', fontSize: '0.9rem',
            }}>
              {assignedOfficer.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                  {assignedOfficer.name}
                </span>
                <span style={{
                  fontSize: '0.58rem', fontWeight: 700, padding: '0.1rem 0.45rem',
                  borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px',
                  background: LEVEL_META[assignedOfficer.level]?.bg,
                  border: `1px solid ${LEVEL_META[assignedOfficer.level]?.border}`,
                  color: LEVEL_META[assignedOfficer.level]?.color,
                }}>
                  {assignedOfficer.level}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Assigned · Expected response in {assignedOfficer.turnaround}
              </div>
            </div>
            <CheckCircle size={20} color="var(--success)" />
          </div>

          <button
            onClick={handleChange}
            style={{
              alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'none', border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)', padding: '0.45rem 0.9rem',
              fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-dim)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
          >
            <RefreshCw size={12} /> Change Officer
          </button>
        </div>
      ) : (
        /* Selection state */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
            Select a loan officer to review your application. You can change this anytime before a decision is made.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {officers.map(officer => {
              const workload  = getWorkload(officer.id);
              const isFull    = workload >= officer.maxCases;
              const isChosen  = selected === officer.id;
              const lm        = LEVEL_META[officer.level] || LEVEL_META.Junior;

              return (
                <div
                  key={officer.id}
                  onClick={() => !isFull && setSelected(officer.id)}
                  style={{
                    padding: '1rem',
                    background: isChosen ? 'rgba(16,185,129,0.06)' : 'var(--bg-elevated)',
                    border: `1px solid ${isChosen ? 'var(--primary)' : 'var(--border-glass)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: isFull ? 'not-allowed' : 'pointer',
                    opacity: isFull ? 0.5 : 1,
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                  }}
                >
                  {/* Radio */}
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${isChosen ? 'var(--primary)' : 'var(--border-glass)'}`,
                    background: isChosen ? 'var(--primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isChosen && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#fff', fontSize: '0.82rem',
                  }}>
                    {officer.avatar}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>{officer.name}</span>
                      <span style={{
                        fontSize: '0.58rem', fontWeight: 700, padding: '0.1rem 0.45rem',
                        borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px',
                        background: lm.bg, border: `1px solid ${lm.border}`, color: lm.color,
                      }}>
                        {officer.level}
                      </span>
                      {isFull && (
                        <span style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--danger)' }}>FULL</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                      {officer.specialty}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                        <Briefcase size={10} /> {officer.experience}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                        <Clock size={10} /> {officer.turnaround}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: workload >= officer.maxCases * 0.8 ? 'var(--warning)' : 'var(--text-dim)' }}>
                        <ShieldCheck size={10} /> {workload}/{officer.maxCases} cases
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAssign}
            disabled={!selected}
            style={{
              padding: '0.75rem 1.5rem', alignSelf: 'flex-start',
              background: selected ? 'var(--primary)' : 'var(--bg-elevated)',
              border: 'none', borderRadius: 'var(--radius-md)',
              color: selected ? '#000' : 'var(--text-dim)',
              fontWeight: 700, fontSize: '0.82rem',
              cursor: selected ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            Assign &amp; Submit for Review
          </button>
        </div>
      )}
    </div>
  );
};

export default OfficerSelector;
