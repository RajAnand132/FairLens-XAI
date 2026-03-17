import React from 'react';
import { ShieldCheck, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const EFFORT = {
  quick:  { label: 'Quick Win',   color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.22)'  },
  medium: { label: '1–3 Months',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)' },
  long:   { label: '6+ Months',   color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.22)' },
};

const ActionPlan = ({ result, height }) => {
  if (!result) return null;

  const hasActions = result.actionPlan && result.actionPlan.length > 0;
  const isApproved = result.approved;

  // Positive SHAP factors for the approved summary strip
  const goodFactors = (result.factors || []).filter((f) => f.value > 0);

  return (
    <div className="card-luxe" style={{ height, display: 'flex', flexDirection: 'column' }}>
      <h3 className="card-title" style={{ marginBottom: 0 }}>
        {isApproved ? <TrendingUp size={14} /> : <AlertCircle size={14} />}
        {isApproved ? 'Approval Summary' : 'Improvement Actions'}
      </h3>

      <div className={height ? "scroll-glass" : ""} style={{ flex: 1, paddingTop: '0.6rem' }}>
        {/* Fairness badge moved to top for high visibility */}
        <div style={{
          background: 'rgba(16,185,129,0.05)',
          border: '1px solid rgba(16,185,129,0.18)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.65rem',
        }}>
          <div style={{ color: 'var(--primary)', flexShrink: 0 }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Fairness Audited
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Age &amp; Gender factors excluded from decision.
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div style={{
          background: isApproved ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
          border: `1px solid ${isApproved ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <div style={{
            width: 9, height: 9, borderRadius: '50%',
            background: isApproved ? 'var(--success)' : 'var(--danger)',
            boxShadow: `0 0 8px ${isApproved ? 'var(--success)' : 'var(--danger)'}`,
            flexShrink: 0,
          }} />
          <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            {isApproved
              ? 'Your financial profile meets the institutional thresholds. This application is eligible for approval.'
              : 'Your profile was flagged. Complete the steps below to improve your approval probability.'}
          </p>
        </div>

      {/* Positive factors strip (approved only) */}
      {isApproved && goodFactors.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
          {goodFactors.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              background: 'rgba(16,185,129,0.07)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '20px',
              padding: '0.22rem 0.65rem',
              fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)',
            }}>
              <CheckCircle2 size={11} />
              {f.name}
            </div>
          ))}
        </div>
      )}

      {/* Action steps */}
      {hasActions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.65rem', flex: 1 }}>
          {result.actionPlan.map((step, i) => {
            const text   = typeof step === 'string' ? step : step.text;
            const effort = typeof step === 'string' ? null : step.effort;
            const cfg    = effort ? EFFORT[effort] : null;

            return (
              <div key={i} style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '0.7rem 0.85rem',
              }}>
                <span style={{
                  minWidth: 20, height: 20,
                  background: 'var(--primary-dim)',
                  border: '1px solid var(--border-active)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)',
                  flexShrink: 0, marginTop: '1px',
                }}>
                  {i + 1}
                </span>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: cfg ? '0.4rem' : 0 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {text}
                    </span>
                  </div>
                  {cfg && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      fontSize: '0.65rem', fontWeight: 800,
                      color: cfg.color,
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      borderRadius: '20px',
                      padding: '0.12rem 0.5rem',
                      letterSpacing: '0.2px',
                    }}>
                      {cfg.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Next Best Offer chip */}
      {result.nextBestOffer && (
        <div style={{
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: '0.5rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Recommended Amount:</span>
          {' '}₹{Math.round(result.nextBestOffer).toLocaleString('en-IN')} — requesting this amount may qualify for immediate approval.
        </div>
      )}

      </div>
    </div>
  );
};

export default ActionPlan;
