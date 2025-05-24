document.addEventListener('DOMContentLoaded', () => {
    // --- Get user data from sessionStorage ---
    const userNickname = sessionStorage.getItem('userNickname') || 'Aura Seeker';
    const userGeneration = sessionStorage.getItem('userGeneration') || 'Millennials'; // Default if not set

    // --- DOM Elements ---
    const homeButton = document.getElementById('homeButton');
    const quizQuestionNumber = document.getElementById('quizQuestionNumber');
    const quizQuestionText = document.getElementById('quizQuestionText');
    const quizOptionsContainer = document.getElementById('quizOptions');
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');
    const funFactText = document.getElementById('funFactText');

    // --- Quiz Data Structure (Manual Questions) ---
    // A simple approach for budgeting. We can expand these lists!
    const allQuizQuestions = {
        'Gen Alpha': [
            {
                question: "What's your go-to device for learning and fun?",
                options: [
                    { text: "Tablet/iPad", score: 10 },
                    { text: "Smartphone", score: 8 },
                    { text: "Laptop/PC", score: 6 },
                    { text: "TV/Console", score: 4 }
                ],
                correctScore: 10 // This is a baseline, score depends on answer
            },
            {
                question: "Your ideal playground involves:",
                options: [
                    { text: "Virtual reality games", score: 10 },
                    { text: "An indoor trampoline park", score: 8 },
                    { text: "A traditional outdoor park", score: 6 },
                    { text: "Anywhere with Wi-Fi!", score: 9 }
                ],
                correctScore: 10
            },
            {
                question: "When you hear 'content creator,' you think of:",
                options: [
                    { text: "YouTubers and TikTokers", score: 10 },
                    { text: "Vloggers on daily life", score: 8 },
                    { text: "Traditional TV producers", score: 4 },
                    { text: "Online streamers", score: 9 }
                ],
                correctScore: 10
            },
            {
                question: "Your favorite way to express yourself is:",
                options: [
                    { text: "Creating short videos/reels", score: 10 },
                    { text: "Drawing digital art", score: 8 },
                    { text: "Writing stories", score: 6 },
                    { text: "Through memes and emojis", score: 9 }
                ],
                correctScore: 10
            },
            {
                question: "Which trend are you most likely to be into?",
                options: [
                    { text: "Digital pets/avatars", score: 10 },
                    { text: "Sustainable and eco-friendly products", score: 8 },
                    { text: "STEM (Science, Tech, Engineering, Math) activities", score: 9 },
                    { text: "Interactive online learning platforms", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your snack time staple is:",
                options: [
                    { text: "Plant-based snacks", score: 9 },
                    { text: "Anything from a vending machine", score: 5 },
                    { text: "Organic fruit pouches", score: 10 },
                    { text: "Home-baked goodies", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "How do you stay connected with friends?",
                options: [
                    { text: "Video calls and online games", score: 10 },
                    { text: "Messaging apps", score: 8 },
                    { text: "In-person playdates", score: 6 },
                    { text: "Through shared online experiences", score: 9 }
                ],
                correctScore: 10
            },
            {
                question: "Your favorite story format is:",
                options: [
                    { text: "Interactive apps and games", score: 10 },
                    { text: "Short, animated videos", score: 9 },
                    { text: "Picture books", score: 7 },
                    { text: "Audiobooks", score: 6 }
                ],
                correctScore: 10
            },
        ],
        'Gen Z': [
            {
                question: "Your ideal weekend activity involves:",
                options: [
                    { text: "Scrolling TikTok/Reels for hours", score: 10 },
                    { text: "Hanging out with friends at a cafe", score: 8 },
                    { text: "Playing competitive online games", score: 9 },
                    { text: "Binge-watching a trending series", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Which describes your fashion sense best?",
                options: [
                    { text: "Thrifted and unique finds", score: 10 },
                    { text: "Streetwear and comfy aesthetics", score: 9 },
                    { text: "Fast fashion from popular brands", score: 6 },
                    { text: "Whatever's trending on social media", score: 8 }
                ],
                correctScore: 10
            },
            {
                question: "Your favorite way to consume news is:",
                options: [
                    { text: "Through memes and short videos on social media", score: 10 },
                    { text: "News aggregators or curated feeds", score: 8 },
                    { text: "Traditional news websites", score: 5 },
                    { text: "Podcasts", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "What's your stance on climate change?",
                options: [
                    { text: "Deeply concerned, actively involved in activism", score: 10 },
                    { text: "Concerned, try to make eco-friendly choices", score: 8 },
                    { text: "Aware, but not actively engaged", score: 6 },
                    { text: "I'm more focused on other issues", score: 4 }
                ],
                correctScore: 10
            },
            {
                question: "When you hear 'work-life balance', you think:",
                options: [
                    { text: "Prioritizing personal well-being over career", score: 10 },
                    { text: "Flexible hours and remote work options", score: 9 },
                    { text: "It's important, but career comes first", score: 6 },
                    { text: "A distant dream, just grind!", score: 4 }
                ],
                correctScore: 10
            },
            {
                question: "Your favorite app for communication is:",
                options: [
                    { text: "Discord or Snapchat", score: 10 },
                    { text: "Instagram DMs", score: 9 },
                    { text: "WhatsApp/iMessage", score: 7 },
                    { text: "Email/Phone calls (rarely)", score: 3 }
                ],
                correctScore: 10
            },
            {
                question: "How do you typically learn a new skill?",
                options: [
                    { text: "YouTube tutorials or online courses", score: 10 },
                    { text: "Trial and error, hands-on experience", score: 8 },
                    { text: "Reading books or articles", score: 6 },
                    { text: "Asking AI for help", score: 9 }
                ],
                correctScore: 10
            },
            {
                question: "Your preferred music genre is likely:",
                options: [
                    { text: "Hyperpop, Lo-Fi, or Indie Pop", score: 10 },
                    { text: "Mainstream Pop or Hip-Hop", score: 8 },
                    { text: "Classic Rock or Jazz", score: 3 },
                    { text: "Whatever's trending on Spotify/Apple Music", score: 9 }
                ],
                correctScore: 10
            },
        ],
        'Millennials': [
            {
                question: "Your ideal Friday night involves:",
                options: [
                    { text: "Netflix and chill with a charcuterie board", score: 10 },
                    { text: "Craft beers at a local brewery", score: 8 },
                    { text: "Going out for dinner and drinks with friends", score: 9 },
                    { text: "Trying a new DIY project", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Which of these brings back major nostalgia?",
                options: [
                    { text: "AIM, MySpace, or flip phones", score: 10 },
                    { text: "Cassette tapes and VHS", score: 6 },
                    { text: "Blockbuster Video nights", score: 8 },
                    { text: "Dial-up internet sounds", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your social media platform of choice is probably:",
                options: [
                    { text: "Instagram or Facebook", score: 10 },
                    { text: "Twitter/X", score: 8 },
                    { text: "LinkedIn (for work)", score: 7 },
                    { text: "TikTok (trying to keep up!)", score: 6 }
                ],
                correctScore: 10
            },
            {
                question: "What's your coffee order?",
                options: [
                    { text: "Elaborate latte with oat milk", score: 10 },
                    { text: "Plain black coffee", score: 7 },
                    { text: "Whatever's cheapest", score: 5 },
                    { text: "Cold brew or iced coffee", score: 9 }
                ],
                correctScore: 10
            },
            {
                question: "Your favorite way to travel is:",
                options: [
                    { text: "Booking an Airbnb for an experience", score: 10 },
                    { text: "Planning a detailed itinerary yourself", score: 8 },
                    { text: "Spontaneous road trips", score: 7 },
                    { text: "Package tours", score: 5 }
                ],
                correctScore: 10
            },
            {
                question: "Which is your favorite way to commute?",
                options: [
                    { text: "Public transport (bus/train)", score: 8 },
                    { text: "Cycling/Walking", score: 9 },
                    { text: "Driving my own car", score: 7 },
                    { text: "Ride-sharing apps", score: 10 }
                ],
                correctScore: 10
            },
            {
                question: "What's your take on houseplants?",
                options: [
                    { text: "My apartment is a jungle!", score: 10 },
                    { text: "I have a few, trying my best", score: 8 },
                    { text: "They're nice, but too much work", score: 6 },
                    { text: "What are houseplants?", score: 4 }
                ],
                correctScore: 10
            },
            {
                question: "When you hear 'adulting', you think of:",
                options: [
                    { text: "Paying bills and doing taxes", score: 10 },
                    { text: "Cooking a proper meal", score: 8 },
                    { text: "Decorating your first place", score: 9 },
                    { text: "It's a struggle!", score: 7 }
                ],
                correctScore: 10
            },
        ],
        'Gen X': [
            {
                question: "Your idea of a perfect evening is:",
                options: [
                    { text: "Watching a classic movie or TV show", score: 10 },
                    { text: "Listening to your favorite rock album", score: 9 },
                    { text: "A quiet dinner with family or close friends", score: 8 },
                    { text: "Reading a physical book", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Which tech gadget defined your youth?",
                options: [
                    { text: "Walkman/Discman", score: 10 },
                    { text: "VCR", score: 9 },
                    { text: "Corded telephone with long cord", score: 8 },
                    { text: "Early home computers (e.g., Apple II)", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your preferred news source is:",
                options: [
                    { text: "Television news channels", score: 10 },
                    { text: "Newspapers/Magazines", score: 9 },
                    { text: "Reputable online news sites", score: 8 },
                    { text: "Radio news", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "When it comes to music, you're usually listening to:",
                options: [
                    { text: "Grunge, Alternative Rock, or classic Hip-Hop", score: 10 },
                    { text: "80s Pop or New Wave", score: 9 },
                    { text: "Classic Rock", score: 8 },
                    { text: "Country or Folk", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your work ethic is best described as:",
                options: [
                    { text: "Self-reliant and independent", score: 10 },
                    { text: "Practical and resourceful", score: 9 },
                    { text: "Loyal to your employer", score: 8 },
                    { text: "Focused on results, not hours", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your go-to comfort food is likely:",
                options: [
                    { text: "Something homemade and hearty", score: 10 },
                    { text: "Pizza or a classic burger", score: 9 },
                    { text: "Cereal or a simple sandwich", score: 7 },
                    { text: "A well-made casserole", score: 8 }
                ],
                correctScore: 10
            },
            {
                question: "How do you manage your finances?",
                options: [
                    { text: "Carefully planned and budgeted", score: 10 },
                    { text: "A mix of traditional banking and online tools", score: 8 },
                    { text: "Through a financial advisor", score: 7 },
                    { text: "Keep it simple and practical", score: 9 }
                ],
                correctScore: 10
            },
            {
                question: "Your preferred vacation involves:",
                options: [
                    { text: "A relaxed beach trip or mountain cabin", score: 10 },
                    { text: "Visiting historical sites or museums", score: 8 },
                    { text: "Road tripping with family", score: 9 },
                    { text: "Cruising or an all-inclusive resort", score: 7 }
                ],
                correctScore: 10
            }
        ],
        'Baby Boomers': [
            {
                question: "Your favorite way to relax is:",
                options: [
                    { text: "Reading a physical newspaper or book", score: 10 },
                    { text: "Listening to music on the radio or stereo", score: 9 },
                    { text: "Spending time in the garden", score: 8 },
                    { text: "Watching classic movies or TV shows", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Which of these was a significant cultural event for you?",
                options: [
                    { text: "The Moon Landing", score: 10 },
                    { text: "Woodstock", score: 9 },
                    { text: "The Civil Rights Movement", score: 8 },
                    { text: "The rise of rock and roll", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your preferred method of communication is:",
                options: [
                    { text: "Phone calls (landline or mobile)", score: 10 },
                    { text: "Letters or cards", score: 8 },
                    { text: "Email", score: 7 },
                    { text: "Visiting in person", score: 9 }
                ],
                correctScore: 10
            },
            {
                question: "When it comes to financial planning, you value:",
                options: [
                    { text: "Stability and secure investments", score: 10 },
                    { text: "Saving for retirement", score: 9 },
                    { text: "Owning a home", score: 8 },
                    { text: "Leaving a legacy for your family", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your preferred type of music is often:",
                options: [
                    { text: "Classic Rock, Motown, or Folk", score: 10 },
                    { text: "Big Band or Swing", score: 8 },
                    { text: "Country music", score: 7 },
                    { text: "Jazz standards", score: 9 }
                ],
                correctScore: 10
            },
            {
                question: "Your go-to kitchen appliance for preparing meals is:",
                options: [
                    { text: "A reliable stovetop and oven", score: 10 },
                    { text: "Slow cooker or crock-pot", score: 9 },
                    { text: "Pressure cooker", score: 7 },
                    { text: "The microwave (for quick warming)", score: 6 }
                ],
                correctScore: 10
            },
            {
                question: "How do you stay informed about your community?",
                options: [
                    { text: "Local newspaper or community events", score: 10 },
                    { text: "Word of mouth from friends and neighbors", score: 9 },
                    { text: "Local TV news", score: 8 },
                    { text: "Community meetings or clubs", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your stance on current technology is:",
                options: [
                    { text: "I adapt to new tech, but prefer proven methods", score: 10 },
                    { text: "I use what's necessary, but don't obsess", score: 9 },
                    { text: "A bit overwhelmed, but try to learn", score: 8 },
                    { text: "Prefer to stick to what I know works", score: 7 }
                ],
                correctScore: 10
            }
        ],
        'Older Generation': [
            {
                question: "Your favorite pastime generally involves:",
                options: [
                    { text: "Spending time with family and telling stories", score: 10 },
                    { text: "Engaging in hobbies like gardening or crafting", score: 9 },
                    { text: "Reading or listening to the radio", score: 8 },
                    { text: "Community gatherings or social clubs", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Which historical event left the biggest impression on you?",
                options: [
                    { text: "World War II", score: 10 },
                    { text: "The Great Depression", score: 9 },
                    { text: "The post-war boom and prosperity", score: 8 },
                    { text: "Early technological advancements (e.g., first televisions)", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your preferred way to cook is:",
                options: [
                    { text: "From scratch, using traditional recipes", score: 10 },
                    { text: "Using fresh, local ingredients", score: 9 },
                    { text: "Simple, nourishing meals", score: 8 },
                    { text: "Baking homemade treats", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "What was your main source of entertainment in your youth?",
                options: [
                    { text: "Radio dramas and music", score: 10 },
                    { text: "Community dances and social events", score: 9 },
                    { text: "Going to the movies (cinema)", score: 8 },
                    { text: "Reading books and magazines", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your perspective on life is generally:",
                options: [
                    { text: "Resilient and appreciative of simple joys", score: 10 },
                    { text: "Valuing hard work and perseverance", score: 9 },
                    { text: "Optimistic and hopeful for the future", score: 8 },
                    { text: "Wise and reflective of past experiences", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "When you hear about new technologies, you think:",
                options: [
                    { text: "They're amazing, but I prefer my simpler ways", score: 10 },
                    { text: "It's interesting how much things have changed", score: 9 },
                    { text: "I'll try them if they make life easier", score: 8 },
                    { text: "Some things are too complicated now", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your approach to building relationships is:",
                options: [
                    { text: "Through personal interactions and shared experiences", score: 10 },
                    { text: "Loyalty and long-term friendships", score: 9 },
                    { text: "Being a supportive and reliable friend", score: 8 },
                    { text: "Community involvement and shared values", score: 7 }
                ],
                correctScore: 10
            },
            {
                question: "Your preferred mode of local transport used to be:",
                options: [
                    { text: "Walking or cycling", score: 10 },
                    { text: "Public streetcars or buses", score: 9 },
                    { text: "Driving a family car (if available)", score: 8 },
                    { text: "Riding a bicycle everywhere", score: 7 }
                ],
                correctScore: 10
            }
        ]
        // Add more generations and their specific questions here
    };

    // Fallback if the user's generation isn't found
    const quizQuestions = allQuizQuestions[userGeneration] || allQuizQuestions['Millennials'];

    // --- Fun Facts (Static List) ---
    const funFacts = {
        'Gen Alpha': [
            "Gen Alpha is the first generation entirely born in the 21st century!",
            "Many Gen Alphas will live to see the 22nd century.",
            "They're considered the most technologically fluent generation.",
            "Their early years are shaped by iPads and smart devices.",
            "Gen Alpha are often referred to as 'digital natives'."
        ],
        'Gen Z': [
            "Gen Z are true digital natives, having grown up with the internet.",
            "They are highly passionate about social justice and activism.",
            "TikTok is their preferred search engine for information.",
            "Gen Z values authenticity and transparency.",
            "They are known for their entrepreneurial spirit."
        ],
        'Millennials': [
            "Millennials popularized the term 'adulting'.",
            "They are often characterized by their tech-savvy and global outlook.",
            "Many Millennials faced economic challenges after graduating.",
            "They are credited with driving the 'gig economy'.",
            "Avocado toast is practically their generational mascot."
        ],
        'Gen X': [
            "Gen X are often called the 'latchkey generation'.",
            "They are known for their independence and resourcefulness.",
            "This generation birthed grunge music and MTV culture.",
            "Gen X bridged the gap between analog and digital worlds.",
            "They tend to be skeptical and pragmatic."
        ],
        'Baby Boomers': [
            "Baby Boomers experienced a post-WWII economic boom.",
            "They are known for their strong work ethic and civic engagement.",
            "This generation was at the forefront of social change movements.",
            "Rock and roll became a defining music genre for them.",
            "Many Boomers value tradition and family."
        ],
        'Older Generation': [
            "This generation witnessed incredible technological advancements in their lifetime.",
            "They often value community, hard work, and thriftiness.",
            "Many grew up without television or widespread electricity.",
            "Their stories offer a unique perspective on history.",
            "Family gatherings and traditions are often very important."
        ]
    };

    const generationFunFacts = funFacts[userGeneration] || funFacts['Millennials'];


    // --- Quiz State Variables ---
    let currentQuestionIndex = 0;
    let userAnswers = new Array(quizQuestions.length).fill(null); // Stores selected option index for each question

    // --- Functions ---

    // Function to display the current question and options
    const displayQuestion = () => {
        const questionData = quizQuestions[currentQuestionIndex];
        quizQuestionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
        quizQuestionText.textContent = questionData.question;
        quizOptionsContainer.innerHTML = ''; // Clear previous options

        questionData.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.textContent = option.text;
            button.dataset.optionIndex = index; // Store option index for easy lookup

            // If this option was previously selected, mark it
            if (userAnswers[currentQuestionIndex] === index) {
                button.classList.add('selected');
            }

            button.addEventListener('click', () => {
                // Remove 'selected' class from all options for this question
                Array.from(quizOptionsContainer.children).forEach(btn => {
                    btn.classList.remove('selected');
                });

                // Add 'selected' class to the clicked button
                button.classList.add('selected');
                userAnswers[currentQuestionIndex] = index; // Store the selected option index
            });
            quizOptionsContainer.appendChild(button);
        });

        updateNavigationButtons();
    };

    // Function to update visibility and text of navigation buttons
    const updateNavigationButtons = () => {
        // Show/hide Previous button
        if (currentQuestionIndex > 0) {
            previousButton.style.display = 'inline-block';
        } else {
            previousButton.style.display = 'none';
        }

        // Change Next button text on last question
        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextButton.textContent = 'Get Your Aura Score';
        } else {
            nextButton.textContent = 'Next';
        }
    };

    // Function to display a random fun fact with typing animation
    const displayRandomFunFact = () => {
        if (generationFunFacts.length > 0) {
            const randomIndex = Math.floor(Math.random() * generationFunFacts.length);
            const fact = generationFunFacts[randomIndex];

            // Simple typing animation (can be enhanced)
            funFactText.textContent = ''; // Clear existing text
            let i = 0;
            const typingSpeed = 30; // Milliseconds per character

            function typeWriter() {
                if (i < fact.length) {
                    funFactText.textContent += fact.charAt(i);
                    i++;
                    setTimeout(typeWriter, typingSpeed);
                }
            }
            typeWriter();
        }
    };

    // --- Aura Score Calculation Logic ---
    const calculateAuraScore = () => {
        let totalScore = 0;
        quizQuestions.forEach((question, qIndex) => {
            const selectedOptionIndex = userAnswers[qIndex];
            if (selectedOptionIndex !== null) {
                // Add the score associated with the selected option
                totalScore += question.options[selectedOptionIndex].score;
            }
        });

        // Normalize score to 1-10 range if needed, or define a max possible score
        // For simplicity, let's say each question has a max score of 10.
        // Total max score = quizQuestions.length * 10
        const maxPossibleScore = quizQuestions.length * 10;
        const auraScore = Math.round((totalScore / maxPossibleScore) * 10); // Scale to 1-10

        return Math.max(1, Math.min(10, auraScore)); // Ensure score is between 1 and 10
    };


    // --- Event Listeners ---

    // Home button click
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Previous button click
    if (previousButton) {
        previousButton.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                displayQuestion();
            }
        });
    }

    // Next / Get Your Aura Score button click
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Check if an option is selected for the current question
            if (userAnswers[currentQuestionIndex] === null) {
                alert('Please select an option before proceeding!'); // Simple alert for now
                return; // Stop execution if no option is selected
            }

            if (currentQuestionIndex < quizQuestions.length - 1) {
                currentQuestionIndex++;
                displayQuestion();
            } else {
                // Last question, calculate score and navigate to result page
                const auraScore = calculateAuraScore();
                // Store score in sessionStorage
                sessionStorage.setItem('auraScore', auraScore);
                window.location.href = 'result.html'; // We'll create this next!
            }
        });
    }

    // --- Initial Load ---
    displayQuestion(); // Display the first question when the page loads
    displayRandomFunFact(); // Display a random fun fact
});