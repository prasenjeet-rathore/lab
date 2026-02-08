from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from .agent import aml_agent
import os

app = FastAPI()

# Tell FastAPI where your HTML files are
templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "templates"))

@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/investigate")
async def investigate_case(request: Request, customer_id: str = Form(...)):
    # 1. Invoke the LangGraph Agent
    # The agent uses your Postgres tools to find real data
    result = aml_agent.invoke({"messages": [("user", f"Analyze risk for customer {customer_id}")]})
    
    # 2. Return an HTML fragment (HTMX style!)
    summary = result["messages"][-1].content
    return templates.TemplateResponse("partials/investigation_card.html", {
        "request": request,
        "customer_id": customer_id,
        "summary": summary
    })

