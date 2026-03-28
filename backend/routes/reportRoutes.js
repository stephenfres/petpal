const express = require('express');
const router = express.Router();
const {
  generateReport,
  getReports,
  getReport,
  deleteReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// All report routes require authentication
router.use(protect);

// Generate a new report
router.post('/generate', generateReport);

// Get all reports for a pet
router.get('/', getReports);

// Get a single report by ID
router.get('/:id', getReport);

// Delete a report by ID
router.delete('/:id', deleteReport);

module.exports = router;