const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
process.env.NODE_ENV = 'test';
const app = require('../../backend/server');

test('Integration: GET /api/health returns 200 OK with service metadata', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => server.close());

  const res = await fetch(`http://localhost:${port}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'ok');
  assert.strictEqual(data.service, 'SafeCity Civic API');
  assert.ok(data.timestamp);
});
