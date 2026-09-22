import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle, Map, Home, Plus } from 'lucide-react';

const ReportConfirmation = () => {
  const { reportId } = useParams();
  const location = useLocation();
  const result = location.state?.result;

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem' }}>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <CheckCircle size={64} color="var(--emerald)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ color: 'var(--text-dark)', marginBottom: '1rem' }}>Report Submitted Successfully</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.125rem' }}>
          Your report has been submitted anonymously and will be reviewed by our team.
        </p>

        <div style={{ background: 'var(--bg-page)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Report ID</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--navy)', fontFamily: 'monospace' }}>{reportId}</p>
        </div>

        {result && result.aiProcessed && (
          <div style={{ textAlign: 'left', background: 'var(--blue)15', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '2rem', border: '1px solid var(--blue)' }}>
            <h4 style={{ color: 'var(--blue)', marginBottom: '0.5rem' }}>AI Classification Result</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Category:</strong> {result.category}</p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Confidence:</strong> {(result.aiConfidence * 100).toFixed(1)}%</p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Severity Level:</strong> {result.severityLevel}/10</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/map" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            <Map size={20} /> View Safety Map
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/report" className="btn btn-outline" style={{ flex: 1 }}>
              <Plus size={20} /> Another Report
            </Link>
            <Link to="/" className="btn btn-outline" style={{ flex: 1 }}>
              <Home size={20} /> Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmation;
