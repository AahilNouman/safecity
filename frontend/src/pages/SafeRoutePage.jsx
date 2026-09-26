import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  analyzeRoutes,
  getRoutePresets,
  getHotspots
} from '../services/api';
import toast from 'react-hot-toast';
import {
  Navigation,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Compass,
  MapPin,
  Car,
  Footprints,
  ArrowRight,
  Info,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to auto-fit map bounds when routes change
function MapBoundsUpdater({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

const SafeRoutePage = () => {
  const [loading, setLoading] = useState(false);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Origin & Destination state
  const [origin, setOrigin] = useState({
    lat: 13.0400,
    lng: 77.6250,
    name: 'Nagawara, Bengaluru'
  });
  const [destination, setDestination] = useState({
    lat: 12.9850,
    lng: 77.6050,
    name: 'Shivajinagar, Bengaluru'
  });

  const [travelMode, setTravelMode] = useState('driving'); // 'driving' | 'walking'
  const [routeResult, setRouteResult] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [hotspots, setHotspots] = useState([]);

  // Fetch presets and initial hotspots
  useEffect(() => {
    getRoutePresets()
      .then(res => {
        if (res && res.data) {
          setPresets(res.data);
          setSelectedPreset(res.data[0]?.id || null);
        }
      })
      .catch(() => {});

    getHotspots()
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        setHotspots(list);
      })
      .catch(() => {});

    // Automatically trigger analysis for initial Nagawara -> Shivajinagar route
    handleAnalyzeRoute({
      lat: 13.0400,
      lng: 77.6250,
      name: 'Nagawara, Bengaluru'
    }, {
      lat: 12.9850,
      lng: 77.6050,
      name: 'Shivajinagar, Bengaluru'
    }, 'driving');
  }, []);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id);
    setOrigin(preset.origin);
    setDestination(preset.destination);
    handleAnalyzeRoute(preset.origin, preset.destination, travelMode);
  };

  const handleAnalyzeRoute = async (start = origin, end = destination, mode = travelMode) => {
    setLoading(true);
    try {
      const payload = {
        origin: start,
        destination: end,
        mode
      };
      const res = await analyzeRoutes(payload);
      if (res && res.data) {
        setRouteResult(res.data);
        setSelectedRouteId(res.data.recommended_route_id || res.data.routes[0]?.id);
        toast.success(`Evaluated ${res.data.routes.length} route options against verified incident density`);
      }
    } catch (err) {
      console.error('Route calculation error:', err);
      toast.error('Unable to compute real-time routes. Please check coordinates.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation is not supported by your browser');
    }
    toast.loading('Locating GPS position...', { id: 'gps-locating' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss('gps-locating');
        const userLoc = {
          lat: parseFloat(pos.coords.latitude.toFixed(5)),
          lng: parseFloat(pos.coords.longitude.toFixed(5)),
          name: 'My Current Location (GPS)'
        };
        setOrigin(userLoc);
        setSelectedPreset(null);
        toast.success('Origin set to current GPS location');
        handleAnalyzeRoute(userLoc, destination, travelMode);
      },
      (err) => {
        toast.dismiss('gps-locating');
        toast.error('Could not acquire GPS coordinates. Permission denied.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Compute map bounds for all routes
  const routes = routeResult?.routes || [];
  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const mapBounds = [];
  if (origin?.lat && origin?.lng) mapBounds.push([origin.lat, origin.lng]);
  if (destination?.lat && destination?.lng) mapBounds.push([destination.lat, destination.lng]);
  if (selectedRoute?.geometry?.coordinates) {
    selectedRoute.geometry.coordinates.forEach(([lng, lat]) => {
      mapBounds.push([lat, lng]);
    });
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(13, 148, 136, 0.12)', border: '1px solid rgba(13, 148, 136, 0.3)', color: 'var(--accent-hover)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          <Navigation size={13} />
          Spatial Threat Avoidance Navigation
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-heading)' }}>
          Safest Route Detection
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, maxWidth: '800px', lineHeight: 1.5 }}>
          Real-time GIS pathfinding that evaluates alternative avenues against SafeCity verified incidents and active DBSCAN danger clusters. Recommends corridors that minimize exposure to reported high-risk hotspots.
        </p>
      </div>

      {/* Control Station Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'var(--bg-surface)' }}>
        {/* Preset Selector Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Corridor Presets:
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: selectedPreset === p.id ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                  background: selectedPreset === p.id ? 'rgba(13, 148, 136, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedPreset === p.id ? 'var(--accent-hover)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{p.title}</span>
                {p.id === 'nagawara-shivajinagar' && (
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: '700' }}>
                    Govindpura Hotspot
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={handleUseCurrentLocation}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#60a5fa',
                transition: 'all 0.15s ease'
              }}
            >
              <Compass size={14} /> Use My GPS Location
            </button>
          </div>
        </div>

        {/* Origin & Destination Inputs Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr)) auto',
          gap: '1rem',
          alignItems: 'end'
        }}>
          {/* Origin */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Origin (Start Location)
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#34d399' }} />
              <input
                type="text"
                className="input"
                value={origin.name}
                onChange={e => setOrigin({ ...origin, name: e.target.value })}
                placeholder="e.g. Nagawara, Bengaluru"
                style={{ paddingLeft: '2rem' }}
              />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Lat: {origin.lat.toFixed(4)}, Lng: {origin.lng.toFixed(4)}
            </span>
          </div>

          {/* Destination */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Destination (Arrival Point)
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }} />
              <input
                type="text"
                className="input"
                value={destination.name}
                onChange={e => setDestination({ ...destination, name: e.target.value })}
                placeholder="e.g. Shivajinagar, Bengaluru"
                style={{ paddingLeft: '2rem' }}
              />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Lat: {destination.lat.toFixed(4)}, Lng: {destination.lng.toFixed(4)}
            </span>
          </div>

          {/* Action Button & Mode */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => { setTravelMode('driving'); handleAnalyzeRoute(origin, destination, 'driving'); }}
                title="Driving profile"
                style={{
                  padding: '0.55rem 0.75rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: travelMode === 'driving' ? 'var(--accent)' : 'transparent',
                  color: travelMode === 'driving' ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <Car size={16} />
              </button>
              <button
                onClick={() => { setTravelMode('walking'); handleAnalyzeRoute(origin, destination, 'walking'); }}
                title="Walking profile"
                style={{
                  padding: '0.55rem 0.75rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: travelMode === 'walking' ? 'var(--accent)' : 'transparent',
                  color: travelMode === 'walking' ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <Footprints size={16} />
              </button>
            </div>

            <button
              onClick={() => handleAnalyzeRoute(origin, destination, travelMode)}
              disabled={loading}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                whiteSpace: 'nowrap'
              }}
            >
              <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
              {loading ? 'Evaluating...' : 'Find Safer Route'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Map & Route Comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(340px, 1.2fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Interactive GIS Map */}
        <div className="card" style={{
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Tactical Overlay Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1000,
            background: 'rgba(10, 15, 29, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '0.5rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '4px', background: '#0D9488', borderRadius: '2px', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Lower-Risk Route</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '4px', background: '#E11D48', borderRadius: '2px', display: 'inline-block' }} />
              <span style={{ color: '#f87171', fontWeight: '600' }}>Higher-Risk Corridor</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.8)', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-muted)' }}>Red-Zone Hotspot</span>
            </div>
          </div>

          <div style={{ height: '520px', width: '100%', position: 'relative' }}>
            <MapContainer
              center={[origin.lat, origin.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mapBounds.length >= 2 && <MapBoundsUpdater bounds={mapBounds} />}

              {/* Render Hotspot / Red-zone Circles */}
              {(routeResult?.relevant_clusters || hotspots || []).map(h => {
                const lat = parseFloat(h.centroid?.lat || h.centroid_lat);
                const lng = parseFloat(h.centroid?.lng || h.centroid_lng);
                const radius = parseFloat(h.radius_meters) || 500;
                return (
                  <Circle
                    key={h.id}
                    center={[lat, lng]}
                    radius={radius}
                    pathOptions={{
                      color: '#E11D48',
                      fillColor: '#F43F5E',
                      fillOpacity: 0.28,
                      weight: 2,
                      dashArray: '4, 4'
                    }}
                  >
                    <Popup>
                      <div style={{ color: '#0f172a', padding: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e11d48', fontWeight: '700', fontSize: '0.85rem' }}>
                          <AlertTriangle size={14} /> Red-Zone Hotspot
                        </div>
                        <strong style={{ fontSize: '0.95rem' }}>{h.label || `Cluster #${h.cluster_label}`}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
                          <div>Category: <strong>{h.category || h.primary_category}</strong></div>
                          <div>Radius: <strong>{(radius / 1000).toFixed(2)} km</strong></div>
                          <div>Incident Count: <strong>{h.incident_count} verified reports</strong></div>
                        </div>
                      </div>
                    </Popup>
                  </Circle>
                );
              })}

              {/* Render Alternative Routes */}
              {routes.map((rt) => {
                const isSelected = rt.id === selectedRouteId;
                const isRecommended = rt.is_recommended;
                const latlngs = (rt.geometry?.coordinates || []).map(([cLng, cLat]) => [cLat, cLng]);

                const color = isRecommended ? '#0D9488' : '#E11D48';
                const weight = isSelected ? 6 : 4;
                const opacity = isSelected ? 0.95 : 0.45;

                return (
                  <Polyline
                    key={rt.id}
                    positions={latlngs}
                    pathOptions={{
                      color,
                      weight,
                      opacity,
                      dashArray: isRecommended ? null : '6, 6'
                    }}
                    eventHandlers={{
                      click: () => setSelectedRouteId(rt.id)
                    }}
                  />
                );
              })}

              {/* Origin Marker */}
              <Marker position={[origin.lat, origin.lng]}>
                <Popup>
                  <div style={{ color: '#0f172a' }}>
                    <strong style={{ color: '#059669' }}>Origin</strong><br/>
                    {origin.name}
                  </div>
                </Popup>
              </Marker>

              {/* Destination Marker */}
              <Marker position={[destination.lat, destination.lng]}>
                <Popup>
                  <div style={{ color: '#0f172a' }}>
                    <strong style={{ color: '#e11d48' }}>Destination</strong><br/>
                    {destination.name}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Map Footer Bar */}
          <div style={{
            padding: '0.85rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span>Showing real-time OpenStreetMap / OSRM routing</span>
            <span>Click any route polyline or card to inspect metrics</span>
          </div>
        </div>

        {/* Right Column: Comparative Route Audit & Rationale */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Header Summary Banner */}
          {routeResult && (
            <div className="card" style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(14, 23, 38, 0.95) 100%)',
              border: '1px solid rgba(13, 148, 136, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <ShieldCheck size={20} color="var(--accent-hover)" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Threat Mitigation Assessment
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-hover)' }}>
                  {routeResult.risk_reduction_pct || 0}%
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Lower Incident Exposure on Recommended Route
                </span>
              </div>

              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                Evaluated against active database clusters. Compares direct thoroughfares against verified well-lit avenues.
              </p>
            </div>
          )}

          {/* List of Evaluated Routes */}
          {routes.map(r => {
            const isSelected = r.id === selectedRouteId;
            const isRecommended = r.is_recommended;
            const isHigh = r.risk_level === 'HIGH';

            return (
              <div
                key={r.id}
                className="card"
                onClick={() => setSelectedRouteId(r.id)}
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  border: isSelected
                    ? (isRecommended ? '2px solid var(--accent)' : '2px solid #e11d48')
                    : '1px solid var(--border-subtle)',
                  background: isSelected
                    ? (isRecommended ? 'rgba(13, 148, 136, 0.08)' : 'rgba(239, 68, 68, 0.08)')
                    : 'var(--bg-surface)',
                  boxShadow: isSelected ? '0 4px 20px rgba(0, 0, 0, 0.4)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Route Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: isRecommended ? 'rgba(13, 148, 136, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: isRecommended ? 'var(--accent-hover)' : '#f87171',
                        border: isRecommended ? '1px solid rgba(13, 148, 136, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
                      }}>
                        {isRecommended ? <ShieldCheck size={13} /> : <AlertTriangle size={13} />}
                        {r.tag}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          (Viewing on map)
                        </span>
                      )}
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {r.name}
                    </h4>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: isRecommended ? '#34d399' : '#f87171' }}>
                      {r.risk_score}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/100</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                      Risk Index ({r.risk_level})
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  marginBottom: '0.85rem',
                  textAlign: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Distance</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{r.distance_km} km</strong>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Est. Travel</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{r.duration_min} min</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Red Zones</span>
                    <strong style={{ fontSize: '0.9rem', color: r.hotspots_count > 0 ? '#f87171' : '#34d399' }}>
                      {r.hotspots_count} active
                    </strong>
                  </div>
                </div>

                {/* Hotspot Intersections if any */}
                {r.hotspots_intersected && r.hotspots_intersected.length > 0 && (
                  <div style={{
                    padding: '0.6rem 0.75rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '8px',
                    marginBottom: '0.85rem',
                    fontSize: '0.8rem',
                    color: '#fca5a5'
                  }}>
                    <strong style={{ display: 'block', color: '#f87171', marginBottom: '0.2rem' }}>
                      ⚠️ Crosses High-Density Risk Cluster:
                    </strong>
                    {r.hotspots_intersected.map(h => (
                      <div key={h.cluster_id}>
                        • {h.label}: {h.primary_category} ({h.incident_count} reports, {(h.radius_meters/1000).toFixed(2)}km radius)
                      </div>
                    ))}
                  </div>
                )}

                {/* Explanation Rationale */}
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                    Route Safety Rationale:
                  </strong>
                  {r.safety_explanation}
                </div>
              </div>
            );
          })}

          {/* Responsible System Disclaimer */}
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <Info size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <strong>Advisory Notice:</strong> SafeCity recommends routes based on verified community incident density and spatial clustering algorithms. Because conditions fluctuate dynamically, this is categorized as a <strong>“Lower-Risk Route”</strong> rather than an absolute guarantee. Always remain aware of your surroundings.
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spinIcon {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spinIcon 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SafeRoutePage;
