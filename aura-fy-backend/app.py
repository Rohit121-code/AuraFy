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
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

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

# ... (rest of your imports and setup)

@app.route('/generate_quiz_questions', methods=['POST']) # <--- CHANGED FROM GET TO POST
def generate_quiz_questions():
    try:
        # Use request.get_json() to get data from the POST request body
        data = request.get_json()
        user_generation = data.get('generation')

        if not user_generation:
            return jsonify({"error": "Generation parameter is missing from request body"}), 400

        # --- UPDATED PROMPT ---
        prompt = f"""
        Generate 5 multiple-choice quiz questions for a user belonging to the "{user_generation}" generation, focused on modern trends, technology, social media, slang, or lifestyle.
        Also, generate one interesting and short fun fact related to the "{user_generation}" generation's culture or technology usage.

        Each question should have:
        - A 'question' field (string).
        - An 'options' array, where each option is an object with:
            - 'text' (string)
            - 'score' (integer between 0 and 2, where 2 is most aligned with modern/digital/vibe culture, 0 is least aligned).
        - Keep questions and options concise.

        Provide the output as a single JSON object with two top-level keys:
        - 'questions': An array of question objects (as described above).
        - 'funFact': A string containing the generated fun fact.

        Example of desired format for the entire response:
        {{
            "questions": [
                {{
                    "question": "What does 'rizz' mean to you?",
                    "options": [
                        {{"text": "Charisma; you've got game!", "score": 2}},
                        {{"text": "A cool new app", "score": 0}},
                        {{"text": "Something about video games", "score": 0}},
                        {{"text": "It's just a sound effect", "score": 1}}
                    ]
                }}
                // ... 4 more question objects
            ],
            "funFact": "Did you know that many Gen Z-ers prefer texting to talking on the phone?"
        }}
        Make sure the entire response is a valid JSON object.
        """
        # --- END UPDATED PROMPT ---

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