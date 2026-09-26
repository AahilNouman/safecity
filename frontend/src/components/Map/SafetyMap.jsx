import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const CATEGORY_COLORS = {
  'harassment': '#f97316',
  'stalking': '#f43f5e',
  'threat': '#e11d48',
  'unsafe area': '#eab308',
  'poor lighting': '#06b6d4',
  'suspicious activity': '#8b5cf6',
  'other': '#64748b'
};

const getCategoryColor = (cat) => {
  if (!cat) return '#0d9488';
  const normalized = cat.toString().toLowerCase();
  return CATEGORY_COLORS[normalized] || '#0d9488';
};

const HeatmapLayer = ({ data }) => {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    const list = Array.isArray(data) ? data : (data?.data || []);
    if (!map || !list || list.length === 0) return;
    if (typeof L.heatLayer !== 'function') {
      console.warn('L.heatLayer not available');
      return;
    }

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const points = list
      .filter(point => (point.approx_latitude || point.latitude) && (point.approx_longitude || point.longitude))
      .map(point => [
        parseFloat(point.approx_latitude || point.latitude), 
        parseFloat(point.approx_longitude || point.longitude), 
        (point.severity_level === 'HIGH' ? 1.0 : point.severity_level === 'MEDIUM' ? 0.6 : 0.2)
      ]);

    layerRef.current = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 15,
      max: 1.0,
      gradient: { 0.4: '#0d9488', 0.6: '#06b6d4', 0.7: '#f59e0b', 0.8: '#f97316', 1.0: '#e11d48' }
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
  const incidentsList = Array.isArray(incidents) ? incidents : (incidents?.data || []);
  const hotspotsList = Array.isArray(hotspots) ? hotspots : (hotspots?.data || []);

  return (
    <div style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {viewMode === 'heatmap' && (
          <HeatmapLayer data={incidentsList} />
        )}

        {viewMode === 'markers' && incidentsList
          .filter(incident => (incident.approx_latitude || incident.latitude) && (incident.approx_longitude || incident.longitude))
          .map((incident) => {
            const catName = incident.display_category || incident.category || incident.category_name || 'Incident';
            const color = getCategoryColor(catName);

            return (
              <CircleMarker
                key={incident.public_report_id || incident.id}
                center={[parseFloat(incident.approx_latitude || incident.latitude), parseFloat(incident.approx_longitude || incident.longitude)]}
                radius={7}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ padding: '0.25rem', minWidth: '160px', color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                      <strong style={{ fontSize: '0.9rem' }}>{catName}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.35rem' }}>
                      ID: <code>{incident.public_report_id || `SC-${incident.id}`}</code>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: incident.severity_level === 'HIGH' ? '#e11d48' : '#0d9488' }}>
                      Severity: {incident.severity_level || 'MEDIUM'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                      {new Date(incident.incident_time || incident.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {viewMode === 'markers' && hotspotsList
          .filter(hotspot => hotspot.centroid_lat && hotspot.centroid_lng)
          .map((hotspot) => (
            <Circle
              key={hotspot.id}
              center={[parseFloat(hotspot.centroid_lat), parseFloat(hotspot.centroid_lng)]}
              radius={parseFloat(hotspot.radius_meters || 450)}
              pathOptions={{
                color: '#e11d48',
                fillColor: '#e11d48',
                fillOpacity: 0.15,
                weight: 1.5,
                dashArray: '6, 6'
              }}
            >
              <Popup>
                <div style={{ padding: '0.25rem', minWidth: '170px', color: '#0f172a' }}>
                  <strong style={{ color: '#e11d48', fontSize: '0.9rem' }}>DBSCAN Hotspot Cluster</strong>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    <strong>Incidents:</strong> {hotspot.incident_count}
                  </div>
                  <div style={{ fontSize: '0.8rem' }}>
                    <strong>Primary:</strong> {hotspot.primary_category || 'Harassment'}
                  </div>
                  <div style={{ fontSize: '0.8rem' }}>
                    <strong>Avg Severity:</strong> {parseFloat(hotspot.avg_severity || 0.6).toFixed(2)}
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}
      </MapContainer>
    </div>
  );
};

export default SafetyMap;
