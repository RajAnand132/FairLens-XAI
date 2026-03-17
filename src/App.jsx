import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ApplicantDashboard from './pages/ApplicantDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import AccountsPage from './pages/AccountsPage';
import OfficerManagement from './pages/OfficerManagement';
import LoginScreen from './pages/LoginScreen';

import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { CASES } from './services/mockApi';
import { loadUsers, loadSession, clearSession, getOfficers } from './data/seedUsers';

const ACCOUNTS_KEY = 'fairlens_accounts';

function loadAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      // 1. Update existing cases with any new seed data
      const mergedStored = stored.map(sCase => {
        const seedMatch = CASES.find(c => c.id === sCase.id);
        return seedMatch ? { ...seedMatch, ...sCase } : sCase;
      });
      // 2. Add any NEW cases from CASES that aren't in stored yet
      const storedIds = stored.map(c => c.id);
      const newCases = CASES.filter(c => !storedIds.includes(c.id));
      return [...mergedStored, ...newCases];
    }
  } catch (_) {}
  return CASES;
}

function saveAccounts(cases) {
  try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(cases)); } catch (_) {}
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [session, setSession]       = React.useState(loadSession);         // { userId, username, name, role, avatar }
  const [users, setUsers]           = React.useState(loadUsers);
  const [allCases, setAllCases]     = React.useState(loadAccounts);
  const [activeUser, setActiveUser] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [auditLogs, setAuditLogs]           = React.useState(() => {
    try {
      const raw = localStorage.getItem('fairlens_logs');
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  });

  // Persist logs
  React.useEffect(() => {
    localStorage.setItem('fairlens_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const officers = getOfficers(users);

  // ── Auth ─────────────────────────────────────────────────────────────────────
  const handleLogin = (sess) => setSession(sess);

  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  // ── Notifications ────────────────────────────────────────────────────────────
  const addNotification = React.useCallback((notif) => {
    setNotifications(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      ...notif, // { title, message, type, targetRole, targetUserId }
    }, ...prev].slice(0, 15));
  }, []);

  const markNotificationsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  // ── Cases CRUD ───────────────────────────────────────────────────────────────
  const updateCases = (updater) => {
    setAllCases(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveAccounts(next);
      return next;
    });
  };

  const handleRegisterUser = (userData) => {
    const newCase = {
      ...userData,
      id: `LX-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'New',
      equityScore: userData.score || 70,
      submittedBy: session?.userId,
    };
    updateCases(prev => [newCase, ...prev]);
    setActiveUser(newCase);
    addNotification({ title: 'New Application', message: `${newCase.name || 'Applicant'} submitted a loan audit.`, type: 'info' });
  };

  const handleUpdateCase = (id, updates) => {
    updateCases(prev => prev.map(c => c.id === id ? { ...c, ...updates, equityScore: updates.score || c.equityScore } : c));
    if (activeUser?.id === id) setActiveUser(prev => ({ ...prev, ...updates }));
    addNotification({ title: 'Application Updated', message: `Your details for ${id} have been updated.`, type: 'success' });
  };

  const handleUpdateCaseStatus = (id, newStatus) => {
    const target = allCases.find(c => c.id === id);
    updateCases(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (activeUser?.id === id) setActiveUser(prev => ({ ...prev, status: newStatus }));

    // Log the change
    const logEntry = {
      id: Date.now(),
      caseId: id,
      action: `Status changed to ${newStatus}`,
      by: session.name,
      role: session.role,
      time: new Date().toLocaleString(),
    };
    setAuditLogs(prev => [logEntry, ...prev]);

    // Targeted notification for the applicant
    addNotification({
      title: 'Status Updated',
      message: `Your application ${id} → ${newStatus}.`,
      type: 'success',
      targetUserId: target?.submittedBy, // Only this applicant sees it
    });

    // Notification for admins
    addNotification({
      title: 'Portal Activity',
      message: `${session.name} updated ${id} to ${newStatus}.`,
      type: 'info',
      targetRole: 'admin',
    });
  };

  const handleAssignOfficer = (caseId, officerId) => {
    const officer = officers.find(o => o.id === officerId);
    const target  = allCases.find(c => c.id === caseId);

    updateCases(prev => prev.map(c => c.id === caseId ? { ...c, assignedOfficerId: officerId } : c));
    if (activeUser?.id === caseId) setActiveUser(prev => ({ ...prev, assignedOfficerId: officerId }));

    // Log reassignment
    setAuditLogs(prev => [{
      id: Date.now(),
      caseId,
      action: `Assigned to ${officer?.name || 'officer'}`,
      by: session.name,
      role: session.role,
      time: new Date().toLocaleString(),
    }, ...prev]);

    // Notify the officer
    addNotification({
      title: 'New Case Assigned',
      message: `You have been assigned to ${target?.name || 'a new case'}.`,
      type: 'info',
      targetUserId: officerId,
    });

    // Notify the applicant
    addNotification({
      title: 'Officer Assigned',
      message: `${officer?.name || 'An officer'} has been assigned to your case.`,
      type: 'info',
      targetUserId: target?.submittedBy,
    });
  };

  const handleDeleteAccount = (id) => {
    const target = allCases.find(c => c.id === id);
    updateCases(prev => prev.filter(c => c.id !== id));
    setActiveUser(prev => (prev?.id === id ? allCases.find(c => c.id !== id) || null : prev));
    addNotification({ title: 'Account Deleted', message: `Removed ${target?.name || id}.`, type: 'danger' });
  };

  const handleResetAccounts = () => {
    saveAccounts(CASES);
    setAllCases(CASES);
    setActiveUser(CASES[0]);
    addNotification({ title: 'Registry Reset', message: 'Restored to factory defaults.', type: 'info' });
  };

  const handleUsersChange = () => setUsers(loadUsers());

  // ── Gate: show login if no session ──────────────────────────────────────────
  if (!session) {
    return (
      <ThemeProvider>
        <SettingsProvider userId={null}>
          <LoginScreen onLogin={handleLogin} />
        </SettingsProvider>
      </ThemeProvider>
    );
  }

  const role      = session.role;
  const isAdmin   = role === 'admin';
  const isOfficer = role === 'officer';
  const isApplicant = role === 'applicant';

  // Officer sees only their assigned cases
  const visibleCases = isAdmin
    ? allCases
    : isOfficer
      ? allCases.filter(c => c.assignedOfficerId === session.userId)
      : allCases.filter(c => c.submittedBy === session.userId || c.name === session.name);

  // Active user for the applicant: their own linked case
  const myCase = isApplicant
    ? allCases.find(c => c.submittedBy === session.userId || c.name === session.name) || null
    : activeUser || allCases[0];

  return (
    <ThemeProvider>
      <SettingsProvider userId={session?.userId}>
        <BrowserRouter>
          <ScrollToTop />
          <div className="app-container">
            <Sidebar role={role} />
            <div className="main-content">
              <Navbar
                user={isApplicant ? myCase : activeUser}
                session={session}
                onLogout={handleLogout}
                notifications={notifications}
                onMarkRead={markNotificationsRead}
              />
              <Routes>
                <Route path="/" element={<Navigate to={isApplicant ? '/applicant' : '/officer'} replace />} />

                {/* Applicant dashboard — applicants + admin */}
                <Route
                  path="/applicant"
                  element={
                    isOfficer
                      ? <Navigate to="/officer" replace />
                      : <ApplicantDashboard
                          activeUser={myCase}
                          onUserChange={setActiveUser}
                          allCases={isAdmin ? allCases : visibleCases}
                          onRegisterUser={handleRegisterUser}
                          onUpdateCase={handleUpdateCase}
                          officers={officers}
                          onAssignOfficer={handleAssignOfficer}
                          session={session}
                        />
                  }
                />

                {/* Officer portal — officers + admin */}
                <Route
                  path="/officer"
                  element={
                    isApplicant
                      ? <Navigate to="/applicant" replace />
                      : <OfficerDashboard
                          activeUser={activeUser}
                          onUserChange={setActiveUser}
                          allCases={visibleCases}
                          onUpdateStatus={handleUpdateCaseStatus}
                          onAssignOfficer={handleAssignOfficer}
                          session={session}
                          officers={officers}
                        />
                  }
                />

                {/* Accounts registry — admin only */}
                <Route
                  path="/accounts"
                  element={
                    !isAdmin && !isOfficer
                      ? <Navigate to="/applicant" replace />
                      : <AccountsPage
                          allCases={isAdmin ? allCases : visibleCases}
                          onUserChange={setActiveUser}
                          onDeleteAccount={isAdmin ? handleDeleteAccount : undefined}
                          onResetAccounts={isAdmin ? handleResetAccounts : undefined}
                          onUpdateStatus={handleUpdateCaseStatus}
                          officers={officers}
                        />
                  }
                />

                {/* Officer management — admin only */}
                <Route
                  path="/officers"
                  element={
                    !isAdmin
                      ? <Navigate to="/" replace />
                      : <OfficerManagement
                          allCases={allCases}
                          onUsersChange={handleUsersChange}
                        />
                  }
                />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
