import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def call_llm(system_prompt, user_input):
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",  # optional but recommended
            "X-Title": "Multi-Agent AI System"
        },
       json={
    "model": "openai/gpt-oss-120b",
    "messages": [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
}
    )

    data = response.json()

    return data["choices"][0]["message"]["content"]