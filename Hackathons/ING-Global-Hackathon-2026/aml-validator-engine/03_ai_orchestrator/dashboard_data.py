"""
Dashboard context data for the AML Validator UI.
Provides demo data and optional tx_log.csv loading (tx_log shape: step, type, amount, nameOrig, nameDest, isSAR, alertID).
"""
import os
import csv

# Path to tx_log.csv (relative to project root)
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_TX_LOG_PATH = os.path.join(_PROJECT_ROOT, "01_data_engine", "amlsim", "outputs", "aml_hackathon_v1", "tx_log.csv")


def _load_transactions_from_csv(limit: int = 100) -> list[dict]:
    """Load transactions from tx_log.csv; return list of dicts with snake_case keys for templates."""
    if not os.path.isfile(_TX_LOG_PATH):
        return []
    rows = []
    with open(_TX_LOG_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            if i >= limit:
                break
            rows.append({
                "step": row.get("step", ""),
                "type": row.get("type", "TRANSFER"),
                "amount": float(row.get("amount", 0)),
                "name_orig": row.get("nameOrig", ""),
                "name_dest": row.get("nameDest", ""),
                "is_sar": int(row.get("isSAR", 0)),
                "alert_id": int(row.get("alertID", -1)) if row.get("alertID", "-1").strip() != "-1" else -1,
            })
    return rows


def get_demo_case() -> dict:
    """Current case for dashboard header and assistant (entity_id pre-fills customer ID)."""
    return {
        "id": "AML-2023-8842",
        "entity_name": "Customer 982",
        "entity_id": "982",
        "risk_level": "HIGH",
        "risk_score": 94,
        "sla_deadline": "04:00:00",
        "top_risk_drivers": [
            {"name": "Transaction Velocity", "value": 85},
            {"name": "Structuring (Smurfing)", "value": 72},
            {"name": "High-Risk Jurisdiction", "value": 65},
            {"name": "New Beneficiaries", "value": 45},
            {"name": "Round Amounts", "value": 30},
        ],
    }


def get_demo_risk_drivers() -> list[dict]:
    return [
        {"name": "Transaction Velocity", "value": 85},
        {"name": "Structuring (Smurfing)", "value": 72},
        {"name": "High-Risk Jurisdiction", "value": 65},
        {"name": "New Beneficiaries", "value": 45},
        {"name": "Round Amounts", "value": 30},
    ]


def get_demo_cases() -> list[dict]:
    """Case list for the Cases page."""
    return [
        {"id": "AML-2023-8842", "entity_name": "Customer 982", "risk_level": "HIGH", "status": "IN_REVIEW", "date_opened": "2023-10-24", "analyst": "Sarah Jenkins", "type": "AML"},
        {"id": "AML-2023-8843", "entity_name": "Nexus Holdings", "risk_level": "MEDIUM", "status": "OPEN", "date_opened": "2023-10-25", "analyst": "Unassigned", "type": "AML"},
        {"id": "KYC-2023-1002", "entity_name": "John Doe", "risk_level": "LOW", "status": "CLOSED", "date_opened": "2023-10-20", "analyst": "Mike Ross", "type": "KYC"},
        {"id": "FRD-2023-5591", "entity_name": "FastPay Systems", "risk_level": "HIGH", "status": "IN_REVIEW", "date_opened": "2023-10-26", "analyst": "Sarah Jenkins", "type": "FRAUD"},
        {"id": "AML-2023-8845", "entity_name": "Offshore Trust A", "risk_level": "HIGH", "status": "OPEN", "date_opened": "2023-10-27", "analyst": "Unassigned", "type": "AML"},
    ]


def get_demo_graph_data() -> dict:
    return {
        "nodes": [
            {"id": "Customer 982", "group": 1, "val": 20, "label": "Customer 982", "risk": 0.9},
            {"id": "23", "group": 2, "val": 10, "label": "Counterparty 23", "risk": 0.8},
            {"id": "104", "group": 2, "val": 10, "label": "Counterparty 104", "risk": 0.7},
            {"id": "107", "group": 3, "val": 5, "label": "Counterparty 107", "risk": 0.2},
        ],
        "links": [
            {"source": "Customer 982", "target": "23", "value": 5},
            {"source": "Customer 982", "target": "104", "value": 3},
            {"source": "Customer 982", "target": "107", "value": 1},
        ],
    }


def get_dashboard_context(view: str = "dashboard") -> dict:
    """
    Build full context for index.html.
    Uses tx_log.csv for transactions if available; otherwise demo transaction list.
    """
    transactions = _load_transactions_from_csv(limit=80)
    if not transactions:
        # Fallback demo transactions (tx_log shape)
        transactions = [
            {"step": 0, "type": "TRANSFER", "amount": 5767.17, "name_orig": "424", "name_dest": "38", "is_sar": 1, "alert_id": 2},
            {"step": 0, "type": "TRANSFER", "amount": 4521.49, "name_orig": "982", "name_dest": "23", "is_sar": 0, "alert_id": -1},
            {"step": 0, "type": "TRANSFER", "amount": 1737.92, "name_orig": "1107", "name_dest": "104", "is_sar": 0, "alert_id": -1},
        ]

    return {
        "view": view,
        "case": get_demo_case(),
        "transactions": transactions,
        "cases": get_demo_cases(),
        "risk_drivers": get_demo_risk_drivers(),
        "graph_data": get_demo_graph_data(),
    }
