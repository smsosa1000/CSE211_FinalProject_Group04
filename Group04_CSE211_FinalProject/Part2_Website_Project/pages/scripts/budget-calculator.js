/**
 * EVENTSX - Budget Calculator Logic
 * Refactored to ES6 Class Structure
 */

class BudgetCalculator {
    constructor() {
        this.form = document.getElementById("budget-form") || document.getElementById("budgetCalculatorForm");
        this.tempSaveBtn = document.getElementById("tempSaveBudget");
        this.clearTempBtn = document.getElementById("clearTempSavedTotals");
        this.convertBtn = document.getElementById("convertCurrency");

        this.tempSaved = [];

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.calculate();
    }

    bindEvents() {
        // Event Selection
        const eventSelect = this.form.querySelector("#eventSelect");
        const ticketPrice = this.form.querySelector("#ticketPrice");
        const numPeopleEl = this.form.querySelector("#numTickets");

        if (eventSelect && ticketPrice) {
            eventSelect.addEventListener("change", (e) => {
                const price = e.target.options[e.target.selectedIndex].getAttribute("data-price");
                ticketPrice.value = price || 0;
                ticketPrice.readOnly = e.target.value !== "custom";
                ticketPrice.classList.toggle("bg-light", ticketPrice.readOnly);
                this.calculate();
            });
        }

        if (numPeopleEl) {
            numPeopleEl.addEventListener('input', () => {
                // Prevent negatives / invalid values in the number-of-people box
                const min = parseInt(numPeopleEl.getAttribute('min') || '1', 10);
                const current = parseInt(numPeopleEl.value, 10);
                if (!Number.isFinite(current)) return;
                if (current < min) numPeopleEl.value = String(min);
            });
        }

        // Live Calculation
        this.form.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => this.calculate());
        });

        // Temp Save Button (calculates + stores in a small display; clears on refresh)
        if (this.tempSaveBtn) {
            this.tempSaveBtn.addEventListener('click', () => {
                const resultBox = document.getElementById('calculationResult');
                if (resultBox) resultBox.classList.remove('hidden');

                const { totalCost } = this.calculate();
                this.addTempSavedTotal(totalCost);
            });
        }

        if (this.clearTempBtn) {
            this.clearTempBtn.addEventListener('click', () => this.clearTempSavedTotals());
        }

        // Currency Converter
        if (this.convertBtn) {
            this.convertBtn.addEventListener("click", () => this.convertCurrency());
        }
    }

    calculate() {
        const clampMin = (n, min = 0) => (Number.isFinite(n) ? Math.max(min, n) : min);

        const ticketPrice = clampMin(parseFloat(this.form.querySelector("#ticketPrice")?.value), 0);
        const numPeople = clampMin(parseFloat(this.form.querySelector("#numTickets")?.value), 1);
        const transport = clampMin(parseFloat(this.form.querySelector("#transportCost")?.value), 0);
        const food = clampMin(parseFloat(this.form.querySelector("#foodCost")?.value), 0);
        const accommodation = clampMin(parseFloat(this.form.querySelector("#accommodationCost")?.value), 0);

        const eventSubtotal = ticketPrice * numPeople;
        const totalCost = eventSubtotal + transport + food + accommodation;
        const perPerson = numPeople > 0 ? totalCost / numPeople : 0;

        this.updateDisplay(totalCost, perPerson, eventSubtotal, transport, food, accommodation, numPeople);

        return { totalCost, perPerson };
    }

    addTempSavedTotal(totalCost) {
        const container = document.getElementById('tempSavedTotals');
        const list = document.getElementById('tempSavedTotalsList');
        if (!container || !list) return;

        const format = (v) => `${v.toLocaleString(undefined, { minimumFractionDigits: 2 })} EGP`;
        this.tempSaved.unshift({ total: totalCost, at: new Date() });

        container.classList.remove('hidden');
        list.innerHTML = this.tempSaved
            .slice(0, 5)
            .map(item => `<li>${format(item.total)}</li>`)
            .join('');
    }

    clearTempSavedTotals() {
        this.tempSaved = [];

        const container = document.getElementById('tempSavedTotals');
        const list = document.getElementById('tempSavedTotalsList');
        if (list) list.innerHTML = '';
        if (container) container.classList.add('hidden');
    }

    updateDisplay(total, perPerson, subtotal, transport, food, accommodation, people) {
        const format = (v) => `${v.toLocaleString(undefined, { minimumFractionDigits: 2 })} EGP`;
        
        const els = {
            total: document.getElementById("totalCostInput"),
            perPerson: document.getElementById("perPersonCostInput"),
            tableTotal: document.getElementById("totalBudgetAmount")
        };

        if (els.total) els.total.value = format(total);
        if (els.perPerson) els.perPerson.value = format(perPerson);
        if (els.tableTotal) els.tableTotal.textContent = format(total);

        this.renderBreakdown(subtotal, transport, food, accommodation, total, people, format);
    }

    renderBreakdown(subtotal, transport, food, accommodation, total, people, format) {
        const breakdown = document.getElementById("budgetBreakdown");
        if (!breakdown) return;

        const categories = [
            { name: "Event Tickets", amount: subtotal, notes: `${people} person(s)` },
            { name: "Transport", amount: transport, notes: "Travel expenses" },
            { name: "Food & Meals", amount: food, notes: "Catering/Food" },
            { name: "Accommodation", amount: accommodation, notes: "Hotel / stay expenses" }
        ];

        breakdown.innerHTML = categories.map(cat => {
            const pct = total > 0 ? ((cat.amount / total) * 100).toFixed(1) : 0;
            return `<tr>
                <td>${cat.name}</td>
                <td>${format(cat.amount)}</td>
                <td>${pct}%</td>
                <td class="small text-muted">${cat.notes}</td>
            </tr>`;
        }).join("");
    }

    convertCurrency() {
        const amountEl = document.getElementById("amount");
        const currencyEl = document.getElementById("currency");
        const resultEl = document.getElementById("convertedAmountInput");

        if (!amountEl || !currencyEl) return;

        const rates = { 'USD': 0.02, 'EUR': 0.019, 'GBP': 0.016, 'AED': 0.075, 'KWD': 0.0063, 'SAR': 0.077 };
        const amount = Math.max(0, parseFloat(amountEl.value) || 0);
        const converted = amount * (rates[currencyEl.value] || 1);

        if (resultEl) {
            resultEl.value = `${converted.toFixed(2)} ${currencyEl.value}`;
            const conversionBox = document.getElementById("conversionResult");
            if (conversionBox) {
                conversionBox.classList.remove("hidden");
            }
        }
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    window.budgetCalculator = new BudgetCalculator();
});
