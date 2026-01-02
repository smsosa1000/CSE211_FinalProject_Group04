/**
 * EVENTSX - Budget Calculator Logic
 * Handles calculations, currency conversion, and data persistence
 */

document.addEventListener("DOMContentLoaded", function () {
  const budgetForm =
    document.getElementById("budget-form") ||
    document.getElementById("budgetCalculatorForm");
  if (budgetForm) initBudgetCalculator(budgetForm);
});

function initBudgetCalculator(form) {
  const eventSelect = form.querySelector("#eventSelect");
  const ticketPriceInput = form.querySelector("#ticketPrice");

  if (eventSelect && ticketPriceInput) {
    eventSelect.addEventListener("change", function () {
      const price = this.options[this.selectedIndex].getAttribute("data-price");
      ticketPriceInput.value = price || 0;
      ticketPriceInput.readOnly = this.value !== "custom";
      ticketPriceInput.classList.toggle("bg-light", ticketPriceInput.readOnly);
      calculateBudget(form);
    });
  }

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => calculateBudget(form));
  });

  const calcBtn = document.getElementById("calculateBudget");
  if (calcBtn) {
    calcBtn.addEventListener("click", () => {
      const res = document.getElementById("calculationResult");
      if (res) res.style.display = "block";
      calculateBudget(form);
      res.scrollIntoView({ behavior: "smooth" });
    });
  }

  const saveBtn = document.getElementById("saveBudget");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const eventName = form.querySelector("#eventSelect option:checked").text;
      const total = document.querySelector(".total-cost").textContent;
      const perPerson = document.querySelector(".per-person-cost").textContent;

      const budgetData = {
        event: eventName,
        total: total,
        perPerson: perPerson,
        date: new Date().toLocaleDateString(),
      };

      localStorage.setItem("saved_budget", JSON.stringify(budgetData));
      if (window.EventsX && window.EventsX.showNotification) {
        window.EventsX.showNotification(
          "Success",
          "Budget saved successfully to your browser!",
          "success"
        );
      } else {
        alert("Budget saved successfully!");
      }
    });
  }

  initCurrencyConverter();
  calculateBudget(form);
}

function calculateBudget(form) {
  const ticketPrice =
    parseFloat(form.querySelector("#ticketPrice")?.value) || 0;
  const numPeople = parseFloat(form.querySelector("#numTickets")?.value) || 1;
  const transport =
    parseFloat(form.querySelector("#transportCost")?.value) || 0;
  const food = parseFloat(form.querySelector("#foodCost")?.value) || 0;
  const accomPrice =
    parseFloat(form.querySelector("#accommodationCost")?.value) || 0;
  const nights =
    parseFloat(form.querySelector("#accommodationNights")?.value) || 0;

  const eventSubtotal = ticketPrice * numPeople;
  const travelStay = transport + accomPrice * nights;
  const grandTotal = eventSubtotal + travelStay + food;
  const perPerson = numPeople > 0 ? grandTotal / numPeople : 0;

  const formatEGP = (val) =>
    `${val.toLocaleString(undefined, { minimumFractionDigits: 2 })} EGP`;

  const els = {
    total: document.querySelector(".total-cost"),
    perPerson: document.querySelector(".per-person-cost"),
    portion: document.querySelector(".event-portion-cost"),
    tableTotal: document.getElementById("totalBudgetAmount"),
  };

  if (els.total) els.total.textContent = formatEGP(grandTotal);
  if (els.perPerson) els.perPerson.textContent = formatEGP(perPerson);
  if (els.portion) els.portion.textContent = formatEGP(eventSubtotal);
  if (els.tableTotal) els.tableTotal.textContent = formatEGP(grandTotal);

  const breakdown = document.getElementById("budgetBreakdown");
  if (breakdown) {
    const categories = [
      {
        name: "Event Tickets",
        amount: eventSubtotal,
        notes: `${numPeople} people`,
      },
      {
        name: "Travel & Stay",
        amount: travelStay,
        notes: `${nights} nights + transport`,
      },
      { name: "Food & Meals", amount: food, notes: "Total budget" },
    ];

    breakdown.innerHTML = categories
      .map((cat) => {
        const pct =
          grandTotal > 0 ? ((cat.amount / grandTotal) * 100).toFixed(1) : 0;
        return `<tr><td>${cat.name}</td><td>${formatEGP(
          cat.amount
        )}</td><td>${pct}%</td><td class="small text-muted">${
          cat.notes
        }</td></tr>`;
      })
      .join("");
  }
}

function initCurrencyConverter() {
  const amountInput = document.getElementById("amount");
  const currencySelect = document.getElementById("currency");
  const convertBtn = document.getElementById("convertCurrency");
  const resultDisplay = document.querySelector(".converted-amount");

  if (!amountInput || !currencySelect || !convertBtn) return;

  const rates = { 
        'USD': 0.02, 
        'EUR': 0.019, 
        'GBP': 0.016, 
        'AED': 0.075,
        'KWD': 0.0063,
        'SAR': 0.077
    };

  convertBtn.addEventListener("click", () => {
    const amount = parseFloat(amountInput.value) || 0;
    const converted = amount * (rates[currencySelect.value] || 1);
    if (resultDisplay) {
      resultDisplay.textContent = `${converted.toFixed(2)} ${
        currencySelect.value
      }`;
      document.getElementById("conversionResult").style.display = "block";
    }
  });
}
