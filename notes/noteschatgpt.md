

### 1. Project Structure
Here's a basic structure for your project:

```
password-manager/
├── client/
│   ├── index.html
│   └── style.css
├── server/
│   ├── models/
│   │   ├── user.js
│   │   └── passwordEntry.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── password.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── server.js
│   └── config.js
├── tailwind.config.js
└── package.json
```

Let's go through each file and its code.

---

## Backend (`server/`)

### 1. `.env`
Add environment variables for sensitive data.
```plaintext
MONGODB_URI=mongodb://localhost:27017/passwordManager
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 2. `config.js`
Configure MongoDB connection here.
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => console.error("Could not connect to MongoDB", err));
```

### 3. `models/user.js`
Define the user schema.
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
```

### 4. `models/passwordEntry.js`
Define the password entry schema.
```javascript
const mongoose = require('mongoose');

const passwordEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('PasswordEntry', passwordEntrySchema);
```

### 5. `routes/auth.js`
Handle signup, login, and logout.
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { z } = require('zod');
require('dotenv').config();

const router = express.Router();
const signupSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(6),
});

router.post('/signup', async (req, res) => {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json(validation.error);
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true }).json({ message: 'Logged in' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out' });
});

module.exports = router;
```

### 6. `routes/password.js`


### 7. `middleware/authMiddleware.js`
JWT authentication middleware.
```javascript
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalid or expired' });
    }
};
```

### 8. `server.js`
Main server setup.
```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');
require('dotenv').config();
require('./config');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## Frontend (`client/`)

### 1. `index.html`
Basic HTML structure for the home page.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Manager</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="flex items-center justify-center h-screen bg-gray-100">
    <div class="text-center">
        <h1 class="text-4xl font-bold mb-6">Password Manager</h1>
        <a href="/auth/signup" class="px-4 py-2 bg-blue-500 text-white rounded">Get Started</a>
    </div>
</body>
</html>
```


### 1. Client Structure
```
client/
├── index.html
├── login.html
├── signup.html
├── dashboard.html
├── style.css
└── app.js
```

---

### 2. `index.html`
This is the landing page with a "Get Started" button.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Manager</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="flex items-center justify-center h-screen bg-gray-100">
    <div class="text-center">
        <h1 class="text-4xl font-bold mb-6">Password Manager</h1>
        <a href="signup.html" class="px-4 py-2 bg-blue-500 text-white rounded">Get Started</a>
    </div>
</body>
</html>
```

---

### 3. `signup.html`
Signup page for new users.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="app.js" defer></script>
</head>
<body class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-xs">
        <h1 class="text-center text-2xl font-bold mb-4">Sign Up</h1>
        <form id="signup-form" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input type="text" id="username" name="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input type="password" id="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded">Sign Up</button>
        </form>
        <p class="text-center text-gray-600 text-xs">
            Already have an account? <a href="login.html" class="text-blue-500">Login here</a>.
        </p>
    </div>
</body>
</html>
```

---

### 4. `login.html`
Login page for existing users.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="app.js" defer></script>
</head>
<body class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-xs">
        <h1 class="text-center text-2xl font-bold mb-4">Login</h1>
        <form id="login-form" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input type="text" id="username" name="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input type="password" id="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded">Login</button>
        </form>
        <p class="text-center text-gray-600 text-xs">
            Don't have an account? <a href="signup.html" class="text-blue-500">Sign up here</a>.
        </p>
    </div>
</body>
</html>
```

---


### 6. `app.js`
JavaScript file to handle frontend logic.

```javascript
// User signup
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.ok) {
        window.location.href = 'login.html';
    } else {
        alert('Signup failed');
    }
});

// User login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.ok) {
        window.location.href = 'dashboard.html';
    } else {
        alert('Login failed');
    }
});

// Toggle password visibility
function toggleVisibility() {
    const passwordField = document.getElementById('password');
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
}

// Logout
document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = 'index.html';
});


