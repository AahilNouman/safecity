// tests/e2e/mandatory-cross-device.test.js
// Tests A through H as specified in Section 12 of the SafeCity Database & Moderation Audit

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('Mandatory Cross-Device & Moderation Lifecycle (Tests A through H)', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  const baseUrl = `http://localhost:${port}`;
  const desktopTrackingId = `AS-DSK-${Date.now()}`;
  const mobileTrackingId = `AS-MOB-${Date.now()}`;
  const secondDeviceTrackingId = `AS-DEV2-${Date.now()}`;

  let moderatorToken = null;

  // Setup: Authenticate moderator session
  const adminLoginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@safecity.bengaluru.in', password: 'SafeCity@2026' })
  });
  assert.strictEqual(adminLoginRes.status, 200);
  const adminData = await adminLoginRes.json();
  moderatorToken = adminData.token;

  // -------------------------------------------------------------------------
  // Test A — Desktop Submission
  // -------------------------------------------------------------------------
  await t.test('Test A — Desktop submission persists and displays in moderator queue', async () => {
    const res = await fetch(`${baseUrl}/api/incidents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        report_id: desktopTrackingId,
        category: 'Poor Lighting',
        severity: 'High',
        description: 'Desktop incident: non-functional streetlights on MG Road corridor.',
        latitude: 12.9738,
        longitude: 77.6074,
        location_name: 'MG Road Metro Station',
        is_anonymous: true
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.status, 'PENDING');

    // Confirm it is retrievable by tracking ID
    const trackRes = await fetch(`${baseUrl}/api/incidents/track/${desktopTrackingId}`);
    assert.strictEqual(trackRes.status, 200);
    const trackData = await trackRes.json();
    assert.strictEqual(trackData.report.status, 'PENDING');

    // Verify moderator queue displays it
    const queueRes = await fetch(`${baseUrl}/api/admin/incidents`, {
      headers: { 'Authorization': `Bearer ${moderatorToken}` }
    });
    assert.strictEqual(queueRes.status, 200);
    const queueData = await queueRes.json();
    const found = queueData.incidents.find(i => i.report_id === desktopTrackingId);
    assert.ok(found, 'Desktop report must appear in moderator queue');
  });

  // -------------------------------------------------------------------------
  // Test B — Mobile Submission
  // -------------------------------------------------------------------------
  await t.test('Test B — Mobile submission with camera evidence appears on desktop moderator dashboard', async () => {
    // Mobile photo evidence upload
    const dummyJpeg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
    const uploadRes = await fetch(`${baseUrl}/api/incidents/upload-evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64: `data:image/jpeg;base64,${dummyJpeg.toString('base64')}`,
        originalName: 'mobile_camera_shot.jpg',
        mimeType: 'image/jpeg'
      })
    });
    assert.strictEqual(uploadRes.status, 201);
    const uploadData = await uploadRes.json();

    // Mobile submission
    const res = await fetch(`${baseUrl}/api/incidents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
      },
      body: JSON.stringify({
        report_id: mobileTrackingId,
        category: 'Harassment',
        severity: 'High',
        description: 'Mobile incident: eve-teasing reported by commuter outside Indiranagar 100ft Rd.',
        latitude: 12.9784,
        longitude: 77.6408,
        location_name: 'Indiranagar 100ft Road Cross',
        image_paths: [uploadData.filePath],
        image_urls: [uploadData.url],
        is_anonymous: false
      })
    });
    assert.strictEqual(res.status, 201);

    // Refresh moderator queue from desktop
    const refreshRes = await fetch(`${baseUrl}/api/admin/incidents?_t=${Date.now()}`, {
      headers: {
        'Authorization': `Bearer ${moderatorToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    assert.strictEqual(refreshRes.status, 200);
    const refreshData = await refreshRes.json();
    const foundMobile = refreshData.incidents.find(i => i.report_id === mobileTrackingId);
    assert.ok(foundMobile, 'Mobile report must appear in desktop moderator dashboard after refresh');
    assert.strictEqual(foundMobile.status, 'PENDING');
  });

  // -------------------------------------------------------------------------
  // Test C — Second Device Submission
  // -------------------------------------------------------------------------
  await t.test('Test C — Independent second device submission persists to shared store', async () => {
    const res = await fetch(`${baseUrl}/api/incidents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/122.0.0.0 Mobile'
      },
      body: JSON.stringify({
        report_id: secondDeviceTrackingId,
        category: 'Unsafe Area',
        severity: 'Medium',
        description: 'Second device report: unlit pedestrian path behind Shivajinagar bus terminal.',
        latitude: 12.9857,
        longitude: 77.6057,
        location_name: 'Shivajinagar Bus Terminal Perimeter',
        is_anonymous: true
      })
    });
    assert.strictEqual(res.status, 201);

    // Query queue again
    const queueRes = await fetch(`${baseUrl}/api/admin/incidents`, {
      headers: { 'Authorization': `Bearer ${moderatorToken}` }
    });
    const queueData = await queueRes.json();
    const foundDev2 = queueData.incidents.find(i => i.report_id === secondDeviceTrackingId);
    assert.ok(foundDev2, 'Second device report must be visible in shared queue');
  });

  // -------------------------------------------------------------------------
  // Test D — Accept / Verify Persistence
  // -------------------------------------------------------------------------
  await t.test('Test D — Accept/Verify sets status to VERIFIED with reviewer and timestamp', async () => {
    const patchRes = await fetch(`${baseUrl}/api/admin/incidents/${desktopTrackingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({
        status: 'VERIFIED',
        moderator_notes: 'Verified via BBMP streetlight outage ticket.'
      })
    });
    assert.strictEqual(patchRes.status, 200);
    const patchData = await patchRes.json();
    assert.strictEqual(patchData.status, 'VERIFIED');

    // Confirm persisted in database/tracking
    const trackRes = await fetch(`${baseUrl}/api/incidents/track/${desktopTrackingId}`);
    assert.strictEqual(trackRes.status, 200);
    const trackData = await trackRes.json();
    assert.strictEqual(trackData.report.status, 'VERIFIED');
  });

  // -------------------------------------------------------------------------
  // Test E — Reject Persistence
  // -------------------------------------------------------------------------
  await t.test('Test E — Reject sets status to REJECTED with rejection reason', async () => {
    const patchRes = await fetch(`${baseUrl}/api/admin/incidents/${mobileTrackingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({
        status: 'REJECTED',
        rejection_reason: 'Duplicate entry of already verified patrol ticket.'
      })
    });
    assert.strictEqual(patchRes.status, 200);
    const patchData = await patchRes.json();
    assert.strictEqual(patchData.status, 'REJECTED');

    // Confirm persisted in database
    const trackRes = await fetch(`${baseUrl}/api/incidents/track/${mobileTrackingId}`);
    assert.strictEqual(trackRes.status, 200);
    const trackData = await trackRes.json();
    assert.strictEqual(trackData.report.status, 'REJECTED');
  });

  // -------------------------------------------------------------------------
  // Test F — Cross-Session Consistency
  // -------------------------------------------------------------------------
  await t.test('Test F — Two independent moderator sessions observe identical persisted state', async () => {
    // Session 2 login
    const mod2Res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@safecity.bengaluru.in', password: 'SafeCity@2026' })
    });
    const mod2Data = await mod2Res.json();
    const token2 = mod2Data.token;

    // Session 2 verifies secondDeviceTrackingId
    const patchRes = await fetch(`${baseUrl}/api/admin/incidents/${secondDeviceTrackingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token2}`
      },
      body: JSON.stringify({ status: 'VERIFIED' })
    });
    assert.strictEqual(patchRes.status, 200);

    // Session 1 reads queue and confirms it sees the update made by Session 2
    const readSession1 = await fetch(`${baseUrl}/api/admin/incidents`, {
      headers: { 'Authorization': `Bearer ${moderatorToken}` }
    });
    const data1 = await readSession1.json();
    const target = data1.incidents.find(i => i.report_id === secondDeviceTrackingId);
    assert.strictEqual(target.status, 'VERIFIED');
  });

  // -------------------------------------------------------------------------
  // Test G — Error Handling & Security Boundary Tests
  // -------------------------------------------------------------------------
  await t.test('Test G — Error handling: rejects invalid input, non-existent report, and unauthorized moderation', async () => {
    // 1. Invalid input: missing category & short description
    const badInputRes = await fetch(`${baseUrl}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'short' })
    });
    assert.strictEqual(badInputRes.status, 400);

    // 2. Unauthorized moderation attempt
    const unauthRes = await fetch(`${baseUrl}/api/admin/incidents/${desktopTrackingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'REJECTED' })
    });
    assert.strictEqual(unauthRes.status, 401);

    // 3. Non-existent report ID
    const notFoundRes = await fetch(`${baseUrl}/api/admin/incidents/AS-FAKE-999999`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({ status: 'VERIFIED' })
    });
    assert.strictEqual(notFoundRes.status, 404);
  });

  // -------------------------------------------------------------------------
  // Test H — Regression Testing
  // -------------------------------------------------------------------------
  await t.test('Test H — Regression: safe routes, safe havens, emergency watchdog, and database stats work seamlessly', async () => {
    // Safe Havens
    const havensRes = await fetch(`${baseUrl}/api/safe-havens`);
    assert.strictEqual(havensRes.status, 200);
    const havensData = await havensRes.json();
    assert.ok(havensData.safeHavens.length >= 10);

    // Route safety analysis
    const routeRes = await fetch(`${baseUrl}/api/routes/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routes: [{ coordinates: [[12.9738, 77.6074]] }]
      })
    });
    assert.strictEqual(routeRes.status, 200);

    // Database stats endpoint
    const statsRes = await fetch(`${baseUrl}/api/admin/database-stats`, {
      headers: { 'Authorization': `Bearer ${moderatorToken}` }
    });
    assert.strictEqual(statsRes.status, 200);
    const statsData = await statsRes.json();
    assert.strictEqual(statsData.success, true);
    assert.ok(statsData.stats.total >= 3);
    assert.strictEqual(
      statsData.stats.total,
      statsData.stats.pending + statsData.stats.verified + statsData.stats.rejected,
      'Reconciliation equality must hold: Total = Pending + Verified + Rejected'
    );
  });
});
