const express = require('express');
const router = express.Router();
const Todo = require('../models/todoList');
const { userAuth } = require('../middleware/userAuth');

const { body, validationResult } = require('express-validator');

router.post('/todos', userAuth, [
    body('title').notEmpty().withMessage('Title is required'),
    body('status').isIn(['pending', 'completed']).withMessage('Invalid status')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, duedate } = req.body;
    const todo = new Todo({
        title, description, status, duedate, userId: req.user.id
    });

    try {
        const savedTodo = await todo.save();
        res.status(201).json({
            savedTodo,
            message: "Successfully Added"
        });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


router.get('/todos', userAuth, async (req, res) => {
    try {
        const todoList = await Todo.find({ userId: req.user.id });
        console.log("Todo List", todoList);
        res.status(200).send(todoList);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


router.get('/:id', userAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Todo.findById({ _id: id, userId: req.user.id });
        if (!data) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        console.log("data", data);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put("/:id", userAuth, async (req, res) => {
    try {
        const { title, description, status, duedate } = req.body;
        const id = req.params.id;
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { title, description, status, duedate },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found or not authorized' });
        }
        res.status(200).json({
            data: updatedTodo,
            message: 'Todo updated successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:id', userAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found or not authorized' });
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


module.exports = router;  