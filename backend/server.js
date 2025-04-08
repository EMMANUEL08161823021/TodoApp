// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for all origins (safe version)

const corsOptions = {
  origin: 'https://tasknestapp.netlify.app',  // Your frontend URL
  methods: 'GET, POST, PATCH, DELETE',         // Allow specific HTTP methods
  allowedHeaders: 'Content-Type',            // Allow only the Content-Type header
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err.message));

// Root route for health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hi, backend is live!' });
});

// Import and use todo routes
const todoRouter = require('./routes/todos');
app.use('/todos', todoRouter);

// Server listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
