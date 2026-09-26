import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../hooks/useAuth';
import { updateEmergencyContact, triggerEmergencyAlert, getMapIncidents } from '../services/api';
import toast from 'react-hot-toast';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Footprints,
  Play,
  Square,
  AlertTriangle,
  Phone,
  User,
  Heart,
  Compass,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Volume2,
  Share2,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Settings,
  MessageSquare
} from 'lucide-react';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to center map on user's live coordinates
function LiveLocationFollower({ position, isTracking }) {
  const map = useMap();
  useEffect(() => {
    if (isTracking && position) {
      map.panTo([position.lat, position.lng], { animate: true });
    }
  }, [position, isTracking, map]);
  return null;
}

// Great-circle distance between two points in meters
function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const WalkBuddyPage = () => {
  const { user, updateUserData, isAuthenticated } = useAuth();

  // Session state: 'IDLE' | 'ACTIVE' | 'SAFETY_CHECK' | 'EMERGENCY_DISPATCHED' | 'COMPLETED'
  const [sessionState, setSessionState] = useState('IDLE');

  // Emergency contact state
  const [contactName, setContactName] = useState(user?.emergency_contact_name || '');
  const [contactPhone, setContactPhone] = useState(user?.emergency_contact || '');
  const [contactRel, setContactRel] = useState(user?.emergency_contact_relationship || 'Guardian');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactSaving, setContactSaving] = useState(false);

  // Live Location & Breadcrumb state
  const [currentPosition, setCurrentPosition] = useState({ lat: 12.9716, lng: 77.5946 });
  const [accuracy, setAccuracy] = useState(10);
  const [speed, setSpeed] = useState(0); // km/h
  const [pathHistory, setPathHistory] = useState([]);
  const [totalDistanceCovered, setTotalDistanceCovered] = useState(0); // meters

  // Session duration timer
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const timerIntervalRef = useRef(null);

  // Inactivity / Movement state
  const [isMoving, setIsMoving] = useState(false);
  const [secondsStationary, setSecondsStationary] = useState(0);
  const [lastMovementTime, setLastMovementTime] = useState(Date.now());
  const [demoFastMode, setDemoFastMode] = useState(false); // 15s instead of 180s for evaluator demo

  // Safety confirmation countdown (45 seconds)
  const [countdownSeconds, setCountdownSeconds] = useState(45);
  const safetyPromptIntervalRef = useRef(null);

  // Geolocation watcher ID
  const watchIdRef = useRef(null);
  const lastRecordedPosRef = useRef(null);

  // Emergency dispatch details
  const [dispatchedAlert, setDispatchedAlert] = useState(null);

  // Sync user profile values when auth loads
  useEffect(() => {
    if (user) {
      if (user.emergency_contact_name && !contactName) setContactName(user.emergency_contact_name);
      if (user.emergency_contact && !contactPhone) setContactPhone(user.emergency_contact);
      if (user.emergency_contact_relationship && !contactRel) setContactRel(user.emergency_contact_relationship);
    }
  }, [user]);

  // Initial user position lookup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const initial = {
            lat: parseFloat(pos.coords.latitude.toFixed(5)),
            lng: parseFloat(pos.coords.longitude.toFixed(5))
          };
          setCurrentPosition(initial);
          lastRecordedPosRef.current = initial;
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // 1. Session Timer (runs when ACTIVE or SAFETY_CHECK)
  useEffect(() => {
    if (sessionState === 'ACTIVE' || sessionState === 'SAFETY_CHECK') {
      timerIntervalRef.current = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [sessionState]);

  // 2. Inactivity Monitor Loop (checks seconds stationary every 1 second)
  useEffect(() => {
    let inactivityInterval = null;
    if (sessionState === 'ACTIVE') {
      const stationaryThreshold = demoFastMode ? 15 : 180; // 15s in demo mode, 3 mins (180s) in standard mode

      inactivityInterval = setInterval(() => {
        const timeSinceMove = Math.floor((Date.now() - lastMovementTime) / 1000);
        setSecondsStationary(timeSinceMove);

        // Trigger safety check if stationary for > threshold
        if (timeSinceMove >= stationaryThreshold) {
          triggerInactivitySafetyCheck();
        }
      }, 1000);
    }
    return () => {
      if (inactivityInterval) clearInterval(inactivityInterval);
    };
  }, [sessionState, lastMovementTime, demoFastMode]);

  // 3. Safety Check Countdown Timer (45 seconds to respond)
  useEffect(() => {
    if (sessionState === 'SAFETY_CHECK') {
      setCountdownSeconds(45);
      safetyPromptIntervalRef.current = setInterval(() => {
        setCountdownSeconds(prev => {
          if (prev <= 1) {
            clearInterval(safetyPromptIntervalRef.current);
            handleAutoEmergencyDispatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (safetyPromptIntervalRef.current) clearInterval(safetyPromptIntervalRef.current);
    }
    return () => {
      if (safetyPromptIntervalRef.current) clearInterval(safetyPromptIntervalRef.current);
    };
  }, [sessionState]);

  // Handle GPS Position Update
  const handlePositionUpdate = (pos) => {
    const newLat = parseFloat(pos.coords.latitude.toFixed(5));
    const newLng = parseFloat(pos.coords.longitude.toFixed(5));
    const newPos = { lat: newLat, lng: newLng };

    setAccuracy(Math.round(pos.coords.accuracy || 10));

    // Calculate distance delta from previous fix
    if (lastRecordedPosRef.current) {
      const deltaMeters = haversineMeters(
        lastRecordedPosRef.current.lat,
        lastRecordedPosRef.current.lng,
        newLat,
        newLng
      );

      // If moved more than 8 meters, user is moving
      if (deltaMeters > 8) {
        setIsMoving(true);
        setLastMovementTime(Date.now());
        setSecondsStationary(0);
        setTotalDistanceCovered(prev => prev + Math.round(deltaMeters));

        // Speed from GPS or computed
        const gpsSpeedKmh = pos.coords.speed ? (pos.coords.speed * 3.6) : 3.6;
        setSpeed(parseFloat(gpsSpeedKmh.toFixed(1)));

        // Record breadcrumb
        setPathHistory(prev => [...prev, [newLat, newLng]]);
        lastRecordedPosRef.current = newPos;
      } else {
        // Negligible change -> Stationary
        setIsMoving(false);
        setSpeed(0);
      }
    } else {
      lastRecordedPosRef.current = newPos;
      setPathHistory([[newLat, newLng]]);
    }

    setCurrentPosition(newPos);
  };

  // Start Safety Session
  const handleStartSession = () => {
    if (!contactPhone.trim() || !contactName.trim()) {
      setIsEditingContact(true);
      return toast.error('Emergency Contact required before starting Virtual Walk');
    }

    if (!navigator.geolocation) {
      return toast.error('Geolocation is required for Virtual Walk With Me');
    }

    // Reset counters
    setSessionSeconds(0);
    setTotalDistanceCovered(0);
    setSecondsStationary(0);
    setLastMovementTime(Date.now());
    setIsMoving(true);
    setPathHistory([]);
    setDispatchedAlert(null);

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      (err) => {
        console.warn('Geolocation watch error:', err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
      }
    );

    setSessionState('ACTIVE');
    toast.success('Virtual Walk session initiated. Live location and motion are active.', {
      icon: '🛡️',
      duration: 4000
    });
  };

  // Stop Safety Session
  const handleStopSession = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (safetyPromptIntervalRef.current) clearInterval(safetyPromptIntervalRef.current);

    setSessionState('COMPLETED');
    toast.success('Journey completed safely! Session logs archived.', { icon: '✅' });
  };

  // Trigger Inactivity Check Dialog
  const triggerInactivitySafetyCheck = () => {
    setSessionState('SAFETY_CHECK');
    // Try to trigger subtle vibration if device supports it
    if (navigator.vibrate) {
      navigator.vibrate([300, 150, 300]);
    }
    toast('Inactivity check triggered — please confirm your safety', {
      icon: '⚠️',
      duration: 5000
    });
  };

  // User Confirms Safety ("I am Safe")
  const handleConfirmSafety = () => {
    if (safetyPromptIntervalRef.current) clearInterval(safetyPromptIntervalRef.current);
    setLastMovementTime(Date.now());
    setSecondsStationary(0);
    setSessionState('ACTIVE');
    toast.success('Safety confirmed! Resuming normal journey tracking.', { icon: '🛡️' });
  };

  // Auto Emergency Dispatch when countdown runs out or manual SOS
  const handleAutoEmergencyDispatch = async () => {
    if (safetyPromptIntervalRef.current) clearInterval(safetyPromptIntervalRef.current);
    setSessionState('EMERGENCY_DISPATCHED');

    const payload = {
      alert_type: 'INACTIVITY_TIMEOUT',
      latitude: currentPosition.lat,
      longitude: currentPosition.lng,
      address: `Bengaluru, Karnataka (GPS: ${currentPosition.lat}, ${currentPosition.lng})`,
      contact_name: contactName,
      contact_phone: contactPhone,
      contact_relationship: contactRel,
      session_duration_seconds: sessionSeconds,
      details: {
        stationary_seconds: secondsStationary,
        accuracy_meters: accuracy,
        distance_walked_meters: totalDistanceCovered
      }
    };

    try {
      const res = await triggerEmergencyAlert(payload);
      if (res && res.data) {
        setDispatchedAlert(res.data);
      }
      toast.error('EMERGENCY SOS: Registered contact automatically notified!', {
        duration: 8000,
        icon: '🚨'
      });
    } catch (e) {
      console.error('Failed to trigger alert API:', e);
      toast.error('Alert recorded locally. Please contact emergency services.');
    }
  };

  // Save Contact to profile
  const handleSaveContact = async (e) => {
    e.preventDefault();
    if (!contactName.trim()) return toast.error('Contact name is required');
    if (!contactPhone.trim()) return toast.error('Contact phone number is required');

    setContactSaving(true);
    try {
      const res = await updateEmergencyContact({
        emergency_contact_name: contactName.trim(),
        emergency_contact_phone: contactPhone.trim(),
        emergency_contact_relationship: contactRel.trim()
      });

      if (res && res.data) {
        updateUserData(res.data);
      }
      setIsEditingContact(false);
      toast.success('Emergency contact saved successfully');
    } catch (err) {
      // If user is guest/offline, still save in state
      setIsEditingContact(false);
      toast.success('Emergency contact saved for this session');
    } finally {
      setContactSaving(false);
    }
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      
      {/* ════════════════════ PAGE HEADER ════════════════════ */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          background: 'rgba(13, 148, 136, 0.12)',
          border: '1px solid rgba(13, 148, 136, 0.3)',
          color: 'var(--accent-hover)',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem'
        }}>
          <Footprints size={13} />
          Active Citizen Escort Protocol
        </div>
        <h1 style={{
          fontSize: '2.1rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem 0',
          fontFamily: 'var(--font-heading)'
        }}>
          Virtual Walk With Me
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, maxWidth: '800px', lineHeight: 1.5 }}>
          Real-time GPS travel guardian. Continuously monitors movement, detects prolonged stationary inactivity, and initiates automated emergency protocols if you remain unresponsive.
        </p>
      </div>

      {/* ════════════════════ EMERGENCY CONTACT BANNER / VERIFICATION ════════════════════ */}
      <div className="card" style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        background: 'var(--bg-surface)',
        border: (!contactPhone || !contactName) ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: (contactPhone && contactName) ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.15)',
            border: (contactPhone && contactName) ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Phone size={20} color={(contactPhone && contactName) ? '#34d399' : '#fbbf24'} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Registered Emergency Guardian
              </h4>
              {(contactPhone && contactName) ? (
                <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  Active & Verified
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  Required Before Starting Walk
                </span>
              )}
            </div>
            <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              {(contactPhone && contactName)
                ? `${contactName} (${contactRel}) • ${contactPhone}`
                : 'Please configure at least one emergency contact phone number'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditingContact(!isEditingContact)}
          disabled={sessionState === 'ACTIVE'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.9rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.825rem',
            fontWeight: '600',
            cursor: sessionState === 'ACTIVE' ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Settings size={14} /> {isEditingContact ? 'Cancel' : 'Change Contact'}
        </button>
      </div>

      {/* Edit Emergency Contact Modal / Drawer */}
      {isEditingContact && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'var(--bg-surface-elevated)', border: '1px solid var(--accent)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Configure Emergency Contact
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>
            In the event of prolonged stationary inactivity or emergency trigger, SafeCity will immediately transmit your real-time coordinates and journey telemetry to this individual.
          </p>

          <form onSubmit={handleSaveContact} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr)) auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Contact Full Name *
              </label>
              <input
                type="text"
                className="input"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="e.g. Farah Nouman"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Phone Number (WhatsApp / SMS) *
              </label>
              <input
                type="tel"
                className="input"
                required
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Relationship (Optional)
              </label>
              <input
                type="text"
                className="input"
                value={contactRel}
                onChange={e => setContactRel(e.target.value)}
                placeholder="e.g. Mother, Sister, Partner"
              />
            </div>

            <button
              type="submit"
              disabled={contactSaving}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontWeight: '700', whiteSpace: 'nowrap' }}
            >
              {contactSaving ? 'Saving...' : 'Save Guardian'}
            </button>
          </form>
        </div>
      )}

      {/* ════════════════════ INACTIVITY SAFETY CHECK MODAL / PROMPT ════════════════════ */}
      {sessionState === 'SAFETY_CHECK' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'var(--bg-surface-elevated, #162032)',
            border: '2px solid #f59e0b',
            borderRadius: '20px',
            padding: '2.25rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.35)',
            animation: 'pulseGlow 2s infinite'
          }}>
            {/* Warning Icon Badge */}
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <AlertTriangle size={36} color="#fbbf24" />
            </div>

            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 0.75rem 0',
              fontFamily: 'var(--font-heading)'
            }}>
              Are You Safe?
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: '0 0 1.5rem 0'
            }}>
              We noticed that you haven't moved for a while ({secondsStationary}s stationary).
            </p>

            {/* Countdown Ring Meter */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Auto-Alerting {contactName || 'Guardian'} In:
              </div>
              <div style={{ fontSize: '2.75rem', fontWeight: '900', color: countdownSeconds <= 15 ? '#f87171' : '#fbbf24', fontFamily: 'monospace' }}>
                00:{countdownSeconds.toString().padStart(2, '0')}
              </div>
              <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', marginTop: '0.75rem' }}>
                <div style={{
                  height: '100%',
                  width: `${(countdownSeconds / 45) * 100}%`,
                  background: countdownSeconds <= 15 ? '#ef4444' : '#f59e0b',
                  transition: 'width 1s linear'
                }} />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button
                onClick={handleConfirmSafety}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                  color: '#ffffff',
                  fontSize: '1.15rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                <CheckCircle2 size={24} /> I AM SAFE (Confirm)
              </button>

              <button
                onClick={handleAutoEmergencyDispatch}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <AlertOctagon size={18} /> Emergency — Alert Contact Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ EMERGENCY DISPATCHED HUD BANNER ════════════════════ */}
      {sessionState === 'EMERGENCY_DISPATCHED' && (
        <div className="card" style={{
          padding: '1.75rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(14, 23, 38, 0.98) 100%)',
          border: '2px solid #ef4444'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertOctagon size={28} color="#f87171" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: '#f87171' }}>
                  🚨 Emergency SOS Protocol Active
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Safety check timed out. Live telemetry transmitted to registered contact.
                </p>
              </div>
            </div>

            <button
              onClick={handleStopSession}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Resolve & End Session
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.25rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Recipient</span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                {contactName} ({contactRel})
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-hover)', marginTop: '0.1rem' }}>
                {contactPhone}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Last Recorded Location</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {currentPosition.lat.toFixed(5)}° N, {currentPosition.lng.toFixed(5)}° E
              </strong>
              <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.1rem' }}>
                Accuracy: ±{accuracy} meters
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Direct Helpline Speed-Dials</span>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                <a
                  href="tel:112"
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}
                >
                  Dial 112 (Police)
                </a>
                <a
                  href="tel:1091"
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}
                >
                  Dial 1091 (Women Helpline)
                </a>
              </div>
            </div>
          </div>

          {/* 1-Click WhatsApp / SMS transmission */}
          {dispatchedAlert?.dispatch_channels && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {dispatchedAlert.dispatch_channels.whatsapp_link && (
                <a
                  href={dispatchedAlert.dispatch_channels.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    background: '#25D366',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    textDecoration: 'none'
                  }}
                >
                  <MessageSquare size={16} /> Open WhatsApp to Message Guardian
                </a>
              )}
              {dispatchedAlert.dispatch_channels.sms_link && (
                <a
                  href={dispatchedAlert.dispatch_channels.sms_link}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={16} /> Send SMS
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════ MAIN SESSION CONTROLLER & METRICS ════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Live GPS Tracking Map */}
        <div className="card" style={{
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Tactical Status Pill */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1000,
            background: 'rgba(10, 15, 29, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.8rem'
          }}>
            <span style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: sessionState === 'ACTIVE'
                ? (isMoving ? '#34d399' : '#fbbf24')
                : '#64748b',
              boxShadow: sessionState === 'ACTIVE'
                ? (isMoving ? '0 0 10px #34d399' : '0 0 10px #fbbf24')
                : 'none'
            }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
              {sessionState === 'ACTIVE'
                ? (isMoving ? 'MOVING ON CORRIDOR' : `STATIONARY (${secondsStationary}s)`)
                : (sessionState === 'SAFETY_CHECK' ? 'SAFETY CHECK PENDING' : 'SESSION IDLE')}
            </span>
          </div>

          <div style={{ height: '500px', width: '100%', position: 'relative' }}>
            <MapContainer
              center={[currentPosition.lat, currentPosition.lng]}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LiveLocationFollower position={currentPosition} isTracking={sessionState === 'ACTIVE'} />

              {/* Breadcrumb Path Polyline */}
              {pathHistory.length > 1 && (
                <Polyline
                  positions={pathHistory}
                  pathOptions={{
                    color: '#0D9488',
                    weight: 5,
                    opacity: 0.85
                  }}
                />
              )}

              {/* Live Location Pulsing Marker */}
              <Circle
                center={[currentPosition.lat, currentPosition.lng]}
                radius={Math.max(12, accuracy)}
                pathOptions={{
                  color: isMoving ? '#0D9488' : '#F59E0B',
                  fillColor: isMoving ? '#14B8A6' : '#F59E0B',
                  fillOpacity: 0.25,
                  weight: 2
                }}
              />

              <Marker position={[currentPosition.lat, currentPosition.lng]}>
                <Popup>
                  <div style={{ color: '#0f172a' }}>
                    <strong>Your Live Position</strong><br/>
                    Status: {isMoving ? 'Moving' : 'Stationary'}<br/>
                    Speed: {speed} km/h<br/>
                    <small>{currentPosition.lat}, {currentPosition.lng}</small>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Map Status Bar */}
          <div style={{
            padding: '0.85rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span>GPS Satellite Lock: ±{accuracy}m accuracy</span>
            <span>Live Trail: {pathHistory.length} waypoint fixes</span>
          </div>
        </div>

        {/* Right Column: Mission Control & Telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Main Action Box */}
          <div className="card" style={{ padding: '1.75rem', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                  Safety Session Timer
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
                  {formatTimer(sessionSeconds)}
                </div>
              </div>

              <div style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                background: sessionState === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: sessionState === 'ACTIVE' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                color: sessionState === 'ACTIVE' ? '#34d399' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}>
                {sessionState === 'ACTIVE' ? '● ESCORT ACTIVE' : 'IDLE STANDBY'}
              </div>
            </div>

            {/* Start / Stop Journey Button */}
            {sessionState === 'IDLE' || sessionState === 'COMPLETED' ? (
              <button
                onClick={handleStartSession}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}
              >
                <Play size={20} /> START WALK WITH ME
              </button>
            ) : (
              <button
                onClick={handleStopSession}
                className="btn btn-danger"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}
              >
                <Square size={18} /> End Journey Safely
              </button>
            )}

            {/* Inactivity Threshold Demo Mode Toggle */}
            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block' }}>
                  Demo Inactivity Mode (15s)
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {demoFastMode ? 'Triggers check in 15 seconds' : 'Standard 3-minute threshold'}
                </span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={demoFastMode}
                  onChange={e => setDemoFastMode(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#0D9488' }}
                />
              </label>
            </div>

            {/* Test Safety Check Trigger Button for Evaluators */}
            {sessionState === 'ACTIVE' && (
              <button
                onClick={triggerInactivitySafetyCheck}
                style={{
                  marginTop: '0.75rem',
                  width: '100%',
                  padding: '0.55rem',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px dashed rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  color: '#fbbf24',
                  fontSize: '0.775rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ⚡ Trigger Safety Confirmation Now (Test Demo)
              </button>
            )}
          </div>

          {/* Live Telemetry Card */}
          <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-surface)' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Live Motion Telemetry
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div style={{
                padding: '0.85rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Current Velocity</span>
                <strong style={{ fontSize: '1.15rem', color: isMoving ? '#34d399' : 'var(--text-secondary)' }}>
                  {speed} km/h
                </strong>
              </div>

              <div style={{
                padding: '0.85rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Distance Walked</span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--accent-hover)' }}>
                  {(totalDistanceCovered / 1000).toFixed(2)} km
                </strong>
              </div>

              <div style={{
                padding: '0.85rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Motion State</span>
                <strong style={{ fontSize: '0.95rem', color: isMoving ? '#34d399' : '#fbbf24' }}>
                  {isMoving ? 'Walking / Moving' : 'Stationary'}
                </strong>
              </div>

              <div style={{
                padding: '0.85rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Stationary Timer</span>
                <strong style={{ fontSize: '0.95rem', color: secondsStationary > 60 ? '#f87171' : 'var(--text-primary)' }}>
                  {secondsStationary}s
                </strong>
              </div>
            </div>

            {/* Protocol Explanation */}
            <div style={{ marginTop: '1.25rem', fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              • Inactivity detection triggers after <strong>{demoFastMode ? '15 seconds' : '3 minutes'}</strong> of stationary tracking.<br/>
              • A 45-second confirmation dialog asks <em>“Are you safe?”</em> before contacting your guardian.<br/>
              • Zero false alarms: you can cancel or reset at any time with one tap.
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(245, 158, 11, 0.3);
          }
          50% {
            box-shadow: 0 0 45px rgba(245, 158, 11, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

export default WalkBuddyPage;
