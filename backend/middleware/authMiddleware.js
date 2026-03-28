const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Adjust based on your models/index.js export

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token',
      });
    }

    // ✅ FIX: Use findByPk instead of findById, and parse ID as integer
    const user = await User.findByPk(parseInt(decoded.id), {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - User not found',
      });
    }

    req.user = user;
    next();
    
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // ✅ FIX: Use findByPk and parseInt
        const user = await User.findByPk(parseInt(decoded.id), {
          attributes: { exclude: ['password'] }
        });
        if (user) {
          req.user = user;
        }
      } catch (error) {
        console.log('Optional auth failed:', error.message);
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional Auth Error:', error);
    next();
  }
};

module.exports = { protect, optionalAuth };