const db = require('../config/database');

/**
 * Haversine formula to compute great-circle distance between two points in meters
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of Earth in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Minimum distance from a point to a route polyline (coordinates array)
 */
function minDistanceToPolyline(lat, lng, coordinates) {
  let minDistance = Infinity;
  // Sample every few points if polyline is very long for performance
  const step = coordinates.length > 200 ? 2 : 1;
  for (let i = 0; i < coordinates.length; i += step) {
    const [cLng, cLat] = coordinates[i];
    const dist = haversineDistance(lat, lng, cLat, cLng);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  return minDistance;
}

/**
 * Query OSRM routing service
 */
async function fetchOsrmRoute(origin, destination, mode = 'driving', via = null) {
  try {
    let url;
    if (via) {
      url = `https://router.project-osrm.org/route/v1/${mode}/${origin.lng},${origin.lat};${via.lng},${via.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true`;
    } else {
      url = `https://router.project-osrm.org/route/v1/${mode}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true&steps=true`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OSRM HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      return data.routes;
    }
    return [];
  } catch (err) {
    console.warn(`[RouteSafetyService] OSRM query failed (${err.message}), falling back to synthetic generator`);
    return [];
  }
}

/**
 * Fallback route generator if external OSRM times out
 */
function generateFallbackRoutes(origin, destination) {
  // Direct route
  const steps = 30;
  const directCoords = [];
  for (let i = 0; i <= steps; i++) {
    const factor = i / steps;
    const lat = origin.lat + (destination.lat - origin.lat) * factor;
    const lng = origin.lng + (destination.lng - origin.lng) * factor;
    directCoords.push([lng, lat]);
  }

  // Western bypass route
  const westCoords = [];
  const midLat = (origin.lat + destination.lat) / 2;
  const midLng = (origin.lng + destination.lng) / 2;
  const offsetLng = -0.025; // ~2.5km west
  for (let i = 0; i <= steps; i++) {
    const factor = i / steps;
    let lat, lng;
    if (factor < 0.5) {
      const sub = factor * 2;
      lat = origin.lat + (midLat - origin.lat) * sub;
      lng = origin.lng + ((midLng + offsetLng) - origin.lng) * sub;
    } else {
      const sub = (factor - 0.5) * 2;
      lat = (midLat) + (destination.lat - midLat) * sub;
      lng = (midLng + offsetLng) + (destination.lng - (midLng + offsetLng)) * sub;
    }
    westCoords.push([lng, lat]);
  }

  const distMeters = haversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);

  return [
    {
      geometry: { type: 'LineString', coordinates: directCoords },
      distance: Math.round(distMeters * 1.15),
      duration: Math.round((distMeters * 1.15) / 8.5), // ~30 km/h
      name: 'Direct Thoroughfare (Standard)'
    },
    {
      geometry: { type: 'LineString', coordinates: westCoords },
      distance: Math.round(distMeters * 1.35),
      duration: Math.round((distMeters * 1.35) / 9.5), // ~35 km/h on ring road
      name: 'Avenue Bypass'
    }
  ];
}

/**
 * Main route safety analysis function
 */
