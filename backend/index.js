const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./bin/routes/authRoutes");
const countryRoutes = require("./bin/routes/countryRoutes");
const global_config = require("./bin/helper/global_config");
const logger = require('./bin/helper/logger');
const cors = require('cors');
const NodeCache = require('node-cache');

dotenv.config();
const app = express();
const port = global_config.get("/port");
const mongoUri = global_config.get("/mongo");
app.locals.cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

// Debug middleware
app.use((req, res, next) => {
  logger.log('express', `${req.method} ${req.url}`, 'debug');
  next();
});

// CORS middleware
app.use(cors({
  origins: ['*'],
  allowHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization, OPTIONS, Access-Control-Allow-Headers', 'Access-Control-Allow-Origin'],
  exposeHeaders: ['OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic auth configuration
const passport = require('passport');
const { init: initAuth } = require('./bin/middleware/basic_auth_helper');
app.use(passport.initialize());
app.use(initAuth());

// Debug middleware for routes
app.use((req, res, next) => {
  logger.log('express', `Handling ${req.method} ${req.url}`, 'debug');
  next();
});

// Routes registration
app.use('/api', authRoutes);
app.use('/api', countryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.log('express', `Error: ${err.message}`, 'error');
  
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      status: false,
      message: 'Unauthorized access',
      error: 'Invalid credentials'
    });
  }
  
  res.status(500).json({
    status: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// Handle 404
app.use((req, res) => {
  logger.log('express', `404 Not Found: ${req.method} ${req.url}`, 'error');
  res.status(404).json({
    status: false,
    message: `Cannot ${req.method} ${req.url}`
  });
});

mongoose.connect(mongoUri)
  .then(() => {
    // Fix: Define ctx variable and use correct port
    const ctx = 'mongodb';
    logger.log(ctx, "Connected to MongoDB", 'initate db');

    app.listen(port, () => {
      const ctx = 'express';
      logger.log(ctx, `Server running on port ${port}`, 'initate application');
    });
  })
  .catch((err) => {
    logger.log('express', `MongoDB connection error: ${err}`, 'error');
  });