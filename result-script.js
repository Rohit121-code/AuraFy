document.addEventListener('DOMContentLoaded', () => {
    // --- Get data from sessionStorage ---
    const userNickname = sessionStorage.getItem('userNickname') || 'Mystery Seeker';
    const userGeneration = sessionStorage.getItem('userGeneration') || 'Your Generation';
    const auraScore = parseInt(sessionStorage.getItem('auraScore')) || 5; // Default to 5 if score not found

    // --- DOM Elements ---
    const nicknameDisplay = document.getElementById('nicknameDisplay');
    const auraScoreDisplay = document.getElementById('auraScoreDisplay');
    const vibeTaglineDisplay = document.getElementById('vibeTaglineDisplay');
    const restartButton = document.getElementById('restartButton');
    const shareFacebookButton = document.getElementById('shareFacebook');
    const shareTwitterButton = document.getElementById('shareTwitter');

    // --- Vibe Taglines based on Aura Score ---
    // You can adjust these thresholds and taglines to be as funny/witty as you like!
    const vibeTaglines = [
        {
            scoreRange: [1, 3], // Scores from 1 to 3
            taglines: [
                "Your Aura is still buffering... maybe try again?",
                "Slightly confused, highly endearing. Your aura is a work in progress!",
                "You're a diamond in the rough, or perhaps just a very relaxed rock.",
                "Your vibe is 'just woke up from a long nap.' Slow and steady wins the race!"
            ]
        },
        {
            scoreRange: [4, 6], // Scores from 4 to 6
            taglines: [
                "You're a chill vibe, navigating the modern world with quiet confidence.",
                "Your aura is giving 'comfortably existing.' Keep up the good vibes!",
                "Balanced, approachable, and probably has good taste in memes.",
                "Your energy is like a perfectly brewed cup of tea – just right!"
            ]
        },
        {
            scoreRange: [7, 8], // Scores from 7 to 8
            taglines: [
                "Bright, buzzing, and ready for anything! Your aura is electric!",
                "You're radiating main character energy!",
                "Slightly chaotic, completely lovable. Your aura is a vibrant masterpiece!",
                "Your vibe is 'always gets the joke and probably made it'."
            ]
        },
        {
            scoreRange: [9, 10], // Scores from 9 to 10
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

    // --- Display information on the page ---
    nicknameDisplay.textContent = `Hey ${userNickname}, your ${userGeneration} Aura is...`;
    auraScoreDisplay.textContent = auraScore;
    vibeTaglineDisplay.textContent = getVibeTagline(auraScore);

    // --- Event Listeners ---

    // Restart Quiz Button
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            // Clear session storage related to the quiz if desired
            sessionStorage.removeItem('auraScore');
            sessionStorage.removeItem('userNickname');
            sessionStorage.removeItem('userGeneration');
            // Navigate back to the home page to start fresh
            window.location.href = 'index.html';
        });
    }

    // Share Buttons (Future Enhancement Placeholder)
    if (shareFacebookButton) {
        shareFacebookButton.addEventListener('click', () => {
            const shareText = `My AuraFy score is ${auraScore}! What's your vibe, ${userGeneration} fam? Find out at #AuraFyApp #${userGeneration} #AuraScore`;
            // In a real app, you'd use Facebook's Share Dialog API
            alert(`Sharing to Facebook: "${shareText}"`);
            console.log("Facebook Share Text:", shareText);
            // window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        });
    }

    if (shareTwitterButton) {
        shareTwitterButton.addEventListener('click', () => {
            const shareText = `Just found my AuraFy score: ${auraScore}! What's your generation's vibe? #AuraFyApp #${userGeneration} #AuraScore`;
            // In a real app, you'd use Twitter's Web Intent API
            alert(`Sharing to X (Twitter): "${shareText}"`);
            console.log("X (Twitter) Share Text:", shareText);
            // window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`, '_blank');
        });
    }
});