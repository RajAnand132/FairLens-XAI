import React, { useState, useCallback, useEffect, useRef } from 'react';
import DocumentUpload from '../components/DocumentUpload';
import OutcomeVision from '../components/OutcomeVision';
import ActionPlan from '../components/ActionPlan';
import ImprovementSimulator from '../components/ImprovementSimulator';
import PathSelector from '../components/PathSelector';
import DataInputForm from '../components/DataInputForm';
import { analyzeLoanFairness, CASES } from '../services/mockApi';
import { RefreshCcw, Sparkles, UserCircle, ShieldCheck, Clock, AlertTriangle, CheckCircle, Bot, DollarSign, CreditCard, PieChart, Activity } from 'lucide-react';
import ApplicantAIAdvisor from '../components/ApplicantAIAdvisor';
import OfficerSelector from '../components/OfficerSelector';

import { useSettings } from '../context/SettingsContext';

const ApplicantDashboard = ({
  activeUser,
  onUserChange,
  allCases,
  onRegisterUser,
  onUpdateCase,
  officers,
  onAssignOfficer,
  session
}) => {
  const { sliderSettings, xaiPrecision } = useSettings();
  const [showSelector, setShowSelector] = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const selectorRef = useRef(null);

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSelector && selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [showSelector]);
  const canUserEdit = session?.role === 'applicant';
  
  // Submission Lock from institutional perspective (under review)
  const isLocked = activeUser?.status && activeUser.status !== 'New';

  const [step, setStep]         = useState(activeUser?.id ? 'results' : 'path-select');
  const [results, setResults]   = useState(activeUser?.id ? analyzeLoanFairness(activeUser, xaiPrecision) : null);
  const [simData, setSimData]   = useState(activeUser || {});
  const [baseProb, setBaseProb] = useState(() => activeUser?.id ? analyzeLoanFairness(activeUser, xaiPrecision).probability : 0);
  const [isNewAudit, setIsNewAudit] = useState(false);

  // Sync when activeUser or precision changes
  useEffect(() => {
    if (activeUser) {
      setSimData(activeUser);
      const r = analyzeLoanFairness(activeUser, xaiPrecision);
      setResults(r);
      setBaseProb(r.probability);
    }
  }, [activeUser, xaiPrecision]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const runAudit = useCallback((data) => {
    // Sanitize: Force numeric types for simulation accuracy
    const cleanData = {
      ...data,
      income: Number(data.income) || 0,
      totalDebt: Number(data.totalDebt) || 0,
      loanAmount: Number(data.loanAmount) || 0,
      creditScore: Number(data.creditScore) || 0,
      age: Number(data.age) || 0,
    };

    setStep('analyzing');
    setTimeout(() => {
      const r = analyzeLoanFairness(cleanData, xaiPrecision);
      
      // If we have an activeUser (existing case) and NOT starting fresh, update it.
      if (!isNewAudit && activeUser?.id && onUpdateCase) {
        onUpdateCase(activeUser.id, { ...cleanData, score: r.probability });
      } else if (cleanData.name && onRegisterUser) {
        onRegisterUser({ ...cleanData, score: r.probability });
      }

      if (isNewAudit && onUserChange) onUserChange(null);
      setIsNewAudit(false);
      setSimData(cleanData);
      setResults(r);
      setBaseProb(r.probability);
      setStep('results');
    }, 1500);
  }, [activeUser, onUpdateCase, onRegisterUser, xaiPrecision, isNewAudit, onUserChange]);

  const handleManualSubmit     = (formData) => runAudit(formData);
  const handleDocumentProcessed = (data)   => runAudit(data);

  // Simulator slider: recalculate immediately, no delay
  const handleSimChange = useCallback((newData) => {
    setSimData(newData);
    setResults(analyzeLoanFairness(newData, xaiPrecision));
  }, [xaiPrecision]);

  const handleReset = () => {
    setIsNewAudit(true);
    setStep('path-select');
  };

  const handleStartFresh = (targetStep) => {
    setStep(targetStep);
  };
  // ── Render ───────────────────────────────────────────────────────────────────

  // ① Loading
  if (step === 'analyzing') {
    return (
      <div className="loading-container animate-in">
        <div className="loading-orb" />
        <h2 className="loading-title">Synthesizing Fairness Vectors...</h2>
        <p className="loading-sub">
          Running institutional parity benchmarks across DTI, credit, and capital stress matrices.
        </p>
      </div>
    );
  }

  // ② Results
  if (step === 'results' && results) {
    return (
      <div className="animate-in">
        <header className="dashboard-header">
          <div>
            <h1>Applicant <span>Dashboard</span></h1>
            {/* Searchable Profile Selector Dropdown */}
            {session?.role === 'admin' && (
              <div style={{ position: 'relative', marginTop: '0.75rem' }} ref={selectorRef}>
                <button
                  onClick={() => setShowSelector(!showSelector)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    fontSize: '0.72rem', fontWeight: 700, padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--text-main)',
                    background: 'var(--bg-elevated)', color: 'var(--text-main)',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    boxShadow: showSelector ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  <UserCircle size={14} style={{ color: 'inherit' }} />
                  Switch Profile: {activeUser?.name || 'Select...'}
                  <RefreshCcw size={12} style={{ marginLeft: '0.4rem', opacity: 0.6 }} />
                </button>

                {showSelector && (
                  <div className="glass-panel animate-in" style={{
                    position: 'absolute', top: '110%', left: 0, width: '300px',
                    zIndex: 1000, padding: '0.75rem', 
                    boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                    border: '1px solid var(--text-main)',
                    background: 'var(--bg-card)'
                  }}>
                    <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search applicants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--bg-app)',
                          border: '1px solid #cbd5e1', // Neutral grey border for light theme
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.65rem 0.85rem', 
                          fontSize: '0.85rem',
                          color: 'var(--text-main)',
                          outline: 'none',
                          boxShadow: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--text-main)'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      />
                    </div>
                    <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      {allCases
                        .filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.id?.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(c => {
                          const isActive = activeUser?.id === c.id;
                          return (
                            <button
                              key={c.id}
                              onClick={() => {
                                onUserChange(c);
                                setShowSelector(false);
                                setSearchQuery('');
                              }}
                              style={{
                                textAlign: 'left', padding: '0.8rem 1rem',
                                borderRadius: 'var(--radius-sm)', border: 'none',
                                background: isActive ? 'var(--bg-app)' : 'transparent',
                                borderLeft: isActive ? '3px solid var(--text-main)' : '3px solid transparent',
                                color: 'var(--text-main)',
                                cursor: 'pointer', transition: 'all 0.1s ease',
                                fontSize: '0.85rem', fontWeight: isActive ? 800 : 500,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: '2px'
                              }}
                              onMouseEnter={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.background = 'var(--bg-hover)';
                                  e.currentTarget.style.color = 'var(--text-main)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = 'var(--text-main)';
                                }
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}>
                                {c.name}
                              </span>
                              <span style={{ fontSize: '0.65rem', opacity: isActive ? 0.8 : 0.4, fontFamily: 'monospace', color: 'inherit' }}>{c.id}</span>
                            </button>
                          );
                        })}
                      {allCases.length === 0 && <div style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>No matching applicants</div>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-muted)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              transition: 'all var(--transition-fast)',
              fontFamily: 'inherit',
            }}
          >
            <RefreshCcw size={14} /> New Audit
          </button>
        </header>

        <div className="grid-3">
          {/* Audit Complete card */}
          <section>
            <div className="card-luxe" style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center',
              height: '650px'
            }}>
              <h3 className="card-title" style={{ alignSelf: 'stretch', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ padding: '0.4rem', background: 'rgba(99,102,241,0.1)', borderRadius: '8px' }}>
                  <ShieldCheck size={18} color="var(--primary)" />
                </div>
                Detailed Audit Analysis
              </h3>
              
              <div className="scroll-glass" style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '1rem' }}>
                
                {/* Visual Status Indicator */}
                <div style={{ textAlign: 'center', position: 'relative' }}>
                  <div style={{
                    padding: '0.45rem 1.75rem',
                    borderRadius: '40px',
                    fontWeight: 900, fontSize: '0.82rem',
                    textTransform: 'uppercase', letterSpacing: '1.5px',
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    background: results.approved
                      ? 'rgba(16,185,129,0.08)'
                      : 'rgba(244,63,94,0.08)',
                    border: `1px solid ${results.approved ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                    color: results.approved ? 'var(--success)' : 'var(--danger)',
                    boxShadow: results.approved ? '0 0 30px rgba(16,185,129,0.1)' : '0 0 30px rgba(244,63,94,0.1)',
                  }}>
                    {results.approved ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    {results.approved ? 'Audit Verified' : 'Action Required'}
                  </div>
                </div>

                {/* Officer Decision Integration */}
                {(() => {
                  const status = activeUser?.status;
                  if (!status) return null;

                  const statusMap = {
                    New:    { color: 'var(--warning)',   bg: 'rgba(245,158,11,0.05)', label: 'Pending Review' },
                    Review: { color: 'var(--warning)',   bg: 'rgba(245,158,11,0.05)', label: 'Internal Review' },
                    Auto:   { color: 'var(--success)',   bg: 'rgba(16,185,129,0.05)', label: 'Officer Decision' },
                    Alert:  { color: 'var(--danger)',    bg: 'rgba(244,63,94,0.05)',  label: 'Review Flagged' },
                  };

                  const s = statusMap[status];
                  if (!s) return null;

                  return (
                    <div style={{
                      margin: '0 0.5rem',
                      background: `linear-gradient(90deg, ${s.bg}, transparent)`,
                      borderLeft: `4px solid ${s.color}`,
                      padding: '0.6rem 1.1rem',
                      borderRadius: '0 12px 12px 0',
                      display: 'flex', alignItems: 'center', gap: '0.85rem'
                    }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${s.color}30` }}>
                        <Bot size={14} color={s.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.15rem' }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
                          Verified by Institutional Oracle
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Data Grid HUD */}
                {(() => {
                  const data      = simData || activeUser;
                  if (!data) return null;
                  
                  const income    = parseFloat(data.income)      || 0;
                  const loan      = parseFloat(data.loanAmount)  || 0;
                  const credit    = parseFloat(data.creditScore) || 0;
                  const debt      = parseFloat(data.totalDebt)   || 0;
                  const dtiNum    = income > 0 ? (debt / income) * 100 : 0;
                  
                  const dtiColor  = dtiNum > 43 ? 'var(--danger)' : dtiNum > 36 ? 'var(--warning)' : 'var(--success)';
                  const creditColor = credit >= 750 ? 'var(--success)' : credit >= 650 ? 'var(--warning)' : 'var(--danger)';

                  const metrics = [
                    { key: 'income', label: 'Monthly Income', value: `₹${income.toLocaleString('en-IN')}`, icon: DollarSign,  color: 'var(--primary)', raw: income },
                    { key: 'loanAmount', label: 'Requested Loan', value: `₹${loan.toLocaleString('en-IN')}`, icon: CreditCard,  color: '#8b5cf6', raw: loan },
                    { key: 'totalDebt', label: 'DTI Ratio', value: `${dtiNum.toFixed(1)}%`,           icon: PieChart,    color: dtiColor, raw: dtiNum },
                    { key: 'creditScore', label: 'Credit Integrity', value: credit,                       icon: Activity,    color: creditColor, raw: credit },
                  ];

                  return (
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '0.85rem', padding: '0 0.5rem'
                    }}>
                      {metrics.map(m => {
                        const maxVal = m.key === 'totalDebt' ? 100 : sliderSettings[m.key]?.max || 1000;
                        const numericPct = (m.raw / maxVal) * 100;
                        const fillPct = Math.min(100, Math.max(0, numericPct));

                        return (
                          <div key={m.label} style={{
                            background: 'var(--bg-hover)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '16px',
                            padding: '1rem 1.25rem',
                            display: 'flex', flexDirection: 'column', gap: '0.35rem',
                            minHeight: '94px',
                            justifyContent: 'center'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <m.icon size={13} color={m.color} />
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.6px' }}>
                                {m.label}
                              </span>
                            </div>
                            <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.8px' }}>
                              {m.value}
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--border-glass)', borderRadius: '2px', marginTop: '0.4rem', overflow: 'hidden' }}>
                              <div style={{ 
                                width: `${fillPct}%`, 
                                minWidth: m.raw > 0 ? '4px' : '0',
                                height: '100%', 
                                background: m.color, 
                                opacity: 0.6, 
                                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Footer Insight (Outside of scroll-glass) */}
              <div style={{
                width: '100%',
                borderTop: '1px solid var(--border-glass)',
                paddingTop: '1.25rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                marginTop: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginBottom: '0.25rem' }}>
                      Model Fidelity
                    </div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: '160px', lineHeight: 1.4 }}>
                      Neural confidence in profile verification.
                    </p>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-1.5px' }}>
                    {(results.confidence * 100).toFixed(0)}<span style={{ fontSize: '1rem', opacity: 0.5 }}>%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gauge + SHAP */}
          <section>
            <OutcomeVision result={results} height="650px" />
          </section>

          {/* Action Plan */}
          <section>
            <ActionPlan result={results} height="650px" />
          </section>
        </div>

        {/* What-If Simulator */}
        <ImprovementSimulator
          data={simData}
          onChange={handleSimChange}
          newProbability={results.probability}
          baseProbability={baseProb}
          isLocked={!canUserEdit}
        />

        {/* Officer Assignment — only for applicants, not admin previewing */}
        {session?.role === 'applicant' && officers.length > 0 && (
          <OfficerSelector
            officers={officers}
            assignedOfficerId={activeUser?.assignedOfficerId}
            allCases={allCases}
            onAssign={(officerId) => onAssignOfficer?.(activeUser?.id, officerId)}
          />
        )}

        {/* AI Financial Advisor Chat */}
        <ApplicantAIAdvisor profileData={simData} result={results} session={session} />
      </div>
    );
  }

  // ③ Manual entry
  if (step === 'manual') {
    return (
      <div className="animate-in" style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setStep('path-select')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-dim)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-dim)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
          >
            ← Back to Selection
          </button>
          {results?.probability > 0 && (
            <button
              onClick={() => setStep('results')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-muted)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
            >
              Cancel & Exit
            </button>
          )}
        </div>
        <DataInputForm 
          prefillData={isNewAudit ? {} : simData} 
          onSubmit={handleManualSubmit} 
          isLocked={!canUserEdit}
        />
      </div>
    );
  }

  // ④ Document upload
  if (step === 'upload') {
    return (
      <div className="animate-in" style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setStep('path-select')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-dim)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-dim)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
          >
            ← Back to Selection
          </button>
          {results?.probability > 0 && (
            <button
              onClick={() => setStep('results')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-muted)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
            >
              Cancel & Exit
            </button>
          )}
        </div>
        <DocumentUpload 
          onProcessed={handleDocumentProcessed} 
          isLocked={!canUserEdit}
        />
      </div>
    );
  }

  // ⑤ Path selector (default / after reset)
  return (
    <div className="animate-in">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Loan <span>Assessment Portal</span></h1>
        {results?.probability > 0 && (
          <button
            onClick={() => setStep('results')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-muted)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
          >
            ← Return to Dashboard
          </button>
        )}
      </header>
      <PathSelector onSelect={handleStartFresh} isLocked={isLocked} />
    </div>
  );
};

export default ApplicantDashboard;
