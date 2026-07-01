import { Link } from 'react-router-dom';
import AccountPanel from '../features/auth/AccountPage.jsx';

export default function AccountPage() {
  return (
    <div className="report-page">
      <div className="report-page-inner">
        <Link to="/" className="back-link">← Back to map</Link>
        <AccountPanel />
      </div>
    </div>
  );
}
