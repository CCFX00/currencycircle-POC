// Test data for submission
const TEST_RATER_ID = "66ffabf07f4ce0560cc4e171"; 
const TEST_RATED_USER_ID = "66ffabf07f4ce0560cc4e176"; 
const TEST_TRADE_ID = "66ffabf07f4ce0560cc4e174"; 

// Get all necessary DOM elements
const stars = document.querySelectorAll('.star');
const progressBar = document.querySelector('.progress-bar');
const issueButtons = document.querySelectorAll('.issue-btn');
const commentBox = document.querySelector('.comment-box');
const confirmButton = document.querySelector('.confirm-button');

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
        raterId: TEST_RATER_ID, // The user giving the rating
        ratedUserId: TEST_RATED_USER_ID, // The user being rated
        tradeId: TEST_TRADE_ID,
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

        // Reset the form
        currentRating = 0;
        selectedIssues.clear();
        commentBox.value = '';
        progressBar.setAttribute('data-rating', '0');
        highlightStars(0);
        issueButtons.forEach(button => button.classList.remove('selected'));

    } catch (error) {
        console.error('Submission error:', error);
        alert('You already rated trade');
    } finally {
        // Re-enable the confirm button
        confirmButton.disabled = false;
        confirmButton.textContent = 'Confirm';
    }
});

// Initialize the display
updateStars();
