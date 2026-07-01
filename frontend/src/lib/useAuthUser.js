// Reactive Firebase Auth state for UI components (AppHeader, AccountPage, AdminPage).
// Role: expose { user, isAnonymous, role } without prop-drilling.
// Traces to: docs/06-system-design.md (Firebase Auth), lib/auth.js, lib/users.js (F-009 role).
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';
import { subscribeRole } from './users.js';

export function useAuthUser() {
  const [user, setUser] = useState(auth.currentUser);
  const [role, setRole] = useState(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user || user.isAnonymous) { setRole(null); return; }
    return subscribeRole(user.uid, setRole);
  }, [user]);

  return { user, isAnonymous: !user || user.isAnonymous, role };
}
