require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./backend/models/User');
const db = require('./backend/config/db'); 
const createAdmin = async () => {
  await db(); // connect to database

  

  const admin = new User({
    name: 'Admin',
    email: 'admin@gmail.com',
    password: '123456',
    role: 'admin',
    status: 'approved'
  });

  await admin.save();
  console.log('Admin user created successfully');
  process.exit();
};

createAdmin();
