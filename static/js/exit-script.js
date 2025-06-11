// exit-script.js

document.addEventListener('DOMContentLoaded', () => {
    // This script can be used for any specific animations or behaviors
    // that you might want on the exit page.

    // For now, it primarily ensures the fade-in class is applied
    // to trigger the page transition.
    document.body.classList.add('page-fade-in');

    // If you had any dynamic content or interactive elements on the exit page,
    // their logic would go here. For a simple thank you page, this might be minimal.

    // The "Return to Home" button's navigation is handled directly in exit.html
    // using an <a> tag with href="index.html".
    // If you needed a JS-driven fadeOut, you could add it here:
    /*
    const returnHomeButton = document.querySelector('.cta-button');
    if (returnHomeButton) {
        returnHomeButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            document.body.classList.remove('page-fade-in'); // Remove fade-in
            document.body.classList.add('page-fade-out'); // Add fade-out
            setTimeout(() => {
                window.location.href = returnHomeButton.href; // Navigate after fade-out
            }, 500); // Match CSS transition time
        });
    }
    */
});