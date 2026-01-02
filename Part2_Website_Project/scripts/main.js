/**
 * EVENTSX - Dynamic Responsive Event Planner
 * Global Core Logic & Shared Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('EventsX Core Loaded');
    
    initNavigation();
    initDynamicComponents();
    updateCurrentYear();
    displaySavedBudget();
});

// ========== NAVIGATION ==========
function initNavigation() {
    initMobileMenu();
    initHeaderScrollBehavior();
    initSmoothScrolling();
    highlightCurrentPage();
}

function initHeaderScrollBehavior() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        lastScrollY = currentScrollY;
    }, { passive: true });
}

function initMobileMenu() {
    const nav = document.querySelector('.primary-nav');
    const toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) nav.classList.remove('is-open');
        });
    });
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function highlightCurrentPage() {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link, nav ul li a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes(currentPage) || (currentPage === 'index.html' && href === '../index.html'))) {
            link.classList.add('active');
        }
    });
}

// ========== DYNAMIC COMPONENTS ==========
function initDynamicComponents() {
    initCounters();
    initCountdownTimers();
}

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetValue = parseInt(el.getAttribute('data-target'));
                if (isNaN(targetValue)) return;

                let count = 0;
                const duration = 2000; // 2 seconds
                const steps = 50;
                const increment = targetValue / steps;
                const stepDuration = duration / steps;

                const timer = setInterval(() => {
                    count += increment;
                    if (count >= targetValue) {
                        el.textContent = targetValue.toLocaleString();
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(count).toLocaleString();
                    }
                }, stepDuration);
                observer.unobserve(el);
            }
        });
    });
    document.querySelectorAll('.counter').forEach(c => observer.observe(c));
}

function initCountdownTimers() {
    document.querySelectorAll('.countdown').forEach(timer => {
        const dateStr = timer.getAttribute('data-date');
        if (!dateStr) return;

        const target = new Date(dateStr).getTime();
        const update = () => {
            const now = new Date().getTime();
            const diff = target - now;
            
            if (diff < 0) {
                timer.innerHTML = "<span>Event Started</span>";
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            timer.innerHTML = `<span>${d}d ${h}h ${m}m ${s}s</span>`;
        };
        
        update();
        setInterval(update, 1000);
    });
}

function updateCurrentYear() {
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}

function displaySavedBudget() {
    const container = document.getElementById('dashboard-budget-display');
    if (!container) return;

    const savedData = localStorage.getItem('saved_budget');
    if (!savedData) {
        container.innerHTML = '<p class="text-muted">No budgets saved yet.</p>';
        return;
    }

    try {
        const data = JSON.parse(savedData);
        container.innerHTML = `
            <div class="card bg-light">
                <div class="card-body">
                    <h3 class="h4 mb-2">${data.event}</h3>
                    <div class="d-flex justify-between mb-1">
                        <span>Total Estimate:</span>
                        <strong class="text-primary">${data.total}</strong>
                    </div>
                    <div class="d-flex justify-between mb-1">
                        <span>Per Person:</span>
                        <strong class="text-success">${data.perPerson}</strong>
                    </div>
                    <div class="mt-2 small text-muted">
                        <i class="fas fa-clock"></i> Saved on ${data.date}
                    </div>
                    <div class="mt-3">
                        <a href="budget-calculator.html" class="btn btn-sm btn-outline">Update Budget</a>
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Error parsing saved budget', e);
    }
}

// ========== UTILITY FUNCTIONS ==========
function showNotification(title, message, type = 'info') {
    // Simple alert-based notification for now, can be upgraded to custom UI
    console.log(`Notification: ${title} - ${message} (${type})`);
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<strong>${title}</strong>: ${message}`;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transition: all 0.5s ease;
        opacity: 0;
        transform: translateY(20px);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// ========== EXPORT FOR GLOBAL USE ==========
window.EventsX = {
    showNotification,
    updateCurrentYear
};
