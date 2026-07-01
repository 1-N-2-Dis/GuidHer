// User role record (F-009: email/password signup + admin moderation).
// Role: create/read the users/{uid} doc that backend/firestore.rules uses for isAdmin() checks.
// Traces to: docs/09-data-model.md (users collection), backend/firestore.rules.
//
// Self-signup always writes role: 'user' — rules reject any other value on create (no client-side
// privilege escalation). 'admin' is only ever set out-of-band via
// backend/scripts/seed-auth-users.mjs (Admin SDK, bypasses rules).
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.js';

function userRef(uid) {
  return doc(db, 'users', uid);
}

// Create the caller's own users/{uid} doc if it doesn't exist yet. Safe to call on every sign-in.
export async function ensureUserDoc(uid, email) {
  const ref = userRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { email, role: 'user' });
  }
}

// Subscribe to the caller's own role ('user' | 'admin' | null while no doc exists yet, e.g. still
// anonymous). Returns an unsubscribe fn.
export function subscribeRole(uid, onChange) {
  return onSnapshot(userRef(uid), (snap) => onChange(snap.exists() ? snap.data().role : null));
}
