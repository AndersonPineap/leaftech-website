import json,base64
from hashlib import md5

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

