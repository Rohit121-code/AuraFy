// Add this helper function at the top of your script.js, outside the DOMContentLoaded
function fadeOutAndNavigate(url) {
    document.body.classList.add('page-fade-out'); // Add fade-out class
    setTimeout(() => {
        window.location.href = url; // Navigate after animation
    }, 500); // Match this duration with your CSS animation duration (0.5s = 500ms)
}

document.addEventListener('DOMContentLoaded', () => {
    // Get references to our buttons
    const startButton = document.getElementById('startButton');
    const exitButton = document.getElementById('exitButton');

    // Add an event listener to the Start button
    if (startButton) {
        startButton.addEventListener('click', () => {
            // When clicked, navigate to the user info page
            fadeOutAndNavigate('user-info.html');
        });
    }

    // Add an event listener to the Exit button
    if (exitButton) {
        exitButton.addEventListener('click', () => {
            // Attempt to close the current window/tab
            // Note: This often requires the script to have opened the window itself for security reasons.
            // Modern browsers might prevent this if the window wasn't opened by script.
            window.close();
        });
    }
    document.body.classList.add('page-fade-in');
});