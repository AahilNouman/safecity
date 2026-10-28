const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('Integration: Emergency SOS & Inactivity Alert Endpoints', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  await t.test('POST /api/emergency-alerts: accepts valid emergency alert payload', async () => {
    const res = await fetch(`http://localhost:${port}/api/emergency-alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: 'Test Commuter',
        latitude: 12.9716,
        longitude: 77.5946,
        reason: 'SOS',
        contact_name: 'Aahil Guardian',
        contact_phone: '+91 7892548253'
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.alertId);
    assert.ok(data.mapsUrl.includes('12.9716,77.5946'));
    assert.ok(data.whatsappUrl.includes('7892548253'));
  });

  await t.test('POST /api/walk/sos: frontend-compatible alias records inactivity watchdog alert', async () => {
    const res = await fetch(`http://localhost:${port}/api/walk/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: 'Walk Buddy Commuter',
        latitude: 12.9784,
        longitude: 77.6408,
        reason: 'Virtual Walk Inactivity Alert',
        contact_name: 'Aahil Guardian',
        contact_phone: '+91 7892548253'
      })
    });

    // BUG-01 Fix: /api/walk/sos must succeed with 201 Created
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.mapsUrl);
  });

  await t.test('POST /api/emergency-alerts: rejects invalid or missing coordinates', async () => {
    const res = await fetch(`http://localhost:${port}/api/emergency-alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: 'Invalid Test',
        latitude: 'not-a-number',
        longitude: 77.5946,
        contact_phone: '9845077210'
      })
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await t.test('GET /api/emergency-alerts: returns logged emergency dispatches for authorized moderator', async () => {
    const res = await fetch(`http://localhost:${port}/api/emergency-alerts`, {
      headers: {
        'Authorization': 'Bearer sc-jwt-moderator-2026-verified'
      }
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.alerts));
  });
});
