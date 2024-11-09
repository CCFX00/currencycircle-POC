const notificationCountElement = document.getElementById("notification-count");
let Notifications = []

// // AFTER PAGE IS COMPLETEY LOADED
document.addEventListener("DOMContentLoaded", function () {
  const UID = document.querySelector(".trader-card")?.dataset.userId;

  // Get the value of isLoggingOut from localStorage
  const isLoggingOut = localStorage.getItem('isLoggingOut');

  // Proceed only if isLoggingOut is not true
  if (isLoggingOut !== 'true') {
    const userStatus = localStorage.getItem('isLoggedIn');

    if (!userStatus && UID) {
      // Check if the trader card exists and connect if not already connected
      connectSocketIO(UID);
      localStorage.setItem('isLoggedIn', 'true');
    }
  }

  // Check if we are on the specific page by looking for the unique identifier
  if (document.getElementById("welcome-page")) {
    handleWelcomePage();
  }

  // LOAD CREATE OFFERS' PAGE
  const selects = document.querySelectorAll(".currency-select");
  const exAmount = document.getElementById("ex-amount");
  const exValue = document.getElementById("ex-value");
  const exRate = document.getElementById("ex-rate");
  const matchFee = document.getElementById("match-fee");
  const myExFrom = document.getElementById("my-ex-from");
  const myExTo = document.getElementById("my-ex-to");
  const createOfferButton = document.querySelector(".google-button");
  

  function updateFlag(select) {
    const flagIcon = select.parentElement.querySelector(".flag-icon");
    const selectedOption = select.options[select.selectedIndex];
    const flagSrc = selectedOption.getAttribute("data-flag");
    flagIcon.src = flagSrc;
    flagIcon.alt = `${selectedOption.text} Flag`; // Update alt attribute to the country's name
  }

  function calculateValues() {
    const amount = parseFloat(exAmount.value) || 0;
    const rate = parseFloat(exRate.value) || 1;
    const value = amount * rate;
    exValue.value = Math.round(value).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
    matchFee.textContent = `$${(exAmount.value * 0.005).toFixed(2)} match fee`;
  }

  async function fetchRate(from, to) {
    try {
      const response = await fetch("http://localhost:5000/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to }),
      });
      const data = await response.json();

      if (response.ok) {
        exRate.value = data.rate;
        calculateValues();
      } else {
        console.error("Error fetching rate:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleSelectChange() {
    updateFlag(this);
    const base = document.getElementById("base").value;
    const quote = document.getElementById("quote").value;
    myExFrom.textContent = base
    myExTo.textContent = quote
    fetchRate(base, quote);
  }

  async function submitOffer() {
    const base = document.getElementById("base").value;
    const quote = document.getElementById("quote").value;

    const offerData = { from: base, to: quote, amount: exAmount.value, value: exValue.value, rate: exRate.value };

    try {
      const response = await fetch("http://localhost:5000/offer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
      });

      await response.json();
      window.location.href = "/user";
      
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (exAmount && exRate && createOfferButton) {
    exAmount.addEventListener("input", calculateValues);
    exRate.addEventListener("input", calculateValues);
    createOfferButton.addEventListener("click", submitOffer);
  }

  selects.forEach((select) => {
    updateFlag(select); // Update the flag when the page loads

    select.addEventListener("change", handleSelectChange);
  });
  
  
  // LOAD OFFERS, MATCHED TRADES, DISCUSSIONS TABS
  const buttons = document.querySelectorAll(".nav-btn");
  const offersContainer = document.getElementById("offers-container");
  const tradesContainer = document.getElementById("trades-container");
  const discussionsContainer = document.getElementById("discussion-container");
  const matchedTradesList = document.getElementById("matched-trades-list");
  const tradesInDiscussionList = document.getElementById("trades-in-discussion-list");

  if(window.userSocket){
    // Fetching notifications
    window.userSocket.emit('fetchNotifications');

    // Listening for the notifications from the server
    window.userSocket.on('notifications', (notifications) => {
      const unreadNotifications = notifications.filter(notification => !notification.isRead);

      Notifications = notifications
      if(unreadNotifications.length > 0){
        notificationCountElement.textContent = unreadNotifications.length;
        notificationCountElement.style.display = "block";
      }else {
        notificationCountElement.style.display = "none";
      }  
    })

    // Listening for the notifications from the server
    window.userSocket.on('newNotification', (notification) => {
      Notifications.push(notification)
      console.log(Notifications)
      if(Notifications.length > 0){
        notificationCountElement.textContent = Notifications.length;
        notificationCountElement.style.display = "block";
      }else {
        notificationCountElement.style.display = "none";
      }  
    })
  }
  
  // Function to handle tab switching
  function switchTab(activeButtonId, activeContainer) {
    buttons.forEach((btn) => btn.classList.remove("active"));
    document.getElementById(activeButtonId).classList.add("active");
    offersContainer.style.display = "none";
    tradesContainer.style.display = "none";
    discussionsContainer.style.display = "none";
    activeContainer.style.display = "block";
  }

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      if (this.id === "my-offers-btn") {  
        switchTab("my-offers-btn", offersContainer);
      } else if (this.id === "matched-trades-btn") {
        fetchMatchedTrades(`http://localhost:5000/trades`)
      } else if (this.id === "in-discussion-btn") {
        fetchInDiscussionTrades(`http://localhost:5000/discussions/all`)
      }
    });
  });

  // Attach event listener to offer links
  const offerLinks = document.querySelectorAll(".offer-link");
  offerLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const offerId = this.getAttribute("data-offer-id");
      fetchMatchedTrades(`http://localhost:5000/trade/${offerId}`);
    });
  });

  // Function to fetch matched trades
  async function fetchMatchedTrades(endpoint) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const matches = data.matches;
      const userOffer = data.userOffer;

      // Switch to Matched Trades tab
      switchTab("matched-trades-btn", tradesContainer);

      updateTradesContainer(matches, userOffer, Notifications);
    } catch (error) {
      console.error("Error fetching matched trades: ", error);
    }
  }

  // Function to fetch matched trades
  async function fetchInDiscussionTrades(endpoint) {
    try {
      const response = await fetch(endpoint);
      const result = (await response.json()).inDiscussionTrades;

      // Switch to Matched Trades tab
      switchTab("in-discussion-btn", discussionsContainer);

      updateDiscussionsContainer(result);
    } catch (error) {
      console.error("Error fetching trades in discussion: ", error);
    }
  }

  // Function to update the trades container with new matches
  function updateTradesContainer(matches, userOffer, notifications) {
    // Clear existing offers
    matchedTradesList.innerHTML = "";

    // Remove existing no-offers-container if it exists
    const existingNoOffersContainer = document.querySelector(
      ".no-offers-container"
    );
    if (existingNoOffersContainer) {
      existingNoOffersContainer.remove();
    }

    // Check if matches is defined, is an array, and has elements
    if (matches && Array.isArray(matches) && matches.length > 0) {
      matches.forEach((match) => {
        const offerCard = document.createElement("div");
        offerCard.classList.add("matched-trades-card");

        // Add the data attribute
        offerCard.setAttribute("data-match-id", match._id); 
        offerCard.setAttribute("data-match-user", match.user._id); 
        offerCard.setAttribute("data-user-id", userOffer.user); 
        offerCard.setAttribute("data-offer-id", userOffer._id); 

        // Ensure the matchFee is set to 0,5% of the match value in case it is not provided
        // Using the Nullish Coalescing Assignment (??=):
        match.matchFee ??= parseInt(match.value) * 0.005;

        offerCard.setAttribute("data-match-fee", match.matchFee); 

        const userProfile = match.user.userImage
          ? `<img src="/images/profiles/${match.user.userImage}" alt="Profile Picture" class="user-picture">`
          : `<img src="/images/profiles/noProfile.png" alt="Profile Picture" class="user-picture">`;

        offerCard.innerHTML = `
          <div class="matched-trades-header">
            <div class="matched-trades-date">${match.creationDate}</div>
            <div class="matched-trades-rate">1 ${match.from} = ${match.rate} ${match.to}</div>
          </div>
          <div class="matched-trades-content">
            <div class="matched-trades-amount">
              <div class="matched-trades-currency">
                <div class="matched-trades-currency-code">${match.from}</div>
                <div class="matched-trades-currency-figure">${match.amount}</div>
              </div>
              <div class="matched-trades-arrow">
                <i class="fas fa-exchange-alt"></i>
              </div>
              <div class="matched-trades-currency">
                <div class="matched-trades-currency-code">${match.to}</div>
                <div class="matched-trades-currency-figure">${match.value}</div>
              </div>
              <div class="matched-trades-profile">
                ${userProfile}
                <div class="user-details">
                  <h2 class="user-name">${match.user.userName}</h2>
                </div>
              </div>
            </div>
          </div>
          <div class="matched-trades-info">
            <div>
              <p id="location"><i class="fas fa-map-marker-alt" id="location-icon"></i> ${match.user.city}, ${match.user.country}</p>
              <p id="completed-trades"><i class="fas fa-check-circle" id="completed-trades-icon"></i> 0 Completed trades</p>
            </div>
            <div>
              <div class="user-rating">
                <i class="fas fa-star"></i><i class="fas fa-star"></i>
                <i class="fas fa-star"></i><i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <p id="completion-time"><i class="fas fa-clock" id="completion-time-icon"></i> 08 hrs avg completion time</p>
            </div>
          </div>
          <!-- Notifications block with accept or decline offer. Initially hidden. -->
          <div class="trade-actions" style="display:none"> 
            <button class="accept-btn">
              <i class="fas fa-check"></i>
              Accept
            </button>
            <button class="decline-btn">
              <i class="fas fa-times"></i>
              Decline
            </button>  
          </div>
          <div class="trade-state" style="display:none">
            <button class="locked-btn">
              <i class="fas fa-lock"></i>
              Locked
            </button>
          </div>
          <div id="notificationPopup" class="notification-container" style="display:none">
              <p id="notificationMessage">${match.user.userName} will now be notified of your interest. If ${match.user.userName} accepts, your match fee will be ${match.matchFee}${match.to}.</br>The swap must be completed within 48hours.</p>
              <div class="modal-buttons">
                <button id="yesButton" class="yes-button">Yes</button>
                <button id="cancelButton" class="cancel-button">Cancel</button>
              </div>
          </div>
        `;

        if (notifications && notifications.length > 0) {
          const details = getMatchedTradeInfo(offerCard);
          // Check if there is a related notification
          const notification = notifications.find(
            (notif) => notif.senderId === details.matchedOfferOwnerId && notif.recieverId === details.userId && notif.offerId === details.matchedOfferId
          );

          if (notification) {
            if (!notification.isRead) {
              offerCard.querySelector('.trade-actions').style.display = 'flex';
            } else if (notification.isRead && notification.isAccepted) {
              offerCard.querySelector('.trade-state').style.display = 'block';
            }
          }
        }else{
          const details = getMatchedTradeInfo(offerCard);
          userSocket.emit('checkNotification', { offerId: details.userOfferId})
          userSocket.on('recieveNotification', (notifications) => {
            const notification = notifications.find(
              (notif) => notif.senderId === details.userId && notif.recieverId === details.matchedOfferOwnerId && notif.offerId === details.userOfferId
            )

            if (notification) {
              if (notification.isRead && notification.isAccepted) {
                offerCard.querySelector('.trade-state').style.display = 'block';
              }
            }
          })
        }       

        matchedTradesList.appendChild(offerCard);

        const acceptBtn = offerCard.querySelector('.accept-btn');
        const declineBtn = offerCard.querySelector('.decline-btn');
        const yesBtn = offerCard.querySelector('.yes-button');
        const cancelBtn = offerCard.querySelector('.cancel-button');
        const notificationPopup = offerCard.querySelector('.notification-container')
        const notificationMessage = offerCard.querySelector('#notificationMessage')


        // Adding click event listener to the offer card to trigger the notification popup
        offerCard.addEventListener("click", (event) => {
          const tradeActions = offerCard.querySelector('.trade-actions');
          const tradeState = offerCard.querySelector('.trade-state');
          const notificationPopup = offerCard.querySelector('.notification-container');

          // Check if trade-actions and trade-state are hidden
          const areTradeActionsHidden = window.getComputedStyle(tradeActions).display === 'none';
          const areTradeStateHidden = window.getComputedStyle(tradeState).display === 'none';

          // Reinforce the check by ensuring no other offerCard has tradeState visible
          const anyOtherTradeStateVisible = Array.from(document.querySelectorAll('.trade-state'))
          .some(state => window.getComputedStyle(state).display === 'block');

          if (!anyOtherTradeStateVisible && areTradeActionsHidden && areTradeStateHidden) {
            notificationPopup.style.display = 'block';
          }

          event.stopPropagation();
        });
        
        // Confirm notification emission and close popup
        yesBtn.addEventListener("click", (event) => {
          let details = getMatchedTradeInfo(offerCard)

          window.userSocket.emit('sendNotification', { 
            senderId: details.userId, 
            recieverId: details.matchedOfferOwnerId, 
            offerId: details.userOfferId,
            message: notificationMessage.textContent,
            matchFee: `${details.matchFee}${match.to}`
          })

          notificationPopup.style.display = 'none';
          event.stopPropagation();
        })

        // Cancel notification emission and close popup
        cancelBtn.addEventListener("click", (event) => {
          notificationPopup.style.display = 'none';
          event.stopPropagation();
        })

        // Accepting a notification
        acceptBtn.addEventListener('click', () => {
            let details = getMatchedTradeInfo(offerCard)
            window.userSocket.emit('acceptOffer', { ...details, matchFee: `${details.matchFee}${match.to}`, name: `${match.user.userName}`, action: 'accept' });  // please extract the name from the cookies
            offerCard.querySelector('.trade-actions').style.display = 'none';
            offerCard.querySelector('.trade-state').style.display = 'block';
        });

        // Declining a notification
        declineBtn.addEventListener('click', () => {
            let details = getMatchedTradeInfo(offerCard)

            window.userSocket.emit('declineOffer', { ...details, action: 'decline' });
            offerCard.remove();
        }); 

      });
    } else {
      const noOffersContainer = document.createElement("div");
      noOffersContainer.classList.add("no-offers-container");

      noOffersContainer.innerHTML = `
        <p>No matched trades</p>
        <img src="images/nooffers.png" alt="No Offers">
        <button class="create-offer-btn">Click the <span class="plus-icon">+</span> Sign to create an offer</button>
      `;

      // Append the noOffersContainer directly to the tradesContainer
      tradesContainer.appendChild(noOffersContainer);
    }

    // Display the trades container
    tradesContainer.style.display = "block";
  }

  // Function to update the discussions container with locked trades
  function updateDiscussionsContainer(result){
     // Clear existing offers
     tradesInDiscussionList.innerHTML = "";

     // Remove existing no discussions container if it exists
     const existingDiscussionsContainer = document.querySelector(
       ".no-offers-container"
     );

     if (existingDiscussionsContainer) {
       existingDiscussionsContainer.remove();
     }

    if (result && Array.isArray(result) && result.length > 0) {
      result.forEach((data) => {
        const discussionCard = document.createElement("div");
        discussionCard.classList.add("currency-card");

        // Setting data attributes
        discussionCard.setAttribute("data-discussion-id", data._id); 
        discussionCard.setAttribute("data-sender-id", data.loggedInUserId._id); 
        discussionCard.setAttribute("data-sender-name", data.loggedInUserId.userName); 
        discussionCard.setAttribute("data-sender-image", data.loggedInUserId.userImage); 
        discussionCard.setAttribute("data-reciever-id", data.matchedOfferOwnerId._id); 
        discussionCard.setAttribute("data-reciever-name", data.matchedOfferOwnerId.userName); 
        discussionCard.setAttribute("data-reciever-image", data.matchedOfferOwnerId.userImage); 
        discussionCard.setAttribute("data-offer-id", data.matchedOfferId._id); 

        
        const loggedInUserProfile = data.loggedInUserId.userImage
          ? `<img src="/images/profiles/${ data.loggedInUserId.userImage }" alt="${ data.loggedInUserId.name } Avatar" class="currency-avatar">`
          : `<img src="/images/profiles/noProfile.png" alt="No Profile Avatar" class="currency-avatar">`;
        
        const matchedOfferOwnerProfile = data.matchedOfferOwnerId.userImage
          ? `<img src="/images/profiles/${ data.matchedOfferOwnerId.userImage }" alt="${ data.matchedOfferOwnerId.name } Avatar" class="currency-avatar">`
          : `<img src="/images/profiles/noProfile.png" alt="No Profile Avatar" class="currency-avatar">`;

        discussionCard.innerHTML = `            
          <div class="currency-header">
              <span class="currency-date">${ data.creationDate }</span>
              <span class="currency-rate">1 ${ data.matchedOfferId.from } = ${ data.matchedOfferId.rate } ${ data.matchedOfferId.to }</span>
              <div class="currency-email-icon"><i class="fas fa-envelope"></i></div>
          </div>          
          <div class="currency-user">
              <div class="currency-user-left">
                  <div class="currency-avatar-container">
                      ${loggedInUserProfile}
                      <div class="currency-username">${ data.loggedInUserId.userName }</div>
                  </div>
                  <div class="currency-info-left">
                      <div class="currency-rating">★★★★★</div>
                      <div class="currency-location">
                          <i class="fas fa-map-marker-alt currency-location-icon"></i>
                          <span>${ data.loggedInUserId.city }, ${ data.loggedInUserId.currency }</span>
                      </div>
                  </div>
              </div>
              <div class="currency-user-right">
                  <div class="currency-info-right">
                      <div class="currency-stats">
                          <div class="currency-stat-item">
                              <i class="fas fa-lock currency-icon"></i>
                              <span>Unknown Completed trades</span>
                          </div>
                          <div class="currency-stat-item">
                              <i class="fas fa-clock currency-icon"></i>
                              <span>Unknown avg completion time</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="currency-exchange">
              <div>
                  <div class="currency-name">${ data.matchedOfferId.from }</div>
                  <div class="currency-amount">${ data.matchedOfferId.amount }</div>
              </div>
              <div class="matched-trades-arrow">
              <i class="fas fa-exchange-alt"></i>
              </div>
              <div>
                  <div class="currency-name">${ data.matchedOfferId.to }</div>
                  <div class="currency-amount">${ data.matchedOfferId.value }</div>
              </div>
          </div>
          <div class="currency-user" style="margin-top: 15px;">
              <div class="currency-user-left">
                  <div class="currency-avatar-container">
                      ${matchedOfferOwnerProfile}
                      <div class="currency-username">${ data.matchedOfferOwnerId.userName }</div>
                        </div>
                  <div class="currency-info-left">
                      <div class="currency-rating">★★★★★</div>
                      <div class="currency-location">
                          <i class="fas fa-map-marker-alt currency-location-icon"></i>
                          <span>${ data.matchedOfferOwnerId.city }, ${ data.matchedOfferOwnerId.currency }</span>
                      </div>
                  </div>
              </div>
              <div class="currency-user-right">
                  <div class="currency-info-right">
                      <div class="currency-stats">
                          <div class="currency-stat-item">
                              <i class="fas fa-lock currency-icon"></i>
                              <span>Unknown Completed trades</span>
                          </div>
                          <div class="currency-stat-item">
                              <i class="fas fa-clock currency-icon"></i>
                              <span>Unknown avg completion time</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>    
        `; 

        // Display in discussion container
        tradesInDiscussionList.appendChild(discussionCard)
      })
    }else {
      const noDiscussionsContainer = document.createElement("div");
      noDiscussionsContainer.classList.add("no-offers-container");

      noDiscussionsContainer.innerHTML = `
        <p>You have no discussions</p>
        <img src="images/nooffers.png" alt="No Offers">
        <button class="create-offer-btn">Click the <span class="plus-icon">+</span> Sign to create an offer</button>
      `;

      // Append the no discussions container directly to the tradesContainer
      discussionsContainer.appendChild(noDiscussionsContainer);
    }

    discussionsContainer.display = 'block'

    // Shorten name field if too long.
    const maxChars = 11
    const divs = document.querySelectorAll('.currency-username');
    divs.forEach(div => {
      if (div.textContent.length > maxChars) {
        div.textContent = div.textContent.slice(0, maxChars) + ".";
      }
    });

    // Open Chat when clicking the email icon
    document.querySelectorAll('.currency-email-icon').forEach(icon => {
      icon.addEventListener('click', (event) => {
        // Find the closest discussion card to get the associated data
        const discussionCard = event.target.closest('.currency-card');

        if (discussionCard) {
          const roomId = discussionCard.getAttribute('data-discussion-id');
          const tradeId = discussionCard.getAttribute("data-discussion-id"); 
          const senderId = discussionCard.getAttribute('data-sender-id');
          const senderName = discussionCard.getAttribute('data-sender-name');
          const senderImage = discussionCard.getAttribute('data-sender-image');
          const receiverId = discussionCard.getAttribute('data-reciever-id');
          const receiverName = discussionCard.getAttribute('data-reciever-name');
          const receiverImage = discussionCard.getAttribute('data-reciever-image');
          const offerId = discussionCard.getAttribute('data-offer-id'); 
          
          handleChat(roomId, tradeId, senderId, senderName, senderImage, receiverId, offerId, receiverName, receiverImage)
        }
      });
    });

  }

  //================================================
  // Chat | Complete trade | Cancel trade handler //
  //================================================
  function handleChat(roomId, tradeId, senderId, senderName, senderImage, receiverId, offerId, receiverName, receiverImage) {
    // console.log(roomId, tradeId, senderId, senderName, senderImage, receiverId, receiverName, receiverImage)

    // Save the current body content to sessionStorage
    sessionStorage.setItem('previousPageContent', document.body.innerHTML);

    // Clear the body content
    document.body.innerHTML = "";

    // Create a new div to serve as the chat container
    const chatContainer = document.createElement("div");
    chatContainer.classList.add("chat-container");

    // Populate the chat container with the chat box HTML structure
    chatContainer.innerHTML = `
        <div class="chat-box">
            <div class="header">
                <div class="back-arrow" onclick="goBack()">←</div>
                <div class="user-info">
                    <div class="profile-pic" id="userImage" style="background-image: url('images/profiles/${senderImage}');"></div>
                    <div class="username" id="userName">${senderName}</div>
                </div>
                <div class="icons">
                    <i class="icon material-icons" id="withdraw-btn">account_balance</i>
                    <i class="icon material-icons" id="swap-btn">currency_exchange</i>
                </div>
            </div>

            <div class="messages" id="messages">
                <!-- Messages will be appended here dynamically -->
            </div>

            <!-- Typing Indicator -->
            <div class="activity" id="typing-indicator" style="display: none; font-weight: bold;">
                <span id="typing-user"></span> 
            </div>

            <!-- Error Indicator -->
            <div class="activity" id="error-indicator" style="display: none; color: red; font-weight: bold;">
                <span id="error-span"></span>
            </div>

            <div class="input-box">
                <input type="text" id="message-input" placeholder="Type a message">
                <button class="send-button" id="send-button">▶</button>
            </div>

            <!-- Popup Modal complete swap -->
            <div id="swap-popup" class="popup" style="display:none;">
                <div class="popup-content">
                    <p>Would you like to complete this swap?</br>Your counterparty has to mark the trade</br>as complete in order it to be closed.?</p>
                    <div class="popup-actions">
                        <button class="popup-button" id="swap-popup-yes">Yes</button>
                        <button class="popup-button" id="swap-popup-no">No</button>
                    </div>
                </div>
            </div>

            <!-- Popup Modal withdraw from swap -->
            <div id="withdraw-popup" class="popup" style="display:none;">
                <div class="popup-content">
                    <p>Are you sure you want to</br>withdraw from this swap?</br>Your counter party will be notified</p>
                    <div class="popup-actions">
                        <button class="popup-button" id="withdraw-popup-yes">Yes</button>
                        <button class="popup-button" id="withdraw-popup-no">No</button>
                    </div>
                </div>
            </div>

            <!-- Popup Modal complete notification -->
            <div id="complete-notif-popup" class="popup" style="display:none;">
                <div class="popup-content">
                    <p id="completeNotifMessage"></p> <!-- Dynamically set the sender's name here -->
                    <div class="popup-actions">
                        <button class="popup-button" id="complete-popup-yes">Yes</button>
                        <button class="popup-button" id="complete-popup-no">No</button>
                    </div>
                </div>
            </div>

            <!-- Popup Modal withdrawal notification -->
            <div id="withdraw-notif-popup" class="popup" style="display:none;">
                <div class="popup-content">
                    <p id="withdrawSwapMessage"></p>
                    <div class="popup-actions">
                        <button class="popup-button" id="withdraw-notif-popup-yes">Ok</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Append the chat container to the body
    document.body.appendChild(chatContainer);

    // Dynamically load the CSS for the chat
    loadChatCss();

    // Set up the event listeners and Socket.IO logic
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const messagesDiv = document.getElementById("messages");
    const typingIndicator = document.getElementById("typing-indicator");    
    const typingUserSpan = document.getElementById("typing-user");
    const errorIndicator = document.getElementById("error-indicator");
    const errorSpan = document.getElementById("error-span");

    let typingTimeout;

    // Join the chat room
    window.userSocket.emit("joinRoom", { roomId, senderName });

    // Receive chat history and display it
    window.userSocket.on("chatHistory", (chatHistory) => {
        renderChatHistory(chatHistory);
    });

    // Listen for new messages
    window.userSocket.on("newMessage", (newMessage) => {
        appendMessage(newMessage);
    });

    // Typing event
    messageInput.addEventListener("input", () => {
        window.userSocket.emit("typing", { roomId, senderName });
    });

    // Typing event listener (when another user is typing)
    window.userSocket.on("typing", ({ senderName }) => {
        typingUserSpan.textContent = `${senderName} is typing...`;
        typingIndicator.style.display = "block";

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            typingIndicator.style.display = "none";
        }, 2000); // Hide typing indicator after 2 seconds of inactivity
    });

    // Typing event listener (when another user is typing)
    window.userSocket.on("error", ({ message }) => {
        errorSpan.textContent = `${message}`;
        errorIndicator.style.display = "block";

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          errorIndicator.style.display = "none";
        }, 5000); // Hide typing indicator after 2 seconds of inactivity
    });

    // Popup logic
    //=============
    // Popup elements
    const swapButton = document.getElementById("swap-btn");
    const withdrawButton = document.getElementById("withdraw-btn");

    // Confirm swap elements
    const swapPopup = document.getElementById('swap-popup');
    const swapYesBtn = document.getElementById('swap-popup-yes');
    const swapNoBtn = document.getElementById('swap-popup-no');

    // Withdraw from swap elements
    const withdrawPopup = document.getElementById('withdraw-popup');
    const withdrawYesBtn = document.getElementById('withdraw-popup-yes');
    const withdrawNoBtn = document.getElementById('withdraw-popup-no');

    // Confirm swap notification elements
    const confirmNotifPopup = document.getElementById('complete-notif-popup');
    const confirmNotifYes = document.getElementById('complete-popup-yes');
    const confirmNotifNo = document.getElementById('complete-popup-no');
    const completeNotifMessage = document.getElementById('completeNotifMessage');

    // Withdrawal notification elements
    const withdrawNotifPopup = document.getElementById('withdraw-notif-popup');
    const withdrawNotifYes = document.getElementById('withdraw-notif-popup-yes');

    // Check if any popup is open
    function isAnyPopupOpen() {
      return swapPopup.style.display === 'block' || 
            withdrawPopup.style.display === 'block' || 
            withdrawNotifPopup.style.display === 'block' ||
            confirmNotifPopup.style.display === 'block';
    }

    // Disable buttons function
    function disableButtons() {
      swapButton.disabled = true;
      withdrawButton.disabled = true;
    }

    // Enable buttons function
    function enableButtons() {
      swapButton.disabled = false;
      withdrawButton.disabled = false;
    }

    // Complete trade
    //================
    swapButton.addEventListener("click", () => {
      if (!isAnyPopupOpen()) { // Ensure no other popup is active
        disableButtons();  // Disable buttons when popup is opened
        swapPopup.style.display = 'block';
      }
    });

    swapNoBtn.addEventListener("click", () => {
      swapPopup.style.display = 'none';
      enableButtons();  // Enable buttons when popup is closed
    });

    swapYesBtn.addEventListener("click", () => {
      console.log('offer id: ', offerId)
      window.userSocket.emit('markTradeComplete', { roomId, tradeId, senderId, receiverId, offerId, senderName, action: 'sender' });
      swapPopup.style.display = 'none';
      enableButtons();  // Enable buttons after action is completed
    });

    // Complete swap notification
    //============================
    window.userSocket.on('completeTradeNotif', ({ senderName, from }) => {
      if (!isAnyPopupOpen()) { // Ensure no other popup is active
        disableButtons();  // Disable buttons when notification popup is opened
        completeNotifMessage.innerHTML = `<b>${ senderName }</b> has marked this swap as completed.</br>You must both mark the trade as completed</br>in order for it to be closed.`;
        
        confirmNotifYes.addEventListener('click', () => {
          console.log('offer Id: ', offerId)
          window.userSocket.emit('markTradeComplete', { roomId, tradeId, senderId, receiverId, offerId, senderName, action: 'receiver' });
          confirmNotifPopup.style.display = 'none';
          enableButtons();  // Enable buttons after action is completed
        })
        
        confirmNotifPopup.style.display = 'block';

        confirmNotifNo.addEventListener('click', () => {
          confirmNotifPopup.style.display = 'none';
          enableButtons();  // Enable buttons after action is completed
        })
      }
    });


    // Withdraw from swap
    //====================
    withdrawButton.addEventListener('click', () => {
      if (!isAnyPopupOpen()) { // Ensure no other popup is active
        disableButtons();  // Disable buttons when popup is opened
        withdrawPopup.style.display = 'block';
      }
    });

    withdrawYesBtn.addEventListener('click', () => {
      window.userSocket.emit('withdrawTrade', { roomId, tradeId, senderId, receiverId, offerId, senderName, action: 'sender' });
      withdrawPopup.style.display = 'none';
      enableButtons();  // Enable buttons after action is completed
    });

    withdrawNoBtn.addEventListener('click', () => {
      withdrawPopup.style.display = 'none';
      enableButtons();  // Enable buttons when popup is closed
    });

    
    // Withdraw from swap notification
    //=================================
    window.userSocket.on('withdrawTradeNotif', ({ senderName }) => {
      if (!isAnyPopupOpen()) { // Ensure no other popup is active
        disableButtons();  // Disable buttons when notification popup is opened
        document.getElementById('withdrawSwapMessage').innerHTML = `<b>${ senderName }</b> wants to</br>withdraw from this swap`

        withdrawNotifPopup.style.display = 'block';

        withdrawNotifYes.addEventListener('click', () => {
          withdrawNotifPopup.style.display = 'none';
          enableButtons();  // Enable buttons after action is completed
        });
      }
    });


    // Send message logic
    //====================
    sendButton.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message !== "") {
            window.userSocket.emit("saveMessage", {
                roomId,
                message,
                senderId,
                senderName,
                senderImage,
                receiverId,
                receiverName,
                receiverImage
            });
            messageInput.value = ""; // Clear input field
        }
    });

    function renderChatHistory(chatHistory) {
        let lastDate = null;
        messagesDiv.innerHTML = ""; // Clear previous messages

        chatHistory.forEach((message) => {
            const messageDate = new Date(message.createdAt).toDateString();
            if (messageDate !== lastDate) {
                appendDateIndicator(messageDate);
                lastDate = messageDate;
            }
            appendMessage(message);
        });
    }

    function appendMessage(message) {
        const isSender = message.senderId === senderId; // Check if the user is the sender 
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", isSender ? "sent" : "received");

        const profilePicElement = document.createElement("div");
        profilePicElement.classList.add("profile-pic");
        profilePicElement.style.backgroundImage = `url(images/profiles/${ message.senderImage })`;

        const messageContentElement = document.createElement("div");
        messageContentElement.classList.add("message-content");

        const messageBubbleElement = document.createElement("div");
        messageBubbleElement.classList.add("message-bubble");
        messageBubbleElement.textContent = message.message; // Use the decrypted message

        const messageTimeElement = document.createElement("div");
        messageTimeElement.classList.add("message-time");
        const messageTime = new Date(message.createdAt);
        messageTimeElement.textContent = messageTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        messageContentElement.appendChild(messageBubbleElement);
        messageContentElement.appendChild(messageTimeElement);

        if (isSender) {
            messageElement.appendChild(messageContentElement);
            messageElement.appendChild(profilePicElement);
        } else {
            messageElement.appendChild(profilePicElement);
            messageElement.appendChild(messageContentElement);
        }

        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the latest message
    }

    function appendDateIndicator(date) {
        const dateElement = document.createElement("div");
        dateElement.classList.add("date-indicator");
        dateElement.textContent = date;
        messagesDiv.appendChild(dateElement);
    }

    // Function to dynamically load CSS file
    function loadChatCss() {
      const head = document.head;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/css/chat.css";
      head.appendChild(link);
    }
  }

});


// IMAGE SPLASH AND WELCOME SCREENS
// Array of image sources
const imageSources = ["/images/image1.png", "/images/image2.png"];

// Index to keep track of the current image
let currentIndex = 0;

// Function to change the image with a fade effect
function changeImageWithFade() {
  // Get the image element
  const image = document.getElementById("intro-image");
  // Fade out the image
  image.style.opacity = 0;
  setTimeout(() => {
    // Change the src attribute to the next image source
    image.src = imageSources[currentIndex];
    // Fade in the image
    setTimeout(() => {
      image.style.opacity = 1;
    }, 100); // Adjust this timing to match your transition duration
    // Increment the index
    currentIndex = (currentIndex + 1) % imageSources.length;
    updateDots();
  }, 1000); // Adjust this timing to match your transition duration
}

// Function to update the dots
function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Initialize the first dot as active
updateDots();

// Call the changeImageWithFade function every 5 seconds
setInterval(changeImageWithFade, 5000);

function handleWelcomePage() {
  // Function to redirect after 3 seconds with a smooth transition
  function redirectAfterDelay() {
    setTimeout(function () {
      // Add fade-out class to the body to transition the entire page
      document.body.classList.add("fade-out");

      // Wait for the fade-out transition to complete before redirecting
      setTimeout(function () {
        window.location.href = "/intro";
      }, 1000); // Match the transition duration in CSS
    }, 3000);
  }

  // Call the function to start the timeout
  redirectAfterDelay();
}

// REDIRECTS
function redirectToFacebook() {
  // window.location.href = '/sso/facebook';
}

function redirectToGoogle() {
  window.location.href = "/sso/google";
}

function signout() {
  localStorage.setItem('isLoggingOut', 'true');
  if (window.userSocket) {
      // Emit a logout event before disconnecting
      window.userSocket.emit('userLogout', () => {
        window.userSocket.disconnect();
      });
  }
  
  // Clear both localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  window.location.href = "/logout";
}

function createOffer() {
  window.location.href = "/offer/create";
}

function displayDashboard() {
  window.location.href = "/user";
}

function redirectToEndpoint(button) {
  const buttonText = button.textContent.trim().toLowerCase();
  let endpoint = "";

  if (buttonText === "signup") {
    endpoint = "/signup";
  } else if (buttonText === "login") {
    endpoint = "/login";
  } else if (buttonText === "explore") {
    endpoint = "/login";
  }

  if (endpoint) {
    window.location.href = endpoint;
  }
}

// Function to go back to the previous page
function goBack() {
  // Remove the chat.css stylesheet
  const chatStylesheet = document.querySelector('link[href="/css/chat.css"]');
  if (chatStylesheet) {
    chatStylesheet.parentNode.removeChild(chatStylesheet);
  }

  // Retrieve the previous page content from sessionStorage
  const previousContent = sessionStorage.getItem('previousPageContent');
  
  // Restore the previous content if it exists
  if (previousContent) {
      // Load the original style.css again
      const head = document.querySelector('head');
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = '/css/style.css';
      head.appendChild(styleLink);

      document.body.innerHTML = previousContent;
  } else {
      window.history.back(); // Fallback if there's no previous content
  }
}

// DATA SUBMISSION
function submitforgotPasswordData() {
  document.getElementById("forgotPassword").submit();
}

function submitresetPasswordData() {
  document.getElementById("resetPassword").submit();
}

function verifyUser() {
  document.getElementById("verifyUser").submit();
}

function resendVerification() {
  document.getElementById("resendVerification").submit();
}


// COLLECT USER DATA AT SIGN UP
// step one
function nextStep() {
  const formDataStep1 = new FormData(
    document.getElementById("registrationFormStep1")
  );
  const dataStep1 = Object.fromEntries(formDataStep1.entries());
  localStorage.setItem("step1Data", JSON.stringify(dataStep1));
  window.location.href = "register2";
}

// step two
function submitFormData() {
  // Retrieve step 1 data from local storage
  const step1Data = JSON.parse(localStorage.getItem("step1Data"));

  // Collect form data from step 2
  const formDataStep2 = new FormData(
    document.getElementById("registrationFormStep2")
  );
  const dataStep2 = Object.fromEntries(formDataStep2.entries());

  // Combine step 1 and step 2 data
  const combinedData = { ...step1Data, ...dataStep2 };
  delete combinedData.files; // Remove the files field before submitting

  // Set combined data to hidden input field
  document.getElementById("step1Data").value = JSON.stringify(combinedData);

  // Submit the form
  document.getElementById("registrationFormStep2").submit();

  // Clear all data from local storage
  localStorage.clear();
}

// FILE UPLOAD
function uploadFile() {
  const fileInput = document.getElementById("proofOfID");
  const file = fileInput.files[0];
  const step1Data = JSON.parse(localStorage.getItem("step1Data"));
  const email = step1Data.email;

  if (file && email) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    const uploadResponseDiv = document.getElementById("uploadResponse");
    uploadResponseDiv.textContent = "Uploading file...";

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          uploadResponseDiv.textContent =
            data.message || "File uploaded successfully.";
        } else {
          uploadResponseDiv.textContent = data.message || "File upload failed.";
        }
      })
      .catch((error) => {
        uploadResponseDiv.textContent = "An error occurred during file upload.";
      });
  } else {
    uploadResponseDiv.textContent =
      "Please select a file and provide a valid email.";
  }
}


// TERMS AND CONDITIONS MODAL
// Get the modal
var modal = document.getElementById("termsModal");

// Get the button that opens the modal
var btn = document.getElementById("termsLink");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-button")[0];

// Get the "I Agree" button
var agreeButton = document.getElementById("agreeButton");

// Function to fetch and display T&Cs
async function fetchAndDisplayTcs() {
  try {
    // const response = await fetch("/tcs/latest");
    const response = await fetch("http://localhost:5000/tcs/latest");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Populate the modal with fetched data
    document.querySelector("#termsModal h2").textContent = data.Tcstitle;
    document.querySelector("#termsModal p").textContent = data.content;

    // Display the modal
    modal.style.display = "block";
  } catch (error) {
    console.error("Error fetching T&Cs:", error);
  }
}

// When the user clicks on the button, open the modal and fetch T&Cs
btn.onclick = function (event) {
  event.preventDefault();
  fetchAndDisplayTcs();
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks on "I Agree", close the modal
agreeButton.onclick = function () {
  modal.style.display = "none";
  document.getElementById("tcs").checked = true;
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Getting Matched Trade info
function getMatchedTradeInfo(mathedItem){
  const matchedOfferId = mathedItem.dataset.matchId 
  const matchedOfferOwnerId = mathedItem.dataset.matchUser
  const userId = mathedItem.dataset.userId
  const userOfferId = mathedItem.dataset.offerId
  const matchFee = mathedItem.dataset.matchFee

  let matchedDetails ={
    matchedOfferId,
    matchedOfferOwnerId,
    userId,
    userOfferId,
    matchFee
  }

  return matchedDetails
}

// This function will establish the Socket.IO connection
function connectSocketIO(UID) {
  if (UID) { 
    if (!window.userSocket) {
      const socket = io('ws://localhost:3000', {
        query: { userId: UID }
      });

      // Add error handling
      socket.on('connect_error', (err) => {
        console.error("Socket connection error: ", err);
      });

      socket.on('connect_timeout', () => {
        console.warn("Socket connection timed out.");
      });

      window.userSocket = socket;
    }
  } else {
    console.log("No trader card found.");
  }
}

