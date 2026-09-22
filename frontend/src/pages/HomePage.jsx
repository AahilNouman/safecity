import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Map, Bell, Brain } from 'lucide-react';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 4rem - 100px)' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--blue-dark) 100%)',
        color: 'white',
        padding: '6rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '1.5rem', fontWeight: '800' }}>
            Report. Protect. Empower.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--border)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            SafeCity is an anonymous community safety platform. Report incidents, view active safety hotspots, and help protect your community with the power of crowdsourced data and AI.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/report" className="btn" style={{ backgroundColor: 'var(--emerald)', color: 'white', fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
              Report an Incident
            </Link>
            <Link to="/map" className="btn" style={{ backgroundColor: 'transparent', border: '2px solid white', color: 'white', fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
              View Safety Map
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div className="grid md:grid-cols-3" style={{ textAlign: 'center', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--blue)', marginBottom: '0.5rem' }}>10k+</h3>
              <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Total Reports</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--emerald)', marginBottom: '0.5rem' }}>95%</h3>
              <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Verified Incidents</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--amber)', marginBottom: '0.5rem' }}>12</h3>
              <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Active Hotspots</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 1rem', background: 'var(--bg-page)', flex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>How SafeCity Works</h2>
          <div className="grid md:grid-cols-4">
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
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
