const express = require('express');
const PasswordEntry = require('../models/password-entries.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', authMiddleware, async (req, res) => {

    console.log("middleware done /add");
    
    const { PassName, Password } = req.body; 
    // console.log({PassName, Password});
    if (!PassName || !Password) {
        return res.status(400).json({ message: 'Name and password are required' });
    }
    try {
        const passwordEntry = new PasswordEntry({
            userId: req.user.id,
            PassName: PassName,
            Password: Password, 
        });
        await passwordEntry.save();
        res.status(201).json(passwordEntry);
    } catch (err) {
        console.error('Error adding password entry:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/', authMiddleware, async (req, res) => {
    try {
        // Use req.user.id (set by authMiddleware) to filter passwords by userId
        const entries = await PasswordEntry.find({ userId: req.user.id });
        res.json(entries);
    } catch (err) {
        console.error('Error fetching password entries:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
