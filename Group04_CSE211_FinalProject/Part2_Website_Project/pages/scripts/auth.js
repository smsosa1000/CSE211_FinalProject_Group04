/**
 * EVENTSX - Authentication Logic (Session Based)
 * الإصدار الكامل والمصحح لربط الواجهة بالباك إند
 */

class AuthManager {
  constructor() {
    // 1. تعريف العناصر الأساسية
    this.authContainer = document.querySelector('.auth-container');
    this.toggleBtn = document.getElementById('auth-toggle-btn');
    
    // ربط الحاويات (Sections) لتبديل الأنماط
    this.loginSection = document.getElementById('login-form');
    this.signupSection = document.getElementById('signup-form');

    // تحديد مسار الـ API بناءً على موقع الملف الحالي
    this.API_BASE = this.inPagesFolder() ? '../api' : 'api';

    // 2. التشغيل المبدئي
    if (this.authContainer && this.toggleBtn) {
      this.initSlidingAuth();
    }

    // التحقق من وجود نموذج التسجيل متعدد الخطوات
    if (document.getElementById('signup-form-element')) {
      this.initMultiStepForm();
    }

    this.initAuthHandlers();
    
    // التحقق من حالة الدخول بمجرد فتح الصفحة (Auto Redirect)
    void this.autoRedirectIfLoggedIn();
  }

  // ---------- Path helpers ----------
  inPagesFolder() {
    // طريقة أدق للتحقق من المجلد الحالي
    return window.location.pathname.includes('/pages/');
  }

  pathToDashboard() {
    return this.inPagesFolder() ? 'dashboard.html' : 'pages/dashboard.html';
  }

  // ---------- Helpers ----------
  notify(title, msg, type = 'info') {
    if (window.EventsX?.showNotification) {
      window.EventsX.showNotification(title, msg, type);
    } else {
      alert(`${title}: ${msg}`);
    }
  }

  getParams() {
    const sp = new URLSearchParams(window.location.search || '');
    return {
      next: sp.get('next'),
      eventKey: sp.get('eventKey') || sp.get('event'), // دعم التسميتين
      eventName: sp.get('eventName') || sp.get('event')
    };
  }

