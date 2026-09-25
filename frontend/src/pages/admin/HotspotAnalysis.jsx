import React, { useState, useEffect } from 'react';
import { getHotspots } from '../../services/api';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import { RefreshCw, MapPin, AlertTriangle } from 'lucide-react';
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: 'var(--navy)', margin: '0 0 0.25rem 0' }}>Hotspot Analysis</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>DBSCAN cluster visualization of recent high-severity incidents</p>
        </div>
        <button onClick={handleRefresh} className="btn btn-outline" disabled={refreshing}>
          <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
          {refreshing ? 'Computing...' : 'Re-compute Clusters'}
        </button>
      </div>

      <div className="grid md:grid-cols-3" style={{ flex: 1, gap: '1.5rem', minHeight: 0 }}>
        {/* Map View */}
        <div className="card md:col-span-2" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <MapContainer 
            center={[12.9716, 77.5946]} 
            zoom={12} 
            style={{ flex: 1, width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {(Array.isArray(hotspots) ? hotspots : []).map((hotspot) => (
              <Circle
                key={hotspot.id}
                center={[parseFloat(hotspot.centroid_lat), parseFloat(hotspot.centroid_lng)]}
                radius={parseFloat(hotspot.radius_meters)}
                pathOptions={{
                  color: '#E11D48',
                  fillColor: '#E11D48',
                  fillOpacity: selectedHotspot?.id === hotspot.id ? 0.4 : 0.2,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSelectedHotspot(hotspot)
                }}
              >
                <Popup>
                  <strong>Cluster {hotspot.cluster_label}</strong><br/>
                  Incidents: {hotspot.incident_count}
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <div className="card" style={{ background: 'var(--navy)', color: 'white' }}>
            <h3 style={{ color: 'white', margin: '0 0 1rem 0' }}>Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Active Hotspots</span>
              <strong style={{ fontSize: '1.25rem' }}>{(hotspots || []).length}</strong>
            </div>
          </div>

          {(Array.isArray(hotspots) ? hotspots : []).map(hotspot => (
            <div 
              key={hotspot.id} 
              className="card"
              style={{ 
                cursor: 'pointer',
                borderColor: selectedHotspot?.id === hotspot.id ? 'var(--rose)' : 'var(--border)',
                borderWidth: selectedHotspot?.id === hotspot.id ? '2px' : '1px'
              }}
              onClick={() => setSelectedHotspot(hotspot)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--rose)" /> Cluster {hotspot.cluster_label}
                </h4>
                <span className="badge" style={{ background: 'var(--bg-page)', color: 'var(--text-dark)' }}>
                  {(parseFloat(hotspot.radius_meters) / 1000).toFixed(2)}km radius
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.25rem 0' }}>Primary Category</p>
                  <strong>{hotspot.primary_category}</strong>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.25rem 0' }}>Incidents</p>
                  <strong>{hotspot.incident_count} reports</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.25rem 0' }}>Avg Severity</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, height: '8px', background: 'var(--bg-page)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(parseFloat(hotspot.avg_severity) / 1) * 100}%`, background: parseFloat(hotspot.avg_severity) > 0.7 ? 'var(--rose)' : 'var(--amber)' }} />
                    </div>
                    <span style={{ fontWeight: 'bold' }}>{parseFloat(hotspot.avg_severity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {hotspots.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <AlertTriangle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No active hotspots identified based on current data.</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        .md\\:col-span-2 { grid-column: span 2 / span 2; }
      `}</style>
    </div>
  );
};

export default HotspotAnalysis;
