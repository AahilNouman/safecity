const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

describe('SafeCity Routes & Virtual Walk Safety API', () => {
  let adminToken;

  beforeAll(async () => {
    // Authenticate demo admin to get a valid token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@safecity.local',
        password: 'SafeCity@2026'
      });
    adminToken = res.body?.data?.token;
  });

  afterAll(async () => {
    if (db.pool) {
      await db.pool.end();
    }
  });

  describe('GET /api/routes/presets', () => {
    it('should return available corridor presets including Nagawara to Shivajinagar', async () => {
      const res = await request(app)
        .get('/api/routes/presets')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);

      const nagawaraPreset = res.body.data.find(p => p.id === 'nagawara-shivajinagar');
      expect(nagawaraPreset).toBeDefined();
      expect(nagawaraPreset.origin.name).toContain('Nagawara');
      expect(nagawaraPreset.destination.name).toContain('Shivajinagar');
    });
  });

  describe('POST /api/routes/analyze', () => {
    it('should analyze real-time routes from Nagawara to Shivajinagar and identify safer corridor', async () => {
      const payload = {
        origin: { lat: 13.0400, lng: 77.6250, name: 'Nagawara, Bengaluru' },
        destination: { lat: 12.9850, lng: 77.6050, name: 'Shivajinagar, Bengaluru' },
        mode: 'driving'
      };

      const res = await request(app)
        .post('/api/routes/analyze')
        .send(payload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.routes).toBeDefined();
      expect(res.body.data.routes.length).toBeGreaterThanOrEqual(1);

      // Verify recommended route exists and has lower-risk tag
      const recommended = res.body.data.routes.find(r => r.is_recommended);
      expect(recommended).toBeDefined();
      expect(recommended.tag).toBe('Recommended Safer Route');
      expect(recommended.safety_explanation).toBeDefined();
      expect(recommended.risk_score).toBeGreaterThanOrEqual(0);
      expect(recommended.risk_score).toBeLessThanOrEqual(100);

      // Check relevant clusters returned
      expect(Array.isArray(res.body.data.relevant_clusters)).toBe(true);
    }, 15000); // 15s timeout for OSRM fetch
  });

  describe('POST /api/safety/emergency-alert', () => {
    it('should log an emergency SOS alert with live GPS coordinates and dispatch payload', async () => {
      const alertPayload = {
        alert_type: 'INACTIVITY_TIMEOUT',
        latitude: 13.0152,
        longitude: 77.6178,
        address: 'Near Govindpura Bus Stop, Bengaluru',
        contact_name: 'Farah Nouman',
        contact_phone: '+919876543210',
        contact_relationship: 'Sister',
        session_duration_seconds: 240,
        details: {
          stationary_seconds: 180,
          speed_kmh: 0
        }
      };

      const res = await request(app)
        .post('/api/safety/emergency-alert')
        .send(alertPayload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.alert_id).toBeDefined();
      expect(res.body.data.status).toBe('TRIGGERED');
      expect(res.body.data.contact.name).toBe('Farah Nouman');
      expect(res.body.data.contact.phone).toBe('+919876543210');
      expect(res.body.data.dispatch_message).toContain('EMERGENCY ALERT');
      expect(res.body.data.dispatch_channels.whatsapp_link).toContain('https://wa.me/919876543210');
    });
  });

  describe('PUT /api/auth/emergency-contact', () => {
    it('should update the authenticated user emergency contact', async () => {
      const res = await request(app)
        .put('/api/auth/emergency-contact')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          emergency_contact_name: 'Dr. Nouman',
          emergency_contact_phone: '+919123456789',
          emergency_contact_relationship: 'Father'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.emergency_contact_name).toBe('Dr. Nouman');
      expect(res.body.data.emergency_contact).toBe('+919123456789');
      expect(res.body.data.emergency_contact_relationship).toBe('Father');
    });
  });
});
