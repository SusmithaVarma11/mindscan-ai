import pickle
import re

model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text

def predict_text(text):
    clean = preprocess(text)
    vec = vectorizer.transform([clean])
    prediction = model.predict(vec)[0]
    return prediction