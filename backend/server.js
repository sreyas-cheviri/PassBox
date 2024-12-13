
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.js');
const passwordRoutes = require('./routes/password.js');
require('dotenv').config();
require('./config.js');
const path = require('path')
const app = express();
const cors = require('cors');

const corsOptions = {
    origin: 'https://passbox.vercel.app',  // This should be the origin of your frontend
    methods: 'GET,POST,PUT,DELETE',  // Allowed methods
    allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
    credentials: true  // Enable credentials
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/pages')));
app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

