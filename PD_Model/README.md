# Credit Risk Probability of Default (PD) Model

A comprehensive machine learning project for predicting credit default risk using XGBoost, Random Forest, and Logistic Regression models, complete with an interactive web-based monitoring dashboard.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Model Training](#model-training)
- [Dashboard](#dashboard)
- [Results](#results)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

This project implements a complete machine learning pipeline for credit risk assessment:

1. **Data Preprocessing**: Handles missing values, outliers, and categorical variables
2. **Feature Engineering**: Creates relevant features and handles imbalanced datasets using SMOTE
3. **Model Training**: Trains three different classification models (XGBoost, Random Forest, Logistic Regression)
4. **Model Comparison**: Evaluates and compares model performance
5. **Interactive Dashboard**: Provides real-time monitoring and visualization of model predictions

## ✨ Features

- 🔍 **Exploratory Data Analysis (EDA)** with comprehensive visualizations
- 🛠️ **Data Preprocessing Pipeline** with automated handling of missing values and outliers
- ⚖️ **Imbalanced Dataset Handling** using SMOTE (Synthetic Minority Oversampling Technique)
- 🤖 **Multiple ML Models**: XGBoost, Random Forest, and Logistic Regression
- 📊 **Feature Importance Analysis** for all models
- 📈 **Interactive Dashboard** with real-time model monitoring
- 🌓 **Theme Switcher** for light and dark modes
- 🔄 **Model Comparison Tools** with detailed metrics

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Python 3.8 or higher** ([Download Python](https://www.python.org/downloads/))
- **pip** (Python package installer - comes with Python)
- **Git** ([Download Git](https://git-scm.com/downloads))
- **Web Browser** (Chrome, Firefox, Safari, or Edge - latest version)

### System Requirements

- **OS**: Linux, macOS, or Windows
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free space
- **Internet Connection**: Required for downloading packages

## 🚀 Installation

Follow these steps to set up the project on your local machine:

### Step 1: Clone the Repository

```bash
# Clone the repository (if hosted on GitHub)
git clone https://github.com/RudyTchamba/MachineLearning/tree/main/PD_Model

# Navigate to the project directory
cd PD_Model
```

### Step 2: Create a Virtual Environment (Recommended)

Creating a virtual environment keeps your project dependencies isolated:

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt when activated.

### Step 3: Install Required Python Packages

Install all necessary Python libraries:

```bash
# Upgrade pip to the latest version
pip install --upgrade pip

# Install required packages
pip install numpy pandas seaborn matplotlib scikit-learn xgboost imbalanced-learn openpyxl jupyter
```

**Package Details:**
- `numpy`: Numerical computing library
- `pandas`: Data manipulation and analysis
- `seaborn`: Statistical data visualization
- `matplotlib`: Plotting library
- `scikit-learn`: Machine learning algorithms
- `xgboost`: Gradient boosting framework
- `imbalanced-learn`: Handles imbalanced datasets
- `openpyxl`: Excel file handling
- `jupyter`: Interactive notebook environment

### Step 4: Verify Installation

Verify all packages are installed correctly:

```bash
python3 -c "import numpy, pandas, sklearn, xgboost, imblearn; print('All packages installed successfully!')"
```

If you see "All packages installed successfully!", you're good to go!

## 📁 Project Structure

```
PD_Model/
│
├── notebook.ipynb                              # Main Jupyter notebook with ML pipeline
├── credit_risk_dataset.csv                     # Original dataset
├── credit_risk_with_model_predictions.csv      # Dataset with model predictions
├── credit_risk_with_model_predictions.xlsx     # Excel version of predictions
│
├── dashboard.html                              # Interactive dashboard (main file)
├── dashboard.css                               # Dashboard styling
├── dashboard.js                                # Dashboard functionality
│
├── README.md                                   # This file
├── README_DASHBOARD.md                         # Detailed dashboard documentation
│
└── venv/                                       # Virtual environment (if created)
```

## 💻 Usage

### Option 1: Running the Jupyter Notebook

#### Start Jupyter Notebook

```bash
# Make sure you're in the project directory
cd /home/redeus/MachineLearningProjects/PD_Model

# Activate virtual environment (if using one)
source venv/bin/activate  # On Linux/macOS
# venv\Scripts\activate   # On Windows

# Start Jupyter Notebook
jupyter notebook
```

This will open Jupyter in your default web browser.

#### Navigate and Run

1. In the Jupyter interface, click on `notebook.ipynb`
2. Run cells sequentially:
   - Click on a cell and press `Shift + Enter` to run it
   - Or use the menu: `Cell > Run All` to run all cells

### Option 2: Running with VS Code

If you prefer VS Code:

1. Open the project folder in VS Code
2. Install the "Jupyter" extension if not already installed
3. Open `notebook.ipynb`
4. Click "Run All" or run cells individually

## 🔄 Model Training

The notebook follows this workflow:

### 1. Data Loading and Exploration
```python
credit_risk = pd.read_csv('credit_risk_dataset.csv')
```

### 2. Data Cleaning
- Remove outliers (age > 70, employment length > 70)
- Fill missing values in `loan_int_rate` with median
- Drop `loan_grade` column

### 3. Feature Engineering
- Encode categorical variables (one-hot encoding)
- Convert `cb_person_default_on_file` to binary
- Standardize numerical features using `StandardScaler`

### 4. Handle Imbalanced Dataset
```python
from imblearn.over_sampling import SMOTE
smote = SMOTE()
balanced_features, balanced_target = smote.fit_resample(features, target)
```

### 5. Train Models
```python
# Split data
X_train, X_test, y_train, y_test = train_test_split(
    balanced_features, balanced_target, test_size=0.2, random_state=42
)

# Train models
logreg = LogisticRegression()
rf = RandomForestClassifier(n_estimators=100, random_state=42)
xgb = XGBClassifier(use_label_encoder=False, eval_metric='logloss', 
                    tree_method='exact', random_state=42)
```

### 6. Generate Predictions
The final step creates `credit_risk_with_model_predictions.csv` containing:
- Original features
- Predictions from all three models
- Actual loan status

## 📊 Dashboard

### Starting the Dashboard

#### Step 1: Start Local Web Server

```bash
# Navigate to the project directory
cd /home/redeus/MachineLearningProjects/PD_Model

# Start Python HTTP server
python3 -m http.server 8000
```

You should see: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...`

#### Step 2: Open in Browser

Open your web browser and navigate to:
```
http://localhost:8000/dashboard.html
```

**Important**: Do NOT open the HTML file directly (using file://) as this will cause CORS errors. Always use the local server.

### Dashboard Features

The dashboard includes four main sections:

#### 1. Overview
- **KPI Cards**: Model accuracies and total predictions
- **Performance Comparison**: Bar charts comparing all metrics
- **Confusion Matrix**: Visual breakdown of predictions
- **Model Agreement**: Consensus analysis

#### 2. Model Comparison
- **Detailed Metrics Table**: All performance metrics
- **Precision vs Recall**: Trade-off visualization
- **Error Analysis**: False positives and negatives

#### 3. Predictions
- **Filters**: By loan intent, home ownership, status, consensus
- **Search**: Real-time text search
- **Table View**: All predictions with pagination
- **Export Ready**: Can copy/paste data

#### 4. Feature Analysis
- **Loan Amount Distribution**: By default status
- **Income Analysis**: Income vs default correlation
- **Loan Intent**: Default rates by purpose
- **Interest Rate**: Correlation with defaults
- **Age Demographics**: Age distribution analysis
- **Home Ownership**: Risk by housing status

### Using the Dashboard

1. **Switch Views**: Click sidebar menu items
2. **Change Theme**: Click the theme toggle (bottom of sidebar)
3. **Select Model**: Use the dropdown in the header
4. **Filter Data**: Use filters in Predictions view
5. **Search**: Type in the search box for instant results
6. **Navigate Pages**: Use Previous/Next buttons

For detailed dashboard documentation, see [README_DASHBOARD.md](README_DASHBOARD.md)

## 📈 Results

After training, you'll have:

### Model Performance Metrics

Typical results (your results may vary):

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| XGBoost | ~90% | ~88% | ~92% | ~90% |
| Random Forest | ~88% | ~86% | ~90% | ~88% |
| Logistic Regression | ~85% | ~83% | ~87% | ~85% |

### Output Files

1. **credit_risk_with_model_predictions.csv**: Contains all predictions
2. **credit_risk_with_model_predictions.xlsx**: Excel version
3. **Feature importance charts**: Generated in the notebook

### Key Insights

- **Most Important Features**: 
  - Loan interest rate
  - Loan percent of income
  - Person's credit history length
  - Person's income
  - Loan amount

- **Model Agreement**: ~85% consensus across all three models

## 🛠️ Technologies Used

### Python Libraries
- **NumPy**: 1.x - Numerical operations
- **Pandas**: 2.x - Data manipulation
- **Scikit-learn**: 1.x - ML algorithms and preprocessing
- **XGBoost**: 2.x - Gradient boosting
- **Imbalanced-learn**: 0.11+ - SMOTE implementation
- **Seaborn**: 0.12+ - Statistical visualizations
- **Matplotlib**: 3.x - Plotting

### Web Technologies
- **HTML5**: Dashboard structure
- **CSS3**: Styling with custom properties
- **JavaScript (ES6+)**: Interactivity
- **Chart.js**: 4.4.0 - Interactive charts
- **PapaParse**: 5.4.1 - CSV parsing

## 🔧 Troubleshooting

### Common Issues

#### 1. Module Not Found Error
```bash
# Solution: Install missing package
pip install package-name
```

#### 2. CORS Error in Dashboard
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Use HTTP server, don't open HTML file directly
```bash
python3 -m http.server 8000
```

#### 3. Jupyter Notebook Won't Start
```bash
# Solution: Reinstall Jupyter
pip install --upgrade jupyter
```

#### 4. Dashboard Shows No Data
**Solution**: 
1. Check that CSV file exists in the same directory
2. Verify HTTP server is running
3. Check browser console for errors (F12)

#### 5. Python Version Issues
```bash
# Check Python version
python3 --version

# Should be 3.8 or higher
```

### Getting Help

If you encounter issues:

1. **Check the logs**: Look at terminal output for errors
2. **Browser Console**: Press F12 and check Console tab
3. **Verify files**: Ensure all files are in correct locations
4. **Dependencies**: Verify all packages are installed correctly

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Dataset source: [Credit Risk Dataset]
- Tutorial reference: [Original Tutorial]
- Inspiration from various credit risk modeling projects

## 📧 Contact

For questions or feedback:
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

## Quick Start Summary

```bash
# 1. Navigate to project
cd /home/redeus/MachineLearningProjects/PD_Model

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Linux/macOS

# 3. Install dependencies
pip install numpy pandas seaborn matplotlib scikit-learn xgboost imbalanced-learn openpyxl jupyter

# 4. Run notebook
jupyter notebook

# 5. Start dashboard
python3 -m http.server 8000
# Then open: http://localhost:8000/dashboard.html
```

---

**Last Updated**: December 25, 2025

**Status**: ✅ Active Development

**Version**: 1.0.0
