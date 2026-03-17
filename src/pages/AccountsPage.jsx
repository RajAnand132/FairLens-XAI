import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Plus, ArrowRight, TrendingUp, AlertTriangle, CheckCircle, Clock, Trash2, RotateCcw, ShieldCheck } from 'lucide-react';
import { analyzeLoanFairness } from '../services/mockApi';

const STATUS_META = {
  Auto:   { label: 'Auto-Approved', color: 'var(--success)',   bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)', icon: CheckCircle },
  Review: { label: 'Under Review',  color: 'var(--warning)',   bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.25)', icon: Clock },
  Alert:  { label: 'High Risk',     color: 'var(--danger)',    bg: 'rgba(244,63,94,0.10)',   border: 'rgba(244,63,94,0.25)', icon: AlertTriangle },
  New:    { label: 'New Entry',     color: 'var(--secondary)', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.25)', icon: Plus },
};

const fmt = (n) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` :
  n >= 1000   ? `₹${(n / 1000).toFixed(0)}K`   : `₹${n}`;

const AccountCard = ({ account, onSelect, onDelete, onUpdateStatus, officers = [] }) => {
  const assignedOfficer = officers.find(o => o.id === account.assignedOfficerId);
  const result  = analyzeLoanFairness(account);
  const meta    = STATUS_META[account.status] || STATUS_META.Review;
  const Icon    = meta.icon;
  const dtiRaw  = account.income > 0 ? (account.totalDebt / account.income) * 100 : null;
  const dti     = dtiRaw !== null ? `${dtiRaw.toFixed(1)}%` : '—';
  const probColor =
    result.probability >= 75 ? 'var(--success)' :
    result.probability >= 45 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div
      onClick={() => onSelect(account)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-card)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px',
        background: result.approved
          ? 'linear-gradient(90deg, var(--success), var(--primary))'
          : 'linear-gradient(90deg, var(--danger), var(--warning))',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Avatar */}
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {(account.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
              {account.name || 'Unknown Applicant'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'monospace', marginTop: '1px' }}>
              {account.id || '—'}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          padding: '0.25rem 0.65rem',
          borderRadius: '20px',
          background: meta.bg,
          border: `1px solid ${meta.border}`,
          fontSize: '0.62rem', fontWeight: 700, color: meta.color,
          textTransform: 'uppercase', letterSpacing: '0.5px',
          flexShrink: 0,
        }}>
          <Icon size={10} />
          {meta.label}
        </div>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {[
          { label: 'Income',    value: fmt(account.income    || 0) },
          { label: 'Loan Ask',  value: fmt(account.loanAmount|| 0) },
          { label: 'DTI',       value: dti },
        ].map(m => (
          <div key={m.label} style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 0.6rem',
          }}>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '0.2rem' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Assigned Officer Strip */}
      <div style={{ 
        marginBottom: '1rem', padding: '0.65rem 0.85rem', 
        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', 
        borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem'
      }}>
        <div style={{ 
          width: '24px', height: '24px', borderRadius: '6px', 
          background: assignedOfficer ? 'var(--primary-dim)' : 'rgba(244,63,94,0.05)',
          border: `1px solid ${assignedOfficer ? 'var(--border-active)' : 'rgba(244,63,94,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ShieldCheck size={12} color={assignedOfficer ? 'var(--primary)' : 'var(--danger)'} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Officer</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: assignedOfficer ? 'var(--text-main)' : 'var(--danger)' }}>
            {assignedOfficer ? assignedOfficer.name : 'Unassigned'}
          </div>
        </div>
      </div>

      {/* Approval probability bar */}
      <div style={{ marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Approval Probability
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: probColor }}>
            {result.probability}%
          </span>
        </div>
        <div style={{ height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${result.probability}%`,
            background: `linear-gradient(90deg, ${probColor}, ${result.approved ? 'var(--primary)' : 'var(--danger)'})`,
            borderRadius: '2px',
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem',
      }}>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); onUpdateStatus(account.id, 'Auto'); }}
            style={{ 
              background: 'var(--success-dim)', border: '1px solid var(--success)', 
              color: 'var(--success)', padding: '0.2rem 0.6rem', borderRadius: '4px', 
              fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--success-dim)'}
          >
            APPROVE
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onUpdateStatus(account.id, 'Alert'); }}
            style={{ 
              background: 'rgba(244,63,94,0.1)', border: '1px solid var(--danger)', 
              color: 'var(--danger)', padding: '0.2rem 0.6rem', borderRadius: '4px', 
              fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
          >
            FLAG
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Delete — admin only (onDelete is undefined for officers) */}
          {onDelete && (
            <button
              onClick={e => { e.stopPropagation(); if (window.confirm(`Delete ${account.name || 'this account'}? This cannot be undone.`)) onDelete(account.id); }}
              title="Delete account"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem',
                color: 'var(--text-dim)', display: 'flex', alignItems: 'center',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
            >
              <Trash2 size={13} />
            </button>
          )}
          <div 
            onClick={(e) => { e.stopPropagation(); onSelect(account); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}
          >
            Profile <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const AccountsPage = ({ allCases = [], onUserChange, onDeleteAccount, onResetAccounts, onUpdateStatus, officers = [] }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const filters = ['All', 'Auto', 'Review', 'Alert', 'New'];

  const filtered = allCases.filter(c => {
    const matchSearch = !search ||
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.id   || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  // Summary stats — compute results once per case
  const total    = allCases.length;
  const caseResults = allCases.map(c => analyzeLoanFairness(c));
  const approved = caseResults.filter(r => r.approved).length;
  const alerts   = allCases.filter(c => c.status === 'Alert').length;
  const avgProb  = total
    ? Math.round(caseResults.reduce((s, r) => s + r.probability, 0) / total)
    : 0;

  const handleSelect = (account) => {
    onUserChange(account);
    navigate('/applicant');
  };

  return (
    <div className="animate-in">
      {/* Header */}
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Accounts <span>Registry</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
            {total} applicant{total !== 1 ? 's' : ''} on record · saved to browser storage
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            onClick={() => {
              onUserChange(null);
              navigate('/applicant');
            }}
            className="btn-primary"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.5rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
            }}
          >
            <Plus size={14} /> Add New Applicant
          </button>
          
          <button
            onClick={() => { if (window.confirm('Reset all accounts to default seed data?')) onResetAccounts(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-dim)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
          >
            <RotateCcw size={13} /> Reset Registry
          </button>
        </div>
      </header>

      {/* Summary strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        {[
          { label: 'Total Accounts', value: total,        color: 'var(--primary)',   icon: Users },
          { label: 'Approved',       value: approved,     color: 'var(--success)',   icon: CheckCircle },
          { label: 'High Risk',      value: alerts,       color: 'var(--danger)',    icon: AlertTriangle },
          { label: 'Avg Probability',value: `${avgProb}%`,color: 'var(--secondary)', icon: TrendingUp },
        ].map(s => {
          const SIcon = s.icon;
          return (
            <div key={s.label} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.85rem',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: `${s.color}18`,
                border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <SIcon size={16} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: s.color }}>
                  {s.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + Filter bar */}
      <div style={{
        display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{
            position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-dim)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '0.6rem 0.85rem 0.6rem 2.25rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border-card)'}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: filter === f ? 'var(--primary)' : 'var(--border-card)',
                background: filter === f ? 'rgba(16,185,129,0.12)' : 'var(--bg-card)',
                color: filter === f ? 'var(--primary)' : 'var(--text-dim)',
                fontSize: '0.72rem', fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
            >
              {f}
              {f !== 'All' && (
                <span style={{ marginLeft: '0.35rem', opacity: 0.7 }}>
                  {allCases.filter(c => c.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem 1rem',
          color: 'var(--text-dim)', fontSize: '0.85rem',
        }}>
          <Users size={36} style={{ opacity: 0.2, marginBottom: '0.75rem', display: 'block', margin: '0 auto 0.75rem' }} />
          <p>No accounts match your search.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map(account => (
            <AccountCard key={account.id} account={account} onSelect={handleSelect} onDelete={onDeleteAccount} onUpdateStatus={onUpdateStatus} officers={officers} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
