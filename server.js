require('dotenv').config()
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ Connection error:", err.message));


app.get('/', (req, res) => {
    // console.log('HERE');
    res.status(200).json({message: 'Hi'})
    
})


const todoRouter = require('./routes/todos')

app.use('/todos', todoRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.listen(3000);