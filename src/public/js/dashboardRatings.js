document.addEventListener('DOMContentLoaded', function () {
    // Get the user ID from the page
    const userId = document.querySelector('[data-user-id]')?.dataset.userId;
    if (!userId) {
        console.error('User ID not found on the page');
        return;
    }

    const ratingElement = document.getElementById('user-rating');
    const reviewsContainer = document.getElementById('user-reviews');
    let selectedRating = 0;

    // Fetch user ratings using the dynamically obtained user ID
    fetch(`http://localhost:3000/ccfx/api/v1/ratings/user/${userId}`)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data);
            if (data) {
                const averageRating = data.averageRating || 0;
                const ratingCount = data.ratingCount || 0;
                const ratings = data.ratings || [];

                updateStarsDisplay(averageRating, true);
                updateRatingCount(ratingCount);
                displayReviews(ratings);
            } else {
                updateStarsDisplay(0, true);
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

    function updateStarsDisplay(rating, clickable = true) {
        const starRating = Math.round(rating * 2) / 2;
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
            countElement.textContent = `(${count} rating${count !== 1 ? 's' : ''})`;
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
});
