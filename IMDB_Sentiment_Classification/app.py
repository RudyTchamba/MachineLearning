import pickle
import streamlit as st


# Load the trained model
model = pickle.load(open('imdb_sentiment_model.pkl', 'rb'))

# create a title and a description for the web app
st.title("IMDB Movie Review Sentiment Classification")

# create a text area for user input
review = st.text_input("Enter your movie review here:")

# create a button to submit the review
submit = st.button("Predict Sentiment")

if submit:
    # make a prediction using the loaded model
    prediction = model.predict([review])

    # display the prediction result
    if prediction[0] == 1:
        st.success("The sentiment of the review is Positive 😊")
    else:
        st.error("The sentiment of the review is Negative 😞")