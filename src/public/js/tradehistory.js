document.addEventListener("DOMContentLoaded", function() {
    const completedTab = document.getElementById('completed-tab');
    const canceledTab = document.getElementById('canceled-tab');
    const completedContent = document.getElementById('completed-content');
    const canceledContent = document.getElementById('canceled-content');

    function switchTab(tab) {
        if (tab === 'completed') {
            completedTab.classList.add('active');
            canceledTab.classList.remove('active');
            completedContent.style.display = 'block'; // Show completed content
            canceledContent.style.display = 'none';   // Hide canceled content
        } else if (tab === 'canceled') {
            completedTab.classList.remove('active');
            canceledTab.classList.add('active');
            completedContent.style.display = 'none';  // Hide completed content
            canceledContent.style.display = 'block';  // Show canceled content
        }
    }

    // Set default view
    switchTab('completed');

    completedTab.addEventListener('click', () => switchTab('completed'));
    canceledTab.addEventListener('click', () => switchTab('canceled'));
});