import pymongo
import datetime
import json
import re
from bson import ObjectId, DatetimeMS
from api import api_blueprint
from flask import jsonify, request, session

database = pymongo.MongoClient("mongodb://localhost:27017/")['leaftech']


class bsonEncoder(json.JSONEncoder):
    """
    作为`cls`参数传入`json.dumps()`使其能够解析数据库中的bson对象
    """

    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, DatetimeMS):
            return str(obj)
        return json.JSONEncoder.default(self, obj)

# 以下是账户系api


@api_blueprint.route('/account/sign', methods=['POST'])
# 登入
def handle_account_sign():
    usr = request.form["usr"]
    pwd = request.form["pwd"]
    try:
        tuser = json.loads(json.dumps(database.user.find_one(
            {"username": usr}, {"_id": 0, 'upload-article': 0}), cls=bsonEncoder))
        if tuser and pwd == tuser['password']:
            global session
            session['user'] = tuser
            return jsonify({"code": 200})
        return jsonify({"code": 300})
    except:
        return jsonify({"code": 300})


@api_blueprint.route('/account/signout', methods=['POST'])
# 登出
def handle_account_sign_out():
    try:
        global session
        session.clear()
        return jsonify({"code": 200, "result": True})
    except:
        return jsonify({"code": 500, "result": False})


@api_blueprint.route('/account/create', methods=['POST'])
# 创建账户
def handle_account_create():
    if not session['user']['admin']: return jsonify({"code": 300, "result": "此账户无权创建账户"})
    try:
        print(request.form)
        database["user"].insert_one({
            'username': request.form['account-usr'],
            'password': request.form['account-pwd'],
            'admin': bool(request.form['account-admin']),
            'upload-article': [],
            'upload-code-pre': [],
            'task': [],
            'avatar': 'default.jpg',
            'class': request.form['account-class'],
            'level': datetime.datetime.today().year
        })
        return jsonify({"code": 200, "result": "ok"})
    except:
        return jsonify({"code": 500, "result": "用户名已存在"})


@api_blueprint.route('/account/list', methods=['GET'])
# 搜索账户
def handle_account_search():
    try:
        start = int(request.args.get('start'))
        l = database['user'].count_documents({"class":{"$regex":"."}})
        d = database['user'].find({}, {
            "password": 0, "task": 0}).skip(start).limit(20)
        li = []
        for i in d:
            li.append(i)
        res = {
            "code": 200,
            "result": "ok",
            "allDatalen": l,
            "data": json.loads(json.dumps(li, cls=bsonEncoder))
        }
        if res['allDatalen']-(start+20) >= 0:
            res['next'] = start+20
        else:
            res['next'] = None
        return jsonify(res)
    except: return jsonify({"code": 500, "result": "服务器问题"})


@api_blueprint.route('/account/update', methods=['POST'])
# 修改密码
def handle_account_update():
    global session
    pwd = request.form['pwd']
    new = request.form['new']
    try:
        tuser = json.loads(json.dumps(database.user.find_one(
            {"username": session['user']['username']}, {"_id": 0}), cls=bsonEncoder))
    except:
        return jsonify({"code": 500, "result": "服务器没找到要修改的账户，请检查登录状态"})
    print(tuser['password'])
    print(pwd)
    if pwd == tuser['password']:
        try:
            database.user.update_one({"username": session['user']['username']}, {
                                     "$set": {"password": new}})
            return jsonify({"code": 200, "result": "成功"})
        except:
            return jsonify({"code": 500, "result":  "信息更新失败，请联系负责人"})
    else:
        return jsonify({"code": 300, "result": "验证失败"})


@api_blueprint.route('/account/article', methods=['GET'])
# 获取用户所有文章
def handle_account_article():
    try:
        result = []
        for i in database.user.find_one({"username": session['user']['username']}, {"_id":0, "upload-article": 1})['upload-article']:
            result.append(database.article.find_one(
                {'_id': i}, {'article': 0}))
        res = {
            "code": 200,
            "result": "ok",
            "data": json.loads(json.dumps(result, cls=bsonEncoder))
        }
        return jsonify(res)
    except:
        return jsonify({"code": 500, "result": "server error"})


@api_blueprint.route('/account/delete', methods=['POST'])
# 删除账户
def handle_account_delete():
    if not session['user']['admin']: return jsonify({"code":300,"result":"请先登入"})
    try:
        usr = request.form['usr']
        if database.user.find_one({"username": usr},{"_id":0,"admin": 1})["admin"]: return jsonify({"code":400,"result":"不能删除管理员"})
        database.user.delete_one({"username": usr})
        return jsonify({"code": 200})
    except:
        return jsonify({"code": 500, "result": "服务器问题"})

