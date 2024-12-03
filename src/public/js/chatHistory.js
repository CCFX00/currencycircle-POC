document.addEventListener("DOMContentLoaded", function() {
    // const chatsTab = document.getElementById('chats-tab');
    // const chatsContent = document.getElementById('chats-content');
    // const chatsContainer = document.getElementById('chats-container');
    // const noChatsContainer = document.getElementById('no-chats');

    const chatsLink = document.getElementById('chats-link');

    chatsLink.addEventListener('click', (event) => {
        event.preventDefault();
        openChatsTab('completed'); 
    });
     
  
    function openChatsTab(tab) {
        if (tab === 'completed') {
            // Dynmically creating the chatHistory page elements            
            sessionStorage.setItem('previousPageContent', document.body.innerHTML); // Save the current body content to sessionStorage
            document.body.innerHTML = ''; // Clear the body content

            // Build and append new DOM content
            const statusBar = document.createElement('div');
            statusBar.className = 'status-bar';
            statusBar.innerHTML = `
                <span class="time">9:41</span>
                <div class="status-icons">
                    <i class="fas fa-signal"></i>
                    <i class="fas fa-wifi"></i>
                    <i class="fas fa-battery-full"></i>
                </div>
            `

            const tradeHistoryContainer = document.createElement('div');
            tradeHistoryContainer.className = 'trade-history-container';

            // Create navigation bar
            const navBar = document.createElement('div');
            navBar.className = 'nav-bar';
            navBar.innerHTML = `
                <i class="fas fa-bars menu-icon"></i>
                <h1 class="page-title">Your Chat History</h1>
            `;
            tradeHistoryContainer.appendChild(navBar);
            
            // Create tab navigation
            const tabNavigation = document.createElement('div');
            tabNavigation.className = 'tab-navigation';
            tabNavigation.innerHTML = `<div id="chats-tab" class="tab active">Your Chats</div>`;
            tradeHistoryContainer.appendChild(tabNavigation);

            // Create chats content container
            const chatsContent = document.createElement('div');
            chatsContent.id = 'chats-content';
            chatsContent.className = 'trade-content active';
            chatsContent.innerHTML = `
                <div id="chats-container" class="all-chats"></div>
                <div id="no-chats" class="no-offers-container" style="display: none;">
                    <p>You have no chats</p>
                    <img src="/images/nooffers.png" alt="No Completed Trades">
                    <button class="create-offer-btn">
                        Click the <span class="plus-icon">+</span> Sign to create an offer
                    </button>
                </div>
            `;
            tradeHistoryContainer.appendChild(chatsContent);

            // Create bottom icons container
            const iconsContainer = document.createElement('div');
            iconsContainer.className = 'icons-container';
            iconsContainer.innerHTML = `
                <div class="wallet-icon"><i class="fas fa-wallet"></i></div>
                <div class="add-icon" onclick="createOffer()"><i class="fas fa-plus-circle"></i></div>
                <div class="notification-icon">
                    <i class="fas fa-bell"></i>
                    <span id="notification-count" class="notification-badge" style="display:none"></span>
                </div>
                <div class="settings-icon"><i class="fas fa-cog"></i></div>
                <div class="settings-icon" onclick="signout()"><i class="fas fa-sign-out-alt"></i></div>
            `;
            tradeHistoryContainer.appendChild(iconsContainer);

            // Append the entire container to the body
            document.body.appendChild(statusBar);
            document.body.appendChild(tradeHistoryContainer);

            const chatsTab = document.getElementById('chats-tab');
            const chatsContents = document.getElementById('chats-content');

            chatsTab.classList.add('active');
            chatsContents.style.display = 'block';
            
            loadChatsCss(); // load page's syle
            fetchAllChats(); // fetch all chats     
        }
    }
  
    async function fetchAllChats() {
        try {
            const response = await fetch('/chats/all');
            const data = await response.json();
            if (response.ok) {
                renderChats(data.result.inDiscussionTrades);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching completed trades:', error);
        }
    }
  
    function renderChats(trades) {
        const chatsContainer = document.getElementById('chats-container');
        const noChatsContainer = document.getElementById('no-chats');
        
        chatsContainer.innerHTML = '';
        if (trades.length === 0) {
            noChatsContainer.style.display = 'block';
            chatsContainer.style.display = 'none';
        } else {
            noChatsContainer.style.display = 'none';
            chatsContainer.style.display = 'block';
  
  
            trades.forEach(trade => {
                // Setting Attributes
                chatsContainer.setAttribute("data-discussion-id", trade._id); 
                chatsContainer.setAttribute("data-sender-id", trade.loggedInUserId._id); 
                chatsContainer.setAttribute("data-sender-name", trade.loggedInUserId.userName); 
                chatsContainer.setAttribute("data-sender-image", trade.loggedInUserId.userImage); 
                chatsContainer.setAttribute("data-reciever-id", trade.matchedOfferOwnerId._id); 
                chatsContainer.setAttribute("data-reciever-name", trade.matchedOfferOwnerId.userName); 
                chatsContainer.setAttribute("data-reciever-image", trade.matchedOfferOwnerId.userImage); 
                chatsContainer.setAttribute("data-offer-id", trade.matchedOfferId._id); 
  
                const senderProfile = trade.loggedInUserId.userImage
                ? `<div class="profile-pic" style="background-image: url('/images/profiles/${ trade.loggedInUserId.userImage}');"></div>`
                : `<div class="profile-pic" style="background-image: url('/images/profiles/noProfile.png');"></div>`                
                  
                const receiverProfile = trade.matchedOfferOwnerId.userImage
                ? `<div class="profile-pic" style="background-image: url('/images/profiles/${ trade.matchedOfferOwnerId.userImage}');"></div>`
                : `<div class="profile-pic" style="background-image: url('/images/profiles/noProfile.png');"></div>` 
  
  
                chatsContainer.innerHTML += 
                `
                <div class="cancelled-trade-card">
                    <div class="cancelled-trade-header">
                        <span class="cancelled-trade-date">${new Date(trade.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div class="cancelled-trade-users">
                        <div class="cancelled-trade-user cancelled-trade-user-left">
                            ${senderProfile}
                            <span class="cancelled-trade-username">${ trade.loggedInUserId.userName }</span>
                            <span class="cancelled-trade-location">${ trade.loggedInUserId.city }</span>
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
                                <span class="cancelled-trade-currency-code">${trade.matchedOfferId.from}</span>
                                <span class="cancelled-trade-amount">${trade.matchedOfferId.amount}</span>
                            </div>
                            <i class="fas fa-exchange-alt cancelled-trade-exchange-icon"></i>
                            <div class="cancelled-trade-exchange-row">
                                <span class="cancelled-trade-currency-code">${trade.matchedOfferId.to}</span>
                                <span class="cancelled-trade-amount">${trade.matchedOfferId.value}</span>
                            </div>
                        </div>
                        <div class="cancelled-trade-user cancelled-trade-user-right">
                            ${receiverProfile}
                            <span class="cancelled-trade-username">${ trade.matchedOfferOwnerId.userName }</span>
                            <span class="cancelled-trade-location">${ trade.matchedOfferOwnerId.city }</span>
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

    // Function to dynamically load CSS file
    function loadChatsCss() {
        const head = document.head;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/css/tradeHistory.css";
        head.appendChild(link);
    }
     
    // openChatsTab
    // openChatsTab('completed');
});
