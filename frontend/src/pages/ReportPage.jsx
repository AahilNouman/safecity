import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submitIncident } from '../services/api';
import LocationPicker from '../components/Map/LocationPicker';

const CATEGORIES = [
  'THEFT', 'ASSAULT', 'HARASSMENT', 'VANDALISM', 
  'SUSPICIOUS_ACTIVITY', 'ROAD_HAZARD', 'OTHER'
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
    toast.loading('Fetching location...', { id: 'geo' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.success('Location updated', { id: 'geo' });
        setFormData(prev => ({
          ...prev,
          location: { lat: position.coords.latitude, lng: position.coords.longitude }
        }));
      },
      (error) => {
        toast.error('Unable to retrieve your location', { id: 'geo' });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) return toast.error('Please select a category');
    if (formData.description.length < 10) return toast.error('Description must be at least 10 characters');
    if (!formData.location) return toast.error('Please select a location on the map');

    setLoading(true);
    try {
      const payload = {
        category: formData.category,
        description: formData.description,
        location: {
          type: 'Point',
          coordinates: [formData.location.lng, formData.location.lat]
        },
        incidentDate: new Date(formData.incidentDate).toISOString()
      };

      const result = await submitIncident(payload);
      toast.success('Report submitted successfully');
      navigate(`/report/confirm/${result.reportId}`, { state: { result } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="card">
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--navy)' }}>Report an Incident</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Your report will be submitted anonymously. Please provide as much detail as possible to help the community.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="select" 
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="textarea" 
              placeholder="Describe what happened (min 10 characters)..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
              minLength={10}
              maxLength={2000}
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {formData.description.length}/2000
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Incident Date & Time</label>
            <input 
              type="datetime-local" 
              className="input" 
              value={formData.incidentDate}
              onChange={e => setFormData({ ...formData, incidentDate: e.target.value })}
              max={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Location</label>
              <button type="button" onClick={useMyLocation} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                Use My Location
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Click on the map or drag the marker to set the exact location.
            </p>
            <LocationPicker 
              onLocationSelect={handleLocationSelect} 
              userLocation={formData.location ? [formData.location.lat, formData.location.lng] : null}
            />
            {formData.location && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--emerald)' }}>
                Location selected: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
              </p>
            )}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1.125rem' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Anonymous Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;
