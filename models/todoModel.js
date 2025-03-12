const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    time: {
        type: String, // Storing time as a string (e.g., "14:30" or "2:30 PM")
        required: true
    },
    frequency: {
        type: String,
        enum: ["once", "daily", "weekly", "monthly"],
        required: true
    }
});

module.exports = mongoose.model('todos', todoSchema);
