const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        errorMessage.textContent = 'Please fill in all fields.';
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Handle successful login (e.g., redirect to dashboard)
            window.location.href = '/dashboard.html';
        } else {
            errorMessage.textContent = data.message || 'Login failed. Please try again.';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again later.';
    }
});