from utils.llm import call_llm
from utils.db import mongo
import json
import re


def extract_json(text):
    try:
        match = re.search(r'\{.*?\}', text, re.DOTALL)
        if match:
            json_str = match.group()

            # 🔥 Fix single quotes → double quotes
            json_str = json_str.replace("'", '"')

            return json.loads(json_str)
    except Exception as e:
        print("JSON parse error:", e)

    return {
        "crop": "unknown",
        "reason": text.strip()
    }


def executor_agent(plan, research):
    system_prompt = "You are an agricultural decision expert."

    user_input = f"""
Use the following information:

PLAN:
{plan}

RESEARCH:
{research}

Recommend the BEST crop.

Return STRICT JSON ONLY (valid JSON format):

{{
  "crop": "crop name",
  "reason": "markdown explanation"
}}

Rules:
- Use DOUBLE quotes only (")
- Do NOT use single quotes (')
- Do NOT add text outside JSON
"""

    response = call_llm(system_prompt, user_input)

    print("LLM RAW RESPONSE:", response)

    result = extract_json(response)

    mongo.insert("agent_memory", {
        "agent": "executor",
        "task": "final_decision",
        "output": result
    })

    return result