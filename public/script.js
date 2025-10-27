// Wait for the HTML document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- Get elements from the page ---
    const itemForm = document.getElementById('itemForm');
    const itemsList = document.getElementById('itemsList');
    const filterStatus = document.getElementById('filterStatus');
    const searchBar = document.getElementById('searchBar-nav');

    // Get the Bootstrap modal instance
    const reportModal = new bootstrap.Modal(document.getElementById('reportModal'));


    // --- 1. Function to Fetch and Display All Items ---

    // This is the new function you were missing
    const fetchAndDisplayItems = async () => {
        // Get the current filter and search values
        const filterValue = filterStatus.value;
        const searchValue = searchBar.value.toLowerCase();

        try {
            const response = await fetch('/api/items'); // GET request
            if (!response.ok) {
                throw new Error(`Failed to fetch items: ${response.status}`);
            }

            const items = await response.json();

            // Clear the list before adding new items
            itemsList.innerHTML = '';

            // Filter the items based on search and status
            const filteredItems = items.filter(item => {
                const statusMatch = (filterValue === 'all') || (item.status === filterValue);
                const searchMatch = item.name.toLowerCase().includes(searchValue) ||
                                    item.description.toLowerCase().includes(searchValue) ||
                                    item.location.toLowerCase().includes(searchValue);
                return statusMatch && searchMatch;
            });

            if (filteredItems.length === 0) {
                itemsList.innerHTML = '<p class="text-center text-muted">No items match your criteria.</p>';
                return;
            }

            // Loop through each filtered item and create an HTML card for it
            filteredItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';

                // Use a placeholder if the item has no image
                const imageUrl = item.image ? item.image : 'https://via.placeholder.com/400x300.png?text=No+Image';

                // Use a badge color based on status
                const statusBadge = item.status === 'lost'
                    ? '<span class="badge bg-danger text-uppercase">Lost</span>'
                    : '<span class="badge bg-success text-uppercase">Found</span>';

                // Format date to be more readable
                const formattedDate = new Date(item.date).toLocaleDateString();

                // Create the card HTML
                itemElement.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img src="${imageUrl}" class="card-img-top" alt="${item.name}">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title fw-bold mb-0">${item.name}</h5>
                                ${statusBadge}
                            </div>
                            <p class="card-text small text-muted flex-grow-1">${item.description}</p>
                            <ul class="list-group list-group-flush small mt-auto">
                                <li class="list-group-item px-0"><i class="fas fa-map-marker-alt me-2"></i><strong>Location:</strong> ${item.location}</li>
                                <li class="list-group-item px-0"><i class="fas fa-calendar-alt me-2"></i><strong>Date:</strong> ${formattedDate} at ${item.time}</li>
                                <li class="list-group-item px-0"><i class="fas fa-envelope me-2"></i><strong>Contact:</strong> ${item.contact}</li>
                            </ul>
                        </div>
                    </div>
                `;

                itemsList.appendChild(itemElement);
            });

        } catch (error) {
            console.error('Error fetching items:', error);
            itemsList.innerHTML = '<p class="text-center text-danger">Could not load items. Please try again later.</p>';
        }
    };


    // --- 2. Your Form Submission Code (with one change) ---

    // This is your existing code
    itemForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Stop the page from reloading
        const formData = new FormData(itemForm);

        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // SUCCESS!
                itemForm.reset();     // Clear the form
                reportModal.hide();   // Close the modal

                // --- THIS IS THE KEY CHANGE ---
                // Instead of an alert, just refresh the list
                // The new item will now appear immediately!
                fetchAndDisplayItems();

            } else {
                // Handle server errors
                const errorData = await response.text();
                alert(`Submission failed: ${errorData}`);
            }
        } catch (error) {
            // Handle network errors
            console.error('Network Error:', error);
            alert('A connection error occurred. Please try again.');
        }
    });


    // --- 3. Event Listeners for Filters ---

    // Add event listeners to the filter and search bar
    filterStatus.addEventListener('change', fetchAndDisplayItems);
    searchBar.addEventListener('input', fetchAndDisplayItems);


    // --- 4. Initial Load ---

    // Fetch and display all items when the page first loads
    fetchAndDisplayItems();

});
