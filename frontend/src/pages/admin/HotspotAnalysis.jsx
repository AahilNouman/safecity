import React, { useState, useEffect } from 'react';
import { getHotspots } from '../../services/api';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  RefreshCw,
  MapPin,
  AlertTriangle,
  Layers,
  Compass,
  Activity,
  Flame,
  ShieldAlert
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const HotspotAnalysis = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const fetchHotspots = async () => {
    try {
      const res = await getHotspots();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setHotspots(list);
      if (list.length > 0 && !selectedHotspot) {
        setSelectedHotspot(list[0]);
      }
    } catch (error) {
      console.error(error);
      setHotspots([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHotspots();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHotspots();
  };

  if (loading) return <LoadingSpinner />;

  const clustersList = Array.isArray(hotspots) ? hotspots : [];
  const totalClusters = clustersList.length;
  const totalClusteredIncidents = clustersList.reduce((acc, h) => acc + (parseInt(h.incident_count) || 0), 0);
  const highestSeverityCluster = clustersList.reduce((max, h) => {
    const s = parseFloat(h.avg_severity) || 0;
    return s > max ? s : max;
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 5.5rem)', gap: '1.25rem' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: '0 0 0.25rem 0',
            fontFamily: 'var(--font-heading)'
          }}>
            DBSCAN Spatial Hotspot Intelligence
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Automated density-based clustering (Haversine metric, ε = 500m, min_samples = 3)
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.1rem',
            fontSize: '0.875rem'
          }}
        >
          <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
          {refreshing ? 'Re-computing DBSCAN...' : 'Re-compute Spatial Clusters'}
        </button>
      </div>

      {/* Main Grid: Map (2 cols) + Hotspot Drawer (1 col) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
        gap: '1.25rem',
        flex: 1,
        minHeight: 0
      }}>
        {/* Map View Container */}
        <div className="card" style={{
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Tactical map header indicator */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1000,
            background: 'rgba(10, 15, 29, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '0.4rem 0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', display: 'inline-block' }} />
            <span>Active Risk Zones: <strong>{totalClusters}</strong></span>
          </div>

          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={12}
            style={{ flex: 1, width: '100%', minHeight: '400px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {clustersList.map((hotspot) => {
              const lat = parseFloat(hotspot.centroid_lat);
              const lng = parseFloat(hotspot.centroid_lng);
              const radius = parseFloat(hotspot.radius_meters) || 500;
              const isSelected = selectedHotspot?.id === hotspot.id;
              const avgSev = parseFloat(hotspot.avg_severity) || 0.5;
              const isHigh = avgSev > 0.7;

              return (
                <Circle
                  key={hotspot.id}
                  center={[lat, lng]}
                  radius={radius}
                  pathOptions={{
                    color: isHigh ? '#e11d48' : '#d97706',
                    fillColor: isHigh ? '#f43f5e' : '#f59e0b',
                    fillOpacity: isSelected ? 0.45 : 0.22,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => setSelectedHotspot(hotspot)
                  }}
                >
                  <Popup>
                    <div style={{ color: '#0f172a', padding: '0.2rem' }}>
                      <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>
                        Cluster #{hotspot.cluster_label}
                      </strong>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                        <div>Dominant Threat: <strong>{hotspot.primary_category}</strong></div>
                        <div>Incidents: <strong>{hotspot.incident_count} reports</strong></div>
                        <div>Radius: <strong>{(radius / 1000).toFixed(2)} km</strong></div>
                        <div>Avg Severity: <strong>{avgSev.toFixed(2)} / 1.0</strong></div>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>
        </div>

        {/* Sidebar Analysis Panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          overflowY: 'auto',
          paddingRight: '0.25rem'
        }}>
          {/* Top Cluster Statistics Banner */}
          <div className="card" style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(14, 23, 38, 0.95) 100%)',
            border: '1px solid rgba(13, 148, 136, 0.3)'
          }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              color: 'var(--accent-hover)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Cluster Density Summary
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {totalClusters}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Hotspots
                </div>
              </div>

              <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-hover)' }}>
                  {totalClusteredIncidents}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Reports
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: highestSeverityCluster > 0.7 ? '#f87171' : '#fbbf24' }}>
                  {highestSeverityCluster.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Peak Risk
                </div>
              </div>
            </div>
          </div>

          {/* List of Detected Clusters */}
          {clustersList.map((hotspot) => {
            const isSelected = selectedHotspot?.id === hotspot.id;
            const avgSev = parseFloat(hotspot.avg_severity) || 0;
            const radiusKm = ((parseFloat(hotspot.radius_meters) || 500) / 1000).toFixed(2);
            const isHigh = avgSev > 0.7;

            return (
              <div
                key={hotspot.id}
                className="card"
                onClick={() => setSelectedHotspot(hotspot)}
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                  background: isSelected ? 'rgba(13, 148, 136, 0.08)' : 'var(--bg-surface)',
                  boxShadow: isSelected ? '0 0 16px rgba(13, 148, 136, 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: isHigh ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Flame size={15} color={isHigh ? '#f87171' : '#fbbf24'} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Cluster #{hotspot.cluster_label}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Center: {parseFloat(hotspot.centroid_lat).toFixed(3)}, {parseFloat(hotspot.centroid_lng).toFixed(3)}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-secondary)',
                    fontWeight: '600'
                  }}>
                    {radiusKm} km
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Primary Category</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{hotspot.primary_category}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Incident Density</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{hotspot.incident_count} reports</strong>
                  </div>
                </div>

                {/* Severity Score Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Mean Severity Index</span>
                    <strong style={{ color: isHigh ? '#f87171' : '#fbbf24' }}>
                      {avgSev.toFixed(2)}
                    </strong>
                  </div>
                  <div style={{
                    height: '6px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(10, avgSev * 100))}%`,
                      background: isHigh
                        ? 'linear-gradient(90deg, #e11d48 0%, #f43f5e 100%)'
                        : 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)',
                      borderRadius: '9999px'
                    }} />
                  </div>
                </div>
              </div>
            );
          })}

          {clustersList.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <ShieldAlert size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Active Clusters</h4>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                Spatial clustering requires at least 3 incidents within 500 meters. Click "Re-compute" to refresh with latest database records.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spinSlow 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HotspotAnalysis;
