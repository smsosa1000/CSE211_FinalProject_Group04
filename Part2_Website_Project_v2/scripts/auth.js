/**
 * EVENTSX - Authentication Logic
 * Handles sliding login/signup and multi-step registration
 */

document.addEventListener('DOMContentLoaded', function() {
    initSlidingAuth();
    initMultiStepForm();
    populateRegistrationEvents();
});

function populateRegistrationEvents() {
    const select = document.getElementById('reg-event');
    if (!select) return;

    // In a real app, this would fetch from backend/db
    // Mocking for now to match the developer's guide
    const mockEvents = [
        { id: '1', name: 'Salt & Pepper Supper Club ($65)' },
        { id: '2', name: 'Spiritus Natalis ($70)' },
        { id: '3', name: 'Carrossel Veneziano ($40)' },
        { id: '4', name: 'Diverlândia ($150)' },
        { id: '5', name: 'Teatro Politeama ($95)' }
    ];

    select.innerHTML = '<option value="">-- Select an Event --</option>' + 
        mockEvents.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
    
    // Pre-select event if URL param exists
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event');
    if (eventId) {
        // Try to find by name if id doesn't match
        const found = mockEvents.find(e => e.name.includes(eventId));
        if (found) select.value = found.id;
        else select.value = eventId;
    }
}

function initSlidingAuth() {
    const authContainer = document.querySelector('.auth-container');
    const toggleBtn = document.getElementById('auth-toggle-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const sidebarTitle = document.getElementById('sidebar-title');
    const sidebarText = document.getElementById('sidebar-text');

    if (!authContainer || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        authContainer.classList.toggle('signup-mode');
        
        if (authContainer.classList.contains('signup-mode')) {
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            sidebarTitle.textContent = "Welcome Back!";
            sidebarText.textContent = "Already have an account? Login here to manage your events.";
            toggleBtn.textContent = "Sign In";
        } else {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
            sidebarTitle.textContent = "New Here?";
            sidebarText.textContent = "Join EventsX and start planning your next amazing experience!";
            toggleBtn.textContent = "Sign Up";
        }
    });
}

function initMultiStepForm() {
    const signupForm = document.getElementById('signup-form-element');
    if (!signupForm) return;

    const steps = signupForm.querySelectorAll('.form-step');
    const nextBtns = signupForm.querySelectorAll('.btn-next');
    const prevBtns = signupForm.querySelectorAll('.btn-prev');
    let currentStep = 0;

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
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

    signupForm.addEventListener('submit', (e) => {
        // Validation for final step
        if (!validateStep(currentStep)) {
            e.preventDefault();
        }
    });

    function validateStep(stepIdx) {
        const step = steps[stepIdx];
        const inputs = step.querySelectorAll('input[required], select[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.classList.add('border-danger');
            } else {
                input.classList.remove('border-danger');
            }
        });

        // Special validation for password matching in step 0
        if (stepIdx === 0) {
            const pass = step.querySelector('#reg-password');
            const confirm = step.querySelector('#reg-confirm-password');
            if (pass && confirm && pass.value !== confirm.value) {
                valid = false;
                confirm.classList.add('border-danger');
                if (window.EventsX && window.EventsX.showNotification) {
                    window.EventsX.showNotification('Error', 'Passwords do not match.', 'error');
                }
            }
        }

        return valid;
    }
}
