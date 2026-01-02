/**
 * EVENTSX - Core App Class
 * Handles global notifications and utility functions
 */
class EventsXApp {
    constructor() {
        this.init();
    }

    init() {
        this.updateCurrentYear();
        console.log('EventsX Core Initialized');
    }

    updateCurrentYear() {
        document.querySelectorAll('.current-year').forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    }

    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<strong>${title}</strong>: ${message}`;
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px 25px',
            background: type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db',
            color: 'white',
            borderRadius: '5px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            zIndex: '10000',
            transition: 'all 0.5s ease',
            opacity: '0',
            transform: 'translateY(20px)'
        });
        
        document.body.appendChild(notification);
        
        // Animation frame for smooth entry
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
}

// Global Instance
window.EventsX = new EventsXApp();
