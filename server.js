// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for all origins (safe version)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: false
}));

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
