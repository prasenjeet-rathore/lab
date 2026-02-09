import os
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_google_genai import ChatGoogleGenerativeAI

# Use the DNS name from your docker-compose
DB_URL = "postgresql://user:password@postgres:5432/aml_validator_engine"
db = SQLDatabase.from_uri(DB_URL)

def get_db_tools():
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)
    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    return toolkit.get_tools()