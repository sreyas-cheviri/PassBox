
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.js');
const passwordRoutes = require('./routes/password.js');
require('dotenv').config();
require('./config.js');
const path = require('path')
const app = express();
const cors = require('cors');

const corsOptions = {
    origin: 'http://127.0.0.1:5501',  // This should be the origin of your frontend
    methods: 'GET,POST,PUT,DELETE',  // Allowed methods
    allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
    credentials: true  // Enable credentials
};

app.use(cors(corsOptions));  // Use the CORS middleware with the above options



app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client'))); 
app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
