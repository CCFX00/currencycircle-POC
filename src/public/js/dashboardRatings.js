document.addEventListener('DOMContentLoaded', function () {
    // Get the user ID from the page
    const userId = document.querySelector('[data-user-id]')?.dataset.userId;
    if (!userId) {
        console.error('User ID not found on the page');
        return;
    }

    const ratingElement = document.getElementById('user-rating');
    const reviewsContainer = document.getElementById('user-reviews');
    const reportCountElement = document.querySelector('[data-user-reported]');
    let selectedRating = 0;

    // Fetch user ratings using the dynamically obtained user ID
    fetch(`http://localhost:3000/ccfx/api/v1/ratings/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                const averageRating = data.averageRating || 0;
                const ratingCount = data.ratingCount || 0;
                const ratings = data.ratings || [];
                const userData = data.userData || {};

                updateStarsDisplay(averageRating);
                updateRatingCount(ratingCount);
                displayReviews(ratings);
                updateUserInfo(userData);
            } else {
                updateStarsDisplay(0);
                updateRatingCount(0);
                displayReviews([]);
            }
        })
        .catch(error => {
            console.error('Error fetching ratings:', error);
            if (ratingElement) {
                ratingElement.innerHTML = 'Error loading ratings';
            }
        });

    // Fetch the times reported count
    fetch(`http://localhost:3000/ccfx/api/v1/check-report/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch report count: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const timesReported = data.reportCount || 0; // Adjust to access the reportCount

            // Inject the reported times into the template
            if (reportCountElement) {
                reportCountElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${timesReported} Time(s) Reported`;
            }
        })
        .catch(error => {
            console.error('Error fetching times reported:', error);
            if (reportCountElement) {
                reportCountElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Unable to load report count`;
            }
        });

    function updateStarsDisplay(rating) {
        const starRating = Math.round(rating * 2) / 2; // Rounding to nearest 0.5
        ratingElement.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const starSpan = document.createElement('span');
            starSpan.innerHTML = i <= starRating ? '★' : '☆';
            ratingElement.appendChild(starSpan);
        }
    }

    function updateRatingCount(count) {
        const countElement = document.querySelector('.rating-count');
        if (countElement) {
            countElement.textContent = `(${count} review${count !== 1 ? 's' : ''})`;
        }
    }

    function displayReviews(ratings) {
        if (!reviewsContainer) return;

        if (ratings && ratings.length > 0) {
            const reviewsList = document.createElement('ul');
            ratings.forEach(rating => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <p><strong>Rating:</strong> ${rating.rating} stars</p>
                    <p><strong>Comment:</strong> ${rating.comment || 'No comment'}</p>
                `;
                reviewsList.appendChild(li);
            });
            reviewsContainer.innerHTML = '';
            reviewsContainer.appendChild(reviewsList);
        } else {
            reviewsContainer.innerHTML = '<p>No reviews available.</p>';
        }
    }

    function updateUserInfo(userData) {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && userData && userData.userName) {
            userNameElement.textContent = userData.userName;
        }
    }
});
