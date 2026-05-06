from utils.db import mongo

mongo.insert("test", {"msg": "MongoDB connected 🚀"})
print("Success!")