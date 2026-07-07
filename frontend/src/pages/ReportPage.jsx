// guidHER Report page — condition selector + existing F-002/F-006 wizard.
// The quick-tap type selector shown here feeds into the existing ReportForm wizard.
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReportForm from '../features/report/ReportForm.jsx';
import { GradientBlobs } from '../components/BackgroundDecorations.jsx';

export default function ReportPage({ segments, selectedId, onSelect }) {
  const navigate = useNavigate();

  return (
    <div className="page-scroll">
      <GradientBlobs opacity={0.4} variant="report" />
      <div className="page-scroll-inner">

        {/* Header */}
        <div className="mb-20">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div className="text-h1" style={{ margin: 0, fontSize: '2.2rem', color: 'var(--ink)' }}>
              Community Reporting
            </div>
            <button className="btn btn-ghost btn-sm back-link" onClick={() => navigate(-1)} style={{ margin: 0 }}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>
          <div className="text-body" style={{ color: 'var(--muted)', marginTop: 8, fontSize: '1.05rem', lineHeight: 1.4 }}>
            Share &amp; protect — your experience can help another commuter.
          </div>
        </div>

        {/* Report wizard (F-002 / F-006) */}
        <div className="card mb-20">
          <ReportForm segments={segments} selectedId={selectedId} onSelect={onSelect} />
        </div>

      </div>
    </div>
  );
}
