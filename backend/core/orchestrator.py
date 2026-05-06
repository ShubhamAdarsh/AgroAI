from agents.planner import planner_agent
from agents.researcher import researcher_agent
from agents.executor import executor_agent
from agents.critic import critic_agent

from usecases.crop import crop_usecase, save_recommendation
from utils.db import mongo


def run_crop_pipeline(task, farmer_id="F001"):
    print("\n🚀 Starting Multi-Agent Crop Recommendation System...\n")

    # 🧠 Step 1: Generate prompts for each agent
    prompts = crop_usecase(task, farmer_id)

    # 🧩 Step 2: Planner Agent
    plan = planner_agent(prompts["decision"])
    mongo.insert("agent_memory", {
        "agent": "planner",
        "task": task,
        "output": plan
    })
    print("📌 Planner Output:", plan)

    # 🔍 Step 3: Researcher Agent
    research = researcher_agent(prompts["soil"] + "\n" + prompts["weather"] + "\n" + prompts["market"])
    mongo.insert("agent_memory", {
        "agent": "researcher",
        "task": task,
        "output": research
    })
    print("🔎 Researcher Output:", research)

    # ⚙️ Step 4: Executor Agent
    execution = executor_agent(plan, research)
    mongo.insert("agent_memory", {
        "agent": "executor",
        "task": task,
        "output": execution
    })
    print("⚙️ Executor Output:", execution)

    # 🧐 Step 5: Critic Agent
    feedback = critic_agent(execution)
    mongo.insert("agent_memory", {
        "agent": "critic",
        "task": task,
        "output": feedback
    })
    print("🧐 Critic Feedback:", feedback)

    # 🏁 Step 6: Final Output (You can improve this later)
    final_output = {
        "crop": execution if isinstance(execution, str) else str(execution),
        "reason": feedback if isinstance(feedback, str) else str(feedback)
    }

    # 💾 Step 7: Save Recommendation
    save_recommendation(
        farmer_id=farmer_id,
        task=task,
        result=final_output
    )

    # 📜 Step 8: Log System Execution
    mongo.insert("system_logs", {
        "task": task,
        "final_output": final_output
    })

    print("\n✅ Final Recommendation:", final_output)
    print("💾 Data saved to MongoDB\n")

    return final_output