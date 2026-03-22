"""
Credit Risk Model API — main entrypoint.

Run with:
    uv run uvicorn app.main:app --reload

Each model type (PD, LGD, EAD) has its own router under app/routers/.
Add a new model by importing its router and calling app.include_router().
"""

from fastapi import FastAPI

from app.routers import pd as pd_router

app = FastAPI(
    title="Credit Risk Model API",
    description="API for PD, LGD, and EAD credit risk models",
    version="1.0.0",
)

# ── Model Routers ──────────────────────────────────────────────────────────────
app.include_router(pd_router.router)
# Future: app.include_router(lgd_router.router)
# Future: app.include_router(ead_router.router)


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "credit-risk-api"}
