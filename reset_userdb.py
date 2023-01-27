import json,base64
from hashlib import md5

choice = input("确认重置用户数据库？(y/n):")
if choice == "y":
    print("重置",end="...")
    user = {
        "admin": {
            "password": md5("password".encode("utf-8")).hexdigest(),
            "admin": True
        }
    }
    user = json.dumps(user)
    user_b = user.encode("utf-8")
    bs = base64.b64encode(user_b)
    user = bs.decode("utf-8")
    with open("userdb",mode="w",encoding="utf-8") as f:
        f.write(user)
    print("完成")
    input("初始账号:\n帐: admin\n密: password\n输入任意键退出")
    exit()
else:
    print("取消")
    exit()
