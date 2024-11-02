document.addEventListener("DOMContentLoaded", function() {
    // Get all IDs from session storage
    const currentTradeId = sessionStorage.getItem('currentTradeReview');
    const raterId = sessionStorage.getItem('currentRaterId');
    const ratedUserId = sessionStorage.getItem('currentRatedId');

    // Validate that we have all necessary IDs
    if (!currentTradeId || !raterId || !ratedUserId) {
        console.error('Missing required IDs');
        window.location.href = '/tradehistory';
        return;
    }

    // Get trade details from session storage
    const trades = JSON.parse(sessionStorage.getItem('tradeHistory') || '[]');
    const currentTrade = trades.find(trade => trade.tradeId === currentTradeId);
    
    if (!currentTrade) {
        console.error('Trade not found');
        window.location.href = '/tradehistory';
        return;
    }

    // Get all necessary DOM elements
    const stars = document.querySelectorAll('.star');
    const progressBar = document.querySelector('.progress-bar');
    const issueButtons = document.querySelectorAll('.issue-btn');
    const commentBox = document.querySelector('.comment-box');
    const confirmButton = document.querySelector('.confirm-button');
    const ratedUserInfo = document.querySelector('.rated-user-info');

    // Display rated user information
    if (ratedUserInfo) {
        ratedUserInfo.innerHTML = `
            <div class="user-profile">
                <div class="profile-pic" style="background-image: url('${currentTrade.receiver.profilePic}');"></div>
                <span class="username">${currentTrade.receiver.username}</span>
                <span class="location">${currentTrade.receiver.location}</span>
            </div>
        `;
    }

    // State management
    let currentRating = 0;
    const selectedIssues = new Set();

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            currentRating = parseInt(e.target.dataset.value);
            updateProgressBar();
            updateStars();
        });

        star.addEventListener('mouseover', (e) => {
            const value = parseInt(e.target.dataset.value);
            highlightStars(value);
        });
    });

    // Reset stars when mouse leaves the container
    document.querySelector('.stars').addEventListener('mouseleave', () => {
        highlightStars(currentRating);
    });

    // Progress bar update function
    function updateProgressBar() {
        progressBar.setAttribute('data-rating', currentRating.toString());
    }

    // Star highlight functions
    function highlightStars(count) {
        stars.forEach((star, index) => {
            star.textContent = index < count ? '★' : '☆';
        });
    }

    function updateStars() {
        highlightStars(currentRating);
    }

    // Issue button functionality
    issueButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            if (button.classList.contains('selected')) {
                selectedIssues.add(button.textContent);
            } else {
                selectedIssues.delete(button.textContent);
            }
        });
    });

    // Handle rating submission
    confirmButton.addEventListener('click', async () => {
        if (currentRating === 0) {
            alert('Please select a rating first');
            return;
        }

        // Prepare the rating data
        const ratingData = {
            raterId: raterId,
            ratedUserId: ratedUserId,
            tradeId: currentTradeId,
            rating: currentRating,
            comment: commentBox.value.trim(),
            issues: Array.from(selectedIssues)
        };

        try {
            // Disable the confirm button while submitting
            confirmButton.disabled = true;
            confirmButton.textContent = 'Submitting...';

            const response = await fetch('http://localhost:3000/ccfx/api/v1/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ratingData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Submission successful:', result);
            alert('Rating submitted successfully!');

            // Clear the trade ID from session storage
            sessionStorage.removeItem('currentTradeReview');

            // Redirect back to trade history
            window.location.href = '/tradehistory';

        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting rating: ' + error.message);
        } finally {
            // Re-enable the confirm button
            confirmButton.disabled = false;
            confirmButton.textContent = 'Confirm';
        }
    });

    // Initialize the display
    updateStars();
});