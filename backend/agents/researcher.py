from utils.llm import call_llm
from utils.db import mongo


def researcher_agent(task):
    """
    Researcher Agent:
    Provides insights on soil, weather, and market.
    """

    system_prompt = "You are an agricultural research expert."

    user_input = f"""
    Analyze the following farming conditions:
    {task}

    Provide:
    - Soil suitability insights
    - Weather compatibility
    - Market demand trends

    Give clear and useful insights.
    """

    response = call_llm(system_prompt, user_input)

    # 💾 Store memory
    mongo.insert("agent_memory", {
        "agent": "researcher",
        "task": task,
        "output": response
    })

    print("\n🔎 Researcher Agent Completed\n")

    return response