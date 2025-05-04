const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controller/authController');

// @desc    Register normal user
// @route   POST /api/auth/user/signup
// @access  Public
router.post(
  '/user/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6+ characters').isLength({ min: 6 })
  ],
  authController.userSignup
);

// @desc    Register seller user
// @route   POST /api/auth/seller/signup
// @access  Public
router.post(
  '/seller/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6+ characters').isLength({ min: 6 })
  ],
  authController.sellerSignup
);

// @desc    Login user/seller
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

module.exports = router;