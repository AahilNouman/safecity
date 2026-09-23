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
    const list = Array.isArray(data) ? data : (data?.data || []);
    if (!map || !list || list.length === 0) return;
    if (typeof L.heatLayer !== 'function') {
      console.warn('L.heatLayer not available');
      return;
    }

    // Remove existing layer if any
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
  const incidentsList = Array.isArray(incidents) ? incidents : (incidents?.data || []);
  const hotspotsList = Array.isArray(hotspots) ? hotspots : (hotspots?.data || []);

  return (
    <div style={{ height: '100%', width: '100%', zIndex: 1 }}>
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
          .map((incident) => (
          <CircleMarker
            key={incident.public_report_id || incident.id}
            center={[parseFloat(incident.approx_latitude || incident.latitude), parseFloat(incident.approx_longitude || incident.longitude)]}
            radius={8}
            pathOptions={{
              color: CATEGORY_COLORS[incident.display_category || incident.category_id] || CATEGORY_COLORS.OTHER,
              fillColor: CATEGORY_COLORS[incident.display_category || incident.category_id] || CATEGORY_COLORS.OTHER,
              fillOpacity: 0.7,
              weight: 2
            }}
          >
            <Popup>
              <div>
                <strong>{incident.display_category || incident.category_id}</strong>
                <p style={{ margin: '0.25rem 0' }}>Severity: {incident.severity_level}</p>
                <p style={{ margin: '0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(incident.incident_time || incident.created_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {viewMode === 'markers' && hotspotsList
          .filter(hotspot => hotspot.centroid_lat && hotspot.centroid_lng)
          .map((hotspot) => (
          <Circle
            key={hotspot.id}
            center={[parseFloat(hotspot.centroid_lat), parseFloat(hotspot.centroid_lng)]}
            radius={parseFloat(hotspot.radius_meters)}
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
                <p>Incidents: {hotspot.incident_count}</p>
                <p>Primary Type: {hotspot.primary_category}</p>
                <p>Avg Severity: {parseFloat(hotspot.avg_severity || 0).toFixed(1)}</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default SafetyMap;
