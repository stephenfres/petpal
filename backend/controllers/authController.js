const { User } = require('../models');
const generateToken = require('../utils/generateToken');

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { username, name, email, password, phone, preferredLanguage, acceptTerms } = req.body;

    // Check if user exists by email
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Check if username is already taken
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken. Please choose another one.',
      });
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the Terms and Conditions to register',
      });
    }

    // Create user
    const user = await User.create({
      username,
      name,
      email,
      password,
      phone,
      preferredLanguage: preferredLanguage || 'en',
      acceptTerms: acceptTerms,
      termsAcceptedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        acceptTerms: user.acceptTerms,
        termsAcceptedAt: user.termsAcceptedAt,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password, fcmToken } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (fcmToken) {
      user.fcmToken = fcmToken;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, preferredLanguage } = req.body;
    
    await User.update(
      { name, phone, preferredLanguage },
      { where: { id: req.user.id } }
    );

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update FCM token
exports.updateFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;
    
    await User.update(
      { fcmToken },
      { where: { id: req.user.id } }
    );
    
    res.json({
      success: true,
      message: 'FCM token updated',
    });
  } catch (error) {
    next(error);
  }
};