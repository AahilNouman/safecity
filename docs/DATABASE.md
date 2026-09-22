# SafeCity — Database Documentation

## Engine
- **PostgreSQL 16** with **PostGIS 3.4** extension
- Spatial Reference System: **EPSG:4326** (WGS 84)

## Extensions
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## Schema Diagram

```
incident_categories ──┐
                      ├──▶ incidents ◀── admins
                      │        │
                      │        ├──▶ verification_actions
                      │        │
clusters ─────────────┘        └──▶ safety_advisories
```

## Tables

### incident_categories
Extensible category registry. Add new categories by inserting rows.

| Column | Type | Notes |
|:---|:---|:---|
| id | SERIAL PK | Auto-increment |
| name | VARCHAR(100) UNIQUE | Category name |
| description | TEXT | Optional description |
| base_severity | DECIMAL(3,2) | Default severity weight (0.00–1.00) |
| is_active | BOOLEAN | Soft delete |

Default categories: Harassment (0.65), Stalking (0.75), Threat (0.85), Unsafe Area (0.55), Poor Lighting (0.40), Suspicious Activity (0.60), Other (0.50)

### incidents
Core table storing all reported incidents.

| Column | Type | Notes |
|:---|:---|:---|
| id | SERIAL PK | Internal ID |
| public_report_id | VARCHAR(20) UNIQUE | SC-2026-XXXXXX format |
| category_id | FK → incident_categories | Selected category |
| description | TEXT NOT NULL | Incident description (10–2000 chars) |
| latitude/longitude | DECIMAL | Exact coordinates |
| location | GEOGRAPHY(Point, 4326) | PostGIS spatial field (auto-computed) |
| incident_time | TIMESTAMPTZ | When incident occurred |
| ai_category | VARCHAR(100) | AI-predicted category |
| ai_confidence | DECIMAL(5,4) | AI confidence (0.0000–1.0000) |
| severity_score | DECIMAL(3,2) | Computed severity (0.00–1.00) |
| severity_level | VARCHAR(10) | LOW / MEDIUM / HIGH |
| verification_status | VARCHAR(20) | PENDING / VERIFIED / REJECTED |
| verified_by | FK → admins | Admin who verified |
| original_ai_category | VARCHAR(100) | Preserved if admin overrides |
| final_category | VARCHAR(100) | After admin override |

### Spatial Indexing
```sql
CREATE INDEX idx_incidents_location ON incidents USING GIST(location);
```
Enables fast spatial queries: ST_DWithin, ST_Distance, bounding box.

### Privacy Query Example
Public map uses approximate locations:
```sql
SELECT
  ROUND(latitude::numeric, 3) as approx_lat,
  ROUND(longitude::numeric, 3) as approx_lng,
  ic.name as category,
  severity_level
FROM incidents i
JOIN incident_categories ic ON i.category_id = ic.id
WHERE verification_status = 'VERIFIED';
```

## Seed Data
55+ synthetic incidents across Bengaluru with 3 spatial clusters:
- **Cluster A**: Majestic area (~12.977, 77.572)
- **Cluster B**: Koramangala (~12.935, 77.625)
- **Cluster C**: Electronic City (~12.845, 77.660)

⚠️ All seed data is synthetic — clearly labeled as DEMO/DEVELOPMENT.
