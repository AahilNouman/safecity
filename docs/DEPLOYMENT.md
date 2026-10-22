# SafeCity — Deployment Guide

## Development Setup (Recommended First-Time)

### 1. Start all services manually

**Terminal 1 — Database:**
```bash
# Option A: Docker
docker-compose up -d db

# Option B: Local PostgreSQL
psql -U postgres -f database/schema.sql
psql -U postgres -f database/seed.sql
```

**Terminal 2 — Backend:**
```bash
cd backend
cp ../.env.example .env   # edit values as needed
npm install
npm run dev
# Runs on http://localhost:3001
```

**Terminal 3 — AI Service:**
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Runs on http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

**Terminal 4 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Docker Compose (All-in-One)

```bash
docker-compose up --build
```

This starts:
- PostgreSQL + PostGIS (port 5432)
- Backend Express API (port 3001)
- AI FastAPI service (port 8000)
- React frontend (port 5173)

## Production Considerations

### Environment Variables
- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET` (64+ chars)
- Use real database credentials
- Set `AI_DEMO_MODE=false` after model training
- Configure `FRONTEND_URL` for CORS

### Frontend Build
```bash
cd frontend
npm run build
# Serve dist/ with nginx or similar
```

### Backend
```bash
cd backend
npm start
# Use PM2, systemd, or Docker for process management
```

### Database
- Enable SSL connections
- Regular backups
- Connection pooling (PgBouncer)
- PostGIS spatial index maintenance

### Security Checklist
- [ ] Strong JWT secret
- [ ] HTTPS everywhere
- [ ] Database SSL
- [ ] Rate limiting tuned
- [ ] CORS restricted to production domain
- [ ] No debug logs in production
- [ ] Environment variables for all secrets
- [ ] Regular dependency updates
