// Function to update the discussions container with locked trades
export function updateDiscussionsContainer(result) {
  const tradesInDiscussionList = document.getElementById("trades-in-discussion-list");
  const discussionsContainer = document.getElementById("discussion-container");

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

      const loggedInUserProfile = data.loggedInUserId.userImage
        ? `<img src="/images/profiles/${data.loggedInUserId.userImage}" alt="${data.loggedInUserId.name} Avatar" class="currency-avatar">`
        : `<img src="/images/profiles/noProfile.png" alt="No Profile Avatar" class="currency-avatar">`;

      const matchedOfferOwnerProfile = data.matchedOfferOwnerId.userImage
        ? `<img src="/images/profiles/${data.matchedOfferOwnerId.userImage}" alt="${data.matchedOfferOwnerId.name} Avatar" class="currency-avatar">`
        : `<img src="/images/profiles/noProfile.png" alt="No Profile Avatar" class="currency-avatar">`;

      discussionCard.innerHTML = `            
         <div class="currency-header">
             <span class="currency-date">${data.creationDate}</span>
             <span class="currency-rate">1 ${data.matchedOfferId.from} = ${data.matchedOfferId.rate} ${data.matchedOfferId.to}</span>
             <div class="currency-email-icon" id="chatButton"><i class="fas fa-envelope"></i></div>
         </div>          
         <div class="currency-user">
             <div class="currency-user-left">
                 <div class="currency-avatar-container">
                     ${loggedInUserProfile}
                     <div class="currency-username">${data.loggedInUserId.name}</div>
                 </div>
                 <div class="currency-info-left">
                     <div class="currency-rating">★★★★★</div>
                     <div class="currency-location">
                         <i class="fas fa-map-marker-alt currency-location-icon"></i>
                         <span>${data.loggedInUserId.city}, ${data.loggedInUserId.currency}</span>
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
                 <div class="currency-name">${data.matchedOfferId.from}</div>
                 <div class="currency-amount">${data.matchedOfferId.amount}</div>
             </div>
             <div class="matched-trades-arrow">
             <i class="fas fa-exchange-alt"></i>
             </div>
             <div>
                 <div class="currency-name">${data.matchedOfferId.to}</div>
                 <div class="currency-amount">${data.matchedOfferId.value}</div>
             </div>
         </div>
         <div class="currency-user" style="margin-top: 15px;">
             <div class="currency-user-left">
                 <div class="currency-avatar-container">
                     ${matchedOfferOwnerProfile}
                     <div class="currency-username">${data.matchedOfferOwnerId.name}</div>
                       </div>
                 <div class="currency-info-left">
                     <div class="currency-rating">★★★★★</div>
                     <div class="currency-location">
                         <i class="fas fa-map-marker-alt currency-location-icon"></i>
                         <span>${data.matchedOfferOwnerId.city}, ${data.matchedOfferOwnerId.currency}</span>
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
      tradesInDiscussionList.appendChild(discussionCard);
    });
  } else {
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

  discussionsContainer.display = "block";

  // Shorten name field if too long.
  const maxChars = 11;
  const divs = document.querySelectorAll(".currency-username");
  divs.forEach((div) => {
    if (div.textContent.length > maxChars) {
      div.textContent = div.textContent.slice(0, maxChars) + ".";
    }
  });

  // Open chat
  const chatBtns = document.querySelectorAll(".currency-email-icon");

  chatBtns.forEach((chatBtn) => {
    chatBtn.addEventListener("click", (event) => {
      // Instead of using fetch, redirect directly to /chat
      window.location.href = "/chat";
      event.stopPropagation();
    });
  });
}
