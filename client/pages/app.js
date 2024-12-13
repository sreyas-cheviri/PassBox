// errs alerts
function showAlert(message, type = 'success', duration = 1000) {
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

// Toggle password visibility on click
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

// Signup 
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

// Login 
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
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
        const errorMessage = error.response?.data?.message || 'Login failed';
        showAlert(errorMessage, 'error');
    }
});




// Add New Password
document.getElementById('password-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const PassName = document.getElementById('name').value;
    const Password = document.getElementById('password').value;
    console.log(PassName);

    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch('http://localhost:5000/password/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ PassName, Password }),
        });

        if (response.ok) {
            const newEntry = await response.json();
            addPasswordToList(newEntry);
            document.getElementById('name').value = '';
            document.getElementById('password').value = '';
            // showAlert('Password added successfully', 'success');
        } else {
            const errorData = await response.json();
            showAlert(errorData.message || 'Failed to add password', 'error');
        }
    } catch (error) {
        showAlert('Network error', 'error');
    }
});

// Load Passwords
async function loadPasswords() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;

    // Redirect to login only if we're on the dashboard page
    if (!token && currentPage.includes('dashboard')) {
        window.location.href = 'signin.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/password', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const passwords = await response.json();
            const passwordList = document.getElementById('password-list');
            passwordList.innerHTML = ''; // Clear existing list
            passwords.forEach((password) => addPasswordToList(password));
        } else {
            console.log(' Failed to load passwords', error);

        }
    } catch (error) {
        console.error('Error fetching passwords:', error);
        // showAlert('Network error', 'error');
    }
}


// Add Password to List
function addPasswordToList(password) {
    const list = document.getElementById('password-list');
    const listItem = document.createElement('li');

    listItem.classList.add(
        'mb-1',
        'bg-black',
        'p-3',
        'rounded',
        'flex',
        'justify-between',
        'items-center'
    );
    listItem.dataset.passwordId = password.id;

    // Create decrypt button
    const decryptButton = document.createElement('button');
    decryptButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
    decryptButton.classList.add(
        'text-white',
        'hover:text-red-400',
        'transition',
        'duration-300'
    );

    // Set content of list item
    listItem.innerHTML = `
        <div>
            <strong class="text-white mb-10 ">${password.PassName}</strong>
            <p class="text-gray-500 text-sm">Encrypted Password</p>
        </div>
    `;

    // Add click event to decrypt button
    decryptButton.addEventListener('click', () => decryptPassword(password.id, listItem));
    listItem.appendChild(decryptButton);

    // Add to list - on top
    list.insertBefore(listItem, list.firstChild);
}

// Decrypt a Specific Password
async function decryptPassword(passwordId, listItem) {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`http://localhost:5000/password/decrypt/${passwordId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const decryptedData = await response.json();

            // Update list item to show decrypted password
            listItem.innerHTML = `
                <div>
                    <strong class="text-white">${decryptedData.PassName}</strong>
                    <p class="text-gray-500 text-sm">${decryptedData.Password}</p>
                </div>
                <button class="text-red-500 hover:text-red-700 transition duration-300" onclick="hidePassword(this.parentElement)">
                    <i class="fa-solid fa-eye-slash"></i>
                </button>
            `;
        } else {
            showAlert('Failed to decrypt password', 'error');
        }
    } catch (error) {
        showAlert('Network error', 'error');
    }
}

// Hide Decrypted Password
function hidePassword(listItem) {
    const PassName = listItem.querySelector('strong').textContent;
    const passwordId = listItem.dataset.passwordId;

    // Revert to original state
    listItem.innerHTML = `
        <div>
            <strong class="text-white">${PassName}</strong>
            <p class="text-gray-500 text-sm">Encrypted Password</p>
        </div>
        <button class="text-white hover:text-green-700 transition duration-300" onclick="decryptPassword('${passwordId}', this.parentElement)">
            <i class="fa-solid fa-eye"></i>
        </button>
    `;
}

// Logout Functionality
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
});

// Load Passwords on Dashboard Load
document.addEventListener('DOMContentLoaded', loadPasswords);