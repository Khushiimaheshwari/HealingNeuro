from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import pickle
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'kritika#2009'
app.config['MYSQL_DB'] = 'healing_neuro'

mysql = MySQL(app)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

# Load the trained model and vectorizer
model_filename = 'Text_analysis_model.pkl'
vectorizer_filename = 'tfidf_vectorizer.pkl'

with open(model_filename, 'rb') as file:
    model = pickle.load(file)
with open(vectorizer_filename, 'rb') as file:
    vectorizer = pickle.load(file)

# Text cleaning and preprocessing functions
def clean_text(text):
    text = re.sub(r'\d+', '', text)  # Remove digits
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = text.lower()  # Convert to lowercase
    return text

def tokenize_and_remove_stopwords(text):
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(tokens)

@app.route('/process-responses', methods=['POST'])
def process_responses():
    try:
        # Get responses from the request
        data = request.get_json()
        responses = data.get('responses', '')

        # Process each response
        responses_list = responses.split(',')
        predictions = []

        for response in responses_list:
            cleaned_text = clean_text(response.strip())
            processed_text = tokenize_and_remove_stopwords(cleaned_text)
            input_vector = vectorizer.transform([processed_text])
            label_map = {0: "No Depression", 1: "Depression"}  # Adjust label names if necessary

            prediction = model.predict(input_vector)
            prediction_prob = model.predict_proba(input_vector)

            predicted_label = label_map.get(prediction[0], "Unknown")
            depression_score = round(prediction_prob[0][1] * 100, 2)

            # Save only predicted_label and depression_score to the database
            cursor = mysql.connection.cursor()
            query = "INSERT INTO DMS_SESSION3 (predicted_label_session3, depression_score_session3) VALUES (%s, %s)"
            cursor.execute(query, (predicted_label, depression_score))
            mysql.connection.commit()
            cursor.close()

            # Add to the predictions list for the response JSON
            predictions.append({
                "predicted_label": predicted_label,
                "depression_score": depression_score
            })

        # Return response
        return jsonify({
            "message": "Responses processed and saved successfully.",
            "predictions": predictions
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
















