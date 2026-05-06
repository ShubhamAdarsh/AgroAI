memory_store = []

def save_memory(task, result):
    memory_store.append({
        "task": task,
        "result": result
    })

def get_memory():
    return memory_store