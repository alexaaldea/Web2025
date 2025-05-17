const loginController = {
    init() {
        const toggleLink = document.getElementById('toggle-form');
        const signupFields = document.getElementById('signup-fields');
        const formTitle = document.getElementById('form-title');
        const loginButton = document.getElementById('login');
        const formLabel = document.getElementById('form-label');

        let isSignup = false;

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isSignup = !isSignup;

            signupFields.style.display = isSignup ? 'block' : 'none';
            formTitle.textContent = isSignup ? 'Register' : 'Login';
            loginButton.value = isSignup ? 'Register' : 'Login';
            formLabel.textContent = isSignup ? 'Fill in all fields to create an account' : 'Enter your email and password';
            toggleLink.innerHTML = isSignup ? 'Already have an account? <br><strong> Login now!</strong>' : "Don't have an account? <br><strong> Register now! </strong>";

           
            document.getElementById('first-name').required = isSignup;
            document.getElementById('last-name').required = isSignup;
        });

        
        document.getElementById('auth-form').addEventListener('submit', function(e) {
            if (!isSignup) {
                document.getElementById('first-name').required = false;
                document.getElementById('last-name').required = false;
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loginController.init();
});

window.loginController = loginController;
