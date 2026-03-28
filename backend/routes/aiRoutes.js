const express = require('express');
const router = express.Router();
const {
  getAdvice,
  getNutritionAdvice,
  analyzeSymptoms,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/advice', getAdvice);
router.get('/nutrition/:petId', getNutritionAdvice);
router.post('/symptoms', analyzeSymptoms);

module.exports = router;