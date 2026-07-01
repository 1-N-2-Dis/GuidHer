// Community heatmap of "condition validated" reports (F-010).
// Role: build a GeoJSON FeatureCollection of validated reports for the ZoneMap heatmap layer.
// Traces to: docs/03-prd.md F-010, docs/09-data-model.md (no stored `validated` field).
//
// "Validated" = severity is yellow or red (AI-assigned, F-006, BR-007) — never green, never
// user-selectable. Plots every qualifying report within the freshness window (not just the
// latest per segment) so repeated recent reports on one segment read as denser.
import { isFlaggedTonight } from './freshness.js';

export function buildValidatedHeatmapGeoJSON(reports, segments, now = Date.now()) {
  const segmentById = new Map(segments.map((s) => [s.segmentId, s]));
  const features = [];

  for (const report of reports) {
    if (report.severity !== 'yellow' && report.severity !== 'red') continue;
    if (!isFlaggedTonight(report, now)) continue;

    const segment = segmentById.get(report.segmentId);
    if (!segment?.geo) continue;

    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [segment.geo.lng, segment.geo.lat] },
      properties: {
        severity: report.severity,
        // Red counts more than yellow; corroboration adds density (capped so one heavily
        // corroborated report can't swamp the whole layer).
        weight: (report.severity === 'red' ? 1 : 0.6) * Math.min(report.corroborationCount || 1, 5),
      },
    });
  }

  return { type: 'FeatureCollection', features };
}
