import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncidentById, verifyIncident, rejectIncident, overrideCategory } from '../../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import {
  Check,
  X,
  Edit3,
  ArrowLeft,
  Shield,
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
  Cpu,
  FileText,
  UserCheck,
  Copy,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [rejectReason, setRejectReason] = useState('');
  const [overrideCat, setOverrideCat] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  const CATEGORIES = [
    'Harassment',
    'Stalking',
    'Threat',
    'Unsafe Area',
    'Poor Lighting',
    'Suspicious Activity',
    'Other'
  ];

  const categoryMap = {
    1: 'Harassment',
    2: 'Stalking',
    3: 'Threat',
    4: 'Unsafe Area',
    5: 'Poor Lighting',
    6: 'Suspicious Activity',
    7: 'Other'
  };

  const fetchIncident = async () => {
    try {
      const res = await getIncidentById(id);
      const data = res?.data || res;
      setIncident(data);
      const initialCat =
        data.final_category ||
        data.category_name ||
        categoryMap[data.category_id] ||
        data.ai_category ||
        data.category ||
        'Harassment';
      setOverrideCat(initialCat);
    } catch (error) {
      toast.error('Failed to load incident details');
      navigate('/admin/incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const handleCopyId = (reportId) => {
    navigator.clipboard.writeText(reportId);
    toast.success('Report ID copied to clipboard');
  };

  const handleVerify = async () => {
    setActionLoading(true);
    try {
      const targetId = incident?.id || incident?.public_report_id || id;
      await verifyIncident(targetId);
      toast.success('Incident verified and published to community feed');
      await fetchIncident();
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.error || 'Verification failed';
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return toast.error('Please specify a rejection reason');
    setActionLoading(true);
    try {
      const targetId = incident?.id || incident?.public_report_id || id;
      await rejectIncident(targetId, rejectReason.trim());
      toast.success('Incident rejected and archived');
      setRejectReason('');
      await fetchIncident();
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.error || 'Rejection failed';
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOverride = async () => {
    if (!overrideReason.trim()) return toast.error('Please specify the justification for override');
    setActionLoading(true);
    try {
      const targetId = incident?.id || incident?.public_report_id || id;
      await overrideCategory(targetId, overrideCat, overrideReason.trim());
      toast.success('Incident category overridden successfully');
      setOverrideReason('');
      await fetchIncident();
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.error || 'Override failed';
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!incident) return null;

  const currentStatus = incident.verification_status || incident.status || 'PENDING';
  const lat = parseFloat(incident.latitude || incident.location?.coordinates?.[1] || 12.9716);
  const lng = parseFloat(incident.longitude || incident.location?.coordinates?.[0] || 77.5946);
  const reportCode = incident.public_report_id || incident.reportId || `SC-${id}`;
  const displayCategory = incident.final_category || incident.category_name || categoryMap[incident.category_id] || incident.ai_category || incident.category || 'Unclassified';
  const confidenceScore = parseFloat(incident.ai_confidence || incident.aiConfidence || 0);
  const confidencePercent = (confidenceScore * 100).toFixed(1);
  const severityVal = parseFloat(incident.severity_score || incident.severityScore || 0.5);
  const severityLevel = incident.severity_level || incident.severityLevel || (severityVal >= 0.7 ? 'HIGH' : severityVal >= 0.4 ? 'MEDIUM' : 'LOW');

  const getStatusBadge = (status) => {
    if (status === 'VERIFIED') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.8rem',
          fontWeight: '700',
          letterSpacing: '0.04em'
        }}>
          <Check size={14} /> VERIFIED
        </span>
      );
    }
    if (status === 'REJECTED') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.8rem',
          fontWeight: '700',
          letterSpacing: '0.04em'
        }}>
          <X size={14} /> REJECTED
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.85rem',
        borderRadius: '9999px',
        background: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        color: '#fbbf24',
        fontSize: '0.8rem',
        fontWeight: '700',
        letterSpacing: '0.04em'
      }}>
        <Clock size={14} /> PENDING AUDIT
      </span>
    );
  };

  const getSeverityBadge = (level) => {
    const isHigh = level === 'HIGH';
    const isMedium = level === 'MEDIUM';
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.65rem',
        borderRadius: '6px',
        fontSize: '0.78rem',
        fontWeight: '700',
        background: isHigh ? 'rgba(239, 68, 68, 0.15)' : isMedium ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
        color: isHigh ? '#f87171' : isMedium ? '#fbbf24' : '#34d399',
        border: `1px solid ${isHigh ? 'rgba(239, 68, 68, 0.3)' : isMedium ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
      }}>
        <AlertTriangle size={12} /> {level}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Navigation & Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/admin/incidents')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.45rem 0.9rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '1.25rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          <ArrowLeft size={16} /> Back to Incident Queue
        </button>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.35rem' }}>
              <h1 style={{
                fontSize: '1.85rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
                fontFamily: 'var(--font-heading)'
              }}>
                Incident Dossier
              </h1>
              <div
                onClick={() => handleCopyId(reportCode)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.7rem',
                  background: 'rgba(13, 148, 136, 0.12)',
                  border: '1px solid rgba(13, 148, 136, 0.3)',
                  borderRadius: '6px',
                  color: 'var(--accent-hover)',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
                title="Click to copy ID"
              >
                <span>{reportCode}</span>
                <Copy size={13} />
              </div>
              {getStatusBadge(currentStatus)}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Logged on {new Date(incident.created_at || incident.createdAt || Date.now()).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })} • Zero-PII Anonymous Submission
            </p>
          </div>

          {currentStatus === 'PENDING' && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleVerify}
                disabled={actionLoading}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '700'
                }}
              >
                <Check size={18} /> Verify & Publish
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.75rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Dossier Details & AI Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Card 1: Core Incident Overview */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FileText size={18} color="var(--accent)" /> Incident Information
              </h3>
              {getSeverityBadge(severityLevel)}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr',
              rowGap: '1rem',
              columnGap: '1rem',
              fontSize: '0.9rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Active Category:</span>
              <div>
                <span style={{
                  padding: '0.2rem 0.65rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}>
                  {displayCategory}
                </span>
                {incident.final_category && incident.final_category !== incident.ai_category && (
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-hover)' }}>
                    (Overridden from {incident.ai_category || incident.original_ai_category})
                  </span>
                )}
              </div>

              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Incident Time:</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {new Date(incident.incident_time || incident.incidentDate || incident.created_at || Date.now()).toLocaleString('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'medium'
                })}
              </span>

              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Coordinates:</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                {lat.toFixed(5)}° N, {lng.toFixed(5)}° E
              </span>

              {incident.override_reason && (
                <>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Override Note:</span>
                  <span style={{ color: 'var(--accent-hover)', fontStyle: 'italic' }}>
                    "{incident.override_reason}"
                  </span>
                </>
              )}

              {incident.rejection_reason && (
                <>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Rejection Reason:</span>
                  <span style={{ color: '#f87171', fontStyle: 'italic' }}>
                    "{incident.rejection_reason}"
                  </span>
                </>
              )}
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '1.25rem'
            }}>
              <span style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                Reported Description
              </span>
              <p style={{
                margin: 0,
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap'
              }}>
                {incident.description}
              </p>
            </div>
          </div>

          {/* Card 2: AI Triage & Classification Engine */}
          <div className="card" style={{
            padding: '1.75rem',
            background: 'linear-gradient(145deg, rgba(13, 148, 136, 0.06) 0%, rgba(14, 23, 38, 0.95) 100%)',
            border: '1px solid rgba(13, 148, 136, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: '700',
                color: 'var(--accent-hover)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Cpu size={18} /> DistilBERT NLP Classification
              </h3>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'rgba(13, 148, 136, 0.12)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px'
              }}>
                AI Microservice
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Predicted Class
                </span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                  {incident.ai_category || incident.category_name || categoryMap[incident.category_id] || incident.category}
                </strong>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Confidence Score
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--accent-hover)' }}>
                    {confidencePercent}%
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({confidenceScore.toFixed(4)})
                  </span>
                </div>
              </div>
            </div>

            {/* Confidence Progress Meter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Model Certainty Threshold</span>
                <span style={{ color: confidenceScore >= 0.7 ? '#34d399' : '#fbbf24', fontWeight: '700' }}>
                  {confidenceScore >= 0.7 ? 'High Reliability' : 'Moderately Confident'}
                </span>
              </div>
              <div style={{
                height: '8px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, Math.max(10, confidenceScore * 100))}%`,
                  background: confidenceScore >= 0.7
                    ? 'linear-gradient(90deg, #0d9488 0%, #14b8a6 100%)'
                    : 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Map & Moderator Control Station */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* Card 3: Geolocation Inspection */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <MapPin size={18} color="var(--accent)" /> Exact Coordinate Inspection
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                EPSG:4326 PostGIS
              </span>
            </div>

            <div style={{ height: '280px', width: '100%', position: 'relative' }}>
              <MapContainer
                center={[lat, lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                  <Popup>
                    <div style={{ color: '#0f172a' }}>
                      <strong>{reportCode}</strong><br/>
                      {displayCategory}<br/>
                      <small>{lat.toFixed(5)}, {lng.toFixed(5)}</small>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

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
              <span>Center Lat: {lat.toFixed(5)}°</span>
              <span>Center Lng: {lng.toFixed(5)}°</span>
            </div>
          </div>

          {/* Card 4: Moderation Actions (Verify / Reject) */}
          {currentStatus === 'PENDING' && (
            <div className="card" style={{ padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <X size={18} /> Reject Report
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', margin: '0 0 1rem 0' }}>
                If this submission contains spam, duplicates, or unverifiable claims, specify a reason to reject and archive it.
              </p>

              <textarea
                className="textarea"
                placeholder="Specify rejection justification (e.g., duplicate report, insufficient detail, prank submission)..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                style={{
                  minHeight: '80px',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}
              />

              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="btn btn-danger"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem'
                }}
              >
                <X size={16} /> Confirm Rejection
              </button>
            </div>
          )}

          {/* Card 5: Category Override Console */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Edit3 size={18} color="var(--accent)" /> Override Category
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', margin: '0 0 1rem 0' }}>
              Human-in-the-loop override of automated AI classification. Overrides are audited in `verification_actions`.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: '600' }}>
                Target Category
              </label>
              <select
                className="select"
                value={overrideCat}
                onChange={e => setOverrideCat(e.target.value)}
                style={{ width: '100%' }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: '600' }}>
                Override Justification
              </label>
              <textarea
                className="textarea"
                placeholder="Reason for changing AI category..."
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                style={{ minHeight: '80px', fontSize: '0.875rem' }}
              />
            </div>

            <button
              onClick={handleOverride}
              disabled={actionLoading || !overrideReason.trim()}
              className="btn btn-secondary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem'
              }}
            >
              <Edit3 size={16} /> Apply Classification Override
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;
