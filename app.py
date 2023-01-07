import os,json,base64
from hashlib import md5
from gevent import pywsgi
from flask import request,Flask,render_template,make_response,session,jsonify

# 数据库加密
def userdb_encode(db:dict)->bool:
    try:
        with open('userdb',mode="w",encoding="utf-8") as f:
            f.write((base64.b64encode(json.dumps(db).encode("utf-8"))).decode("utf-8"))
        return True
    except:
        return False

# 数据库解密
def userdb_decode(db:str)->dict:
    return json.loads(base64.b64decode(db.encode("utf-8")).decode("utf-8"))

app = Flask(__name__)
app.secret_key = os.urandom(24)

# 根节点
@app.route('/')
def home():
    if 'username' in session:
        username = session["username"]
        return render_template('index.html',
                                username=username
                                )
    else:
        return render_template('sign_in.html')

# 登录api
@app.route('/login', methods = ['POST'])
def login():
    with open('userdb',mode="r",encoding="utf-8") as f:
        userdb = userdb_decode(f.read())
    print(userdb)
    username = request.form["username"]
    password = request.form["password"]
    print(f"username is {username}, password is {password}")
    if username in userdb.keys():
        if password == userdb[username]["password"]:
            # 登录成功
            session['username'] = username
            res = {
                'code':200
            }
            return jsonify(res)
        else:
            # 密码错误
            res = {
                'code':300
            }
            return jsonify(res)
    else:
        # 账号不存在
        res = {
            'code':400
        }
        return jsonify(res)

server =  pywsgi.WSGIServer(('0.0.0.0',8080),app)
server.serve_forever()