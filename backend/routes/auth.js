const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const { z } = require('zod');
require('dotenv').config();
const router = express.Router(); //router 

const SignUpSchema = z.object({
    username: z.string().min(1), //method for an object
    password: z.string().min(6),
});

// Signup Route
router.post('/signup', async (req, res) => {

    console.log('hit here');
    const validation = SignUpSchema.safeParse(req.body); // Validate input
    if (!validation.success) return res.status(400).json(validation.error); // Validation error

    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username }); // Check if user exists
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Signup - Hashed Password:", hashedPassword);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        console.log("Signup - User Saved:", user);
        

        res.status(201).json({ message: 'User created' });
    } catch (e) {
        res.status(500).json({ message: 'Server issue' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const matchedUser = await User.findOne({ username });
        if (!matchedUser) return res.status(400).json({ message: 'User not found' });
        
        console.log("Login - Retrieved Hashed Password:", matchedUser.password);
        console.log("Login - Input Password:", password);
        
        const matchCheck = await bcrypt.compare(password, matchedUser.password);
        console.log("Login - Password Match Result:", matchCheck);
        

        if (!matchCheck) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: matchedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log("Generated Token:", token);

        res.json({ message: 'Logged in', token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: 'Server error' });
    }
});


//logout
// router.post('/logout', (req, res) => {
//     res.json({ message: 'Logged out' });
// });

module.exports = router;
