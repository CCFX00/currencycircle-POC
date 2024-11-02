document.addEventListener("DOMContentLoaded", function() {
    const completedTab = document.getElementById('completed-tab');
    const canceledTab = document.getElementById('canceled-tab');
    const completedContent = document.getElementById('completed-content');
    const canceledContent = document.getElementById('canceled-content');

    // Initialize trade data if not exists
    function initializeTradeData() {
        if (!sessionStorage.getItem('tradeHistory')) {
            const initialTrades = [
                {
                    tradeId: new ObjectId().toHexString(),
                    date: '06/04/2023',
                    exchangeRate: '1 USD = 660 XAF',
                    sender: {
                        userId: new ObjectId().toHexString(),
                        username: 'Ateking12',
                        location: 'Douala, Cameroon',
                        rating: 5,
                        completedTrades: 3,
                        avgCompletionTime: '08 hrs',
                        profilePic: '/images/profiles/ateking.png'
                    },
                    receiver: {
                        userId: new ObjectId().toHexString(),
                        username: 'Tiksfon',
                        location: 'Douala, Cameroon',
                        rating: 5,
                        completedTrades: 3,
                        avgCompletionTime: '08 hrs',
                        profilePic: '/images/profiles/tiksfon.png'
                    },
                    amount: {
                        from: { currency: 'USD', value: 1200 },
                        to: { currency: 'XAF', value: 792000 }
                    },
                    status: 'completed'
                },
                {
                    tradeId: new ObjectId().toHexString(),
                    date: '06/04/2023',
                    exchangeRate: '1 USD = 660 XAF',
                    sender: {
                        userId: new ObjectId().toHexString(),
                        username: 'Tiksfon',
                        location: 'New York, USA',
                        rating: 5,
                        profilePic: '/images/profiles/tiksfon.png'
                    },
                    receiver: {
                        userId: new ObjectId().toHexString(),
                        username: 'Kate',
                        location: 'New York, USA',
                        rating: 5,
                        profilePic: '/images/profiles/ateking.png'
                    },
                    amount: {
                        from: { currency: 'GBP', value: 1200 },
                        to: { currency: 'XAF', value: 792000 }
                    },
                    status: 'cancelled'
                }
            ];
            sessionStorage.setItem('tradeHistory', JSON.stringify(initialTrades));
        }
    }

    // Create HTML for a completed trade card
    function createCompletedTradeCard(trade) {
        return `
            <div class="currency-card" data-trade-id="${trade.tradeId}" 
                 data-rater-id="${trade.sender.userId}" 
                 data-rated-id="${trade.receiver.userId}">
                <div class="currency-header">
                    <span class="date">${trade.date}</span>
                    <span class="exchange-rate">${trade.exchangeRate}</span>
                    <i class="fas fa-lock"></i>
                </div>

                <div class="currency-user" data-user-id="${trade.sender.userId}">
                    <div class="user-profile">
                        <div class="profile-pic" style="background-image: url('${trade.sender.profilePic}');"></div>
                        <span class="username">${trade.sender.username}</span>
                    </div>
                    <div class="user-info">
                        <div class="rating">
                            ${'<i class="fas fa-star"></i>'.repeat(trade.sender.rating)}
                        </div>
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${trade.sender.location}</span>
                        </div>
                    </div>
                    <div class="trade-stats">
                        <div class="completed-trades">
                            <i class="fas fa-check-circle"></i>
                            <span>${trade.sender.completedTrades} Completed trades</span>
                        </div>
                        <div class="avg-completion-time">
                            <i class="far fa-clock"></i>
                            <span>${trade.sender.avgCompletionTime} avg completion time</span>
                        </div>
                    </div>
                </div>

                <div class="currency-exchange">
                    <div class="currency-amount">
                        <span class="currency-code">${trade.amount.from.currency}</span>
                        <span class="amount">${trade.amount.from.value}</span>
                    </div>
                    <i class="fas fa-exchange-alt"></i>
                    <div class="currency-amount">
                        <span class="currency-code">${trade.amount.to.currency}</span>
                        <span class="amount">${trade.amount.to.value}</span>
                    </div>
                </div>

                <div class="currency-user" data-user-id="${trade.receiver.userId}">
                    <div class="user-profile">
                        <div class="profile-pic" style="background-image: url('${trade.receiver.profilePic}');"></div>
                        <span class="username">${trade.receiver.username}</span>
                    </div>
                    <div class="user-info">
                        <div class="rating">
                            ${'<i class="fas fa-star"></i>'.repeat(trade.receiver.rating)}
                        </div>
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${trade.receiver.location}</span>
                        </div>
                    </div>
                    <div class="trade-stats">
                        <div class="completed-trades">
                            <i class="fas fa-check-circle"></i>
                            <span>${trade.receiver.completedTrades} Completed trades</span>
                        </div>
                        <div class="avg-completion-time">
                            <i class="far fa-clock"></i>
                            <span>${trade.receiver.avgCompletionTime} avg completion time</span>
                        </div>
                    </div>
                </div>

                <hr class="review-divider">
                <a href="/userratings" class="leave-review">Leave review</a>
            </div>
        `;
    }

    // Create HTML for a cancelled trade card
    function createCancelledTradeCard(trade) {
        return `
            <div class="cancelled-trade-card" data-trade-id="${trade.tradeId}">
                <div class="cancelled-trade-header">
                    <span class="cancelled-trade-date">${trade.date}</span>
                    <span class="cancelled-trade-exchange-rate">${trade.exchangeRate}</span>
                </div>
                <div class="cancelled-trade-users">
                    <div class="cancelled-trade-user cancelled-trade-user-left" data-user-id="${trade.sender.userId}">
                        <div class="profile-pic" style="background-image: url('${trade.sender.profilePic}');"></div>
                        <span class="cancelled-trade-username">${trade.sender.username}</span>
                        <span class="cancelled-trade-location">${trade.sender.location}</span>
                        <div class="cancelled-trade-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(trade.sender.rating)}
                        </div>
                    </div>
                    <div class="cancelled-trade-exchange">
                        <div class="cancelled-trade-exchange-row">
                            <span class="cancelled-trade-currency-code">${trade.amount.from.currency}</span>
                            <span class="cancelled-trade-amount">${trade.amount.from.value}</span>
                        </div>
                        <i class="fas fa-exchange-alt cancelled-trade-exchange-icon"></i>
                        <div class="cancelled-trade-exchange-row">
                            <span class="cancelled-trade-currency-code">${trade.amount.to.currency}</span>
                            <span class="cancelled-trade-amount">${trade.amount.to.value}</span>
                        </div>
                    </div>
                    <div class="cancelled-trade-user cancelled-trade-user-right" data-user-id="${trade.receiver.userId}">
                        <div class="profile-pic" style="background-image: url('${trade.receiver.profilePic}');"></div>
                        <span class="cancelled-trade-username">${trade.receiver.username}</span>
                        <span class="cancelled-trade-location">${trade.receiver.location}</span>
                        <div class="cancelled-trade-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(trade.receiver.rating)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render trades from session storage
    function renderTrades() {
        const trades = JSON.parse(sessionStorage.getItem('tradeHistory'));
        
        // Render completed trades
        const completedTradesHtml = trades
            .filter(trade => trade.status === 'completed')
            .map(trade => createCompletedTradeCard(trade))
            .join('');
        completedContent.innerHTML = completedTradesHtml;

        // Render cancelled trades
        const cancelledTradesHtml = trades
            .filter(trade => trade.status === 'cancelled')
            .map(trade => createCancelledTradeCard(trade))
            .join('');
        canceledContent.innerHTML = cancelledTradesHtml;
    }

    // Tab switching functionality
    function switchTab(tab) {
        if (tab === 'completed') {
            completedTab.classList.add('active');
            canceledTab.classList.remove('active');
            completedContent.style.display = 'block';
            canceledContent.style.display = 'none';
        } else if (tab === 'canceled') {
            completedTab.classList.remove('active');
            canceledTab.classList.add('active');
            completedContent.style.display = 'none';
            canceledContent.style.display = 'block';
        }
    }

    // Initialize and set up event listeners
    initializeTradeData();
    renderTrades();
    switchTab('completed');

    // Event listeners for tabs
    completedTab.addEventListener('click', () => switchTab('completed'));
    canceledTab.addEventListener('click', () => switchTab('canceled'));

    // Enhanced review link handler with user IDs
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('leave-review')) {
            const tradeCard = e.target.closest('.currency-card');
            if (tradeCard) {
                // Store all necessary IDs in session storage
                const tradeId = tradeCard.getAttribute('data-trade-id');
                const raterId = tradeCard.getAttribute('data-rater-id');
                const ratedId = tradeCard.getAttribute('data-rated-id');
                
                // Store the IDs in session storage
                sessionStorage.setItem('currentTradeReview', tradeId);
                sessionStorage.setItem('currentRaterId', raterId);
                sessionStorage.setItem('currentRatedId', ratedId);
            }
        }
    });
});