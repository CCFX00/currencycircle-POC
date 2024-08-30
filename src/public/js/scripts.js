// AFTER PAGE IS COMPLETEY LOADED
document.addEventListener("DOMContentLoaded", function () {
  // Connect to server Socket IO
  const traderCard = document.querySelector(".trader-card");

    if (traderCard) {
        const UID = traderCard.dataset.userId;

        // Check if the user is already connected
        if (!window.userSocket) {
            const socket = io('ws://localhost:3000', {
                query: { userId: UID }
            });

            window.userSocket = socket;

            socket.on("receiveNotification", (notification) => {
                console.log("Notification received:", notification);
            });
        }
    } else {
        console.log("No trader card found.");
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
        
        // localStorage.removeItem('matchedDetails');

        switchTab("my-offers-btn", offersContainer);
      } else if (this.id === "matched-trades-btn") {
        fetchMatchedTrades(`http://localhost:5000/trades`)
        // switchTab('matched-trades-btn', tradesContainer);
      } else if (this.id === "in-discussion-btn") {
        switchTab("in-discussion-btn", discussionsContainer);
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

      // Update the trades container with the new matches
      updateTradesContainer(matches, userOffer);
    } catch (error) {
      console.error("Error fetching matched trades:", error);
    }
  }

  function updateTradesContainer(matches, userOffer) {
    // Clear existing offers
    matchedTradesList.innerHTML = "";

    // Remove existing no-offers-container if it exists
    const existingNoOffersContainer = document.querySelector(
      ".no-offers-container-trades"
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
          <div class="trade-actions" style="display:flex"> 
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
        `;

        matchedTradesList.appendChild(offerCard);

        // Add click event listener
        offerCard.addEventListener("click", () => {
          let details = getMatchedTradeInfo(offerCard)

        });
              
        
      });
    } else {
      const noOffersContainer = document.createElement("div");
      noOffersContainer.classList.add("no-offers-container-trades");

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
  localStorage.clear();
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

function submitLoginFormData() {
  document.getElementById("userLogin").submit();
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
    const response = await fetch("/tcs/latest");
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



// Gatting Matched Trade info
function getMatchedTradeInfo(mathedItem){
  const matchedOfferId = mathedItem.dataset.matchId 
  const matchedOfferOwnerId = mathedItem.dataset.matchUser
  const userId = mathedItem.dataset.userId
  const userOfferId = mathedItem.dataset.offerId

  let matchedDetails ={
    matchedOfferId,
    matchedOfferOwnerId,
    userId,
    userOfferId
  }

  return matchedDetails

  // localStorage.setItem('matchedDetails', JSON.stringify(matchedDetails))
}
