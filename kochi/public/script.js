// Train Management System
class TrainManager {
    constructor() {
        this.trains = {};
        this.currentFilter = 'all';
        this.statusTypes = ['service', 'standby', 'washing', 'maintenance'];
        
        this.init();
    }
    
    init() {
        // Initialize 25 trains with random statuses
        for (let i = 1; i <= 25; i++) {
            const trainId = i.toString().padStart(3, '0');
            const randomStatus = this.statusTypes[Math.floor(Math.random() * this.statusTypes.length)];
            this.trains[trainId] = randomStatus;
        }
        
        this.render();
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Filter button listeners
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });
        
        // Status overview click listeners
        document.querySelectorAll('.status-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const status = e.currentTarget.dataset.status;
                if (status) {
                    this.setFilter(status);
                }
            });
        });
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTrains();
    }
    
    changeTrainStatus(trainId, newStatus) {
        this.trains[trainId] = newStatus;
        this.render();
    }
    
    getStatusCounts() {
        const counts = { service: 0, standby: 0, washing: 0, maintenance: 0 };
        Object.values(this.trains).forEach(status => {
            counts[status]++;
        });
        return counts;
    }
    
    updateStatusOverview() {
        const counts = this.getStatusCounts();
        const total = Object.keys(this.trains).length;
        
        Object.entries(counts).forEach(([status, count]) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            
            document.getElementById(`${status}-count`).textContent = count;
            document.getElementById(`${status}-percentage`).textContent = `${percentage}%`;
            document.getElementById(`filter-${status}-count`).textContent = count;
        });
        
        document.getElementById('all-count').textContent = total;
    }
    
    renderTrains() {
        const grid = document.getElementById('trains-grid');
        const noResults = document.getElementById('no-results');
        
        // Filter trains based on current filter
        const filteredTrains = Object.entries(this.trains).filter(([_, status]) => 
            this.currentFilter === 'all' || status === this.currentFilter
        );
        
        if (filteredTrains.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        grid.innerHTML = filteredTrains.map(([trainId, status]) => {
            return `
                <div class="train-card" data-train="${trainId}">
                    <div class="train-number">Train ${trainId}</div>
                    <div class="train-status ${status}">
                        ${this.capitalizeFirst(status)}
                    </div>
                    <div class="status-controls">
                        ${this.statusTypes.map(statusType => `
                            <button 
                                class="status-btn ${statusType} ${status === statusType ? 'active' : ''}"
                                onclick="trainManager.changeTrainStatus('${trainId}', '${statusType}')"
                                title="Set to ${this.capitalizeFirst(statusType)}"
                            ></button>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    render() {
        this.updateStatusOverview();
        this.renderTrains();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.trainManager = new TrainManager();
});

// Add smooth scrolling and enhanced interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Add click sound effect (optional)
    document.addEventListener('click', (e) => {
        if (e.target.matches('.status-btn, .filter-btn')) {
            // Add visual feedback
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '4') {
            const statusIndex = parseInt(e.key) - 1;
            const statusTypes = ['service', 'standby', 'washing', 'maintenance'];
            if (statusTypes[statusIndex]) {
                trainManager.setFilter(statusTypes[statusIndex]);
            }
        }
        
        if (e.key === '0' || e.key === 'a' || e.key === 'A') {
            trainManager.setFilter('all');
        }
    });
});