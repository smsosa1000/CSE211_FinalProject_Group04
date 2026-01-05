/**
 * EVENTSX - Events Catalog Logic
 * Refactored to ES6 Class Structure
 */

const EXTRA_EVENTS_STORAGE_KEY = 'eventsx_extra_events';

function loadExtraEvents() {
    try {
        const parsed = JSON.parse(localStorage.getItem(EXTRA_EVENTS_STORAGE_KEY));
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveExtraEvents(events) {
    localStorage.setItem(EXTRA_EVENTS_STORAGE_KEY, JSON.stringify(events));
}

class EventCatalog {
    constructor(data) {
        this.events = Array.isArray(data) ? data : [];
        this.tbody = document.getElementById('events-tbody');
        this.categoryFilter = document.getElementById('category-filter');
        this.priceSort = document.getElementById('price-sort');
        this.searchInput = document.getElementById('event-search');

        if (this.tbody) {
            this.init();
        }
    }

    init() {
        this.applyUrlQuery();
        this.renderAll(this.events);
        this.bindEvents();
    }

    bindEvents() {
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => this.filterAndSort());
        }
        if (this.priceSort) {
            this.priceSort.addEventListener('change', () => this.filterAndSort());
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.filterAndSort());
        }

        document.addEventListener('eventsx:addEvent', (e) => {
            const event = e.detail?.event;
            if (event) this.addEvent(event);
        });
    }

    applyUrlQuery() {
        if (!this.searchInput) return;
        const params = new URLSearchParams(window.location.search);
        const q = (params.get('q') || '').trim();
        if (q) {
            this.searchInput.value = q;
        }
    }

    renderAll(data) {
        this.renderTable(data);

        document.dispatchEvent(new CustomEvent('eventsx:eventsUpdated', {
            detail: {
                total: this.events.length,
                visible: data.length
            }
        }));
    }

    renderTable(data) {
        if (!this.tbody) return;

        if (data.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="7" class="text-center">No events found matching your criteria.</td></tr>';
            return;
        }

        this.tbody.innerHTML = data.map(event => `
            <tr>
                <td><strong>${event.name}</strong></td>
                <td><span class="badge primary">${event.category}</span></td>
                <td><time>${event.date}</time></td>
                <td>${event.location}</td>
                <td>${event.cost.toFixed(2)}</td>
                <td>
                    <figure class="table-figure">
                        <img src="images/events/${event.image}" alt="${event.name}" width="80" height="60" onerror="this.src='images/logo.png'">
                    </figure>
                </td>
                <td><a href="registration.html?event=${encodeURIComponent(event.name)}" class="btn btn-sm btn-primary">Register</a></td>
            </tr>
        `).join('');
    }

    addEvent(eventObj) {
        if (!window.EventsX?.auth?.isAdmin?.()) {
            window.EventsX?.showNotification?.('Error', 'Admin only.', 'error');
            return;
        }

        const event = {
            name: String(eventObj?.name || '').trim(),
            category: String(eventObj?.category || '').trim(),
            date: String(eventObj?.date || '').trim(),
            location: String(eventObj?.location || '').trim(),
            cost: Number(eventObj?.cost || 0),
            image: String(eventObj?.image || '').trim()
        };

        if (!event.name || !event.category || !event.date || !event.location || !Number.isFinite(event.cost)) {
            window.EventsX?.showNotification?.('Error', 'Please fill all event fields correctly.', 'error');
            return;
        }

        this.events.unshift(event);

        const extras = loadExtraEvents();
        extras.unshift(event);
        saveExtraEvents(extras.slice(0, 200));

        document.dispatchEvent(new CustomEvent('eventsx:eventAdded', { detail: { event } }));
        this.filterAndSort();
        window.EventsX?.showNotification?.('Success', 'Event added successfully.', 'success');
    }

    filterAndSort() {
        const category = this.categoryFilter.value.toLowerCase();
        const sort = this.priceSort.value;
        const q = (this.searchInput?.value || '').trim().toLowerCase();

        let filtered = this.events.filter(event => {
            if (category === 'all') return true;
            return event.category.toLowerCase().includes(category);
        });

        if (q) {
            filtered = filtered.filter(event => {
                const haystack = `${event.name} ${event.category} ${event.location}`.toLowerCase();
                return haystack.includes(q);
            });
        }

        if (sort === 'low') {
            filtered.sort((a, b) => a.cost - b.cost);
        } else if (sort === 'high') {
            filtered.sort((a, b) => b.cost - a.cost);
        }

        this.renderAll(filtered);
    }
}

class AdminAddEventForm {
    constructor() {
        this.section = document.getElementById('admin-add-event');
        this.form = document.getElementById('admin-add-event-form');

        if (!this.section || !this.form) return;

        this.syncVisibility();
        this.bind();

        document.addEventListener('eventsx:authChanged', () => this.syncVisibility());
    }

    syncVisibility() {
        const show = !!window.EventsX?.auth?.isAdmin?.();
        this.section.classList.toggle('hidden', !show);
    }

    bind() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const event = {
                name: document.getElementById('admin-event-name')?.value,
                category: document.getElementById('admin-event-category')?.value,
                date: document.getElementById('admin-event-date')?.value,
                location: document.getElementById('admin-event-location')?.value,
                cost: parseFloat(document.getElementById('admin-event-cost')?.value),
                image: document.getElementById('admin-event-image')?.value
            };

