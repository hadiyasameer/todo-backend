const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();
app.use(express.json());
app.use(cors({
    origin: ['https://todo-frontend-two-chi.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connected to mongo db'))
    .catch(err => console.log(err))

const todoRouter = require('./routes/todoRoutes')
app.use('/todo', todoRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
});