const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// ✅ UPDATED: Added terms validation
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  
  body('email').isEmail().withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 12 })
    .withMessage('Password must be at least 12 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('Password must contain at least one special character'),
  
  // ✅ NEW: Terms and conditions validation
  body('acceptTerms')
    .isBoolean()
    .withMessage('acceptTerms must be a boolean')
    .equals('true')
    .withMessage('You must accept the terms and conditions to register'),
  
  handleValidationErrors,
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const petValidation = [
  body('name').trim().notEmpty().withMessage('Pet name is required'),
  body('type')
    .isIn(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'])
    .withMessage('Invalid pet type'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  petValidation,
};