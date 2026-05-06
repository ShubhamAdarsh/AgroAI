from utils.db import mongo

def crop_usecase(task, farmer_id="F001"):
    
    # 🧠 Step 1: Fetch previous recommendations
    previous_data = mongo.find("recommendations", {"farmer_id": farmer_id})

    # 🧾 Step 2: Create agent prompts (your original logic + memory)
    prompts = {
        "soil": f"Analyze soil conditions for: {task}",
        "weather": f"Analyze weather suitability for: {task}",
        "market": f"Analyze market demand for crops based on: {task}",
        "decision": f"""
        Based on:
        - Soil analysis
        - Weather conditions
        - Market demand
        - Previous recommendations: {previous_data}

        Recommend the best crop for: {task}
        and explain why.
        """
    }

    return prompts

def save_recommendation(farmer_id, task, result):
    mongo.insert("recommendations", {
        "farmer_id": farmer_id,
        "task": task,
        "recommended_crop": result.get("crop"),
        "reason": result.get("reason")
    })