export function handleWelcomePage() {
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
