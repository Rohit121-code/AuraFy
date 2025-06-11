// quiz-script.js

// Function to handle page transitions with a fade-out effect
function fadeOutAndNavigate(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 500); // Matches the 0.5s transition in style.css
}

// Ensure all DOM content is loaded before running script
document.addEventListener('DOMContentLoaded', async () => {
    // --- Retrieve User Generation for Dynamic Styling and Questions ---
    const userGeneration = sessionStorage.getItem('userGeneration');
    const generationBackgroundStyleLink = document.getElementById('generationBackgroundStyle');

    // Apply generation-specific background CSS
    if (userGeneration) {
        let backgroundCssFile = '';
        // Using `includes` for broader matching, assuming names like "Gen Z", "Gen Alpha", "Millennial" etc.
        if (userGeneration.includes('Gen Alpha')) {
            backgroundCssFile = 'gen-alpha-quiz-background.css';
        } else if (userGeneration.includes('Gen Z')) {
            backgroundCssFile = 'gen-z-quiz-background.css';
        } else if (userGeneration.includes('Millennial')) { // Added example for Millennial
            backgroundCssFile = 'millennial-quiz-background.css';
        }
        // Add more else if blocks for other generations as you create their CSS files

        if (backgroundCssFile) {
             generationBackgroundStyleLink.href = `/static/css/${backgroundCssFile}`;
        } else {
            console.warn(`No specific background found for generation: ${userGeneration}. Using default quiz page background.`);
            generationBackgroundStyleLink.href = ''; // Clear href if no specific file
        }
    } else {
        console.warn('User generation not found in sessionStorage. Using default quiz page background.');
        generationBackgroundStyleLink.href = ''; // Clear href if no generation
        // Potentially redirect to home or show an error if generation is crucial for quiz start
        fadeOutAndNavigate('/'); // Added redirect if no userGeneration
        return; // Stop further execution if no generation
    }

    // --- DOM Element References ---
    // Moved these outside the conditional to ensure they are always defined
    const homeButton = document.getElementById('homeButton');
    const questionCounter = document.querySelector('.question-counter');
    const currentQuestionNumberSpan = document.getElementById('currentQuestionNumber');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const questionTextElement = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const funFactElement = document.getElementById('funFact');
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');
    const quizContentDiv = document.querySelector('.quiz-content'); // Reference to the main content div

    // --- Quiz State Variables ---
    let currentQuestionIndex = 0;
    let userAnswers = {}; // Stores the index of the selected option for each question
    let quizQuestions = []; // This array will be populated dynamically by the AI
    let currentFunFact = ""; // Variable to hold the AI-generated fun fact

    // --- Loading Indicator Setup ---
    const loadingMessage = document.createElement('h3');
    loadingMessage.textContent = 'Generating your personalized vibe quiz...';
    // Applying styles directly as it's a dynamic element, but CSS classes are generally preferred for styling
    loadingMessage.style.color = '#00ffff';
    loadingMessage.style.textAlign = 'center';
    loadingMessage.style.marginTop = '50px';
    loadingMessage.style.animation = 'pulse 1.5s infinite alternate';
    // Append the loading message to the quizContentDiv
    quizContentDiv.appendChild(loadingMessage);


    // Hide main quiz content initially until questions are loaded
    questionCounter.style.display = 'none';
    questionTextElement.style.display = 'none';
    optionsContainer.style.display = 'none';
    funFactElement.style.display = 'none';
    previousButton.style.display = 'none';
    nextButton.style.display = 'none';


    // --- Function to display a random fun fact with typing animation ---
    const displayRandomFunFact = () => {
        if (currentFunFact) {
            funFactElement.textContent = currentFunFact;
            funFactElement.classList.remove('typing-animation'); // Remove first to ensure re-trigger
            
            // Explicitly make it visible before triggering animation
            funFactElement.style.opacity = '1';
            funFactElement.style.visibility = 'visible';

            void funFactElement.offsetWidth; // Trigger reflow
            funFactElement.classList.add('typing-animation');
            // REMOVED THE SETTIMEOUT HERE - THIS IS THE CRUCIAL CHANGE
            // The fun fact will now remain visible after typing
        } else {
            funFactElement.textContent = "No fun fact available.";
            funFactElement.classList.remove('typing-animation');
            funFactElement.style.opacity = '1'; // Ensure fallback is visible
            funFactElement.style.visibility = 'visible';
        }
    };

    // --- Core Function: Fetch Questions and Fun Fact from Flask Backend ---
    const fetchQuestionsFromAI = async () => {
        try {
            // Use POST method as per typical AI API design for sending data in body
            const response = await fetch('http://127.0.0.1:5000/generate_quiz_questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ generation: userGeneration }), // Send generation in the body
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error(`HTTP error! Status: ${response.status}`, errorDetails);
                throw new Error(`Failed to fetch questions: ${response.status} - ${errorDetails.substring(0, 100)}...`);
            }

            const data = await response.json(); // This 'data' object now contains 'questions' and 'funFact'

            if (!Array.isArray(data.questions) || data.questions.length === 0) {
                throw new Error("AI returned no questions or invalid format (missing 'questions' array).");
            }
            if (typeof data.funFact !== 'string' || data.funFact.trim() === '') {
                console.warn("AI did not return a valid fun fact. Using a fallback.");
                currentFunFact = "Fact: Your AuraFy quiz is designed to be uniquely you!"; // Fallback fun fact
            } else {
                currentFunFact = data.funFact; // Store the AI-generated fun fact
            }

            quizQuestions = data.questions; // Assign fetched questions to the main array from 'data.questions'
            totalQuestionsSpan.textContent = quizQuestions.length; // Update total questions count

            // Once questions are loaded, remove the loading message
            loadingMessage.remove();

            // Show quiz content elements
            questionCounter.style.display = 'block';
            questionTextElement.style.display = 'flex'; // Use flex as per CSS
            optionsContainer.style.display = 'flex'; // Use flex as per CSS
            funFactElement.style.display = 'block';
            // Buttons will be displayed by displayQuestion()

            displayQuestion(); // Start the quiz

        } catch (error) {
            console.error("Failed to fetch quiz questions from AI:", error);
            // Display an error message to the user on the page
            quizContentDiv.innerHTML = `<p style="color: red; text-align: center; margin-top: 50px;">Error loading quiz. Please ensure the backend server is running and try again!</p><p style="color: red; text-align: center;">Details: ${error.message}</p>`;
            // Ensure no other quiz elements are shown if there's a fatal error
            questionCounter.style.display = 'none';
            questionTextElement.style.display = 'none';
            optionsContainer.innerHTML = ''; // Clear options
            optionsContainer.style.display = 'none';
            funFactElement.style.display = 'none';
            previousButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
    };

    // --- Core Function: Display a Single Question and Options with Animations ---
    const displayQuestion = () => {
        // If all questions are answered, calculate score and navigate
        if (currentQuestionIndex >= quizQuestions.length) {
            const auraScore = calculateAuraScore();
            sessionStorage.setItem('auraScore', auraScore);
            fadeOutAndNavigate('result.html');
            return;
        }

        const questionData = quizQuestions[currentQuestionIndex];
        currentQuestionNumberSpan.textContent = currentQuestionIndex + 1;

        // 1. Reset states for new animations
        questionTextElement.classList.remove('question-animation'); // Remove to allow re-trigger
        questionTextElement.style.opacity = 0; // Hide it immediately for animation
        optionsContainer.innerHTML = ''; // Clear old options
        optionsContainer.style.opacity = 0; // Hide options container for animation
        // Ensure options don't have old animation classes
        optionsContainer.querySelectorAll('.animated-option').forEach(option => option.classList.remove('animated-option'));
        previousButton.style.display = 'none'; // Hide nav buttons initially for reveal
        nextButton.style.display = 'none';
        
        // --- IMPORTANT FUN FACT RESET FOR NEW ANIMATION ---
        funFactElement.classList.remove('typing-animation'); 
        funFactElement.textContent = ''; // Clear previous fun fact text
        funFactElement.style.opacity = 0; // Make it completely transparent
        funFactElement.style.visibility = 'hidden'; // Hide it until animation starts


        // 2. Animate Question Text In
        questionTextElement.textContent = questionData.question;
        void questionTextElement.offsetWidth; // Trigger reflow for animation to restart
        questionTextElement.classList.add('question-animation'); // Trigger question animation

        // 3. Delay for options to appear after question animation completes
        setTimeout(() => {
            optionsContainer.style.opacity = 1; // Make options container visible
            // Animate Options One by One
            questionData.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.text;
                // Store score and index in dataset for easy access later
                button.dataset.score = option.score;
                button.dataset.index = index;

                // If this option was previously selected, mark it
                if (userAnswers[currentQuestionIndex] === index) {
                    button.classList.add('selected');
                }

                // Add click event listener for option selection
                button.addEventListener('click', () => {
                    // Remove 'selected' class from all other options for this question
                    optionsContainer.querySelectorAll('.option-button').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    // Add 'selected' to the clicked button
                    button.classList.add('selected');
                    // Store the index of the selected option for the current question
                    userAnswers[currentQuestionIndex] = index;
                });

                optionsContainer.appendChild(button);

                // Add animation class with staggered delay for each option
                setTimeout(() => {
                    button.classList.add('animated-option');
                }, index * 100); // 100ms delay between each option
            });

            // 4. Delay for navigation buttons and fun fact to appear after all options animate
            setTimeout(() => {
                // Show Previous button if not on the first question
                if (currentQuestionIndex > 0) {
                    previousButton.style.display = 'inline-block';
                }
                // Always show Next button
                nextButton.style.display = 'inline-block';

                // Adjust Next button text and style for the final question
                if (currentQuestionIndex === quizQuestions.length - 1) {
                    nextButton.textContent = "Get Your Aura Score";
                    nextButton.classList.add('final-button');
                } else {
                    nextButton.textContent = "Next";
                    nextButton.classList.remove('final-button');
                }

                displayRandomFunFact(); // Show the current fun fact

            }, questionData.options.length * 100 + 300); // Wait for options to animate + a small buffer (300ms)
        }, 800); // Wait for question animation (0.8s from CSS)
    };

    // --- Event Listeners for Navigation Buttons ---
    // Ensured event listeners are set up after elements are defined
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            fadeOutAndNavigate('index.html');
        });
    }

    if (previousButton) {
        previousButton.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                displayQuestion(); // Re-render the previous question
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Ensure an option is selected before moving to the next question
            if (userAnswers[currentQuestionIndex] === undefined) {
                alert('Please select an option before proceeding!');
                return;
            }

            if (currentQuestionIndex < quizQuestions.length - 1) {
                currentQuestionIndex++;
                displayQuestion(); // Re-render the next question
            } else {
                // If it's the last question, calculate and navigate to results
                const auraScore = calculateAuraScore();
                sessionStorage.setItem('auraScore', auraScore);
                fadeOutAndNavigate('result.html');
            }
        });
    }

    // --- Function to Calculate Final Aura Score ---
    const calculateAuraScore = () => {
        let totalScore = 0;
        quizQuestions.forEach((qData, qIndex) => {
            const selectedOptionIndex = userAnswers[qIndex];
            if (selectedOptionIndex !== undefined) {
                // Safely access the score from the selected option
                if (qData.options && qData.options.length > selectedOptionIndex) {
                    totalScore += qData.options[selectedOptionIndex].score;
                } else {
                    console.warn(`Invalid option index ${selectedOptionIndex} for question ${qIndex}. Data might be malformed.`);
                }
            }
        });
        return totalScore;
    };

    // --- Initial Load: Start by Fetching Questions from AI ---
    // This is the first thing that happens when the quiz page loads
    // Only call fetchQuestionsFromAI if userGeneration is valid to prevent errors
    if (userGeneration) {
        await fetchQuestionsFromAI(); // Call the async function to start the process
    }
    
    // Trigger initial page fade-in animation
    document.body.classList.add('page-fade-in');
});