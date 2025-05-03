const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret');

// =================== USER SIGNUP ===================
// @route   POST api/auth/user/signup
// @desc    Register normal user
// @access  Public
router.post(
  '/user/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
        role: 'user' // Set role as "user"
      });

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        jwtSecret.secret,
        { expiresIn: jwtSecret.expiresIn },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// =================== SELLER SIGNUP ===================
// @route   POST api/auth/seller/signup
// @desc    Register seller user
// @access  Public
router.post(
  '/seller/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Seller already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
        role: 'seller' // Set role as "seller"
      });

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        jwtSecret.secret,
        { expiresIn: jwtSecret.expiresIn },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// =================== LOGIN (Common for user & seller) ===================
// @route   POST api/auth/login
// @desc    Login user or seller
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        jwtSecret.secret,
        { expiresIn: jwtSecret.expiresIn },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
