import pymongo
from random import randint
from hashlib import md5

sure = input("此操作不可逆，确定继续？(y/n): ")
if sure == 'y':
    t="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRESTUVWXYZ1234567890_-[].?"
    check = "yes"
    for i in range(16):
        check += t[randint(0,len(t)-1)]
    print(f"输入以下字符以继续：\n{check}")
    t = input("输入：")
    if t == check:
        print("连接数据库中",end="...")
        try:
            database = pymongo.MongoClient("mongodb://localhost:27017/")['leaftech']
        except:
            print("连接失败，请检查数据库是否在线，在线的话我也不知道为什么")
        print("done\n擦除数据中",end="...")
        try:
            database.article.delete_many({"name":{"$regex": ".*"}})
            database.user.delete_many({"name":{"$regex":".*"}})
        except:
            print("擦除失败，我也不知道为什么")
        print("done\n创建初始账户",end="...")
        try:
            database.user.insert_one({
                    'username': "admin",
                    'password': md5("password".encode("utf-8")).hexdigest(),
                    'admin': True,
                    'uplaod-article': [],
                    'upload-code-pre': [],
                    'task': [],
                    'avatar': 'default.jpg'
                })
        except:
            print("失败，我也不知道为什么")
        print("done")
        print("账户：admin")
        print("密码md5："+md5("password".encode("utf-8")).hexdigest())
        print("萨哟那拉，bye")