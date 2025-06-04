(async function checkJwt() {
    const cookieString = document.cookie;
    const jwtCookie = cookieString.split('; ').find(row => row.startsWith('jwt='));
    if (jwtCookie) {
        try {
            const response = await fetch('/Web2025/Inpot/config/verify-jwt.php');
            if (response.ok) {
                const data = await response.json();
                if (data.message === 'valid') {
                    window.location.href = '../views/main.html';
                    return; 
                }
            }
        } catch (error) {
            window.location.href = '../views/login.html';
            console.error('Token verification failed:', error);
        }
    }
})();
 
const loginController = {
    init() {
        const toggleLink = document.getElementById('toggle-form');
        const signupFields = document.getElementById('signup-fields');
        const formTitle = document.getElementById('form-title');
        const loginButton = document.getElementById('login');
        const formLabel = document.getElementById('form-label');

        const firstName = document.getElementById('first-name');
        const lastName = document.getElementById('last-name');

        let isSignup = false;

        firstName.disabled = true;
        lastName.disabled = true;
        firstName.removeAttribute('required');
        lastName.removeAttribute('required');

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isSignup = !isSignup;

            signupFields.style.display = isSignup ? 'block' : 'none';
            formTitle.textContent = isSignup ? 'Register' : 'Login';
            loginButton.value = isSignup ? 'Register' : 'Login';
            formLabel.textContent = isSignup ? 'Fill in all fields to create an account' : 'Enter your email and password';
            toggleLink.innerHTML = isSignup ? 'Already have an account? <br><strong> Login now!</strong>' : "Don't have an account? <br><strong> Register now! </strong>";

            if (isSignup) {
                firstName.disabled = false;
                lastName.disabled = false;
                firstName.setAttribute('required', 'required');
                lastName.setAttribute('required', 'required');
            } else {
                firstName.removeAttribute('required');
                lastName.removeAttribute('required');
                firstName.disabled = true;
                lastName.disabled = true;
            }
        });

        document.getElementById('auth-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('pwd').value;
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            let actionUrl = '';
            if (!isSignup) {
                actionUrl = '/Web2025/Inpot/config/login-jwt.php';
            } else {
                actionUrl = '/Web2025/Inpot/config/signin.php';
            }
            const formData = new FormData();
            formData.append('email', email);
            formData.append('pwd', password);
            formData.append('first-name', firstName);
            formData.append('last-name', lastName);

            try {
                const response = await fetch(actionUrl, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.text();
                if (response.ok) {
                    if (!isSignup)
                        window.location.href = '../views/main.html';
                    else
                        window.location.href = '../views/login.html';
                }
            } catch (error) {
                alert('Error: ' + error);
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loginController.init();
});

window.loginController = loginController;
