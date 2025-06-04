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
        const firstNameField = document.getElementById('first-name');
        const lastNameField = document.getElementById('last-name');

        let isSignup = false;

       
        firstNameField.disabled = true;
        lastNameField.disabled = true;
        firstNameField.removeAttribute('required');
        lastNameField.removeAttribute('required');

      
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isSignup = !isSignup;

            signupFields.style.display = isSignup ? 'block' : 'none';
            formTitle.textContent = isSignup ? 'Register' : 'Login';
            loginButton.value = isSignup ? 'Register' : 'Login';
            formLabel.textContent = isSignup ? 'Fill in all fields to create an account' : 'Enter your email and password';
            toggleLink.innerHTML = isSignup ? 'Already have an account? <br><strong> Login now!</strong>' : "Don't have an account? <br><strong> Register now! </strong>";

            if (isSignup) {
                firstNameField.disabled = false;
                lastNameField.disabled = false;
                firstNameField.setAttribute('required', 'required');
                lastNameField.setAttribute('required', 'required');
            } else {
                firstNameField.removeAttribute('required');
                lastNameField.removeAttribute('required');
                firstNameField.disabled = true;
                lastNameField.disabled = true;
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
             
                const result = await response.json();
                if (response.ok) {
                    if (!isSignup)
                        window.location.href = '../views/main.html';
                    else
                        window.location.href = '../views/login.html';
                } else {
                    alert(result.error);
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
