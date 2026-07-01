// Account page (F-002/BR-005 support, F-009 email/password): lets an anonymous reporter
// optionally upgrade to a persistent account, via Google or email/password. Not a gate — / and
// /report stay reachable anonymously either way.
// Traces to: docs/superpowers/specs/2026-07-01-login-account-page-design.md.
import { useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuthUser } from '../../lib/useAuthUser.js';
import { signInWithGoogle, signOutUser, signUpWithEmail, signInWithEmail, isGmailAddress } from '../../lib/auth.js';

export default function AccountPage() {
  const { user, isAnonymous, role } = useAuthUser();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch {
      setError('Sign-in was cancelled or blocked. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError(null);

    // DEMO-ONLY (per request): no real email verification, just a @gmail.com suffix check.
    if (!isGmailAddress(email)) {
      setError('Please use an email address ending in @gmail.com.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use' ? 'An account with that email already exists — try logging in instead.'
          : err.code === 'auth/invalid-credential' ? 'Incorrect email or password.'
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setError(null);
    setBusy(true);
    try {
      await signOutUser();
    } catch {
      setError('Could not sign out. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (!isAnonymous) {
    return (
      <section className="report-step">
        <h2>Account</h2>
        <div className="icon-line">
          {user.photoURL && (
            <img className="account-avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
          )}
          <span>Signed in as {user.displayName || user.email}{role === 'admin' ? ' (admin)' : ''}</span>
        </div>
        <button type="button" onClick={handleSignOut} disabled={busy}>
          <LogOut size={14} /> Sign out
        </button>
        {error && <p className="status-err">{error}</p>}
      </section>
    );
  }

  return (
    <section className="report-step">
      <h2>{mode === 'signup' ? 'Sign up' : 'Log in'}</h2>
      <p className="muted">
        You&apos;re browsing anonymously. Signing in keeps your reports linked to one account
        without sharing your identity publicly.
      </p>

      <form onSubmit={handleEmailSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <button type="submit" disabled={busy}>
          {mode === 'signup' ? 'Create account' : 'Log in'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(null); }}
      >
        {mode === 'signup' ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>

      <button type="button" onClick={handleGoogle} disabled={busy}>
        <LogIn size={14} /> Sign in with Google
      </button>

      {error && <p className="status-err">{error}</p>}
    </section>
  );
}
