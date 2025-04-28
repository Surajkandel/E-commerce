const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret');
const User = require('../models/User');

// Middleware: Verify token and load user
const verifyToken = async (req, res, next) => {
  try {
    // Support both 'Authorization: Bearer token' and 'x-auth-token'
    let token = req.header('Authorization')?.split(' ')[1] || req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, jwtSecret.secret);

    // Load user from database and attach to request (without password)
    req.user = await User.findById(decoded.user.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ msg: 'User not found, authorization denied' });
    }

    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware: Verify if user is admin
const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }

    next();
  } catch (err) {
    console.error('Admin Auth Error:', err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { verifyToken, verifyAdmin };
