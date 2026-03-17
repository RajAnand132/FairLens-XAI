import React from 'react';
import { CheckCircle } from 'lucide-react';

const OutcomeVision = ({ result, height }) => {
  const score = result?.probability || 0;
  const factors = result?.factors || [];

  // Needle rotation: -90 = far left (0%), +90 = far right (100%)
  const rotation = (score / 100) * 180 - 90;

  const scoreColor = !result ? 'var(--text-dim)' :
    score >= 75 ? 'var(--success)' :
    score >= 45 ? 'var(--warning)' :
    'var(--danger)';

  return (
    <div className="card-luxe" style={{ height, display: 'flex', flexDirection: 'column' }}>
      <h3 className="card-title" style={{ marginBottom: 0 }}>Application Status &amp; XAI Analysis</h3>

      <div style={{ flexShrink: 0, paddingTop: '0.75rem' }}>
        {/* ── Semi-circle gauge ── */}
      <div className="gauge-container">

        {/* Arc */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '240px', height: '120px',
          borderTopLeftRadius: '120px',
          borderTopRightRadius: '120px',
          background: 'linear-gradient(to right, #f43f5e 0%, #f59e0b 50%, #10b981 100%)',
          overflow: 'hidden',
        }}>
          {/* Inner donut cutout */}
          <div style={{
            position: 'absolute',
            width: '176px', height: '88px',
            bottom: 0, left: '32px',
            background: 'var(--bg-card)',
            borderTopLeftRadius: '88px',
            borderTopRightRadius: '88px',
            zIndex: 1,
          }} />
        </div>

        {/* Needle — zero-size anchor at pivot (120, 120), rotates around its own bottom */}
        <div style={{ position: 'absolute', top: '120px', left: '120px', width: 0, height: 0, zIndex: 5 }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '-1.5px',
            width: '3px',
            height: '103px',
            background: 'var(--text-main)',
            borderRadius: '3px 3px 0 0',
            transformOrigin: 'bottom center',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            {/* Needle tip dot */}
            <div style={{
              position: 'absolute',
              top: '-5px', left: '-4px',
              width: '11px', height: '11px',
              background: 'white',
              borderRadius: '50%',
              border: '2px solid var(--primary)',
              boxShadow: '0 0 8px rgba(255,255,255,0.8)',
            }} />
          </div>
        </div>

        {/* Centre pivot pin — centred exactly on (120, 120) */}
        <div style={{
          position: 'absolute',
          top: '108px', left: '108px',
          width: '24px', height: '24px',
          background: 'var(--primary)',
          borderRadius: '50%',
          border: '4px solid var(--bg-card)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
          zIndex: 6,
        }} />

        {/* Score label */}
        <div style={{ position: 'absolute', top: '132px', left: 0, right: 0, textAlign: 'center' }}>
          <div style={{
            fontSize: '2.25rem',
            fontWeight: 900,
            color: scoreColor,
            lineHeight: 1,
            letterSpacing: '-1px',
          }}>
            {score.toFixed(0)}<span style={{ fontSize: '1.1rem', opacity: 0.6, verticalAlign: 'super', marginLeft: '2px' }}>%</span>
          </div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '0.4rem',
          }}>
            Approval Probability
          </div>
        </div>
      </div>
      </div>

      {/* ── SHAP section (Scrollable) ── */}
      <div className={height ? "scroll-glass" : ""} style={{ flex: 1, borderTop: '1px solid var(--border-glass)', paddingTop: '0.85rem' }}>

        {/* Header row with legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: 0,
          }}>
            Explainability Report (SHAP)
          </h4>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.62rem', fontWeight: 700,
              color: 'var(--danger)',
              background: 'rgba(244,63,94,0.08)',
              border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: '4px',
              padding: '0.15rem 0.45rem',
            }}>
              ← Hurting
            </span>
            <span style={{
              fontSize: '0.62rem', fontWeight: 700,
              color: 'var(--success)',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '4px',
              padding: '0.15rem 0.45rem',
            }}>
              Helping →
            </span>
          </div>
        </div>

        {factors.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 'var(--radius-md)',
          }}>
            <CheckCircle size={18} color="var(--success)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {result 
                ? "All financial factors are within acceptable thresholds. No adverse vectors detected."
                : "Awaiting Case Selection — No analysis data available."
              }
            </span>
          </div>
        ) : (
          factors.map((f, i) => (
            <div key={i} className="shap-bar-container">
              <div className="shap-label">
                <span>{f.name}</span>
                <span style={{ color: f.value < 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                  {f.value > 0 ? '+' : ''}{(f.value * 100).toFixed(0)}%
                </span>
              </div>
              <div className="shap-track">
                <div className="shap-fill" style={{
                  width: `${Math.abs(f.value * 100)}%`,
                  background: f.value < 0 ? 'var(--danger)' : 'var(--success)',
                  opacity: 0.85,
                }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                {f.description}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OutcomeVision;
