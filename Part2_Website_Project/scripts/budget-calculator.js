/**
 * EVENTSX - Budget Calculator Logic
 * Refactored to ES6 Class Structure
 */

class BudgetCalculator {
    constructor() {
        this.form = document.getElementById("budget-form") || document.getElementById("budgetCalculatorForm");
        this.saveBtn = document.getElementById("saveBudget");
        this.convertBtn = document.getElementById("convertCurrency");

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

        if (eventSelect && ticketPrice) {
            eventSelect.addEventListener("change", (e) => {
                const price = e.target.options[e.target.selectedIndex].getAttribute("data-price");
                ticketPrice.value = price || 0;
                ticketPrice.readOnly = e.target.value !== "custom";
                ticketPrice.classList.toggle("bg-light", ticketPrice.readOnly);
                this.calculate();
            });
        }

        // Live Calculation
        this.form.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => this.calculate());
        });

        // Calculate Button
        const calcBtn = document.getElementById("calculateBudget");
        if (calcBtn) {
            calcBtn.addEventListener("click", () => {
                document.getElementById("calculationResult").style.display = "block";
                this.calculate();
                document.getElementById("calculationResult").scrollIntoView({ behavior: "smooth" });
            });
        }

        // Save Button
        if (this.saveBtn) {
            this.saveBtn.addEventListener("click", () => this.saveBudget());
        }

        // Currency Converter
        if (this.convertBtn) {
            this.convertBtn.addEventListener("click", () => this.convertCurrency());
        }
    }

    calculate() {
        const ticketPrice = parseFloat(this.form.querySelector("#ticketPrice")?.value) || 0;
        const numPeople = parseFloat(this.form.querySelector("#numTickets")?.value) || 1;
        const transport = parseFloat(this.form.querySelector("#transportCost")?.value) || 0;
        const food = parseFloat(this.form.querySelector("#foodCost")?.value) || 0;
        const accomPrice = parseFloat(this.form.querySelector("#accommodationCost")?.value) || 0;
        const nights = parseFloat(this.form.querySelector("#accommodationNights")?.value) || 0;

        const eventSubtotal = ticketPrice * numPeople;
        const travelStay = transport + (accomPrice * nights);
        const grandTotal = eventSubtotal + travelStay + food;
        const perPerson = numPeople > 0 ? grandTotal / numPeople : 0;

        this.updateDisplay(grandTotal, perPerson, eventSubtotal, travelStay, food, numPeople, nights);
    }

    updateDisplay(total, perPerson, subtotal, travel, food, people, nights) {
        const format = (v) => `${v.toLocaleString(undefined, { minimumFractionDigits: 2 })} EGP`;
        
        const els = {
            total: document.querySelector(".total-cost"),
            perPerson: document.querySelector(".per-person-cost"),
            portion: document.querySelector(".event-portion-cost"),
            tableTotal: document.getElementById("totalBudgetAmount")
        };

        if (els.total) els.total.textContent = format(total);
        if (els.perPerson) els.perPerson.textContent = format(perPerson);
        if (els.portion) els.portion.textContent = format(subtotal);
        if (els.tableTotal) els.tableTotal.textContent = format(total);

        this.renderBreakdown(subtotal, travel, food, total, people, nights, format);
    }

    renderBreakdown(subtotal, travel, food, total, people, nights, format) {
        const breakdown = document.getElementById("budgetBreakdown");
        if (!breakdown) return;

        const categories = [
            { name: "Event Tickets", amount: subtotal, notes: `${people} people` },
            { name: "Travel & Stay", amount: travel, notes: `${nights} nights + transport` },
            { name: "Food & Meals", amount: food, notes: "Total budget" }
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

    saveBudget() {
        const eventName = this.form.querySelector("#eventSelect option:checked").text;
        const total = document.querySelector(".total-cost").textContent;
        const perPerson = document.querySelector(".per-person-cost").textContent;

        const budgetData = {
            event: eventName,
            total,
            perPerson,
            date: new Date().toLocaleDateString()
        };

        localStorage.setItem("saved_budget", JSON.stringify(budgetData));
        
        if (window.EventsX) {
            window.EventsX.showNotification("Success", "Budget saved successfully!", "success");
        } else {
            alert("Budget saved successfully!");
        }
    }

    convertCurrency() {
        const amountEl = document.getElementById("amount");
        const currencyEl = document.getElementById("currency");
        const resultEl = document.querySelector(".converted-amount");

        if (!amountEl || !currencyEl) return;

        const rates = { 'USD': 0.02, 'EUR': 0.019, 'GBP': 0.016, 'AED': 0.075, 'KWD': 0.0063, 'SAR': 0.077 };
        const amount = parseFloat(amountEl.value) || 0;
        const converted = amount * (rates[currencyEl.value] || 1);

        if (resultEl) {
            resultEl.textContent = `${converted.toFixed(2)} ${currencyEl.value}`;
            document.getElementById("conversionResult").style.display = "block";
        }
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    window.budgetCalculator = new BudgetCalculator();
});
