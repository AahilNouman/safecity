import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldAlert, Map, Bell, Brain, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 4.5rem)' }}>
      {/* Modern Dark Teal Hero Section */}
      <section style={{
        background: 'radial-gradient(ellipse at top, #063d4a 0%, #032128 70%)',
        color: 'white',
        padding: '4.5rem 1.5rem 5.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background glow effect */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '3.5rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Left Column: Heading and CTAs */}
          <div style={{ flex: '1 1 540px', maxWidth: '660px' }}>
            {/* Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              color: '#e2e8f0',
              marginBottom: '2rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
            }}>
              <Users size={16} color="#2dd4bf" />
              <span>Community-based safety information</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: '1.12',
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem'
            }}>
              Report what you saw.<br />
              Help your community<br />
              stay aware.
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '1.125rem',
              color: '#94a3b8',
              lineHeight: '1.7',
              maxWidth: '560px',
              marginBottom: '2.5rem'
            }}>
              SafeCity turns anonymous incident reports into verified, location-aware safety information. It is a decision-support tool — not a replacement for emergency services.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to="/report"
                className="btn"
                style={{
                  background: '#f8fafc',
                  color: '#0f172a',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.85rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.25)';
                }}
              >
                Report an incident
              </Link>
              <Link
                to="/map"
                className="btn"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.85rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                }}
              >
                View safety map
              </Link>
            </div>
          </div>

          {/* Right Column: Emergency Card */}
          <div style={{ flex: '1 1 340px', maxWidth: '440px', width: '100%' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '1.25rem',
              padding: '2.25rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  display: 'inline-block'
                }} />
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: 0
                }}>
                  In an emergency
                </h3>
              </div>
              <p style={{
                fontWeight: '700',
                color: '#0f172a',
                fontSize: '1rem',
                marginBottom: '0.5rem'
              }}>
                Call 112 first.
              </p>
              <p style={{
                color: '#475569',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                SafeCity does not dispatch help and does not monitor reports in real time. Use it to inform your community after you are safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section style={{ padding: '6rem 1.5rem', background: '#f8fafc', flex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(13, 148, 136, 0.1)',
            color: '#0d9488',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} />
            <span>Platform Capabilities</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem'
          }}>
            How SafeCity Works
          </h2>

          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            maxWidth: '620px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.6'
          }}>
            Empowering citizens and communities with anonymous, verified, and AI-accelerated public safety intelligence.
          </p>

          <div className="grid md:grid-cols-4" style={{ gap: '1.5rem', textAlign: 'left' }}>
            {[
              {
                step: '01',
                icon: ShieldAlert,
                title: 'Anonymous Reporting',
                desc: 'Submit incidents securely without revealing your personal identity. Complete privacy is guaranteed by design.',
                color: '#0ea5e9',
                bg: 'rgba(14, 165, 233, 0.1)'
              },
              {
                step: '02',
                icon: Brain,
                title: 'AI Classification',
                desc: 'DistilBERT NLP automatically categorizes descriptions and evaluates severity scores for instant triage.',
                color: '#8b5cf6',
                bg: 'rgba(139, 92, 246, 0.1)'
              },
              {
                step: '03',
                icon: Map,
                title: 'Live Safety Map',
                desc: 'Explore geospatial clusters and hotspots computed via DBSCAN to make safer daily travel decisions.',
                color: '#10b981',
                bg: 'rgba(16, 185, 129, 0.1)'
              },
              {
                step: '04',
                icon: Bell,
                title: 'Community Feed',
                desc: 'Stay informed with a sanitized, moderated chronological stream of verified incidents in your neighborhood.',
                color: '#f59e0b',
                bg: 'rgba(245, 158, 11, 0.1)'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '1rem',
                  padding: '2rem 1.75rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = feature.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: feature.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <feature.icon size={26} color={feature.color} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#cbd5e1', letterSpacing: '0.05em' }}>
                    {feature.step}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '0.75rem',
                  lineHeight: '1.3'
                }}>
                  {feature.title}
                </h3>

                <p style={{
                  color: '#64748b',
                  fontSize: '0.925rem',
                  lineHeight: '1.6',
                  margin: 0,
                  flex: 1
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
