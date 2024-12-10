from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import pickle
import pandas as pd

# Initialize Flask application
app = Flask(__name__)

# Configure MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'kritika#2009'
app.config['MYSQL_DB'] = 'healing_neuro'

mysql = MySQL(app)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

# Load the trained model
model_filename = 'Rating_analysis_model.pkl'

with open(model_filename, 'rb') as file:
    model = pickle.load(file)

# Define the response mapping for input preprocessing
response_map = {
    "Never": 0,
    "Some of the time": 1,
    "Most of the time": 2,
    "Nearly all the times": 3
}

@app.route('/process-responses', methods=['POST'])
def process_responses():
    try:
        # Get responses from the request
        data = request.get_json()
        responses = data.get('responses', {})  # Input is expected as a dictionary

        # Convert responses to a DataFrame
        df = pd.DataFrame([responses])
        
        # Map the categorical responses to numeric values
        for column in df.columns:
            if column in response_map:
                df[column] = df[column].map(response_map)

        # Ensure the input data matches the expected structure
        required_columns = model.feature_names_in_
        if set(df.columns) != set(required_columns):
            return jsonify({"error": "Invalid input format"}), 400
        
        # Make predictions
        prediction = model.predict(df)
        depression_status = "Depressed" if prediction[0] == 1 else "Not Depressed"
        depression_score = None  # GaussianNB doesn't provide prediction probabilities directly

        # Save prediction result to the database
        cursor = mysql.connection.cursor()
        query = "INSERT INTO DMS_SESSION1 (session1_predicted_label, session1_depression_score) VALUES (%s, %s)"
        cursor.execute(query, (depression_status, depression_score))
        mysql.connection.commit()
        cursor.close()

        # Return the prediction
        return jsonify({
            "message": "Responses processed and saved successfully.",
            "predicted_label": depression_status
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return "Depression Status Prediction API is running!"

if __name__ == '__main__':
    app.run(debug=True)
