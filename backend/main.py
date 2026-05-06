from core.orchestrator import run_crop_pipeline

if __name__ == "__main__":
    task = input("Enter farming conditions (soil, weather, etc): ")
    
    result = run_crop_pipeline(task)

    print("\n🌾 Final Recommendation:")
    print(result)