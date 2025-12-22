import joblib
import pandas as pd
import streamlit as st

model = joblib.load("xgb_credit_model.pkl")
encoders = {col : joblib.load(f"label_encoder_{col}.pkl") for col in ["Sex", "Housing", "Checking account", "Saving account"]}

st.title("CREDIT RISK PREDICTION APP")
st.write("Enter applicant information to predict if the credit risk is good or bad")

age = st.number_input("Age", max_value=18, max_value=80, value=30)
sex = st.selectbox("Sex", ["male", "female"])
job = st.bum