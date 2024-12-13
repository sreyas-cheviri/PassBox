const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // console.log("middleware reached");

    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract Bearer token
    // console.log(token);


    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
