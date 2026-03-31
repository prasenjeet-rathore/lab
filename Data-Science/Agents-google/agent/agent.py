import os
import requests
import asyncio
import httpx
from google.adk.agents.llm_agent import Agent
from google.adk.tools.openapi_tool import OpenAPIToolset
from google.adk.tools.openapi_tool.auth.auth_helpers import token_to_scheme_credential

openapi_spec = requests.get("https://adventure.wietsevenema.eu/openapi.json").text

auth_scheme, auth_credential = token_to_scheme_credential(
    "apikey",
    "header",
    "Authorization",
    f"ApiKey {os.environ.get('GAME_API_KEY')}",
)

adventure_game_toolset = OpenAPIToolset(
    spec_str=openapi_spec,
    auth_scheme=auth_scheme,
    auth_credential=auth_credential,
)


async def throttle_requests(*args, **kwargs):
    await asyncio.sleep(4)


def run_code(url: str) -> str:
    """Fetches the content of a URL. Use this tool WHENEVER you need to read or download information from a website or URL."""
    with httpx.Client(follow_redirects=True) as client:
        response = client.get(url)
        response.raise_for_status()
        return response.text


root_agent = Agent(
    model="gemini-2.5-flash",
    name="root_agent",
    description="An expert adventure game player.",
    instruction=(
        "You are an autonomous AI playing a text adventure game.\n"
        "Your goal is to explore, solve puzzles, and complete the game entirely on your own.\n"
        "Rules to follow:\n"
        "1. Start by observing your surroundings (use the look tool).\n"
        "2. Examine interesting items and features in the room.\n"
        "3. Collect useful items and check your inventory when needed.\n"
        "4. Move through available exits to explore new areas.\n"
        "5. NEVER wait for user input. Continually reason about your situation, plan your next move, and immediately execute the next tool call until the level is completed."
    ),
    tools=[adventure_game_toolset, run_code],
    before_model_callback=throttle_requests,
)
