import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import joblib
import json

from generate_dataset import generate_customer_dataset

FEATURE_COLS = [
    'salary_drop_pct', 'avg_monthly_balance', 'num_sip_cancellations',
    'app_login_frequency_30d', 'digital_txn_ratio', 'num_complaints_90d',
    'complaint_escalation_flag', 'large_transfer_out_flag',
    'outward_neft_to_competitor_ratio', 'days_since_last_login',
    'fd_cancelled_last_90d', 'emi_missed_last_90d'
]

def train_and_save():
    df = generate_customer_dataset(n=1200)
    X = df[FEATURE_COLS]
    y = df['churned']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=8,
        min_samples_leaf=5,
        class_weight='balanced',   # handles class imbalance
        random_state=42
    )
    model.fit(X_train, y_train)

    # --- Print metrics for demo video ---
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    print("=== TrustEdge Churn Model — Classification Report ===")
    print(classification_report(y_test, y_pred, target_names=['STABLE', 'AT_RISK']))
    print(f"ROC-AUC Score: {roc_auc_score(y_test, y_proba):.4f}")

    # --- Save model + feature importance ---
    joblib.dump(model, 'model.pkl')
    importance = dict(zip(FEATURE_COLS, model.feature_importances_.tolist()))
    with open('feature_importance.json', 'w') as f:
        json.dump(importance, f, indent=2)
    print("\nModel saved to model.pkl")
    print("Feature importance saved to feature_importance.json")

if __name__ == '__main__':
    train_and_save()
