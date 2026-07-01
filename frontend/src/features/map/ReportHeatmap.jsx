// Community heatmap layer of validated (yellow/red severity) reports (F-010).
// Renders density via MapLibre's native heatmap layer type over a GeoJSON source built from the
// already-subscribed reports + segment geometry — no new dependency, no backend query.
import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { buildValidatedHeatmapGeoJSON } from '../../lib/heatmap.js';

export default function ReportHeatmap({ reports, segments, visible }) {
  const data = useMemo(
    () => buildValidatedHeatmapGeoJSON(reports, segments),
    [reports, segments],
  );

  if (!visible || !data.features.length) return null;

  return (
    <Source id="validated-reports-heatmap" type="geojson" data={data}>
      <Layer
        id="validated-heatmap-layer"
        type="heatmap"
        paint={{
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 12, 1, 16, 2.5],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 12, 14, 16, 30],
          'heatmap-opacity': 0.65,
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(249,168,37,0)',
            0.3, 'rgba(249,168,37,0.5)',
            0.6, 'rgba(230,81,0,0.7)',
            1, 'rgba(198,40,40,0.9)',
          ],
        }}
      />
    </Source>
  );
}
