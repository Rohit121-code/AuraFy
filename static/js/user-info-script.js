document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selection ---
    const homeButton = document.getElementById('homeButton');
    const continueButton = document.getElementById('continueButton');
    const nicknameInput = document.getElementById('nicknameInput');
    const birthYearInput = document.getElementById('birthYearInput');
    const generationDisplay = document.getElementById('generationDisplay');
    const nicknameError = document.getElementById('nicknameError');
    const birthYearError = document.getElementById('birthYearError');
    const particlesContainer = document.getElementById('particlesContainer');

    // --- Utility Functions ---

    /**
     * Handles the page transition fade-out and navigation.
     * @param {string} url - The URL to navigate to.
     */
    function fadeOutAndNavigate(url) {
        document.body.classList.add('page-fade-out');
        setTimeout(() => {
            window.location.href = url;
        }, 500); // Duration matches CSS animation
    }

    /**
     * Determines the generation based on the birth year.
     * @param {number} year - The user's birth year.
     * @returns {string} The name of the generation.
     */
    const getGeneration = (year) => {
        if (!year || isNaN(year)) return '';
        const currentYear = new Date().getFullYear();
        if (year > currentYear || year < 1920) return '';

        if (year >= 2013) return 'Gen Alpha';
        if (year >= 1997) return 'Gen Z';
        if (year >= 1981) return 'Millennial';
        if (year >= 1965) return 'Gen X';
        if (year >= 1946) return 'Baby Boomer';
        return 'Silent Generation';
    };

    // --- Validation Logic ---
    let isNicknameValid = false;
    let isYearValid = false;

    /**
     * Validates the nickname input field.
     */
    function validateNickname() {
        const nickname = nicknameInput.value.trim();
        if (nickname.length === 0) {
            nicknameError.textContent = 'Nickname cannot be empty.';
            nicknameInput.classList.add('error');
            isNicknameValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
            nicknameError.textContent = 'Letters, numbers, and underscores only.';
            nicknameInput.classList.add('error');
            isNicknameValid = false;
        } else {
            nicknameError.textContent = '';
            nicknameInput.classList.remove('error');
            isNicknameValid = true;
        }
        updateContinueButtonState();
    }

    /**
     * Validates the birth year and updates the generation display.
     */
    function validateAndDisplayGeneration() {
        const yearValue = birthYearInput.value;
        const year = parseInt(yearValue);
        const currentYear = new Date().getFullYear();

        // Clear previous state
        generationDisplay.classList.remove('animate');
        generationDisplay.textContent = '';
        birthYearError.textContent = '';
        birthYearInput.classList.remove('error');
        isYearValid = false;
        
        if (yearValue.length === 0) {
            updateContinueButtonState();
            return;
        }

        if (isNaN(year) || year < 1920 || year > currentYear) {
            birthYearError.textContent = 'Please enter a valid year (e.g., 1999).';
            birthYearInput.classList.add('error');
        } else {
            const generation = getGeneration(year);
            generationDisplay.textContent = `You're part of the ${generation} generation!`;
            // Trigger animation
            setTimeout(() => generationDisplay.classList.add('animate'), 10);
            isYearValid = true;
        }
        updateContinueButtonState();
    }
    
    /**
     * Enables or disables the continue button based on input validity.
     */
    function updateContinueButtonState() {
        if (isNicknameValid && isYearValid) {
            continueButton.disabled = false;
        } else {
            continueButton.disabled = true;
        }
    }

    // --- Event Listeners ---

    if (homeButton) {
        homeButton.addEventListener('click', () => fadeOutAndNavigate('index.html'));
    }

    if (nicknameInput) {
        nicknameInput.addEventListener('input', validateNickname);
    }

    if (birthYearInput) {
        birthYearInput.addEventListener('input', validateAndDisplayGeneration);
    }
    
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            if (!continueButton.disabled) {
                const nickname = nicknameInput.value.trim();
                const year = parseInt(birthYearInput.value);
                
                sessionStorage.setItem('userNickname', nickname);
                sessionStorage.setItem('userGeneration', getGeneration(year));

                fadeOutAndNavigate('quiz.html');
            }
        });
    }

    /**
     * Creates the particle background effect.
     */
    function createParticleSystem() {
        if (!particlesContainer) return;
        const particleCount = 25; // Fewer particles for a cleaner look on this page
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // --- Initializations ---
    createParticleSystem();
    document.body.classList.add('page-fade-in');
});