            document.dispatchEvent(new CustomEvent('eventsx:addEvent', { detail: { event } }));
            this.form.reset();
        });
    }
}

// Mock Data
const MOCK_EVENTS = [
    { name: 'Salt & Pepper Supper Club', category: 'Food', date: 'Jan 3, 2026, 10:00 PM', location: 'London', cost: 65, image: 'event1_salt_pepper_supper_club.jpeg' },
    { name: 'Spiritus Natalis', category: 'Music / Culture', date: 'Jan 1, 2026, 9:00 PM', location: 'Porto', cost: 70, image: 'event2_spiritus_natalis.jpeg' },
    { name: 'Carrossel Veneziano', category: 'Leisure', date: 'Jan 1, 2026, 12:00 AM', location: 'Cascais', cost: 40, image: 'event3_carrossel_veneziano.jpeg' },
    { name: 'Diverlândia', category: 'Business', date: 'Jan 1, 2026, 3:00 PM', location: 'Lisbon', cost: 150, image: 'event4_Diverlândia.jpg' },
    { name: 'Carmen Miranda | Teatro Politeama', category: 'Culture', date: 'Jan 1, 2026, 9:00 PM', location: 'Lisbon', cost: 95, image: 'event5_carmen_miranda.jpg' },
    { name: 'Jonas & Lander | Jardins do Bombarda', category: 'Music', date: 'Dec 31, 2025, 12:00 AM', location: 'Lisbon', cost: 120, image: 'event6_jonas_lander.jpg' },
    { name: 'Ano Novo no Lux | Lux Frágil', category: 'Leisure', date: 'Dec 31, 2025, 12:00 AM', location: 'Lisbon', cost: 130, image: 'event7_ano_novo_no_lux.jpg' },
    { name: 'The Great Mona | Mona Verde', category: 'Leisure', date: 'Jan 1, 2026, 8:00 PM', location: 'Lisbon', cost: 75, image: 'event8_the_great_mona.jpeg' },
    { name: 'Concerto de Ano Novo | Belém', category: 'Music', date: 'Jan 1, 2026, 11:00 AM', location: 'Lisbon', cost: 180, image: 'event9_concerto_de_ano_novo.jpeg' },
    { name: 'Queen Sheeks Jamaican Pop-Up', category: 'Food', date: 'Jan 2, 2026, 12:00 PM', location: 'London', cost: 65, image: 'event10_queen_sheeks_jamaican_popup.avif' },
    { name: 'Diverlândia 2', category: 'Business', date: 'Jan 6, 2026, 2:00 PM', location: 'Lisbon', cost: 220, image: 'event11_diverlandia_2.jpg' },
    { name: 'Carmen Miranda 2', category: 'Culture', date: 'Jan 7, 2026, 7:00 PM', location: 'Lisbon', cost: 90, image: 'event12_carmen_miranda_2.jpg' },
    { name: 'Jonas & Lander 2', category: 'Music', date: 'Jan 8, 2026, 9:00 PM', location: 'Lisbon', cost: 100, image: 'event13_Jonas_Lander.jpg' },
    { name: 'Ano Novo no Lux 2', category: 'Leisure', date: 'Jan 9, 2026, 11:00 PM', location: 'Lisbon', cost: 150, image: 'event14_ano_novo_no_lux2.jpg' },
    { name: 'Spanish Beginner Course', category: 'Business', date: 'Jan 19, 2026, 7:30 PM', location: 'London', cost: 200, image: 'event15_spanish_beginner_course.png' },
    { name: 'Italian Beginner Course A1', category: 'Business', date: 'Jan 20, 2026, 6:00 PM', location: 'London', cost: 220, image: 'event16_italian_beginner_course_a1.jpg' },
    { name: 'The Gladwin Brothers\' Burns Night', category: 'Food / Nightlife', date: 'Jan 24, 2026, 8:00 PM', location: 'London', cost: 75, image: 'event17_burns_night.webp' },
    { name: 'The Ultimate Bottomless Tea', category: 'Food', date: 'Jan 31, 2025, 5:00 PM', location: 'London', cost: 95, image: 'event18_bottomless_afternoon_tea.jpg' },
    { name: 'DOUGH-IT YOURSELF Pizza Class', category: 'Food', date: 'Feb 13, 2026, 9:00 PM', location: 'London', cost: 120, image: 'event19_pizza_making_class.jpeg' },
    { name: 'Plant Based Food Fest London', category: 'Food / Nightlife', date: 'Feb 14, 2026, 10:00 AM', location: 'London', cost: 180, image: 'event20_plant_based_food_fest.jpg' },
    { name: 'Shanghai Lounge: Cocktail Masterclass', category: 'Food / Nightlife', date: 'Mar 23, 2026, 8:00 PM', location: 'London', cost: 160, image: 'event21_shanghai_lounge.jpeg' }
];

document.addEventListener('DOMContentLoaded', () => {
    const allEvents = [...MOCK_EVENTS, ...loadExtraEvents()];
    window.eventCatalog = new EventCatalog(allEvents);
    window.adminAddEventForm = new AdminAddEventForm();
});
