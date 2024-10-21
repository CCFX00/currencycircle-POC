import { updateDiscussionsContainer } from "./discussionHandler.js";

const tradesContainer = document.getElementById("trades-container");

// Function to fetch matched trades
export async function fetchInDiscussionTrades(endpoint) {
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

// Function to fetch matched trades
export async function fetchMatchedTrades(endpoint) {
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


// Function to update the trades container with new matches
function updateTradesContainer(matches, userOffer, notifications) {
  const matchedTradesList = document.getElementById("matched-trades-list");

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
              <p id="notificationMessage">${match.user.userName} will now be notified of your interest. If ${match.user.userName} accepts, your match fee will be ${match.matchFee}${match.to}.</p>
              <div class="modal-buttons">
                <button id="yesButton" class="yes-button">Yes</button>
                <button id="cancelButton" class="cancel-button">Cancel</button>
              </div>
          </div>
        `;

      if (notifications && notifications.length > 0) {
        const details = 
        (offerCard);
        // Check if there is a related notification
        const notification = notifications.find(
          (notif) =>
            notif.senderId === details.matchedOfferOwnerId &&
            notif.recieverId === details.userId &&
            notif.offerId === details.matchedOfferId
        );

        if (notification) {
          if (!notification.isRead) {
            offerCard.querySelector(".trade-actions").style.display = "flex";
          } else if (notification.isRead && notification.isAccepted) {
            offerCard.querySelector(".trade-state").style.display = "block";
          }
        }
      } else {
        const details = getMatchedTradeInfo(offerCard);
        userSocket.emit("checkNotification", { offerId: details.userOfferId });
        userSocket.on("recieveNotification", (notifications) => {
          const notification = notifications.find(
            (notif) =>
              notif.senderId === details.userId &&
              notif.recieverId === details.matchedOfferOwnerId &&
              notif.offerId === details.userOfferId
          );

          if (notification) {
            if (notification.isRead && notification.isAccepted) {
              offerCard.querySelector(".trade-state").style.display = "block";
            }
          }
        });
      }

      matchedTradesList.appendChild(offerCard);

      const acceptBtn = offerCard.querySelector(".accept-btn");
      const declineBtn = offerCard.querySelector(".decline-btn");
      const yesBtn = offerCard.querySelector(".yes-button");
      const cancelBtn = offerCard.querySelector(".cancel-button");
      const notificationPopup = offerCard.querySelector(
        ".notification-container"
      );
      const notificationMessage = offerCard.querySelector(
        "#notificationMessage"
      );

      // Adding click event listener to the offer card to trigger the notification popup
      offerCard.addEventListener("click", (event) => {
        const tradeActions = offerCard.querySelector(".trade-actions");
        const tradeState = offerCard.querySelector(".trade-state");
        const notificationPopup = offerCard.querySelector(
          ".notification-container"
        );

        // Check if trade-actions and trade-state are hidden
        const areTradeActionsHidden =
          window.getComputedStyle(tradeActions).display === "none";
        const areTradeStateHidden =
          window.getComputedStyle(tradeState).display === "none";

        // Reinforce the check by ensuring no other offerCard has tradeState visible
        const anyOtherTradeStateVisible = Array.from(
          document.querySelectorAll(".trade-state")
        ).some((state) => window.getComputedStyle(state).display === "block");

        if (
          !anyOtherTradeStateVisible &&
          areTradeActionsHidden &&
          areTradeStateHidden
        ) {
          notificationPopup.style.display = "block";
        }

        event.stopPropagation();
      });

      // Confirm notification emission and close popup
      yesBtn.addEventListener("click", (event) => {
        let details = getMatchedTradeInfo(offerCard);

        window.userSocket.emit("sendNotification", {
          senderId: details.userId,
          recieverId: details.matchedOfferOwnerId,
          offerId: details.userOfferId,
          message: notificationMessage.textContent,
          matchFee: details.matchFee,
        });

        notificationPopup.style.display = "none";
        event.stopPropagation();
      });

      // Cancel notification emission and close popup
      cancelBtn.addEventListener("click", (event) => {
        notificationPopup.style.display = "none";
        event.stopPropagation();
      });

      // Accepting a notification
      acceptBtn.addEventListener("click", () => {
        let details = getMatchedTradeInfo(offerCard);
        window.userSocket.emit("acceptOffer", { ...details, action: "accept" });
        offerCard.querySelector(".trade-actions").style.display = "none";
        offerCard.querySelector(".trade-state").style.display = "block";
      });

      // Declining a notification
      declineBtn.addEventListener("click", () => {
        let details = getMatchedTradeInfo(offerCard);

        window.userSocket.emit("declineOffer", {
          ...details,
          action: "decline",
        });
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
