import streamlit as st
import pandas as pd
import re
import nltk
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download NLTK data
nltk.download('stopwords')
nltk.download('punkt')

# Load the trained logistic regression model and vectorizer from pickle files
model_filename = 'Extension/Text_analysis_model.pkl'
vectorizer_filename = 'Extension/tfidf_vectorizer.pkl'

with open(model_filename, 'rb') as file:
    model = pickle.load(file)
with open(vectorizer_filename, 'rb') as file:
    vectorizer = pickle.load(file)

# Define the text cleaning and preprocessing functions
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

# Streamlit app
st.title("Textual Analysis - Depression Detection")

# Text input for user
user_text = st.text_area("Enter the text for analysis:")

# Predict button
if st.button("Predict"):
    # Clean and preprocess the input text
    cleaned_text = clean_text(user_text)
    processed_text = tokenize_and_remove_stopwords(cleaned_text)
    
    # Transform the input text using the loaded TF-IDF vectorizer
    input_vector = vectorizer.transform([processed_text])
    
    # Make a prediction
    prediction = model.predict(input_vector)
    prediction_prob = model.predict_proba(input_vector)
    
    # Display the result
    label_map = {0: "No Depression", 1: "Depression"}  # Adjust label names based on your model
    predicted_label = label_map.get(prediction[0], 'Unknown')
    depression_score = round(prediction_prob[0][1] * 100, 2)

    st.write(f"The predicted label is: {predicted_label}")
    st.write(f"Depression Score: {depression_score}%")
else:
    st.write("Enter text and click 'Predict' to see the result.")
