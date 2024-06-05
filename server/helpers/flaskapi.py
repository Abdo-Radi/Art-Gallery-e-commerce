from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import OrderedDict
import os
import json
from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cosine

def encode_sentence(sentence):
    return sentence_model.encode([sentence])[0]

CACHE_FILE = "./data.json"
cache = OrderedDict()  # OrderedDict to maintain insertion order
encoded_cache = OrderedDict()

# Specify the path to the pre-downloaded model
model_path = "sentence-transformers/all-MiniLM-L6-v2"

# Initialize SentenceTransformer model with the local path
sentence_model = SentenceTransformer(model_path)

# Function to load the cache from a JSON file and encode questions
def load_cache():
    global cache, encoded_cache
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            cache = json.load(f)
            cache = OrderedDict(cache)  # Ensure it's an OrderedDict
            encoded_cache = OrderedDict((question, encode_sentence(question)) for question in cache.keys())
    else:
        cache = OrderedDict()

app = Flask(__name__)
CORS(app)
load_cache()

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    question_embedding = encode_sentence(question)
    max_similarity = -1
    best_answer = None
    for cached_question, cached_question_embedding in encoded_cache.items():
        similarity = 1 - cosine(question_embedding, cached_question_embedding)
        if similarity > max_similarity:
            max_similarity = similarity
            best_answer = cache[cached_question]

    if max_similarity > 0.65:
        return jsonify({"answer": best_answer})
    else:
        return jsonify({"answer": "sry I don't know. you can ask the support for it"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
