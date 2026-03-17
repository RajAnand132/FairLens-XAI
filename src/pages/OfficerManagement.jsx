import React, { useState } from 'react';
import { ShieldCheck, UserCircle, Trash2, Plus, Briefcase, Eye, EyeOff, Edit3, X, ArrowRight } from 'lucide-react';
import { loadUsers, saveUsers, getOfficers } from '../data/seedUsers';

const LEVEL_META = {
  Senior: { color: 'var(--primary)',   bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)' },
  Junior: { color: 'var(--secondary)', bg: 'rgba(99,102,241,0.10)',  border: 'rgba(99,102,241,0.25)' },
};

const OfficerFormModal = ({ editingOfficer, onSave, onClose }) => {
  const [form, setForm] = useState(editingOfficer || { 
    name: '', username: '', password: '', level: 'Junior', specialty: '', maxCases: 5, turnaround: '3–5 days' 
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!editingOfficer;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    const errs = {};
    if (!form.name.trim())     errs.name     = 'Required';
    if (!form.username.trim()) errs.username = 'Required';
    if (!isEdit && form.password.length < 6) errs.password = 'Min 6 chars';
    
    const users = loadUsers();
    if (!isEdit && users.find(u => u.username === form.username.trim())) {
      errs.username = 'Username taken';
    }
    
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const officerData = {
      ...form,
      username: form.username.trim(),
      name: form.name.trim(),
      role: 'officer',
      avatar: form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      maxCases: Number(form.maxCases),
    };

    if (!isEdit) {
      officerData.id = `usr-off-${Date.now()}`;
      officerData.experience = 'New';
      officerData.bio = `${form.level} officer.`;
      const updated = [...users, officerData];
      saveUsers(updated);
    } else {
      const updated = users.map(u => u.id === editingOfficer.id ? { ...u, ...officerData } : u);
      saveUsers(updated);
    }

    onSave(officerData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'radial-gradient(circle at center, rgba(7,12,24,0.7) 0%, rgba(7,12,24,0.9) 100%)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      animation: 'fadeIn 0.15s ease forwards',
    }} onClick={onClose}>
      <div className="glass-panel" style={{
        padding: '2.5rem',
        width: '100%', maxWidth: '480px',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}>
          <X size={20} />
        </button>

        {/* Glow effect */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '200px', height: '200px', background: 'var(--primary-glow)', filter: 'blur(60px)', borderRadius: '50%', opacity: 0.4, pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: '14px', 
            background: 'var(--primary-dim)', border: '1px solid var(--border-active)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)', boxShadow: '0 0 20px var(--primary-glow)'
          }}>
            {isEdit ? <Edit3 size={24} /> : <ShieldCheck size={24} />}
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              {isEdit ? 'Edit Officer' : 'Add New Officer'}
            </h3>
            <p style={{ margin: '2px 0 0', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
              {isEdit ? `Updating profile for ${editingOfficer.name}` : 'Create a new administrative officer account'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <UserCircle size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                className="form-input" 
                placeholder="e.g. Robert Wilson"
                value={form.name} 
                onChange={e => set('name', e.target.value)} 
                style={{ paddingLeft: '2.75rem', borderColor: errors.name ? 'var(--danger)' : '' }} 
              />
            </div>
            {errors.name && <span style={{ fontSize: '0.68rem', color: 'var(--danger)', marginTop: '0.4rem', display: 'block' }}>{errors.name}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Username</label>
              <input 
                className="form-input" 
                placeholder="rwilson"
                value={form.username} 
                onChange={e => set('username', e.target.value)} 
                disabled={isEdit}
                style={{ borderColor: errors.username ? 'var(--danger)' : '', opacity: isEdit ? 0.6 : 1 }} 
              />
              {errors.username && <span style={{ fontSize: '0.68rem', color: 'var(--danger)', marginTop: '0.4rem', display: 'block' }}>{errors.username}</span>}
            </div>
            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  className="form-input" 
                  type={showPw ? 'text' : 'password'} 
                  value={form.password} 
                  onChange={e => set('password', e.target.value)} 
                  placeholder={isEdit ? '••••••••' : ''}
                  style={{ paddingRight: '2.5rem', borderColor: errors.password ? 'var(--danger)' : '' }} 
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 0 }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <span style={{ fontSize: '0.68rem', color: 'var(--danger)', marginTop: '0.4rem', display: 'block' }}>{errors.password}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Level</label>
              <select className="form-input" value={form.level} onChange={e => set('level', e.target.value)}>
                <option value="Junior">Junior Officer</option>
                <option value="Senior">Senior Officer</option>
              </select>
            </div>
            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Max Cases</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" min={1} max={50} className="form-input" 
                  value={form.maxCases} 
                  onChange={e => set('maxCases', e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Specialty / Department</label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                className="form-input" 
                placeholder="e.g. Mortgages & Home Loans"
                value={form.specialty} 
                onChange={e => set('specialty', e.target.value)} 
                style={{ paddingLeft: '2.75rem' }} 
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
          <button className="btn-secondary" onClick={onClose} style={{ flex: 1, padding: '0.85rem' }}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} style={{ flex: 2, padding: '0.85rem' }}>
            {isEdit ? 'Save Changes' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

const RosterModal = ({ officer, assignedCases, onClose }) => {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(7,12,24,0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
      animation: 'fadeIn 0.2s ease-out',
    }} onClick={onClose}>
      <div className="glass-panel" style={{
        padding: '2rem',
        width: '100%', maxWidth: '540px',
        position: 'relative',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        border: '1px solid var(--border-glass)'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem' }}>
          <div style={{ 
            width: 44, height: 44, borderRadius: '12px', 
            background: 'var(--bg-elevated)', border: '1px solid var(--border-glass)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)'
          }}>
            {officer.avatar}
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 800 }}>{officer.name}'s Roster</h3>
            <p style={{ margin: '2px 0 0', color: 'var(--text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {assignedCases.length} Active Assignments
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }} className="scroll-glass">
          {assignedCases.map(c => (
            <div key={c.id} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{c.id}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>₹{(c.loanAmount / 1000).toFixed(0)}K</div>
                <div style={{ 
                  fontSize: '0.6rem', fontWeight: 700, 
                  color: c.status === 'Alert' ? 'var(--danger)' : c.status === 'Auto' ? 'var(--success)' : 'var(--warning)',
                  textTransform: 'uppercase'
                }}>
                  {c.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-secondary" onClick={onClose} style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }}>
          Close Roster
        </button>
      </div>
    </div>
  );
};

const OfficerManagement = ({ allCases = [], onUsersChange }) => {
  const [users, setUsers]           = useState(loadUsers);
  const [modalMode, setModalMode]   = useState(null); // 'add' | 'edit' | 'roster'
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [rosterData, setRosterData] = useState(null); // { officer, cases }

  const officers = users.filter(u => u.role === 'officer');

  const getWorkload = (officerId) => allCases.filter(c => c.assignedOfficerId === officerId).length;

  const handleRefresh = () => {
    setUsers(loadUsers());
    if (onUsersChange) onUsersChange();
  };

  const handleEdit = (officer) => {
    setEditingOfficer(officer);
    setModalMode('edit');
  };

  const handleRemoveOfficer = (id) => {
    if (!window.confirm('Remove this officer? Their assigned cases will become unassigned.')) return;
    const updated = loadUsers().filter(u => u.id !== id);
    saveUsers(updated);
    setUsers(updated);
    if (onUsersChange) onUsersChange();
  };

  return (
    <div className="animate-in">
      <header className="dashboard-header" style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingBottom: '1.5rem', marginBottom: '2.5rem',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            width: 54, height: 54, borderRadius: '16px', 
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
              Officer <span style={{ color: 'var(--primary)' }}>Management</span>
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px', fontWeight: 500 }}>
              Administrate accounts and workloads for {officers.length} active officers
            </p>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => setModalMode('add')}
          style={{ borderRadius: '12px', padding: '0.75rem 1.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
        >
          <Plus size={16} /> Add New Officer
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.75rem' }}>
        {officers.map(o => {
          const assignedCases = allCases.filter(c => c.assignedOfficerId === o.id);
          const workload = assignedCases.length;
          const lm = LEVEL_META[o.level] || LEVEL_META.Junior;
          const isSeed = o.id.startsWith('usr-off-00'); // protect seeds from deletion but not editing
          return (
            <div key={o.id} className="glass-panel" style={{ 
              padding: '1.75rem', 
              position: 'relative', 
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '46px', height: '46px', borderRadius: '14px', 
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-glass)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 800, color: 'var(--primary)', flexShrink: 0,
                    fontSize: '1rem'
                  }}>
                    {o.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', fontSize: '1rem' }}>{o.name}</div>
                    <span style={{ 
                      fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '8px', 
                      background: lm.bg, border: `1px solid ${lm.border}`, color: lm.color, 
                      textTransform: 'uppercase', letterSpacing: '0.5px' 
                    }}>
                      {o.level}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: '0.4rem', borderRadius: '8px', transition: 'all 0.2s' }}
                    className="hover-bg-elevated">
                    <Edit3 size={15} />
                  </button>
                  {!isSeed && (
                    <button onClick={() => handleRemoveOfficer(o.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: '0.4rem', borderRadius: '8px', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                {o.specialty}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                  { label: 'Cases', value: `${workload}/${o.maxCases}`, icon: Briefcase },
                  { label: 'Username', value: `@${o.username}`, icon: UserCircle },
                  { label: 'T-Around', value: o.turnaround, icon: ShieldCheck },
                ].map(m => (
                  <div key={m.label} style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid var(--border-glass)', 
                    borderRadius: '12px', 
                    padding: '0.6rem' 
                  }}>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>{m.label}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Assigned List */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Applicants</div>
                  {assignedCases.length > 3 && (
                    <button 
                      onClick={() => { setRosterData({ officer: o, cases: assignedCases }); setModalMode('roster'); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      VIEW ALL <ArrowRight size={10} />
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {assignedCases.length > 0 ? (
                    <>
                      {assignedCases.slice(0, 3).map(c => (
                        <div key={c.id} style={{
                          fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.5rem', 
                          background: 'var(--bg-elevated)', border: '1px solid var(--border-glass)',
                          borderRadius: '6px', color: 'var(--text-muted)'
                        }}>
                          {c.name}
                        </div>
                      ))}
                      {assignedCases.length > 3 && (
                        <div 
                          onClick={() => { setRosterData({ officer: o, cases: assignedCases }); setModalMode('roster'); }}
                          style={{
                            fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', 
                            background: 'var(--primary-dim)', border: '1px solid var(--border-active)',
                            borderRadius: '6px', color: 'var(--primary)', cursor: 'pointer'
                          }}
                        >
                          +{assignedCases.length - 3} MORE
                        </div>
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No active assignments</span>
                  )}
                </div>
              </div>

              {/* Workload Progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Current Workload</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: workload >= o.maxCases ? 'var(--danger)' : workload >= o.maxCases * 0.8 ? 'var(--warning)' : 'var(--primary)' }}>
                    {Math.round((workload / o.maxCases) * 100)}%
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${Math.min((workload / o.maxCases) * 100, 100)}%`, 
                    background: workload >= o.maxCases 
                      ? 'var(--danger)' 
                      : workload >= o.maxCases * 0.8 
                        ? 'var(--warning)' 
                        : 'var(--primary)', 
                    borderRadius: '3px', 
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: workload < o.maxCases * 0.8 ? '0 0 10px var(--primary-glow)' : 'none'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalMode === 'roster' && rosterData && (
        <RosterModal 
          officer={rosterData.officer} 
          assignedCases={rosterData.cases} 
          onClose={() => { setModalMode(null); setRosterData(null); }} 
        />
      )}

      {(modalMode === 'add' || modalMode === 'edit') && (
        <OfficerFormModal 
          editingOfficer={editingOfficer}
          onSave={handleRefresh} 
          onClose={() => { setModalMode(null); setEditingOfficer(null); }} 
        />
      )}
    </div>
  );
};

export default OfficerManagement;
