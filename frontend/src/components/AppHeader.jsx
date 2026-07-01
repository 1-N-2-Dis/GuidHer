import { NavLink } from 'react-router-dom';
import { useAuthUser } from '../lib/useAuthUser.js';

export default function AppHeader() {
  const { user, isAnonymous, role } = useAuthUser();

  return (
    <header className="app-nav">
      <span className="nav-brand">SaferRoute</span>
      <nav>
        <NavLink to="/report" className="nav-link">Report a condition</NavLink>
        {role === 'admin' && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
        <NavLink to="/login" className="nav-link">
          {isAnonymous ? 'Sign in' : user.displayName || user.email}
        </NavLink>
      </nav>
    </header>
  );
}
