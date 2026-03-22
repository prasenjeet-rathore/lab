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