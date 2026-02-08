# AML Validator Dashboard — HTMX template (htmx-v1)

Static HTMX + Jinja2 template derived from **aistudio-v1**. Use this as the UI for the AML Validator Engine so that data from `03_ai_orchestrator/main.py` and DB/tx_log can be fed directly into the page.

## Layout (matches aistudio-v1)

- **Sidebar**: Dashboard / Cases navigation.
- **Dashboard view**: Header (case id, entity, risk, SLA) → Risk drivers (bar chart) | Network graph | Validator Assistant (HTMX investigate) → Transaction table.
- **Cases view**: KPI cards, case type/status breakdown, active investigations table.

## Backend context (plug-n-play)

Render `index.html` with these variables so the template works without changes:

| Variable | Type | Description |
|----------|------|-------------|
| `request` | Starlette `Request` | For URL/query (optional if you pass `view` explicitly). |
| `view` | `"dashboard"` or `"cases"` | From `request.query_params.get("view", "dashboard")`. |
| `case` | dict | Current case for dashboard header and assistant. |
| `transactions` | list[dict] | Rows for the transaction table (see below). |
| `cases` | list[dict] | Case list for the Cases page. |
| `risk_drivers` | list[dict] | `[{ "name": str, "value": int }, ...]` for Key Risk Drivers. |
| `graph_data` | dict | Optional `{ "nodes": [...], "links": [...] }` for network panel. |

### Case shape (dashboard)

- `id`, `entity_name`, `risk_level` (`HIGH`/`MEDIUM`/`LOW`), `risk_score` (0–100), `sla_deadline` (display string or ISO).
- Optional: `entity_id` or `id` used to prefill the Validator Assistant “Customer ID” for `/investigate`.

### Transaction shape (from DB or tx_log.csv)

The table supports both **tx_log.csv-style** and a **UI-friendly** shape.

**From `tx_log.csv`** (e.g. `01_data_engine/amlsim/outputs/aml_hackathon_v1/tx_log.csv`):

| CSV column   | Template / backend use        |
|-------------|--------------------------------|
| `step`      | Row id / step                  |
| `type`      | Transaction type               |
| `amount`    | Amount                         |
| `nameOrig`  | From (origin)                  |
| `nameDest`  | To (destination)               |
| `isSAR`     | Flagged (1 = Flagged)          |
| `alertID`   | Alert id (e.g. show #2)        |

Use **snake_case** when passing from Python: `name_orig`, `name_dest`, `is_sar`, `alert_id`. The template accepts:

- `txn_id` or `step` or `id`
- `type`
- `name_orig` or `sender` or `counterparty_orig`
- `name_dest` or `receiver` or `counterparty_dest`
- `amount`, optional `currency`
- `is_sar` or `is_flagged` (truthy = Flagged)
- `alert_id` (numeric, ≥ 0 shown as #id)

### Cases list shape (Cases page)

Each item: `id`, `entity_name`, `risk_level`, `status` (`OPEN`/`IN_REVIEW`/`CLOSED`), `date_opened`, `analyst`, `type` (e.g. `AML`/`KYC`/`FRAUD`).

### Investigation response (POST /investigate)

The Validator Assistant form does `POST /investigate` with `customer_id`. Your backend should return HTML that replaces `#investigation-results`. The template provides:

- **partials/investigation_card.html** — expects `customer_id` and `summary` (e.g. from `main.py` using `aml_agent.invoke`).

Use it in FastAPI like:

```python
return templates.TemplateResponse("partials/investigation_card.html", {
    "request": request,
    "customer_id": customer_id,
    "summary": summary,
})
```

## Integrating with `03_ai_orchestrator`

1. **Copy templates**  
   Copy contents of `00_UI_templates/htmx-v1/` into `03_ai_orchestrator/templates/` (overwrite or merge so that `index.html` and `partials/*` are in place).

2. **Serve dashboard with context**  
   In `main.py`, render the dashboard with the variables above, e.g.:

```python
from fastapi import Request
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="03_ai_orchestrator/templates")

@app.get("/")
async def index(request: Request):
    view = request.query_params.get("view", "dashboard")
    # Load from DB / tx_log or use demo data:
    case = {"id": "AML-2023-8842", "entity_name": "Customer 982", "risk_level": "HIGH", "risk_score": 94, "sla_deadline": "04:00:00"}
    risk_drivers = [{"name": "Transaction Velocity", "value": 85}, {"name": "Structuring", "value": 72}]
    transactions = []  # list of dicts from DB or tx_log (name_orig, name_dest, amount, type, is_sar, alert_id, ...)
    cases = []          # list of case summaries for Cases page
    graph_data = None   # optional { "nodes": [...], "links": [...] }

    return templates.TemplateResponse("index.html", {
        "request": request,
        "view": view,
        "case": case,
        "transactions": transactions,
        "cases": cases,
        "risk_drivers": risk_drivers,
        "graph_data": graph_data,
    })
```

3. **Keep POST /investigate**  
   Keep your existing `@app.post("/investigate")` that returns the investigation card partial; the form in `validator_assistant.html` already targets `#investigation-results` and uses `partials/investigation_card.html`-compatible context (`customer_id`, `summary`).

4. **Transaction data from DB**  
   If your DB schema mirrors tx_log or you load from CSV, map rows to the transaction dict shape above (e.g. `name_orig`, `name_dest`, `amount`, `type`, `is_sar`, `alert_id`) and pass as `transactions`.

## Files

- `index.html` — Main layout, sidebar, dashboard/cases switch by `view`.
- `partials/header.html` — Case header (id, entity, risk, SLA, actions).
- `partials/risk_drivers.html` — Key Risk Drivers bar list.
- `partials/network_graph.html` — Placeholder / simple node list from `graph_data`.
- `partials/transaction_table.html` — Table of transactions (tx_log/DB compatible).
- `partials/validator_assistant.html` — AI panel + form for POST /investigate.
- `partials/cases_page.html` — Case management KPIs and table.
- `partials/investigation_card.html` — Result fragment for /investigate (customer_id, summary).

## Dependencies (already in page)

- HTMX 1.9.10 (unpkg).
- Tailwind CSS (CDN).
- Inter font (Google Fonts).

No Node or build step required; the template is server-rendered and works with FastAPI + Jinja2.
