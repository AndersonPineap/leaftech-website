from flask_socketio import SocketIO
from server import app
socket = SocketIO()
socket.init_app(app, cros_allowed_origins='*')
from . import views