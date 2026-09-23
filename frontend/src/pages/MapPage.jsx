import React, { useState, useEffect } from 'react';
import { getMapIncidents, getHotspots } from '../services/api';
import SafetyMap from '../components/Map/SafetyMap';
import toast from 'react-hot-toast';
import { Layers } from 'lucide-react';

const CATEGORIES = [
  'ALL', 'THEFT', 'ASSAULT', 'HARASSMENT', 'VANDALISM', 
  'SUSPICIOUS_ACTIVITY', 'ROAD_HAZARD', 'OTHER'
];

const MapPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('markers'); // markers or heatmap
  const [filters, setFilters] = useState({
    category: 'ALL',
    days: '7'
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
      toast.error('Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      {/* Filters Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <select 
          className="select" 
          style={{ width: 'auto' }}
          value={filters.category}
          onChange={e => setFilters({...filters, category: e.target.value})}
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select 
          className="select" 
          style={{ width: 'auto' }}
          value={filters.days}
          onChange={e => setFilters({...filters, days: e.target.value})}
        >
          <option value="1">Last 24 Hours</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="">All Time</option>
        </select>

        <button 
          className={`btn ${viewMode === 'heatmap' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setViewMode(viewMode === 'heatmap' ? 'markers' : 'heatmap')}
          style={{ marginLeft: 'auto' }}
        >
          <Layers size={18} />
          {viewMode === 'heatmap' ? 'Show Markers' : 'Show Heatmap'}
        </button>
      </div>

      {/* Map Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000, background: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            Loading data...
          </div>
        )}
        <SafetyMap incidents={incidents} hotspots={hotspots} viewMode={viewMode} />
        
        {/* Legend */}
        {viewMode === 'markers' && (
          <div style={{ position: 'absolute', bottom: '2rem', right: '1rem', zIndex: 1000, background: 'white', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', fontSize: '0.875rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Legend</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#D97706' }}></span>Theft</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#E11D48' }}></span>Assault</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7C3AED' }}></span>Harassment</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2563EB' }}></span>Vandalism</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669' }}></span>Suspicious Activity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0D9488' }}></span>Road Hazard</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
