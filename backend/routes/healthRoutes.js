const express = require('express');
const router = express.Router();
const {
  getHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
} = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getHealthRecords);
router.post('/', createHealthRecord);
router.put('/:id', updateHealthRecord);
router.delete('/:id', deleteHealthRecord);

module.exports = router;