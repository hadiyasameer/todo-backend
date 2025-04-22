const express=require('express');
const todo=require('../models/Todo');
const authenticateToken=require('./middleware');
const Todo = require('../models/Todo');
const router=express.Router();

router.post('/',authenticateToken,async (req,res)=>{
    const {title}=req.body;
    const newTodo=new Todo({
        title,
        user:req.user.id
    })

    try{
        const savedTodo=await newTodo.save();
        res.status(201).json(savedTodo);
    } catch(error){
        res.status(500).json({error:'Error creating todo '})
    }

})

router.get('/',authenticateToken,async(req,res)=>{
    try{
        const todos=await Todo.find({user:req.user.id});
        res.json(todos);
    }catch(error){
        res.status(500).json({error:'Error fetching todos'})
    }
})

module.exports=router;