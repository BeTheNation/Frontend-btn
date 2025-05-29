const express = require("express");
const router = express.Router();
const countryController = require("../../module/controllers/countryController");
const countryMetricController = require("../../module/controllers/countryMetricController");

// Country base routes
router.get("/country/:code", countryController.getCountryByCode);
router.get("/country", countryController.getAllCountries);

// GET /api/metrics/latest - Get latest metrics
router.get("/metrics/latest", countryMetricController.getLatestMetrics);

// GET /api/country/:countryCode/metrics - Get metrics by country
router.get("/country/:countryCode/metrics", countryMetricController.getCountryMetrics);

// POST /api/metrics/generate - Generate initial mock metrics
router.post("/metrics/generate", countryMetricController.generateMetrics);
module.exports = router;
