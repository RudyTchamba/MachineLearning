# Credit Risk Modeling Project

## 📋 Description du Projet

Ce projet implémente un système de prédiction du risque de crédit utilisant des algorithmes de Machine Learning. Le modèle analyse différentes caractéristiques des demandeurs de crédit pour prédire si le risque associé est **bon** ou **mauvais**.

Le projet comprend :
- Une analyse exploratoire complète des données (EDA)
- L'entraînement et la comparaison de plusieurs modèles de classification
- Une application web interactive construite avec Streamlit pour faire des prédictions en temps réel

## 📊 Dataset

Le projet utilise le **German Credit Data** (`german_credit_data.csv`) qui contient des informations sur les demandeurs de crédit :
- **Age** : Âge du demandeur
- **Sex** : Sexe (male/female)
- **Job** : Catégorie d'emploi (0-3)
- **Housing** : Type de logement (own/rent/free)
- **Saving accounts** : Niveau d'épargne (little/moderate/rich/quite rich)
- **Checking account** : Compte courant (little/moderate/rich)
- **Credit amount** : Montant du crédit demandé
- **Duration** : Durée du crédit en mois
- **Risk** : Variable cible (good/bad)

## 🤖 Modèles Utilisés

Quatre algorithmes de classification ont été entraînés et comparés :

1. **Decision Tree Classifier**
2. **Random Forest Classifier**
3. **Extra Trees Classifier**
4. **XGBoost Classifier** ⭐ (modèle retenu)

Chaque modèle a été optimisé avec **GridSearchCV** pour trouver les meilleurs hyperparamètres.

## 🛠️ Technologies Utilisées

- **Python 3.10+**
- **Pandas** : manipulation des données
- **NumPy** : calculs numériques
- **Scikit-learn** : preprocessing et modèles ML
- **XGBoost** : modèle de classification
- **Matplotlib & Seaborn** : visualisations
- **Joblib** : sauvegarde des modèles
- **Streamlit** : application web interactive

## 📁 Structure du Projet

```
Credit_Risk_Modeling/
│
├── german_credit_data.csv          # Dataset
├── analysis_model.ipynb            # Notebook d'analyse et entraînement
├── app.py                          # Application Streamlit
├── xgb_credit_model.pkl           # Modèle XGBoost entraîné
├── label_encoder_Sex.pkl          # Encodeur pour Sex
├── label_encoder_Housing.pkl      # Encodeur pour Housing
├── label_encoder_Saving accounts.pkl  # Encodeur pour Saving accounts
├── label_encoder_Checking account.pkl # Encodeur pour Checking account
├── label_encoder_target.pkl       # Encodeur pour Risk (target)
└── README.md                      # Ce fichier
```

## 🚀 Installation et Configuration

### Prérequis

- Python 3.10 ou supérieur
- pip (gestionnaire de packages Python)

### Étapes d'installation

1. **Cloner le projet ou naviguer vers le dossier**
```bash
cd /home/redeus/MachineLearningProjects/Credit_Risk_Modeling
```

2. **Créer un environnement virtuel (recommandé)**
```bash
python3 -m venv venv
source venv/bin/activate  # Sur Linux/Mac
# ou
venv\Scripts\activate  # Sur Windows
```

3. **Installer les dépendances**
```bash
pip install pandas numpy scikit-learn xgboost matplotlib seaborn joblib streamlit jupyter
```

## 📓 Utilisation du Notebook

Pour explorer l'analyse et l'entraînement des modèles :

```bash
jupyter notebook analysis_model.ipynb
```

Le notebook contient :
- Chargement et exploration des données
- Analyse des valeurs manquantes
- Visualisations (histogrammes, boxplots, countplots, heatmap)
- Feature engineering et encodage
- Entraînement et optimisation des 4 modèles
- Sauvegarde du meilleur modèle

## 🌐 Lancer l'Application Web

Pour démarrer l'application Streamlit :

```bash
streamlit run app.py
```

L'application sera accessible dans votre navigateur à l'adresse : `http://localhost:8501`

### Utilisation de l'application

1. Remplir les informations du demandeur :
   - Age (18-80 ans)
   - Sexe (male/female)
   - Job (0-3)
   - Type de logement (own/rent/free)
   - Compte d'épargne (little/moderate/rich/quite rich)
   - Compte courant (little/moderate/rich)
   - Montant du crédit
   - Durée du crédit

2. Cliquer sur **"Predict Risk"**

3. Voir le résultat :
   - ✅ **GOOD** : Risque acceptable
   - ❌ **BAD** : Risque élevé

## 📈 Résultats

Les modèles ont été évalués sur un ensemble de test (20% des données) avec validation croisée à 5 folds. Le modèle XGBoost a été sélectionné pour le déploiement en raison de ses performances optimales.

## 🔄 Workflow du Projet

1. **Exploration des données** : Analyse statistique et visualisations
2. **Preprocessing** : Gestion des valeurs manquantes, suppression de colonnes inutiles
3. **Feature Engineering** : Sélection et encodage des features
4. **Entraînement** : Optimisation des hyperparamètres avec GridSearchCV
5. **Évaluation** : Comparaison des modèles sur l'accuracy
6. **Déploiement** : Application Streamlit pour des prédictions en temps réel

## 👨‍💻 Auteur

Projet de Machine Learning - Credit Risk Modeling

## 📝 License

Ce projet est à des fins éducatives et de démonstration.
