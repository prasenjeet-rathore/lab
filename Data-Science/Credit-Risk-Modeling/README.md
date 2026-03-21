# Credit Risk Modeling

This is a comprehensive Credit Risk Modeling Knowledge Bank designed for the end-to-end development, evaluation, and deployment of credit risk models.

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