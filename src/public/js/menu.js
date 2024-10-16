document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.querySelector(".menu-icon");
    const sidebar = document.querySelector(".sidebar");
    const dashboardLink = document.getElementById("dashboard-link");
    const myOffersLink = document.getElementById("my-offers-link");
    const matchedTradesLink = document.getElementById("matched-trades-link");
    const inDiscussionLink = document.getElementById("in-discussion-link");

    // Toggle sidebar visibility
    menuIcon.addEventListener("click", function() {
        sidebar.classList.toggle("active");
        menuIcon.classList.toggle("active");
    });

    // Close sidebar if clicked outside
    document.addEventListener("click", function(event) {
        if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
            sidebar.classList.remove("active");
            menuIcon.classList.remove("active");
        }
    });

    // Handle dashboard link click (reload current page)
    dashboardLink.addEventListener("click", function(e) {
        e.preventDefault();
        window.location.reload();
    });

    // Handle My Offers link (scroll to offers section)
    myOffersLink.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector("#my-offers-btn").scrollIntoView({ behavior: "smooth" });
    });

    // Handle Matched Trades link (scroll to matched trades)
    matchedTradesLink.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector("#matched-trades-btn").scrollIntoView({ behavior: "smooth" });
    });

    // Handle In Discussion link (scroll to in discussion)
    inDiscussionLink.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector("#in-discussion-btn").scrollIntoView({ behavior: "smooth" });
    });

    // Handle Chats link
    document.querySelector('a[href="/chats/chat.njk"]').addEventListener("click", function(e) {
        e.preventDefault();
        window.location.href = "/chats/chat.njk";
    });

    // Handle Trade History link
    document.querySelector('a[href="/tradehistory/tradehistory.njk"]').addEventListener("click", function(e) {
        e.preventDefault();
        window.location.href = "/tradehistory/tradehistory.njk";
    });
});
