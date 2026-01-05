/**
 * EVENTSX - Dynamic Responsive Event Planner
 * Global Core Logic & Shared Interactions
 */

(function () {

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initDynamicComponents();
    initParallax();
    updateCurrentYear();

    initDashboardLogout();

    refreshAuthUi();
});

// ========== PARALLAX (INTERACTIVE) ==========
class ParallaxController {
    constructor() {
        this.media = document.querySelector('.hero .hero-media');
        this.hero = document.querySelector('.hero');
        this.ticking = false;

        if (!this.media || !this.hero) return;

        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        this.onScroll();
    }

    onScroll() {
        if (this.ticking) return;
        this.ticking = true;

        window.requestAnimationFrame(() => {
            const rect = this.hero.getBoundingClientRect();
            const viewportH = window.innerHeight || 1;

            // Progress from 0..1 while hero is in/near view
            const progress = Math.min(1, Math.max(0, (viewportH - rect.top) / (viewportH + rect.height)));
            const offset = (progress - 0.5) * 20; // subtle: -10px..+10px

            this.media.style.transform = `translate3d(0, ${offset}px, 0)`;
            this.ticking = false;
        });
    }
}

function initParallax() {
    // Only affects pages that have the hero media
    new ParallaxController();
}

// ========== AUTH STATE (FRONTEND ONLY / LOCALSTORAGE) ==========
const AUTH_STORAGE_KEY = 'eventsx_current_user';

function safeJsonParse(value) {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function getCurrentUser() {
    return safeJsonParse(localStorage.getItem(AUTH_STORAGE_KEY));
}

function isLoggedIn() {
    return !!getCurrentUser();
}

function setCurrentUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

function inPagesFolder() {
    const path = String(window.location.pathname || '').toLowerCase().replaceAll('\\', '/');
    return path.includes('/pages/');
}

function pathToRegistration() {
    return inPagesFolder() ? 'registration.html' : 'pages/registration.html';
}

function pathToDashboard() {
    return inPagesFolder() ? 'dashboard.html' : 'pages/dashboard.html';
}

function updateHeaderAuthUi() {
    const link = document.querySelector('.login-icon-link');
    const label = link ? link.querySelector('span') : null;
    if (!link || !label) return;

    const user = getCurrentUser();
    if (!user) {
        label.textContent = 'Login';
        link.setAttribute('href', pathToRegistration());
        link.setAttribute('aria-label', 'Login or Register');
        link.removeAttribute('title');
        return;
    }

    // When logged in, show username in header and link to dashboard.
    const displayName = user.displayName || user.fullName || user.username || 'Account';
    label.textContent = displayName;
    link.setAttribute('href', pathToDashboard());
    link.setAttribute('aria-label', 'Go to Dashboard');
    link.setAttribute('title', 'Go to Dashboard');
}

function initDashboardLogout() {
    const btn = document.getElementById('logout-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        clearCurrentUser();
        refreshAuthUi();
        window.location.href = pathToRegistration();
    });
}

function updateHomeHeroCta() {
    const heroBtn = document.querySelector('.hero-btn');
    if (!heroBtn) return;

    heroBtn.setAttribute('href', isLoggedIn() ? pathToDashboard() : pathToRegistration());
}

function populateDashboardProfile() {
    const nameEl = document.getElementById('user-name');
    const detailsEl = document.getElementById('user-details');
    const logoutBtn = document.getElementById('logout-btn');
    if (!nameEl || !detailsEl) return;

    const user = getCurrentUser();
    if (!user) {
        nameEl.textContent = 'Guest';
        if (logoutBtn) logoutBtn.style.display = 'none';
        detailsEl.innerHTML = `
            <li class="mb-1">Not logged in</li>
            <li class="mb-1"><a href="${pathToRegistration()}">Go to Login</a></li>
        `;
        return;
    }

    if (logoutBtn) logoutBtn.style.display = '';

    nameEl.textContent = user.displayName || user.fullName || user.username || 'User';

    const usernameLine = user.username ? `<li class="mb-1"><strong>Username:</strong> ${user.username}</li>` : '';
    const emailLine = user.email ? `<li class="mb-1"><strong>Email:</strong> ${user.email}</li>` : '';
    detailsEl.innerHTML = `${usernameLine}${emailLine}`;
}

function refreshAuthUi() {
    updateHeaderAuthUi();
    updateHomeHeroCta();
    populateDashboardProfile();
}

// ========== NAVIGATION ==========
function initNavigation() {
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
        const scrollDiff = Math.abs(currentScrollY - lastScrollY);
        
        if (scrollDiff < 10) return; // Dead-zone to prevent flickering

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        lastScrollY = currentScrollY;
    }, { passive: true });
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
    initCountdownTimers();
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
window.EventsX = window.EventsX || {};
Object.assign(window.EventsX, {
    showNotification,
    updateCurrentYear,
    auth: {
        getCurrentUser,
        isLoggedIn,
        setCurrentUser,
        clearCurrentUser,
        refreshAuthUi
    }
});

})();
