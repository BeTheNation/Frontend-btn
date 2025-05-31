const Country = require("../models/Country");
const axios = require("axios");
const logger = require('../../bin/helper/logger');
const ctx = 'country-controller';
const countryService = require("../services/countryService");
const countryMetricService = require("../services/countryMetricService");

// Fetch and cache countries from restcountries.com
async function fetchAndCacheCountries() {
    try {
        const countries = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3,region');
        const bulk = countries.data.map(c => ({
            code: c.cca2 || c.cca3,
            name: c.name?.common,
            flagCode: c.flags?.svg,
            description: c.region
        }));
        // Upsert each country
        for (const c of bulk) {
            await Country.updateOne({ code: c.code }, c, { upsert: true });
        }
        logger.log(ctx, 'Countries cached/updated', 'fetchAndCacheCountries');
    } catch (err) {
        logger.log(ctx, err.message, 'fetchAndCacheCountries-error');
        throw err;
    }
}

// GET /api/country/:code
async function getCountryByCode(req, res) {
    try {
        const code = req.params.code;
        const country = await countryService.getCountryByCode(code);
        if (!country) {
            return res.status(404).json({ message: "Country not found" });
        }
        res.json(country);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET /api/country
async function getAllCountries(req, res) {
    try {
        const countries = await countryService.getAllCountries();
        res.json(countries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET /api/countries - Get all countries with latest metrics
async function getAllCountriesWithMetrics(req, res) {
    try {
        const countries = await countryMetricService.getLatestMetricsForAllCountries();
        res.json({
            status: true,
            message: "Countries with metrics retrieved successfully",
            data: countries,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        logger.log(ctx, err.message, 'getAllCountriesWithMetrics-error');
        res.status(500).json({
            status: false,
            message: "Error retrieving countries with metrics",
            error: err.message
        });
    }
}

// POST /api/countries/generate-metrics - Generate initial mock metrics
async function generateInitialMetrics(req, res) {
    try {
        const result = await countryMetricService.generateMockMetrics();
        res.json({
            status: true,
            message: "Initial metrics generated successfully",
            count: result.length
        });
    } catch (err) {
        logger.log(ctx, err.message, 'generateInitialMetrics-error');
        res.status(500).json({
            status: false,
            message: "Error generating initial metrics",
            error: err.message
        });
    }
}

module.exports = {
    getCountryByCode,
    fetchAndCacheCountries,
    getAllCountries,
    getAllCountriesWithMetrics,
    generateInitialMetrics
};
