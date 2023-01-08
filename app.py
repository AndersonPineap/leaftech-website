import os,json,base64,time
from hashlib import md5
from gevent import pywsgi
from flask import request,Flask,render_template,make_response,session,jsonify

# 数据库加密
def db_encode(db:dict,db_file:str)->bool:
    try:
        with open(db_file,mode="w",encoding="utf-8") as f:
            f.write((base64.b64encode(json.dumps(db).encode("utf-8"))).decode("utf-8"))
        return True
    except:
        return False

# 数据库解密
def db_decode(db:str)->dict:
    with open(db,mode="r",encoding="utf-8") as f:
        data = f.read()
    return json.loads(base64.b64decode(data.encode("utf-8")).decode("utf-8"))

app = Flask(__name__)
app.secret_key = os.urandom(24)

# 根节点
@app.route('/')
def home():
    if 'username' in session:
        username = session["username"]
        return render_template('index.html',
                                username=username,
                                articles = db_decode('articledb').values()
                                )
    else:
        return render_template('sign_in.html')

# 登录api
@app.route('/login', methods = ['POST'])
def login():
    userdb = db_decode('userdb')
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
        else:
            # 密码错误
            res = {
                'code':300
            }
    else:
        # 账号不存在
        res = {
            'code':400
        }
    return jsonify(res)

# 编辑和上传文章
@app.route('/article/upload',methods=['POST', 'GET'])
def getArticle():
    if request.method == "GET":
        return render_template('mark_editor.html')
    else:
        print(request.form)
        try:
            editor = session["username"]
        except:
            res = {
                "code": 400
            }
            return jsonify(res)
        article = request.form["article"]
        title = request.form["title"]
        uid = md5((str(time.time())+title).encode("utf-8")).hexdigest()
        try:
            articledb = db_decode('articledb')
        except:
            articledb = {}
        print(articledb)
        articledb[uid] = {
            "title": title,
            "editor": editor,
            "article": article,
            "uid": uid
        }
        try:
            db_encode(articledb,'articledb')
            res = {
                "code": 200,
                "uid": uid
            }
        except:
            res = {
                "code": 300
            }
        return jsonify(res)

@app.route('/article/<uid>',methods=['GET'])
def sendArticle(uid):
    try:
        articledb = db_decode('articledb')
        print(articledb)
        data = articledb.get(uid)
        if data == None:
            return render_template('404.html')
        return render_template('article.html',
                        title = data["title"],
                        editor = data['editor'],
                        article = data['article'],
                        uid = data["uid"]
                        )
    except:
        return render_template('404.html')

server =  pywsgi.WSGIServer(('0.0.0.0',8080),app)
server.serve_forever()