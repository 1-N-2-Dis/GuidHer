import { Link } from 'react-router-dom';
import { useAuthUser } from '../lib/useAuthUser.js';
import AdminReports from '../features/admin/AdminReports.jsx';

export default function AdminPage({ reports, segments }) {
  const { role } = useAuthUser();

  return (
    <div className="report-page">
      <div className="report-page-inner">
        <Link to="/" className="back-link">← Back to map</Link>
        <section className="report-step">
          <h2>Admin: all reports</h2>
          {role === 'admin' ? (
            <AdminReports reports={reports} segments={segments} />
          ) : (
            <p className="muted">You need an admin account to view this page.</p>
          )}
        </section>
      </div>
    </div>
  );
}