# 以下是文章系api


@api_blueprint.route('/article/upload', methods=['POST'])
# 上传/更新文章
def handle_article_upload():
    try:
        title = request.form['title']
        article = request.form['article']
        author = session['user']['username']
        uptype = request.form['type']
        if uptype == "new":
            id = database.article.insert_one({
                "title": title,
                "article": article,
                "author": author
            })
            database.user.update_one({"username": author}, {"$push": {
                                     "upload-article": ObjectId(id.inserted_id)}})
            return jsonify({"code": 200, "id": str(id.inserted_id)})
        elif uptype == "update":
            id = request.form['id']
            if author == database.article.find_one({"_id": ObjectId(id)})['author'] or session['user']['admin']:
                database.article.update_one({"_id": ObjectId(id)}, {
                                            "$set": {"title": title, "article": article}})
                return jsonify({"code": 200})
            return jsonify({"code": 400})
    except:
        return jsonify({"code": 300})


@api_blueprint.route('/article/delete', methods=['POST'])
# 删除文章
def handle_article_delete():
    try:
        id = request.form['id']
        tar = database.article.find_one({"_id": ObjectId(id)})['author']
        if session['user']['username'] == tar or session['user']['admin']:
            database.user.update_one({"username": tar},{"$pull": {"upload-article":ObjectId(id)}})
            database.article.delete_one({"_id": ObjectId(id)})
            return jsonify({"code": 200})
        return jsonify({"code": 400})
    except:
        return jsonify({"code": 500})


@api_blueprint.route('/article/get', methods=['GET'])
# 获取文章内容
def handle_article_get():
    try:
        id = request.args.get('id')
        data = database.article.find_one({"_id": ObjectId(id)})
        if session['user']['username'] == data['author'] or session['user']['admin']:
            data['edit'] = True
        else:
            data['edit'] = False
        data = json.loads(json.dumps(data, cls=bsonEncoder))
        return jsonify(data)
    except:
        return 404


@api_blueprint.route('/article/search', methods=['GET'])
# 搜索文章
def handle_article_search():
    try:
        keywords = request.args.get('keywords')
        sortKey = request.args.get('sortk')
        sortIndex = int(request.args.get('sorti'))
        if keywords == None or keywords == "":
            keywords = ".*"
        start = int(request.args.get('start'))
        regex = re.compile(keywords, re.IGNORECASE)
        l = database.article.count_documents(
            {"$or": [{"title": regex}, {"author": regex}]})
        d = database.article.find({"$or": [{"title": regex}, {"author": regex}]}, {
                                  "article": 0}).sort(sortKey,sortIndex).skip(start).limit(20)
        li = []
        for i in d:
            li.append(i)
        res = {
            "code": 200,
            "result": "ok",
            "allDatalen": l,
            "data": json.loads(json.dumps(li, cls=bsonEncoder))
        }
        if res['allDatalen']-(start+20) >= 0:
            res['next'] = start+20
        else:
            res['next'] = None
        return jsonify(res)
    except:
        return jsonify({"code": 500, "result": "bad request"})

# 以下是任务系api
@api_blueprint.route('/task/create', methods=['POST'])
# 创建任务
def handle_task_create():
    print(request.form)
    try:
        title = request.form['title']
        msg = request.form['message']
        order = request.form['order']
        tarcls = request.form['class']
    except: return jsonify({"code": 300, "result": "参数错误"})
    try:
        time = datetime.datetime.today()
        id = database.task.insert_one({
            "title": title,
            "message": msg,
            "order": order,
            "class": tarcls,
            "time": f"{time.year}+{time.month}+{time.day}"
        })
        database.user.update_many({"class": tarcls}, {"$push":{"task", ObjectId(id.inserted_id)}})
        return jsonify({"code": 200, "user":session['user']['username'], "class": session['user']['class']})
    except: return jsonify({"code": 500, "result": "服务器问题"})

@api_blueprint.route('/task/get', methods=['GET'])
def handle_task_search():
    try:
        start = int(request.args.get('start'))
        l = database.article.count_documents()
        d = database.article.find({}).sort("_id",1).skip(start).limit(20)
        li = []
        for i in d:
            li.append(i)
        res = {
            "code": 200,
            "result": "ok",
            "allDatalen": l,
            "data": json.loads(json.dumps(li, cls=bsonEncoder))
        }
        if res['allDatalen']-(start+20) >= 0:
            res['next'] = start+20
        else:
            res['next'] = None
        return jsonify(res)
    except:
        return jsonify({"code": 500, "result": "bad request"})