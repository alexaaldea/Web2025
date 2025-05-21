const loginController = {
    init() {
        const toggleLink = document.getElementById('toggle-form');
        const signupFields = document.getElementById('signup-fields');
        const formTitle = document.getElementById('form-title');
        const loginButton = document.getElementById('login');
        const formLabel = document.getElementById('form-label');
        const authForm = document.getElementById('auth-form');

        const firstName = document.getElementById('first-name');
        const lastName = document.getElementById('last-name');

        let isSignup = false;

        firstName.setAttribute('disabled', 'true');
        lastName.setAttribute('disabled', 'true');
        firstName.removeAttribute('required');
        lastName.removeAttribute('required');

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isSignup = !isSignup;

            signupFields.style.display = isSignup ? 'block' : 'none';
            formTitle.textContent = isSignup ? 'Register' : 'Login';
            loginButton.value = isSignup ? 'Register' : 'Login';
            formLabel.textContent = isSignup ? 'Fill in all fields to create an account' : 'Enter your email and password';
            toggleLink.innerHTML = isSignup
                ? 'Already have an account? <br><strong> Login now!</strong>'
                : "Don't have an account? <br><strong> Register now! </strong>";

            if (isSignup) {
                firstName.removeAttribute('disabled');
                lastName.removeAttribute('disabled');
                firstName.setAttribute('required', 'required');
                lastName.setAttribute('required', 'required');
            } else {
                firstName.removeAttribute('required');
                lastName.removeAttribute('required');
                firstName.setAttribute('disabled', 'true');
                lastName.setAttribute('disabled', 'true');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loginController.init();
});

window.loginController = loginController;
