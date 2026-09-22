# 🛡️ SafeCity — Smart Community-Based Women Protection and Incident Reporting Platform

> **PRJ_544** | Presidency University, Bengaluru | Department of Computer Science & Engineering | 2026–27

[![SDG 5](https://img.shields.io/badge/SDG%205-Gender%20Equality-E11D48?style=for-the-badge)](https://sdgs.un.org/goals/goal5)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+PostGIS-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org)

---

## 1. Project Overview

SafeCity is a community-based safety information platform that enables citizens to **anonymously report safety incidents**. Reports are processed through an AI classification pipeline (DistilBERT), stored with geographic coordinates (PostGIS), spatially clustered (DBSCAN), and visualized on interactive maps (Leaflet/OpenStreetMap).

The system transforms raw incident reports into structured, location-aware safety information through:

```
Incident Reporting → AI Classification → Database Storage → GIS Visualization
→ Spatial Clustering → Administrator Verification → Community Safety Information
```

> ⚠️ **Important Disclaimers:**
> - This system does NOT physically prevent crime or predict future incidents
> - It does NOT replace police, 112, or emergency services
> - AI predictions are assistive, not definitive
> - Hotspots represent incident report concentrations, not objective danger ratings

---

## 2. Features

### Citizen Interface
- 📝 Anonymous incident reporting (no account required)
- 📍 GPS location capture with manual map adjustment
- 🗺️ Interactive safety map with hotspot visualization
- 📰 Anonymized community safety feed
- 📱 Progressive Web App (installable, offline-capable)
- 🔖 Unique report tracking ID (SC-2026-XXXXXX)

### AI & Analytics
- 🤖 DistilBERT-based incident text classification
- 📊 Confidence scoring for AI predictions
- ⚡ Rule-based severity assessment (LOW/MEDIUM/HIGH)
- 🔬 DBSCAN spatial clustering for hotspot detection

### Admin Dashboard
- 🔐 JWT-secured admin authentication
- 📋 Incident verification queue (verify/reject workflow)
- 🏷️ AI category override capability
- 📈 Real-time dashboard with KPI cards and charts
- 🗺️ Admin-level hotspot analysis map
- 📊 Category distribution, trend analysis, severity stats

---

## 3. Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  React PWA   │────▶│  Express.js  │────▶│  PostgreSQL +    │
│  (Vite)      │◀────│  REST API    │◀────│  PostGIS         │
│  Port: 5173  │     │  Port: 3001  │     │  Port: 5432      │
└──────────────┘     └──────┬───────┘     └──────────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  FastAPI     │
                     │  AI Service  │
                     │  Port: 8000  │
                     │  DistilBERT  │
                     │  DBSCAN      │
                     └──────────────┘
```

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed diagrams.

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| Frontend | React 18, Vite, Leaflet.js | PWA citizen & admin interfaces |
| Backend | Node.js 20, Express.js | REST API gateway |
| Database | PostgreSQL 16, PostGIS 3.4 | Spatial data storage |
| AI Service | Python 3.11, FastAPI, DistilBERT | Text classification, DBSCAN clustering |
| Maps | Leaflet, OpenStreetMap | Interactive map visualization |
| Auth | JWT, bcrypt | Admin authentication |
| ML | PyTorch, Transformers, scikit-learn | Model training & inference |

---

## 5. Folder Structure

```
safecity/
├── frontend/                  # React + Vite PWA
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Layout/        # Navbar, Footer
│   │   │   ├── Map/           # SafetyMap, LocationPicker
│   │   │   ├── Common/        # LoadingSpinner, EmptyState, ErrorBoundary
│   │   │   └── admin/         # AdminLayout, StatsCard
│   │   ├── pages/             # Route pages
│   │   │   ├── admin/         # Dashboard, IncidentQueue, IncidentDetail
│   │   │   ├── HomePage.jsx
│   │   │   ├── ReportPage.jsx
│   │   │   ├── MapPage.jsx
│   │   │   └── SafetyFeed.jsx
│   │   ├── services/          # API client (axios)
│   │   ├── hooks/             # useAuth context
│   │   └── App.jsx
│   ├── public/manifest.json
│   └── package.json
│
├── backend/                   # Node.js + Express API
│   ├── src/
│   │   ├── controllers/       # incidentController, adminController
│   │   ├── routes/            # incidents, admin, ai
│   │   ├── services/          # severity, reportId, aiService
│   │   ├── middleware/        # auth, errorHandler, rateLimiter, validator
│   │   ├── config/            # database, index
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── ai-service/                # Python FastAPI + DistilBERT
│   ├── app/
│   │   ├── model/             # IncidentClassifier (demo + production)
│   │   ├── preprocessing/     # TextProcessor
│   │   ├── routes/            # predict, cluster (DBSCAN)
│   │   ├── utils/             # haversine metrics
│   │   └── main.py
│   ├── dataset/               # Synthetic train/val/test CSVs
│   ├── training/train.py      # DistilBERT fine-tuning script
│   ├── evaluation/evaluate.py # Metrics & confusion matrix
│   └── requirements.txt
│
├── database/
│   ├── schema.sql             # Full PostGIS schema
│   └── seed.sql               # 55+ demo incidents
│
├── docs/                      # Project documentation
├── docker-compose.yml         # Full-stack Docker setup
├── .env.example
└── .gitignore
```

---

## 6. Prerequisites

- **Node.js** 18+ (recommended 20 LTS)
- **Python** 3.10+ (recommended 3.11)
- **PostgreSQL** 16+ with **PostGIS** extension
- **npm** 9+ or **yarn** 1.22+
- **pip** or **uv** for Python packages
- **Git**

Optional:
- **Docker** & **Docker Compose** (for containerized setup)

---

## 7. Installation

### Clone / Navigate to Project
```bash
cd safecity
```

### Install Backend Dependencies
```bash
cd backend
npm install
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Install AI Service Dependencies
```bash
cd ai-service
pip install -r requirements.txt
# or: uv pip install -r requirements.txt
```

---

## 8. Environment Variables

Copy the example and fill in your values:
```bash
cp .env.example .env
```

Key variables:
| Variable | Default | Description |
|:---|:---|:---|
| `DATABASE_URL` | `postgresql://safecity_user:safecity_pass@localhost:5432/safecity_db` | PostgreSQL connection |
| `JWT_SECRET` | — | Random secret for JWT signing |
| `AI_SERVICE_URL` | `http://localhost:8000` | Python AI service URL |
| `PORT` | `3001` | Backend server port |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL (for CORS) |
| `AI_DEMO_MODE` | `true` | Use keyword fallback instead of trained model |

---

## 9. Database Setup

### Option A: Docker (Recommended)
```bash
docker-compose up -d db
```
This auto-runs `schema.sql` and `seed.sql` on first start.

### Option B: Local PostgreSQL
```sql
-- Create database and user
CREATE USER safecity_user WITH PASSWORD 'safecity_pass';
CREATE DATABASE safecity_db OWNER safecity_user;

-- Connect and enable PostGIS
\c safecity_db
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Run schema and seed
\i database/schema.sql
\i database/seed.sql
```

---

## 10. AI Setup

The AI service starts in **demo mode** by default (keyword-based classification). To train the real DistilBERT model:

```bash
cd ai-service
python training/train.py --data_dir dataset --output_dir app/model/saved --epochs 3
```

Then set `AI_DEMO_MODE=false` in `.env` and restart.

> ⚠️ Demo mode predictions are clearly labeled `[DEMO]`. Do not present demo predictions as real AI accuracy.

---

## 11. Running the Frontend

```bash
cd frontend
npm run dev
```
Opens at **http://localhost:5173**

---

## 12. Running the Backend

```bash
cd backend
npm run dev    # development with nodemon
# or
npm start      # production
```
Runs at **http://localhost:3001**

---

## 13. Running the AI Service

```bash
cd ai-service
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Runs at **http://localhost:8000**

API docs: **http://localhost:8000/docs** (Swagger UI)

---

## 14. Demo Account

For local development, the seed data includes:

| Field | Value |
|:---|:---|
| Email | `admin@safecity.local` |
| Password | `SafeCity@2026` |
| Role | `admin` |

> ⚠️ Change these credentials in production.

---

## 15. API Documentation

See [API.md](docs/API.md) for complete endpoint reference.

### Quick Reference

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/incidents` | — | Submit incident report |
| `GET` | `/api/incidents` | — | List incidents (paginated) |
| `GET` | `/api/incidents/map` | — | Map data (approximate locations) |
| `GET` | `/api/incidents/hotspots` | — | DBSCAN cluster data |
| `GET` | `/api/incidents/:id` | — | Get incident by ID |
| `POST` | `/api/admin/login` | — | Admin authentication |
| `GET` | `/api/admin/dashboard` | JWT | Dashboard statistics |
| `GET` | `/api/admin/incidents` | JWT | All incidents (full detail) |
| `PATCH` | `/api/admin/incidents/:id/verify` | JWT | Verify incident |
| `PATCH` | `/api/admin/incidents/:id/reject` | JWT | Reject incident |
| `PATCH` | `/api/admin/incidents/:id/category` | JWT | Override AI category |
| `POST` | `/api/ai/classify` | JWT | Classify text via AI |

---

## 16. Testing

### Backend
```bash
cd backend && npm test
```

### AI Service
```bash
cd ai-service && python -m pytest tests/ -v
```

### Frontend Build Check
```bash
cd frontend && npm run build
```

### AI Model Evaluation
```bash
cd ai-service && python evaluation/evaluate.py
```

---

## 17. Limitations

1. **AI classification is assistive** — predictions require human verification
2. **AI accuracy depends on training data** — demo mode uses keyword matching only
3. **Hotspots represent report concentrations** — not objective danger measurements
4. **Insufficient data** may produce weak/no DBSCAN clusters
5. **Anonymous reporting** makes malicious reports harder to trace
6. **GPS may be unavailable** — fallback to manual map selection
7. **Not a replacement** for emergency services (call 112 for emergencies)
8. **Not a legal evidence system** — reports are for community awareness
9. **Synthetic demo data** is clearly labeled and must not be confused with real data

---

## 18. Future Scope

- 🆘 SOS panic button with trusted contact alerts
- 👥 Virtual companion / walk-with-me feature
- 🛣️ Safe route suggestions using historical data
- 🔔 Push notifications for nearby safety advisories
- 📱 Native mobile app (React Native)
- 🌐 Multi-language support
- 📸 Evidence attachment (photo/video upload)
- 🤝 Integration with official safety APIs
- 📊 Advanced analytics with time-series forecasting

---

## Team

| Name | USN |
|:---|:---|
| Mohammed Aahil Nouman | 20231CSE0663 |
| Siddiq | 20231CSE0475 |
| Akshat Singh | 20231CSE0609 |

**Guide:** Mr. Muthuraju V

---

<p align="center">
  <strong>SafeCity</strong> — Report. Protect. Empower.<br>
  Built with ❤️ at Presidency University, Bengaluru
</p>
