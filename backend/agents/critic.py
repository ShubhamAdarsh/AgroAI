from utils.llm import call_llm
from utils.db import mongo


def critic_agent(execution_result):
    """
    Critic Agent:
    Evaluates and improves the recommendation.
    """

    system_prompt = "You are a critical agricultural expert."

    user_input = f"""
    Evaluate this crop recommendation:

    {execution_result}

    Check:
    - Is the crop suitable?
    - Any risks involved?
    - Can it be improved?

    Provide short constructive feedback.
    """

    response = call_llm(system_prompt, user_input)

    # 💾 Store memory
    mongo.insert("agent_memory", {
        "agent": "critic",
        "task": "evaluation",
        "output": response
    })

    print("\n🧐 Critic Agent Completed\n")

    return response