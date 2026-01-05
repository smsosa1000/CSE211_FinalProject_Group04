/**
 * EVENTSX - Authentication Logic
 * Refactored to ES6 Class Structure
 */

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const EXTRA_EVENTS_STORAGE_KEY = 'eventsx_extra_events';

function loadExtraEvents() {
    try {
        const parsed = JSON.parse(localStorage.getItem(EXTRA_EVENTS_STORAGE_KEY));
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

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

                const isAdminLogin =
                    usernameOrEmail === ADMIN_USERNAME &&
                    password === ADMIN_PASSWORD;

                const user = isAdminLogin
                    ? {
                        username: ADMIN_USERNAME,
                        email: '',
                        displayName: 'Admin',
                        role: 'admin',
                        loggedInAt: new Date().toISOString()
                    }
                    : {
                        username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
                        email: usernameOrEmail.includes('@') ? usernameOrEmail : '',
                        displayName: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
                        role: 'user',
                        loggedInAt: new Date().toISOString()
                    };

                window.EventsX?.auth?.setCurrentUser?.(user);
                window.EventsX?.auth?.refreshAuthUi?.();

                window.location.href = 'dashboard.html';
            });
        }

        if (signupFormEl) {
            signupFormEl.addEventListener('submit', () => {
                const existingUser = window.EventsX?.auth?.getCurrentUser?.();
                const username = document.getElementById('reg-username')?.value.trim();
                const fullName = document.getElementById('reg-fullname')?.value.trim();
                const email = document.getElementById('reg-email')?.value.trim();

                // If already logged in, don't force "sign up" again; keep existing identity/role.
                if (existingUser) {
                    const updatedUser = {
                        ...existingUser,
                        username: existingUser.username || username || '',
                        fullName: fullName || existingUser.fullName || '',
                        email: email || existingUser.email || '',
                        displayName: fullName || existingUser.displayName || existingUser.fullName || existingUser.username || 'User'
                    };

                    window.EventsX?.auth?.setCurrentUser?.(updatedUser);
                    window.EventsX?.auth?.refreshAuthUi?.();
                    return;
                }

                const user = {
                    username: username || '',
                    fullName: fullName || '',
                    email: email || '',
                    displayName: fullName || username || 'User',
                    role: 'user',
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

        // User is already authenticated. This page is being used for event registration,
        // so show the registration form directly and hide the login/sign-up toggle.
        this.authContainer.classList.add('signup-mode');

        this.loginForm.classList.remove('active');
        this.signupForm.classList.add('active');

        sidebarTitle.textContent = "You're logged in";
        sidebarText.textContent = "Select an event and complete registration.";

        this.toggleBtn.classList.add('hidden');
        this.toggleBtn.setAttribute('aria-hidden', 'true');
        this.toggleBtn.tabIndex = -1;
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
        if (!form) return;

        const steps = form.querySelectorAll('.form-step');
        const nextBtns = form.querySelectorAll('.btn-next');
        const prevBtns = form.querySelectorAll('.btn-prev');
        let currentStep = 0;

        // If user is already logged in, skip account creation and jump to the final step (event registration).
        const existingUser = window.EventsX?.auth?.getCurrentUser?.();
        const alreadyLoggedIn = !!existingUser;

        if (alreadyLoggedIn && steps.length) {
            const usernameEl = form.querySelector('#reg-username');
            const fullNameEl = form.querySelector('#reg-fullname');
            const emailEl = form.querySelector('#reg-email');

            if (usernameEl && !usernameEl.value) usernameEl.value = existingUser.username || '';
            if (fullNameEl && !fullNameEl.value) fullNameEl.value = existingUser.fullName || existingUser.displayName || '';
            if (emailEl && !emailEl.value) emailEl.value = existingUser.email || '';

            // Password fields should not block event registration when already logged in.
            const passEl = form.querySelector('#reg-password');
            const confirmEl = form.querySelector('#reg-confirm-password');
            [passEl, confirmEl].forEach((el) => {
                if (!el) return;
                el.required = false;
                el.value = '';
                const group = el.closest('.form-group') || el.parentElement;
                if (group) group.classList.add('hidden');
            });

            steps.forEach(s => s.classList.remove('active'));
            currentStep = Math.min(steps.length - 1, 2);
            steps[currentStep].classList.add('active');

            // Logged-in users shouldn't go back to account steps.
            form.querySelectorAll('.btn-prev').forEach((btn) => {
                btn.classList.add('hidden');
                btn.setAttribute('aria-hidden', 'true');
                btn.tabIndex = -1;
            });
        }

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
                return;
            }

            // Submit registration to backend (API) while allowing normal navigation to thank-you.html.
            const selectedEvent = document.getElementById('reg-event')?.value?.trim();
            if (!selectedEvent) return;

            const user = window.EventsX?.auth?.getCurrentUser?.();
            const userKey = String(user?.username || user?.email || document.getElementById('reg-username')?.value || document.getElementById('reg-email')?.value || '').trim().toLowerCase();
            const dietary = document.getElementById('reg-dietary')?.value?.trim() || '';

            if (!userKey) return;

            window.EventsX?.registrations?.submitRegistration?.({
                userKey,
                eventName: selectedEvent,
                dietary,
                registeredAt: new Date().toISOString()
            }).catch((err) => {
                // Backend may not exist yet; don't block UI navigation.
                console.warn(err);
            });
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

        const extraEvents = loadExtraEvents().map((e) => {
            const eventName = String(e?.name || '').trim();
            const cost = Number(e?.cost);
            const labelCost = Number.isFinite(cost) ? ` (EGP ${cost})` : '';
            return {
                id: eventName,
                name: `${eventName}${labelCost}`
            };
        }).filter(e => e.id);

        const allEvents = [...mockEvents, ...extraEvents];

        select.innerHTML = '<option value="">-- Select an Event --</option>' +
            allEvents.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
        
        const params = new URLSearchParams(window.location.search);
        const eventId = (params.get('event') || '').trim();
        if (!eventId) return;

        const found = allEvents.find(e => e.id === eventId || e.name.includes(eventId));
        if (found) {
            select.value = found.id;
            return;
        }

        // If it's a new event name passed via query param, add it as an option.
        const opt = document.createElement('option');
        opt.value = eventId;
        opt.textContent = eventId;
        select.appendChild(opt);
        select.value = eventId;
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
