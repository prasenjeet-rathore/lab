.PHONY: install install-dev train train-lr train-xgb train-xgb-tuned serve test-predict docker-build docker-run mlflow-ui lint lint-fix

# ── Environment ────────────────────────────────────────────────────────────────

install:
	uv pip install -e .

install-dev:
	uv pip install -e ".[dev]"

# ── PD Model Training ──────────────────────────────────────────────────────────

train:
	uv run python -m credit_risk.pd.train --model all

train-lr:
	uv run python -m credit_risk.pd.train --model lr

train-xgb:
	uv run python -m credit_risk.pd.train --model xgb

train-xgb-tuned:
	uv run python -m credit_risk.pd.train --model xgb --tune

# ── API ────────────────────────────────────────────────────────────────────────

serve:
	uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test-predict:
	uv run python -m credit_risk.pd.test_prediction

# ── MLflow ────────────────────────────────────────────────────────────────────

mlflow-ui:
	uv run mlflow ui --backend-store-uri sqlite:///mlflow.db

# ── Docker ────────────────────────────────────────────────────────────────────

docker-build:
	docker build -t credit-risk-api:latest .

docker-run:
	docker run -p 8000:8000 \
		-e PD_MODEL_TYPE=lr \
		credit-risk-api:latest

docker-run-xgb:
	docker run -p 8000:8000 \
		-e PD_MODEL_TYPE=xgb \
		credit-risk-api:latest

# ── Linting ───────────────────────────────────────────────────────────────────

lint:
	uv run ruff check src/ app/

lint-fix:
	uv run ruff check --fix src/ app/
