.PHONY: install install-dev train train-lr train-xgb train-xgb-tuned serve test-predict podman-build podman-run podman-run-xgb podman-test-predict podman-test-predict-xgb mlflow-ui lint lint-fix

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

# ── Docker or Podman────────────────────────────────────────────────────────────────────

podman-build:
	podman build -t credit-risk-api:latest .

podman-run:
	podman run -p 8000:8000 \
		-e PD_MODEL_TYPE=lr \
		credit-risk-api:latest

podman-run-xgb:
	podman run -p 8000:8000 \
		-e PD_MODEL_TYPE=xgb \
		credit-risk-api:latest

podman-test-predict:
	podman run --rm \
		-e PD_MODEL_TYPE=lr \
		credit-risk-api:latest \
		python -m credit_risk.pd.test_prediction

podman-test-predict-xgb:
	podman run --rm \
		-e PD_MODEL_TYPE=xgb \
		credit-risk-api:latest \
		python -m credit_risk.pd.test_prediction

# ── Linting ───────────────────────────────────────────────────────────────────

lint:
	uv run ruff check src/ app/

lint-fix:
	uv run ruff check --fix src/ app/
