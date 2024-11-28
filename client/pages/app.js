function showAlert(message, type = 'success', duration = 2000) {
    const alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.style.position = 'fixed';
    alertBox.style.top = '10%';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.padding = '15px';
    alertBox.style.borderRadius = '5px';
    alertBox.style.zIndex = '1000';
    alertBox.style.color = 'white';
    alertBox.style.backgroundColor = type === 'success' ? '#4CAF50' : type === 'warning' ? 'orange' : 'red';

    document.body.appendChild(alertBox);

    setTimeout(() => alertBox.remove(), duration);
}

document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:5000/auth/signup', { username, password });
        if (response.status === 201) {
            showAlert('Signup successful! Redirecting to login...', 'success', 1000);
            setTimeout(() => (window.location.href = 'signin.html'), 1000);
        }
    } catch (error) {
        const { status, data } = error.response || {};
        const message =
            status === 400 && data?.message === 'user already exists'
                ? 'User already exists. Please try a different username.'
                : status === 400
                ? 'Invalid request. Please check your input.'
                : 'Server error. Please try again later.';
        showAlert(message, 'error');
    }
});

document.getElementById('login-form')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:5000/auth/login', { username, password });
        if (response.status === 200) {
            const { token } = response.data;
            localStorage.setItem('authToken', token);
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Login failed:', error.response?.data?.message || error.message);
        // showAlert(error.message)
    }
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
});

function toggleVisibility() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.getElementById('toggle-icon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        passwordField.type = 'password';
        toggleIcon.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}

document.getElementById('password-form')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const PassName = document.getElementById('name').value;
    const Password = document.getElementById('password').value;

    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:5000/password/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ PassName, Password }),
    });

    if (response.ok) {
        const newEntry = await response.json();
        addPasswordToList(newEntry);
        document.getElementById('password-form').reset();
    } else {
        showAlert('Failed to add password', 'error');
    }
});

async function loadPasswords() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:5000/password', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const passwords = await response.json();
            passwords.forEach((password) => addPasswordToList(password));
        }
    } catch (error) {
        console.error('Error fetching passwords:', error);
    }
}

function addPasswordToList(password) {
    const list = document.getElementById('password-list');
    const listItem = document.createElement('li');
    const eye = document.createElement('p');
    listItem.classList.add('mb-2');
    listItem.classList.add('bg-black');
    listItem.classList.add('p-2');
    // listItem.classList.add('');
    listItem.classList.add('items-center');
    listItem.classList.add('rounded');
    listItem.classList.add('text-green-100');
    listItem.innerHTML = `<strong>${password.PassName}</strong> - ${password.Password}`;
    list.appendChild(listItem);
    // eye.appendChild('<i class="fa-solid fa-eye-slash"></i>')
}

loadPasswords();
