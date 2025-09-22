from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

# WSGI callable for Render
application = Flask(__name__)
CORS(application)

@application.route("/analyze", methods=["POST"])
def analyze_marks():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename.endswith(".csv"):
        df = pd.read_csv(file)
    elif file.filename.endswith(".xlsx"):
        df = pd.read_excel(file)
    else:
        return jsonify({"error": "Invalid file format"}), 400

    try:
        total_students = len(df)
        average_marks = df.iloc[:, 1:].mean().to_dict()
        topper_idx = df.iloc[:, 1:].sum(axis=1).idxmax()
        topper_name = df.iloc[topper_idx, 0]

        result = {
            "total_students": total_students,
            "average_marks": average_marks,
            "topper": topper_name,
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Optional home route for testing
@application.route("/")
def home():
    return "Student MarkSheet Analyzer Backend is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    application.run(host="0.0.0.0", port=port)
