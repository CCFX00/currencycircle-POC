// AFTER PAGE IS COMPLETEY LOADED
document.addEventListener('DOMContentLoaded', function () {
  // Check if we are on the specific page by looking for the unique identifier
  if (document.getElementById('welcome-page')) {
    handleWelcomePage();
  }

  // CREATE OFFERS' PAGE
  const selects = document.querySelectorAll('.currency-select');
  selects.forEach(select => {
    select.addEventListener('change', function() {
      const flagIcon = this.parentElement.querySelector('.flag-icon');
      const selectedOption = this.options[this.selectedIndex];
      const flagSrc = selectedOption.getAttribute('data-flag');
      flagIcon.src = flagSrc;
      flagIcon.alt = `${this.value} Flag`;
    });
  });
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

// Call the changeImageWithFade function every 2 seconds
setInterval(changeImageWithFade, 5000);

function handleWelcomePage() {
  // Function to redirect after 3 seconds with a smooth transition
  function redirectAfterDelay() {
    setTimeout(function() {
      // Add fade-out class to the body to transition the entire page
      document.body.classList.add('fade-out');

      // Wait for the fade-out transition to complete before redirecting
      setTimeout(function() {
        window.location.href = '/intro';
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
  window.location.href = '/sso/google';
}

function signout(){
  window.location.href = '/logout';
}

function createOffer(){
  window.location.href = '/offer/create';
}

function displayDashboard(){
  window.location.href = '/user';
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
  const formDataStep1 = new FormData(document.getElementById("registrationFormStep1"));
  const dataStep1 = Object.fromEntries(formDataStep1.entries());
  localStorage.setItem("step1Data", JSON.stringify(dataStep1));
  window.location.href = "register2";
}

// step two
function submitFormData() {
  // Retrieve step 1 data from local storage
  const step1Data = JSON.parse(localStorage.getItem("step1Data"));

  // Collect form data from step 2
  const formDataStep2 = new FormData(document.getElementById("registrationFormStep2"));
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
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              uploadResponseDiv.textContent = data.message || "File uploaded successfully.";
          } else {
              uploadResponseDiv.textContent = data.message || "File upload failed.";
          }
      })
      .catch(error => {
          uploadResponseDiv.textContent = "An error occurred during file upload.";
      });
  } else {
      uploadResponseDiv.textContent = "Please select a file and provide a valid email.";
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
    const response = await fetch('/tcs/latest');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Populate the modal with fetched data
    document.querySelector('#termsModal h2').textContent = data.Tcstitle;
    document.querySelector('#termsModal p').textContent = data.content;

    // Display the modal
    modal.style.display = "block";
  } catch (error) {
    console.error('Error fetching T&Cs:', error);
  }
}

// When the user clicks on the button, open the modal and fetch T&Cs
btn.onclick = function(event) {
  event.preventDefault();
  fetchAndDisplayTcs();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks on "I Agree", close the modal
agreeButton.onclick = function() {
  modal.style.display = "none";
  document.getElementById("tcs").checked = true;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
