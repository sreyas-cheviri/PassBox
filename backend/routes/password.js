const express = require('express');
const PasswordEntry = require('../models/password-entries.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/add', authMiddleware, async (req, res) => {
    console.log('Reached /add');
    console.log('User id from token:', req.userId);

    const { name, password } = req.body;  
    try {
        const passwordEntry = await PasswordEntry.create({
            userId: req.userId,  
            PassName: name,  
            Password: password  
        });
        res.status(201).json(passwordEntry);  
        
    } catch (err) {
        console.error('Error saving password entry:', err);  
        res.status(500).json({ message: 'Error saving password entry', error: err.message });
    }
});



router.get('/view', authMiddleware, async (req, res) => {
    try {
        console.log('reached /view ');
        const passwords = await PasswordEntry.find({ userId:  req.userId });
        res.json(passwords);
        console.log({passwords});
        
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;