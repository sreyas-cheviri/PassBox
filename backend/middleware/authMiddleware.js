const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {

    console.log("reached in middle");
    
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded.id);   
        req.userId = decoded.id
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalid or expired' });
    }
};