const express = require('express');
const PasswordEntry = require('../models/password-entries.js');
const CryptoJS = require('crypto-js');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Secret key for encryption - store this securely, ideally in environment variables
const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY || 'verysecret';

router.post('/add', authMiddleware, async (req, res) => {
    const { PassName, Password } = req.body; 
    
    if (!PassName || !Password) {
        return res.status(400).json({ message: 'Name and password are required' });
    }
    
    try {
        // Encrypt the password before saving
        const encryptedPassword = CryptoJS.AES.encrypt(Password, SECRET_KEY).toString();
        
        const passwordEntry = new PasswordEntry({
            userId: req.user.id,
            PassName: PassName,
            Password: encryptedPassword, // Store encrypted password
        });
        
        await passwordEntry.save();
        res.status(201).json({
            PassName: passwordEntry.PassName,
            // Do not send back the encrypted password
            id: passwordEntry._id
        });
    } catch (err) {
        console.error('Error adding password entry:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const entries = await PasswordEntry.find({ userId: req.user.id });
        
        // Do not decrypt here - we'll do this client-side
        const sanitizedEntries = entries.map(entry => ({
            id: entry._id,
            PassName: entry.PassName,
            // Encrypted password remains encrypted
        }));
        
        res.json(sanitizedEntries);
    } catch (err) {
        console.error('Error fetching password entries:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// New route to decrypt a specific password
router.get('/decrypt/:id', authMiddleware, async (req, res) => {
    try {
        const entry = await PasswordEntry.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });
        
        if (!entry) {
            return res.status(404).json({ message: 'Password entry not found' });
        }
        
        // Decrypt the password
        const decryptedPassword = CryptoJS.AES.decrypt(entry.Password, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        
        res.json({ 
            PassName: entry.PassName, 
            Password: decryptedPassword 
        });
    } catch (err) {
        console.error('Error decrypting password:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;