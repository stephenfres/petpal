const express = require('express');
const router = express.Router();
const {
  getAllPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');
const { petValidation } = require('../utils/validators');

router.use(protect);

router.get('/', getAllPets);
router.get('/:id', getPet);
router.post('/', petValidation, createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;