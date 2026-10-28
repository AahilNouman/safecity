// tests/e2e/realtime-broadcast.test.js
// Verifies instant cross-device broadcast from Incognito/Mobile to Desktop Moderator Dashboard via SSE

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('Instant Cross-Device Real-Time Broadcast & Synchronization', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  const baseUrl = `http://localhost:${port}`;
  const incognitoReportId = `AS-INC-${Date.now()}`;

  // 1. Establish SSE stream connection simulating the Desktop Moderator Dashboard
  const sseReq = http.request(`${baseUrl}/api/incidents/stream`, {
    headers: { 'Accept': 'text/event-stream' }
  });

  const receivedEvents = [];
  let sseConnected = false;

  await new Promise((resolve, reject) => {
    sseReq.on('response', (res) => {
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers['content-type'], 'text/event-stream');
      sseConnected = true;

      let buffer = '';
      res.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // keep remainder
        for (const block of lines) {
          if (!block.trim()) continue;
          const eventMatch = block.match(/event:\s*([^\n]+)/);
          const dataMatch = block.match(/data:\s*([^\n]+)/);
          if (dataMatch) {
            try {
              receivedEvents.push({
                event: eventMatch ? eventMatch[1].trim() : 'message',
                data: JSON.parse(dataMatch[1].trim())
              });
            } catch (e) {}
          }
        }
      });
      resolve();
    });
    sseReq.on('error', reject);
    sseReq.end();
  });

  assert.strictEqual(sseConnected, true, 'Desktop moderator SSE stream must connect');

  // Wait a moment for handshake
  await new Promise(r => setTimeout(r, 60));
  assert.ok(receivedEvents.some(e => e.event === 'handshake'), 'Handshake event must be delivered');

  // 2. Device A (Chrome Incognito) submits an incident
  const submitRes = await fetch(`${baseUrl}/api/incidents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36'
    },
    body: JSON.stringify({
      report_id: incognitoReportId,
      category: 'Harassment',
      severity: 'High',
      description: 'Incognito report: verbal harassment at Indiranagar metro station exit.',
      latitude: 12.9784,
      longitude: 77.6408,
      location_name: 'Indiranagar Metro Exit A',
      is_anonymous: true
    })
  });
  assert.strictEqual(submitRes.status, 201);

  // Wait briefly for real-time broadcast (< 100ms)
  await new Promise(r => setTimeout(r, 100));

  // 3. Verify Desktop Moderator Dashboard received INSERT event instantly without refresh
  const insertEvent = receivedEvents.find(e => e.event === 'incident' && e.data.eventType === 'INSERT' && e.data.incident.report_id === incognitoReportId);
  assert.ok(insertEvent, 'Desktop Moderator Dashboard must receive live INSERT broadcast immediately');
  assert.strictEqual(insertEvent.data.incident.status, 'PENDING');

  // 4. Authenticate Moderator & verify report
  const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@safecity.bengaluru.in', password: 'SafeCity@2026' })
  });
  const { token } = await loginRes.json();

  const moderateRes = await fetch(`${baseUrl}/api/admin/incidents/${incognitoReportId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status: 'VERIFIED' })
  });
  assert.strictEqual(moderateRes.status, 200);

  // Wait briefly for real-time broadcast (< 100ms)
  await new Promise(r => setTimeout(r, 100));

  // 5. Verify Desktop Moderator Dashboard received UPDATE event instantly without refresh
  const updateEvent = receivedEvents.find(e => e.event === 'incident' && e.data.eventType === 'UPDATE' && e.data.incident.report_id === incognitoReportId);
  assert.ok(updateEvent, 'Desktop Moderator Dashboard must receive live UPDATE broadcast immediately');
  assert.strictEqual(updateEvent.data.incident.status, 'VERIFIED');

  sseReq.destroy();
});
