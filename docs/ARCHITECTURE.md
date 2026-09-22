# SafeCity — System Architecture

## Overview

SafeCity follows a **microservices-inspired monorepo** architecture with 4 clearly separated services:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React 18 PWA (Vite)                                      │   │
│  │  ├── Citizen Interface (report, map, feed)                │   │
│  │  ├── Admin Dashboard (verify, analytics, hotspots)        │   │
│  │  ├── Leaflet.js + OpenStreetMap (mapping)                 │   │
│  │  └── Service Worker (offline queue)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │ HTTP/REST                         │
├─────────────────────────────────────────────────────────────────┤
│                      API GATEWAY TIER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Node.js + Express.js                                     │   │
│  │  ├── /api/incidents  — Citizen CRUD + map data            │   │
│  │  ├── /api/admin      — Auth + verification + dashboard    │   │
│  │  ├── /api/ai         — AI proxy                           │   │
│  │  ├── JWT Middleware   — Token verification                │   │
│  │  ├── Rate Limiter     — Request throttling                │   │
│  │  └── Helmet + CORS    — Security headers                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                       │              │                           │
├───────────────────────┼──────────────┼──────────────────────────┤
│              DATA TIER │    AI TIER   │                          │
│  ┌────────────────────┐│ ┌───────────┴────────────────────┐    │
│  │  PostgreSQL 16     ││ │  Python FastAPI                 │    │
│  │  + PostGIS 3.4     ││ │  ├── DistilBERT Classifier     │    │
│  │  ├── incidents     ││ │  │   (demo / production)       │    │
│  │  ├── categories    ││ │  ├── DBSCAN Clustering         │    │
│  │  ├── admins        ││ │  ├── Text Preprocessing        │    │
│  │  ├── clusters      ││ │  └── Severity Suggestion       │    │
│  │  ├── spatial idx   ││ │                                 │    │
│  │  └── verification  ││ └────────────────────────────────┘    │
│  └────────────────────┘│                                        │
├─────────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                                │
│  Docker Compose · .env Configuration · Git                      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Incident Report Lifecycle

```
1. Citizen opens PWA → taps "Report Incident"
2. Fills form: category, description, GPS/map location
3. Frontend POST /api/incidents → Express backend
4. Backend generates unique report ID (SC-2026-XXXXXX)
5. Backend calls AI service POST /predict
6. AI classifies text → returns category + confidence
7. Backend calculates severity score (rule-based)
8. Incident stored in PostgreSQL with PostGIS geography
9. Citizen receives report ID confirmation
10. Incident appears as PENDING in admin queue
11. Admin reviews: AI category, confidence, location, description
12. Admin verifies/rejects → status updated, action logged
13. Verified incidents appear on citizen safety map
14. DBSCAN clusters nearby verified incidents into hotspots
15. Community feed shows anonymized safety information
```

## Privacy Architecture

| Data | Citizen Map | Admin View |
|:---|:---|:---|
| Location | Approximate (3 decimal places) | Exact coordinates |
| Description | Not shown | Full text |
| Category | Shown | Shown |
| Severity | Shown | Shown + score |
| Reporter identity | Not collected | Not available |
| Timestamp | Relative ("2 days ago") | Exact |

## Security Layers

1. **JWT Authentication** — Admin endpoints require valid token
2. **bcrypt** — Password hashing with salt rounds
3. **Helmet** — Secure HTTP headers
4. **CORS** — Whitelist frontend origin
5. **Rate Limiting** — Prevent abuse (100 req/15min general, 5 req/15min auth)
6. **Input Validation** — express-validator on all inputs
7. **Parameterized Queries** — SQL injection prevention
8. **Environment Variables** — No secrets in code
