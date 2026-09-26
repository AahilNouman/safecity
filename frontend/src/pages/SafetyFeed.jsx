import React, { useState, useEffect } from 'react';
import { getIncidents } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import {
  ShieldAlert,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Filter,
  ShieldCheck,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const SafetyFeed = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);

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

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const params = { status: 'VERIFIED', limit: 100 };
      if (categoryFilter !== 'ALL') {
        params.category = categoryFilter;
      }

      const res = await getIncidents(params);
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.incidents)
        ? res.incidents
        : Array.isArray(res)
        ? res
        : [];

      setIncidents(list);
      setTotalCount(res?.meta?.total || list.length);
    } catch (error) {
      console.error('Error fetching safety feed:', error);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [categoryFilter]);

  const getSeverityStyle = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
        return {
          bg: 'rgba(225, 29, 72, 0.15)',
          border: 'rgba(225, 29, 72, 0.35)',
          color: '#fda4af'
        };
      case 'MEDIUM':
        return {
          bg: 'rgba(234, 179, 8, 0.15)',
          border: 'rgba(234, 179, 8, 0.35)',
          color: '#fde047'
        };
      default:
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.35)',
          color: '#6ee7b7'
        };
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'harassment':
        return '#f97316';
      case 'stalking':
        return '#ef4444';
      case 'threat':
        return '#dc2626';
      case 'unsafe area':
        return '#eab308';
      case 'poor lighting':
        return '#06b6d4';
      case 'suspicious activity':
        return '#8b5cf6';
      default:
        return '#2dd4bf';
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const cat = (inc.category || inc.category_name || '').toLowerCase();
    const desc = (inc.description || '').toLowerCase();
    const repId = (inc.public_report_id || '').toLowerCase();
    return cat.includes(query) || desc.includes(query) || repId.includes(query);
  });

  return (
    <div style={{
      minHeight: 'calc(100vh - 4.5rem)',
      background: 'radial-gradient(ellipse at top, #04252d 0%, #02171c 100%)',
      padding: '2.5rem 1rem 4rem',
      color: '#e2e8f0'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(13, 148, 136, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <ShieldCheck size={26} color="#ffffff" strokeWidth={2.4} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>
                  Community Safety Feed
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                  Verified, anonymized civic incident reports from Bengaluru
                </p>
              </div>
            </div>

            <button
              onClick={fetchFeed}
              disabled={loading}
              title="Refresh feed"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: '#2dd4bf',
                padding: '0.5rem 0.95rem',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: loading ? 'wait' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {/* Search & Category Filter Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search descriptions, categories, or Report IDs..."
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.3rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
              />
            </div>

            {/* Category Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="#94a3b8" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{
                  padding: '0.6rem 1rem',
                  background: '#042831',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '10px',
                  color: '#2dd4bf',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#042831', color: '#ffffff' }}>
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981'
            }} />
            <span>Showing <strong>{filteredIncidents.length}</strong> verified public incidents</span>
            {categoryFilter !== 'ALL' && (
              <span style={{
                background: 'rgba(45, 212, 191, 0.1)',
                color: '#2dd4bf',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid rgba(45, 212, 191, 0.25)',
                fontSize: '0.75rem'
              }}>
                Filtered by {categoryFilter}
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <LoadingSpinner />
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '1rem' }}>
              Loading verified community incidents...
            </p>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div style={{
            background: 'rgba(5, 38, 46, 0.65)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            maxWidth: '550px',
            margin: '2rem auto'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(45, 212, 191, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: '#2dd4bf'
            }}>
              <ShieldAlert size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              No Incidents Found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              {categoryFilter !== 'ALL' || searchQuery
                ? 'There are no verified incidents matching your current search or category filter.'
                : 'No verified incidents currently on record. New verified reports will appear here.'}
            </p>
            {(categoryFilter !== 'ALL' || searchQuery) && (
              <button
                onClick={() => { setCategoryFilter('ALL'); setSearchQuery(''); }}
                style={{
                  background: 'rgba(45, 212, 191, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                  color: '#2dd4bf',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredIncidents.map((incident) => {
              const sev = getSeverityStyle(incident.severity_level);
              const catName = incident.category || incident.category_name || incident.final_category || 'Incident';
              const catColor = getCategoryColor(catName);

              return (
                <div
                  key={incident.id}
                  style={{
                    background: 'rgba(5, 38, 46, 0.8)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    transition: 'transform 0.2s, border-color 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {/* Top Meta Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {/* Category Badge */}
                      <span style={{
                        background: `${catColor}20`,
                        border: `1px solid ${catColor}50`,
                        color: catColor,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.775rem',
                        fontWeight: '700',
                        letterSpacing: '0.02em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: catColor }} />
                        {catName}
                      </span>

                      {/* Public Report ID */}
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#94a3b8',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace'
                      }}>
                        {incident.public_report_id || `SC-2026-${incident.id}`}
                      </span>

                      {/* Verified Badge */}
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#6ee7b7',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <CheckCircle2 size={12} color="#10b981" /> Verified
                      </span>
                    </div>

                    {/* Relative Time */}
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.8rem',
                      color: '#94a3b8'
                    }}>
                      <Clock size={13} />
                      {formatDistanceToNow(new Date(incident.incident_time || incident.created_at || new Date()), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Incident Description */}
                  <p style={{
                    color: '#e2e8f0',
                    fontSize: '0.975rem',
                    lineHeight: 1.6,
                    margin: '0 0 1.25rem 0'
                  }}>
                    {incident.description || 'An incident was reported and verified in the community.'}
                  </p>

                  {/* Footer Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.8rem',
                    color: '#94a3b8'
                  }}>
                    {/* Location Privacy notice */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} color="#2dd4bf" />
                      <span>
                        Bengaluru Urban Area {incident.approx_lat ? `(~${incident.approx_lat}°N, ${incident.approx_lng}°E)` : ''}
                      </span>
                    </div>

                    {/* Severity Score Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: sev.bg,
                        border: `1px solid ${sev.border}`,
                        color: sev.color
                      }}>
                        <AlertTriangle size={13} />
                        Severity: {incident.severity_level || 'MEDIUM'}
                        {incident.severity_score ? ` (${incident.severity_score})` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyFeed;
