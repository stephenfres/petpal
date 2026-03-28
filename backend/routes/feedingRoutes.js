const express = require('express');
const router = express.Router();
const {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  markAsFed,
} = require('../controllers/feedingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSchedules);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
router.patch('/:id/fed', markAsFed);

module.exports = router;