import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Map, Home, Plus, Copy, Check, ShieldCheck, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportConfirmation = () => {
  const { reportId } = useParams();
  const location = useLocation();
  const result = location.state?.result;
  const [copied, setCopied] = useState(false);

  const displayId = reportId || result?.public_report_id || result?.data?.public_report_id || 'SC-2026-CONFIRMED';

  const handleCopyId = () => {
    navigator.clipboard.writeText(displayId);
    setCopied(true);
    toast.success('Report tracking ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 4.25rem)',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #0a0f1d 75%)',
      padding: '4rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="card" style={{ maxWidth: '580px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
        
        {/* Success Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}>
          <CheckCircle2 size={34} color="#10b981" />
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          Report Submitted Successfully
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Your report has been encrypted and recorded anonymously. It has been routed to the municipal review queue for verification.
        </p>

        {/* Tracking ID Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.08em' }}>
            Anonymous Tracking ID
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#2dd4bf', fontFamily: 'monospace' }}>
              {displayId}
            </span>
            <button
              onClick={handleCopyId}
              title="Copy Report ID"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '6px',
                padding: '0.35rem',
                color: copied ? '#10b981' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* AI Triage Card if present */}
        {result?.data?.ai_classification && (
          <div style={{
            textAlign: 'left',
            background: 'rgba(13, 148, 136, 0.08)',
            border: '1px solid rgba(13, 148, 136, 0.25)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2dd4bf', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              <Cpu size={14} /> Automated AI Triage Prediction
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div><strong style={{ color: '#ffffff' }}>Category:</strong> {result.data.ai_classification.category}</div>
              <div><strong style={{ color: '#ffffff' }}>Confidence:</strong> {((result.data.ai_classification.confidence || 0) * 100).toFixed(0)}%</div>
            </div>
          </div>
        )}

        {/* Navigation CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/map" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            <Map size={16} /> View Incident on Safety Map
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/report" className="btn btn-outline" style={{ flex: 1, padding: '0.65rem' }}>
              <Plus size={16} /> Submit Another
            </Link>
            <Link to="/" className="btn btn-outline" style={{ flex: 1, padding: '0.65rem' }}>
              <Home size={16} /> Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmation;
