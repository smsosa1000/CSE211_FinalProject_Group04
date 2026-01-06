/**
 * EVENTSX - Global Core Logic (Session Based Only)
 * تم إزالة LocalStorage بالكامل للاعتماد على السيرفر
 */

(function () {

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initDynamicComponents();
    initParallax();
    updateCurrentYear();

    initDashboardLogout();

    // تحميل المستخدم من السيرفر وتحديث الواجهة
    void refreshAuthUi();
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

        const progress = Math.min(1, Math.max(0, (viewportH - rect.top) / (viewportH + rect.height)));
        const offset = (progress - 0.5) * 20;

        this.media.style.transform = `translate3d(0, ${offset}px, 0)`;
        this.ticking = false;
      });
    }
  }

  function initParallax() {
    new ParallaxController();
  }

  // ========== AUTH STATE ==========
  const API_BASE = '/api';

  let currentUserCache = null;
  let currentUserLoaded = false;

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

  function getCurrentUser() {
    return currentUserCache;
  }

  function isLoggedIn() {
    return !!currentUserCache;
  }

  function getRole() {
    const role = currentUserCache?.role;
    return (role ? String(role) : 'user').toLowerCase();
  }

  function isAdmin() {
    return isLoggedIn() && getRole() === 'admin';
  }

  function dispatchAuthChanged() {
    document.dispatchEvent(new CustomEvent('eventsx:authChanged', {
      detail: {
        isLoggedIn: isLoggedIn(),
        role: getRole(),
        user: getCurrentUser()
      }
    }));
  }

  function apiUrl(path) {
    return `${API_BASE}${path}`;
  }

  // الدالة الأساسية للاتصال بالسيرفر
  async function apiJson(path, options = {}) {
    const res = await fetch(apiUrl(path), {
      credentials: 'include', // مهم جداً عشان الكوكيز تتبعت
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const msg = data?.error || data?.message || `Request failed: ${res.status}`;
      throw new Error(msg);
    }
    if (data && data.ok === false) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // === دالة تحميل المستخدم (معدلة للاعتماد على السيرفر فقط) ===
  async function loadCurrentUserFromSession() {
    try {
      // نسأل السيرفر مباشرة: مين المستخدم الحالي؟
      const data = await apiJson('/auth/me.php', { method: 'GET' });
      const user = data?.user || data?.data || data;

      const validUser = (user && (user.id || user.email || user.name || user.username)) 
                        ? user : null;

      currentUserCache = validUser;
      
      // لاحظ: شلنا كود localStorage.setItem من هنا

      currentUserLoaded = true;
      console.log("Session User:", currentUserCache ? currentUserCache.username : "Guest");
      return currentUserCache;
    } catch (e) {
      // لو حصل خطأ أو مفيش مستخدم
      currentUserCache = null;
      currentUserLoaded = true;
      return null;
    }
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

    const displayName = user.name || user.displayName || user.fullName || user.username || 'Account';
    label.textContent = displayName;
    link.setAttribute('href', pathToDashboard());
    link.setAttribute('aria-label', 'Go to Dashboard');
    link.setAttribute('title', 'Go to Dashboard');
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
    
    // لو مش في صفحة الداشبورد، اخرج
    if (!nameEl || !detailsEl) return;

    const user = getCurrentUser();
    
    // لو مفيش مستخدم (والصفحة لسه مفتوحة)، اعرض Guest
    if (!user) {
      nameEl.textContent = 'Guest';
      if (logoutBtn) logoutBtn.style.display = 'none';
      detailsEl.innerHTML = `
        <li class="mb-1">Not logged in</li>
        <li class="mb-1"><a href="${pathToRegistration()}">Go to Login</a></li>
      `;
      return;
    }

    // عرض بيانات المستخدم القادمة من السيرفر
    if (logoutBtn) logoutBtn.style.display = '';
    nameEl.textContent = user.name || user.displayName || user.fullName || user.username || 'User';

    const usernameLine = user.username ? `<li class="mb-1"><strong>Username:</strong> ${user.username}</li>` : '';
    const emailLine = user.email ? `<li class="mb-1"><strong>Email:</strong> ${user.email}</li>` : '';
    const roleLine = user.role ? `<li class="mb-1"><strong>Role:</strong> ${user.role}</li>` : '';
    detailsEl.innerHTML = `${usernameLine}${emailLine}${roleLine}`;
  }

  async function loadMyRegistrations() {
    const listEl = document.getElementById('my-registrations');
    if (!listEl) return;

    if (!isLoggedIn()) {
      listEl.innerHTML = `<li>Login first to see your registrations.</li>`;
      return;
    }

    listEl.innerHTML = `<li>Loading...</li>`;

    try {
      // طلب الحجوزات من السيرفر
      const data = await apiJson('/registrations/list.php', { method: 'GET' });
      const rows = data?.registrations || data?.data || data?.items || [];

      if (!Array.isArray(rows) || rows.length === 0) {
        listEl.innerHTML = `<li>No registrations yet.</li>`;
        return;
      }

      listEl.innerHTML = rows.map(r => {
        const name = r.eventName || r.event_name || r.name || 'Event';
        const key = r.eventKey || r.event_key || '';
        const date = r.createdAt || r.created_at || '';
        const meta = [key, date].filter(Boolean).join(' • ');

        return `<li class="mb-2">
          <i class="fas fa-ticket-alt"></i>
          <strong>${escapeHtml(name)}</strong>
          ${meta ? `<div style="opacity:.75;font-size:.9em">${escapeHtml(meta)}</div>` : ''}
        </li>`;
      }).join('');
    } catch (e) {
      listEl.innerHTML = `<li>Failed to load registrations: ${escapeHtml(e.message || 'Error')}</li>`;
    }
  }

  async function refreshAuthUi() {
    if (!currentUserLoaded) {
      await loadCurrentUserFromSession();
    }

    updateHeaderAuthUi();
    updateHomeHeroCta();
    populateDashboardProfile();
    dispatchAuthChanged();
    await loadMyRegistrations();
  }

  // === دالة تسجيل الخروج ===
  function initDashboardLogout() {
    const btn = document.getElementById('logout-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      // طلب الخروج من السيرفر (مسح السيشن هناك)
      try {
        await apiJson('/auth/logout.php', { method: 'POST' });
      } catch (err) {
        console.warn(err);
      }

      currentUserCache = null;
      currentUserLoaded = true;

      await refreshAuthUi();
      window.location.href = pathToRegistration();
    });
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

      if (scrollDiff < 10) return;

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
      anchor.addEventListener('click', function (e) {
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

  function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<strong>${escapeHtml(title)}</strong>: ${escapeHtml(message)}`;

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

  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // ========== EXPORT GLOBAL ==========
  window.EventsX = window.EventsX || {};
  Object.assign(window.EventsX, {
    API_BASE,
    showNotification,
    updateCurrentYear,
    auth: {
      getCurrentUser,
      isLoggedIn,
      isAdmin,
      getRole,
      loadCurrentUserFromSession,
      refreshAuthUi
    }
  });

  // Register event helper
  async function registerForEvent(eventKey, eventName) {
    await window.EventsX.auth.refreshAuthUi();

    if (!window.EventsX.auth.isLoggedIn()) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href =
        `${pathToRegistration()}?next=${next}&eventKey=${encodeURIComponent(eventKey)}&eventName=${encodeURIComponent(eventName)}`;
      return;
    }

    try {
        await apiJson('/registrations/register.php', {
          method: 'POST',
          body: JSON.stringify({ eventKey, eventName })
        });

        showNotification('Success', `Registered for: ${eventName}`, 'success');
        
        // استنى ثانية وحول للداشبورد عشان يشوف الرسالة
        setTimeout(() => {
             window.location.href = pathToDashboard();
        }, 1000);
        
    } catch (e) {
        showNotification('Error', e.message || 'Registration failed', 'error');
    }
  }

  window.EventsX.registerForEvent = registerForEvent;

})();