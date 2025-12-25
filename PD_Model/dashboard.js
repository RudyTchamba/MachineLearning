// ===============================================
// Global Variables and State
// ===============================================
let csvData = [];
let filteredData = [];
let currentPage = 1;
const rowsPerPage = 50;
let charts = {};

// ===============================================
// Initialize Dashboard
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    loadCSVData();
    initializeFilters();
    initializeEventListeners();
});

// ===============================================
// Theme Management
// ===============================================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
        updateAllCharts();
    });
}

function updateThemeButton(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
    }
}

// ===============================================
// Navigation
// ===============================================
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.dataset.view;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            viewSections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(viewName);
            if (targetSection) {
                targetSection.classList.add('active');
                updateViewTitle(viewName);
            }
        });
    });
}

function updateViewTitle(viewName) {
    const titles = {
        'overview': 'Dashboard Overview',
        'model-comparison': 'Model Comparison',
        'predictions': 'Prediction Results',
        'feature-analysis': 'Feature Analysis'
    };
    document.getElementById('viewTitle').textContent = titles[viewName] || 'Dashboard';
}

// ===============================================
// Data Loading
// ===============================================
function loadCSVData() {
    Papa.parse('credit_risk_with_model_predictions.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
            csvData = results.data.filter(row => row.person_age); // Remove empty rows
            filteredData = [...csvData];
            document.getElementById('dataStatus').textContent = `${csvData.length} records loaded`;
            initializeAllViews();
        },
        error: (error) => {
            console.error('Error loading CSV:', error);
            document.getElementById('dataStatus').textContent = 'Error loading data';
        }
    });
}

// ===============================================
// Initialize All Views
// ===============================================
function initializeAllViews() {
    calculateAndDisplayKPIs();
    createPerformanceChart();
    createConfusionMatrix();
    createPredictionDistribution();
    createAgreementChart();
    createMetricsTable();
    createPrecisionRecallChart();
    createErrorAnalysisChart();
    populatePredictionsTable();
    createFeatureAnalysisCharts();
    populateFilterOptions();
}

// ===============================================
// KPI Calculations
// ===============================================
function calculateAndDisplayKPIs() {
    const metrics = calculateModelMetrics();
    
    // XGBoost
    document.getElementById('xgb-accuracy').textContent = (metrics.xgb.accuracy * 100).toFixed(1) + '%';
    document.getElementById('xgb-trend').innerHTML = createTrendIndicator(metrics.xgb.f1);
    
    // Random Forest
    document.getElementById('rf-accuracy').textContent = (metrics.rf.accuracy * 100).toFixed(1) + '%';
    document.getElementById('rf-trend').innerHTML = createTrendIndicator(metrics.rf.f1);
    
    // Logistic Regression
    document.getElementById('logreg-accuracy').textContent = (metrics.logreg.accuracy * 100).toFixed(1) + '%';
    document.getElementById('logreg-trend').innerHTML = createTrendIndicator(metrics.logreg.f1);
    
    // Total Predictions
    document.getElementById('total-predictions').textContent = csvData.length.toLocaleString();
}

function calculateModelMetrics() {
    const models = ['xgb_prediction', 'rf_prediction', 'logreg_prediction'];
    const metrics = {};
    
    models.forEach(model => {
        const modelKey = model.replace('_prediction', '');
        let tp = 0, tn = 0, fp = 0, fn = 0;
        
        csvData.forEach(row => {
            const actual = row.loan_status;
            const predicted = row[model];
            
            if (actual === 1 && predicted === 1) tp++;
            else if (actual === 0 && predicted === 0) tn++;
            else if (actual === 0 && predicted === 1) fp++;
            else if (actual === 1 && predicted === 0) fn++;
        });
        
        const accuracy = (tp + tn) / (tp + tn + fp + fn);
        const precision0 = tn / (tn + fn) || 0;
        const precision1 = tp / (tp + fp) || 0;
        const recall0 = tn / (tn + fp) || 0;
        const recall1 = tp / (tp + fn) || 0;
        const f1_0 = 2 * (precision0 * recall0) / (precision0 + recall0) || 0;
        const f1_1 = 2 * (precision1 * recall1) / (precision1 + recall1) || 0;
        const f1 = (f1_0 + f1_1) / 2;
        
        metrics[modelKey] = {
            accuracy,
            precision0,
            precision1,
            recall0,
            recall1,
            f1_0,
            f1_1,
            f1,
            tp,
            tn,
            fp,
            fn
        };
    });
    
    return metrics;
}

function createTrendIndicator(value) {
    const percentage = (value * 100).toFixed(1);
    return `<span class="text-success">F1-Score: ${percentage}%</span>`;
}

