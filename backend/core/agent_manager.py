from usecases.crop import crop_usecase
from usecases.coding import coding_usecase
from usecases.research import research_usecase

def get_prompt(use_case, task):
    if use_case == "1":
        return crop_usecase(task)
    elif use_case == "2":
        return coding_usecase(task)
    elif use_case == "3":
        return research_usecase(task)