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
        // Current IDs (thank-you.html)
        ref: document.getElementById('ref-id') || document.getElementById('reference-number'),
        name: document.getElementById('summary-name') || document.getElementById('user-name'),
        email: document.getElementById('summary-email') || document.getElementById('user-email'),
        event: document.getElementById('summary-event') || document.getElementById('event-name'),
        date: document.getElementById('summary-date'),

        // Backwards-compatible fallbacks (older markup)
        time: document.getElementById('submission-time'),
        timeline: document.getElementById('timeline-submission')
    };

    const now = new Date();
    const formattedTime = now.toLocaleString();
    const isoTime = now.toISOString();

    if (elements.ref) {
        elements.ref.textContent = params.get('ref') || 'EVX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    if (elements.name) elements.name.textContent = params.get('name') || 'Guest User';
    if (elements.email) elements.email.textContent = params.get('email') || 'user@example.com';
    if (elements.event) elements.event.textContent = params.get('event') || 'Selected Event';

    if (elements.date) {
        elements.date.textContent = formattedTime;
    }
    
    if (elements.time) {
        elements.time.textContent = formattedTime;
        elements.time.setAttribute('datetime', isoTime);
    }
    
    if (elements.timeline) {
        elements.timeline.textContent = formattedTime;
        elements.timeline.setAttribute('datetime', isoTime);
    }
}
