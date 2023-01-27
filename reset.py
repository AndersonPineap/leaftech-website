import pymongo
from random import randint
from hashlib import md5

print("连接数据库中")
database = pymongo.MongoClient("mongodb://localhost:27017/")['leaftech']

# a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

# for i in range(5000):
#     strg = ""
#     for j in range(10):
#         strg += a[randint(0,51)]
   
#     print(f"已添加{i+1}条数据")

database.user.delete_many({"name":{"$regex":".*"}})
database.user.insert_one({
        'username': "admin",
        'password': md5("password".encode("utf-8")).hexdigest(),
        'admin': True,
        'uplaod-article': [],
        'upload-code-pre': [],
        'task': [],
        'avatar': 'default.jpg'
    })
print(md5("password".encode("utf-8")).hexdigest())
print("done")