import pymongo
from os import urandom

print("连接数据库中", end="...")
try:
    database = pymongo.MongoClient(
        "mongodb://localhost:27017/")['leaftech']
except:
    print("连接失败，请检查数据库是否在线，在线的话我也不知道为什么")
print("done\n填充", end="...")
try:
    # database.user.update_one({"username": "visit"},{"$set":{"class":"编程部"}})
    # database.user.update_one({"username": "admin"},{"$set":{"class":"leaf studio"}})
    database.article.delete_many({"author": "测试数据"})
except:
    print("失败，我也不知道为什么")
print("done")
