import React, { useState, useEffect } from 'react';
import { getMapIncidents, getHotspots } from '../services/api';
import SafetyMap from '../components/Map/SafetyMap';
import toast from 'react-hot-toast';
import { Layers, MapPin, Filter, Flame, Eye } from 'lucide-react';

const CATEGORIES = [
  'ALL',
  'Harassment',
  'Stalking',
  'Threat',
  'Unsafe Area',
  'Poor Lighting',
  'Suspicious Activity',
  'Other'
];

const MapPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('markers'); // markers | heatmap
  const [filters, setFilters] = useState({
    category: 'ALL',
    days: '30'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category !== 'ALL') params.category = filters.category;
      if (filters.days) {
        const date = new Date();
        date.setDate(date.getDate() - parseInt(filters.days));
        params.startDate = date.toISOString();
      }

      const [incidentsData, hotspotsData] = await Promise.all([
        getMapIncidents(params),
        getHotspots()
      ]);

      const incList = Array.isArray(incidentsData) ? incidentsData : (incidentsData?.data || []);
      const hotList = Array.isArray(hotspotsData) ? hotspotsData : (hotspotsData?.data || []);

      setIncidents(incList);
      setHotspots(hotList);
    } catch (err) {
      toast.error('Failed to load map incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4.25rem)', background: '#0a0f1d' }}>
      
      {/* Tactical GIS Control Toolbar */}
      <div style={{
        background: '#0f172a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        gap: '0.85rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        zIndex: 10
      }}>
        {/* Title / Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginRight: '0.5rem' }}>
          <MapPin size={17} color="#14b8a6" />
          <span style={{ fontFamily: 'var(--font-heading)', color: '#ffffff', fontWeight: '700', fontSize: '0.95rem' }}>
            Bengaluru Safety Map
          </span>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <select 
            className="select" 
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem', height: '36px' }}
            value={filters.category}
            onChange={e => setFilters({...filters, category: e.target.value})}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Incident Types' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Time Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <select 
            className="select" 
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem', height: '36px' }}
            value={filters.days}
            onChange={e => setFilters({...filters, days: e.target.value})}
          >
            <option value="1">Last 24 Hours</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="">All Historical Time</option>
          </select>
        </div>

        {/* Count summary */}
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          <span><strong>{incidents.length}</strong> active markers</span>
        </div>

        {/* View Mode Toggle Button */}
        <button 
          onClick={() => setViewMode(viewMode === 'heatmap' ? 'markers' : 'heatmap')}
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.95rem',
            borderRadius: '8px',
            background: viewMode === 'heatmap' ? '#0d9488' : 'rgba(255, 255, 255, 0.08)',
            border: '1px solid ' + (viewMode === 'heatmap' ? 'transparent' : 'rgba(255, 255, 255, 0.16)'),
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {viewMode === 'heatmap' ? <Eye size={15} /> : <Flame size={15} color="#f59e0b" />}
          {viewMode === 'heatmap' ? 'Switch to Point Markers' : 'Switch to DBSCAN Heatmap'}
        </button>
      </div>

      {/* Main Map Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 1000,
            background: '#10192d',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            color: '#2dd4bf',
            padding: '0.45rem 0.95rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '600',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
          }}>
            Synchronizing spatial layers...
          </div>
        )}
        
        <SafetyMap incidents={incidents} hotspots={hotspots} viewMode={viewMode} />
        
        {/* Floating Legend */}
        {viewMode === 'markers' && (
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 1000,
            background: 'rgba(16, 25, 45, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            fontSize: '0.78rem',
            color: '#cbd5e1',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            minWidth: '180px'
          }}>
            <div style={{ fontWeight: '700', color: '#ffffff', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem' }}>
              Incident Legend
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }} /> Harassment
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} /> Stalking / Threat
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }} /> Poor Lighting
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }} /> Unsafe Area
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.2rem', paddingTop: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ width: '12px', height: '0px', borderTop: '2px dashed #e11d48' }} /> Hotspot Cluster
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
