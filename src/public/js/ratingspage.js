document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const scoreDisplay = document.querySelector('.score');
    const issueButtons = document.querySelectorAll('.issue-btn');
    const confirmButton = document.querySelector('.confirm-button');
    const container = document.querySelector('.container');
    const commentBox = document.querySelector('.comment-box');  
    let currentRating = 0;
    let selectedIssues = [];

    // Get the current logged-in user ID and the user being rated
    const currentUserId = document.querySelector('[data-current-user-id]')?.dataset.currentUserId;
    const userId = document.querySelector('[data-user-id]')?.dataset.userId;

    // Check if the current user is the same as the user being rated
    const canRate = currentUserId !== userId;

    // Disable rating if the user cannot rate themselves
    if (!canRate) {
        alert("You cannot rate yourself!");
        // Optionally hide or disable the rating form
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

        const ratingData = {
            userId: userId, 
            tradeId: "507f191e810c19729de860ea",  
            rating: currentRating, 
            comment: selectedIssues.length > 0 ? selectedIssues.join(', ') : commentBox.value || "Excellent trade!" // Static comment as fallback
        };

        console.log('Sending rating data:', ratingData);  

        fetch('http://localhost:3000/ccfx/api/v1/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ratingData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit rating');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            showThankYouMessage();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit rating. Please try again.');
        });
    });

    function showThankYouMessage() {
        container.style.display = 'none';
        const thankYouMessage = document.createElement('div');
        thankYouMessage.className = 'thank-you-message';
        thankYouMessage.innerHTML = `
            <h2>Thanks for rating!</h2>
            <p>Your feedback is valuable to me.</p>
            <button id="backButton">Go Back</button>
        `;
        document.body.appendChild(thankYouMessage);

        document.getElementById('backButton').addEventListener('click', () => {
            document.body.removeChild(thankYouMessage);
            window.history.back();
        });
    }
});
