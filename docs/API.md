# SafeCity — API Reference

Base URL: `http://localhost:3001/api`

## Authentication

Admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Health Check

### `GET /api/health`
```json
{ "success": true, "message": "SafeCity API is running", "timestamp": "2026-09-22T12:00:00Z" }
```

---

## Citizen Endpoints

### `POST /api/incidents` — Submit Incident Report
No authentication required.

**Request Body:**
```json
{
  "category_id": 2,
  "description": "Someone followed me from the bus stop for three blocks.",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "incident_time": "2026-09-22T18:30:00Z"
}
```

**Validation:**
- `description`: required, 10–2000 characters
- `category_id`: required, integer
- `latitude`: required, -90 to 90
- `longitude`: required, -180 to 180
- `incident_time`: optional, ISO 8601

**Response (201):**
```json
{
  "success": true,
  "data": {
    "public_report_id": "SC-2026-048271",
    "ai_classification": {
      "category": "Stalking",
      "confidence": 0.89,
      "is_demo": true
    },
    "severity": {
      "severity_score": 0.75,
      "severity_level": "HIGH"
    }
  },
  "message": "Incident reported successfully"
}
```

### `GET /api/incidents` — List Incidents
**Query Params:** `page`, `limit`, `category`, `status`, `date_from`, `date_to`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "incidents": [...],
    "total": 55,
    "page": 1,
    "limit": 20
  }
}
```

### `GET /api/incidents/map` — Map Data (Privacy-Protected)
Returns verified incidents with approximate locations (3 decimal places).

### `GET /api/incidents/hotspots` — DBSCAN Clusters
Returns active spatial clusters.

### `GET /api/incidents/:id` — Get Incident by ID
Accepts numeric ID or public report ID (SC-2026-XXXXXX).

---

## Admin Endpoints (JWT Required)

### `POST /api/admin/login` — Authenticate
```json
{ "email": "admin@safecity.local", "password": "SafeCity@2026" }
```
**Response:** `{ "token": "eyJ..." }`

### `GET /api/admin/dashboard` — Dashboard Stats
Returns: total, pending, verified, rejected counts, category breakdown, daily trends.

### `GET /api/admin/incidents` — Full Incident List
Like citizen list but with exact locations and full details.

### `PATCH /api/admin/incidents/:id/verify` — Verify Report
Updates status to VERIFIED, logs action.

### `PATCH /api/admin/incidents/:id/reject` — Reject Report
```json
{ "rejection_reason": "Duplicate report" }
```

### `PATCH /api/admin/incidents/:id/category` — Override AI Category
```json
{ "new_category": "Harassment", "override_reason": "AI misclassified stalking as harassment" }
```

---

## AI Service Endpoints

Base URL: `http://localhost:8000`

### `POST /predict` — Classify Incident Text
```json
{ "text": "Someone kept following me near the bus stop." }
```
**Response:**
```json
{
  "category": "Stalking",
  "confidence": 0.89,
  "is_demo": true,
  "severity_suggestion": 0.75,
  "all_scores": { "Stalking": 0.89, "Harassment": 0.05, ... }
}
```

### `POST /cluster` — DBSCAN Spatial Clustering
```json
{
  "coordinates": [
    { "lat": 12.977, "lng": 77.572, "category": "Harassment", "severity": 0.6 }
  ],
  "epsilon": 0.005,
  "min_samples": 3
}
```

### `GET /health` — AI Service Health
### `GET /docs` — Swagger UI (auto-generated)

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [{ "field": "description", "message": "Must be at least 10 characters" }]
}
```

| Status | Meaning |
|:---|:---|
| 400 | Bad request / validation error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
