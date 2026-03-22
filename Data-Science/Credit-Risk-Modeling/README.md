# Credit Risk Modeling  {style=text-align:center}
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



Credit Risk Modeling Knowledge Bank designed for the end-to-end development, evaluation, and deployment of credit risk models.

Project Organization

```
├── data/                  
│   ├── raw/               <- Original data 
│   ├── processed/         <- Data split by model (pd/, lgd/, ead/)
│
├── docs/                  <- The Knowledge Bank (MkDocs)
│   ├── theory/            <- Explanations of Basel IV, WOE math, etc.
│   └── API/               <- Documentation for your python modules
│
├── models/                <- Serialized .joblib or .pkl files
│   ├── pd/                <- Current PD models
│   ├── lgd/               <- Future LGD models
│   └── ead/               <- Future EAD models 
│
├── notebooks/             <- Categorized by model and stage
│   ├── 01_pd/             
│   ├── 02_lgd/
│   └── 03_ead/
│ 
├── src/                   <- Python modules
│   ├── credit_risk/
│   │   ├── core/          <- Common utils (cleaning, evaluation, config)
│   │   ├── pd/            <- PD-specific logic (WOE, Binning)
│   │   ├── lgd/           <- LGD-specific logic (Beta regression, etc.)
│   │   └── ead/           <- EAD-specific logic
│ 
├── app/                   <- Deployment Layer
│   ├── main.py            <- FastAPI 
│   └── routers/           <- Separate endpoints for /predict/pd, /predict/lgd
│
├── requirements.txt       <- full dependencies list for notebooks 
├── requirements-prod.txt  <- minimal dependencies for production
│
├── Makefile               <- Automation 
└── Dockerfile             <- Production-ready multi-stage build
```