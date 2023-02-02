from os import urandom
from flask import Flask
from api import api_blueprint

app = Flask(__name__, static_folder="../static", template_folder="../templates")
# app.secret_key = urandom(24)
app.secret_key = "666"
app.debug = True    # 使用的时候注释掉
app.register_blueprint(api_blueprint)

from . import views