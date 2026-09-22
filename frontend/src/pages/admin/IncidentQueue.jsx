import React, { useState, useEffect } from 'react';
import { getAdminIncidents } from '../../services/api';
import { Link } from 'react-router-dom';
import { Eye, Filter } from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const IncidentQueue = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'PENDING',
    category: '',
  });

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await getAdminIncidents(filters);
      setIncidents(data.incidents || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [filters]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <span className="badge badge-pending">Pending</span>;
      case 'VERIFIED': return <span className="badge badge-verified">Verified</span>;
      case 'REJECTED': return <span className="badge badge-rejected">Rejected</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--navy)', margin: 0 }}>Incident Queue</h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            className="select" 
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select 
            className="select" 
            value={filters.category}
            onChange={e => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="THEFT">Theft</option>
            <option value="ASSAULT">Assault</option>
            <option value="HARASSMENT">Harassment</option>
            <option value="VANDALISM">Vandalism</option>
            <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
            <option value="ROAD_HAZARD">Road Hazard</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-page)' }}>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>ID</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Date</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Category</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Severity</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{inc.reportId}</td>
                    <td style={{ padding: '1rem' }}>{new Date(inc.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>{inc.category}</td>
                    <td style={{ padding: '1rem' }}>{inc.severityLevel}/10</td>
                    <td style={{ padding: '1rem' }}>{getStatusBadge(inc.status)}</td>
                    <td style={{ padding: '1rem' }}>
                      <Link to={`/admin/incidents/${inc._id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                        <Eye size={16} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No incidents found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentQueue;
