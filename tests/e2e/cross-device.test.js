const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('E2E Cross-Device Simulation: Mobile Reporter -> Central Cloud -> Desktop Moderator -> Commuter Map', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  const baseUrl = `http://localhost:${port}`;
  const mobileTrackingId = `AS-MOB-${Date.now()}`;

  // -------------------------------------------------------------------------
  // STEP 1: Device A (Mobile Phone) captures photo & submits incident report
  // -------------------------------------------------------------------------
  // 1a. Upload photo evidence captured via device camera
  const dummyJpegBytes = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
  const uploadRes = await fetch(`${baseUrl}/api/incidents/upload-evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base64: `data:image/jpeg;base64,${dummyJpegBytes.toString('base64')}`,
      originalName: 'mobile_camera_evidence.jpg',
      mimeType: 'image/jpeg'
    })
  });
  assert.strictEqual(uploadRes.status, 201);
  const uploadData = await uploadRes.json();
  assert.strictEqual(uploadData.success, true);
  assert.ok(uploadData.filePath);
  assert.ok(uploadData.url);

  // 1b. Submit report from mobile client
  const submitRes = await fetch(`${baseUrl}/api/incidents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148'
    },
    body: JSON.stringify({
      report_id: mobileTrackingId,
      category: 'Poor Lighting',
      severity: 'High',
      description: 'Dangerous dark corridor with shattered streetlights near Nagawara junction.',
      latitude: 13.0412,
      longitude: 77.6132,
      location_name: 'Nagawara Junction East Walkway',
      image_paths: [uploadData.filePath],
      image_urls: [uploadData.url],
      is_anonymous: true
    })
  });
  assert.strictEqual(submitRes.status, 201);
  const submitData = await submitRes.json();
  assert.strictEqual(submitData.success, true);
  assert.strictEqual(submitData.status, 'PENDING');

  // -------------------------------------------------------------------------
  // STEP 2: Device B (Desktop Moderator) signs in & retrieves central queue
  // -------------------------------------------------------------------------
  const adminLoginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
    },
    body: JSON.stringify({
      email: 'admin@safecity.bengaluru.in',
      password: 'SafeCity@2026'
    })
  });
  assert.strictEqual(adminLoginRes.status, 200);
  const adminLoginData = await adminLoginRes.json();
  const moderatorToken = adminLoginData.token;

  // Fetch admin incidents list from central store
  const queueRes = await fetch(`${baseUrl}/api/admin/incidents`, {
    headers: {
      'Authorization': `Bearer ${moderatorToken}`
    }
  });
  assert.strictEqual(queueRes.status, 200);
  const queueData = await queueRes.json();
  assert.strictEqual(queueData.success, true);

  // Verify Device A's report is present in moderator's central list
  const incomingReport = queueData.incidents.find(i => i.report_id === mobileTrackingId);
  assert.ok(incomingReport, 'Mobile report must appear in desktop moderator dashboard');
  assert.strictEqual(incomingReport.status, 'PENDING');
  assert.ok(incomingReport.image_urls.length > 0, 'Evidence photo URL must be visible to moderator');

  // 2b. Moderator verifies evidence URLs
  const evidenceRes = await fetch(`${baseUrl}/api/admin/incidents/${mobileTrackingId}/evidence-urls`, {
    headers: {
      'Authorization': `Bearer ${moderatorToken}`
    }
  });
  assert.strictEqual(evidenceRes.status, 200);
  const evidenceData = await evidenceRes.json();
  assert.ok(evidenceData.evidenceUrls.length > 0);

  // 2c. Moderator approves and verifies incident report
  const patchRes = await fetch(`${baseUrl}/api/admin/incidents/${mobileTrackingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${moderatorToken}`
    },
    body: JSON.stringify({
      status: 'VERIFIED',
      moderator_notes: 'Visual confirmation of streetlight failure confirmed.'
    })
  });
  assert.strictEqual(patchRes.status, 200);
  const patchData = await patchRes.json();
  assert.strictEqual(patchData.status, 'VERIFIED');

  // -------------------------------------------------------------------------
  // STEP 3: Device A (Mobile) tracking check confirms VERIFIED status
  // -------------------------------------------------------------------------
  const trackRes = await fetch(`${baseUrl}/api/incidents/track/${mobileTrackingId}`);
  assert.strictEqual(trackRes.status, 200);
  const trackData = await trackRes.json();
  assert.strictEqual(trackData.report.status, 'VERIFIED');

  // -------------------------------------------------------------------------
  // STEP 4: Device C (Commuter) navigation route detects verified hazard
  // -------------------------------------------------------------------------
  const routeRes = await fetch(`${baseUrl}/api/routes/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      routes: [
        {
          id: 'commuter-route-1',
          coordinates: [
            [13.0412, 77.6132] // Passes right by the mobile-reported verified hazard
          ]
        }
      ]
    })
  });
  assert.strictEqual(routeRes.status, 200);
  const routeData = await routeRes.json();
  assert.strictEqual(routeData.analyzedRoutes.length, 1);
  assert.ok(routeData.analyzedRoutes[0].riskPenalty >= 35, 'High hazard penalty must be reflected in route scoring');
  assert.ok(routeData.analyzedRoutes[0].incidentsEncountered.some(i => i.report_id === mobileTrackingId));

  // -------------------------------------------------------------------------
  // STEP 5: Diagnostics endpoint & disk persistence verification
  // -------------------------------------------------------------------------
  const diagRes = await fetch(`${baseUrl}/api/diagnostics`);
  assert.strictEqual(diagRes.status, 200);
  const diagData = await diagRes.json();
  assert.strictEqual(diagData.success, true);
  assert.ok(diagData.databases.disk_persistence.active);
  assert.ok(diagData.databases.disk_persistence.incident_count > 0);
});
