// budget-calculator.js - Budget Calculator specific functionality
// Group05_223101629_223101614
// CSE211 Web Programming - Course Project
// Date: 2025-12-05

class BudgetCalculator {
    constructor() {
        this.calculations = [];
        this.initialize();
    }
    
    initialize() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.updateHistoryDisplay();
    }
    
    setupEventListeners() {
        // Event selection change
        const eventSelect = document.getElementById('eventName');
        if (eventSelect) {
            eventSelect.addEventListener('change', (e) => this.onEventChange(e));
        }
        
        // Calculate button
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
        }
        
        // Input changes for real-time updates
        const inputs = document.querySelectorAll('#budgetCalculator input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateRealTimeEstimate());
        });
    }
    
    onEventChange(event) {
        const customFields = document.getElementById('customEventFields');
        if (event.target.value === 'custom') {
            customFields.style.display = 'block';
            document.getElementById('customEventCost').focus();
        } else {
            customFields.style.display = 'none';
        }
        
        // Update real-time estimate
        this.updateRealTimeEstimate();
    }
    
    updateRealTimeEstimate() {
        // Quick estimate without full calculation
        const ticketCost = this.getTicketCost();
        const otherCosts = this.getOtherCosts();
        const quickEstimate = ticketCost + otherCosts;
        
        // Update quick estimate display if it exists
        const estimateDisplay = document.getElementById('quickEstimate');
        if (estimateDisplay) {
            estimateDisplay.textContent = this.formatCurrency(quickEstimate);
        }
    }
    
    getTicketCost() {
        const eventSelect = document.getElementById('eventName');
        const selectedEvent = eventSelect.value;
        let ticketPrice = 0;
        
        switch(selectedEvent) {
            case 'intro-web-dev': ticketPrice = 0; break;
            case 'advanced-js': ticketPrice = 50; break;
            case 'css-masterclass': ticketPrice = 25; break;
            case 'react-fundamentals': ticketPrice = 75; break;
            case 'node-backend': ticketPrice = 100; break;
            case 'sql-design': ticketPrice = 60; break;
            case 'custom': 
                ticketPrice = parseFloat(document.getElementById('customEventCost').value) || 0;
                break;
            default: ticketPrice = 0;
        }
        
        const numTickets = parseInt(document.getElementById('numTickets').value) || 1;
        return ticketPrice * numTickets;
    }
    
    getOtherCosts() {
        const costs = [
            'transportCost',
            'parkingCost',
            'accommodationCost',
            'foodCost',
            'materialsCost',
            'otherCost'
        ];
        
        return costs.reduce((total, id) => {
            const value = parseFloat(document.getElementById(id).value) || 0;
            return total + value;
        }, 0);
    }
    
    calculate() {
        const calculation = {
            id: Date.now(),
            date: new Date().toISOString(),
            event: document.getElementById('eventName').value,
            ticketCost: this.getTicketCost(),
            otherCosts: this.getOtherCosts(),
            breakdown: this.getCostBreakdown()
        };
        
        calculation.total = calculation.ticketCost + calculation.otherCosts;
        
        this.calculations.unshift(calculation);
        this.saveToLocalStorage();
        this.updateHistoryDisplay();
        this.displayResults(calculation);
        
        // Announce to screen reader
        if (window.EduConnect && window.EduConnect.announceToScreenReader) {
            window.EduConnect.announceToScreenReader(`Budget calculated: ${this.formatCurrency(calculation.total)}`);
        }
    }
    
    getCostBreakdown() {
        return {
            transport: parseFloat(document.getElementById('transportCost').value) || 0,
            parking: parseFloat(document.getElementById('parkingCost').value) || 0,
            accommodation: parseFloat(document.getElementById('accommodationCost').value) || 0,
            food: parseFloat(document.getElementById('foodCost').value) || 0,
            materials: parseFloat(document.getElementById('materialsCost').value) || 0,
            other: parseFloat(document.getElementById('otherCost').value) || 0
        };
    }
    
    displayResults(calculation) {
        // Update main display
        document.getElementById('ticketCost').textContent = this.formatCurrency(calculation.ticketCost);
        document.getElementById('transportDisplay').textContent = this.formatCurrency(calculation.breakdown.transport);
        document.getElementById('parkingDisplay').textContent = this.formatCurrency(calculation.breakdown.parking);
        document.getElementById('accommodationDisplay').textContent = this.formatCurrency(calculation.breakdown.accommodation);
        document.getElementById('foodDisplay').textContent = this.formatCurrency(calculation.breakdown.food);
        document.getElementById('materialsDisplay').textContent = this.formatCurrency(calculation.breakdown.materials);
        document.getElementById('otherDisplay').textContent = this.formatCurrency(calculation.breakdown.other);
        document.getElementById('totalCost').textContent = this.formatCurrency(calculation.total);
        document.getElementById('finalTotal').textContent = this.formatCurrency(calculation.total);
        
        // Show results section
        document.getElementById('costBreakdown').style.display = 'block';
        document.getElementById('noResults').style.display = 'none';
        
        // Add animation
        this.animateResult();
        
        // Update chart if exists
        this.updateChart();
    }
    
    animateResult() {
        const totalElement = document.getElementById('totalCost');
        totalElement.style.transform = 'scale(1.1)';
        totalElement.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            totalElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }
    
    saveToLocalStorage() {
        // Keep only last 20 calculations
        const toSave = this.calculations.slice(0, 20);
        localStorage.setItem('budgetCalculations', JSON.stringify(toSave));
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('budgetCalculations');
        if (saved) {
            this.calculations = JSON.parse(saved);
        }
    }
    
    updateHistoryDisplay() {
        const historyContainer = document.getElementById('calculationHistory');
        if (!historyContainer) return;
        
        if (this.calculations.length === 0) {
            historyContainer.innerHTML = '<p>No calculations yet.</p>';
            return;
        }
        
        const historyHTML = this.calculations.map(calc => `
            <div class="history-item">
                <div class="history-header">
                    <strong>${this.getEventName(calc.event)}</strong>
                    <span class="history-date">${new Date(calc.date).toLocaleDateString()}</span>
                </div>
                <div class="history-total">${this.formatCurrency(calc.total)}</div>
                <button class="btn-small" onclick="budgetCalculator.loadCalculation(${calc.id})">
                    Load
                </button>
                <button class="btn-small btn-secondary" onclick="budgetCalculator.deleteCalculation(${calc.id})">
                    Delete
                </button>
            </div>
        `).join('');
        
        historyContainer.innerHTML = historyHTML;
    }
    
    getEventName(eventKey) {
        const eventNames = {
            'intro-web-dev': 'Intro to Web Dev',
            'advanced-js': 'Advanced JS Workshop',
            'css-masterclass': 'CSS Masterclass',
            'react-fundamentals': 'React Fundamentals',
            'node-backend': 'Node.js Backend',
            'sql-design': 'SQL Database Design',
            'custom': 'Custom Event'
        };
        
        return eventNames[eventKey] || eventKey;
    }
    
    loadCalculation(id) {
        const calculation = this.calculations.find(calc => calc.id === id);
        if (!calculation) return;
        
        // Populate form with saved values
        // This would require mapping calculation data back to form fields
        // Implementation depends on form structure
    }
    
    deleteCalculation(id) {
        this.calculations = this.calculations.filter(calc => calc.id !== id);
        this.saveToLocalStorage();
        this.updateHistoryDisplay();
    }
    
    updateChart() {
        const chartCanvas = document.getElementById('budgetChart');
        if (!chartCanvas) return;
        
        const ctx = chartCanvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        
        // Prepare data for chart
        const labels = this.calculations.slice(0, 5).map(calc => 
            this.getEventName(calc.event)
        ).reverse();
        
        const data = this.calculations.slice(0, 5).map(calc => calc.total).reverse();
        
        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Cost',
                    data: data,
                    backgroundColor: '#2563EB',
                    borderColor: '#1E40AF',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => this.formatCurrency(value)
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: context => this.formatCurrency(context.raw)
                        }
                    }
                }
            }
        });
    }
    
    exportToCSV() {
        if (this.calculations.length === 0) {
            alert('No calculations to export.');
            return;
        }
        
        const headers = ['Date', 'Event', 'Ticket Cost', 'Other Costs', 'Total'];
        const rows = this.calculations.map(calc => [
            new Date(calc.date).toLocaleDateString(),
            this.getEventName(calc.event),
            this.formatCurrency(calc.ticketCost),
            this.formatCurrency(calc.otherCosts),
            this.formatCurrency(calc.total)
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `budget-calculations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize budget calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.budgetCalculator = new BudgetCalculator();
    
    // Add export button if not exists
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-secondary';
    exportBtn.textContent = 'Export to CSV';
    exportBtn.style.marginTop = '1rem';
    exportBtn.addEventListener('click', () => budgetCalculator.exportToCSV());
    
    const historySection = document.querySelector('.history-section');
    if (historySection) {
        historySection.appendChild(exportBtn);
    }
});