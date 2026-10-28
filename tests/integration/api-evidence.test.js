const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('Integration: Supabase Config & Photo Evidence Endpoints', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  await t.test('GET /api/config/supabase: returns public client configuration', async () => {
    const res = await fetch(`http://localhost:${port}/api/config/supabase`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(typeof data.isConfigured, 'boolean');
    assert.strictEqual(data.storageBucket, 'incident-evidence');
  });

  await t.test('POST /api/incidents/upload-evidence: rejects empty or missing payload', async () => {
    const res = await fetch(`http://localhost:${port}/api/incidents/upload-evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await t.test('POST /api/incidents/upload-evidence: uploads valid photo evidence and returns url', async () => {
    const validJpegBytes = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
    const base64Str = `data:image/jpeg;base64,${validJpegBytes.toString('base64')}`;

    const res = await fetch(`http://localhost:${port}/api/incidents/upload-evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64: base64Str,
        originalName: 'street_lighting.jpg',
        mimeType: 'image/jpeg'
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.filePath);
    assert.ok(data.url);
  });

  await t.test('POST /api/incidents: associates photo evidence with incident report', async () => {
    const reportId = `AS-PHOTO-${Date.now()}`;
    const res = await fetch(`http://localhost:${port}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_id: reportId,
        category: 'Poor Lighting',
        description: 'Dark alley with streetlights damaged. Photo attached.',
        latitude: 12.9716,
        longitude: 77.5946,
        image_paths: ['evidence/sample_photo.jpg'],
        image_urls: ['https://example.supabase.co/storage/v1/object/public/incident-evidence/sample_photo.jpg']
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.report_id, reportId);
  });

  await t.test('GET /api/admin/incidents/:reportId/evidence-urls: returns evidence URLs for moderator', async () => {
    const reportId = `AS-PHOTO-${Date.now()}`;
    // First create report with image path
    await fetch(`http://localhost:${port}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_id: reportId,
        category: 'Harassment',
        description: 'Evidence verification test for moderator dashboard.',
        latitude: 12.9716,
        longitude: 77.5946,
        image_paths: ['evidence/test_image.jpg']
      })
    });

    const res = await fetch(`http://localhost:${port}/api/admin/incidents/${reportId}/evidence-urls`, {
      headers: {
        'Authorization': 'Bearer sc-jwt-moderator-2026-verified'
      }
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.evidenceUrls));
  });
});
