// TERMS AND CONDITIONS MODAL
export function handleTcsModal() {
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
}
