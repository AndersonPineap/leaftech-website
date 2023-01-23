import time
from os import urandom
from json import loads, dumps
from base64 import b64encode, b64decode
from hashlib import md5
from gevent import pywsgi
from flask import request, Flask, render_template, make_response, session, jsonify


def db_encode(db: dict, db_file: str) -> bool:
    """数据库加密"""
    try:
        with open(db_file, mode="w", encoding="utf-8") as f:
            f.write((b64encode(dumps(db).encode("utf-8"))).decode("utf-8"))
        return True
    except:
        return False


def db_decode(db: str) -> dict:
    """数据库解密"""
    with open(db, mode="r", encoding="utf-8") as f:
        data = f.read()
    try:
        return loads(b64decode(data.encode("utf-8")).decode("utf-8"))
    except:
        return {}


print("读取数据库", end="...")
userdb = db_decode('userdb')
articledb = db_decode('articledb')
taskdb = db_decode('taskdb')
print("完成")

app = Flask(__name__)
app.secret_key = urandom(24)


@app.route('/', methods=['GET'])
def home():
    """根节点"""
    if 'username' in session:
        return render_template('index.html',
                               username=session['username'],
                               articles=db_decode('articledb').values(),
                               admin=session['admin']
                               )
    else:
        return render_template('sign_in.html')


@app.route('/login', methods=['POST'])
def login():
    """登录api"""
    username = request.form["username"]
    password = request.form["password"]
    print(f"{username} is logged in")
    if username in userdb.keys():
        if password == userdb[username]["password"]:
            # 登录成功
            session['username'] = username
            session['admin'] = userdb[username]['admin']
            res = {
                'code': 200
            }
        else:
            # 密码错误
            res = {
                'code': 300
            }
    else:
        # 账号不存在
        res = {
            'code': 400
        }
    return jsonify(res)


@app.route('/article/upload', methods=['POST', 'GET'])
def getArticle():
    """编辑和上传文章"""
    if request.method == "GET":
        return render_template('mark_editor.html')
    elif request.method == "POST":
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
        articledb[uid] = {
            "title": title,
            "editor": editor,
            "article": article,
            "uid": uid
        }
        if db_encode(articledb, 'articledb'):
            res = {
                "code": 200,
                "uid": uid
            }
        else:
            res = {
                "code": 300
            }
        return jsonify(res)
    else:
        return None


@app.route('/article/<uid>', methods=['GET'])
def sendArticle(uid):
    """获取指定文章"""
    try:
        data = articledb.get(uid)
        if data == None:
            return render_template('404.html')
        return render_template('article.html',
                               title=data["title"],
                               editor=data['editor'],
                               article=data['article'],
                               uid=data["uid"]
                               )
    except:
        return render_template('404.html')


@app.route('/article/', methods=['GET'])
def articlelist():
    """获取所有文章列表"""
    return render_template('article_list.html',articles=db_decode('articledb').values())


@app.route('/search/<keyword>', methods=['GET'])
def search(keyword):
    return render_template('search.html')


@app.route('/task', methods=['GET'])
def task():
    if request.method == 'GET':
        list_type = request.args.get('type')
        return render_template('task.html',
                               list_type=list_type
                               )
    else:
        post_data = request.form

@app.route('/userdb', methods=['GET','POST'])
def userdb_set():
    if session['admin']:
        return render_template('404.html')
    if request.method == 'GET':
        return render_template('userdb.html')
    elif request.method == 'POST':
        set_type = request.form['type']
        if set_type == 'create':
            pass
        elif set_type == 'delete':
            pass
        elif set_type == 'change':
            pass
        else:
            res = {
                "code": 300
            }
            return jsonify(res)
    else:
        return None


if __name__ == "__main__":
    server = pywsgi.WSGIServer(('0.0.0.0', 8080), app)
    ip,port = server.address
    print(f"监听服务已启动于{ip}:{port}\n按下Ctrl+C以停止")
    server.serve_forever()
