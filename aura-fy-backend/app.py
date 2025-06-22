import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
# from openai import AzureOpenAI  # Kept for your reference
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Make sure your frontend's origin is listed here if it's different
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500", "http://localhost:5500"]}})

# --- Azure OpenAI Configuration (Restored as commented out) ---
# AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
# AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
# AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-01")
# AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_DEPLOYMENT_NAME")
#
# if not all([AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_DEPLOYMENT_NAME]):
#     raise ValueError("Azure OpenAI configuration incomplete. Please check your .env file.")
#
# azure_client = AzureOpenAI(
#     azure_endpoint=AZURE_OPENAI_ENDPOINT,
#     api_key=AZURE_OPENAI_API_KEY,
#     api_version=AZURE_OPENAI_API_VERSION
# )

# --- Gemini Configuration (Enabled) ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please set it in your .env file.")

# Configure the Gemini client
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-1.5-flash-latest')


@app.route('/generate_quiz_questions', methods=['POST'])
def generate_quiz_questions():
    """
    Generates a quiz using the selected Gemini model.
    """
    try:
        data = request.get_json()
        user_generation = data.get('generation')

        if not user_generation:
            return jsonify({"error": "Generation parameter is missing from request body"}), 400

        # Restored your original, more detailed generation_details
        generation_details = {
            "Gen Alpha": {
                "focus": "iPad kids culture, Skibidi Toilet phenomenon, Roblox drama, YouTube Kids rabbit holes, tablet parenting, sus behavior, Ohio memes, cringe compilations",
                "humor_examples": "choosing Fortnite over homework, explaining memes to confused parents, tablet withdrawal symptoms, Roblox relationship drama, YouTube autoplay disasters",
                "relatable_scenarios": "when the WiFi goes down, trying to explain 'sus' to grandparents, Roblox currency being more valuable than real money",
                "avoid": "references to older social media, anything pre-smartphone era"
            },
            "Gen Z": {
                "focus": "TikTok algorithms controlling life, LinkedIn influencer cringe, adulting failures, therapy speak in casual conversation, side hustle culture, climate anxiety",
                "humor_examples": "using TikTok for life advice, turning trauma into content, calling everything 'unhinged', LinkedIn influencers posting gym selfies with business advice",
                "relatable_scenarios": "when your FYP knows you better than your friends, explaining why you can't afford a house with 'just work harder' advice, using therapy terms to describe minor inconveniences",
                "avoid": "dial-up internet, landlines, anything too millennial-coded"
            },
            "Millennial": {
                "focus": "adulting is a scam, avocado toast jokes, existential dread about retirement, Disney+ nostalgia binges, side hustle exhaustion, wine mom culture emerging",
                "humor_examples": "still using Facebook like it's 2008, explaining TikTok to Gen X parents, career pivots every 2 years, treating Target like therapy",
                "relatable_scenarios": "when you realize you're closer to 40 than 20, kids not knowing what a DVD is, your back hurting from sleeping wrong",
                "avoid": "too much Gen Z slang, pre-internet nostalgia that's too boomer-coded"
            },
            "Gen X": {
                "focus": "forgotten middle child syndrome, peak MTV nostalgia, eye-rolling at younger generations, technology adoption struggles, work-life balance mythbusting",
                "humor_examples": "teaching millennials what 'real music' sounds like, confused by TikTok dances, still having a landline 'just in case'",
                "relatable_scenarios": "when kids don't understand why you loved Blockbuster, explaining why grunge was actually deep, being the tech support for both parents and kids",
                "avoid": "modern social media slang, very recent viral trends"
            },
            "Baby Boomer": {
                "focus": "Facebook conspiracy theories, grandparent spoiling rights, technology confusion, retirement reality vs expectations, trying to understand modern culture",
                "humor_examples": "posting minion memes unironically, asking why everything needs an app, calling tech support for password resets",
                "relatable_scenarios": "when you accidentally like someone's photo from 2019, trying to figure out streaming services, explaining 'back in my day' stories",
                "avoid": "any internet slang, social media beyond Facebook basics"
            },
            "Silent Generation": {
                "focus": "bewilderment at modern technology, stories that start with 'during the war', strong opinions about manners, frugality as an art form",
                "humor_examples": "saving plastic containers 'just in case', having strong opinions about thank-you notes, calling all gaming systems 'Nintendo'",
                "relatable_scenarios": "when you see grocery prices now, watching people stare at phones all day, trying to understand why everyone needs so many coffee choices",
                "avoid": "any modern technology, internet culture, post-1990s references"
            }
        }

        generation_info = generation_details.get(user_generation, {
            "focus": "general life experiences and cultural touchstones",
            "humor_examples": "",
            "relatable_scenarios": "",
            "avoid": ""
        })

        # The prompt to generate the quiz questions
        prompt = f"""
        You are AuraBot 9000, an unhinged, terminally-online meme lord who ghostwrites viral quizzes. Your goal is to create a quiz that feels so personalized it's slightly psychic.
        **Step 1: Internal Monologue (Your Thought Process).**
        First, embody the soul of a "{user_generation}".
        Second, brainstorm 3 core 'pillars' of their current experience (e.g., for Gen Z: 'The Hustle Delusion', 'Therapy-to-English Dictionary', 'Digital Brain Rot').
        Third, draft 5 unique, hilarious question concepts based on these pillars. For each concept, also draft a unique, roast-style fun fact related to that specific question's theme.
        **Step 2: Write the Quiz (Your Output).**
        Generate the quiz using the strict guidelines below.
        **HUMOR STYLE GUIDELINES:**
        - **Hyper-Specific, Not Generic:** Instead of "scrolling on their phone," write "getting lost in a 4-hour TikTok rabbit hole that started with a recipe and somehow ended on flat-earth conspiracies." Specificity is key.
        - **Self-Deprecating & Uncomfortably Relatable:** The user should laugh and then say, "Ouch, wait... that's me."
        **MANDATORY QUESTION & ANSWER STRUCTURE:**
        - You must generate exactly 5 questions.
        - **Each question object MUST contain a unique "funFact" string.** This fun fact should be a 'micro-roast' related to the question's topic.
        - Each question must have exactly 4 options with scores.
        **AVOID:** Anything from this list: {generation_info['avoid']}
        **CRITICAL OUTPUT FORMAT:**
        You MUST return ONLY a valid JSON object. Do not include "```json" or any other text outside the curly braces.
        Example structure:
        {{
            "questions": [
                {{
                    "question": "What's your most {user_generation} way of avoiding adult responsibilities?",
                    "funFact": "The {user_generation} urge to start a new, elaborate organization system instead of doing the one task they're avoiding.",
                    "options": [
                        {{"text": "[Hilariously specific 'Too Real' avoidance tactic]", "score": 2}},
                        {{"text": "[The productive 'Aspirational' thing they lie about doing]", "score": 1}},
                        {{"text": "[The unhinged 'Chaotic Neutral' choice]", "score": 1}},
                        {{"text": "[The funny 'Red Herring' from another generation]", "score": 0}}
                    ]
                }}
            ]
        }}
        """
        generation_config = genai.types.GenerationConfig(
            response_mime_type="application/json",
            temperature=0.9,
            top_p=0.95
        )
        
        response = model.generate_content(
            prompt,
            generation_config=generation_config
        )
        
        quiz_data = json.loads(response.text)
        
        if "questions" not in quiz_data or not isinstance(quiz_data["questions"], list):
            raise ValueError("AI response missing 'questions' array.")
        for i, q in enumerate(quiz_data["questions"]):
            if "funFact" not in q or not isinstance(q["funFact"], str):
                 q["funFact"] = f"A fun fact about {user_generation} is that they are full of surprises!"

        return jsonify(quiz_data)

    except Exception as e:
        print(f"Error generating quiz: {e}")
        return jsonify({"error": "Failed to generate quiz.", "details": str(e)}), 500


