// Get the form element from the HTML
const itemForm = document.getElementById('itemForm');

// Get the Bootstrap modal instance so we can programmatically close it
const reportModal = new bootstrap.Modal(document.getElementById('reportModal'));

// 1. Add an event listener to run code when the 'Submit Report' button is clicked
itemForm.addEventListener('submit', async function (event) {
    // Stop the default browser action (reloading the page)
    event.preventDefault(); 

    // Create a FormData object to easily collect all form data, including the file upload
    const formData = new FormData(itemForm); 
    
    // The endpoint is '/items' (as seen in your Network tab screenshot)
    const endpoint = '/api/items';

    try {
        // 2. The crucial fix for the 405 error: Specify method: 'POST'
        const response = await fetch(endpoint, { 
            method: 'POST', 
            // When using FormData, you don't manually set the 'Content-Type' header; 
            // the browser sets it automatically to 'multipart/form-data'.
            body: formData 
        });

        // 3. Handle the server's response
        if (response.ok) {
            // Success status (200-299)
            alert('Success! Item reported and submitted.');
            itemForm.reset();     // Clear the form fields
            reportModal.hide();   // Close the modal window
        } else {
            // Handle error status (400, 404, 405, 500, etc.)
            let errorMessage = `Submission failed with status: ${response.status}`;
            
            // Try to get a specific error message from the server response body
            try {
                const errorData = await response.text();
                if (errorData) {
                    errorMessage += `\nServer message: ${errorData.substring(0, 100)}...`; 
                }
            } catch (e) {
                // Ignore if the response body is empty or not readable
            }
            
            // Show the specific error instead of the generic one
            alert(errorMessage);
        }
    } catch (error) {
        // Handle network failure (e.g., server (127.0.0.1:5500) is down or connection issue)
        console.error('Network Error:', error);
        alert('A connection error occurred. Check if your local server (127.0.0.1:5500) is running.');
    }
});