import time
from os import urandom
from api import api_blueprint
from flask import Flask, render_template, session,request
from gevent import pywsgi

app = Flask(__name__)
app.secret_key = urandom(24)
app.debug = True

@app.errorhandler(404)
def handle_error_404(e):
    return render_template('error.html', error=404, msg='页面不存在'), 404

@app.errorhandler(500)
def handle_error_500(e):
    return render_template('error.html', error=500, msg='服务器内部错误'), 500

@app.route('/', methods=['GET'])
def handle_root_page():
    global session
    if 'user' in session:
        return render_template('index.html',
                               username=session['user']['username'],
                               admin=session['user']['admin']
                               )
    else:
        return render_template('sign.html')

@app.route('/home', methods=['GET'])
def handle_home_page():
    return 'creating...'

@app.route('/article', methods=['GET'])
def handle_article_page():
    return render_template('article_search.html')

@app.route('/article/editor', methods=['GET'])
def handle_article_editor_page():
    uptype = request.args.get('type')
    if uptype == "new":
        return render_template('mark_editor.html', uptype=uptype)
    return render_template('mark_editor.html', uptype=uptype, id=request.args.get('id'))

@app.route('/article/<id>', methods=['GET'])
def handle_get_article_page(id):
    return render_template('article.html', id=id)

@app.route('/task', methods=['GET'])
def handle_task_page():
    return 'creating...'

@app.route('/account', methods=['GET'])
def handle_account_page():
    return render_template('account.html')

app.register_blueprint(api_blueprint)
if __name__ == "__main__":
    try:
        print(app.url_map)
        ip, port = ("0.0.0.0", 8080)
        print(f"监听服务将启动于{ip}:{port}\n按下Ctrl+C以停止")
        server = pywsgi.WSGIServer((ip,port),app)
        server.serve_forever()
    except KeyboardInterrupt:
        print("已停止服务")
        exit()