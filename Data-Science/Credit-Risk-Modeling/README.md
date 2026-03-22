<div align="center"> 

#Credit Risk Modeling 

</div>

<p align="center">
  <img src="https://img.shields.io/badge/SciPy-%230C55A5.svg?style=flat&logo=scipy&logoColor=white" />
  <img src="https://img.shields.io/badge/pandas-%23150458.svg?style=flat&logo=pandas&logoColor=white" />
  <img src="https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=flat&logo=scikit-learn&logoColor=white" />
  <img src="https://img.shields.io/badge/Matplotlib-%23ffffff.svg?style=flat&logo=Matplotlib&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi" />
  <img src="https://img.shields.io/badge/jupyter-%23FA0F00.svg?style=flat&logo=jupyter&logoColor=white" />
  <img src="https://img.shields.io/badge/marimo-12b47d.svg?style=flat&logo=marimo&logoColor=white" />
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white" />
  
</p>



Credit Risk Modeling Knowledge Bank — end-to-end development, evaluation, and deployment of credit risk models. Currently implements PD (Probability of Default); LGD and EAD are scaffolded for future work.

## Quick Start

```bash
# Install dev environment (use uv, set up .venv at project root)
make install-dev

# Run API locally
make serve                    # http://localhost:8000/docs

# Run a one-off inference from the OOT sample (local)
make test-predict             # uses PD_MODEL_TYPE=lr by default

# Container workflow (podman; swap podman→docker if needed)
make podman-build
make podman-test-predict      # LR model
make podman-test-predict-xgb  # XGBoost model
make podman-run               # serve the API in a container

# MLflow experiment tracking
make mlflow-ui                # http://localhost:5000
```

## Reproducing the PD Model from Scratch

Run notebooks in order — each saves artifacts consumed by the next:

| # | Notebook | Saves |
|---|----------|-------|
| 1 | `notebooks/01_pd/1_data_preparation.ipynb` | `data/processed/pd/01_*.parquet` |
| 2 | `notebooks/01_pd/2_target_creation.ipynb` | `data/processed/pd/02_*.parquet` |
| 3 | `notebooks/01_pd/3_feature_engineering.ipynb` | `data/processed/pd/final/` — WoE rules, train/val/OOT splits |
| 4 | `notebooks/01_pd/4_modeling.ipynb` | EDA/selection reference |
| — | `make train` | `models/pd/production/` — model + calibrator artifacts |

> **Important:** if you change any features in notebook 3, you must re-run it AND `make train` before rebuilding the container. The inference pipeline loads `woe_rules_tree.joblib` and `selected_vars_tree.joblib` from `data/processed/pd/final/` — stale artifacts cause feature mismatch errors at prediction time.

## Model Types

Set `PD_MODEL_TYPE` env var to switch the serving model (default: `lr`):

| Value | Model | Train command |
|-------|-------|---------------|
| `lr` | Logistic Regression + Platt scaling | `make train-lr` |
| `xgb` | XGBoost baseline + Platt scaling | `make train-xgb` |
| `xgb_tuned` | Optuna-tuned XGBoost + Platt scaling | `make train-xgb-tuned` |

LR uses WoE-transformed features. XGBoost uses raw features with categorical encoding.

## Project Structure

```
├── data/
│   ├── raw/               <- Original data
│   └── processed/         <- Data split by model (pd/, lgd/, ead/)
│       └── pd/final/      <- WoE artifacts + train/val/OOT splits (notebook 3 output)
│
├── models/
│   └── pd/production/     <- lr_model.joblib, xgb_model.json, platt calibrators
│
├── notebooks/01_pd/       <- Run in order: 1 → 2 → 3 → 4
│
├── src/credit_risk/
│   ├── core/              <- config, data_cleaning, evaluation, features, target, woe
│   ├── pd/                <- train.py, inference.py, test_prediction.py, trainers/
│   ├── lgd/               <- (scaffolded)
│   └── ead/               <- (scaffolded)
│
├── app/
│   ├── main.py            <- FastAPI entrypoint
│   └── routers/pd.py      <- /predict/pd endpoint
│
├── requirements.txt       <- full deps for notebooks
├── requirements-prod.txt  <- minimal deps for production container
├── Makefile               <- all automation commands
└── Dockerfile             <- multi-stage build (builder + runtime)
```