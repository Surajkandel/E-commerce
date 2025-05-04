const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtSecret = require('../config/jwtSecret');

// =================== USER SIGNUP ===================
exports.userSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User already exists' 
      });
    }

    user = new User({
      name,
      email,
      password,
      role: 'user'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret.secret,
      { expiresIn: jwtSecret.expiresIn }
    );

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// =================== SELLER SIGNUP ===================
exports.sellerSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Seller already exists' 
      });
    }

    user = new User({
      name,
      email,
      password,
      role: 'seller'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret.secret,
      { expiresIn: jwtSecret.expiresIn }
    );

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// =================== LOGIN ===================
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Incorrect email or password' 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret.secret,
      { expiresIn: jwtSecret.expiresIn }
    );

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// =================== PROTECT MIDDLEWARE ===================
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: 'You are not logged in! Please log in to get access.' 
      });
    }

    const decoded = jwt.verify(token, jwtSecret.secret);
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({ 
        status: 'error',
        message: 'The user belonging to this token no longer exists.' 
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ 
      status: 'error',
      message: 'Authentication failed' 
    });
  }
};

// =================== RESTRICT TO ROLE ===================
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'User not authenticated' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'error',
        message: 'You do not have permission to perform this action' 
      });
    }

    next();
  };
};