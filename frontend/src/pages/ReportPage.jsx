import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submitIncident } from '../services/api';
import LocationPicker from '../components/Map/LocationPicker';
import {
  Shield,
  ShieldCheck,
  MapPin,
  Clock,
  FileText,
  Lock,
  ArrowRight,
  Crosshair,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  'Harassment',
  'Stalking',
  'Threat',
  'Unsafe Area',
  'Poor Lighting',
  'Suspicious Activity',
  'Other'
];

const ReportPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: null,
    incidentDate: new Date().toISOString().slice(0, 16)
  });

  const handleLocationSelect = (loc) => {
    setFormData(prev => ({ ...prev, location: loc }));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    const toastId = toast.loading('Detecting your GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.success('GPS coordinates acquired', { id: toastId });
        setFormData(prev => ({
          ...prev,
          location: { lat: position.coords.latitude, lng: position.coords.longitude }
        }));
      },
      (error) => {
        toast.error('Unable to retrieve GPS location. Please tap the map directly.', { id: toastId });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) return toast.error('Please select an incident category');
    if (formData.description.trim().length < 10) return toast.error('Description must be at least 10 characters');
    if (!formData.location) return toast.error('Please select an incident location on the map');

    setLoading(true);
    try {
      const payload = {
        category_id: CATEGORIES.indexOf(formData.category) + 1,
        description: formData.description.trim(),
        latitude: formData.location.lat,
        longitude: formData.location.lng,
        incident_time: new Date(formData.incidentDate).toISOString()
      };

      const result = await submitIncident(payload);
      const repId = result?.reportId || result?.data?.public_report_id || result?.public_report_id || 'SC-2026-CONFIRMED';
      toast.success('Incident report submitted anonymously');
      navigate(`/report/confirm/${repId}`, { state: { result } });
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.response?.data?.error || 'Failed to submit report. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 4.25rem)',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #0a0f1d 75%)',
      padding: '2.5rem 1rem 4rem'
    }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        
        {/* Form Card */}
        <div className="card" style={{ padding: '2.25rem' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#14b8a6',
              fontSize: '0.78rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.5rem'
            }}>
              <ShieldCheck size={14} /> Anonymous Incident Audit
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.35rem' }}>
              Report an Incident
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
              Your report is completely anonymous. Personal identity markers are scrubbed before municipal review.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Step 1: Category */}
            <div>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>1. Incident Classification <span style={{ color: '#f43f5e' }}>*</span></span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>Required</span>
              </label>
              <select 
                className="select" 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select an incident category...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Step 2: Date & Time */}
            <div>
              <label className="form-label">
                2. Incident Date & Estimated Time <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="datetime-local" 
                  className="input" 
                  value={formData.incidentDate}
                  onChange={e => setFormData({ ...formData, incidentDate: e.target.value })}
                  max={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
            </div>

            {/* Step 3: Location Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  3. Approximate Location <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={useMyLocation}
                  className="btn btn-outline"
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    color: '#2dd4bf',
                    borderColor: 'rgba(13, 148, 136, 0.3)',
                    background: 'rgba(13, 148, 136, 0.08)'
                  }}
                >
                  <Crosshair size={13} /> Detect My GPS
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                Click anywhere on the map or drag the marker to specify where the incident occurred.
              </p>
              
              <LocationPicker 
                onLocationSelect={handleLocationSelect} 
                userLocation={formData.location ? [formData.location.lat, formData.location.lng] : null}
              />

              {formData.location ? (
                <div style={{
                  marginTop: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.8rem',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.25)'
                }}>
                  <MapPin size={14} />
                  <span>
                    Location specified: <strong>{formData.location.lat.toFixed(5)}°N, {formData.location.lng.toFixed(5)}°E</strong>
                  </span>
                </div>
              ) : (
                <div style={{
                  marginTop: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.8rem',
                  color: '#f59e0b'
                }}>
                  <AlertCircle size={14} />
                  <span>Please tap the map to place an incident pin.</span>
                </div>
              )}
            </div>

            {/* Step 4: Description */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  4. Incident Description <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: formData.description.length >= 10 ? '#10b981' : '#64748b' }}>
                  {formData.description.length}/2000 chars (min 10)
                </span>
              </div>
              <textarea 
                className="textarea" 
                placeholder="Provide factual details (e.g. poor lighting, verbal harassment, suspicious stalking behavior, lack of security presence). Avoid personal names or bystander numbers."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
                minLength={10}
                maxLength={2000}
              />
            </div>

            {/* Confidentiality Notice */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}>
              <Lock size={16} color="#14b8a6" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                <strong style={{ color: '#ffffff' }}>Zero-PII Assurance:</strong> Your submission does not store your IP address, browser fingerprint, or identity. Verified reports help local communities and authorities allocate patrol units.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: '700'
              }}
              disabled={loading}
            >
              {loading ? 'Transmitting Secure Report...' : 'Submit Anonymous Report'} <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
