function nextStep() {
    const formDataStep1 = new FormData(document.getElementById('registrationFormStep1'))
    const dataStep1 = Object.fromEntries(formDataStep1.entries())
    localStorage.setItem('step1Data', JSON.stringify(dataStep1))
    window.location.href = 'register2'
}

function submitFormData() {
    // Retrieve step 1 data from local storage
    const step1Data = JSON.parse(localStorage.getItem('step1Data'))

    // Collect form data from step 2
    const formDataStep2 = new FormData(document.getElementById('registrationFormStep2'))
    const dataStep2 = Object.fromEntries(formDataStep2.entries())

    // Combine step 1 and step 2 data
    const combinedData = { ...step1Data, ...dataStep2 }

    // Set combined data to hidden input field
    document.getElementById('step1Data').value = JSON.stringify(combinedData)

    // Submit the form
    document.getElementById('registrationFormStep2').submit()

    // Clear all data from local storage
    localStorage.clear();
}

function submitLoginFormData(){
    document.getElementById('userLogin').submit()
    // window.location.href = '/user'
}

function submitforgotPasswordData(){
    document.getElementById('forgotPassword').submit()
}

function submitresetPasswordData(){
    document.getElementById('resetPassword').submit()
}

function verifyUser() {
    document.getElementById('verifyUser').submit()
}

function resendVerification(){
    document.getElementById('resendVerification').submit()    
}

function redirectToEndpoint(button) {
    const buttonText = button.textContent.trim().toLowerCase();
    let endpoint = '';

    if (buttonText === 'signup') {
        endpoint = '/signup';
    } else if (buttonText === 'login') {
        endpoint = '/login';
    }

    if (endpoint) {
        window.location.href = endpoint;
    }
}

 // Array of image sources
 const imageSources = [
    "/images/image1.png",
    "/images/image2.png"
  ];

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


  document.addEventListener('DOMContentLoaded', function () {
    // Check if we are on the specific page by looking for the unique identifier
    if (document.getElementById('welcome-page')) {
      console.log('Welcome page detected'); // Debugging line to ensure the script is running
  
      // Function to redirect after 3 seconds with a smooth transition
      function redirectAfterDelay() {
        setTimeout(function() {
          // Add fade-out class to the spinner container
          document.getElementById('spinner-container').classList.add('fade-out');
  
          // Wait for the fade-out transition to complete before redirecting
          setTimeout(function() {
            window.location.href = '/intro';
          }, 1000); // Match the transition duration in CSS
        }, 3000);
      }
  
      // Call the function to start the timeout
      redirectAfterDelay();
    }
  });
  
  