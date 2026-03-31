[Home](https://adventure.wietsevenema.eu/)[Workshop](https://adventure.wietsevenema.eu/workshop/start-here)[Leaderboards](https://adventure.wietsevenema.eu/leaderboards)[Profile](https://adventure.wietsevenema.eu/profile)

## Start the Workshop

Welcome to the Google Agent Development Kit (ADK) guide for The Garden of the Forgotten Prompt, a text-based adventure game designed to help you learn how to build autonomous AI agents.

### What You'll Learn

In this guide, I'll guide you through the process of setting up your environment, creating your first ADK agent, teach it how to play the game, and then creating an autonomous agent to play the game for you.

### Workshop Outline

- **Setup Google Cloud:** Configure your environment for agent development.
- **Play the Game:** Explore the world manually to understand the challenge.
- **Test the Game API:** Interact directly with the game's stateful API.
- **Build Your Agent:** Initialize a new ADK agent project.
- **Connect to the Game:** Give your agent tools to interact with the game world.
- **Make It Autonomous:** Transform your agent into an explorer that solves puzzles on its own.
- **Add Custom Tools:** Extend your agent's capabilities with custom Python code.
- **Deploy to Cloud Run:** (Bonus) Deploy your agent as a persistent service.

Ready to get started? In the next step, you'll set up your Google Cloud environment to host your agent.

### PROGRESS

[Setup Cloud >](https://adventure.wietsevenema.eu/workshop/setup-cloud)





## Setup Google Cloud

Before you start the guide, you need to set up your Google Cloud environment.

1. **Set up a Google Cloud Billing Account:**

   A Google Cloud project with billing enabled is a prerequisite. There are two ways to get this:

   - **In-person event:** Your instructor will provide a unique, time-limited link to get a Google Cloud billing account without requiring a credit card.
   - **Self-service:** Use a billing account that's already available to you.

2. **Create a Google Cloud Project:**

   Once you have a billing account, you need to create a project and link it to your billing account.

   1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
   2. [Create a new project](https://console.cloud.google.com/projectcreate).
   3. Select your new project from the project selector at the top of the page.
   4. Go to the Billing section and link the billing account.

3. Choose Your Environment

4. Choose where to run the lab. Either use Cloud Shell or your local machine.

5. 

6. **Option A (no setup):** If you prefer, you can work from the Google Cloud Shell which comes pre-authenticated and with most tools you'll need pre-installed. Find the terminal icon in the top right of the menu bar of the Cloud Console.

7. **Option B (local setup):** Use your local machine. If you choose this option, you'll need to install and configure some tools.

   - **Install the Google Cloud CLI:** Follow the [installation instructions](https://cloud.google.com/sdk/docs/install) for your operating system.

   - **Log in to gcloud:** This command opens a browser window for you to authorize access.

     ```bash
     gcloud auth login
     ```

   - **Set up Application Default Credentials (ADC):** This allows your local application to authenticate with Google Cloud services.

     ```bash
     gcloud auth application-default login
     ```

   - **Set your default project:** Replace `PROJECT_ID` with your Google Cloud project ID. Note that there are three identifiers for projects in Google Cloud. There's a *name*, a *number*, and an **ID**. You need to set the ID.

     ```bash
     gcloud config set project PROJECT_ID
     ```

With your cloud environment ready, it's time to dive in. Next, you'll explore the game world manually to understand what your agent will be facing.





## Play the Game

Before you can build an agent, it's useful to understand the world it will be operating in. This involves exploring the game manually.

First, let's get familiar with the game environment using the visual interface. Navigate to the [Play](https://adventure.wietsevenema.eu/play) page and start a new game. Take a moment to look around.

Finish the first introduction level to build a good understanding of the game mechanics.

### Check the Leaderboard

When you visit the [Leaderboards](https://adventure.wietsevenema.eu/leaderboards) page, you will see a list of public leaderboards.

If you are attending an in-person event, you are automatically enrolled in a private leaderboard, which appears on the same page. While your name is anonymized by default, you can update your display name at any time in your [profile](https://adventure.wietsevenema.eu/profile).

Now that you've seen the game through the eyes of a player, let's look under the hood. In the next section, you'll interact directly with the Game API to understand how the agent sees the world.





## Test the Game API

Every action you took in the web interface corresponds to a specific HTTP request sent to the Game API. Some examples include looking around in the room, moving through an exit, and examining an item. Your agent will play the game by sending these same requests.

### Authentication

To interact with the API, you need to prove who you are. This is done using an **API Key**. You must include this key in the `Authorization` header of every request, using the following format: `Authorization: ApiKey YOUR_KEY`.

Your personal API Key is:

```plaintext
f16a1043a436c290d826687ca8095094b2fada4850e58619af9e298ee4339f38
```

### The API is Stateful

Important: The Game API is **stateful**. The server remembers which level you are playing and your current location within it. You can only have one active game session at a time. If you call `/game/start` while a session is already active, the old session will be cancelled and a new one will begin.

### Hands-on with curl

Now, try starting a level and executing a **look** command from your terminal using `curl`. This will help you understand exactly what your agent sees.

#### 1. Start a Level

First, you'll need to ensure you are in a valid state. Run this command to start (or restart) Level 0:

```bash
curl -X POST \
 https://adventure.wietsevenema.eu/game/start \
 -H "Authorization: ApiKey f16a1043a436c290d826687ca8095094b2fada4850e58619af9e298ee4339f38" \
 -H "Content-Type: application/json" \
 -d '{"level_id": "level-0"}'
```

Expected Output:

#### 2. Look Around

Now that the level is active, ask the server for a description of the room:

```bash
curl -X GET \
 https://adventure.wietsevenema.eu/game/look \
 -H "Authorization: ApiKey f16a1043a436c290d826687ca8095094b2fada4850e58619af9e298ee4339f38"
```

Expected Output:

You've just played the game without a browser! This JSON response is exactly what your agent will receive and analyze to decide its next move.

### Available Endpoints

Here are the main endpoints your agent will use:

- `POST /game/start`: Start a specific level.
- `GET /game/look`: Get a description of your current location.
- `POST /game/move`: Move in a direction (e.g., "north").
- `POST /game/take`: Pick up an item.
- `POST /game/drop`: Drop an item.
- `POST /game/use`: Use an item, or two items together.
- `POST /game/examine`: Get details about an item or feature.
- `GET /game/inventory`: List items you are carrying.

### Ready to Automate?

Manually sending API requests is tedious. It's time to build an AI agent that can do this for you. In the next section, you'll set up your development environment and create your first agent.





## Build Your Agent

Now that you've explored the game and set up your environment, it's time to create the basic structure for your first agent, and then you'll get it running.

Google's Agent Development Kit (ADK) is an open-source Python framework from Google designed to simplify the development of AI agents. It provides a structured way to give agents tools, manage their state, and interact with them through a web interface. ADK is optimized for Google's Gemini models but is flexible enough to work with other language models as well. While this guide focuses on the Python version, there is also a [Java version of ADK](https://github.com/google/adk-java) available.

### Initialize Your First Agent

1. Follow the guide at [A fast way to get started with ADK](https://wietsevenema.eu/blog/2025/a-fast-way-to-get-started-with-adk/) to initialize a new ADK agent. This sets up the basic file structure for your agent.
2. Start the ADK Developer Web UI to get a feel for the agent development environment. You won't connect it to the game just yet, but it's good to see where you'll be working.

![ADK Developer Web UI](https://adventure.wietsevenema.eu/static/workshop/dev-web-ui.png?v=1765893252)

### Web Preview in Cloud Shell

In Cloud Shell you can view the Developer Web UI using the Web Preview feature. Find the port you want to connect with, click the "Web Preview" button in the top right corner of the Cloud Shell window (it looks like an eye icon), then select "Preview on port 8080", or "Change port". Refer to the [Web Preview documentation](https://cloud.google.com/shell/docs/using-web-preview) for more instructions.

Your agent framework is in place, but it's isolated. In the next step, you will connect it to the game API, giving it the power to perceive and interact with the world.





## Connect to the Game

Now that your agent is running, it's time to give it the ability to interact with the game. In this section, you'll provide your agent with tools to call the game's API and give it instructions on how to behave.

### Give Your Agent Tools

ADK provides a way to give agents the ability to do things (such as calling APIs) through tools. For APIs that have an OpenAPI specification (such as our Game API), you can use the *OpenAPIToolset* to automatically create a whole set of tools for your agent, that correspond to the API endpoints.

Replace the code in *agent.py* with the following listing to connect it to the game's API. This code fetches the OpenAPI spec, creates a toolset from it, and initializes an agent with tools.

```python
import os
import requests
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


root_agent = Agent(
 model="gemini-2.5-flash",
 name="root_agent",
 description="An expert adventure game player.",
 instruction=(
 "You are a narrator in a text adventure game that operates in a strict turn-by-turn format.\n\n"
 "On your turn, you take the player's request, translate it into a single tool call, execute it, and describe the outcome. "
 "**Do not, under any circumstances, plan or execute more than one action.** After your turn, you must stop and wait for the player's next command. The player is always in the lead.\n\n"
 "**If the player asks for help or suggestions (e.g., 'What should I do now?'), do not take any action with your tools.** "
 "Instead, analyze the current situation and suggest a few possible actions the player could take. It is the player's job to decide on the next step.\n\n"
 "**If the player's command is ambiguous and doesn't directly map to an available tool, do not infer their intent.** "
 "Instead, suggest concrete actions based on the tools in their inventory and the objects in the room."
 ),
 tools=[adventure_game_toolset],
)
```

### Breaking Down the Code

Let's take a closer look at the key parts of this code listing:

1. Downloading the API Specification

   First, the code fetches the OpenAPI specification from the game's server. This file describes all the available API endpoints, their parameters, and what they return. The *OpenAPIToolset* uses this to automatically create tools for the agent.

   ```python
   openapi_spec = requests.get("https://adventure.wietsevenema.eu/openapi.json").text
   ```

2. Setting up Authentication

   - The game API requires an API key to be sent with each request. The *token_to_scheme_credential* function is a helper that creates and returns a tuple containing an *AuthScheme* and an *AuthCredential* object. These objects are then passed to the *OpenAPIToolset* to configure authentication for the tools it generates.
   - The API key is pulled from the environment variable *GAME_API_KEY*. I'll show you how to add it later.

   ```python
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
   ```

3. Configuring the Agent

   Finally, the agent itself is created. There are two important parts here:

   - The *instruction* tells the agent its purpose and how it should behave. In this case, it's told to act as a turn-by-turn operator for a text adventure game.
   - The *tools* list is given the *adventure_game_toolset* you created. This gives the agent the ability to call all the game's API endpoints.

   ```python
   root_agent = Agent(
    ...
    instruction=("..."),
    tools=[adventure_game_toolset],
   )
   ```

### How Instructions Determine Agent Behavior

The instructions you provide to an agent are crucial for shaping its behavior. A well-crafted set of instructions guides the agent to use its tools in the way you intend, leading to more reliable and predictable outcomes. In this case, the instructions tell the agent to act as a simple operator, translating the player's commands into single API calls. This prevents the agent from acting on its own, which is a behavior you'll encourage in the next section.

### Set Your Game API Key

Your agent needs an API key to interact with the game. The *OpenAPIToolset* is configured to read this key from a *.env* file in your agent's directory (find it right next to *agent.py*)

Create or open the *.env* file (right next to *agent.py*) and add the following line:

```bash
GAME_API_KEY=f16a1043a436c290d826687ca8095094b2fada4850e58619af9e298ee4339f38
```

Your full *.env* file should now look like this:

```bash
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_CLOUD_PROJECT=[YOUR_PROJECT_ID]
GOOGLE_CLOUD_LOCATION=global
GAME_API_KEY=f16a1043a436c290d826687ca8095094b2fada4850e58619af9e298ee4339f38
```

> A note for Cloud Shell users
>
> If you can't find the `.env` file, it might be hidden. You can reveal it by going to **View> Toggle Hidden Files** in the Cloud Shell editor.

### Play the Game with the Agent

With your agent configured, it's time to play the game through ADK's interface.

1. **Restart the Development Web UI:** To make it pick up the environment variable you added to *.env*
2. **Interact with the Agent:** In the chat interface, you can now give commands to your agent in natural language.
   - "What levels can I play?"
   - "Start level 0"
   - "Look around"
   - "Go north"
   - "Examine the pixel"
3. **Guide the Agent:** Your agent translates your commands into the appropriate API calls. Guide it through the level and solve the puzzles to reach the end.

Your agent can now follow orders, but it still relies on you for every move. Next, you'll give it a brain, teaching it to explore and solve puzzles all on its own.





## Make It Autonomous

Having an agent that can understand your commands is useful, but the strength of AI agents comes from their ability to reason and act on their own. In this section, you'll modify your agent's instructions to turn it from a command-follower into an autonomous explorer.

### Teach Your Agent to Think for Itself

Update the *instruction* parameter of your *Agent*. Instead of telling it to wait for your commands, give it a clear goal. For example, you could instruct it to explore the level, look for clues, and solve puzzles on its own. You can also ask it to narrate its thoughts and actions after each step, so you can follow along with its reasoning process. Your goal is to make the agent autonomous.

### Solve Levels Autonomously

Now, let's see your agent in action.

1. **Update Instructions:** Change the instructions of your agent.
2. **Restart Your Agent:** Restart the ADK Development Web UI with your updated agent code.
3. **Give the Starting Command:** In the chat interface, type "Solve level 1".
4. **Observe:** The agent now takes over. It starts by looking around, analyzing the scene, and then planning and executing its actions step-by-step. You can watch as it explores the level, picks up items, and (hopefully) solves the puzzles to complete the level on its own.

> Note on rate limiting
>
> The autonomous agent sends many consecutive prompts to the model. If you're on a personal account and used the free credits at an in-person workshop, you might encounter a rate limit. This will show up as a *429 RESOURCE_EXHAUSTED* error in the ADK's web UI. If this happens, wait for a minute to let it cool off, and then send the message "Continue" in the chat to resume the agent. You can [learn more about rate limiting in the Google Cloud documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/quotas).

Your agent is now a capable explorer, but some puzzles require more than just standard actions. In the next section, you'll write custom tools to help it overcome specific challenges.





## Add Custom Tools

As game worlds become more complex, you may encounter puzzles or mechanics that a generic set of API calls cannot solve. Level 2 of the adventure introduces such a challenge, requiring a custom tool to overcome.

### Tackling Level 2

Level 2 features a new kind of puzzle that can't be solved by a large language model without additional tools.

You can create custom tools to handle specific logic. With the ADK, you can define these tools as Python functions.

1. **Read the Guide:** Read the guide at [Adding a tool to your ADK agent](https://wietsevenema.eu/blog/2025/adding-a-tool-to-your-adk-agent/). This guide explains the process of creating a custom tool, defining its inputs and outputs, and giving it a clear description so the agent understands how and when to use it.
2. **Implement the Tool:** Once you discover what logic you need to implement, write the Python code for your new tool. This tool contains the specific logic needed to solve the new puzzle in Level 2.

### Restart and Solve Level 2

With its new, extended capabilities, your agent is now ready to take on Level 2. Restart the ADK Development Web UI to reload your agent and watch as it solves the level.

### Next Steps

You have successfully built an autonomous agent that can not only explore and interact with a digital world but you have also extended it with new abilities. It's time to wrap up in the [Conclusion](https://adventure.wietsevenema.eu/workshop/finish-up).





# How to add a tool to your ADK agent

July 8, 2025 :: [Wietse Venema](https://wietsevenema.eu/about/)

In my previous post on [getting started with ADK](https://wietsevenema.eu/blog/2025/a-fast-way-to-get-started-with-adk/), I showed you how to create your first AI agent with the Agent Development Kit (ADK). Now, I'll show you how to give your agent new abilities by adding tools.

## Adding a URL fetcher

I'll show you how to create a Python function that can fetch the content of a URL and add it to your agent's toolbox.

1. Install the `httpx` library. From your `agent-project` directory, run the following command:

   ```bash
   uv add httpx
   ```

   Copy

2. Open the `agent/agent.py` file.

3. Add the `import httpx` line at the top of the file.

4. Create the `fetch_url` function. This function takes a string `url` as input and returns the text content of the response.

   ```python
   def fetch_url(url: str) -> str:
       """Fetches the content of a URL."""
       with httpx.Client(follow_redirects=True) as client:
           response = client.get(url)
           response.raise_for_status()
           return response.text
   ```

   Copy

5. Add the function to your Agent's `tools` list.

   ```python
   root_agent = Agent(
     # ...
     tools=[fetch_url]  # <-- Add tool
   )
   ```

   Copy

Your `agent.py` should now look like this:

```python
from google.adk.agents import Agent
import httpx

def fetch_url(url: str) -> str:
    """Fetches the content of a URL."""
    with httpx.Client(follow_redirects=True) as client:
        response = client.get(url)
        response.raise_for_status()
        return response.text

root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction='Answer user questions to the best of your knowledge',
    tools=[fetch_url]
)
```

Copy

Alternatively, you can try `gemini-3.1-flash-lite-preview` instead of `gemini-2.5-flash` for similar capabilities and faster responses. Keep in mind that *preview* models on Vertex AI are provided *as-is*, and could undergo changes that are not backwards compatible.

## Testing your tool

Test your tool using the ADK web UI.

1. From your `agent-project` directory, start the web UI with hot-reloading:

   ```bash
   uv run adk web --reload_agents
   ```

   Copy

   If you use Cloud Shell, you need to add the `--allow_origins="*"` flag for the Web Preview feature to work: `uv run adk web --reload_agents --allow_origins="*"`.

1. If you've made changes to your agent, click **New Session** in the top right of the ADK web interface to reload the latest agent code.
2. In the chat interface, ask the agent to summarize the content of a URL. For example: `What's on wietsevenema.eu?`

The agent calls your `fetch_url` function, receives the HTML content, and then summarizes it to answer your question. The web UI's conversation panel displays the function call and the final summarized response.

![A chat interface showing the execution of a 'fetch_url' tool to retrieve blog post titles.](https://wietsevenema.eu/blog/2025/adding-a-tool-to-your-adk-agent/example.png)

## Why tools matter

Large Language Models (LLMs) used in isolation have some key limitations. Their knowledge is frozen at the time they were trained, and they cannot interact directly with the outside world. To address this, you can use *tool calling*.

## How tools work

1. With each prompt, the application provides the LLM with a list of available tools and their descriptions.
2. The LLM uses these descriptions to decide which tool (if any) can help fulfill the prompt.
3. Instead of running the tool itself, the LLM generates a structured output that specifies which tool it wants to use and what information to pass to it.
4. The application code receives this output, executes the actual tool, and then calls the LLM a second time, providing the tool's result as part of the new prompt.
5. The LLM then uses the tool's output to generate its final response to you.

## The importance of a good description

The docstring you write for your function (in this example, `"""Fetches the content of a URL."""`) is the primary way the LLM understands what the tool does. It's crucial that the description is clear, concise, and accurate.

### Why it's important

- **Discovery:** The LLM uses the description to determine if the tool is relevant to the user's request. A vague description might cause the model to overlook your tool when it's needed, or use it incorrectly.
- **Parameter Mapping:** The description, along with the function's parameter names and types, helps the model understand what arguments to pass. For your `fetch_url` function, the model knows it needs to provide a string for the `url` parameter because ADK tells it about it.

### Common failure modes

- **Vague or Ambiguous Descriptions:** If the description is unclear, the model might not know when to use the tool. For instance, `"Returns items in display order"` doesn't specify *what items* are returned and what *display order* exactly means.
- **Mismatch between Description and Functionality:** If the description says the tool does one thing but the code does another, the model will be confused and likely produce incorrect or unexpected results.
- **Confusing Parameter Names:** If you use non-descriptive variable names, the model may struggle to provide the correct inputs, leading to errors.

## Summary

You've learned how to add a tool to your ADK agent. By providing a Python function with a clear description, you can build agents that can fetch data, interact with APIs, and perform a wide range of tasks.

[![Signature](https://wietsevenema.eu/assets/signature.svg)](https://wietsevenema.eu/about/)

### References

[A fast way to get started with Agent Development Kit on Google Cloud](https://wietsevenema.eu/blog/2025/a-fast-way-to-get-started-with-adk/) (wietsevenema.eu)

### Recent posts

### More writing in 2026

I decided to commit to writing more on this blog in 2026 because writing helps me think clearly, and I've not been doing it enough lately.January 06, 2026

### 2025 in review

A summary of my 2025 writing, focusing on Gemini CLI, Agent Development Kit, and Python data visualization.December 28, 2025

### Forcing analysis mode in Gemini CLI with pseudo code

A prompt technique to stop Gemini CLI from rushing into implementation and instead discuss logic using annotated pseudo code.December 10, 2025





# Generative AI on Vertex AI quotas and system limits

This page provides a list of quotas by region and model, and shows you how to view and edit your quotas in the Google Cloud console.

## Tuned model quotas

Tuned model inference shares the same quota as the base model. There is no separate quota for tuned model inference.

## Embedding limits

For `gemini-embedding-001`, each request can have up to 250 input texts (generating 1 embedding per input text) and 20,000 tokens per request. Only the first 2,048 tokens in each input text are used to compute the embeddings.The [quota](https://docs.cloud.google.com/vertex-ai/docs/quotas#model-region-quotas) is listed under the name `gemini-embedding`.

### Embed content input tokens per minute per region per base_model

Unlike previous embedding models which were primarily limited by RPM quotas, the quota for the Gemini Embedding models limit the number of tokens that can be sent per minute per project.

| **Base model**                 | **Value** |
| :----------------------------- | :-------- |
| base_model: gemini-embedding   | 5,000,000 |
| base_model: gemini-embedding-2 | 5,000,000 |

## Vertex AI Agent Engine quotas

The following quotas apply to [Vertex AI Agent Engine](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview) for a given project in each region:

| Description                                                  | Quota | Metric                                                       |
| :----------------------------------------------------------- | :---- | :----------------------------------------------------------- |
| Create, delete, or update Vertex AI Agent Engine resources per minute | 10    | `aiplatform.googleapis.com/reasoning_engine_service_write_requests` |
| Create, delete, or update Vertex AI Agent Engine sessions per minute | 100   | `aiplatform.googleapis.com/session_write_requests`           |
| `Query` or `StreamQuery` Vertex AI Agent Engine per minute   | 90    | `aiplatform.googleapis.com/reasoning_engine_service_query_requests` |
| Append event to Vertex AI Agent Engine sessions per minute   | 300   | `aiplatform.googleapis.com/session_event_append_requests`    |
| Maximum number of Vertex AI Agent Engine resources           | 100   | `aiplatform.googleapis.com/reasoning_engine_service_entities` |
| Create, delete, or update Vertex AI Agent Engine memory resources per minute | 100   | `aiplatform.googleapis.com/memory_bank_write_requests`       |
| Get, list, or retrieve from Vertex AI Agent Engine Memory Bank per minute | 300   | `aiplatform.googleapis.com/memory_bank_read_requests`        |
| Sandbox environment (Code Execution) execute requests per minute | 1000  | `aiplatform.googleapis.com/sandbox_environment_execute_requests` |
| Sandbox environment (Code Execution) entities per region     | 1000  | `aiplatform.googleapis.com/sandbox_environment_entities`     |
| Sandbox environment (Code Execution) write requests per minute | 500   | `aiplatform.googleapis.com/sandbox_environment_write_requests` |
| A2A Agent post requests like `sendMessage` and `cancelTask`per minute | 60    | `aiplatform.googleapis.com/a2a_agent_post_requests`          |
| A2A Agent get requests like `getTask` and `getCard` per minute | 600   | `aiplatform.googleapis.com/a2a_agent_get_requests`           |
| Concurrent live bidirectional connections using the `BidiStreamQuery` API per minute | 10    | `aiplatform.googleapis.com/reasoning_engine_service_concurrent_query_requests` |

## Batch prediction

The quotas and limits for batch inference jobs are the same across all regions.

### Concurrent batch inference job limits for Gemini models

There are no predefined quota limits on batch inference for Gemini models. Instead, the batch service provides access to a large, shared pool of resources, dynamically allocated based on the model's real-time availability and demand across all customers for that model. When more customers are active and saturated the model's capacity, your batch requests might be queued for capacity.

### Concurrent batch inference job quotas non-Gemini models

The following table lists the quotas for the number of concurrent batch inference jobs, which don't apply to Gemini models:

| **Quota**                                                    | **Value** |
| :----------------------------------------------------------- | :-------- |
| `aiplatform.googleapis.com/textembedding_gecko_concurrent_batch_prediction_jobs` | 4         |

If the number of tasks submitted exceeds the allocated quota, the tasks are placed in a queue and processed when the quota capacity becomes available.

### View and edit the quotas in the Google Cloud console

To view and edit the quotas in the Google Cloud console, do the following:

1. Go to the **Quotas and System Limits** page.
2. [Go to Quotas and System Limits](https://console.cloud.google.com/iam-admin/quotas)
3. To adjust the quota, copy and paste the property `aiplatform.googleapis.com/textembedding_gecko_concurrent_batch_prediction_jobs` in the **Filter**. Press **Enter**.
4. Click the three dots at the end of the row, and select **Edit quota**.
5. Enter a new quota value in the pane, and click **Submit request**.