import React, { useState, useEffect } from 'react';
import { getIncidents } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
import EmptyState from '../components/Common/EmptyState';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const SafetyFeed = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const CATEGORIES = ['ALL', 'THEFT', 'ASSAULT', 'HARASSMENT', 'VANDALISM', 'SUSPICIOUS_ACTIVITY', 'ROAD_HAZARD', 'OTHER'];

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const params = { status: 'VERIFIED', limit: 50 };
        if (categoryFilter !== 'ALL') params.category = categoryFilter;
        
        const data = await getIncidents(params);
        setIncidents(data.incidents || []);
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [categoryFilter]);

  const getSeverityColor = (level) => {
    if (level >= 8) return 'var(--rose)';
    if (level >= 5) return 'var(--amber)';
    return 'var(--emerald)';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--navy)' }}>Community Safety Feed</h1>
          <p style={{ color: 'var(--text-muted)' }}>Verified, anonymized incident reports from your community.</p>
        </div>
        <select 
          className="select" 
          style={{ width: 'auto' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : incidents.length === 0 ? (
        <EmptyState 
          icon={ShieldAlert}
          title="No incidents found"
          description="There are no verified incidents matching your criteria."
        />
      ) : (
        <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
          {incidents.map(incident => (
            <div key={incident._id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: 'var(--blue)', color: 'white' }}>
                  {incident.category.replace('_', ' ')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  {formatDistanceToNow(new Date(incident.incidentDate), { addSuffix: true })}
                </span>
              </div>
              
              <p style={{ fontSize: '1.125rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>
                {/* Simulated Anonymization since backend provides exact details */}
                A {incident.category.toLowerCase().replace('_', ' ')} incident was reported in the community.
              </p>
              
              <div style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius)', color: 'var(--text-body)', fontSize: '0.95rem', borderLeft: '3px solid var(--border)' }}>
                "{incident.description}"
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: getSeverityColor(incident.severityLevel), fontWeight: '600' }}>
                  <AlertTriangle size={16} />
                  Severity Level: {incident.severityLevel}/10
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafetyFeed;
