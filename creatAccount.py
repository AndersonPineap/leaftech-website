import pymongo
from datetime import datetime
from random import randint
from hashlib import md5
usr = input("用户名：")
pwd = input("密码：")
print("连接数据库中", end="...")
try:
    database = pymongo.MongoClient(
        "mongodb://localhost:27017/")['leaftech']
except:
    print("连接失败，请检查数据库是否在线，在线的话我也不知道为什么")
print("done\n创建账户", end="...")
try:
    database.user.insert_one({
        'username': usr,
        'password': md5(pwd.encode("utf-8")).hexdigest(),
        'admin': True,
        'uplaod-article': [],
        'upload-code-pre': [],
        'task': [],
        'avatar': 'default.jpg',
        'level': datetime.today().year
    })
except:
    print("失败，我也不知道为什么")
print("done")
print(f"账户：{usr}")
print("密码md5："+md5("password".encode("utf-8")).hexdigest())
print("默认为管理员（可在代码中修改）")
print(f"账户level:{datetime.today().year}")
print("萨哟那拉，bye")
