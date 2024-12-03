// document.addEventListener("DOMContentLoaded", function() {
//     const completedTab = document.getElementById('completed-tab');
//     const canceledTab = document.getElementById('canceled-tab');
//     const completedContent = document.getElementById('completed-content');
//     const canceledContent = document.getElementById('canceled-content');

//     function switchTradesTab(tab) {
//         if (tab === 'completed') {
//             completedTab.classList.add('active');
//             canceledTab.classList.remove('active');
//             completedContent.style.display = 'block'; // Show completed content
//             canceledContent.style.display = 'none';   // Hide canceled content
//         } else if (tab === 'canceled') {
//             completedTab.classList.remove('active');
//             canceledTab.classList.add('active');
//             completedContent.style.display = 'none';  // Hide completed content
//             canceledContent.style.display = 'block';  // Show canceled content
//         }
//     }

//     // Set default view
//     switchTradesTab('completed');

//     completedTab.addEventListener('click', () => switchTradesTab('completed'));
//     canceledTab.addEventListener('click', () => switchTradesTab('canceled'));
// });




document.addEventListener("DOMContentLoaded", function() {
    const completedTab = document.getElementById('completed-tab');
    const canceledTab = document.getElementById('canceled-tab');
    const completedContent = document.getElementById('completed-content');
    const canceledContent = document.getElementById('canceled-content');
    const completedTradesContainer = document.getElementById('completed-trades-container');
    const noCompletedTradesContainer = document.getElementById('no-completed-trades');
    const canceledTradesContainer = document.getElementById('canceled-trades-container');
    const noCanceledTradesContainer = document.getElementById('no-cancelled-trades');

    function switchTradesTab(tab) {
        if (tab === 'completed') {
            completedTab.classList.add('active');
            canceledTab.classList.remove('active');
            completedContent.style.display = 'block';
            canceledContent.style.display = 'none';
            fetchCompletedTrades();
        } else if (tab === 'canceled') {
            completedTab.classList.remove('active');
            canceledTab.classList.add('active');
            completedContent.style.display = 'none';
            canceledContent.style.display = 'block';
            fetchCanceledTrades();
        }
    }

    async function fetchCompletedTrades() {
        try {
            const response = await fetch('/trades/completed');
            const data = await response.json();
            if (response.ok) {
                renderCompletedTrades(data.completedTrades);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching completed trades:', error);
        }
    }

    async function fetchCanceledTrades() {
        try {
            const response = await fetch('/trades/cancelled');
            const data = await response.json();
            if (response.ok) {
                renderCanceledTrades(data.cancelledTrades);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching canceled trades:', error);
        }
    }

    function renderCompletedTrades(trades) {
        completedTradesContainer.innerHTML = '';
        if (trades.length === 0) {
            noCompletedTradesContainer.style.display = 'block';
            completedTradesContainer.style.display = 'none';
        } else {
            noCompletedTradesContainer.style.display = 'none';
            completedTradesContainer.style.display = 'block';


            trades.forEach(trade => {

                const senderProfile = trade.senderId.userImage
                ? `<div class="profile-pic" style="background-image: url('/images/profiles/${ trade.senderId.userImage}');"></div>`
                : `<div class="profile-pic" style="background-image: url('/images/profiles/noProfile.png');"></div>`                
                
                const receiverProfile = trade.receiverId.userImage
                ? `<div class="profile-pic" style="background-image: url('/images/profiles/${ trade.receiverId.userImage}');"></div>`
                : `<div class="profile-pic" style="background-image: url('/images/profiles/noProfile.png');"></div>` 


                completedTradesContainer.innerHTML += 
                `  
                    <div class="currency-card">
                        <div class="currency-header">
                            <span class="date">${new Date(trade.updatedAt).toLocaleDateString()}</span>
                            <span class="exchange-rate">1 ${trade.offerId.from} = ${trade.offerId.rate} ${trade.offerId.to}</span>
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="currency-user">
                            <div class="user-profile">
                                ${senderProfile}
                                <span class="username">${ trade.senderId.userName }</span>
                            </div>
                            <div class="user-info">
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${ trade.senderId.city }, ${ trade.senderId.country }</span>
                                </div>
                            </div>
                            <div class="trade-stats">
                                <div class="completed-trades">
                                    <i class="fas fa-check-circle"></i>
                                    <span>3 Completed trades</span>
                                </div>
                                <div class="avg-completion-time">
                                    <i class="far fa-clock"></i>
                                    <span>08 hrs avg completion time</span>
                                </div>
                            </div>
                        </div>
                        <div class="currency-exchange">
                            <div class="currency-amount">
                                <span class="currency-code">${trade.offerId.from}</span>
                                <span class="amount">${trade.offerId.amount}</span>
                            </div>
                            <i class="fas fa-exchange-alt"></i>
                            <div class="currency-amount">
                                <span class="currency-code">${trade.offerId.to}</span>
                                <span class="amount">${trade.offerId.value}</span>
                            </div>
                        </div>
                        <div class="currency-user">
                            <div class="user-profile">
                                ${receiverProfile}
                                <span class="username">${ trade.receiverId.userName }</span>
                            </div>
                            <div class="user-info">
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${ trade.receiverId.city }, ${ trade.receiverId.country }</span>
                                </div>
                            </div>
                            <div class="trade-stats">
                                <div class="completed-trades">
                                    <i class="fas fa-check-circle"></i>
                                    <span>3 Completed trades</span>
                                </div>
                                <div class="avg-completion-time">
                                    <i class="far fa-clock"></i>
                                    <span>08 hrs avg completion time</span>
                                </div>
                            </div>
                        </div>
                        <hr class="review-divider">
                        <a href="#" class="leave-review">Leave review</a>
                    </div>

                `;
            });
        }
    }

    function renderCanceledTrades(trades) {

        canceledTradesContainer.innerHTML = '';
        if (trades.length === 0) {
            noCanceledTradesContainer.style.display = 'block';
            canceledTradesContainer.style.display = 'none';
        } else {
            noCanceledTradesContainer.style.display = 'none';
            canceledTradesContainer.style.display = 'block';
            trades.forEach(trade => {

                const senderProfile = trade.senderId.userImage
                ? `<div class="profile-pic" style="background-image: url('/images/profiles/${ trade.senderId.userImage}');"></div>`
                : `<div class="profile-pic" style="background-image: url('/images/profiles/noProfile.png');"></div>`                
                        
                const receiverProfile = trade.receiverId.userImage
                ? `<div class="profile-pic" style="background-image: url('/images/profiles/${ trade.receiverId.userImage}');"></div>`
                : `<div class="profile-pic" style="background-image: url('/images/profiles/noProfile.png');"></div>` 

                canceledTradesContainer.innerHTML += 
                    `
                        <div class="cancelled-trade-card">
                            <div class="cancelled-trade-header">
                                <span class="cancelled-trade-date">${new Date(trade.updatedAt).toLocaleDateString()}</span>
                                <span class="cancelled-trade-exchange-rate">1 ${trade.offerId.from} = ${trade.offerId.rate} ${trade.offerId.to}</span>
                            </div>
                            <div class="cancelled-trade-users">
                                <div class="cancelled-trade-user cancelled-trade-user-left">
                                    ${senderProfile}
                                    <span class="cancelled-trade-username">${ trade.senderId.userName }</span>
                                    <span class="cancelled-trade-location">${ trade.senderId.city }, ${ trade.senderId.country }</span>
                                    <div class="cancelled-trade-rating">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                </div>
                                <div class="cancelled-trade-exchange">
                                    <div class="cancelled-trade-exchange-row">
                                        <span class="cancelled-trade-currency-code">${trade.offerId.from}</span>
                                        <span class="cancelled-trade-amount">${trade.offerId.amount}</span>
                                    </div>
                                    <i class="fas fa-exchange-alt cancelled-trade-exchange-icon"></i>
                                    <div class="cancelled-trade-exchange-row">
                                        <span class="cancelled-trade-currency-code">${trade.offerId.to}</span>
                                        <span class="cancelled-trade-amount">${trade.offerId.value}</span>
                                    </div>
                                </div>
                                <div class="cancelled-trade-user cancelled-trade-user-right">
                                    ${receiverProfile}
                                    <span class="cancelled-trade-username">${ trade.receiverId.userName }</span>
                                    <span class="cancelled-trade-location">${ trade.receiverId.city }, ${ trade.receiverId.country }</span>
                                    <div class="cancelled-trade-rating">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
        }
    }

    // Set default view
    switchTradesTab('completed');

    completedTab.addEventListener('click', () => switchTradesTab('completed'));
    canceledTab.addEventListener('click', () => switchTradesTab('canceled'));
});
