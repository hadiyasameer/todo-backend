const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);


        res.cookie('user_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: pw, ...userWithoutPassword } = user._doc;

        res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});


router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('user_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        return res.status(200).json({ message: 'User logout successful' });
    } catch (error) {
        console.log("Logout failed: ", error);

        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
