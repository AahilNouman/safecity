const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('Integration: Admin Security & Incident Moderation API', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  await t.test('GET /api/admin/incidents: rejects unauthenticated requests with 401', async () => {
    const res = await fetch(`http://localhost:${port}/api/admin/incidents`);
    // BUG-03: Endpoint must be protected by auth
    assert.strictEqual(res.status, 401);
  });

  await t.test('PATCH /api/admin/incidents/:reportId: rejects unauthenticated requests with 401', async () => {
    const res = await fetch(`http://localhost:${port}/api/admin/incidents/AS-2026-10492`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'VERIFIED' })
    });
    // BUG-02: Endpoint must be protected by auth
    assert.strictEqual(res.status, 401);
  });

  await t.test('POST /api/admin/login: rejects invalid credentials with 401', async () => {
    const res = await fetch(`http://localhost:${port}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@safecity.in', password: 'WrongPassword' })
    });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await t.test('POST /api/admin/login: authenticates authorized moderator and returns verified token', async () => {
    const res = await fetch(`http://localhost:${port}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@safecity.bengaluru.in',
        password: 'SafeCity@2026'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.token, 'sc-jwt-moderator-2026-verified');
  });

  await t.test('PATCH /api/admin/incidents/:reportId: returns 404 for non-existent reportId', async () => {
    const res = await fetch(`http://localhost:${port}/api/admin/incidents/NONEXISTENT-999`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sc-jwt-moderator-2026-verified'
      },
      body: JSON.stringify({ status: 'REJECTED' })
    });
    // BUG-07: Non-existent reportId must return 404, not 200
    assert.strictEqual(res.status, 404);
  });

  await t.test('PATCH /api/admin/incidents/:reportId: updates valid report with valid admin token', async () => {
    const res = await fetch(`http://localhost:${port}/api/admin/incidents/AS-2026-10492`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sc-jwt-moderator-2026-verified'
      },
      body: JSON.stringify({ status: 'VERIFIED' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.status, 'VERIFIED');
  });
});
