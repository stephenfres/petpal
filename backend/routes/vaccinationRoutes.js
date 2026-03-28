const express = require('express');
const router = express.Router();
const {
  getVaccinations,
  getUpcomingVaccinations,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} = require('../controllers/vaccinationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getVaccinations);
router.get('/upcoming', getUpcomingVaccinations);
router.post('/', createVaccination);
router.put('/:id', updateVaccination);
router.delete('/:id', deleteVaccination);

module.exports = router;