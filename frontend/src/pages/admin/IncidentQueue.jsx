import React, { useState, useEffect } from 'react';
import { getAdminIncidents } from '../../services/api';
import { Link } from 'react-router-dom';
import { Eye, Filter, ShieldAlert, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const IncidentQueue = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
  });

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await getAdminIncidents(filters);
      const list = Array.isArray(data) ? data : (data?.data || data?.incidents || []);
      setIncidents(list);
    } catch (error) {
      console.error('Failed to fetch admin incidents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [filters]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#fde047',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <Clock size={11} /> Pending
          </span>
        );
      case 'VERIFIED':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#6ee7b7',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle2 size={11} /> Verified
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            background: 'rgba(244, 63, 94, 0.12)',
            color: '#fda4af',
            border: '1px solid rgba(244, 63, 94, 0.3)'
          }}>
            <XCircle size={11} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const categoryMap = {
    1: 'Harassment',
    2: 'Stalking',
    3: 'Threat',
    4: 'Unsafe Area',
    5: 'Poor Lighting',
    6: 'Suspicious Activity',
    7: 'Other'
  };

  return (
    <div>
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.25rem' }}>
            Incident Audit Queue
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
            Moderate, categorize, and verify crowdsourced reports submitted by citizens.
          </p>
        </div>
        
        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select 
            className="select" 
            style={{ width: 'auto', padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Review Statuses</option>
            <option value="PENDING">Pending Triage</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select 
            className="select" 
            style={{ width: 'auto', padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
            value={filters.category}
            onChange={e => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="Harassment">Harassment</option>
            <option value="Stalking">Stalking</option>
            <option value="Threat">Threat</option>
            <option value="Unsafe Area">Unsafe Area</option>
            <option value="Poor Lighting">Poor Lighting</option>
            <option value="Suspicious Activity">Suspicious Activity</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Incident Date</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Review</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => {
                  const repId = inc.public_report_id || inc.reportId || `SC-${inc.id}`;
                  const cat = inc.final_category || inc.category_name || categoryMap[inc.category_id] || inc.category || 'Incident';
                  const sevLevel = inc.severity_level || inc.severityLevel || 'MEDIUM';

                  return (
                    <tr key={inc.id || inc._id || repId}>
                      <td style={{ fontFamily: 'monospace', fontWeight: '600', color: '#2dd4bf' }}>
                        {repId}
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {new Date(inc.incident_time || inc.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.55rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          color: '#ffffff'
                        }}>
                          {cat}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: sevLevel === 'HIGH' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: sevLevel === 'HIGH' ? '#fda4af' : '#fde047',
                          border: '1px solid ' + (sevLevel === 'HIGH' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)')
                        }}>
                          {sevLevel === 'HIGH' && <AlertTriangle size={12} />}
                          {sevLevel}
                        </span>
                      </td>
                      <td>{getStatusBadge(inc.verification_status || inc.status)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link 
                          to={`/admin/incidents/${inc.id || inc._id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            background: 'rgba(13, 148, 136, 0.15)',
                            border: '1px solid rgba(13, 148, 136, 0.3)',
                            color: '#2dd4bf',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            textDecoration: 'none'
                          }}
                        >
                          <Eye size={13} /> Audit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                      No incidents found matching current filter criteria.
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
