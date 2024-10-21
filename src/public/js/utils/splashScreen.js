// IMAGE SPLASH AND WELCOME SCREENS
const imageSources = ["/images/image1.png", "/images/image2.png"]; // Array of image sources
let currentIndex = 0; // Index to keep track of the current image

// Function to change the image with a fade effect
export function changeImageWithFade() {
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
export function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}
