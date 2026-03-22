<div align="center"> 

# Credit Risk Modeling 

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



Credit Risk Modeling Knowledge Bank : end-to-end development, evaluation, and deployment of credit risk models. Currently implements PD (Probability of Default); LGD and EAD are scaffolded for future work.


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
