from flask import Flask, request, jsonify
from flask_cors import CORS

from rag import get_response


app = Flask(__name__)
CORS(app)


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({
            "error": "Message is required"
        }), 400

    user_message = data["message"]

    try:
        response = get_response(user_message)

        return jsonify({
            "response": response
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Medical Chatbot API is running"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)