const express = require('express');
const router = express.Router();
const Todo = require('../models/todoList');

router.post('/', async (req, res) => {
    const { title, description, status, duedate } = req.body;
    const todo = new Todo({ title, description, status, duedate });
    console.log("Added")

    try {
        const savedTodo = await todo.save();
        res.status(201).json({
            savedTodo,
            message: "Successfully Added"
        });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const todoList = await Todo.find();
        console.log("Todo List", todoList);
        res.status(200).send(todoList);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


router.get('/:id', async (req, res) => {
    try {
        const id  = req.params.id;
        const data = await Todo.findById(id);
        console.log("data", data);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { title, description, status, duedate } = req.body;

        const id = req.params.id;
        const updatedData = await Todo.findByIdAndUpdate(id, { title, description, status, duedate },{new:true});
        console.log("updatedData", updatedData);
        return res.json({
            data: updatedData
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Todo.findByIdAndDelete(id);
        res.json({
            message:'Deleted'
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


module.exports = router;  