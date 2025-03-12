require('dotenv').config()
const express = require('express');

const app = express();
const mongoose = require('mongoose');

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ Connection error:", err.message));


app.get('/', (req, res) => {
    // console.log('HERE');
    res.status(200).json({message: 'Hi'})
    
})


const todoRouter = require('./routes/todos')

app.use('/todos', todoRouter)


app.listen(3000);