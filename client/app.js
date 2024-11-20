document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:5000/auth/signup', {
            username,
            password,
        });

        if (response.status === 201) {
            // Show success alert
            const alertBox = document.createElement('div');
            alertBox.textContent = 'Signup successful! Redirecting to login...';
            alertBox.style.position = 'fixed';
            alertBox.style.top = '10%';
            alertBox.style.left = '50%';
            alertBox.style.transform = 'translateX(-50%)';
            alertBox.style.backgroundColor = '#4CAF50';
            alertBox.style.color = 'white';
            alertBox.style.padding = '15px';
            alertBox.style.borderRadius = '5px';
            alertBox.style.zIndex = '1000';
            document.body.appendChild(alertBox);

            // Remove alert after 3 seconds
            setTimeout(() => {
                alertBox.remove();
                window.location.href = 'signin.html';
            }, 1000);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('Signup failed');
    }
});


document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:5000/auth/login', {
            username,
            password
        }, { withCredentials: true });
        
        console.log(response); 
        
        if (response.status === 200) {
            setTimeout(()=>{
                window.location.href = 'dashboard.html';
            },1000)
          
        }
        
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed');
    }
});
