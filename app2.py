import time
from os import urandom
from api import api_blueprint
from flask import Flask, render_template, session,request
from gevent import pywsgi

app = Flask(__name__)
app.secret_key = urandom(24)
app.debug = True

@app.route('/', methods=['GET'])
def handle_root():
    global session
    if 'user' in session:
        return render_template('index.html',
                               username=session['user']['username'],
                               admin=session['user']['admin']
                               )
    else:
        return render_template('sign.html')

@app.route('/article', methods=['GET'])
def handle_article_page():
    return render_template('article_search.html')

@app.route('/article/editor', methods=['GET'])
def handle_article_editor():
    uptype = request.args.get('type')
    if uptype == "new":
        return render_template('mark_editor.html', uptype=uptype)
    return render_template('mark_editor.html', uptype=uptype, id=request.args.get('id'))

@app.route('/article/<id>', methods=['GET'])
def handle_article(id):
    return render_template('article.html', id=id)

app.register_blueprint(api_blueprint)

server = pywsgi.WSGIServer(('0.0.0.0',8080),app)
server.serve_forever()