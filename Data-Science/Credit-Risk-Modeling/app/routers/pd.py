"""
PD model router — /predict/pd and /health/pd endpoints.

Imported by app/main.py and mounted at /predict/pd.
"""

from fastapi import APIRouter
import pandas as pd

from credit_risk.pd.inference import pipeline, top_lr_feature_contributions

router = APIRouter(prefix="/predict/pd", tags=["PD Model"])


@router.post("")
async def predict_pd(loan: dict):
    """
    Expect a JSON body with raw feature values matching training columns.
    Returns probability of default for that single loan.
    Also returns features ordered by importance which led to the current prediction.
    """
    try:
        df_input = pd.DataFrame([loan])
        pd_score = float(pipeline.predict_proba(df_input)[0])
        top_items = top_lr_feature_contributions(pipeline, df_input, n_top=2)
        return {
            "probability_of_default": round(pd_score, 6),
            "top_feature_contributions": top_items,
            "model_version": pipeline.version,
            "status": "success",
        }
    except Exception as e:  # simple safety net
        return {"status": "error", "error": str(e), "model_version": pipeline.version}


@router.get("/health")
async def health_pd():
    return {"status": "healthy", "model": pipeline.version}
