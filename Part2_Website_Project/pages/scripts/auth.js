/**
 * EVENTSX - Authentication Logic
 * Refactored to ES6 Class Structure
 */

class AuthManager {
    constructor() {
        this.authContainer = document.querySelector('.auth-container');
        this.toggleBtn = document.getElementById('auth-toggle-btn');
        this.loginForm = document.getElementById('login-form');
        this.signupForm = document.getElementById('signup-form');
        
        if (this.authContainer && this.toggleBtn) {
            this.initSlidingAuth();
        }
        
        if (document.getElementById('signup-form-element')) {
            this.initMultiStepForm();
        }

        this.populateRegistrationEvents();

        this.initAuthHandlers();
        this.autoSkipLoginIfAlreadyLoggedIn();
    }

    initAuthHandlers() {
        const loginFormEl = document.getElementById('login-form-element');
        const signupFormEl = document.getElementById('signup-form-element');

        if (loginFormEl) {
            loginFormEl.addEventListener('submit', (e) => {
                e.preventDefault();

                const usernameOrEmail = document.getElementById('login-username')?.value.trim();
                const password = document.getElementById('login-password')?.value;

                if (!usernameOrEmail || !password) {
                    window.EventsX?.showNotification?.('Error', 'Please enter your credentials.', 'error');
                    return;
                }

                const user = {
                    username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
                    email: usernameOrEmail.includes('@') ? usernameOrEmail : '',
                    displayName: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
                    loggedInAt: new Date().toISOString()
                };

                window.EventsX?.auth?.setCurrentUser?.(user);
                window.EventsX?.auth?.refreshAuthUi?.();

                window.location.href = 'dashboard.html';
            });
        }

        if (signupFormEl) {
            signupFormEl.addEventListener('submit', () => {
                const username = document.getElementById('reg-username')?.value.trim();
                const fullName = document.getElementById('reg-fullname')?.value.trim();
                const email = document.getElementById('reg-email')?.value.trim();

                const user = {
                    username: username || '',
                    fullName: fullName || '',
                    email: email || '',
                    displayName: fullName || username || 'User',
                    loggedInAt: new Date().toISOString()
                };

                window.EventsX?.auth?.setCurrentUser?.(user);
                window.EventsX?.auth?.refreshAuthUi?.();
            });
        }
    }

    autoSkipLoginIfAlreadyLoggedIn() {
        if (!this.authContainer || !this.toggleBtn || !this.loginForm || !this.signupForm) return;
        if (!window.EventsX?.auth?.isLoggedIn?.()) return;

        const sidebarTitle = document.getElementById('sidebar-title');
        const sidebarText = document.getElementById('sidebar-text');
        if (!sidebarTitle || !sidebarText) return;

        this.authContainer.classList.add('signup-mode');
        this.switchToSignup(sidebarTitle, sidebarText);
    }

    initSlidingAuth() {
        const sidebarTitle = document.getElementById('sidebar-title');
        const sidebarText = document.getElementById('sidebar-text');

        this.toggleBtn.addEventListener('click', () => {
            this.authContainer.classList.toggle('signup-mode');
            
            if (this.authContainer.classList.contains('signup-mode')) {
                this.switchToSignup(sidebarTitle, sidebarText);
            } else {
                this.switchToLogin(sidebarTitle, sidebarText);
            }
        });
    }

    switchToSignup(titleEl, textEl) {
        this.loginForm.classList.remove('active');
        this.signupForm.classList.add('active');
        titleEl.textContent = "Welcome Back!";
        textEl.textContent = "Already have an account? Login here to manage your events.";
        this.toggleBtn.textContent = "Sign In";
    }

    switchToLogin(titleEl, textEl) {
        this.loginForm.classList.add('active');
        this.signupForm.classList.remove('active');
        titleEl.textContent = "New Here?";
        textEl.textContent = "Join EventsX and start planning your next amazing experience!";
        this.toggleBtn.textContent = "Sign Up";
    }

    initMultiStepForm() {
        const form = document.getElementById('signup-form-element');
        const steps = form.querySelectorAll('.form-step');
        const nextBtns = form.querySelectorAll('.btn-next');
        const prevBtns = form.querySelectorAll('.btn-prev');
        let currentStep = 0;

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.validateStep(steps[currentStep], currentStep)) {
                    steps[currentStep].classList.remove('active');
                    currentStep++;
                    steps[currentStep].classList.add('active');
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                steps[currentStep].classList.remove('active');
                currentStep--;
                steps[currentStep].classList.add('active');
            });
        });

        form.addEventListener('submit', (e) => {
            if (!this.validateStep(steps[currentStep], currentStep)) {
                e.preventDefault();
            }
        });
    }

    validateStep(stepElement, stepIdx) {
        const inputs = stepElement.querySelectorAll('input[required], select[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.classList.add('border-danger');
            } else {
                input.classList.remove('border-danger');
            }
        });

        if (stepIdx === 0) {
            const pass = stepElement.querySelector('#reg-password');
            const confirm = stepElement.querySelector('#reg-confirm-password');
            if (pass && confirm && pass.value !== confirm.value) {
                valid = false;
                confirm.classList.add('border-danger');
                if (window.EventsX) {
                    window.EventsX.showNotification('Error', 'Passwords do not match.', 'error');
                }
            }
        }

        return valid;
    }

    populateRegistrationEvents() {
        const select = document.getElementById('reg-event');
        if (!select) return;

        const mockEvents = [
            { id: '1', name: 'Salt & Pepper Supper Club ($65)' },
            { id: '2', name: 'Spiritus Natalis ($70)' },
            { id: '3', name: 'Carrossel Veneziano ($40)' },
            { id: '4', name: 'Diverlândia ($150)' },
            { id: '5', name: 'Teatro Politeama ($95)' }
        ];

        select.innerHTML = '<option value="">-- Select an Event --</option>' + 
            mockEvents.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
        
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('event');
        if (eventId) {
            const found = mockEvents.find(e => e.name.includes(eventId));
            select.value = found ? found.id : eventId;
        }
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
