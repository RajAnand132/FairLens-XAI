import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const fmt = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const ImprovementSimulator = ({ data, onChange, newProbability, baseProbability, isLocked }) => {
  const { sliderSettings } = useSettings();

  // Clamp values if max ranges change in settings
  React.useEffect(() => {
    if (!data || isLocked) return;
    let hasChanges = false;
    const newData = { ...data };
    
    Object.keys(sliderSettings).forEach(key => {
      if (newData[key] > sliderSettings[key].max) {
        newData[key] = sliderSettings[key].max;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      onChange(newData);
    }
  }, [sliderSettings, isLocked]);

  const SLIDERS = [
    {
      key: 'income',
      label: sliderSettings.income.label,
      min: sliderSettings.income.min,
      max: sliderSettings.income.max,
      step: sliderSettings.income.step,
      hint: 'Higher is better ↑',
      positive: true,
      format: fmt,
    },
    {
      key: 'totalDebt',
      label: sliderSettings.totalDebt.label,
      min: sliderSettings.totalDebt.min,
      max: sliderSettings.totalDebt.max,
      step: sliderSettings.totalDebt.step,
      hint: 'Lower is better ↓',
      positive: false,
      format: fmt,
    },
    {
      key: 'loanAmount',
      label: sliderSettings.loanAmount.label,
      min: sliderSettings.loanAmount.min,
      max: sliderSettings.loanAmount.max,
      step: sliderSettings.loanAmount.step,
      hint: 'Lower is better ↓',
      positive: false,
      format: fmt,
    },
    {
      key: 'creditScore',
      label: sliderSettings.creditScore.label,
      min: sliderSettings.creditScore.min,
      max: sliderSettings.creditScore.max,
      step: sliderSettings.creditScore.step,
      hint: 'Higher is better ↑',
      positive: true,
      format: (v) => String(Math.round(v)),
    },
  ];

  if (!data) return null;

  // Ensure we have numbers to avoid NaN errors
  const currentIncome = Number(data.income);
  const currentDebt = Number(data.totalDebt); // Corrected from data.debt to data.totalDebt
  const loanAmount = Number(data.loanAmount); // Corrected from data.loan_amount to data.loanAmount

  const handleSliderChange = (e) => {
    if (isLocked) return;
    const { name, value } = e.target;
    onChange({ ...data, [name]: parseFloat(value) });
  };

  const base  = baseProbability ?? newProbability;
  const delta = Math.round(newProbability - base);

  const income = parseFloat(data.income) || 1;
  const debt   = parseFloat(data.totalDebt) || 0;
  const dti    = debt / income;
  const dtiPct = (dti * 100).toFixed(1);
  const dtiColor =
    dti > 0.45 ? 'var(--danger)' :
    dti > 0.35 ? 'var(--warning)' :
    'var(--success)';

  const probColor =
    newProbability >= 75 ? 'var(--success)' :
    newProbability >= 45 ? 'var(--warning)' :
    'var(--danger)';

  return (
    <div className="card-luxe" style={{ position: 'relative', overflow: 'hidden', marginTop: '1.5rem' }}>
      {/* Header Area */}
      <div className="dashboard-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 className="card-title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={20} color="#6366f1" />
            What-If Approval Simulator
          </h3>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Adjust profile markers to simulate real-time approval probability shifts.
          </p>
        </div>
        <div style={{
          padding: '0.4rem 0.8rem',
          background: 'var(--bg-hover)',
          border: '1px solid var(--border-glass)',
          borderRadius: '20px',
          fontSize: '0.65rem',
          fontWeight: 800,
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Live • Neural Engine
        </div>
      </div>

      {/* Lock Notice */}
      {isLocked && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.85rem 1rem',
          background: 'rgba(99,102,241,0.05)',
          borderLeft: '4px solid #6366f1',
          borderRadius: '8px',
          fontSize: '0.74rem',
          color: 'var(--text-main)',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.1rem' }}>ⓘ</span>
          <div>
            <strong style={{ color: '#6366f1' }}>Institutional Policy:</strong> Manipulation restricted to Applicants for personal "What-If" analysis.
          </div>
        </div>
      )}

      {/* Main Interface Layout — Stunning HUD Style */}
      <div className="simulator-container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* LEFT: Sliders — Compact & Integrated */}
        <div className="sliders-column" style={{ flex: '1.2', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {SLIDERS.map(({ key, label, min, max, step, hint, positive, format }) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                  {format(parseFloat(data[key]) || 0)}
                </span>
              </div>
              {(() => {
                const val = parseFloat(data[key]) || min;
                const pct = ((val - min) / (max - min)) * 100;
                return (
                  <input
                    type="range"
                    name={key}
                    min={min}
                    max={max}
                    step={step}
                    value={val}
                    onChange={handleSliderChange}
                    disabled={isLocked}
                    style={{ 
                      width: '100%', 
                      height: '6px', 
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--border-glass) ${pct}%, var(--border-glass) 100%)`,
                      borderRadius: '10px',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      outline: 'none',
                      transition: 'background 0.1s ease'
                    }}
                  />
                );
              })()}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', opacity: 0.6 }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>{hint}</span>
                {(key === 'income' || key === 'totalDebt') && (
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: dtiColor }}>DTI: {dtiPct}%</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Results Area — Neon HUD (No Containers) */}
        <div className="results-column" style={{ 
          flex: '1', 
          minWidth: '280px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          position: 'relative'
        }}>
          
          <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* VIBRANT BENCHMARK LABEL */}
            <div style={{ position: 'absolute', top: '-12px', fontSize: '0.52rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.9 }}>
              Institutional Benchmark: 50.0%
            </div>

            {/* NEON GAUGE SVG */}
            <svg width="280" height="150" viewBox="0 0 100 60" style={{ filter: `drop-shadow(0 0 20px ${probColor}33)` }}>
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--border-glass)" strokeWidth="8" strokeLinecap="round" />
              <path 
                d="M 10 50 A 40 40 0 0 1 90 50" 
                fill="none" 
                stroke={probColor} 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray="125.66" 
                strokeDashoffset={125.66 - (Math.min(newProbability, 100) / 100) * 125.66}
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.4s ease' }}
              />
              {/* GOLD THRESHOLD MARKER */}
              <line x1="50" y1="2" x2="50" y2="18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <div style={{ marginTop: '-75px', textAlign: 'center' }}>
              <div style={{ fontSize: '4.8rem', fontWeight: 900, color: probColor, lineHeight: 1, textShadow: `0 0 40px ${probColor}44`, fontVariantNumeric: 'tabular-nums' }}>
                {Math.round(newProbability)}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', marginTop: '0.5rem' }}>
                Approval Prob.
              </div>
            </div>
          </div>

          {/* STATUS SUMMARY — Typographic Excellence */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                fontSize: '2.4rem',
                color: newProbability >= 50 ? 'var(--success)' : 'var(--danger)',
                fontWeight: 900,
                lineHeight: 1,
                textShadow: `0 0 20px ${newProbability >= 50 ? 'var(--success)' : 'var(--danger)'}44`
              }}>
                {newProbability >= 50 ? '✓' : '!'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: newProbability >= 50 ? 'var(--success)' : 'var(--danger)', letterSpacing: '0.5px' }}>
                {newProbability >= 50 ? 'PASSES POLICY' : 'POLICY REJECTION'}
              </div>
            </div>
            
            <div style={{ padding: '0 1rem' }}>
              {Math.abs(delta) < 1 ? (
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px' }}>
                  BASELINE PROFILE ANALYSIS
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: delta > 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  {delta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {delta > 0 ? '+' : ''}{delta}% POLICY SHIFT DETECTED
                </div>
              )}
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}>
                Neural Verification Complete • Benchmark: 50.0%
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImprovementSimulator;
