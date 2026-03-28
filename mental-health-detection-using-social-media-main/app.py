from pathlib import Path
from flask import Flask, jsonify, redirect, request, send_from_directory, url_for
from flask_cors import CORS # Added for React dev mode flexibility
from model import predict_text

app = Flask(__name__)
CORS(app) # Ensures React can always talk to Flask during development

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST_DIR = BASE_DIR / 'frontend' / 'dist'

# --- HELPER LOGIC ---

def calculate_wellness(sentiment, confidence):
    """
    Calculates a youth-centric wellness score.
    Higher confidence in negative sentiment lowers the overall score.
    """
    # Remove '%' sign and convert to float for math
    conf_val = float(str(confidence).replace('%', ''))
    
    score = 75 # Starting neutral point
    if sentiment in ["Depression", "Anxiety", "Sad"]:
        # Penalty based on certainty of negative state
        score = max(10, int(100 - (conf_val * 0.85)))
    elif sentiment == "Happy":
        # Bonus based on certainty of positive state
        score = min(100, int(75 + (conf_val * 0.25)))
    
    return score

# --- API ROUTES ---

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json or {}
    username = data.get('username', '')
    password = data.get('password', '')

    if username == 'admin' and password == 'password123':
        return jsonify({'success': True})

    return jsonify({
        'success': False,
        'error': 'Invalid credentials. Please use admin / password123'
    }), 401

@app.route('/api/analyze', methods=['POST'])
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json or {}
    user_text = data.get('text', '')

    # Get sentiment and raw confidence from model.py
    sentiment, confidence = predict_text(user_text)
    
    # Calculate the new Wellness Metric for youth social media focus
    wellness_score = calculate_wellness(sentiment, confidence)

    color_map = {
        "Depression": "#ef4444", # Modern tailwind red-500
        "Anxiety": "#f59e0b",    # Modern tailwind amber-500
        "Sad": "#f87171",        # Modern tailwind red-400
        "Happy": "#10b981",      # Modern tailwind emerald-500
        "Neutral": "#ffffff"
    }

    result_color = color_map.get(sentiment, "#ffffff")

    return jsonify({
        'prediction': sentiment,
        'confidence': f"{confidence}%",
        'wellness': wellness_score, # New feature sent to React
        'color': result_color
    })

@app.route('/logout')
def logout():
    return redirect(url_for('serve_frontend', path=''))

# --- FRONTEND ROUTES (For Production Build) ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if FRONTEND_DIST_DIR.exists():
        target = FRONTEND_DIST_DIR / path
        if path and target.exists() and target.is_file():
            return send_from_directory(FRONTEND_DIST_DIR, path)
        return send_from_directory(FRONTEND_DIST_DIR, 'index.html')

    return jsonify({
        'message': 'Frontend build not found.',
        'next_step': 'Run `npm install` then `npm run build` in `frontend/`.'
    }), 503

if __name__ == '__main__':
    app.run(port=5009, debug=True)