import pymongo
import json
import re
from bson import ObjectId, DatetimeMS
from api import api_blueprint
from flask import jsonify, request, session

database = pymongo.MongoClient("mongodb://localhost:27017/")['leaftech']


class bsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, DatetimeMS):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


@api_blueprint.route('/account/sign', methods=['POST'])
def handle_account_sign():
    usr = request.form["usr"]
    pwd = request.form["pwd"]
    tuser = json.loads(json.dumps(list(database.user.find(
        {"username": usr}, {"_id": 0}))[0], cls=bsonEncoder))
    if tuser and pwd == tuser['password']:
        global session
        session['user'] = tuser
        return jsonify({"code": 200})
    return jsonify({"code": 300})


@api_blueprint.route('/account/create', methods=['POST'])
def handle_account_create():
    database["user"].insert_one({
        'username': request.form['username'],
        'password': request.form['password'],
        'admin': request.form['admin'],
        'uplaod-article': [],
        'upload-code-pre': [],
        'task': [],
        'avatar': 'default.jpg'
    })
    return jsonify({"status": 200, "result": "ok"})


@api_blueprint.route('/account/search', methods=['GET'])
def handle_account_search():
    keywords = request.args.get('usr')
    blur = request.args.get('blur')
    print(blur)
    if keywords == None or keywords == "":
        keywords = ".*"
        blur = "true"
    start = int(request.args.get('start'))
    if blur == "true":
        l = database['user'].count_documents(
            {"username": re.compile(keywords, re.IGNORECASE)})
        d = database['user'].find({"username": re.compile(keywords, re.IGNORECASE)}, {
                                  "password": 0, "task": 0}).skip(start).limit(20)
    else:
        d = database['user'].find({"username": keywords}, {
                                  "password": 0, "task": 0}).skip(start).limit(20)
        l = database['user'].count_documents({"username": keywords})
    li = []
    for i in d:
        li.append(i)
    res = {
        "status": 200,
        "result": "ok",
        "allDatalen": l,
        "data": json.loads(json.dumps(li, cls=bsonEncoder))
    }
    if res['allDatalen']-(start+20) >= 0:
        res['next'] = start+20
    else:
        res['next'] = None
    return jsonify(res)


@api_blueprint.route('/account/delete', methods=['POST'])
def handle_account_delete():
    pass


@api_blueprint.route('/article/upload', methods=['POST'])
def handle_article_upload():
    try:
        title = request.form['title']
        article = request.form['article']
        author = session['user']['username']
        uptype = request.form['type']
        if uptype == "new":
            database.article.insert_one({
                "title": title,
                "article": article,
                "author": author
            })
            database.user.update_one({"username": author}, {"$set": {
                                     "upload-article": list(database.article.find({"author": author}, {"_id": 1}))}})
            return jsonify({"code": 200})
        elif uptype == "update":
            id = request.form['id']
            if author == database.article.find_one({"_id": ObjectId(id)})['author']:
                database.article.update_one({"_id": ObjectId(id)}, {
                                            "$set": {"title": title, "article": article}})
                return jsonify({"code": 200})
            return jsonify({"code": 400})
    except:
        return jsonify({"code": 300})


@api_blueprint.route('/article/get', methods=['GET'])
def handle_article_get():
    id = request.args.get('id')
    data = database.article.find_one({"_id": ObjectId(id)})
    if session['user']['username'] == data['author']:
        data['edit'] = True
    else:
        data['edit'] = False
    data = json.loads(json.dumps(data, cls=bsonEncoder))
    return jsonify(data)


@api_blueprint.route('/article/search', methods=['GET'])
def handle_article_search():
    keywords = request.args.get('keywords')
    if keywords == None or keywords == "":
        keywords = ".*"
    start = int(request.args.get('start'))
    l = database.article.count_documents(
        {"title": re.compile(keywords, re.IGNORECASE)})
    d = database.article.find({"title": re.compile(keywords, re.IGNORECASE)}, {
                              "article": 0}).skip(start).limit(20)
    li = []
    for i in d:
        li.append(i)
    res = {
        "status": 200,
        "result": "ok",
        "allDatalen": l,
        "data": json.loads(json.dumps(li, cls=bsonEncoder))
    }
    if res['allDatalen']-(start+20) >= 0:
        res['next'] = start+20
    else:
        res['next'] = None
    return jsonify(res)
