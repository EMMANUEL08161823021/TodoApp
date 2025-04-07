const express = require('express');
const todoModel = require('../models/todoModel'); // ✅ Correct Model Name
const router = express.Router();


// Middleware to fetch a single todo
const getTodo = async (req, res, next) => {
    const { id } = req.params;

    // ✅ Check if ID is provided
    if (!id || id === "undefined") {
        return res.status(400).json({ message: "Invalid or missing ID parameter" });
    }

    try {
        const todo = await todoModel.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.newTodo = todo;
        next();
    } catch (error) {
        console.error("Error fetching todo:", error);
        return res.status(500).json({ message: "Error retrieving todo", error: error.message });
    }
};
 

// Gets a list of all todos
router.get('/', async (req, res) => {
    try {
        const todoList = await todoModel.find().sort({ createdAt: -1 }); // Latest todo first
        res.json(todoList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Creates a todo
router.post('/', async (req, res) => {
    console.log("Received body:", req.body); // ✅ Debugging log

    if (!req.body.name || !req.body.description || !req.body.date || !req.body.time || !req.body.frequency) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // req.body.date = new Date(req.body.date); // Convert incoming MM-DD-YYYY string to Date object
        const newTodo = new todoModel(req.body);
        const savedTodo = await newTodo.save();
        console.log("Saved Todo:", savedTodo); // ✅ Debugging log
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error("Error saving to database:", error.message);
        res.status(400).json({ message: error.message });
    }
});

// TO GET A SINGLE TODO TASK
router.get("/:id", getTodo, (req, res) => {
    res.json(res.newTodo); // ✅ Return the actual todo object
});

// Update a single todo
router.patch("/:id", getTodo, async (req, res) => {
    try {
        console.log("Updating Todo:", res.newTodo);

        // ✅ Update only provided fields
        Object.keys(req.body).forEach((key) => {
            res.newTodo[key] = req.body[key];
        });

        const updatedTodo = await res.newTodo.save();
        console.log("Updated Todo Saved:", updatedTodo);
        return res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Error saving updated todo:", error);
        return res.status(500).json({ message: "Failed to update todo", error: error.message });
    }
});

// delete a todo by its ID
router.delete("/:id", getTodo, async (req, res) => {
    try {
        await res.newTodo.deleteOne(); // ✅ Use deleteOne() instead of remove()
        res.status(200).json({ message: `${req.params.id} has been removed` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
