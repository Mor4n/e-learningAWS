const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const coursesRoutes = require('./routes/courses-only');
// Cognito maneja autenticación (sin rutas de auth local)

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/courses', coursesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Mini Udemy API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    auth: 'AWS Cognito',
    database: 'DynamoDB',
    dynamodb: {
      region: process.env.AWS_REGION,
      tables: {
        courses: process.env.DYNAMODB_TABLE_COURSES,
      }
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Mini Udemy API',
    version: '2.0.0',
    auth: 'AWS Cognito (Frontend)',
    database: 'DynamoDB',
    endpoints: {
      courses: '/api/courses',
      health: '/api/health'
    },
    note: 'Autenticación manejada por AWS Cognito en el frontend'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Auth: AWS Cognito (Frontend)`);
  console.log(`🗄️  Database: DynamoDB (${process.env.AWS_REGION})`);
  console.log(`📊 Table: Cursos`);
  console.log(`🌍 CORS enabled for all origins`);
});

module.exports = app;