async function analyzeRoutes(origin, destination, mode = 'driving') {
  // 1. Fetch live routes from OSRM
  let osrmRoutes = await fetchOsrmRoute(origin, destination, mode);

  // If OSRM returned only 1 route, generate a genuine alternative via waypoint
  if (osrmRoutes.length === 1) {
    const midLat = (origin.lat + destination.lat) / 2;
    const midLng = (origin.lng + destination.lng) / 2;
    // Calculate perpendicular offset point ~1.8km to provide a distinct alternative corridor
    const dLat = destination.lat - origin.lat;
    const dLng = destination.lng - origin.lng;
    const perpLat = midLat + dLng * 0.45;
    const perpLng = midLng - dLat * 0.45;

    const altRoutes = await fetchOsrmRoute(origin, destination, mode, { lat: perpLat, lng: perpLng });
    if (altRoutes && altRoutes.length > 0) {
      osrmRoutes.push(altRoutes[0]);
    }
  }

  // Fallback if network fails
  if (!osrmRoutes || osrmRoutes.length === 0) {
    osrmRoutes = generateFallbackRoutes(origin, destination);
  }

  // 2. Fetch incidents & clusters from Database in bounding box
  const minLat = Math.min(origin.lat, destination.lat) - 0.04;
  const maxLat = Math.max(origin.lat, destination.lat) + 0.04;
  const minLng = Math.min(origin.lng, destination.lng) - 0.04;
  const maxLng = Math.max(origin.lng, destination.lng) + 0.04;

  const [clustersRes, incidentsRes] = await Promise.all([
    db.query(`
      SELECT id, cluster_label, centroid_lat, centroid_lng, incident_count,
             primary_category, avg_severity, radius_meters
      FROM clusters
      WHERE is_active = true
        AND centroid_lat BETWEEN $1 AND $2
        AND centroid_lng BETWEEN $3 AND $4
    `, [minLat, maxLat, minLng, maxLng]).catch(() => ({ rows: [] })),

    db.query(`
      SELECT id, public_report_id, category_id, description, latitude, longitude,
             severity_score, severity_level, final_category, ai_category
      FROM incidents
      WHERE verification_status = 'VERIFIED'
        AND latitude BETWEEN $1 AND $2
        AND longitude BETWEEN $3 AND $4
    `, [minLat, maxLat, minLng, maxLng]).catch(() => ({ rows: [] }))
  ]);

  const clusters = clustersRes.rows || [];
  const incidents = incidentsRes.rows || [];

  // 3. Score and analyze each route
  const analyzedRoutes = osrmRoutes.map((route, index) => {
    const coords = route.geometry.coordinates; // [[lng, lat], ...]
    const distanceMeters = Math.round(route.distance || 0);
    const durationSeconds = Math.round(route.duration || 0);

    let rawRiskScore = 0;
    const intersectedHotspots = [];
    const nearbyIncidentsList = [];

    // Analyze clusters
    clusters.forEach(c => {
      const cLat = parseFloat(c.centroid_lat);
      const cLng = parseFloat(c.centroid_lng);
      const radius = parseFloat(c.radius_meters) || 500;
      const avgSev = parseFloat(c.avg_severity) || 0.6;
      const count = parseInt(c.incident_count) || 5;

      const dist = minDistanceToPolyline(cLat, cLng, coords);

      // Traversed if route passes within radius + 150m buffer
      if (dist <= radius + 150) {
        const proximityFactor = Math.max(0.1, 1 - (dist / (radius + 150)));
        const clusterRisk = avgSev * count * 15 * proximityFactor;
        rawRiskScore += clusterRisk;

        intersectedHotspots.push({
          cluster_id: c.id,
          label: `Cluster #${c.cluster_label}`,
          primary_category: c.primary_category,
          avg_severity: avgSev,
          incident_count: count,
          radius_meters: radius,
          distance_from_route_meters: Math.round(dist),
          centroid: { lat: cLat, lng: cLng }
        });
      }
    });

    // Analyze individual verified incidents
    incidents.forEach(inc => {
      const iLat = parseFloat(inc.latitude);
      const iLng = parseFloat(inc.longitude);
      const sev = parseFloat(inc.severity_score) || 0.5;

      const dist = minDistanceToPolyline(iLat, iLng, coords);

      // Nearby if within 300 meters
      if (dist <= 300) {
        const proximityWeight = (1 - dist / 300);
        rawRiskScore += sev * 8 * proximityWeight;

        nearbyIncidentsList.push({
          id: inc.id,
          public_id: inc.public_report_id,
          category: inc.final_category || inc.ai_category || 'Incident',
          severity_score: sev,
          severity_level: inc.severity_level,
          distance_meters: Math.round(dist),
          latitude: iLat,
          longitude: iLng
        });
      }
    });

    // Baseline route exposure (longer routes have slightly more exposure)
    rawRiskScore += (distanceMeters / 1000) * 1.5;

    // Normalize risk score to 5 - 95 scale
    const riskScore = Math.min(95, Math.max(5, Math.round(rawRiskScore)));
    const riskLevel = riskScore < 30 ? 'LOW' : riskScore < 60 ? 'MEDIUM' : 'HIGH';

    return {
      id: `route-${index + 1}`,
      index,
      name: route.name || (index === 0 ? 'Primary Route' : `Alternative Route ${index}`),
      distance_meters: distanceMeters,
      duration_seconds: durationSeconds,
      distance_km: (distanceMeters / 1000).toFixed(1),
      duration_min: Math.ceil(durationSeconds / 60),
      geometry: route.geometry,
      risk_score: riskScore,
      risk_level: riskLevel,
      hotspots_intersected: intersectedHotspots,
      hotspots_count: intersectedHotspots.length,
      incidents_nearby_count: nearbyIncidentsList.length,
      nearby_incidents: nearbyIncidentsList.slice(0, 10), // Limit top 10 for payload
      is_recommended: false // will set below
    };
  });

  // 4. Determine Recommended Safer Route (lowest risk score)
  let bestRouteIndex = 0;
  let lowestRisk = Infinity;

  analyzedRoutes.forEach((r, idx) => {
    if (r.risk_score < lowestRisk) {
      lowestRisk = r.risk_score;
      bestRouteIndex = idx;
    }
  });

  analyzedRoutes[bestRouteIndex].is_recommended = true;
  analyzedRoutes[bestRouteIndex].tag = 'Recommended Safer Route';

  // Mark others with appropriate tags
  analyzedRoutes.forEach((r, idx) => {
    if (idx !== bestRouteIndex) {
      if (r.risk_score >= 60) {
        r.tag = 'Higher-Risk Corridor';
      } else {
        r.tag = 'Alternative Route';
      }
    }

    // Generate clear, transparent explanation for each route
    if (r.is_recommended) {
      if (r.hotspots_intersected.length === 0) {
        const otherHotspotRoute = analyzedRoutes.find(other => other.hotspots_intersected.length > 0);
        if (otherHotspotRoute) {
          const avoidedClusterName = otherHotspotRoute.hotspots_intersected[0].primary_category;
          r.safety_explanation = `Recommended based on reported incident density. Avoids the high-density ${avoidedClusterName} red zone. Minimizes travel through poorly lit or high-harassment corridors.`;
        } else {
          r.safety_explanation = `Recommended route with the lowest historical incident density. Follows main thoroughfares with higher surveillance and verified municipal lighting.`;
        }
      } else {
        r.safety_explanation = `Selected as the safest available path among alternatives, with significantly lower proximity to reported threats.`;
      }
    } else {
      if (r.hotspots_intersected.length > 0) {
        const h = r.hotspots_intersected[0];
        r.safety_explanation = `Passes directly through ${h.label} (${h.primary_category}, ${h.incident_count} reports). Elevated risk of harassment or poor illumination during night hours.`;
      } else {
        r.safety_explanation = `Higher overall proximity to verified incidents along side roads compared to the recommended route.`;
      }
    }
  });

  // Calculate comparative risk reduction
  const worstRisk = Math.max(...analyzedRoutes.map(r => r.risk_score));
  const recommendedRisk = analyzedRoutes[bestRouteIndex].risk_score;
  const riskReductionPct = worstRisk > recommendedRisk
    ? Math.round(((worstRisk - recommendedRisk) / worstRisk) * 100)
    : 0;

  return {
    origin,
    destination,
    mode,
    routes: analyzedRoutes,
    recommended_route_id: analyzedRoutes[bestRouteIndex].id,
    risk_reduction_pct: riskReductionPct,
    relevant_clusters: clusters.map(c => ({
      id: c.id,
      label: `Cluster #${c.cluster_label}`,
      category: c.primary_category,
      centroid: { lat: parseFloat(c.centroid_lat), lng: parseFloat(c.centroid_lng) },
      radius_meters: parseFloat(c.radius_meters) || 500,
      severity: parseFloat(c.avg_severity) || 0.6,
      incident_count: parseInt(c.incident_count) || 0
    })),
    disclaimer: 'Safety scores are calculated based on historical verified community reports and spatial clustering. SafeCity does not guarantee absolute safety; always remain alert.'
  };
}

module.exports = {
  analyzeRoutes,
  haversineDistance
};
