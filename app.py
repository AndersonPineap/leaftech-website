from gevent import pywsgi
from flask import request,Flask,render_template,make_response

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

server =  pywsgi.WSGIServer(('0.0.0.0',8080),app)
server.serve_forever()