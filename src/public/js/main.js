import { connectSocketIO } from "./handlers/socketHandler.js";
import { handleMenu } from "./utils/menu.js";
import { handleWelcomePage } from "./utils/handleWelcomePage.js";
import { changeImageWithFade, updateDots } from "./utils/splashScreen.js";
import { handleNotifications } from "./handlers/notificationHandler.js";
import { redirectToFacebook, redirectToGoogle, signOut, createOffer, goBack, displayDashboard, redirectToEndpoint } from './utils/redirects.js'
import { switchMenuTabs } from './utils/switchMenuTabs.js';
import { handleTcsModal } from './handlers/tcsHandler.js'
import { nextStep, submitFormData } from './utils/registration.js';


const notificationCountElement = document.getElementById("notification-count");
let Notifications = [];

// // AFTER PAGE IS COMPLETEY LOADED
document.addEventListener("DOMContentLoaded", function () {
  // Connect user to socketIO and setting user status
  const UID = document.querySelector(".trader-card")?.dataset.userId;

  localStorage.setItem("isLoggingOut", "false");
  const userStatus = localStorage.getItem("isLoggedIn");

  if (!userStatus && UID) {
    // Check if the trader card exists and connect if not already connected
    connectSocketIO(UID);
    localStorage.setItem("isLoggedIn", "true");
  }

  handleMenu() // Handle side menu on user's dashboard

  // Check and swap splash screen after 3 seconds
  if (document.getElementById("welcome-page")) {
    console.log('in welcome-page')
    handleWelcomePage();
  }

  // Handling notifications
  handleNotifications(Notifications, notificationCountElement);

  // Switching between menu tabs
  switchMenuTabs();
  

  // REDIRECTS
  // document.getElementById('signOut').addEventListener('click', signOut)
  // document.getElementById('createOffer').addEventListener('click', createOffer)
  document.querySelectorAll('.go-back').forEach(button => {
    button.addEventListener('click', function(){
      console.log('button cliked')
    })
  })
  // document.getElementById('facebookButton').addEventListener('click', redirectToFacebook)
  // document.getElementById('googleButton').addEventListener('click', redirectToGoogle)    
  // document.querySelectorAll('.button').forEach(button => {
  //   button.addEventListener('click', function() {
  //     redirectToEndpoint(button); 
  //   });
  // }); 
  // document.querySelectorAll('.social-button').forEach(button => {
  //   button.addEventListener('click', function () {
  //     const action = button.getAttribute('data-action');  
  //     if (action === "dashboard") { displayDashboard(); }
  //   });
  // }); // redirect to dashboard

});


// IMAGE SPLASH AND WELCOME SCREENS
updateDots(); // Initialize the first dot as active
setInterval(changeImageWithFade, 5000); // Call the changeImageWithFade function every 5 seconds


// COLLECT USER DATA AT SIGN UP
document.getElementById('next-step-btn').addEventListener('click', nextStep);
document.getElementById('submit-form-btn').addEventListener('click', submitFormData);










// Handle TCS modal
var modal = document.getElementById("termsModal"); // Get the modal
  var btn = document.getElementById("termsLink"); // Get the button that opens the modal
  var span = document.getElementsByClassName("close-button")[0]; // Get the <span> element that closes the modal
  var agreeButton = document.getElementById("agreeButton"); // Get the "I Agree" button

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