  // دالة الاتصال الموحدة بالسيرفر
  async apiRequest(path, { method = 'GET', body = null } = {}) {
    const url = `${this.API_BASE}${path}`;
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ضروري جداً لعمل الجلسات (Sessions)
    };
    if (body !== null) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.error || `Server error: ${res.status}`);
    }
    return data;
  }

  // ما بعد الدخول الناجح: التعامل مع التحويلات وحجز الفعاليات
  async afterLoginSuccess() {
    const { next, eventKey, eventName } = this.getParams();

    // 1. إذا كان المستخدم قادماً من صفحة فعاليات (حجز تلقائي)
    if (eventKey || eventName) {
      try {
        // نستخدم دالة الحجز المركزية إذا كانت متوفرة في main.js
        if (window.EventsX?.registerForEvent) {
          await window.EventsX.registerForEvent(eventKey || eventName, eventName || eventKey);
        } else {
          // حجز يدوي مباشر عبر الـ API
          await this.apiRequest('/registrations/register.php', {
            method: 'POST',
            body: { eventKey: eventKey || eventName, eventName: eventName || eventKey }
          });
          window.location.href = this.pathToDashboard();
        }
        return; 
      } catch (e) {
        console.error("Auto-registration failed:", e);
        window.location.href = this.pathToDashboard();
        return;
      }
    }

    // 2. التحويل إلى رابط محدد (Redirect URL)
    if (next) {
      window.location.href = decodeURIComponent(next);
      return;
    }

    // 3. الافتراضي: لوحة التحكم
    window.location.href = this.pathToDashboard();
  }

  // ---------- Auth Flow ----------
  async autoRedirectIfLoggedIn() {
    // لا نحتاج للتحويل إذا كنا بالفعل في صفحة الدخول إلا لو كان المستخدم مسجلاً
    try {
      const data = await this.apiRequest('/auth/me.php');
      if (data && data.user) {
        window.location.href = this.pathToDashboard();
      }
    } catch (e) {
      // مستخدم غير مسجل، لا نفعل شيئاً
    }
  }

  initAuthHandlers() {
    const loginFormEl = document.getElementById('login-form-element');
    const signupFormEl = document.getElementById('signup-form-element');

    // ---- LOGIN ----
    if (loginFormEl) {
      loginFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = loginFormEl.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        const login = document.getElementById('login-username')?.value.trim();
        const password = document.getElementById('login-password')?.value;

        if (!login || !password) {
          this.notify('Missing Info', 'Please enter both username and password.', 'error');
          return;
        }

        try {
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
          btn.disabled = true;

          const data = await this.apiRequest('/auth/login.php', {
            method: 'POST',
            body: { login, password }
          });

          if (data.ok) {
            this.notify('Success', 'Welcome back!', 'success');
            await this.afterLoginSuccess();
          }
        } catch (err) {
          this.notify('Login Error', err.message, 'error');
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      });
    }

    // ---- SIGNUP ----
    if (signupFormEl) {
      signupFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = signupFormEl.querySelector('button[type="submit"]');
        
        const username = document.getElementById('reg-username')?.value.trim();
        const fullName = document.getElementById('reg-fullname')?.value.trim();
        const email = document.getElementById('reg-email')?.value.trim();
        const password = document.getElementById('reg-password')?.value;
        const confirm = document.getElementById('reg-confirm-password')?.value;
        const phone = document.getElementById('reg-phone')?.value.trim() || null;

        if (password !== confirm) {
          this.notify('Validation Error', 'Passwords do not match!', 'error');
          return;
        }

        try {
          btn.disabled = true;
          const data = await this.apiRequest('/auth/register.php', {
            method: 'POST',
            body: { username, name: fullName, email, phone, password }
          });

          if (data.ok) {
            this.notify('Account Created', 'Registration successful!', 'success');
            await this.afterLoginSuccess();
          }
        } catch (err) {
          this.notify('Registration Error', err.message, 'error');
          btn.disabled = false;
        }
      });
    }
  }

  // ---------- Sliding UI (Animation) ----------
  initSlidingAuth() {
    this.toggleBtn.addEventListener('click', () => {
      this.authContainer.classList.toggle('signup-mode');
      const isSignup = this.authContainer.classList.contains('signup-mode');
      
      const titleEl = document.getElementById('sidebar-title');
      const textEl = document.getElementById('sidebar-text');

      if (isSignup) {
        this.loginSection?.classList.remove('active');
        this.signupSection?.classList.add('active');
        if (titleEl) titleEl.textContent = "Welcome Back!";
        if (textEl) textEl.textContent = "Already have an account? Login here.";
        this.toggleBtn.textContent = "Sign In";
      } else {
        this.loginSection?.classList.add('active');
        this.signupSection?.classList.remove('active');
        if (titleEl) titleEl.textContent = "New Here?";
        if (textEl) textEl.textContent = "Create an account to access EventsX.";
        this.toggleBtn.textContent = "Sign Up";
      }
    });
  }

  // ---------- Multi-step Form Logic ----------
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
          currentStep = Math.min(currentStep + 1, steps.length - 1);
          steps[currentStep].classList.add('active');
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        steps[currentStep].classList.remove('active');
        currentStep = Math.max(currentStep - 1, 0);
        steps[currentStep].classList.add('active');
      });
    });
  }

  validateStep(stepElement, stepIdx) {
    const inputs = stepElement.querySelectorAll('input[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.classList.add('border-danger');
      } else {
        input.classList.remove('border-danger');
      }
    });

    // تحقق إضافي للباسورد في الخطوة الأولى
    if (stepIdx === 0) {
      const pass = document.getElementById('reg-password')?.value;
      const conf = document.getElementById('reg-confirm-password')?.value;
      if (pass && pass.length < 8) {
        this.notify('Weak Password', 'Password must be 8+ characters.', 'error');
        valid = false;
      }
      if (pass !== conf) {
        this.notify('Mismatch', 'Passwords do not match.', 'error');
        valid = false;
      }
    }

    return valid;
  }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager();
});