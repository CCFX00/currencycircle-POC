export function switchMenuTabs() {
  // LOAD OFFERS, MATCHED TRADES, DISCUSSIONS TABS
  const buttons = document.querySelectorAll(".nav-btn");
  const offersContainer = document.getElementById("offers-container");
  const tradesContainer = document.getElementById("trades-container");
  const discussionsContainer = document.getElementById("discussion-container");

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
        fetchMatchedTrades(`http://localhost:5000/trades`);
      } else if (this.id === "in-discussion-btn") {
        fetchInDiscussionTrades(`http://localhost:5000/discussions/all`);
      }
    });
  });
}
