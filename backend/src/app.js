require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const { errorHandler, AppError } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import Routes
const incidentRoutes = require('./routes/incidents');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');
const routeRoutes = require('./routes/routes');
const safetyRoutes = require('./routes/safety');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Apply rate limiter to all api routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/safety', safetyRoutes);

// Health Check with DB ping
app.get('/api/health', async (req, res) => {
  try {
    const db = require('./config/database');
    const r = await db.query('SELECT 1 as test');
    res.status(200).json({ success: true, message: 'API is running', db: 'connected', version: 'v2' });
  } catch (err) {
    res.status(200).json({ success: true, message: 'API is running', db: 'error', error: err.message, version: 'v2' });
  }
});

// 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handler
app.use(errorHandler);

module.exports = app;
