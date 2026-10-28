const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('Integration: Route Safety Analysis API (/api/routes/analyze)', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  await t.test('POST /api/routes/analyze: rejects empty or missing routes array', async () => {
    const res = await fetch(`http://localhost:${port}/api/routes/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 400);
  });

  await t.test('POST /api/routes/analyze: scores routes with GeoJSON [lng, lat] coordinate arrays correctly', async () => {
    // Nagawara to Govindpura corridor with GeoJSON coordinates [longitude, latitude]
    const res = await fetch(`http://localhost:${port}/api/routes/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routes: [
          {
            id: 'route-geojson',
            geometry: {
              coordinates: [
                [77.6142, 13.0235], // Near AS-2026-10492 High Incident
                [77.6118, 13.0195]  // Near AS-2026-10834 High Incident
              ]
            }
          }
        ]
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.analyzedRoutes));
    assert.strictEqual(data.analyzedRoutes.length, 1);
    // BUG-06: Because it passes near High incidents, riskPenalty must be > 0 (not 0 due to coordinate inversion)
    assert.ok(data.analyzedRoutes[0].riskPenalty > 0, `Expected risk penalty > 0, got ${data.analyzedRoutes[0].riskPenalty}`);
    assert.ok(data.analyzedRoutes[0].incidentCount > 0, `Expected incident count > 0, got ${data.analyzedRoutes[0].incidentCount}`);
  });
});
