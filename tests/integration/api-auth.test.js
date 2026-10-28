const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('Integration: Authentication & User Registration API', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  await t.test('POST /api/auth/register: rejects malformed email address format', async () => {
    const res = await fetch(`http://localhost:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email-string',
        password: 'ValidPassword123'
      })
    });
    // BUG-09: Invalid email format must be rejected with 400
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await t.test('POST /api/auth/register: rejects password shorter than 8 characters', async () => {
    const res = await fetch(`http://localhost:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'valid@safecity.in',
        password: '123'
      })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await t.test('POST /api/auth/register: successfully creates a valid user account', async () => {
    const res = await fetch(`http://localhost:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Pooja Hegde',
        email: `pooja_${Date.now()}@safecity.in`,
        password: 'StrongPassword@2026',
        emergency_name: 'Ananya Guardian',
        emergency_phone: '+91 98450 77210',
        emergency_relation: 'Mother'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.user);
    assert.strictEqual(data.user.name, 'Pooja Hegde');
  });

  await t.test('POST /api/auth/login: rejects wrong password for existing or fallback accounts', async () => {
    // Attempting to log into unregistered account with wrong credentials
    const res = await fetch(`http://localhost:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'unregistered_victim@domain.com',
        password: 'RandomPassword123'
      })
    });
    // BUG-04: Must reject with 401 Unauthorized, never allow fake bypass login!
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });
});
