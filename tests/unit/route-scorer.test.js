const test = require('node:test');
const assert = require('node:assert');

// Pure function isolating the route scoring business logic
function scoreRoutes(routes, incidents, havens) {
  const weights = { High: 35, Medium: 18, Low: 8 };

  function haversineMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const clampedA = Math.max(0, Math.min(1, a));
    return R * 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(Math.max(0, 1 - clampedA)));
  }

  return (routes || []).map((route, idx) => {
    let riskPenalty = 0;
    const nearbyIncidents = new Map();
    const nearbyHavens = new Map();

    const rawCoords = route.coordinates || (route.geometry && route.geometry.coordinates) || [];

    for (const pt of rawCoords) {
      if (!Array.isArray(pt) || pt.length < 2) continue;
      let lat = Number(pt[0]);
      let lng = Number(pt[1]);

      // Normalize GeoJSON [longitude, latitude] vs [latitude, longitude]
      // In Bengaluru, Latitude is ~12-13, Longitude is ~77
      if (Math.abs(lat) > 40 && Math.abs(lng) <= 40) {
        const temp = lat;
        lat = lng;
        lng = temp;
      }

      for (const inc of incidents) {
        const d = haversineMeters(lat, lng, Number(inc.latitude), Number(inc.longitude));
        if (d <= 450 && !nearbyIncidents.has(inc.report_id)) {
          nearbyIncidents.set(inc.report_id, inc);
          riskPenalty += weights[inc.severity] || 15;
        }
      }
      for (const h of havens) {
        const d = haversineMeters(lat, lng, Number(h.latitude), Number(h.longitude));
        if (d <= 400 && !nearbyHavens.has(h.id)) {
          nearbyHavens.set(h.id, h);
        }
      }
    }

    const safetyBonus = Math.min(20, nearbyHavens.size * 5);
    const safetyScore = Math.max(15, Math.min(98, 100 - riskPenalty + safetyBonus));

    return {
      routeIndex: idx,
      riskPenalty,
      safetyBonus,
      safetyScore,
      incidentCount: nearbyIncidents.size,
      havenCount: nearbyHavens.size
    };
  });
}

const mockHavens = [
  { id: 1, name: 'Cubbon Park Police', latitude: 12.9763, longitude: 77.5929 },
  { id: 2, name: 'Bowring Hospital ER', latitude: 12.9823, longitude: 77.6041 },
  { id: 3, name: 'Indiranagar Police', latitude: 12.9784, longitude: 77.6408 },
  { id: 4, name: 'Apollo Pharmacy 24x7', latitude: 12.9719, longitude: 77.6412 },
  { id: 5, name: 'MedPlus 24x7', latitude: 12.9882, longitude: 77.6038 }
];

const mockIncidents = [
  { report_id: 'INC-HIGH', severity: 'High', latitude: 13.0235, longitude: 77.6142 },
  { report_id: 'INC-MED', severity: 'Medium', latitude: 12.9885, longitude: 77.6048 },
  { report_id: 'INC-LOW', severity: 'Low', latitude: 12.9745, longitude: 77.6432 }
];

test('Route Scorer: baseline route with no hazards gets 98 score with safe haven bonus', () => {
  const routes = [{ coordinates: [[12.9763, 77.5929], [12.9823, 77.6041]] }];
  const scored = scoreRoutes(routes, [], mockHavens);
  assert.strictEqual(scored[0].riskPenalty, 0);
  assert.strictEqual(scored[0].havenCount, 2);
  assert.strictEqual(scored[0].safetyBonus, 10);
  assert.strictEqual(scored[0].safetyScore, 98); // Clamped at 98
});

test('Route Scorer: applies correct tiered penalties (High=35, Med=18, Low=8)', () => {
  // Pass directly through High incident
  const highRoute = [{ coordinates: [[13.0235, 77.6142]] }];
  const highScored = scoreRoutes(highRoute, mockIncidents, []);
  assert.strictEqual(highScored[0].riskPenalty, 35);
  assert.strictEqual(highScored[0].safetyScore, 65);

  // Pass directly through Medium incident
  const medRoute = [{ coordinates: [[12.9885, 77.6048]] }];
  const medScored = scoreRoutes(medRoute, mockIncidents, []);
  assert.strictEqual(medScored[0].riskPenalty, 18);
  assert.strictEqual(medScored[0].safetyScore, 82);

  // Pass directly through Low incident
  const lowRoute = [{ coordinates: [[12.9745, 77.6432]] }];
  const lowScored = scoreRoutes(lowRoute, mockIncidents, []);
  assert.strictEqual(lowScored[0].riskPenalty, 8);
  assert.strictEqual(lowScored[0].safetyScore, 92);
});

test('Route Scorer: deduplicates multiple points hitting the same incident', () => {
  // A route with 5 waypoints all within 100m of the same High incident
  const route = [{
    coordinates: [
      [13.0235, 77.6142],
      [13.0236, 77.6143],
      [13.0237, 77.6144],
      [13.0238, 77.6145]
    ]
  }];
  const scored = scoreRoutes(route, mockIncidents, []);
  assert.strictEqual(scored[0].incidentCount, 1);
  assert.strictEqual(scored[0].riskPenalty, 35); // Penalized once, not 4 times!
});

test('Route Scorer: caps safe haven bonus at maximum 20 points', () => {
  // Route passing all 5 safe havens
  const route = [{
    coordinates: mockHavens.map(h => [h.latitude, h.longitude])
  }];
  const scored = scoreRoutes(route, [], mockHavens);
  assert.strictEqual(scored[0].havenCount, 5);
  assert.strictEqual(scored[0].safetyBonus, 20); // 5 * 5 = 25, but capped at 20!
});

test('Route Scorer: enforces minimum safety score clamp of 15', () => {
  // Excessive risk penalties that would push score below 0
  const multipleHazards = [
    { report_id: 'H1', severity: 'High', latitude: 12.90, longitude: 77.50 },
    { report_id: 'H2', severity: 'High', latitude: 12.90, longitude: 77.50 },
    { report_id: 'H3', severity: 'High', latitude: 12.90, longitude: 77.50 },
    { report_id: 'H4', severity: 'High', latitude: 12.90, longitude: 77.50 }
  ];
  const route = [{ coordinates: [[12.90, 77.50]] }];
  const scored = scoreRoutes(route, multipleHazards, []);
  // Risk = 140 -> 100 - 140 = -40, clamped to 15
  assert.strictEqual(scored[0].safetyScore, 15);
});

test('Route Scorer: transparently normalizes GeoJSON [lng, lat] coordinate order', () => {
  // In OSRM GeoJSON format, coordinates are [lng, lat]
  const geoJsonRoute = [{
    geometry: {
      coordinates: [
        [77.6142, 13.0235] // [lng, lat] for INC-HIGH
      ]
    }
  }];
  const scored = scoreRoutes(geoJsonRoute, mockIncidents, []);
  assert.strictEqual(scored[0].incidentCount, 1);
  assert.strictEqual(scored[0].riskPenalty, 35);
});
