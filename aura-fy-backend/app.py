import os
import json # Import json for parsing
from flask import Flask, request, jsonify
from flask_cors import CORS

import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# IMPORTANT: Ensure this origin matches your frontend's actual origin (e.g., http://127.0.0.1:5500)
CORS(app, resources={r"/*": {"origins": "aurafy.netlify.app"}})

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please set it in .env file.")
genai.configure(api_key=GEMINI_API_KEY)

# --- NEW: Temporary route to list available models ---
@app.route('/list_models', methods=['GET'])
def list_models():
    try:
        models = genai.list_models()
        available_models = []
        for m in models:
            # Check if the model supports generateContent
            if 'generateContent' in m.supported_generation_methods:
                available_models.append(m.name)
        return jsonify({"available_generate_content_models": available_models})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# --- END NEW TEMPORARY ROUTE ---


# Initialize the Generative Model (KEEP THIS, BUT WE MIGHT CHANGE 'gemini-pro')
# Using 'gemini-1.5-flash-latest' as it's a good balance of speed and capability
model = genai.GenerativeModel('models/gemini-1.5-flash-latest')

# ... (rest of your imports and setup, if any)

@app.route('/generate_quiz_questions', methods=['POST']) # <--- CHANGED FROM GET TO POST
def generate_quiz_questions():
    try:
        # Use request.get_json() to get data from the POST request body
        data = request.get_json()
        user_generation = data.get('generation')

        if not user_generation:
            return jsonify({"error": "Generation parameter is missing from request body"}), 400

        # --- START UPDATED PROMPT LOGIC ---
        generation_details = {
            "Gen Alpha": {
                "focus": "digital native experiences, viral trends, short-form video apps (e.g., TikTok), online games (e.g., Roblox, Minecraft), YouTube culture, unique slang, early tech adoption.",
                "examples": "skibidi toilet, 'pov', 'cap', 'rizz', influencer culture, tablet usage, online learning, gaming consoles, specific YouTube channels.",
                "avoid": "references to older social media (MySpace, early Facebook), cassette tapes, landlines, very old pop culture (80s/90s), or pre-internet concepts."
            },
            "Gen Z": {
                "focus": "social media activism, TikTok, Instagram, Snapchat, mental health awareness, authentic self-expression, side hustles, sustainable living, streaming culture, meme culture, internet slang, brand awareness (ethical/socially conscious).",
                "examples": "'simp', 'vibe check', 'it's giving...', 'cheugy', 'main character energy', e-sports, sustainable fashion, niche online communities, streaming platforms, political engagement.",
                "avoid": "references to dial-up internet, flip phones, DVD players, or 90s/early 00s nostalgia not already re-popularized by Gen Z."
            },
            "Millennial": {
                "focus": "early internet (dial-up to broadband), social media pioneers (MySpace, Facebook, Twitter), pop culture nostalgia (90s, early 00s), adulting challenges, side hustles, work-life balance, streaming services, 'peak' internet slang, avocado toast culture.",
                "examples": "'adulting', 'Netflix and Chill', 'YOLO', 'basic', 'FOMO', Buzzfeed quizzes, blogging, early iPhones, digital cameras, 'Friends' references.",
                "avoid": "slang exclusive to Gen Z/Alpha, concepts related to very recent viral trends they might not have actively participated in, or pre-80s pop culture."
            },
            "Gen X": {
                "focus": "MTV era, grunge, rise of personal computers, latchkey kids, skepticism, independent thinking, irony, cynicism, work-life integration challenges, classic rock/hip-hop, early internet adopters (but not natives).",
                "examples": "Grunge music, 80s/90s movies, early internet forums, AOL, Walkman, VCRs, 'whatever', 'as if', Blockbuster Video, early mobile phones.",
                "avoid": "modern social media specific slang, very recent viral internet trends, or complex concepts related to apps that emerged post-2010."
            },
            "Baby Boomer": {
                "focus": "post-war prosperity, civil rights movement, rock and roll, counterculture, traditional values (for some), rise of television, retirement, adapting to technology, community engagement, classic literature/films.",
                "examples": "Woodstock, Beatlemania, Vietnam War, rotary phones, 'groovy', 'far out', home computers (early), landlines, traditional media (newspapers, TV news).",
                "avoid": "any modern internet slang, social media apps, or technology beyond basic smartphones/email. Focus on their experience of tech adoption vs. native use."
            },
            "Silent Generation": {
                "focus": "Great Depression, WWII, Korean War, traditional values, duty, hard work, frugality, strong community ties, early television/radio, stoicism, respect for institutions.",
                "examples": "Radio dramas, classic Hollywood, patriotism, community gatherings, pen pals, early household appliances, the \"Golden Age\" of film.",
                "avoid": "any modern technology, internet, or pop culture. Questions should be about their historical context, values, and pre-digital life experiences."
            }
        }

        # Get specific details for the user's generation, default to a general focus if not found
        generation_info = generation_details.get(user_generation, {
            "focus": "modern trends, technology, social media, slang, or lifestyle relevant to your general age group.",
            "examples": "",
            "avoid": ""
        })

        prompt = f"""
Generate 5 distinct and engaging multiple-choice quiz questions for a user belonging to the "{user_generation}" generation.

**Question Focus:**
The questions should primarily focus on:
- **{generation_info['focus']}**
- Topics should be highly relevant and recognizable to this specific generation's cultural, technological, and social experiences.
- Aim for a mix of question types:
    - Slang/Terminology (e.g., "What does [slang] mean?")
    - Pop Culture (music, movies, TV shows, games specific to their era or modern resurfacing)
    - Technology/Social Media (apps, devices, digital habits)
    - Lifestyle/Trends (e.g., work-life, social issues, consumer habits)

**Question and Option Structure:**
Each question should have:
- A 'question' field (string).
- An 'options' array, where each option is an object with:
    - 'text' (string)
    - 'score' (integer between 0 and 2).
        - A 'score' of **2** means the option is most aligned with modern/digital/vibe culture *relevant to this generation's understanding and participation*.
        - A 'score' of **1** means the option is somewhat aligned or represents a neutral/older understanding.
        - A 'score' of **0** means the option is least aligned, incorrect, or represents a very outdated/unaware perspective *for that specific generation*.
- Keep questions and options concise and clear. Avoid ambiguity.

**Fun Fact:**
Also, generate one interesting, short, and positive fun fact related to the "{user_generation}" generation's culture, technology usage, or historical impact.

**Examples of topics for "{user_generation}" might include:** {generation_info['examples']}
**Avoid including:** {generation_info['avoid']}

**Output Format:**
Provide the entire response as a single JSON object with two top-level keys:
- 'questions': An array of question objects (as described above).
- 'funFact': A string containing the generated fun fact.

Example of desired format for the entire response (note: actual content must match '{user_generation}'):
{{
    "questions": [
        {{
            "question": "What does 'ghosting' mean in dating today?",
            "options": [
                {{"text": "Suddenly ending communication without explanation", "score": 2}},
                {{"text": "A new virtual reality game", "score": 0}},
                {{"text": "Sending a spooky text message", "score": 0}},
                {{"text": "Ignoring someone you've seen before", "score": 1}}
            ]
        }},
        {{
            "question": "Which platform is primarily known for short, viral video content?",
            "options": [
                {{"text": "TikTok", "score": 2}},
                {{"text": "Facebook", "score": 0}},
                {{"text": "LinkedIn", "score": 0}},
                {{"text": "YouTube (long-form)", "score": 1}}
            ]
        }}
        // ... 3 more question objects
    ],
    "funFact": "Did you know that many Gen Z-ers prefer texting to talking on the phone?"
}}
Make sure the entire response is a valid JSON object.
"""
        # --- END UPDATED PROMPT LOGIC ---

        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.95,
                top_k=40,
            )
        )

        generated_text = response.text.strip()

        # Handle markdown wrapping if Gemini adds it
        if generated_text.startswith("```json") and generated_text.endswith("```"):
            generated_text = generated_text[len("```json"):-len("```")].strip()
        elif generated_text.startswith("```") and generated_text.endswith("```"):
            generated_text = generated_text[len("```"):-len("```")].strip()

        # Parse the entire response as a JSON object
        quiz_data = json.loads(generated_text)

        # Validate the structure
        if "questions" not in quiz_data or not isinstance(quiz_data["questions"], list):
            raise ValueError("AI response missing 'questions' array or invalid format.")
        if "funFact" not in quiz_data or not isinstance(quiz_data["funFact"], str):
            # If funFact is missing or not a string, provide a default
            quiz_data["funFact"] = f"Did you know: {user_generation} are known for their unique perspectives!"


        return jsonify(quiz_data)

    except Exception as e:
        print(f"Error generating content or parsing JSON: {e}")
        print(f"Gemini raw response text: {response.text if 'response' in locals() else 'N/A'}")
        return jsonify({"error": "Failed to generate questions or fun fact", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)