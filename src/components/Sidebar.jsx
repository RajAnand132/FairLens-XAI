import React, { useState } from 'react';
import { LayoutGrid, ShieldCheck, UserCircle, FileText, Settings, HelpCircle, Users, X, Info, Trash2, Cpu, ExternalLink, IndianRupee } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Sidebar = ({ role }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const { 
    sliderSettings, 
    updateSliderMax, 
    xaiPrecision, 
    setXaiPrecision, 
    oracleActive, 
    setOracleActive 
  } = useSettings();

  const isAdmin   = role === 'admin';
  const isOfficer = role === 'officer' || isAdmin;

  return (
    <div className={`sidebar ${showSettings || showHelp ? 'modal-open' : ''}`}>
      <div className="sidebar-logo" title="FairLens">FL</div>

      <div className="sidebar-nav">
        {/* Applicant Dashboard — applicants + admin */}
        {!isOfficer && (
          <NavLink
            to="/applicant"
            className={({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''}`}
            title="Applicant Dashboard"
          >
            <LayoutGrid size={20} />
          </NavLink>
        )}

        {/* Admin gets both */}
        {isAdmin && (
          <NavLink
            to="/applicant"
            className={({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''}`}
            title="Applicant View"
          >
            <LayoutGrid size={20} />
          </NavLink>
        )}

        {/* Officer Portal — officers + admin */}
        {isOfficer && (
          <NavLink
            to="/officer"
            className={({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''}`}
            title="Officer Portal"
          >
            <ShieldCheck size={20} />
          </NavLink>
        )}

        {/* Accounts Registry — officers + admin */}
        {isOfficer && (
          <>
            <div className="sidebar-divider" />
            <NavLink
              to="/accounts"
              className={({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''}`}
              title="Accounts Registry"
            >
              <UserCircle size={20} />
            </NavLink>
          </>
        )}

        {/* Officer Management — admin only */}
        {isAdmin && (
          <NavLink
            to="/officers"
            className={({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''}`}
            title="Officer Management"
          >
            <ShieldCheck size={20} />
          </NavLink>
        )}

        {isOfficer && (
          <div className="sidebar-icon" title="Audit Files">
            <FileText size={20} />
          </div>
        )}
      </div>

      <div className="sidebar-bottom">
        <div 
          className="sidebar-icon" 
          title="Settings"
          onClick={() => setShowSettings(true)}
        >
          <Settings size={20} />
        </div>
        <div 
          className="sidebar-icon" 
          title="Support"
          onClick={() => setShowHelp(true)}
        >
          <HelpCircle size={20} />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="glass-panel animate-in" style={{ width: '460px', padding: '1.8rem', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowSettings(false)}><X size={18} /></button>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
              <Settings size={18} color="var(--primary)" /> System Settings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', border: 'none' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>XAI Precision</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Confidence score calculation depth</div>
                </div>
                <div style={{ 
                  display: 'flex', background: 'var(--bg-app)', padding: '3px', borderRadius: '12px', width: '100%',
                  border: '1px solid var(--border-glass)'
                }}>
                  {['Fast', 'Standard', 'Extreme'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setXaiPrecision(opt)}
                      style={{
                        flex: 1, padding: '0.5rem', border: 'none', borderRadius: '9px',
                        fontSize: '0.72rem', fontWeight: opt === xaiPrecision ? 800 : 500,
                        background: opt === xaiPrecision ? 'var(--bg-card)' : 'transparent',
                        color: opt === xaiPrecision ? 'var(--primary)' : 'var(--text-dim)',
                        boxShadow: opt === xaiPrecision ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                        cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        border: opt === xaiPrecision ? '1px solid var(--border-glass)' : '1px solid transparent'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>History Cache</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Clear local simulation data</div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ 
                    padding: '0.4rem 1rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--danger)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-glass)'}
                >
                  <Trash2 size={12} /> Clear Records
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Deep Oracle</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Enable generative AI fallback</div>
                </div>
                <div 
                  className={`toggle-switch ${oracleActive ? 'active' : ''}`}
                  onClick={() => setOracleActive(!oracleActive)}
                ></div>
              </div>

              {/* Financial Constraints — ADMIN ONLY */}
              {isAdmin && (
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <IndianRupee size={15} color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                      Financial Constraints
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {Object.entries(sliderSettings).map(([key, cfg]) => (
                      <div key={key}>
                        <label style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                          {cfg.label} Max
                        </label>
                        <input 
                          type="number"
                          value={cfg.max}
                          onChange={(e) => updateSliderMax(key, e.target.value)}
                          style={{
                            width: '100%',
                            background: 'var(--bg-app)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '6px',
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.75rem',
                            color: 'var(--text-main)',
                            outline: 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="glass-panel animate-in" style={{ width: '420px', padding: '1.5rem', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowHelp(false)}><X size={18} /></button>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
              <HelpCircle size={18} color="var(--primary)" /> Help & Resources
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--primary-dim)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Info size={14} /> Quick Start Guide
                </div>
                <div style={{ fontSize: '0.78rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                  Welcome back! Use the <b>What-If Simulator</b> to test how changing fields affects your score. For deep explanations, visit the <b>XAI Analysis</b> tab.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform Glossary</div>
                {[
                  { k: 'SHAP Values', v: 'Math impact of each field' },
                  { k: 'Equity Score', v: 'Fairness across demographics' },
                  { k: 'Oracle', v: 'Generative AI advisor' }
                ].map(item => (
                  <div key={item.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 800 }}>{item.k}</span>
                    <span style={{ color: 'var(--text-dim)' }}>{item.v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.8rem' }}>
                <button className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem', gap: '0.5rem' }}>
                  <Cpu size={14} /> System Status
                </button>
                <button className="btn-primary" style={{ flex: 1, fontSize: '0.75rem', gap: '0.5rem' }}>
                  Contact Dev <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
