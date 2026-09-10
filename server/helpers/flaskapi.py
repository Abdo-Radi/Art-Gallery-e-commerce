from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import OrderedDict
import os
import json
from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cosine

def encode_sentence(sentence):
    return sentence_model.encode([sentence])[0]

# Resolve relative to this file so the API works from any working directory
CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.json")
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
        # data.json is UTF-8; without this Windows falls back to cp1252 and
        # turns curly quotes into mojibake ("you’re" -> "youâ€™re").
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            cache = json.load(f)
            cache = OrderedDict(cache)  # Ensure it's an OrderedDict
            encoded_cache = OrderedDict((question, encode_sentence(question)) for question in cache.keys())
    else:
        cache = OrderedDict()

# Minimum cosine similarity before we trust a cached answer (see chat() below).
SIMILARITY_THRESHOLD = 0.55

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

    # all-MiniLM-L6-v2 scores real paraphrases lower than 0.65: "how do i reach
    # customer service" matches "How can I contact support?" at only 0.563. The
    # nearest wrong match measured ("can i return a painting" -> "Can I delete an
    # artwork?") sits at 0.540, and off-topic questions land below 0.30.
    if max_similarity > SIMILARITY_THRESHOLD:
        return jsonify({"answer": best_answer})
    else:
        return jsonify({"answer": "sry I don't know. you can ask the support for it"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
