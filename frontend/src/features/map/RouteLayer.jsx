// Severity-aware route line rendering between Point A and Point B.
// Fetches exactly 2 route candidates — "Recommended" + "Alternative" (see src/lib/routing.js's
// client-side WASM engine, ADR-0003), or 1 when no route exists at all — and renders each as its
// own line, both in the same purple, with the selected route emphasized (a route only appears
// here at all if it's one of the candidates the engine found).
import { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { fetchSafeRoutes } from '../../lib/routing.js';

export default function RouteLayer({ locationA, locationB, flaggedReports = [], onError, onRoutes, selectedIndex = 0, isConfirmed = false }) {
  const [routes, setRoutes] = useState(null); // Array<{ coords, status, tier }> | null

  useEffect(() => {
    if (!locationA || !locationB) { setRoutes(null); onRoutes?.([]); return; }

    let cancelled = false;
    const timer = setTimeout(() => {
      fetchSafeRoutes(locationA, locationB, flaggedReports)
        .then((r) => {
          if (!cancelled) {
            setRoutes(r);
            onError?.(null);
            onRoutes?.(r);
          }
        })
        .catch((err) => {
          console.error('Route fetch failed:', err.message);
          if (!cancelled) { setRoutes(null); onError?.(err.message); onRoutes?.([]); }
        });
    }, 400);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [locationA, locationB, flaggedReports]);

  if (!routes || !routes.length) return null;

  // We want the selected route to render on top. We can reorder the array we map over so the selected index is last.
  const ordered = routes.map((route, rank) => ({ route, rank })).sort((a, b) => {
    if (a.rank === selectedIndex) return 1;
    if (b.rank === selectedIndex) return -1;
    return b.rank - a.rank; // otherwise reverse order so safest (0) is on top of 1, etc.
  });

  return (
    <>
      {ordered.map(({ route, rank }) => {
        const isSelected = rank === selectedIndex;
        
        // Turn the confirmed route green, otherwise default to Google Maps blue
        const lineColor = isConfirmed && isSelected ? '#2e7d32' : '#1A73E8';
        
        // Hide alternative route lines when confirmed by dropping opacity to 0
        const lineOpacity = (isConfirmed && !isSelected) ? 0 : (isSelected ? 1.0 : 0.25);

        return (
          <Source
            key={route.tier}
            id={`route-alt-${rank}`}
            type="geojson"
            data={{ type: 'Feature', geometry: { type: 'LineString', coordinates: route.coords } }}
          >
            <Layer
              type="line"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': lineColor,
                'line-width': isSelected ? 6 : 4,
                'line-opacity': lineOpacity,
              }}
            />
          </Source>
        );
      })}
    </>
  );
}
