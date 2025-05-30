// result-script.js

// Function to handle page transitions with a fade-out effect
function fadeOutAndNavigate(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 500); // Matches the 0.5s transition in style.css
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Get data from sessionStorage ---
    const userNickname = sessionStorage.getItem('userNickname') || 'Mystery Seeker';
    const userGeneration = sessionStorage.getItem('userGeneration') || 'Your Generation';
    const auraScore = parseInt(sessionStorage.getItem('auraScore')) || 0; // Default to 0 if score not found

    // --- DOM Elements ---
    const homeButton = document.getElementById('homeButton');
    const exitButton = document.getElementById('exitButton'); // Get the new exit button
    const nicknameDisplay = document.getElementById('nicknameDisplay');
    const generationDisplay = document.getElementById('generationDisplay'); // Get the new generation display span
    const auraScoreDisplay = document.getElementById('auraScoreDisplay');
    const vibeTaglineDisplay = document.getElementById('vibeTaglineDisplay');
    const restartButton = document.getElementById('restartButton');
    const shareFacebookButton = document.getElementById('shareFacebook');
    const shareTwitterButton = document.getElementById('shareTwitter');
    const shareInstagramButton = document.getElementById('shareInstagram'); // Get the new Instagram button

    // New aura display elements
    const auraTypeElement = document.getElementById('auraType');
    const auraImageElement = document.getElementById('auraImage');
    const auraDescriptionElement = document.getElementById('auraDescription');
    const generationBackgroundStyleLink = document.getElementById('generationBackgroundStyle');

    // --- Apply generation-specific background CSS (similar to quiz.html) ---
    if (userGeneration) {
        let backgroundCssFile = '';
        if (userGeneration.includes('Gen Alpha')) {
            backgroundCssFile = 'gen-alpha-quiz-background.css';
        } else if (userGeneration.includes('Gen Z')) {
            backgroundCssFile = 'gen-z-quiz-background.css';
        } else if (userGeneration.includes('Millennial')) {
            backgroundCssFile = 'millennial-quiz-background.css';
        }
        // Add more else if blocks for other generations
        
        if (backgroundCssFile) {
             generationBackgroundStyleLink.href = `../static/css/${backgroundCssFile}`;
        } else {
            console.warn(`No specific background found for generation: ${userGeneration}. Using default result page background.`);
            generationBackgroundStyleLink.href = '';
        }
    } else {
        console.warn('User generation not found in sessionStorage. Using default result page background.');
        generationBackgroundStyleLink.href = '';
    }

    // --- Aura Definitions (You can customize these!) ---
    const auraDefinitions = [
        {
            name: "Fading Aura",
            scoreRange: [0, 2], // 0-2 points
            description: "Your aura is still finding its frequency. Keep exploring and discovering your true vibe!",
            image: "/static/images/aura_fading.png" // Path to your image for this aura
        },
        {
            name: "Calm Aura",
            scoreRange: [3, 5], // 3-5 points
            description: "A serene and steady energy. You're grounded and appreciate the quiet moments.",
            image: "/static/images/aura_calm.png"
        },
        {
            name: "Vibrant Aura",
            scoreRange: [6, 8], // 6-8 points
            description: "Radiant and lively! Your aura is full of energy and enthusiasm.",
            image: "/static/images/aura_vibrant.png"
        },
        {
            name: "Mystic Aura",
            scoreRange: [9, 10], // 9-10 points (max score for 5 questions with 2 points each is 10)
            description: "Enigmatic and powerful. Your aura holds deep insights and a magnetic presence.",
            image: "/static/images/aura_mystic.png"
        }
    ];

    // --- Vibe Taglines based on Aura Score (your original logic) ---
    const vibeTaglines = [
        {
            scoreRange: [0, 2],
            taglines: [
                "Your Aura is still buffering... maybe try again?",
                "Slightly confused, highly endearing. Your aura is a work in progress!",
                "You're a diamond in the rough, or perhaps just a very relaxed rock.",
                "Your vibe is 'just woke up from a long nap.' Slow and steady wins the race!"
            ]
        },
        {
            scoreRange: [3, 5],
            taglines: [
                "You're a chill vibe, navigating the modern world with quiet confidence.",
                "Your aura is giving 'comfortably existing.' Keep up the good vibes!",
                "Balanced, approachable, and probably has good taste in memes.",
                "Your energy is like a perfectly brewed cup of tea – just right!"
            ]
        },
        {
            scoreRange: [6, 8],
            taglines: [
                "Bright, buzzing, and ready for anything! Your aura is electric!",
                "You're radiating main character energy!",
                "Slightly chaotic, completely lovable. Your aura is a vibrant masterpiece!",
                "Your vibe is 'always gets the joke and probably made it'."
            ]
        },
        {
            scoreRange: [9, 10],
            taglines: [
                "You're a legendary aura! Prepare for greatness!",
                "Unstoppable, iconic, and absolutely glowing. Bow down to your aura!",
                "Your vibe is pure gold, like winning the internet!",
                "You're basically a walking supernova of awesome. Congrats!"
            ]
        }
    ];

    // Function to get a random tagline based on score
    const getVibeTagline = (score) => {
        for (const range of vibeTaglines) {
            if (score >= range.scoreRange[0] && score <= range.scoreRange[1]) {
                const randomIndex = Math.floor(Math.random() * range.taglines.length);
                return range.taglines[randomIndex];
            }
        }
        return "Your unique aura defies categorization!"; // Fallback
    };

    // Function to determine and display Aura details
    const displayAura = (score) => {
        let auraFound = false;
        for (const aura of auraDefinitions) {
            if (score >= aura.scoreRange[0] && score <= aura.scoreRange[1]) {
                auraTypeElement.textContent = aura.name;
                auraDescriptionElement.textContent = aura.description;
                auraImageElement.src = aura.image;
                auraImageElement.style.display = 'block'; // Make image visible
                auraFound = true;
                break;
            }
        }
        if (!auraFound) {
            auraTypeElement.textContent = "Undefined Aura";
            auraDescriptionElement.textContent = "We're still figuring out your unique energy. Stay tuned!";
            auraImageElement.style.display = 'none'; // Hide image if no specific aura found
        }
    };

    // --- Display information on the page ---
    nicknameDisplay.textContent = userNickname; // Set only the nickname
    generationDisplay.textContent = `${userGeneration}`; // Set only the generation in its own span
    auraScoreDisplay.textContent = auraScore;
    vibeTaglineDisplay.textContent = getVibeTagline(auraScore);
    displayAura(auraScore); // Call function to display aura type, image, and description

    // --- Event Listeners ---

    // Home Button
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            fadeOutAndNavigate('/');
        });
    }

    // Exit Button
    if (exitButton) {
        exitButton.addEventListener('click', () => {
            // Clear session storage if needed upon exit, or just navigate
            sessionStorage.clear(); // Clears all quiz data
            fadeOutAndNavigate('/'); // Navigates back to home
        });
    }

    // Restart Quiz Button
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            // Clear session storage related to the quiz if desired
            sessionStorage.removeItem('auraScore');
            sessionStorage.removeItem('userNickname');
            sessionStorage.removeItem('userGeneration');
            // Navigate back to the user info page to start fresh
            fadeOutAndNavigate('/user-info'); // Assuming user-info.html is the start of quiz
        });
    }

    // Share Buttons (Future Enhancement Placeholder)
    if (shareFacebookButton) {
        shareFacebookButton.addEventListener('click', () => {
            const currentAuraType = auraTypeElement.textContent; // Get the displayed aura type
            const shareText = `My AuraFy score is ${auraScore} and my Aura is "${currentAuraType}"! What's your vibe, ${userGeneration} fam? Find out at ${window.location.origin} #AuraFyApp #${userGeneration.replace(/\s+/g, '')} #AuraScore`;
            alert(`Sharing to Facebook: "${shareText}"`);
            console.log("Facebook Share Text:", shareText);
            // Example: window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        });
    }

    if (shareInstagramButton) {
        shareInstagramButton.addEventListener('click', () => {
            const currentAuraType = auraTypeElement.textContent;
            const shareText = `Just discovered my AuraFy: ${currentAuraType} with a score of ${auraScore}! What's your aura, ${userGeneration} fam? Link in bio! #AuraFy #AuraReveal #${userGeneration.replace(/\s+/g, '')}Vibe`;
            alert(`Sharing to Instagram: "${shareText}" (Note: Instagram sharing is more complex for web apps, typically requires a direct share feature or manual copy.)`);
            console.log("Instagram Share Text:", shareText);
            // Instagram sharing from a web app is usually more complex (requires API or manual copy/paste for users)
            // For a simple demo, you might just copy to clipboard or provide instructions.
            // window.open(`https://www.instagram.com/share?url=${encodeURIComponent(window.location.origin)}&caption=${encodeURIComponent(shareText)}`, '_blank'); // This is often not fully supported
        });
    }

    if (shareTwitterButton) {
        shareTwitterButton.addEventListener('click', () => {
            const currentAuraType = auraTypeElement.textContent; // Get the displayed aura type
            const shareText = `Just found my AuraFy score: ${auraScore} and my Aura is "${currentAuraType}"! What's your generation's vibe? ${window.location.origin} #AuraFyApp #${userGeneration.replace(/\s+/g, '')} #AuraScore`;
            alert(`Sharing to X (Twitter): "${shareText}"`);
            console.log("X (Twitter) Share Text:", shareText);
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank'); // Twitter now uses 'text' parameter for URL and text
        });
    }
    
    // Trigger initial page fade-in animation
    // document.body.classList.add('page-fade-in'); // This class is already on the body in HTML, no need to add via JS
});