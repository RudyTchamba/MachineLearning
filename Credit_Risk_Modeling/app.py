import joblib
import pandas as pd
import streamlit as st

model = joblib.load("xgb_credit_model.pkl")
encoders = {col : joblib.load(f"label_encoder_{col}.pkl") for col in ["Sex", "Housing", "Checking account", "Saving accounts"]}

st.title("CREDIT RISK PREDICTION APP")
st.write("Enter applicant information to predict if the credit risk is good or bad")

age = st.number_input("Age", min_value=18, max_value=80, value=30)
sex = st.selectbox("Sex", ["male", "female"])
job = st.number_input("Job (0-3)", min_value= 0, max_value= 3, value= 1)
housing = st.selectbox("Housing", ["own", "rent", "free"])
saving_account = st.selectbox("Saving Accounts", ["little", "moderate", "rich", "quite rich"])
checking_account = st.selectbox("Checking Acount", ["little", "moderate", "rich"])
credit_ammont = st.number_input("Credit Amount", min_value=0, value=1000)
duration = st.number_input("Duration", min_value=1, value=12)

input_df = pd.DataFrame({
    "Age": [age],
    "Sex": [encoders["Sex"].transform([sex])[0]],
    "Job": [job],
    "Housing": [encoders["Housing"].transform([housing])[0]],
    "Saving accounts": [encoders["Saving accounts"].transform([saving_account])[0]],
    "Checking account": [encoders["Checking account"].transform([checking_account])[0]],
    "Credit amount": [credit_ammont],
    "Duration": [duration]
})

if st.button("Predict Risk"):
    prediction = model.predict(input_df)
    if prediction[0] == 1:
        st.success("The credit risk is **GOOD**")
    else:
        st.error("The credit risk is **BAD**")