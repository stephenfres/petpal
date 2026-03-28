const express = require('express');
const router = express.Router();

// CHECK THESE IMPORTS - Make sure function names match EXACTLY
const {
  register,
  login,
  getMe,
  updateProfile,
  updateFcmToken,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../utils/validators');

// THESE MUST MATCH THE IMPORTED NAMES EXACTLY
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/fcm-token', protect, updateFcmToken);

module.exports = router;