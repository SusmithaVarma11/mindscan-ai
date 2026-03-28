import re
import pickle
import nltk
import emoji  # NEW: Handles social media icons
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Downloads for the NLP pipeline
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Load your model and vectorizer
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
except FileNotFoundError:
    print("Error: model.pkl or vectorizer.pkl not found.")

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Custom dictionary for Youth/Social Media Slang
SLANG_DICT = {
    "ngl": "not gonna lie",
    "fr": "for real",
    "rn": "right now",
    "omw": "on my way",
    "istg": "i swear to god",
    "tbh": "to be honest"
}

def preprocess(text):
    # 1. NEW: Convert emojis to text so the model understands the sentiment
    # Example: "I am so sad 😭" becomes "I am so sad loud_crying_face"
    text = emoji.demojize(text, delimiters=(" ", " "))
    
    text = text.lower()
    
    # 2. NEW: Replace common slang with full words before cleaning
    for slang, full in SLANG_DICT.items():
        text = re.sub(rf'\b{slang}\b', full, text)

    # 3. EXISTING: Remove non-alphabetic chars (now includes space for demojized words)
    text = re.sub(r'[^a-z\s]', '', text) 
    
    words = text.split()
    
    # 4. EXISTING: Lemmatization and Stop-words
    cleaned = [lemmatizer.lemmatize(w) for w in words if w not in stop_words]
    return " ".join(cleaned)

def predict_text(text):
    if not text.strip():
        return "Neutral", 0
    
    clean = preprocess(text)
    vec = vectorizer.transform([clean])
    
    # EXISTING: Prediction and Probabilities
    prediction = model.predict(vec)[0]
    
    try:
        # Probabilities for the Confidence Score
        prob = model.predict_proba(vec).max() * 100
    except:
        prob = 95.0 
        
    return prediction, round(prob, 2)