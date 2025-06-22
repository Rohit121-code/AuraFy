document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selection ---
    const homeButton = document.getElementById('homeButton');
    const quizContainer = document.getElementById('quiz-container');
    const loadingState = document.getElementById('loadingState');
    const quizState = document.getElementById('quizState');
    const questionCounterSpan = document.getElementById('questionCounter');
    const progressBar = document.getElementById('progressBar');
    const questionTextElement = document.getElementById('questionText');
    const funFactElement = document.getElementById('funFact');
    const optionsContainer = document.getElementById('optionsContainer');
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');
    const backgroundStyleLink = document.getElementById('generationBackgroundStyle');
    const dynamicBgContainer = document.getElementById('dynamic-bg-container');

    // --- Quiz State ---
    const userGeneration = sessionStorage.getItem('userGeneration');
    let allQuestions = [];
    let userAnswers = {}; // Stores selected option TEXT for each question index
    let currentQuestionIndex = 0;

    // --- Utility Functions ---
    function fadeOutAndNavigate(url) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    // --- Dynamic Background Setup ---
    function setupBackgrounds() {
        if (!userGeneration) {
            fadeOutAndNavigate('index.html');
            return;
        }
        let cssFile = '', needsJsEffects = 'default';
        if (userGeneration.includes('Gen Z')) {
            cssFile = 'gen-z-quiz-background.css';
            needsJsEffects = 'gen-z';
        } else if (userGeneration.includes('Gen Alpha')) {
            cssFile = 'gen-alpha-quiz-background.css';
            needsJsEffects = 'gen-alpha';
        }

        if (cssFile) backgroundStyleLink.href = `/static/css/${cssFile}`;
        if (needsJsEffects === 'default') createStarfield();
        if (needsJsEffects === 'gen-z') createDigitalRain();
        if (needsJsEffects === 'gen-alpha') createGooeyBlobs();
    }

    // --- Background Effects Creators (unchanged) ---
    function createStarfield() {
        if (!dynamicBgContainer) return;
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            dynamicBgContainer.appendChild(star);
        }
    }

    function createDigitalRain() {
        if (!dynamicBgContainer) return;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        setInterval(() => {
            if (document.hidden) return; // Pause if tab is not visible
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.animationDuration = `${Math.random() * 2 + 3}s`;
            drop.textContent = chars[Math.floor(Math.random() * chars.length)];
            dynamicBgContainer.appendChild(drop);
            setTimeout(() => drop.remove(), 5000);
        }, 100);
    }

    function createGooeyBlobs() {
        if (!dynamicBgContainer) return;
        for(let i=0; i < 4; i++){
            const blob = document.createElement('div');
            blob.className = 'gooey-blob';
            dynamicBgContainer.appendChild(blob);
        }
    }

    // --- Quiz Logic ---
    async function fetchQuiz() {
        try {
            const response = await fetch('http://127.0.0.1:5000/generate_quiz_questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ generation: userGeneration }),
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            if (!data.questions || data.questions.length === 0) throw new Error('Invalid quiz data from server.');

            allQuestions = data.questions;
            loadingState.style.display = 'none';
            quizState.classList.remove('hidden');
            displayQuestion();
        } catch (error) {
            console.error("Failed to fetch quiz:", error);
            loadingState.innerHTML = `<p style="color:red;">Error loading quiz. Please try again later.</p>`;
        }
    }

    function displayQuestion() {
        if (currentQuestionIndex >= allQuestions.length) return;
        const questionData = allQuestions[currentQuestionIndex];
        
        quizState.classList.add('animate-out');

        setTimeout(() => {
            questionCounterSpan.textContent = `Question ${currentQuestionIndex + 1} of ${allQuestions.length}`;
            progressBar.style.width = `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`;
            questionTextElement.textContent = questionData.question;
            funFactElement.textContent = questionData.funFact;
            
            optionsContainer.innerHTML = '';
            questionData.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = option.text;
                button.dataset.index = index;
                // Check against the stored text of the answer
                if (userAnswers[currentQuestionIndex] === option.text) {
                    button.classList.add('selected');
                }
                button.onclick = () => selectOption(option.text, index);
                optionsContainer.appendChild(button);
            });
            updateNavButtons();
            
            quizState.classList.remove('animate-out');
            quizState.classList.add('animate-in');
            setTimeout(() => quizState.classList.remove('animate-in'), 600);
        }, 400);
    }

    function selectOption(selectedText, selectedIndex) {
        // Storing the answer text instead of the index
        userAnswers[currentQuestionIndex] = selectedText; 
        const buttons = optionsContainer.querySelectorAll('.option-button');
        buttons.forEach((btn, index) => {
            btn.classList.toggle('selected', index === selectedIndex);
        });
        nextButton.disabled = false;
    }

    function updateNavButtons() {
        previousButton.style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
        nextButton.disabled = userAnswers[currentQuestionIndex] === undefined;
        nextButton.textContent = (currentQuestionIndex === allQuestions.length - 1) ? 'Get Your Aura' : 'Next';
        nextButton.classList.toggle('final', currentQuestionIndex === allQuestions.length - 1);
    }

    function handleNext() {
        if (currentQuestionIndex < allQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            // NEW: Fetch final result from AI instead of calculating score
            fetchAuraResultFromAI();
        }
    }

    // --- NEW: Function to get the final result from the AI ---
    async function fetchAuraResultFromAI() {
        // Show a final analyzing state
        quizState.style.display = 'none';
        loadingState.style.display = 'block';
        loadingState.querySelector('p').textContent = 'Analyzing your vibe... This is the deep stuff.';

        const payload = {
            generation: userGeneration,
            answers: allQuestions.map((q, index) => ({
                question: q.question,
                answer: userAnswers[index] || "No answer given" // Send question and answer text
            }))
        };
        
        try {
            const response = await fetch('http://127.0.0.1:5000/calculate_aura', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to get aura result from server.');
            
            const resultData = await response.json();

            // Store the AI-generated result in sessionStorage
            sessionStorage.setItem('auraName', resultData.auraName);
            sessionStorage.setItem('auraDescription', resultData.auraDescription);
            sessionStorage.setItem('vibeScore', resultData.vibeScore);
            sessionStorage.setItem('styleRecommendations', JSON.stringify(resultData.styleRecommendations));
            
            fadeOutAndNavigate('result.html');

        } catch (error) {
            console.error("Error fetching aura result:", error);
            loadingState.innerHTML = `<p style="color:red;">Could not determine your aura. The vibe is off. Please try again.</p>`;
        }
    }

    function handlePrev() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    }

    // --- Initial Setup ---
    if(homeButton) homeButton.onclick = () => fadeOutAndNavigate('index.html');
    nextButton.onclick = handleNext;
    previousButton.onclick = handlePrev;
    
    setupBackgrounds();
    fetchQuiz();
});
