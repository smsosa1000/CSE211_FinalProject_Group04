/**
 * EVENTSX - Thank You Page Logic
 * Handles dynamic population of registration summary
 */

document.addEventListener('DOMContentLoaded', function() {
    populateSummary();
});

function populateSummary() {
    // In a real app, these would come from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    
    const elements = {
        ref: document.getElementById('reference-number'),
        name: document.getElementById('user-name'),
        email: document.getElementById('user-email'),
        event: document.getElementById('event-name'),
        time: document.getElementById('submission-time'),
        timeline: document.getElementById('timeline-submission')
    };

    const now = new Date();
    const formattedTime = now.toLocaleString();
    const isoTime = now.toISOString();

    if (elements.ref) elements.ref.textContent = params.get('ref') || 'EVX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    if (elements.name) elements.name.textContent = params.get('name') || 'Guest User';
    if (elements.email) elements.email.textContent = params.get('email') || 'user@example.com';
    if (elements.event) elements.event.textContent = params.get('event') || 'Selected Event';
    
    if (elements.time) {
        elements.time.textContent = formattedTime;
        elements.time.setAttribute('datetime', isoTime);
    }
    
    if (elements.timeline) {
        elements.timeline.textContent = formattedTime;
        elements.timeline.setAttribute('datetime', isoTime);
    }
}
