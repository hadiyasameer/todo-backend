const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    duedate: { type: Date, required: true, default: Date.now }
},{ timestamps: true });


const Todo = mongoose.model("todo", todoSchema)
module.exports = Todo;