// ── Seed Users ────────────────────────────────────────────────────────────────
// Pre-defined accounts. Never deleted from storage.

export const SEED_USERS = [
  {
    id: 'usr-admin-001',
    username: 'admin',
    password: 'admin@123',
    name: 'System Admin',
    role: 'admin',
    avatar: 'SA',
  },
  {
    id: 'usr-off-001',
    username: 'raj.sharma',
    password: 'officer@123',
    name: 'Raj Sharma',
    role: 'officer',
    avatar: 'RS',
    level: 'Senior',
    experience: '5 years',
    specialty: 'Complex & high-value loan portfolios',
    maxCases: 10,
    turnaround: '1–2 days',
    bio: 'Senior officer specialising in risk-weighted assessments and institutional compliance.',
  },
  {
    id: 'usr-off-002',
    username: 'priya.mehta',
    password: 'officer@123',
    name: 'Priya Mehta',
    role: 'officer',
    avatar: 'PM',
    level: 'Junior',
    experience: '1 year',
    specialty: 'Standard retail loan applications',
    maxCases: 5,
    turnaround: '3–5 days',
    bio: 'Junior officer handling standard applications with detailed fairness documentation.',
  },
  {
    id: 'usr-app-001',
    username: 'sarah.chen',
    password: 'demo@123',
    name: 'Sarah Chen',
    role: 'applicant',
    avatar: 'SC',
    age: 28,
    gender: 'Female',
    caseId: 'LX-9082',   // links to CASES entry
  },
  {
    id: 'usr-app-002',
    username: 'marcus.miller',
    password: 'demo@123',
    name: 'Marcus Miller',
    role: 'applicant',
    avatar: 'MM',
    age: 34,
    gender: 'Male',
    caseId: 'LX-8812',
  },
  {
    id: 'usr-app-003',
    username: 'priya.patel',
    password: 'demo@123',
    name: 'Priya Patel',
    role: 'applicant',
    avatar: 'PP',
    age: 26,
    gender: 'Female',
    caseId: 'LX-7761',
  },
];

export const USERS_KEY   = 'fairlens_users';
export const SESSION_KEY = 'fairlens_session';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      // Merge: ensure all seed users always exist (can't be deleted externally)
      const ids = stored.map(u => u.id);
      const missing = SEED_USERS.filter(u => !ids.includes(u.id));
      return [...missing, ...stored];
    }
  } catch (_) {}
  return [...SEED_USERS];
}

export function saveUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (_) {}
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

export function saveSession(session) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (_) {}
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (_) {}
}

export function getOfficers(users) {
  return users.filter(u => u.role === 'officer');
}
