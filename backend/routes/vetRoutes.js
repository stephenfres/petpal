const express = require('express');
const router = express.Router();
const {
  getNearbyVets,
  getAllVets,
  getVetById,
  createVet,
  updateVet,
  deleteVet,
} = require('../controllers/vetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/nearby', getNearbyVets);
router.get('/', getAllVets);
router.get('/:id', getVetById);
router.post('/', createVet);
router.put('/:id', updateVet);
router.delete('/:id', deleteVet);

module.exports = router;