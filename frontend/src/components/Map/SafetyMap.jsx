import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const CATEGORY_COLORS = {
  'THEFT': '#D97706',
  'ASSAULT': '#E11D48',
  'HARASSMENT': '#7C3AED',
  'VANDALISM': '#2563EB',
  'SUSPICIOUS_ACTIVITY': '#059669',
  'ROAD_HAZARD': '#0D9488',
  'OTHER': '#475569'
};

const HeatmapLayer = ({ data }) => {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map || !data || data.length === 0) return;

    // Remove existing layer if any
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const points = data.map(point => [point.location.coordinates[1], point.location.coordinates[0], point.severityLevel * 0.2]); // lat, lng, intensity

    layerRef.current = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 15,
      max: 1.0,
      gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
    }).addTo(map);

    return () => {
      if (map && layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, data]);

  return null;
};

const SafetyMap = ({ incidents = [], hotspots = [], viewMode = 'markers', center = [12.9716, 77.5946], zoom = 12 }) => {
  return (
    <div style={{ height: '100%', width: '100%', zIndex: 1 }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {viewMode === 'heatmap' && (
          <HeatmapLayer data={incidents} />
        )}

        {viewMode === 'markers' && incidents.map((incident) => (
          <CircleMarker
            key={incident._id}
            center={[incident.location.coordinates[1], incident.location.coordinates[0]]}
            radius={8}
            pathOptions={{
              color: CATEGORY_COLORS[incident.category] || CATEGORY_COLORS.OTHER,
              fillColor: CATEGORY_COLORS[incident.category] || CATEGORY_COLORS.OTHER,
              fillOpacity: 0.7,
              weight: 2
            }}
          >
            <Popup>
              <div>
                <strong>{incident.category}</strong>
                <p style={{ margin: '0.25rem 0' }}>Severity: {incident.severityLevel}</p>
                <p style={{ margin: '0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(incident.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {viewMode === 'markers' && hotspots.map((hotspot) => (
          <Circle
            key={hotspot.clusterId}
            center={[hotspot.center.coordinates[1], hotspot.center.coordinates[0]]}
            radius={hotspot.radius * 1000} // Convert km to meters
            pathOptions={{
              color: '#E11D48',
              fillColor: '#E11D48',
              fillOpacity: 0.2,
              weight: 2,
              dashArray: '5, 5'
            }}
          >
            <Popup>
              <div>
                <strong>Hotspot Cluster</strong>
                <p>Incidents: {hotspot.incidentCount}</p>
                <p>Primary Type: {hotspot.primaryCategory}</p>
                <p>Avg Severity: {hotspot.averageSeverity.toFixed(1)}</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default SafetyMap;
