from utils.llm import call_llm
from utils.db import mongo


def planner_agent(task):
    """
    Planner Agent:
    Breaks the task into structured steps.
    """

    system_prompt = "You are an expert planning agent for agricultural decision-making."

    user_input = f"""
    Task:
    {task}

    Break this into clear steps to determine the best crop.

    Focus on:
    - Soil analysis
    - Weather conditions
    - Market demand
    - Decision strategy

    Provide structured steps.
    """

    response = call_llm(system_prompt, user_input)

    # 💾 Store memory
    mongo.insert("agent_memory", {
        "agent": "planner",
        "task": task,
        "output": response
    })

    print("\n📌 Planner Agent Completed\n")

    return response