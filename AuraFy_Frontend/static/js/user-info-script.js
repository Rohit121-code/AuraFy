function fadeOutAndNavigate(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    const homeButton = document.getElementById('homeButton');
    const continueButton = document.getElementById('continueButton');
    const nicknameInput = document.getElementById('nicknameInput');
    const birthYearInput = document.getElementById('birthYearInput');
    const generationDisplay = document.getElementById('generationDisplay');
    const nicknameError = document.getElementById('nicknameError');

    // --- Generation Detection Logic ---
    const getGeneration = (year) => {
        if (!year || isNaN(year)) {
            return ''; // No year, no generation
        }
        const currentYear = new Date().getFullYear();
        if (year > currentYear || year < 1900) { // Basic sanity check for year
            return ''; // Year is out of a reasonable range
        }

        if (year >= 2010 && year <= currentYear) { // Defining Gen Alpha (adjust end year as trend evolves)
            return 'Gen Alpha';
        } else if (year >= 1997 && year <= 2012) { // Defining Gen Z
            return 'Gen Z';
        } else if (year >= 1981 && year <= 1996) { // Defining Millennials
            return 'Millennials';
        } else if (year >= 1965 && year <= 1980) { // Defining Gen X
            return 'Gen X';
        } else if (year >= 1946 && year <= 1964) { // Defining Baby Boomers
            return 'Baby Boomers';
        } else {
            return 'Older Generation'; // Fallback for very old or very young years
        }
    };

    // --- Event Listeners ---

    // Home button click
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            fadeOutAndNavigate('/');
        });
    }

    // Birth year input change (for auto-detecting generation)
    if (birthYearInput && generationDisplay) {
        birthYearInput.addEventListener('input', () => {
        const year = parseInt(birthYearInput.value);
        let generation = '';
        const currentYear = new Date().getFullYear();
        const nickname = nicknameInput.value.trim();

        // Remove animation class before updating content, to allow re-triggering
        generationDisplay.classList.remove('animate');
        generationDisplay.textContent = ''; // Clear content first

        if (birthYearInput.value === '') {
            generationDisplay.textContent = '';
            generationDisplay.classList.remove('animate'); // Ensure no animation if empty
            return; // Exit if input is empty
        }

        if (isNaN(year) || year < 1900 || year > currentYear) {
            generationDisplay.textContent = 'Please enter a valid birth year.';
            generationDisplay.classList.remove('animate'); // No animation for error
            return;
        }

        if (currentYear - year <= 12 && currentYear - year >= 0) {
            generation = "Gen Alpha";
            generationDisplay.textContent = `You belong to Gen Alpha!`;
        } else if (year >= 1997 && year <= 2012) {
            generation = "Gen Z";
            generationDisplay.textContent = `You belong to Gen Z!`;
        } else if (year >= 1981 && year <= 1996) {
            generation = "Millennial";
            generationDisplay.textContent = `You belong to the Millennials!`;
        } else if (year >= 1965 && year <= 1980) {
            generation = "Gen X";
            generationDisplay.textContent = `You belong to Gen X!`;
        } else if (year >= 1946 && year <= 1964) {
            generation = "Baby Boomer";
            generationDisplay.textContent = `You belong to the Baby Boomers!`;
        } else if (year < 1946) {
            generation = "Silent Generation / Greatest Generation";
            generationDisplay.textContent = `You belong to the Silent Generation / Greatest Generation!`;
        }

        // Add the animation class AFTER the content is set
        if (generationDisplay.textContent !== '' && generationDisplay.textContent.includes('You belong to')) {
            generationDisplay.classList.add('animate');
        }
    });
    }

    // Continue button click (validation and navigation)
    if (continueButton && nicknameInput) {
        continueButton.addEventListener('click', () => {
            const nickname = nicknameInput.value.trim();
            const year = parseInt(birthYearInput.value);
            let isValid = true;

            // Nickname validation
            if (nickname.length === 0) {
                nicknameError.textContent = 'Nickname cannot be empty.';
                isValid = false;
            } else if (nickname.length > 8) {
                nicknameError.textContent = 'Nickname must be max 8 characters.';
                isValid = false;
            } else if (!/^[a-zA-Z0-9]+$/.test(nickname)) { // Regex to allow only alphanumeric
                nicknameError.textContent = 'No special characters or spaces allowed.';
                isValid = false;
            } else {
                nicknameError.textContent = ''; // Clear error if valid
            }

            // If all inputs are valid, proceed
            if (isValid) {
                // Store nickname and generation in sessionStorage for access on the next page
                sessionStorage.setItem('userNickname', nickname);
                sessionStorage.setItem('userGeneration', getGeneration(year));

                // Navigate to the Quiz page
                fadeOutAndNavigate('/quiz'); 
            }
        });
    }
     document.body.classList.add('page-fade-in');
});