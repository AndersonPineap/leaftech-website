import os,json,base64,time
from hashlib import md5
from gevent import pywsgi
from flask import request,Flask,render_template,make_response,session,jsonify

def db_encode(db:dict,db_file:str)->bool:
    """数据库加密"""
    try:
        with open(db_file,mode="w",encoding="utf-8") as f:
            f.write((base64.b64encode(json.dumps(db).encode("utf-8"))).decode("utf-8"))
        return True
    except:
        return False

def db_decode(db:str)->dict:
    """数据库解密"""
    with open(db,mode="r",encoding="utf-8") as f:
        data = f.read()
    try:
        return json.loads(base64.b64decode(data.encode("utf-8")).decode("utf-8"))
    except:
        return {}

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/')
def home():
    """根节点"""
    if 'username' in session:
        username = session["username"]
        return render_template('index.html',
                                username=username,
                                articles = db_decode('articledb').values()
                                )
    else:
        return render_template('sign_in.html')

@app.route('/login', methods = ['POST'])
def login():
    """登录api"""
    userdb = db_decode('userdb')
    username = request.form["username"]
    password = request.form["password"]
    print(f"{username} is logged in")
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

@app.route('/article/upload',methods=['POST', 'GET'])
def getArticle():
    """编辑和上传文章"""
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
        articledb = db_decode('articledb')
        articledb[uid] = {
            "title": title,
            "editor": editor,
            "article": article,
            "uid": uid
        }
        if db_encode(articledb,'articledb'):
            res = {
                "code": 200,
                "uid": uid
            }
        else:
            res = {
                "code": 300
            }
        return jsonify(res)

@app.route('/article/<uid>',methods=['GET'])
def sendArticle(uid):
    """获取制定文章"""
    try:
        articledb = db_decode('articledb')
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

@app.route('/article/',methods=['GET'])
def articlelist():
    """获取所有文章列表"""
    return '<h1>开发中</h1>'

if __name__ == "__main__":
    server =  pywsgi.WSGIServer(('0.0.0.0',8080),app)
    server.serve_forever()