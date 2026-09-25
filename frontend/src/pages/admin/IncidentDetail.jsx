import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncidentById, verifyIncident, rejectIncident, overrideCategory } from '../../services/api';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';
import { Check, X, Edit3, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal/Form states
  const [rejectReason, setRejectReason] = useState('');
  const [overrideCat, setOverrideCat] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  const CATEGORIES = ['Harassment', 'Stalking', 'Threat', 'Unsafe Area', 'Poor Lighting', 'Suspicious Activity', 'Other'];
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
      const initialCat = data.final_category || data.category_name || categoryMap[data.category_id] || data.ai_category || data.category || 'Harassment';
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

  const handleVerify = async () => {
    try {
      const targetId = incident?.id || incident?.public_report_id || id;
      await verifyIncident(targetId);
      toast.success('Incident verified and published');
      await fetchIncident();
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.error || 'Verification failed';
      toast.error(errMsg);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return toast.error('Provide a rejection reason');
    try {
      const targetId = incident?.id || incident?.public_report_id || id;
      await rejectIncident(targetId, rejectReason);
      toast.success('Incident rejected');
      setRejectReason('');
      await fetchIncident();
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.error || 'Rejection failed';
      toast.error(errMsg);
    }
  };

  const handleOverride = async () => {
    if (!overrideReason) return toast.error('Provide a reason for override');
    try {
      const targetId = incident?.id || incident?.public_report_id || id;
      await overrideCategory(targetId, overrideCat, overrideReason);
      toast.success('Category overridden successfully');
      setOverrideReason('');
      await fetchIncident();
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.error || 'Override failed';
      toast.error(errMsg);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!incident) return null;

  const currentStatus = incident.verification_status || incident.status;
  const lat = parseFloat(incident.latitude || incident.location?.coordinates?.[1] || 12.9716);
  const lng = parseFloat(incident.longitude || incident.location?.coordinates?.[0] || 77.5946);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '0.5rem', marginBottom: '1rem' }}>
          <ArrowLeft size={20} /> Back
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              Incident {incident.public_report_id || incident.reportId}
              {currentStatus === 'PENDING' && <span className="badge badge-pending">PENDING</span>}
              {currentStatus === 'VERIFIED' && <span className="badge badge-verified">VERIFIED</span>}
              {currentStatus === 'REJECTED' && <span className="badge badge-rejected">REJECTED</span>}
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Reported {new Date(incident.created_at || incident.createdAt || Date.now()).toLocaleString()}</p>
          </div>
          
          {currentStatus === 'PENDING' && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleVerify} className="btn btn-success"><Check size={18} /> Verify & Publish</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3">
        <div className="md:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Details Card */}
          <div className="card">
            <h3>Report Details</h3>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Category:</span>
              <strong>{incident.final_category || incident.category_name || categoryMap[incident.category_id] || incident.ai_category || incident.category}</strong>
              
              <span style={{ color: 'var(--text-muted)' }}>Date of Incident:</span>
              <span>{new Date(incident.incident_time || incident.incidentDate || incident.created_at || Date.now()).toLocaleString()}</span>
              
              <span style={{ color: 'var(--text-muted)' }}>Description:</span>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{incident.description}</p>
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="card" style={{ background: 'var(--blue)15', border: '1px solid var(--blue)' }}>
            <h3 style={{ color: 'var(--blue)' }}>AI Classification</h3>
            <hr style={{ margin: '1rem 0', borderColor: 'rgba(37, 99, 235, 0.2)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Predicted Category</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <strong style={{ fontSize: '1.25rem' }}>{incident.ai_category || incident.final_category || incident.category_name || categoryMap[incident.category_id] || incident.category}</strong>
                  <span className="badge" style={{ background: 'var(--blue)', color: 'white' }}>{((incident.ai_confidence || incident.aiConfidence || 0) * 100).toFixed(1)}% Confident</span>
                </div>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Assessed Severity</p>
                <strong style={{ fontSize: '1.25rem' }}>{incident.severity_level || incident.severityLevel || 'N/A'}</strong>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0 }}>Location</h3>
            </div>
            <div style={{ height: '300px' }}>
              <MapContainer 
                center={[lat, lng]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {currentStatus === 'PENDING' && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Reject Report</h3>
              <textarea 
                className="textarea" 
                placeholder="Reason for rejection..." 
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                style={{ marginBottom: '1rem', minHeight: '80px' }}
              />
              <button onClick={handleReject} className="btn btn-danger" style={{ width: '100%' }}>
                <X size={18} /> Reject Incident
              </button>
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Override Category</h3>
            <select 
              className="select" 
              value={overrideCat}
              onChange={e => setOverrideCat(e.target.value)}
              style={{ marginBottom: '1rem' }}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <textarea 
              className="textarea" 
              placeholder="Reason for override..." 
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
              style={{ marginBottom: '1rem', minHeight: '80px' }}
            />
            <button onClick={handleOverride} className="btn btn-outline" style={{ width: '100%' }} disabled={!overrideReason}>
              <Edit3 size={18} /> Apply Override
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .md\\:col-span-2 { grid-column: span 2 / span 2; }
      `}</style>
    </div>
  );
};

export default IncidentDetail;
