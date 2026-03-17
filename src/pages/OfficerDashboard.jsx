import React, { useState, useEffect, useRef } from 'react';
import OutcomeVision from '../components/OutcomeVision';
import AISecondOpinion from '../components/AISecondOpinion';
import { analyzeLoanFairness } from '../services/mockApi';
import { Search, ArrowUpRight, ShieldCheck, AlertTriangle, RefreshCcw, Sparkles, UserCheck, UserCircle, X, Activity } from 'lucide-react';

const statusColors = {
  Auto:   { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  text: 'var(--success)' },
  Review: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  text: 'var(--warning)' },
  Alert:  { bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.3)',   text: 'var(--danger)'  },
  New:    { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.3)',  text: 'var(--secondary)' },
};

const OfficerDashboard = ({ activeUser, onUserChange, allCases = [], onUpdateStatus, session, officers = [], onAssignOfficer }) => {
  const [results, setResults]         = useState(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reassignId, setReassignId]   = useState(null); // case id currently showing reassign dropdown
  const [officerSearch, setOfficerSearch] = useState('');
  const reassignRef = useRef(null);

  // Auto-close reassign dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reassignId && reassignRef.current && !reassignRef.current.contains(event.target)) {
        setReassignId(null);
        setOfficerSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [reassignId]);

  // 1. Auto-selection & Result Sync
  useEffect(() => {
    // Determine if the currently active user is part of the authorized queue
    const isUserInLibrary = allCases.some(c => c.id === activeUser?.id);
    
    // Case A: Officer has assignments but no valid selection is active -> Auto-select first
    if (allCases.length > 0 && (!activeUser || !isUserInLibrary)) {
      onUserChange(allCases[0]);
      return;
    }

    // Case B: Officer has NO assignments, but a user is still active in state -> Clear context
    if (allCases.length === 0 && activeUser) {
      onUserChange(null);
      return;
    }

    // Synchronization: Run analysis if valid user is selected, otherwise clear results
    if (activeUser && isUserInLibrary) {
      setResults(analyzeLoanFairness(activeUser));
    } else {
      setResults(null);
    }
  }, [activeUser, allCases, onUserChange]);

  const sc = statusColors[activeUser?.status] || statusColors.Review;

  const filteredCases = allCases.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async (newStatus) => {
    if (!activeUser || !onUpdateStatus) return;
    setIsProcessing(true);
    setTimeout(() => {
      onUpdateStatus(activeUser.id, newStatus);
      setIsProcessing(false);
    }, 800);
  };

  const handleReassign = (caseId, newOfficerId) => {
    if (onAssignOfficer) onAssignOfficer(caseId, newOfficerId);
    setReassignId(null);
  };

  // Officers available to reassign to (exclude current assignee)
  const otherOfficers = (caseItem) =>
    officers.filter(o => o.id !== caseItem.assignedOfficerId);

  return (
    <div className="animate-in">
      <header className="dashboard-header">
        <h1>Institutional Control | <span>Officer Portal</span></h1>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            border: '1px solid var(--border-card)',
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--bg-elevated)',
          }}>
            <Search size={14} color="var(--text-dim)" />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                background: 'none', border: 'none', outline: 'none', 
                color: 'var(--text-main)', fontSize: '0.8rem', width: '120px' 
              }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['All', 'New', 'Review', 'Auto', 'Alert'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: statusFilter === f ? 'var(--primary)' : 'var(--border-glass)',
                  background: statusFilter === f ? 'var(--primary-dim)' : 'var(--bg-elevated)',
                  color: statusFilter === f ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Audit Complete summary — mirrors what applicant sees */}
      {results && activeUser ? (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', gap: '1.5rem',
        }}>
          {/* Icon + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '140px' }}>
            <Sparkles size={15} color="var(--primary)" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Audit Complete
            </span>
          </div>

          {/* Applicant name + ID */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{activeUser.name}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{activeUser.id}</div>
          </div>

          {/* AI decision badge */}
          <div style={{
            padding: '0.35rem 1rem', borderRadius: '20px',
            fontWeight: 800, fontSize: '0.75rem',
            textTransform: 'uppercase', letterSpacing: '0.8px',
            background: results.approved ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
            border: `1px solid ${results.approved ? 'rgba(16,185,129,0.35)' : 'rgba(244,63,94,0.35)'}`,
            color: results.approved ? 'var(--success)' : 'var(--danger)',
          }}>
            {results.approved ? '✓ AI Pre-Approved' : '✗ AI Flagged'}
          </div>

          {/* Probability + Confidence */}
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {[
              { label: 'Probability', value: `${results.probability}%`, color: results.probability >= 75 ? 'var(--success)' : results.probability >= 45 ? 'var(--warning)' : 'var(--danger)' },
              { label: 'Confidence',  value: `${(results.confidence * 100).toFixed(0)}%`, color: 'var(--primary)' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '0.15rem' }}>{m.label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-card)', border: '1px dashed var(--border-glass)',
          borderRadius: 'var(--radius-lg)', padding: '1.8rem',
          marginBottom: '1.25rem', textAlign: 'center', opacity: 0.6
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
            <Activity size={20} />
            No Active Selection — Please select an applicant from the queue
          </div>
        </div>
      )}

      <div className="grid-3">
        {/* Pending Queue */}
        <section className="card-luxe" style={{ display: 'flex', flexDirection: 'column', height: '650px' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: '1rem' }}><ShieldCheck size={14} /> Pending Queue ({filteredCases.length})</h3>
            
            {/* Inline Triage Search */}
            <div style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.75rem',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem'
            }}>
              <Search size={14} color="var(--text-dim)" />
              <input 
                type="text" 
                placeholder="Find applicant or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  outline: 'none', 
                  color: 'var(--text-main)', 
                  fontSize: '0.75rem', 
                  width: '100%',
                  fontFamily: 'inherit'
                }} 
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', display: 'flex' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="scroll-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.4rem' }}>
            {filteredCases.length === 0 ? (
              <div style={{
                height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '1rem',
                padding: '2rem', textAlign: 'center', opacity: 0.5
              }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '50%', 
                  background: 'var(--bg-elevated)', border: '1px dashed var(--border-glass)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ShieldCheck size={20} color="var(--text-dim)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    Queue Clear
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                    No pending applications assigned to your profile at this time.
                  </div>
                </div>
              </div>
            ) : filteredCases.map(c => {
              const cs = statusColors[c.status] || statusColors.Review;
              const isActive = c.id === activeUser?.id;
              return (
                <div
                  key={c.id}
                  style={{
                    background: isActive ? 'var(--primary-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${isActive ? 'var(--border-active)' : 'var(--border-glass)'}`,
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {/* Main row */}
                  <div
                    onClick={() => { onUserChange(c); setReassignId(null); }}
                    style={{ padding: '0.9rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{c.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px', fontFamily: 'monospace' }}>{c.id}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: c.equityScore > 80 ? 'var(--success)' : c.equityScore > 50 ? 'var(--warning)' : 'var(--danger)' }}>
                        {c.equityScore}%
                      </div>
                      <span style={{
                        fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                        padding: '2px 7px', borderRadius: '10px',
                        background: cs.bg, border: `1px solid ${cs.border}`, color: cs.text,
                      }}>
                        {c.status}
                      </span>
                    </div>
                  </div>

                  {/* Reassign row — officer can reassign, cannot delete */}
                  {officers.length > 1 && (
                    <div 
                      ref={reassignId === c.id ? reassignRef : null}
                      style={{
                        borderTop: `1px solid var(--border-glass)`,
                        padding: '0.4rem 1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
                        position: 'relative'
                      }}
                    >
                      {reassignId === c.id ? (
                        /* Modern Searchable Reassign UI */
                        <div className="animate-in" style={{ position: 'relative', flex: 1, zIndex: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                            <div style={{
                              flex: 1, position: 'relative',
                              display: 'flex', alignItems: 'center',
                              background: 'var(--bg-app)', border: '1px solid var(--border-glass)',
                              borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.6rem'
                            }}>
                              <Search size={10} color="var(--text-dim)" style={{ marginRight: '0.4rem' }} />
                              <input
                                autoFocus
                                placeholder="Search officers..."
                                value={officerSearch}
                                onChange={e => setOfficerSearch(e.target.value)}
                                style={{
                                  background: 'none', border: 'none', outline: 'none',
                                  color: 'var(--text-main)', fontSize: '0.72rem', width: '100%',
                                  padding: '0.2rem 0'
                                }}
                              />
                            </div>
                            <button 
                              onClick={e => { e.stopPropagation(); setReassignId(null); setOfficerSearch(''); }}
                              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                            >
                              <X size={12} />
                            </button>
                          </div>

                          {/* Smooth Fade-in Reassign Menu */}
                          <div className="scroll-glass animate-in" style={{
                            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                            background: 'var(--bg-card)',
                            boxShadow: 'var(--shadow-card)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-glass)',
                            padding: '0.4rem', maxHeight: '160px', overflowY: 'auto',
                            zIndex: 100,
                            backdropFilter: 'blur(20px)',
                            transformOrigin: 'top'
                          }}>
                            {otherOfficers(c).filter(o => o.name.toLowerCase().includes(officerSearch.toLowerCase())).length === 0 ? (
                              <div style={{ padding: '0.8rem', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                                No other officers found
                              </div>
                            ) : (
                              otherOfficers(c)
                                .filter(o => o.name.toLowerCase().includes(officerSearch.toLowerCase()))
                                .map(o => (
                                  <button
                                    key={o.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReassign(c.id, o.id);
                                      setOfficerSearch('');
                                    }}
                                    style={{
                                      width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem',
                                      borderRadius: 'var(--radius-sm)', border: 'none',
                                      background: 'transparent', color: 'var(--text-main)',
                                      cursor: 'pointer', transition: 'all 0.15s ease',
                                      fontSize: '0.75rem', fontWeight: 600,
                                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                      marginBottom: '1px',
                                      borderLeft: '3px solid transparent'
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.background = 'var(--bg-hover)';
                                      e.currentTarget.style.borderLeftColor = 'var(--primary)';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.background = 'transparent';
                                      e.currentTarget.style.borderLeftColor = 'transparent';
                                    }}
                                  >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                      {o.name}
                                      <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>({o.level})</span>
                                    </span>
                                    <ArrowUpRight size={10} style={{ opacity: 0.4 }} />
                                  </button>
                                ))
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); setReassignId(c.id); }}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-dim)',
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            fontFamily: 'inherit', padding: '0.1rem 0',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                        >
                          <UserCheck size={11} /> 
                          <span style={{ fontSize: '0.65rem' }}>Reassign Case</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* XAI Audit Evidence — scrollable internally */}
        <section>
          <OutcomeVision result={results} height="650px" />
        </section>

        {/* Institutional Integrity */}
        <section>
          <div className="card-luxe" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '650px' }}>
            {/* Fixed header for integrity column */}
            <h3 className="card-title" style={{ flexShrink: 0 }}><ArrowUpRight size={14} /> Institutional Integrity</h3>
            
            <div className="scroll-glass" style={{ flex: 1, paddingRight: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            {/* Fairness Confidence Bar */}
            <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', opacity: activeUser ? 1 : 0.4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fairness Confidence</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>{activeUser ? '98.2%' : 'N/A'}</span>
              </div>
              <div className="shap-track">
                <div className="shap-fill" style={{ width: activeUser ? '98.2%' : '0%', background: 'var(--primary)' }} />
              </div>
            </div>

            {/* Status Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
              <div style={{
                display: 'flex', gap: '0.75rem', alignItems: 'center',
                padding: '0.75rem 1rem', background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)',
              }}>
                <ShieldCheck size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compliant with E-FOF regulations.</span>
              </div>

              <div style={{
                display: 'flex', gap: '0.75rem', alignItems: 'center',
                padding: '0.75rem 1rem', background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)',
              }}>
                <ShieldCheck size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No demographic disparities detected.</span>
              </div>

              {activeUser?.status === 'Alert' && (
                <div style={{
                  display: 'flex', gap: '0.75rem', alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'rgba(244,63,94,0.06)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(244,63,94,0.2)',
                }}>
                  <AlertTriangle size={18} color="var(--danger)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>High-risk flag — manual review required.</span>
                </div>
              )}
              </div>
            </div>
          </div>
            {activeUser ? (
              <button 
                disabled={isProcessing || (session.level === 'Junior' && !results?.approved)}
                onClick={() => handleAction(results?.approved ? 'Auto' : 'Alert')}
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  background: isProcessing ? 'var(--bg-elevated)' : (results?.approved ? 'var(--primary)' : 'rgba(244,63,94,0.15)'),
                  color: results?.approved ? '#000' : 'var(--danger)',
                  border: results?.approved ? 'none' : '1px solid rgba(244,63,94,0.3)',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: isProcessing || (session.level === 'Junior' && !results?.approved) ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: (session.level === 'Junior' && !results?.approved) ? 0.6 : 1,
                }}
              >
                {isProcessing ? (
                  <> <RefreshCcw size={14} className="animate-spin" /> Processing... </>
                ) : (
                  session.level === 'Junior' && !results?.approved
                    ? 'Senior Review Required'
                    : results?.approved ? 'Authorize Application' : 'Flag for Review'
                )}
              </button>
            ) : (
              <div style={{
                marginTop: 'auto',
                width: '100%',
                padding: '0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px dashed var(--border-glass)',
                color: 'var(--text-dim)',
                fontSize: '0.7rem',
                fontWeight: 700,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.6
              }}>
                Awaiting active selection
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Technical SHAP Matrix — Strictly hidden if no authorized case is active */}
      {activeUser && results && allCases.some(c => c.id === activeUser.id) && (
        <div style={{ marginTop: '1.5rem' }}>
          <section className="card-luxe" style={{ height: 'auto' }}>
            <h3 className="card-title">Technical Analysis Matrix (SHAP) — {activeUser.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Feature contribution breakdown for application <strong style={{ color: 'var(--text-main)' }}>{activeUser.id}</strong>.
              <> Income: ₹{activeUser.income.toLocaleString('en-IN')} · Loan: ₹{activeUser.loanAmount.toLocaleString('en-IN')} · Credit: {activeUser.creditScore}</>
            </p>

            {results.factors && results.factors.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {results.factors.map((f, i) => (
                  <div key={i} style={{
                    padding: '1rem',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${f.value > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                  }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: f.value > 0 ? 'var(--success)' : 'var(--danger)', marginBottom: '0.25rem' }}>
                      {f.value > 0 ? '+' : ''}{(f.value * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                      {f.description}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                No significant SHAP factors flagged — profile within standard parameters.
              </p>
            )}
          </section>
        </div>
      )}

      {/* AI Second Opinion */}
      <div style={{ marginTop: '1.5rem' }}>
        <AISecondOpinion 
          applicationData={activeUser} 
          xaiFactors={results?.factors} 
          session={session}
        />
      </div>
    </div>
  );
};

export default OfficerDashboard;
