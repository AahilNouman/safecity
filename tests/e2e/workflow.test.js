const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('E2E Workflow: Complete Citizen & Safety Moderator Lifecycle', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  const userEmail = `commuter_${Date.now()}@safecity.in`;
  const userPassword = 'SafePassword@2026';
  const reportTrackingId = `AS-E2E-${Date.now()}`;

  // 1. User Registration
  const regRes = await fetch(`http://localhost:${port}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Pooja Hegde',
      email: userEmail,
      password: userPassword,
      emergency_name: 'Aahil Guardian',
      emergency_phone: '+91 7892548253',
      emergency_relation: 'Guardian'
    })
  });
  assert.strictEqual(regRes.status, 201);

  // 2. User Login
  const loginRes = await fetch(`http://localhost:${port}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      password: userPassword
    })
  });
  assert.strictEqual(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.strictEqual(loginData.success, true);
  assert.ok(loginData.token);

  // 3. User Reports Incident
  const reportRes = await fetch(`http://localhost:${port}/api/incidents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      report_id: reportTrackingId,
      category: 'Harassment',
      severity: 'High',
      description: 'Suspicious vehicle following pedestrians near Nagawara bus stop.',
      latitude: 13.0412,
      longitude: 77.6132,
      location_name: 'Nagawara Bus Stop',
      is_anonymous: false
    })
  });
  assert.strictEqual(reportRes.status, 201);

  // 4. Admin Login
  const adminLoginRes = await fetch(`http://localhost:${port}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@safecity.bengaluru.in',
      password: 'SafeCity@2026'
    })
  });
  assert.strictEqual(adminLoginRes.status, 200);
  const adminData = await adminLoginRes.json();
  const adminToken = adminData.token;

  // 5. Admin Verifies Incident
  const modRes = await fetch(`http://localhost:${port}/api/admin/incidents/${reportTrackingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'VERIFIED' })
  });
  assert.strictEqual(modRes.status, 200);

  // 6. Route Scorer now applies High hazard penalty along this corridor
  const routeRes = await fetch(`http://localhost:${port}/api/routes/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      routes: [
        {
          coordinates: [
            [13.0412, 77.6132] // Matches Nagawara High Hazard location
          ]
        }
      ]
    })
  });
  assert.strictEqual(routeRes.status, 200);
  const routeData = await routeRes.json();
  assert.ok(routeData.analyzedRoutes[0].riskPenalty >= 35);

  // 7. Companion Inactivity Watchdog SOS Dispatch
  const sosRes = await fetch(`http://localhost:${port}/api/walk/sos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: loginData.user.id,
      user_name: loginData.user.name,
      latitude: 13.0412,
      longitude: 77.6132,
      reason: 'Virtual Walk Inactivity Alert',
      contact_name: 'Aahil Guardian',
      contact_phone: '+91 7892548253'
    })
  });
  assert.strictEqual(sosRes.status, 201);
  const sosData = await sosRes.json();
  assert.ok(sosData.whatsappUrl.includes('7892548253'));
});