@app.route('/calculate_aura', methods=['POST'])
def calculate_aura():
    """
    Calculates the final aura AND generates a personalized style guide.
    """
    try:
        data = request.get_json()
        user_generation = data.get('generation')
        user_answers = data.get('answers')

        if not all([user_generation, user_answers]):
            return jsonify({"error": "Missing generation or answers in request"}), 400

        answer_summary = "\n".join([f"Q: {item['question']}\nA: {item['answer']}" for item in user_answers])

        # --- THE MODIFICATION: Prompt is updated to request style recommendations ---
        prompt = f"""
        You are a Vibe Analyst and a cutting-edge fashion consultant for "{user_generation}".
        Based on the user's answers, determine their "Aura" and generate a personalized style guide.

        **User's Answers:**
        {answer_summary}

        **Your Task:**
        1.  **Aura Name:** Create a hilarious, modern, meme-worthy name for their vibe.
        2.  **Aura Description:** Write a funny, one-paragraph "loving roast" description of the aura.
        3.  **Assign a Vibe Score:** Create a score using modern internet slang. The format is CRITICAL. It MUST start with a '+' sign, followed by a number composed *exclusively* of the digit 9 (e.g., +9, +99, +999, +9999). It MUST end with a single, relevant slang word.
            - **Vibe Score Examples:** "+999 Unhinged", "+9 Respect", "+9999 Based", "+99 Cringe".
        4.  **Style Recommendations:** Generate a style guide based on their aura. This guide must include:
            - `productTypes`: An array of 3-4 strings (e.g., ["Oversized hoodie", "Cargo pants", "Beanie"]).
            - `colorPalette`: An array of 3-4 strings describing the color scheme (e.g., ["Earthy tones", "Neon green accents", "Washed-out black"]).
            - `dressingStyle`: A short paragraph describing the overall style philosophy.

        **CRITICAL OUTPUT FORMAT:**
        Return ONLY a valid JSON object.

        Example Response:
        {{
            "auraName": "Low-Key Main Character",
            "auraDescription": "You navigate life with a cinematic soundtrack playing in your head, romanticizing the daily grind...",
            "vibeScore": "+999 Delulu",
            "styleRecommendations": {{
                "productTypes": ["Vintage band t-shirt", "Perfectly worn-in jeans", "Docs or Converse", "A tote bag for emotional baggage"],
                "colorPalette": ["Monochrome black & white", "A single pop of color", "Faded denim blue"],
                "dressingStyle": "Your style is effortlessly cool, curated to look like you didn't try, but we all know you did. It's about telling a story with every piece, suggesting a rich inner life that probably involves a secret Spotify playlist for every mood."
            }}
        }}
        """

        generation_config = genai.types.GenerationConfig(
            response_mime_type="application/json",
            temperature=0.85
        )

        response = model.generate_content(prompt, generation_config=generation_config)
        aura_result = json.loads(response.text)

        # Validation for the new structure
        if not all(k in aura_result for k in ["auraName", "auraDescription", "vibeScore", "styleRecommendations"]):
            raise ValueError("AI response is missing required keys.")

        return jsonify(aura_result)

    except Exception as e:
        print(f"Error calculating aura: {e}")
        return jsonify({"error": "Failed to calculate aura.", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
