import joblib
import json
import numpy as np
from pathlib import Path

# Load model once at import time (not on every call)
_MODEL_PATH = Path(__file__).parent / 'model.pkl'
_FEAT_PATH  = Path(__file__).parent / 'feature_importance.json'

model = None
FEATURE_IMPORTANCE = None
FEATURE_COLS = []

def load_model_if_needed():
    global model, FEATURE_IMPORTANCE, FEATURE_COLS
    if model is None:
        model = joblib.load(_MODEL_PATH)
        with open(_FEAT_PATH) as f:
            FEATURE_IMPORTANCE = json.load(f)
        FEATURE_COLS = list(FEATURE_IMPORTANCE.keys())

# Churn DNA breakdown maps to CustomerHealthScore.disengagementReason
CHURN_DNA_DIMENSIONS = {
    'fee_sensitivity':      ['emi_missed_last_90d', 'fd_cancelled_last_90d'],
    'digital_adoption':     ['app_login_frequency_30d', 'digital_txn_ratio'],
    'complaint_velocity':   ['num_complaints_90d', 'complaint_escalation_flag'],
}

def predict(features: dict) -> dict:
    """
    Args:
        features: dict with keys matching FEATURE_COLS
    Returns:
        {
          churn_probability: float (0.0–1.0),
          risk_level: "AT_RISK" | "STABLE" | "DORMANT",
          top_risk_factors: [{"factor": str, "weight": float}, ...],  # top 3
          churn_dna: {"fee_sensitivity": float, "digital_adoption": float, "complaint_velocity": float},
          recommended_action: str,
          recommended_channel: str,
          suggested_offer: str
        }
    """
    load_model_if_needed()
    row = np.array([[features.get(col, 0) for col in FEATURE_COLS]])
    prob = float(model.predict_proba(row)[0][1])

    # --- Segment ---
    if prob >= 0.65:
        risk_level = 'AT_RISK'
    elif features.get('app_login_frequency_30d', 8) < 2 and prob < 0.40:
        risk_level = 'DORMANT'
    else:
        risk_level = 'STABLE'

    # --- Top risk factors (feature importance * feature value deviation) ---
    sorted_factors = sorted(
        FEATURE_IMPORTANCE.items(), key=lambda x: x[1], reverse=True
    )
    top_risk_factors = [
        {"factor": _human_label(k), "weight": round(v, 3)}
        for k, v in sorted_factors[:3]
    ]

    # --- Churn DNA (normalised scores per dimension) ---
    churn_dna = {}
    for dimension, cols in CHURN_DNA_DIMENSIONS.items():
        vals = [features.get(c, 0) for c in cols]
        # normalize values for digital_adoption so higher means higher risk (e.g. low login is higher risk)
        if dimension == 'digital_adoption':
            logins = features.get('app_login_frequency_30d', 8)
            txn_ratio = features.get('digital_txn_ratio', 0.6)
            # higher logins -> lower disengagement, higher txn_ratio -> lower disengagement
            disengagement = (1 - min(logins / 20, 1)) * 0.5 + (1 - txn_ratio) * 0.5
            churn_dna[dimension] = round(float(disengagement), 3)
        elif dimension == 'fee_sensitivity':
            emi_missed = features.get('emi_missed_last_90d', 0)
            fd_cancelled = features.get('fd_cancelled_last_90d', 0)
            score = emi_missed * 0.6 + fd_cancelled * 0.4
            churn_dna[dimension] = round(float(min(1, score)), 3)
        else: # complaint_velocity
            complaints = features.get('num_complaints_90d', 0)
            escalated = features.get('complaint_escalation_flag', 0)
            score = (complaints / 3) * 0.5 + escalated * 0.5
            churn_dna[dimension] = round(float(min(1, score)), 3)

    # --- Recommendations ---
    recommended_action, recommended_channel, suggested_offer = _recommend(
        prob, risk_level, churn_dna, features
    )

    return {
        'churn_probability': round(prob, 4),
        'risk_level': risk_level,
        'top_risk_factors': top_risk_factors,
        'churn_dna': churn_dna,
        'recommended_action': recommended_action,
        'recommended_channel': recommended_channel,
        'suggested_offer': suggested_offer,
    }

def _human_label(col: str) -> str:
    labels = {
        'salary_drop_pct': 'Salary Drop',
        'avg_monthly_balance': 'Low Balance',
        'num_sip_cancellations': 'SIP Cancellations',
        'app_login_frequency_30d': 'App Inactivity',
        'digital_txn_ratio': 'Digital Disengagement',
        'num_complaints_90d': 'Complaint Frequency',
        'complaint_escalation_flag': 'Escalated Complaint',
        'large_transfer_out_flag': 'Large Transfer Out',
        'outward_neft_to_competitor_ratio': 'Competitor Transfer Activity',
        'days_since_last_login': 'Days Since Last Login',
        'fd_cancelled_last_90d': 'FD Cancelled',
        'emi_missed_last_90d': 'Missed EMI',
    }
    return labels.get(col, col.replace('_', ' ').title())

def _recommend(prob, risk_level, dna, features):
    if risk_level == 'AT_RISK':
        dominant = max(dna, key=dna.get)
        if dominant == 'fee_sensitivity':
            return (
                'Schedule RM call within 24h — lead with fee waiver or EMI restructuring offer',
                'RM_CALL',
                'EMI Relief Package — waive next month EMI + 0.25% rate reduction'
            )
        elif dominant == 'complaint_velocity':
            return (
                'Immediate complaint resolution + proactive RM outreach with apology offer',
                'RM_CALL',
                'Priority Banking Package — dedicated RM + fee waiver for 3 months'
            )
        else:  # digital_adoption
            return (
                'Send WhatsApp with digital banking onboarding offer + cashback incentive',
                'WHATSAPP',
                'Digital Activation Bonus — ₹500 cashback on first 5 digital transactions'
            )
    elif risk_level == 'DORMANT':
        return (
            'Trigger in-app re-engagement nudge with savings rate highlight',
            'INAPP',
            'Welcome Back FD — special 7.25% rate for re-engagement'
        )
    else:
        return (
            'No immediate intervention required — include in standard engagement campaign',
            'EMAIL',
            'Standard loyalty reward — no specific offer required'
        )
