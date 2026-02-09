from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from .tools.sql_tools import get_db_tools

model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)
tools = get_db_tools()



# Prompt to give the agent a "Financial Auditor" personality
SYSTEM_PROMPT = """
You are a Senior AML Compliance Officer at Bank. 
Your task is to analyze transactions and customer data to identify potential money laundering.

When a Customer ID is provided:
1. Search their profile for occupation and income.
2. Search their transaction history.
3. Compare the two: Does the transaction volume make sense for their job?
4. Provide final information in very brief , unless asked for additional information
"""


aml_agent = create_react_agent(model, tools, prompt=SYSTEM_PROMPT)