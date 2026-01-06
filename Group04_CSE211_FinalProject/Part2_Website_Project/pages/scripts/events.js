/**
 * EVENTSX - Events Catalog Logic (Connected to Backend)
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

function escapeHtml(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
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
        if (this.categoryFilter) this.categoryFilter.addEventListener('change', () => this.filterAndSort());
        if (this.priceSort) this.priceSort.addEventListener('change', () => this.filterAndSort());
        if (this.searchInput) this.searchInput.addEventListener('input', () => this.filterAndSort());

        document.addEventListener('eventsx:addEvent', (e) => {
            const event = e.detail?.event;
            if (event) this.addEvent(event);
        });

        this.tbody.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('[data-action="view-event"]');
            if (viewBtn) {
                const idx = Number(viewBtn.getAttribute('data-index'));
                if (this.events[idx]) this.showEventModal(this.events[idx]);
                return;
            }

            const regBtn = e.target.closest('[data-action="register-event"]');
            if (regBtn) {
                const idx = Number(regBtn.getAttribute('data-index'));
                const ev = this.events[idx];
                if (ev) this.handleRegistration(ev, regBtn);
            }
        });
    }

    async handleRegistration(event, btnElement) {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btnElement.disabled = true;

        try {
            if (window.EventsX && window.EventsX.registerForEvent) {

                await window.EventsX.registerForEvent(event.name, event.name);
                btnElement.innerHTML = '<i class="fas fa-check"></i> Registered';
                btnElement.classList.replace('btn-primary', 'btn-success');
            } else {
                alert("System Error: Main logic not loaded.");
                btnElement.innerHTML = originalText;
                btnElement.disabled = false;
            }
        } catch (error) {
            console.error(error);
            btnElement.innerHTML = originalText;
            btnElement.disabled = false;
        }
    }

    applyUrlQuery() {
        if (!this.searchInput) return;
        const params = new URLSearchParams(window.location.search);
        const q = (params.get('q') || '').trim();
        if (q) this.searchInput.value = q;
    }

    renderAll(data) {
        this.renderTable(data);
    }

    renderTable(data) {
        if (!this.tbody) return;

        if (!data || data.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="7" class="text-center">No events found matching your criteria.</td></tr>';
            return;
        }

        this.tbody.innerHTML = data.map((event) => {

            const globalIndex = this.events.indexOf(event);
            
            const imageFile = event.image ? escapeHtml(event.image) : '';
            const safeName = escapeHtml(event.name);
            const safeCategory = escapeHtml(event.category);
            const safeDate = escapeHtml(event.date);
            const safeLocation = escapeHtml(event.location);

            const costValue = Number(event.cost || 0); 
            const costText = costValue.toFixed(2);

            return `
                <tr>
                    <td><strong>${safeName}</strong></td>
                    <td><span class="badge primary">${safeCategory}</span></td>
                    <td><time>${safeDate}</time></td>
                    <td>${safeLocation}</td>
                    <td>${costText}</td>
                    <td>
                        <figure class="table-figure">
                            <img src="../images/events/${imageFile}" alt="${safeName}" width="80" height="60" onerror="this.src='../images/logo.png'">
                        </figure>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-sm btn-outline-primary" data-action="view-event" data-index="${globalIndex}">
                                View
                            </button>
                            <button type="button" class="btn btn-sm btn-primary" data-action="register-event" data-index="${globalIndex}">
                                Register
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    showEventModal(event) {
        const existing = document.getElementById('eventsx-modal');
        if (existing) existing.remove();

        const safeName = escapeHtml(event.name);
        const safeCategory = escapeHtml(event.category);
        const safeDate = escapeHtml(event.date);
        const safeLocation = escapeHtml(event.location);
        const costValue = Number(event.cost || 0);
        const costText = costValue.toFixed(2);
        const imageFile = escapeHtml(event.image || '');

        const modal = document.createElement('div');
        modal.id = 'eventsx-modal';
        
        modal.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 16px;">
                <div style="width: min(600px, 100%); background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.25);">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding: 14px 16px; border-bottom: 1px solid #eee;">
                        <h3 style="margin:0;">${safeName}</h3>
                        <button type="button" id="eventsx-modal-close" class="btn btn-sm btn-outline">Close</button>
                    </div>
                    <div style="padding: 16px;">
                        <img src="../images/events/${imageFile}" alt="${safeName}" style="width:100%; max-height:250px; object-fit:cover; border-radius:8px; margin-bottom:15px;" onerror="this.style.display='none'">
                        <p><strong>Category:</strong> ${safeCategory}</p>
                        <p><strong>Date:</strong> ${safeDate}</p>
                        <p><strong>Location:</strong> ${safeLocation}</p>
                        <p><strong>Cost:</strong> ${costText} EGP</p>
                        <button class="btn btn-primary btn-block mt-3" id="modal-register-btn">Register Now</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const close = () => modal.remove();
        modal.querySelector('#eventsx-modal-close')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal.firstElementChild) close(); });

        const modalRegBtn = modal.querySelector('#modal-register-btn');
        if(modalRegBtn) {
            modalRegBtn.addEventListener('click', () => {
                this.handleRegistration(event, modalRegBtn);
            });
        }
    }

    addEvent(eventObj) {
        if (!window.EventsX?.auth?.isAdmin?.()) {
            alert('Admin only.');
            return;
        }
        this.events.unshift(eventObj);
        this.renderAll(this.events);
    }

    filterAndSort() {
        const category = (this.categoryFilter?.value || 'all').toLowerCase();
        const sort = this.priceSort?.value || 'none';
        const q = (this.searchInput?.value || '').trim().toLowerCase();

        let filtered = this.events.filter(event => {
            if (category === 'all') return true;
            return String(event.category || '').toLowerCase().includes(category);
        });

        if (q) {
            filtered = filtered.filter(event => {
                const haystack = `${event.name} ${event.category} ${event.location}`.toLowerCase();
                return haystack.includes(q);
            });
        }

        if (sort === 'low') filtered.sort((a, b) => Number(a.cost) - Number(b.cost));
        else if (sort === 'high') filtered.sort((a, b) => Number(b.cost) - Number(a.cost));

        this.renderAll(filtered);
    }
}

class AdminAddEventForm {
    constructor() {
        this.section = document.getElementById('admin-add-event');
        this.form = document.getElementById('admin-add-event-form');
        if (!this.section || !this.form) return;
        
        if(window.EventsX?.auth?.isAdmin?.()) {
            this.section.classList.remove('hidden');
        }
        
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

document.addEventListener('DOMContentLoaded', async () => {

    if (window.EventsX && window.EventsX.auth && window.EventsX.auth.refreshAuthUi) {
        try { await window.EventsX.auth.refreshAuthUi(); } catch(e) {}
    }


    try {
        console.log("Fetching events from API...");
        const response = await fetch('../api/events.php');
        
        if (!response.ok) throw new Error("HTTP Error: " + response.status);
        
        const data = await response.json();
        console.log("API Response:", data);

        if (data.ok && Array.isArray(data.events)) {

            const finalData = [...data.events, ...loadExtraEvents()];
            window.eventCatalog = new EventCatalog(finalData);
        } else {
            console.warn("API returned error or empty data. Using mock data.");
            window.eventCatalog = new EventCatalog([...MOCK_EVENTS, ...loadExtraEvents()]);
        }
    } catch (err) {
        console.error("Database connection failed. Falling back to Mock Data:", err);
        window.eventCatalog = new EventCatalog([...MOCK_EVENTS, ...loadExtraEvents()]);
    }

    window.adminAddEventForm = new AdminAddEventForm();
});
