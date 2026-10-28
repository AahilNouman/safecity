const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('Integration: Incidents Reporting & Tracking API', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  await t.test('GET /api/incidents: returns list of community incidents', async () => {
    const res = await fetch(`http://localhost:${port}/api/incidents`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.incidents));
    assert.ok(data.incidents.length > 0);
  });

  await t.test('POST /api/incidents: rejects descriptions that are too short (< 10 chars)', async () => {
    const res = await fetch(`http://localhost:${port}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Poor Lighting',
        description: 'Short',
        latitude: 12.9716,
        longitude: 77.5946
      })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await t.test('POST /api/incidents: creates valid incident and retrieves it via tracking endpoint', async () => {
    const trackingId = `AS-TEST-${Date.now()}`;
    const res = await fetch(`http://localhost:${port}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_id: trackingId,
        category: 'Poor Lighting',
        description: 'Streetlight pole completely broken near dark crossroad.',
        latitude: 12.9716,
        longitude: 77.5946,
        location_name: 'MG Road Metro Exit',
        severity: 'Medium',
        is_anonymous: true
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.report_id, trackingId);

    // Now track it
    const trackRes = await fetch(`http://localhost:${port}/api/incidents/track/${trackingId}`);
    assert.strictEqual(trackRes.status, 200);
    const trackData = await trackRes.json();
    assert.strictEqual(trackData.success, true);
    assert.strictEqual(trackData.report.report_id, trackingId);
  });

  await t.test('GET /api/incidents/track/:reportId: returns 404 for invalid tracking ID', async () => {
    const res = await fetch(`http://localhost:${port}/api/incidents/track/INVALID-TRACKING-ID-999`);
    assert.strictEqual(res.status, 404);
  });
});
