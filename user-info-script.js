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
            window.location.href = 'index.html';
        });
    }

    // Birth year input change (for auto-detecting generation)
    if (birthYearInput && generationDisplay) {
        birthYearInput.addEventListener('input', () => {
            const year = parseInt(birthYearInput.value);
            const generation = getGeneration(year);
            generationDisplay.textContent = generation ? `Looks like you're a ${generation}!` : '';
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
                window.location.href = 'quiz.html'; // We'll create this next!
            }
        });
    }
});