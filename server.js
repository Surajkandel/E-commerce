const express = require('express');
const connectDB = require('./backend/config/db');
const cors = require('cors');
require('dotenv').config();

// Initialize app
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());

app.use(express.json());

// Define Routes
app.use('/api/auth', require('./backend/routes/auth'));

// Test route
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));