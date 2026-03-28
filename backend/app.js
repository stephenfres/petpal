const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const errorHandler = require('./middleware/errorMiddleware');
const { setLanguage } = require('./middleware/languageMiddleware');

const app = express();

// CORS must be BEFORE other middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'Origin', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(setLanguage);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/feeding', require('./routes/feedingRoutes'));
app.use('/api/vaccinations', require('./routes/vaccinationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/vets', require('./routes/vetRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

module.exports = app;