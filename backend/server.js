const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.js');
const passwordRoutes = require('./routes/password.js');
require('dotenv').config();
require('./config.js');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