// ===============================================
// Charts - Performance Comparison
// ===============================================
function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const metrics = calculateModelMetrics();
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    if (charts.performanceChart) {
        charts.performanceChart.destroy();
    }
    
    charts.performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Accuracy', 'Precision (1)', 'Recall (1)', 'F1-Score (1)'],
            datasets: [
                {
                    label: 'XGBoost',
                    data: [
                        metrics.xgb.accuracy * 100,
                        metrics.xgb.precision1 * 100,
                        metrics.xgb.recall1 * 100,
                        metrics.xgb.f1_1 * 100
                    ],
                    backgroundColor: 'rgba(139, 92, 246, 0.7)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Random Forest',
                    data: [
                        metrics.rf.accuracy * 100,
                        metrics.rf.precision1 * 100,
                        metrics.rf.recall1 * 100,
                        metrics.rf.f1_1 * 100
                    ],
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Logistic Regression',
                    data: [
                        metrics.logreg.accuracy * 100,
                        metrics.logreg.precision1 * 100,
                        metrics.logreg.recall1 * 100,
                        metrics.logreg.f1_1 * 100
                    ],
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: textColor,
                        callback: value => value + '%'
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

// ===============================================
// Charts - Confusion Matrix
// ===============================================
function createConfusionMatrix() {
    const ctx = document.getElementById('confusionChart');
    if (!ctx) return;
    
    const modelSelect = document.getElementById('modelSelect');
    const selectedModel = modelSelect.value;
    
    let metrics;
    if (selectedModel === 'all' || selectedModel === 'xgb') {
        metrics = calculateModelMetrics().xgb;
    } else if (selectedModel === 'rf') {
        metrics = calculateModelMetrics().rf;
    } else {
        metrics = calculateModelMetrics().logreg;
    }
    
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    if (charts.confusionChart) {
        charts.confusionChart.destroy();
    }
    
    charts.confusionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['True Negative', 'False Positive', 'False Negative', 'True Positive'],
            datasets: [{
                label: 'Count',
                data: [metrics.tn, metrics.fp, metrics.fn, metrics.tp],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(34, 197, 94, 0.7)'
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(34, 197, 94, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

// ===============================================
// Charts - Prediction Distribution
// ===============================================
function createPredictionDistribution() {
    const ctx = document.getElementById('predictionDistChart');
    if (!ctx) return;
    
    const metrics = calculateModelMetrics();
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    
    if (charts.predictionDistChart) {
        charts.predictionDistChart.destroy();
    }
    
    const xgbDefault = csvData.filter(row => row.xgb_prediction === 1).length;
    const rfDefault = csvData.filter(row => row.rf_prediction === 1).length;
    const logregDefault = csvData.filter(row => row.logreg_prediction === 1).length;
    
    charts.predictionDistChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['XGBoost Default', 'RF Default', 'LogReg Default', 'Non-Default'],
            datasets: [{
                data: [
                    xgbDefault,
                    rfDefault,
                    logregDefault,
                    csvData.length - xgbDefault
                ],
                backgroundColor: [
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(156, 163, 175, 0.8)'
                ],
                borderWidth: 2,
                borderColor: theme === 'dark' ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: textColor,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// ===============================================
// Charts - Model Agreement
// ===============================================
function createAgreementChart() {
    const ctx = document.getElementById('agreementChart');
    if (!ctx) return;
    
    let allAgree = 0;
    let twoAgree = 0;
    let allDisagree = 0;
    
    csvData.forEach(row => {
        const xgb = row.xgb_prediction;
        const rf = row.rf_prediction;
        const logreg = row.logreg_prediction;
        
        if (xgb === rf && rf === logreg) {
            allAgree++;
        } else if (xgb === rf || rf === logreg || xgb === logreg) {
            twoAgree++;
        } else {
            allDisagree++;
        }
    });
    
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    
    if (charts.agreementChart) {
        charts.agreementChart.destroy();
    }
    
    charts.agreementChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['All Agree', 'Two Agree', 'All Disagree'],
            datasets: [{
                data: [allAgree, twoAgree, allDisagree],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderWidth: 2,
                borderColor: theme === 'dark' ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// ===============================================
// Model Comparison - Metrics Table
// ===============================================
function createMetricsTable() {
    const tbody = document.querySelector('#metricsTable tbody');
    if (!tbody) return;
    
    const metrics = calculateModelMetrics();
    const models = [
        { name: 'XGBoost', key: 'xgb', badge: 'xgb' },
        { name: 'Random Forest', key: 'rf', badge: 'rf' },
        { name: 'Logistic Regression', key: 'logreg', badge: 'logreg' }
    ];
    
    tbody.innerHTML = '';
    
    models.forEach(model => {
        const m = metrics[model.key];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="model-name">
                    <span class="model-badge ${model.badge}">${model.name}</span>
                </div>
            </td>
            <td><strong>${(m.accuracy * 100).toFixed(2)}%</strong></td>
            <td>${(m.precision0 * 100).toFixed(2)}%</td>
            <td>${(m.precision1 * 100).toFixed(2)}%</td>
            <td>${(m.recall0 * 100).toFixed(2)}%</td>
            <td>${(m.recall1 * 100).toFixed(2)}%</td>
            <td>${(m.f1_0 * 100).toFixed(2)}%</td>
            <td>${(m.f1_1 * 100).toFixed(2)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// ===============================================
// Model Comparison - Precision Recall Chart
// ===============================================
function createPrecisionRecallChart() {
    const ctx = document.getElementById('precisionRecallChart');
    if (!ctx) return;
    
    const metrics = calculateModelMetrics();
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    if (charts.precisionRecallChart) {
        charts.precisionRecallChart.destroy();
    }
    
    charts.precisionRecallChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'XGBoost',
                    data: [{
                        x: metrics.xgb.recall1 * 100,
                        y: metrics.xgb.precision1 * 100
                    }],
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    pointRadius: 10,
                    pointHoverRadius: 12
                },
                {
                    label: 'Random Forest',
                    data: [{
                        x: metrics.rf.recall1 * 100,
                        y: metrics.rf.precision1 * 100
                    }],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    pointRadius: 10,
                    pointHoverRadius: 12
                },
                {
                    label: 'Logistic Regression',
                    data: [{
                        x: metrics.logreg.recall1 * 100,
                        y: metrics.logreg.precision1 * 100
                    }],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    pointRadius: 10,
                    pointHoverRadius: 12
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Recall (%)',
                        color: textColor
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Precision (%)',
                        color: textColor
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

// ===============================================
// Model Comparison - Error Analysis
// ===============================================
function createErrorAnalysisChart() {
    const ctx = document.getElementById('errorAnalysisChart');
    if (!ctx) return;
    
    const metrics = calculateModelMetrics();
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    if (charts.errorAnalysisChart) {
        charts.errorAnalysisChart.destroy();
    }
    
    charts.errorAnalysisChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['XGBoost', 'Random Forest', 'Logistic Regression'],
            datasets: [
                {
                    label: 'False Positives',
                    data: [metrics.xgb.fp, metrics.rf.fp, metrics.logreg.fp],
                    backgroundColor: 'rgba(245, 158, 11, 0.7)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 2
                },
                {
                    label: 'False Negatives',
                    data: [metrics.xgb.fn, metrics.rf.fn, metrics.logreg.fn],
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

// ===============================================
// Predictions Table
// ===============================================
function populatePredictionsTable() {
    updatePredictionsTable();
}

function updatePredictionsTable() {
    const tbody = document.querySelector('#predictionsTable tbody');
    if (!tbody) return;
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filteredData.slice(start, end);
    
    tbody.innerHTML = '';
    
    pageData.forEach(row => {
        const tr = document.createElement('tr');
        
        const consensus = calculateConsensus(row);
        const consensusClass = consensus === 3 ? 'full' : 'partial';
        const consensusText = consensus === 3 ? 'All Agree' : `${consensus}/3`;
        
        tr.innerHTML = `
            <td>${row.person_age}</td>
            <td>$${row.person_income.toLocaleString()}</td>
            <td>${row.person_home_ownership}</td>
            <td>${row.loan_intent}</td>
            <td>$${row.loan_amnt.toLocaleString()}</td>
            <td>${row.loan_int_rate}%</td>
            <td><span class="prediction-badge ${row.loan_status === 1 ? 'default' : 'no-default'}">${row.loan_status === 1 ? 'Default' : 'No Default'}</span></td>
            <td><span class="prediction-badge ${row.xgb_prediction === 1 ? 'default' : 'no-default'}">${row.xgb_prediction}</span></td>
            <td><span class="prediction-badge ${row.rf_prediction === 1 ? 'default' : 'no-default'}">${row.rf_prediction}</span></td>
            <td><span class="prediction-badge ${row.logreg_prediction === 1 ? 'default' : 'no-default'}">${row.logreg_prediction}</span></td>
            <td><span class="consensus-badge ${consensusClass}">${consensusText}</span></td>
        `;
        tbody.appendChild(tr);
    });
    
    updatePaginationInfo();
}

function calculateConsensus(row) {
    const predictions = [row.xgb_prediction, row.rf_prediction, row.logreg_prediction];
    const sum = predictions.reduce((a, b) => a + b, 0);
    
    if (sum === 0 || sum === 3) return 3;
    return 2;
}

function updatePaginationInfo() {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('recordCount').textContent = `Showing ${filteredData.length} of ${csvData.length} records`;
    
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// ===============================================
// Filter Management
// ===============================================
function populateFilterOptions() {
    const loanIntents = [...new Set(csvData.map(row => row.loan_intent))].sort();
    const homeOwnerships = [...new Set(csvData.map(row => row.person_home_ownership))].sort();
    
    const loanIntentSelect = document.getElementById('loanIntentFilter');
    const homeOwnershipSelect = document.getElementById('homeOwnershipFilter');
    
    loanIntents.forEach(intent => {
        const option = document.createElement('option');
        option.value = intent;
        option.textContent = intent;
        loanIntentSelect.appendChild(option);
    });
    
    homeOwnerships.forEach(ownership => {
        const option = document.createElement('option');
        option.value = ownership;
        option.textContent = ownership;
        homeOwnershipSelect.appendChild(option);
    });
}

function initializeFilters() {
    document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
    document.getElementById('searchInput')?.addEventListener('input', handleSearch);
}

function applyFilters() {
    const loanIntent = document.getElementById('loanIntentFilter').value;
    const homeOwnership = document.getElementById('homeOwnershipFilter').value;
    const actualStatus = document.getElementById('actualStatusFilter').value;
    const consensus = document.getElementById('consensusFilter').value;
    
    filteredData = csvData.filter(row => {
        if (loanIntent !== 'all' && row.loan_intent !== loanIntent) return false;
        if (homeOwnership !== 'all' && row.person_home_ownership !== homeOwnership) return false;
        if (actualStatus !== 'all' && row.loan_status !== parseInt(actualStatus)) return false;
        
        if (consensus === 'agree') {
            const c = calculateConsensus(row);
            if (c !== 3) return false;
        } else if (consensus === 'disagree') {
            const c = calculateConsensus(row);
            if (c === 3) return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    updatePredictionsTable();
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    if (searchTerm === '') {
        filteredData = [...csvData];
    } else {
        filteredData = csvData.filter(row => {
            return Object.values(row).some(value => 
                String(value).toLowerCase().includes(searchTerm)
            );
        });
    }
    
    currentPage = 1;
    updatePredictionsTable();
}

// ===============================================
// Feature Analysis Charts
// ===============================================
function createFeatureAnalysisCharts() {
    createLoanAmountChart();
    createIncomeChart();
    createLoanIntentChart();
    createInterestRateChart();
    createAgeChart();
    createHomeOwnershipChart();
}

function createLoanAmountChart() {
    const ctx = document.getElementById('loanAmountChart');
    if (!ctx) return;
    
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    const defaultLoans = csvData.filter(row => row.loan_status === 1).map(row => row.loan_amnt);
    const noDefaultLoans = csvData.filter(row => row.loan_status === 0).map(row => row.loan_amnt);
    
    const bins = [0, 5000, 10000, 15000, 20000, 25000, 30000, 35000];
    const defaultDist = calculateHistogram(defaultLoans, bins);
    const noDefaultDist = calculateHistogram(noDefaultLoans, bins);
    
    if (charts.loanAmountChart) {
        charts.loanAmountChart.destroy();
    }
    
    charts.loanAmountChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bins.slice(0, -1).map((v, i) => `$${v/1000}k-${bins[i+1]/1000}k`),
            datasets: [
                {
                    label: 'Default',
                    data: defaultDist,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2
                },
                {
                    label: 'No Default',
                    data: noDefaultDist,
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function createIncomeChart() {
    const ctx = document.getElementById('incomeChart');
    if (!ctx) return;
    
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    const defaultIncome = csvData.filter(row => row.loan_status === 1).map(row => row.person_income);
    const noDefaultIncome = csvData.filter(row => row.loan_status === 0).map(row => row.person_income);
    
    const bins = [0, 20000, 40000, 60000, 80000, 100000, 150000, 200000];
    const defaultDist = calculateHistogram(defaultIncome, bins);
    const noDefaultDist = calculateHistogram(noDefaultIncome, bins);
    
    if (charts.incomeChart) {
        charts.incomeChart.destroy();
    }
    
    charts.incomeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bins.slice(0, -1).map((v, i) => `$${v/1000}k-${bins[i+1]/1000}k`),
            datasets: [
                {
                    label: 'Default',
                    data: defaultDist,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2
                },
                {
                    label: 'No Default',
                    data: noDefaultDist,
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function createLoanIntentChart() {
    const ctx = document.getElementById('loanIntentChart');
    if (!ctx) return;
    
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    const intentData = {};
    csvData.forEach(row => {
        if (!intentData[row.loan_intent]) {
            intentData[row.loan_intent] = { total: 0, defaults: 0 };
        }
        intentData[row.loan_intent].total++;
        if (row.loan_status === 1) {
            intentData[row.loan_intent].defaults++;
        }
    });
    
    const labels = Object.keys(intentData).sort();
    const defaultRates = labels.map(intent => 
        (intentData[intent].defaults / intentData[intent].total * 100).toFixed(1)
    );
    
    if (charts.loanIntentChart) {
        charts.loanIntentChart.destroy();
    }
    
    charts.loanIntentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Default Rate (%)',
                data: defaultRates,
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: textColor,
                        callback: value => value + '%'
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 9
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function createInterestRateChart() {
    const ctx = document.getElementById('interestRateChart');
    if (!ctx) return;
    
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    const defaultRates = csvData.filter(row => row.loan_status === 1).map(row => row.loan_int_rate);
    const noDefaultRates = csvData.filter(row => row.loan_status === 0).map(row => row.loan_int_rate);
    
    const bins = [5, 7, 9, 11, 13, 15, 17, 19];
    const defaultDist = calculateHistogram(defaultRates, bins);
    const noDefaultDist = calculateHistogram(noDefaultRates, bins);
    
    if (charts.interestRateChart) {
        charts.interestRateChart.destroy();
    }
    
    charts.interestRateChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bins.slice(0, -1).map((v, i) => `${v}-${bins[i+1]}%`),
            datasets: [
                {
                    label: 'Default',
                    data: defaultDist,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2
                },
                {
                    label: 'No Default',
                    data: noDefaultDist,
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function createAgeChart() {
    const ctx = document.getElementById('ageChart');
    if (!ctx) return;
    
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    const defaultAges = csvData.filter(row => row.loan_status === 1).map(row => row.person_age);
    const noDefaultAges = csvData.filter(row => row.loan_status === 0).map(row => row.person_age);
    
    const bins = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
    const defaultDist = calculateHistogram(defaultAges, bins);
    const noDefaultDist = calculateHistogram(noDefaultAges, bins);
    
    if (charts.ageChart) {
        charts.ageChart.destroy();
    }
    
    charts.ageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: bins.slice(0, -1).map((v, i) => `${v}-${bins[i+1]}`),
            datasets: [
                {
                    label: 'Default',
                    data: defaultDist,
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'No Default',
                    data: noDefaultDist,
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function createHomeOwnershipChart() {
    const ctx = document.getElementById('homeOwnershipChart');
    if (!ctx) return;
    
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f1f5f9' : '#1f2937';
    const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
    
    const ownershipData = {};
    csvData.forEach(row => {
        if (!ownershipData[row.person_home_ownership]) {
            ownershipData[row.person_home_ownership] = { total: 0, defaults: 0 };
        }
        ownershipData[row.person_home_ownership].total++;
        if (row.loan_status === 1) {
            ownershipData[row.person_home_ownership].defaults++;
        }
    });
    
    const labels = Object.keys(ownershipData).sort();
    const defaultRates = labels.map(ownership => 
        (ownershipData[ownership].defaults / ownershipData[ownership].total * 100).toFixed(1)
    );
    
    if (charts.homeOwnershipChart) {
        charts.homeOwnershipChart.destroy();
    }
    
    charts.homeOwnershipChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Default Rate (%)',
                data: defaultRates,
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: textColor,
                        callback: value => value + '%'
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

// ===============================================
// Utility Functions
// ===============================================
function calculateHistogram(data, bins) {
    const histogram = new Array(bins.length - 1).fill(0);
    
    data.forEach(value => {
        for (let i = 0; i < bins.length - 1; i++) {
            if (value >= bins[i] && value < bins[i + 1]) {
                histogram[i]++;
                break;
            }
        }
    });
    
    return histogram;
}

function updateAllCharts() {
    createPerformanceChart();
    createConfusionMatrix();
    createPredictionDistribution();
    createAgreementChart();
    createPrecisionRecallChart();
    createErrorAnalysisChart();
    createFeatureAnalysisCharts();
}

// ===============================================
// Event Listeners
// ===============================================
function initializeEventListeners() {
    document.getElementById('modelSelect')?.addEventListener('change', () => {
        createConfusionMatrix();
    });
    
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePredictionsTable();
        }
    });
    
    document.getElementById('nextPage')?.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePredictionsTable();
        }
    });
}
