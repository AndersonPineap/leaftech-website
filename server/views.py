from flask import render_template, session, request
from server import app

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
        return render_template('index.html')
    else:
        return render_template('sign.html')


@app.route('/home', methods=['GET'])
def handle_home_page():
    return render_template('home.html')


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
    return render_template('task.html', admin=session['user']['admin'])

@app.route('/task/create', methods=['GET'])
def handle_task_create_page():
    if session['user']['admin']: return render_template('taskcreate.html')
    return render_template('error', error=404, msg="无权访问")

@app.route('/account', methods=['GET'])
def handle_account_page():
    if session['user']['class'] == "leaf studio":
        t = "leaf studio"
    elif session['user']['class'] == "programer":
        t = "编程部"
    elif session['user']['class'] == "painter":
        t = "画师部"
    else:
        t = "频像部"
    return render_template('account.html',
                           account_name=session['user']['username'],
                           account_admin=session['user']['admin'],
                           account_avatar=session['user']['avatar'],
                           account_class=t
                           )

