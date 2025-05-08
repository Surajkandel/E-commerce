const express = require('express');
const connectDB = require('./backend/config/db');
const cors = require('cors');
require('dotenv').config();

// Initialize app
const app = express();

// Connect Database
connectDB();

// CORS Configuration - Allow requests from localhost:3000 (Frontend)
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow only the frontend's URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers (like Authorization for JWT)
};

// Middleware
app.use(cors(corsOptions));  // Apply the CORS settings globally

// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./backend/routes/authRoutes'));

app.use('/api/admin', require('./backend/routes/admin'));

app.use('/api/products', require('./backend/routes/productRoutes'));

// Test route
app.get('/', (req, res) => res.send('API Running'));

// Set the port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
