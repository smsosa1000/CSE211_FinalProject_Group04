/**
 * ===========================================
 * EVENTSX - Dynamic Responsive Event Planner
 * Main JavaScript File
 * Author: Group05 (4 Students)
 * Version: 1.0
 * Date: December 2025
 * ===========================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('EventsX - Dynamic Event Planner loaded successfully');
    
    // Initialize all modules
    initAccessibility();
    initNavigation();
    initForms();
    initEventListeners();
    initDynamicComponents();
    initPerformanceOptimizations();
    
    // Set current year in footer
    updateCurrentYear();
    
    // Show loading animation for better UX
    showLoadingAnimation();
});

// ========== ACCESSIBILITY MODULE ==========
function initAccessibility() {
    // Add skip to main content link
    addSkipToContentLink();
    
    // Enhance focus visibility
    enhanceFocusStyles();
    
    // Add ARIA labels to dynamic content
    enhanceAriaLabels();
    
    // Keyboard navigation improvements
    initKeyboardNavigation();
}

function addSkipToContentLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link sr-only';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    
    // Add styles dynamically
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 10px;
        background: #2c3e50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 600;
        z-index: 9999;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '10px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure main content has id
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

function enhanceFocusStyles() {
    // Add focus-visible polyfill behavior
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

function enhanceAriaLabels() {
    // Add aria-live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRole.setAttribute('aria-live', 'polite');
    liveRole.setAttribute('aria-atomic', 'true');
    liveRole.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    // Label all interactive elements
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
        if (!button.textContent.trim() && !button.querySelector('img')) {
            button.setAttribute('aria-label', 'Button');
        }
    });
}

function initKeyboardNavigation() {
    // Trap focus in modals (if any)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or dropdowns
            closeAllModals();
        }
    });
}

// ========== NAVIGATION MODULE ==========
function initNavigation() {
    // Mobile navigation toggle
    initMobileMenu();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Highlight current page in navigation
    highlightCurrentPage();
    
    // Breadcrumb navigation enhancement
    enhanceBreadcrumbs();
}

function initMobileMenu() {
    const nav = document.querySelector('.primary-nav');
    if (!nav) return;
    
    // Create mobile menu toggle button
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    // Style the toggle button
    menuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        width: 40px;
        height: 40px;
        cursor: pointer;
        padding: 8px;
        position: relative;
    `;
    
    menuToggle.querySelectorAll('span').forEach(span => {
        span.style.cssText = `
            display: block;
            width: 24px;
            height: 3px;
            background: white;
            margin: 4px 0;
            transition: 0.3s;
            border-radius: 2px;
        `;
    });
    
    // Insert before navigation
    nav.parentNode.insertBefore(menuToggle, nav);
    
    // Toggle menu on click
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('mobile-open');
        
        // Animate hamburger to X
        const spans = this.querySelectorAll('span');
        if (!isExpanded) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Show/hide based on screen width
    function handleResize() {
        if (window.innerWidth < 992) {
            menuToggle.style.display = 'block';
            nav.classList.remove('mobile-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        } else {
            menuToggle.style.display = 'none';
            nav.classList.remove('mobile-open');
        }
    }
    
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 250));
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page jump
                history.pushState(null, null, href);
            }
        });
    });
}

function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function enhanceBreadcrumbs() {
    const breadcrumbs = document.querySelector('.breadcrumb-list');
    if (!breadcrumbs) return;
    
    // Add microdata for SEO
    breadcrumbs.setAttribute('itemscope', '');
    breadcrumbs.setAttribute('itemtype', 'https://schema.org/BreadcrumbList');
    
    const items = breadcrumbs.querySelectorAll('.breadcrumb-item');
    items.forEach((item, index) => {
        item.setAttribute('itemprop', 'itemListElement');
        item.setAttribute('itemscope', '');
        item.setAttribute('itemtype', 'https://schema.org/ListItem');
        
        const position = index + 1;
        item.setAttribute('itemprop', 'position');
        item.setAttribute('content', position);
        
        const link = item.querySelector('a');
        if (link) {
            const span = document.createElement('span');
            span.setAttribute('itemprop', 'name');
            span.textContent = link.textContent;
            link.appendChild(span);
            
            link.setAttribute('itemprop', 'item');
        }
    });
}

// ========== FORMS MODULE ==========
function initForms() {
    // Registration form enhancements
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        initRegistrationForm(registrationForm);
    }
    
    // Budget calculator form
    const calculatorForm = document.querySelector('form[action*="calculator"]');
    if (calculatorForm) {
        initBudgetCalculator(calculatorForm);
    }
    
    // Search form enhancements
    const searchForms = document.querySelectorAll('form[aria-label*="earch"]');
    searchForms.forEach(initSearchForm);
    
    // Filter forms
    const filterForms = document.querySelectorAll('form[aria-label*="ilter"]');
    filterForms.forEach(initFilterForm);
    
    // Form validation
    initFormValidation();
}

function initRegistrationForm(form) {
    // Password strength meter
    const passwordInput = form.querySelector('#password');
    if (passwordInput) {
        const strengthMeter = createPasswordStrengthMeter();
        passwordInput.parentNode.insertBefore(strengthMeter, passwordInput.nextSibling);
        
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value, strengthMeter);
        });
    }
    
    // Password confirmation validation
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirmPassword');
    
    if (password && confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            validatePasswordMatch(password.value, this);
        });
    }
    
    // Character counters for textareas
    form.querySelectorAll('textarea[maxlength]').forEach(textarea => {
        addCharacterCounter(textarea);
    });
    
    // Date validation (minimum age 18)
    const dobInput = form.querySelector('#dob');
    if (dobInput) {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 18);
        dobInput.max = maxDate.toISOString().split('T')[0];
        
        dobInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 100);
            
            if (selectedDate > maxDate) {
                this.setCustomValidity('You must be at least 18 years old');
                showValidationMessage(this, 'You must be at least 18 years old');
            } else if (selectedDate < minDate) {
                this.setCustomValidity('Please enter a valid date');
                showValidationMessage(this, 'Please enter a valid date');
            } else {
                this.setCustomValidity('');
                clearValidationMessage(this);
            }
        });
    }
    
    // Auto-save form data
    initFormAutoSave(form);
    
    // Form submission
    form.addEventListener('submit', function(e) {
        if (!validateRegistrationForm(this)) {
            e.preventDefault();
            showFormErrors(this);
        } else {
            // Add submission animation
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
                submitBtn.disabled = true;
            }
        }
    });
}

function createPasswordStrengthMeter() {
    const container = document.createElement('div');
    container.className = 'password-strength-meter';
    container.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill"></div>
        </div>
        <div class="strength-text"></div>
    `;
    
    container.style.cssText = `
        margin-top: 0.5rem;
    `;
    
    const bar = container.querySelector('.strength-bar');
    bar.style.cssText = `
        height: 6px;
        background: #ecf0f1;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 0.25rem;
    `;
    
    const fill = container.querySelector('.strength-fill');
    fill.style.cssText = `
        height: 100%;
        width: 0%;
        transition: width 0.3s ease, background 0.3s ease;
        border-radius: 3px;
    `;
    
    return container;
}

function updatePasswordStrength(password, meter) {
    const fill = meter.querySelector('.strength-fill');
    const text = meter.querySelector('.strength-text');
    
    let strength = 0;
    let message = '';
    let color = '#e74c3c'; // Red
    
    // Check password criteria
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Update UI
    fill.style.width = `${strength}%`;
    
    // Set color and message based on strength
    if (strength < 50) {
        message = 'Weak password';
        color = '#e74c3c';
    } else if (strength < 75) {
        message = 'Fair password';
        color = '#f39c12';
    } else if (strength < 100) {
        message = 'Good password';
        color = '#3498db';
    } else {
        message = 'Strong password';
        color = '#27ae60';
    }
    
    fill.style.backgroundColor = color;
    text.textContent = message;
    text.style.color = color;
    text.style.fontSize = '0.875rem';
    text.style.fontWeight = '600';
}

function validatePasswordMatch(password, confirmInput) {
    if (password !== confirmInput.value) {
        confirmInput.setCustomValidity('Passwords do not match');
        showValidationMessage(confirmInput, 'Passwords do not match');
        return false;
    } else {
        confirmInput.setCustomValidity('');
        clearValidationMessage(confirmInput);
        return true;
    }
}

function addCharacterCounter(textarea) {
    const maxLength = parseInt(textarea.getAttribute('maxlength'));
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `Characters: 0/${maxLength}`;
    
    textarea.parentNode.insertBefore(counter, textarea.nextSibling);
    
    textarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        counter.textContent = `Characters: ${currentLength}/${maxLength}`;
        
        // Update color based on usage
        if (currentLength > maxLength * 0.9) {
            counter.classList.add('error');
            counter.classList.remove('warning');
        } else if (currentLength > maxLength * 0.75) {
            counter.classList.add('warning');
            counter.classList.remove('error');
        } else {
            counter.classList.remove('warning', 'error');
        }
    });
}

function initBudgetCalculator(form) {
    // Add dynamic calculation
    const inputs = form.querySelectorAll('input[type="number"]');
    const resultDisplay = form.querySelector('.calculation-result') || createResultDisplay(form);
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            calculateBudget(form, resultDisplay);
        });
    });
    
    // Initial calculation
    calculateBudget(form, resultDisplay);
}

function createResultDisplay(form) {
    const display = document.createElement('div');
    display.className = 'calculation-result';
    display.innerHTML = `
        <h4>Estimated Total Cost</h4>
        <div class="total-cost">$0.00</div>
        <div class="breakdown"></div>
    `;
    
    display.style.cssText = `
        background: #f8f9fa;
        border: 2px solid #3498db;
        border-radius: 10px;
        padding: 1.5rem;
        margin-top: 2rem;
        text-align: center;
    `;
    
    const totalCost = display.querySelector('.total-cost');
    totalCost.style.cssText = `
        font-size: 2.5rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 1rem 0;
    `;
    
    form.appendChild(display);
    return display;
}

function calculateBudget(form, display) {
    let total = 0;
    const breakdown = [];
    
    form.querySelectorAll('input[type="number"]').forEach(input => {
        const value = parseFloat(input.value) || 0;
        const label = input.previousElementSibling?.textContent || 'Item';
        
        if (value > 0) {
            total += value;
            breakdown.push({ label, value });
        }
    });
    
    // Update display
    const totalCost = display.querySelector('.total-cost');
    const breakdownEl = display.querySelector('.breakdown');
    
    totalCost.textContent = `$${total.toFixed(2)}`;
    
    if (breakdown.length > 0) {
        breakdownEl.innerHTML = `
            <h5>Cost Breakdown</h5>
            <ul style="list-style: none; padding: 0; text-align: left;">
                ${breakdown.map(item => `
                    <li style="display: flex; justify-content: space-between; margin: 0.5rem 0; padding: 0.5rem; background: white; border-radius: 4px;">
                        <span>${item.label}:</span>
                        <span>$${item.value.toFixed(2)}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}

function initSearchForm(form) {
    // Add search suggestions
    const searchInput = form.querySelector('input[type="search"]');
    if (!searchInput) return;
    
    const suggestions = [
        'Tech Conference',
        'Cultural Festival',
        'Career Fair',
        'Workshop',
        'Networking',
        'Seminar',
        'Exhibition',
        'Hackathon'
    ];
    
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #dfe6e9;
        border-radius: 0 0 8px 8px;
        max-height: 200px;
        overflow-y: auto;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    form.style.position = 'relative';
    form.appendChild(suggestionsContainer);
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filtered = suggestions.filter(s => 
            s.toLowerCase().includes(query)
        );
        
        updateSuggestions(filtered, suggestionsContainer, searchInput);
    });
    
    searchInput.addEventListener('focus', function() {
        if (this.value.length > 0) {
            suggestionsContainer.style.display = 'block';
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!form.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

function updateSuggestions(suggestions, container, input) {
    container.innerHTML = '';
    
    if (suggestions.length === 0 || input.value.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.textContent = suggestion;
        item.style.cssText = `
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: background 0.2s;
        `;
        
        item.addEventListener('mouseenter', function() {
            this.style.background = '#f8f9fa';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = 'white';
        });
        
        item.addEventListener('click', function() {
            input.value = this.textContent;
            container.style.display = 'none';
            input.focus();
            // Trigger search
            input.form?.dispatchEvent(new Event('submit', { cancelable: true }));
        });
        
        container.appendChild(item);
    });
    
    container.style.display = 'block';
}

function initFormValidation() {
    // Add custom validation messages
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('invalid', function(e) {
            e.preventDefault();
            showValidationMessage(this, this.validationMessage);
        });
        
        field.addEventListener('blur', function() {
            if (!this.validity.valid) {
                showValidationMessage(this, this.validationMessage);
            }
        });
        
        field.addEventListener('input', function() {
            if (this.validity.valid) {
                clearValidationMessage(this);
            }
        });
    });
}

function showValidationMessage(field, message) {
    clearValidationMessage(field);
    
    const error = document.createElement('div');
    error.className = 'validation-error';
    error.textContent = message;
    error.style.cssText = `
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        font-weight: 500;
    `;
    
    field.style.borderColor = '#e74c3c';
    field.parentNode.insertBefore(error, field.nextSibling);
}

function clearValidationMessage(field) {
    const existingError = field.parentNode.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function validateRegistrationForm(form) {
    let isValid = true;
    
    // Required fields check
    form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
            showValidationMessage(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Email format check
    const email = form.querySelector('input[type="email"]');
    if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showValidationMessage(email, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Password match check
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
        showValidationMessage(confirmPassword, 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

function showFormErrors(form) {
    const firstError = form.querySelector('.validation-error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function initFormAutoSave(form) {
    const storageKey = 'eventsx_form_draft';
    let saveTimeout;
    
    // Load saved data
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && (field.type === 'text' || field.type === 'email' || field.type === 'textarea')) {
                    field.value = data[key];
                }
            });
            
            // Show restore notification
            showNotification('Form data restored from draft', 'info');
        } catch (e) {
            console.error('Failed to restore form data:', e);
        }
    }
    
    // Auto-save on input
    form.addEventListener('input', debounce(function() {
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            if (value) data[key] = value;
        });
        
        localStorage.setItem(storageKey, JSON.stringify(data));
    }, 1000));
    
    // Clear on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem(storageKey);
    });
}

// ========== EVENT LISTENERS MODULE ==========
function initEventListeners() {
    // Back to top button
    initBackToTop();
    
    // Lazy loading for images
    initLazyLoading();
    
    // Intersection Observer for animations
    initScrollAnimations();
    
    // Tabbed content
    initTabbedContent();
    
    // Modal handling
    initModals();
    
    // Tooltips
    initTooltips();
}

function initBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = '↑';
    
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3498db;
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    `;
    
    document.body.appendChild(button);
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 20px rgba(52, 152, 219, 0.4)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = window.scrollY > 300 ? 'translateY(0)' : 'translateY(20px)';
        this.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.3)';
    });
    
    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
            button.style.transform = 'translateY(0)';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
            button.style.transform = 'translateY(20px)';
        }
    }, 100));
}

function initLazyLoading() {
    // Use native lazy loading if available
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Fallback for older browsers
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .zoom-in').forEach(el => {
        observer.observe(el);
    });
}

function initTabbedContent() {
    document.querySelectorAll('.tabbed-content').forEach(container => {
        const tabs = container.querySelectorAll('.tab');
        const panels = container.querySelectorAll('.tab-panel');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                
                // Update tabs
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Update panels
                panels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.setAttribute('aria-hidden', 'true');
                });
                
                const targetPanel = container.querySelector(target);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    targetPanel.setAttribute('aria-hidden', 'false');
                }
            });
        });
    });
}

function initModals() {
    // Modal triggers
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const target = this.getAttribute('data-modal-target');
            const modal = document.querySelector(target);
            
            if (modal) {
                openModal(modal);
            }
        });
    });
    
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close on overlay click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
}

function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus first focusable element
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        closeModal(modal);
    });
}

function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.setAttribute('role', 'tooltip');
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
        
        tooltip.style.cssText = `
            position: absolute;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            background: #2c3e50;
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 4px;
            font-size: 0.875rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            z-index: 1000;
            pointer-events: none;
        `;
        
        tooltip.style.minWidth = 'max-content';
        
        element.addEventListener('mouseenter', function() {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
}

// ========== DYNAMIC COMPONENTS MODULE ==========
function initDynamicComponents() {
    // Update news ticker
    initNewsTicker();
    
    // Progress bars animation
    initProgressBars();
    
    // Counters (for statistics)
    initCounters();
    
    // Calendar functionality
    initCalendar();
    
    // Event countdown timers
    initCountdownTimers();
    
    // Dynamic event cards
    initEventCards();
}

function initNewsTicker() {
    const ticker = document.querySelector('.news-ticker');
    if (!ticker) return;
    
    // Add pause on hover
    ticker.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    ticker.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
    
    // Update ticker content periodically
    setInterval(() => {
        // In a real app, this would fetch from an API
        const newsItems = [
            '🎉 New Year Gala 2026 registration opens December 15!',
            '🤝 Partnered with 5 new organizations',
            '📱 Mobile app coming in January 2026',
            '🏆 Event of the Month: Tech Conference 2025',
            '✨ Early bird discounts available for all events'
        ];
        
        const randomNews = newsItems[Math.floor(Math.random() * newsItems.length)];
        ticker.querySelector('.ticker-item').textContent = randomNews;
    }, 10000);
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width || bar.getAttribute('data-width') || '0%';
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 300);
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target')) || 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // Start when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function initCalendar() {
    const calendar = document.querySelector('.calendar-grid');
    if (!calendar) return;
    
    // Mark today's date
    const today = new Date();
    const todayDate = today.getDate();
    
    calendar.querySelectorAll('.calendar-date').forEach(dateEl => {
        const dateNum = parseInt(dateEl.textContent);
        if (dateNum === todayDate) {
            dateEl.classList.add('today');
        }
        
        // Add click event for date selection
        dateEl.addEventListener('click', function() {
            calendar.querySelectorAll('.calendar-date').forEach(d => {
                d.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Show events for selected date
            showEventsForDate(this.textContent);
        });
    });
}

function showEventsForDate(date) {
    // In a real app, this would fetch events for the date
    console.log(`Showing events for date: ${date}`);
    
    // Show notification
    showNotification(`Loading events for ${date}...`, 'info');
}

function initCountdownTimers() {
    const countdowns = document.querySelectorAll('.countdown');
    
    countdowns.forEach(countdown => {
        const targetDate = new Date(countdown.getAttribute('data-date')).getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                countdown.innerHTML = '<span class="expired">Event has started!</span>';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdown.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

function initEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add quick registration
        const registerBtn = card.querySelector('.register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const eventTitle = card.querySelector('.event-title').textContent;
                showQuickRegistration(eventTitle);
            });
        }
    });
}

function showQuickRegistration(eventTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal quick-registration-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <button class="modal-close" aria-label="Close">&times;</button>
            <h3>Quick Registration</h3>
            <p>Register for: <strong>${eventTitle}</strong></p>
            <form>
                <div class="form-group">
                    <label for="quick-email">Email Address</label>
                    <input type="email" id="quick-email" required>
                </div>
                <div class="form-group">
                    <label for="quick-name">Full Name</label>
                    <input type="text" id="quick-name" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Register Now</button>
                    <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    openModal(modal);
    
    // Add form submission
    modal.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification(`Successfully registered for ${eventTitle}!`, 'success');
        closeModal(modal);
        modal.remove();
    });
    
    // Add close handlers
    modal.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(modal);
            setTimeout(() => modal.remove(), 300);
        });
    });
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
function initPerformanceOptimizations() {
    // Defer non-critical CSS
    deferCSS();
    
    // Preload critical resources
    preloadResources();
    
    // Setup service worker (if supported)
    setupServiceWorker();
    
    // Optimize images
    optimizeImages();
    
    // Memory management
    setupMemoryManagement();
}

function deferCSS() {
    // Move non-critical CSS to load after page load
    const nonCriticalStyles = document.querySelectorAll('link[rel="stylesheet"][media="not all"]');
    nonCriticalStyles.forEach(link => {
        link.media = 'all';
    });
}

function preloadResources() {
    // Preload critical images
    const criticalImages = document.querySelectorAll('img[loading="eager"]');
    criticalImages.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
    });
}

function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(
                registration => {
                    console.log('ServiceWorker registration successful:', registration.scope);
                },
                error => {
                    console.log('ServiceWorker registration failed:', error);
                }
            );
        });
    }
}

function optimizeImages() {
    // Replace with WebP if supported
    if (supportsWebP()) {
        document.querySelectorAll('img[data-webp]').forEach(img => {
            const webpSrc = img.getAttribute('data-webp');
            if (webpSrc) {
                img.src = webpSrc;
            }
        });
    }
}

function supportsWebP() {
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

function setupMemoryManagement() {
    // Clean up event listeners on page unload
    window.addEventListener('beforeunload', function() {
        // Remove temporary elements
        document.querySelectorAll('.temp-element').forEach(el => {
            el.remove();
        });
    });
}

// ========== UTILITY FUNCTIONS ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Allow manual dismissal
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(150%)';
        setTimeout(() => {
            this.remove();
        }, 300);
    });
}

function updateCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

function showLoadingAnimation() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #2c3e50;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease;
    `;
    
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text" style="color: white; margin-top: 1rem; font-size: 1.1rem;">Loading EventsX...</div>
    `;
    
    const spinner = loadingOverlay.querySelector('.loading-spinner');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 5px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #3498db;
        animation: spin 1s linear infinite;
    `;
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loadingOverlay);
    
    // Remove after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
                style.remove();
            }, 500);
        }, 500);
    });
}

// ========== ERROR HANDLING ==========
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message, e.filename, e.lineno);
    
    // Show user-friendly error message
    if (!document.querySelector('.error-notification')) {
        showNotification('An error occurred. Please try again.', 'error');
    }
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ========== EXPORT FUNCTIONS FOR GLOBAL USE ==========
window.EventsX = {
    showNotification,
    validateForm: validateRegistrationForm,
    calculateBudget,
    openModal,
    closeModal,
    debounce,
    throttle
};

// ========== PUBLIC API FOR OTHER PAGES ==========
// These functions can be called from HTML with onclick attributes
function registerEvent(eventId) {
    showNotification(`Registering for event ${eventId}...`, 'info');
    // In real app, make API call
}

function saveToCalendar(eventId) {
    showNotification('Event saved to your calendar!', 'success');
    // In real app, integrate with calendar APIs
}

function shareEvent(eventId, platform) {
    const eventTitle = document.querySelector(`[data-event="${eventId}"]`)?.textContent || 'Event';
    const url = window.location.href;
    
    let shareUrl;
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(eventTitle)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(eventTitle)}`;
            break;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Make functions globally available
window.registerEvent = registerEvent;
window.saveToCalendar = saveToCalendar;
window.shareEvent = shareEvent;

console.log('EventsX JavaScript initialized successfully');