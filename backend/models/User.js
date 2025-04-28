const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Name cannot exceed 30 characters'],
    minLength: [3, 'Name should have more than 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'Password should be at least 6 characters'],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user' // Default role is user
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      // Default to 'approved' for users, 'pending' for sellers
      return this.role === 'seller' ? 'pending' : 'approved';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Generate JWT token
userSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, jwtSecret.secret, {
    expiresIn: jwtSecret.expiresIn
  });
};

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
