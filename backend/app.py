from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger
import pandas as pd
import os

app = Flask(__name__)
CORS(app)
swagger = Swagger(app)

@app.route('/analyze', methods=['POST'])
def analyze_data():
  if 'file' not in request.files:
    return jsonify({'error': 'No file part'}), 400
  file = request.files['file']
  if file.filename.endswith('.csv'):
    df = pd.read_csv(file)
  elif file.filename.endswith('.xlsx'):
    df = pd.read_excel(file)
  else:
    return jsonify({'error':" Unsupported file type"}), 400

  try:
    total_students=len(df)
    average_marks=df.iloc[:,1:].mean().to_dict()
    topper=df.iloc[:,1:].sum(axis=1).idxmax()
    topper_name=df.iloc[topper,0]
    results={
      'total_students': total_students,
      'average_marks': average_marks,
      'topper': topper_name
    }
    return jsonify(results)
  except Exception as e:
    return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
  port = int(os.environ.get("PORT", 5000))  # use Render's port or default 5000
  app.run(host="0.0.0.0", port=port)
