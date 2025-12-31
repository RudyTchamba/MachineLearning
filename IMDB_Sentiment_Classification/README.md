# IMDB Sentiment Classification

A machine learning project that classifies IMDB movie reviews as positive or negative sentiment using TF-IDF feature extraction and a Linear Support Vector Classifier (LinearSVC). The trained model is exposed via an interactive Streamlit web application.

## Project Overview

This project demonstrates a complete machine learning pipeline:
1. **Data Preprocessing** — Text cleaning, lowercasing, HTML tag removal, stopword removal
2. **Feature Extraction** — TF-IDF vectorization
3. **Model Training** — LinearSVC classifier with train/test split (80/20)
4. **Model Evaluation** — Classification report, confusion matrix
5. **Deployment** — Streamlit web app for real-time predictions

## Files

- **model.ipynb** — Jupyter notebook containing data loading, preprocessing, feature extraction, model training, evaluation, and model serialization
- **app.py** — Streamlit application that loads the trained model and provides an interactive UI for sentiment prediction
- **data/IMDB Dataset.csv** — Dataset containing movie reviews and their sentiment labels (positive/negative)
- **imdb_sentiment_model.pkl** — Serialized trained scikit-learn Pipeline (generated after running the notebook)

## Requirements

- **Python:** 3.8 or higher
- **Key Dependencies:**
  - scikit-learn
  - pandas
  - numpy
  - streamlit
  - matplotlib
  - seaborn
  - mlxtend
  - preprocess_kgptalkie
  - spacy
  - beautifulsoup4
  - lxml
  - textblob

## Setup Instructions

### 1. Clone or Navigate to Project Directory
```bash
cd /home/redeus/MachineLearningProjects/IMDB_Sentiment_Classification
```

### 2. Create and Activate Virtual Environment
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install scikit-learn pandas numpy streamlit preprocess_kgptalkie matplotlib seaborn mlxtend spacy beautifulsoup4 lxml textblob
python -m spacy download en_core_web_sm
```

### 4. (Optional) Create requirements.txt
```bash
pip freeze > requirements.txt
```

## Usage

### Train the Model
1. Open `model.ipynb` in Jupyter Notebook or VS Code
2. Run all cells sequentially to:
   - Load the IMDB dataset
   - Preprocess reviews (remove HTML, lowercase, extract features like word count)
   - Train the TF-IDF + LinearSVC pipeline
   - Evaluate model performance
   - Save the trained model as `imdb_sentiment_model.pkl`

### Run the Streamlit App
```bash
streamlit run app.py
```
The app will open at `http://localhost:8501/`

**How to Use:**
1. Enter a movie review in the text input field
2. Click "Predict Sentiment"
3. The app displays whether the sentiment is Positive or Negative

## Model Performance

The model achieves strong performance on the test set (20% of data):
- Uses TF-IDF vectorization for text feature extraction
- LinearSVC classifier for binary classification
- Includes confusion matrix and classification report visualization in notebook

## Project Structure

```
IMDB_Sentiment_Classification/
├── README.md
├── model.ipynb
├── app.py
├── imdb_sentiment_model.pkl
├── data/
│   └── IMDB Dataset.csv
└── .venv/
```

## Notes & Tips

- **Preprocessing:** The notebook preprocesses reviews to lowercase. When using the model in production, ensure input text follows the same preprocessing steps for consistency.
- **Model Reproducibility:** Results depend on random seeds and package versions. Pin versions in `requirements.txt` if you need exact reproducibility.
- **Data:** The IMDB dataset contains ~50,000 reviews with balanced sentiment distribution (25k positive, 25k negative)
- **Model Input:** The trained pipeline expects raw text strings; it internally applies TF-IDF vectorization

## Future Improvements

- Hyperparameter tuning for LinearSVC (C, loss, max_iter)
- Cross-validation for more robust performance estimates
- Class weight balancing for imbalanced datasets
- Experiment with advanced models (Logistic Regression, Random Forest, Gradient Boosting)
- Use transformer-based models (BERT, DistilBERT) for potentially higher accuracy
- Add data validation and error handling in the Streamlit app
- Implement confidence scores for predictions

## Troubleshooting

**Model file not found:**
- Ensure `imdb_sentiment_model.pkl` exists in the project root
- Run all cells in `model.ipynb` to regenerate it

**Import errors:**
- Verify all packages are installed: `pip install -r requirements.txt`
- Check that you're in the correct virtual environment: `source .venv/bin/activate`

**Streamlit app crashes:**
- Ensure the model file is in the same directory as `app.py`
- Check that required libraries are installed

## License

This project uses the IMDB dataset for educational purposes.
