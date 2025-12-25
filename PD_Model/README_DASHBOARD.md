# Credit Risk Model Monitoring Dashboard

## Overview
This is a comprehensive, interactive dashboard for monitoring and comparing machine learning models used for credit risk prediction. The dashboard provides real-time insights into model performance, prediction analysis, and feature importance.

## Features

### 🎯 Key Capabilities
- **Multi-Model Comparison**: Compare XGBoost, Random Forest, and Logistic Regression models side-by-side
- **Interactive Visualizations**: 15+ interactive charts powered by Chart.js
- **Theme Switcher**: Toggle between light and dark modes
- **Advanced Filtering**: Filter predictions by loan intent, home ownership, actual status, and model consensus
- **Real-Time Metrics**: Accuracy, Precision, Recall, F1-Score, and confusion matrices
- **Feature Analysis**: Deep dive into how different features correlate with default rates
- **Prediction Explorer**: Browse and search through all predictions with pagination

### 📊 Dashboard Sections

#### 1. Overview
- **KPI Cards**: Quick view of model accuracies and total predictions
- **Performance Comparison Chart**: Bar chart comparing all metrics across models
- **Confusion Matrix**: Visual representation of true/false positives and negatives
- **Prediction Distribution**: Pie chart showing default predictions by model
- **Model Agreement**: Analysis of consensus between models

#### 2. Model Comparison
- **Detailed Metrics Table**: Complete breakdown of all performance metrics
- **Precision vs Recall**: Scatter plot showing the trade-off between precision and recall
- **Error Analysis**: Comparison of false positives and false negatives across models

#### 3. Predictions
- **Advanced Filters**: Filter by loan intent, home ownership, actual status, and consensus
- **Search Functionality**: Real-time search across all prediction data
- **Detailed Table**: View all predictions with model comparisons
- **Consensus Indicator**: See where models agree or disagree
- **Pagination**: Navigate through large datasets efficiently

#### 4. Feature Analysis
- **Loan Amount Distribution**: Compare loan amounts for defaulters vs non-defaulters
- **Income Distribution**: Income analysis by default status
- **Loan Intent Analysis**: Default rates by loan purpose
- **Interest Rate Correlation**: How interest rates relate to defaults
- **Age Distribution**: Age demographics by default status
- **Home Ownership Analysis**: Default rates by housing situation

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Web server (optional, but recommended)

### Quick Start

#### Option 1: Using Python's Built-in Server
```bash
# Navigate to the project directory
cd /home/redeus/MachineLearningProjects/PD_Model

# Start a simple HTTP server
python3 -m http.server 8000
```

Then open your browser and navigate to:
```
http://localhost:8000/dashboard.html
```

#### Option 2: Using Node.js http-server
```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Navigate to the project directory
cd /home/redeus/MachineLearningProjects/PD_Model

# Start the server
http-server -p 8000
```

Then open your browser and navigate to:
```
http://localhost:8000/dashboard.html
```

#### Option 3: Direct File Opening
You can open `dashboard.html` directly in your browser, but some browsers may restrict CSV file loading due to CORS policies. Using a local server is recommended.

## File Structure
```
PD_Model/
├── dashboard.html              # Main HTML file
├── dashboard.css               # Stylesheet with theme support
├── dashboard.js                # JavaScript for interactivity and data processing
├── credit_risk_with_model_predictions.csv  # Data file with predictions
└── README_DASHBOARD.md         # This file
```

## How to Use

### Navigation
- Click on the menu items in the left sidebar to switch between views
- The active view is highlighted in purple

### Theme Switching
- Click the theme toggle button at the bottom of the sidebar
- Preference is saved in browser localStorage

### Model Selection
- Use the dropdown in the header to focus on specific models
- Select "All Models" to see comprehensive comparisons

### Filtering Predictions
1. Navigate to the "Predictions" view
2. Select desired filters (Loan Intent, Home Ownership, etc.)
3. Click "Apply Filters" to update the table
4. Use the search box for real-time text search

### Exploring Charts
- Hover over chart elements to see detailed values
- Charts automatically update when changing themes or model selections
- All charts are responsive and adapt to screen size

## Key Metrics Explained

### Accuracy
Overall correctness of the model: (TP + TN) / (TP + TN + FP + FN)

### Precision
Of all predicted defaults, how many were correct: TP / (TP + FP)

### Recall (Sensitivity)
Of all actual defaults, how many did we catch: TP / (TP + FN)

### F1-Score
Harmonic mean of precision and recall: 2 × (Precision × Recall) / (Precision + Recall)

### Confusion Matrix Terms
- **True Positive (TP)**: Correctly predicted default
- **True Negative (TN)**: Correctly predicted non-default
- **False Positive (FP)**: Incorrectly predicted default (Type I error)
- **False Negative (FN)**: Incorrectly predicted non-default (Type II error)

## Technical Details

### Dependencies
All dependencies are loaded via CDN:
- **Chart.js v4.4.0**: For creating interactive charts
- **PapaParse v5.4.1**: For parsing CSV data

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
- Handles datasets with thousands of records
- Pagination for large tables (50 rows per page)
- Efficient filtering and search algorithms
- Lazy loading for charts

## Customization

### Modifying Colors
Edit the CSS variables in `dashboard.css`:
```css
:root {
    --accent-xgb: #8b5cf6;    /* XGBoost color */
    --accent-rf: #10b981;     /* Random Forest color */
    --accent-logreg: #3b82f6; /* Logistic Regression color */
}
```

### Adding New Charts
1. Add a canvas element in `dashboard.html`
2. Create a chart function in `dashboard.js`
3. Call the function in `initializeAllViews()`

### Changing Data Source
Update the CSV file path in `dashboard.js`:
```javascript
Papa.parse('your_data_file.csv', {
    // ...
});
```

## Troubleshooting

### Dashboard doesn't load
- Check browser console for errors (F12)
- Ensure CSV file is in the same directory
- Try using a local web server instead of opening file directly

### Charts not displaying
- Verify Chart.js is loading (check Network tab in DevTools)
- Ensure data is being parsed correctly
- Check for JavaScript errors in console

### Theme not persisting
- Check if localStorage is enabled in your browser
- Clear browser cache and try again

### Data not loading
- Verify CSV file name matches exactly
- Check file is not empty or corrupted
- Ensure proper CSV format with headers

## Best Practices

### For Monitoring
1. Check the Overview page first for high-level metrics
2. Use Model Comparison to identify the best performing model
3. Review Predictions where models disagree for insights
4. Analyze Feature Analysis to understand risk factors

### For Presentations
1. Switch to dark mode for better visibility on projectors
2. Use full-screen mode (F11) for cleaner view
3. Focus on specific models using the model selector
4. Export charts by right-clicking (browser feature)

## Future Enhancements
Potential additions to consider:
- Export functionality for filtered data
- ROC curve visualization
- Model performance over time (if historical data available)
- Custom metric thresholds with alerts
- Batch prediction upload and comparison

## Support
For issues or questions:
1. Check browser console for error messages
2. Verify all files are in the correct location
3. Ensure data file format matches expected structure
4. Try clearing browser cache

## Credits
Built with:
- HTML5, CSS3, JavaScript (ES6+)
- Chart.js for visualizations
- PapaParse for CSV parsing

## License
This dashboard is part of the PD_Model project for educational and monitoring purposes.
