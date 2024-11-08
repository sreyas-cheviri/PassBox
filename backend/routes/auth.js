const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { z } = require('zod');
const user = require('../models/user');
require('dotenv').config();
const router = express.Router(); //router 

// i am not importing cookied parser here cause it is done server.js which acts as an global middleware 
//app.use(cookieParser()) in server.js every request to any route automatically has its cookies parsed and available on req.cookies.

const SignUpSchema = z.object({ // this is zod schema checking if length is correct 
    username: z.string().min(1), //method for an object
    password: z.string().min(6),
});

router.post('/signup', async (req, res) => {
    const validation = SignUpSchema.safeParse(req.body);   // safeparse is same as parse but give error object with details
    if (!validation.success) return res.status(400).json(validation.error); // if fail? error
    const { username, password } = req.body; // save values

    try {
        const existingUser = await User.findOne({ username }); // check DB for user existing 
        if (existingUser) return res.status(400).json({ message: 'user already exists' }); // if? error
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
        const matchedUser = await User.findOne({ username }); // check if user exists in DB
        if (!matchedUser) return res.status(400).json({ message: 'user not found' });

        const matchCheck = await bcrypt.compare(password, matchedUser.password); // check is password entered is same as one in DB
        if (!matchCheck) return res.status(400).json({ message: 'invalid credentials' });

        const token = jwt.sign({ id: matchedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // signing with jwt secret ket - in env file
        res.cookie('token', token, { httpOnly: true }).json({ message: 'logged in' })
        // storing the token in user browser for 7 days tilll logout , (name , val , httpONly means protection aganist XSs cookie can be accesed via JS in client , message)
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
}) 

router.post('/logout', (req, res)=>{
    res.clearCookie('token').json({message: 'logged out'}); /// clearing cookie token n loging ot 
})