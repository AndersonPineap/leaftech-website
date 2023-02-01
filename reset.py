import pymongo
from random import randint
from hashlib import md5

try:
    sure = input("此操作不可逆，确定继续(在你输入确认字符前你随时可以按下 ctrl+c 中止程序)？(y/n): ")
    level = input("请输入要删除的年级段账户：")
    if sure == 'y':
        t="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRESTUVWXYZ1234567890_-[].?"
        check = "yes"
        for i in range(16):
            check += t[randint(0,len(t)-1)]
        print(f"如果确定删除{level}年级段所有账户请输入以下确认字符以继续：\n{check}\n如果不，请按下 ctrl+c")
        t = input("输入：")
        if t == check:
            print("连接数据库中",end="...")
            try:
                database = pymongo.MongoClient("mongodb://localhost:27017/")['leaftech']
            except:
                print("连接失败，请检查数据库是否在线，在线的话我也不知道为什么")
            print("done\n擦除数据中",end="...")
            try:
                database.user.delete_many({"level": int(level)})
            except:
                print("擦除失败，我也不知道为什么")
            print("done\n完成")
            # try:
            #     database.user.insert_one({
            #             'username': "admin",
            #             'password': md5("password".encode("utf-8")).hexdigest(),
            #             'admin': True,
            #             'upload-article': [],
            #             'upload-code-pre': [],
            #             'task': [],
            #             'avatar': 'default.jpg',
            #             'class': 'leaf stuido',
            #             'level': 'weryugvbnaoigufawkdajhdbwnklfawjp'
            #         })
            # except:
            #     print("失败，我也不知道为什么")
            # print("done")
            # print("账户：admin")
            # print("密码md5："+md5("password".encode("utf-8")).hexdigest())
            # print("萨哟那拉，bye")
except KeyboardInterrupt:
    print("明智的选择")