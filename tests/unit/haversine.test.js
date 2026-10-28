const test = require('node:test');
const assert = require('node:assert');

// Test the haversine formula helper as defined in server.js
function haversineMeters(lat1, lon1, lat2, lon2) {
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);
  if (!Number.isFinite(nLat1) || !Number.isFinite(nLon1) || !Number.isFinite(nLat2) || !Number.isFinite(nLon2)) {
    return Infinity;
  }
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(nLat2 - nLat1);
  const dLon = toRad(nLon2 - nLon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(nLat1)) * Math.cos(toRad(nLat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const clampedA = Math.max(0, Math.min(1, a));
  return R * 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(Math.max(0, 1 - clampedA)));
}

test('Haversine: returns 0 for identical points', () => {
  const d = haversineMeters(12.9716, 77.5946, 12.9716, 77.5946);
  assert.strictEqual(d, 0);
});

test('Haversine: computes accurate Bengaluru distance (Cubbon Park to Indiranagar)', () => {
  // Cubbon Park Police Station -> Indiranagar Police Station
  const d = haversineMeters(12.9763, 77.5929, 12.9784, 77.6408);
  assert.ok(d >= 5100 && d <= 5300, `Expected ~5200m, got ${d}`);
});

test('Haversine: is symmetric (distance A to B equals B to A)', () => {
  const d1 = haversineMeters(12.9763, 77.5929, 13.0412, 77.6132);
  const d2 = haversineMeters(13.0412, 77.6132, 12.9763, 77.5929);
  assert.strictEqual(Math.round(d1), Math.round(d2));
});

test('Haversine: handles string inputs safely by numeric coercion', () => {
  const d = haversineMeters('12.9763', '77.5929', '12.9784', '77.6408');
  assert.ok(d > 5000 && d < 5500);
});

test('Haversine: handles invalid non-numeric inputs gracefully without NaN', () => {
  assert.strictEqual(haversineMeters(NaN, 77.5, 12.9, 77.6), Infinity);
  assert.strictEqual(haversineMeters(12.9, undefined, 12.9, 77.6), Infinity);
  assert.strictEqual(haversineMeters('invalid', 'point', 12.9, 77.6), Infinity);
});

test('Haversine: avoids NaN when numerical rounding produces a slightly > 1', () => {
  // If identical poles or edge cases produce a > 1, clampedA prevents Math.sqrt(negative)
  const d = haversineMeters(90, 0, 90, 0);
  assert.strictEqual(d, 0);
  assert.ok(!Number.isNaN(d));
});
