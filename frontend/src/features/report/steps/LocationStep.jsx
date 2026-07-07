// Report form section: location (required) — pin on the map.
// Pin mode snaps onto any real road within the coverage radius and produces a dynamic seg_osm_* id 
// that encodes the snapped location + road name.
// Traces to: docs/superpowers/specs/2026-07-01-report-wizard-frontend-design.md.
import PinMap from '../PinMap.jsx';
import { parseRoadSegmentId } from '../../../lib/osmRoads.js';

export default function LocationStep({ segments, segmentId, onSelect }) {
  return (
    <section className="report-step">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Where is this?</h2>
      </div>

      <div className="pin-map-wrap">
        <PinMap onSnap={(segment) => onSelect(segment.segmentId)} />
      </div>
      <p className="muted">Tap a road to place your pin.</p>

      {segmentId && (
        <p className="status-ok">
          Selected: {segments.find((s) => s.segmentId === segmentId)?.name
            ?? parseRoadSegmentId(segmentId)?.name}
        </p>
      )}
    </section>
  );
}
