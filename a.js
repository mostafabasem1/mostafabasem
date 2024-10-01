        function showAlert() {
            var alertBox = document.getElementById('alert-box');
            var closeButton = document.getElementById('close-btn');
            
            alertBox.style.display = 'block';
            
            // Hide the alert box after 5 seconds unless it is closed by the user
            var timeoutId = setTimeout(function() {
                if (alertBox.style.display !== 'none') {
                    alertBox.style.display = 'none';
                }
            }, 2000000);

            // When the close button is clicked
            closeButton.onclick = function() {
                alertBox.style.display = 'none';
                clearTimeout(timeoutId); // Cancel the timeout
            };
        }

        // Call the function to show the alert when the page loads
        window.onload = showAlert;
