from faker import Faker
import pandas as pd
import numpy as np

fake = Faker('en_IN')  # Indian locale for realistic names

def generate_customer_dataset(n=1200):
    """
    Generates synthetic customer dataset.
    
    Features map to CustomerSignal.type values already in schema:
    - TRANSACTION signals: salary_drop_pct, avg_monthly_balance, num_sip_cancellations
    - DIGITAL signals: app_login_frequency_30d, digital_txn_ratio
    - COMPLAINT signals: num_complaints_90d, complaint_escalation_flag
    - LIFE_EVENT signals: large_transfer_out_flag
    - COMPETITIVE signals: outward_neft_to_competitor_ratio
    """
    records = []
    for _ in range(n):
        # --- Signal features ---
        salary_drop_pct = np.random.beta(1.5, 5) * 100         # 0–100%, skewed low
        avg_monthly_balance = np.random.lognormal(10.5, 1.2)   # INR, log-normal
        num_sip_cancellations = np.random.poisson(0.3)          # Usually 0, occasionally 1-3
        app_login_frequency_30d = np.random.poisson(8)          # Avg 8 logins/month
        digital_txn_ratio = np.random.beta(5, 2)               # 0–1, skewed high
        num_complaints_90d = np.random.poisson(0.4)             # Usually 0
        complaint_escalation_flag = int(np.random.random() < 0.08)
        large_transfer_out_flag = int(np.random.random() < 0.12)
        outward_neft_to_competitor_ratio = np.random.beta(1, 6)
        days_since_last_login = np.random.exponential(12)       # Median ~8 days
        fd_cancelled_last_90d = int(np.random.random() < 0.07)
        emi_missed_last_90d = int(np.random.random() < 0.06)
        
        # --- Churn label logic (matches TrustEdge's AT_RISK definition) ---
        # Customer is at risk if multiple stress signals coincide
        risk_score = (
            0.30 * (salary_drop_pct / 100) +
            0.20 * (1 - min(app_login_frequency_30d / 20, 1)) +
            0.15 * min(num_sip_cancellations / 3, 1) +
            0.15 * min(num_complaints_90d / 3, 1) +
            0.10 * outward_neft_to_competitor_ratio +
            0.05 * complaint_escalation_flag +
            0.05 * large_transfer_out_flag
        )
        risk_score = np.clip(risk_score + np.random.normal(0, 0.05), 0, 1)
        churned = int(risk_score > 0.35)

        records.append({
            'customer_id': fake.uuid4(),
            'name': fake.name(),
            'salary_drop_pct': round(salary_drop_pct, 2),
            'avg_monthly_balance': round(avg_monthly_balance, 2),
            'num_sip_cancellations': num_sip_cancellations,
            'app_login_frequency_30d': app_login_frequency_30d,
            'digital_txn_ratio': round(digital_txn_ratio, 4),
            'num_complaints_90d': num_complaints_90d,
            'complaint_escalation_flag': complaint_escalation_flag,
            'large_transfer_out_flag': large_transfer_out_flag,
            'outward_neft_to_competitor_ratio': round(outward_neft_to_competitor_ratio, 4),
            'days_since_last_login': round(days_since_last_login, 1),
            'fd_cancelled_last_90d': fd_cancelled_last_90d,
            'emi_missed_last_90d': emi_missed_last_90d,
            'churned': churned,
        })

    return pd.DataFrame(records)
