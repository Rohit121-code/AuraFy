document.addEventListener('DOMContentLoaded', () => {

    const dynamicBgContainer = document.getElementById('dynamic-bg-container');
    const returnHomeButton = document.getElementById('returnHomeButton');

    /**
     * Creates a beautiful starfield effect in the background.
     */
    function createStarfield() {
        if (!dynamicBgContainer) return;
        
        const starCount = 150; // More stars for a denser field
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            
            // Randomize animation duration and delay for a more natural twinkle
            star.style.animationDuration = `${Math.random() * 5 + 3}s`; // 3s to 8s
            star.style.animationDelay = `${Math.random() * 5}s`;
            
            dynamicBgContainer.appendChild(star);
        }
    }

    /**
     * Adds a fade-out effect before navigating to a new page.
     * @param {string} url - The URL to navigate to.
     */
    function fadeOutAndNavigate(url) {
        document.body.classList.add('page-fade-out');
        setTimeout(() => {
            window.location.href = url;
        }, 500); // Matches CSS transition duration
    }

    // --- Event Listeners ---
    if (returnHomeButton) {
        returnHomeButton.addEventListener('click', (event) => {
            // Prevent the link from navigating immediately
            event.preventDefault(); 
            // Call our function to handle the fade-out first
            fadeOutAndNavigate(returnHomeButton.href);
        });
    }

    // --- Initializations ---
    createStarfield();

});
