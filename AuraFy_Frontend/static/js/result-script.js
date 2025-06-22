document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const nicknameDisplay = document.getElementById('nicknameDisplay');
    const generationDisplay = document.getElementById('generationDisplay');
    const auraNameElement = document.getElementById('auraName');
    const vibeScoreElement = document.getElementById('vibeScore');
    const auraDescriptionElement = document.getElementById('auraDescription');
    const homeButton = document.getElementById('homeButton');
    const restartButton = document.getElementById('restartButton');
    const shareButton = document.getElementById('shareButton');
    const exitButton = document.getElementById('exitButton');
    const styleGuideContainer = document.getElementById('style-guide-container');
    const productTypesList = document.getElementById('productTypesList');
    const colorPaletteList = document.getElementById('colorPaletteList');
    const dressingStyleText = document.getElementById('dressingStyleText');
    const backgroundStyleLink = document.getElementById('generationBackgroundStyle');
    const dynamicBgContainer = document.getElementById('dynamic-bg-container');
    
    // NEW: Modal elements
    const shareModal = document.getElementById('shareModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const shareAuraName = document.getElementById('shareAuraName');
    const shareVibeScore = document.getElementById('shareVibeScore');
    const shareToTwitter = document.getElementById('shareToTwitter');
    const shareToFacebook = document.getElementById('shareToFacebook');
    const copyForInstagram = document.getElementById('copyForInstagram');


    // --- Retrieve Data from Session Storage ---
    const userNickname = sessionStorage.getItem('userNickname') || 'Vibe Seeker';
    const userGeneration = sessionStorage.getItem('userGeneration') || 'Your Generation';
    const auraName = sessionStorage.getItem('auraName');
    const auraDescription = sessionStorage.getItem('auraDescription');
    const vibeScore = sessionStorage.getItem('vibeScore');
    const styleRecommendations = JSON.parse(sessionStorage.getItem('styleRecommendations'));

    // --- Utility Function ---
    function fadeOutAndNavigate(url) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => { window.location.href = url; }, 500);
    }
    
    // --- Dynamic Background Setup ---
    function setupBackgrounds() { /* ... unchanged ... */ }
    
    // --- Display Main Results ---
    function displayResults() {
        if (!auraName || !auraDescription || !vibeScore) {
            auraNameElement.textContent = "Error";
            auraDescriptionElement.textContent = "Could not retrieve your aura. Please try the quiz again!";
            vibeScoreElement.style.display = 'none';
            styleGuideContainer.style.display = 'none';
            return;
        }
        nicknameDisplay.textContent = userNickname;
        generationDisplay.textContent = userGeneration;
        auraNameElement.textContent = auraName;
        auraDescriptionElement.textContent = auraDescription;
        vibeScoreElement.textContent = vibeScore;
    }

    // --- Display Style Recommendations ---
    function displayStyleGuide() {
        if (!styleRecommendations) return;
        styleGuideContainer.classList.remove('hidden');
        productTypesList.innerHTML = styleRecommendations.productTypes.map(item => `<li>${item}</li>`).join('');
        colorPaletteList.innerHTML = styleRecommendations.colorPalette.map(item => `<li>${item}</li>`).join('');
        dressingStyleText.textContent = styleRecommendations.dressingStyle;
    }

    // --- Event Listeners ---
    if (homeButton) homeButton.onclick = () => fadeOutAndNavigate('/');
    if (restartButton) restartButton.onclick = () => fadeOutAndNavigate('/user-info');
    if (exitButton) exitButton.onclick = () => {
        sessionStorage.clear();
        fadeOutAndNavigate('/exit');
    };

    // --- Modal Logic ---
    if (shareButton) {
        shareButton.onclick = () => {
            // Populate modal content before showing
            shareAuraName.textContent = auraName;
            shareVibeScore.textContent = vibeScore;
            shareModal.classList.remove('hidden');
        };
    }
    
    function closeModal() {
        shareModal.classList.add('hidden');
    }

    if(closeModalButton) closeModalButton.onclick = closeModal;
    if(shareModal) shareModal.onclick = (e) => {
        // Close if user clicks on the overlay background, but not on the content
        if (e.target === shareModal) {
            closeModal();
        }
    };
    
    const shareText = `My AuraFy vibe is "${auraName}" (${vibeScore})! Find out yours. #AuraFy`;
    const shareUrl = "https://aurafy.example.com"; // Replace with your actual URL

    if (shareToTwitter) {
        shareToTwitter.onclick = () => {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank');
        };
    }

    if (shareToFacebook) {
        shareToFacebook.onclick = () => {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
            window.open(facebookUrl, '_blank');
        };
    }

    if (copyForInstagram) {
        copyForInstagram.onclick = () => {
             if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Share text copied to clipboard! Ready to paste on Instagram.');
                });
            } else {
                alert('Copying is not supported on this browser. Sorry!');
            }
        };
    }


    // --- Initial Load ---
    setupBackgrounds();
    displayResults();
    displayStyleGuide();
    document.body.style.opacity = 1;
});
