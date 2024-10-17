document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const scoreDisplay = document.querySelector('.score');
    const issueButtons = document.querySelectorAll('.issue-btn');
    const confirmButton = document.querySelector('.confirm-button');
    const container = document.querySelector('.container');
    const commentBox = document.querySelector('.comment-box');  
    let currentRating = 0;
    let selectedIssues = [];

    // Get the current logged-in user ID, the user being rated, and the trade ID
    const currentUserId = document.querySelector('[data-current-user-id]')?.dataset.currentUserId;
    const userId = document.querySelector('[data-user-id]')?.dataset.userId;
    const tradeId = document.querySelector('[data-trade-id]')?.dataset.tradeId;  // Get trade ID for this rating

    // Check if the current user is the same as the user being rated
    const canRate = currentUserId !== userId;

    // Disable rating if the user cannot rate themselves
    if (!canRate) {
        alert("You cannot rate yourself!");
        stars.forEach(star => star.style.pointerEvents = 'none');
        confirmButton.disabled = true;
        return;
    }

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-value'));
            updateStars();
            updateScoreDisplay();
            updateProgressBar();
        });
    });

    function updateStars() {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            star.textContent = starValue <= currentRating ? '★' : '☆';
        });
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = currentRating;
    }

    function updateProgressBar() {
        const bar = document.querySelector('.bar');
        bar.style.setProperty('--progress', `${(currentRating / 5) * 100}%`);
    }

    // Issue selection functionality
    issueButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            const issue = button.textContent;
            if (selectedIssues.includes(issue)) {
                selectedIssues = selectedIssues.filter(i => i !== issue);
            } else {
                selectedIssues.push(issue);
            }
        });
    });

    // Confirm button functionality
    confirmButton.addEventListener('click', () => {
        if (currentRating === 0) {
            alert('Please select a rating before confirming.');
            return;
        }

        // Create the rating data to be sent to the backend
        const ratingData = {
            userId: userId, 
            tradeId: tradeId,  // Include the trade ID in the payload
            rating: currentRating, 
            comment: selectedIssues.length > 0 ? selectedIssues.join(', ') : commentBox.value || "Excellent trade!"
        };

        fetch('http://localhost:3000/ccfx/api/v1/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ratingData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message) });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            showThankYouMessage();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit rating: ' + error.message); // Display the actual error message from the backend
        });
    });

    function showThankYouMessage() {
        container.style.display = 'none';
        const thankYouMessage = document.createElement('div');
        thankYouMessage.className = 'thank-you-message';
        thankYouMessage.innerHTML = `
            <h2>Thanks for rating!</h2>
            <p>Your feedback is valuable to us.</p>
            <button id="backButton">Go Back</button>
        `;
        document.body.appendChild(thankYouMessage);

        document.getElementById('backButton').addEventListener('click', () => {
            document.body.removeChild(thankYouMessage);
            window.history.back();
        });
    }
});
