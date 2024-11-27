const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const { z } = require('zod');
require('dotenv').config();
const router = express.Router(); //router 

const SignUpSchema = z.object({
    username: z.string().min(1), //method for an object
    password: z.string().min(6),
});

// Signup Route
router.post('/signup', async (req, res) => {
    const validation = SignUpSchema.safeParse(req.body); // Validate input
    if (!validation.success) return res.status(400).json(validation.error); // Validation error

    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username }); // Check if user exists
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created' });
    } catch (e) {
        res.status(500).json({ message: 'Server issue' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const matchedUser = await User.findOne({ username }); // Check if user exists
        if (!matchedUser) return res.status(400).json({ message: 'User not found' });

        const matchCheck = await bcrypt.compare(password, matchedUser.password); // Verify password
        if (!matchCheck) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: matchedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Generate token
        console.log(token);

        res.json({ message: 'Logged in', token }); // Send token in response
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

//logout
// router.post('/logout', (req, res) => {
//     res.json({ message: 'Logged out' });
// });

module.exports = router;
