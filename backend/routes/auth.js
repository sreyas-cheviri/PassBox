const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const { z } = require('zod');
require('dotenv').config();
const router = express.Router(); //router 

// i am not importing cookied parser here cause it is done server.js which acts as an global middleware 
//app.use(cookieParser()) in server.js every request to any route automatically has its cookies parsed and available on req.cookies.

const SignUpSchema = z.object({ // this is zod schema checking if length is correct 
    username: z.string().min(1), //method for an object
    password: z.string().min(6),
});

router.post('/signup', async (req, res) => {
    // console.log('Signup request received');
    const validation = SignUpSchema.safeParse(req.body);   // safeparse is same as parse but give error object with details
    if (!validation.success) return res.status(400).json(validation.error); // if fail? error
    const { username, password } = req.body; // save values

    try {
        // console.log('Signup request hererreceived');
        const existingUser = await User.findOne({ username }); // check DB for user existing 
        if (existingUser) return res.status(400).json({ message: 'user already ' }); // if? error
        const user = new User({ username, password }); // save the new User in user const 
        await user.save(); // save is similar to create but also does the hashing (i have written in schema -user.js)
        res.status(201).json({ message: 'user created' });
    } catch (e) {
        res.status(500).json({ message: 'server issue' });
    }
})


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const matchedUser = await User.findOne({ username });
        if (!matchedUser) return res.status(400).json({ message: 'User not found' });

        const matchCheck = await bcrypt.compare(password, matchedUser.password);
        if (!matchCheck) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: matchedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

       
        res.cookie('token', token, { httpOnly: true }).json({ message: 'Logged in', token: token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'logged out' }); /// clearing cookie token n loging ot 
})

module.exports = router;