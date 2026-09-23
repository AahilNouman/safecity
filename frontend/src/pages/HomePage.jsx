import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldAlert, Map, Bell, Brain } from 'lucide-react';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 4rem)' }}>
      {/* Modern Dark Teal Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #032128 0%, #053742 55%, #03262f 100%)',
        color: 'white',
        padding: '5rem 1.5rem 6rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '3rem',
          flexWrap: 'wrap'
        }}>
          {/* Left Column: Heading and CTAs */}
          <div style={{ flex: '1 1 540px', maxWidth: '680px' }}>
            {/* Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              color: '#e2e8f0',
              marginBottom: '2rem'
            }}>
              <Users size={16} />
              <span>Community-based safety information</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
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
              lineHeight: '1.65',
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
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease'
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
                  transition: 'all 0.2s ease'
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
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
            }}>
              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '1.25rem'
              }}>
                In an emergency
              </h3>
              <p style={{
                fontWeight: '700',
                color: '#0f172a',
                fontSize: '0.95rem',
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

      {/* Features Section (Stats bar removed) */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-page)', flex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: 'var(--navy)' }}>How SafeCity Works</h2>
          <div className="grid md:grid-cols-4" style={{ gap: '1.5rem' }}>
            {[
              { icon: ShieldAlert, title: 'Anonymous Reporting', desc: 'Submit incidents without revealing your identity. Your privacy is our priority.', color: 'var(--blue)' },
              { icon: Brain, title: 'AI Classification', desc: 'Our AI automatically categorizes reports and assesses severity for rapid response.', color: 'var(--purple)' },
              { icon: Map, title: 'Live Safety Map', desc: 'Visualize active incidents and hotspots in real-time to make informed travel decisions.', color: 'var(--emerald)' },
              { icon: Bell, title: 'Community Feed', desc: 'Stay updated with a sanitized, anonymous feed of verified incidents in your area.', color: 'var(--amber)' }
            ].map((feature, idx) => (
              <div key={idx} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: `${feature.color}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <feature.icon size={32} color={feature.color} />
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--navy)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.5' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
