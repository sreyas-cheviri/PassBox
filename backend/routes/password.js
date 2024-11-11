const express = require('express');
const PasswordEntry = require('../models/password-entries');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/add', authMiddleware, async (req, res) => {
    const { name, password } = req.body;
    try {
        const passwordEntry = new PasswordEntry({ userId: req.user.id, name, password });
        await passwordEntry.save();
        res.status(201).json(passwordEntry);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/view', authMiddleware, async (req, res) => {
    try {
        const passwords = await PasswordEntry.find({ userId: req.user.id });
        res.json(passwords);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;