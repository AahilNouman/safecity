import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  MapPin,
  Cpu,
  EyeOff,
  ArrowRight,
  PhoneCall,
  Activity,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 4.25rem)' }}>
      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(ellipse at top, #10192d 0%, #0a0f1d 75%)',
        padding: '5rem 1.5rem 4.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Heading and CTAs */}
          <div>
            {/* Trust Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(13, 148, 136, 0.1)',
              border: '1px solid rgba(13, 148, 136, 0.25)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              color: '#2dd4bf',
              fontWeight: '600',
              marginBottom: '1.5rem',
              letterSpacing: '0.02em'
            }}>
              <ShieldCheck size={14} color="#14b8a6" />
              <span>Civic Safety Intelligence • Bengaluru Region</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: '1.15',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}>
              Real-time spatial intelligence for community protection.
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              lineHeight: '1.7',
              maxWidth: '560px',
              marginBottom: '2.25rem'
            }}>
              SafeCity aggregates verified civic incident reports into actionable spatial intelligence. Designed with mathematical privacy, DistilBERT NLP classification, and DBSCAN clustering for proactive municipal safety.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to="/report"
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
              >
                Report an Incident <ArrowRight size={16} />
              </Link>
              <Link
                to="/map"
                className="btn btn-outline"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
              >
                <MapPin size={16} /> Explore Safety Map
              </Link>
            </div>
          </div>

          {/* Right Column: Emergency & Protocol Card */}
          <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
            <div style={{
              background: '#10192d',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PhoneCall size={16} color="#f87171" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  Active Emergency Protocol
                </h3>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ color: '#f87171', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  In immediate danger? Dial 112 first.
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.825rem', lineHeight: '1.5', margin: 0 }}>
                  SafeCity is an analytical intelligence platform, not a live emergency dispatcher. Always contact emergency services immediately if you or someone else is in acute distress.
                </p>
              </div>

              {/* Emergency Numbers Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div style={{
                  padding: '0.6rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>National Emergency</div>
                  <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: '800' }}>112</div>
                </div>
                <div style={{
                  padding: '0.6rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Women Helpline</div>
                  <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: '800' }}>1091</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Telemetry Metrics Row */}
      <section style={{
        background: '#070b14',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.75rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(13, 148, 136, 0.1)',
              border: '1px solid rgba(13, 148, 136, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin size={20} color="#14b8a6" />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>55+</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Clusters Tracked</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={20} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>30+</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Verified Reports</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={20} color="#60a5fa" />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>&lt;50ms</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>NLP Latency</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={20} color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>100%</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Zero-PII Privacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Capabilities */}
      <section style={{ padding: '5rem 1.5rem', background: '#0a0f1d', flex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#14b8a6',
              fontSize: '0.78rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem'
            }}>
              Technology Architecture
            </div>
            <h2 style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem'
            }}>
              Engineered for Public Safety & Privacy
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#94a3b8',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Built on modern full-stack standards to ensure zero data leakage, fast triage, and auditable geospatial intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-4">
            <div className="card">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(13, 148, 136, 0.1)',
                border: '1px solid rgba(13, 148, 136, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <EyeOff size={18} color="#14b8a6" />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                Zero-PII Protection
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Personal identity data is excluded from public feeds and map points. Coordinates are fuzzed to protect citizen confidentiality.
              </p>
            </div>

            <div className="card">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(13, 148, 136, 0.1)',
                border: '1px solid rgba(13, 148, 136, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Cpu size={18} color="#14b8a6" />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                DistilBERT NLP Triage
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Natural Language Processing categorizes incident narratives, scores danger levels, and prevents manual triage bottlenecks.
              </p>
            </div>

            <div className="card">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(13, 148, 136, 0.1)',
                border: '1px solid rgba(13, 148, 136, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Layers size={18} color="#14b8a6" />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                DBSCAN Hotspots
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Density-based spatial clustering identifies recurring risk corridors, unlit transit pathways, and municipal patrol zones.
              </p>
            </div>

            <div className="card">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(13, 148, 136, 0.1)',
                border: '1px solid rgba(13, 148, 136, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <CheckCircle2 size={18} color="#14b8a6" />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                Human Verification
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Every public report is audited and verified by authorized safety moderators before publishing to prevent spam or false reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{
        background: '#070b14',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '3.5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
            Empower your community with verified safety data
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Your anonymous reports help map vulnerable transit areas and direct municipal safety resources where they are needed most.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/report" className="btn btn-primary">
              Submit an Incident Report
            </Link>
            <Link to="/feed" className="btn btn-outline">
              View Community Safety Feed
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
