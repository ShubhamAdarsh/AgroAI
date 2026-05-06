from pymongo import MongoClient
from datetime import datetime

class MongoDB:
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["multi_agent_ai"]

    def insert(self, collection, data):
        data["created_at"] = datetime.now()
        return self.db[collection].insert_one(data)

    def find(self, collection, query={}):
        return list(self.db[collection].find(query))

    def update(self, collection, query, new_values):
        return self.db[collection].update_many(query, {"$set": new_values})
    
    def find_one(self, collection, query):
        return self.db[collection].find_one(query)
    

mongo = MongoDB()