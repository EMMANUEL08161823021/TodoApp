const express = require('express');

const todoModel = require('../models/todoModel');

const router = express.Router();


// Gets a list of all todos
router.get('/', async(req, res) => {

    try {
        const todoList = await todoModel.find();
        res.json(todoList);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
})
// Creates a todo
router.post('/', async (req, res) => {

    // console.log("Received body:", req.body); // ✅ Debugging log

    if (!req.body.name || !req.body.description || !req.body.date  || !req.body.time || !req.body.frequency) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newTodo = new todoModel({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        time: req.body.time,
        frequency: req.body.frequency
    })
    try {
        const newTodoList = await newTodo.save();
        res.status(201).json(newTodoList)
    } catch (error) {
        res.status(400).json({ message: error.message})
        
    }
    
})

router.get("/:id", getTodo, (req, res) => {

    const todoName = req.res.newTodo.name || "No name provided";
    res.send(todoName);
    
})
// Update a single todo
router.patch("/:id", getTodo, async(req, res) => {
    if(req.body.name != null ){
        res.newTodo.name = req.body.name
    }
    if(req.body.description != null ){
        res.newTodo.description = req.body.description
    }
    if(req.body.date != null ){
        res.newTodo.date = req.body.date
    }
    if(req.body.time != null ){
        res.newTodo.time = req.body.time
    }
    if(req.body.frequency != null ){
        res.newTodo.frequency = req.body.frequency
    }
    try {
        const updatedNewTodoList = res.newTodo.save()
        res.status(200).json(updatedNewTodoList);
    } catch (error) {
        res.status(400).json({message: error.message});

    }
    
})
// delete a todo by its ID
router.delete("/:id", getTodo, async(req, res) => {
    try {
        await res.newTodo.remove()
        res.status(200).json({message: `${req.params.id} has been removed`})

    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
    
})

async function getTodo(req, res, next) {
    let newTodo
    try {
        newTodo = await todoModel.findById(req.params.id);

        
        if(newTodo === null) {
            return res.status(404).json({message: 'Cannot find todo'})
        }
    } catch (error) {
        return res.status(500).json({message: 'Cannot find todo'})
    }
    res.newTodo = newTodo;
    // console.log(newTodo.name);

    next();
}

module.exports = router