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
  Layers,
  Navigation,
  Footprints,
  AlertTriangle,
  Compass
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
              SafeCity aggregates verified civic incident reports into actionable spatial intelligence. Featuring real-time <strong>Safest Route Detection</strong> avoiding high-risk red zones and <strong>Virtual Walk With Me</strong> with GPS inactivity guardian monitoring.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to="/safe-route"
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.95rem',
                  fontWeight: '700'
                }}
              >
                <Navigation size={17} /> Safest Route Detection
              </Link>
              <Link
                to="/walk-buddy"
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '700'
                }}
              >
                <Footprints size={17} /> Walk With Me
              </Link>
              <Link
                to="/map"
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem',
                  fontSize: '0.95rem'
                }}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <a
                  href="tel:112"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    textDecoration: 'none',
                    color: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                >
                  <PhoneCall size={14} color="#f87171" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>National Emergency</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>112</div>
                  </div>
                </a>

                <a
                  href="tel:1091"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    textDecoration: 'none',
                    color: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                >
                  <PhoneCall size={14} color="#60a5fa" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Women Helpline</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>1091</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Telemetry Metrics Bar */}
      <section style={{
        background: '#070b14',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem'
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
              <Activity size={20} color="#14b8a6" />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>68+</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Audited Incidents</div>
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
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>4 Clusters</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Hotspot Red-Zones</div>
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
              Autonomous Protection Engine
            </div>
            <h2 style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem'
            }}>
              Next-Generation Citizen Defense Features
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#94a3b8',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Engineered with real routing networks and live GPS telemetry to protect pedestrians and commuters.
            </p>
          </div>

          <div className="grid md:grid-cols-4">
            {/* Feature 1: Safest Route */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
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
                  <Navigation size={18} color="#14b8a6" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                  Safest Route Detection
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                  Real-time OSRM pathfinding that compares alternatives against verified incident clusters and highlights the lowest-risk corridor.
                </p>
              </div>
              <Link to="/safe-route" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#14b8a6', fontSize: '0.85rem', fontWeight: '700', marginTop: '1rem', textDecoration: 'none' }}>
                Plan Safe Route <ArrowRight size={14} />
              </Link>
            </div>

            {/* Feature 2: Walk Buddy */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
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
                  <Footprints size={18} color="#14b8a6" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                  Virtual Walk With Me
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                  GPS companion monitoring movement. Triggers safety prompts upon prolonged inactivity and auto-notifies your emergency contact.
                </p>
              </div>
              <Link to="/walk-buddy" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#14b8a6', fontSize: '0.85rem', fontWeight: '700', marginTop: '1rem', textDecoration: 'none' }}>
                Start Escort Session <ArrowRight size={14} />
              </Link>
            </div>

            {/* Feature 3: DBSCAN Clustering */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
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
              <Link to="/map" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#14b8a6', fontSize: '0.85rem', fontWeight: '700', marginTop: '1rem', textDecoration: 'none' }}>
                View Threat Hotspots <ArrowRight size={14} />
              </Link>
            </div>

            {/* Feature 4: Zero-PII Anonymous Reporting */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
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
              <Link to="/report" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#14b8a6', fontSize: '0.85rem', fontWeight: '700', marginTop: '1rem', textDecoration: 'none' }}>
                Submit Report <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{
        background: '#070b14',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '4rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Empowering safer cities together.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Every incident submitted or route navigated trains our spatial intelligence engine to protect more citizens across Bengaluru.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/safe-route"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
            >
              Test Safest Route
            </Link>
            <Link
              to="/walk-buddy"
              className="btn btn-outline"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              Start Walk Escort
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
