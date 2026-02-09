from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from .agent import aml_agent
from .dashboard_data import get_dashboard_context
import os

app = FastAPI()

templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "templates"))


@app.get("/")
async def index(request: Request):
    view = request.query_params.get("view", "dashboard")
    context = get_dashboard_context(view=view)
    context["request"] = request
    return templates.TemplateResponse("index.html", context)


@app.post("/investigate")
async def investigate_case(request: Request, customer_id: str = Form(...)):
    result = aml_agent.invoke({"messages": [("user", f"Analyze risk for customer {customer_id}")]})
    summary = result["messages"][-1].content
    return templates.TemplateResponse("partials/investigation_card.html", {
        "request": request,
        "customer_id": customer_id,
        "summary": summary,
    })
