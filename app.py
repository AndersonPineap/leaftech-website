from server import app
from sockets import socket

if __name__ == "__main__":
    try:
        print(app.url_map)
        ip, port = ("0.0.0.0", 8080)
        print(f"监听服务将启动于{ip}:{port}\n按下Ctrl+C以停止")
        socket.run(app, host=ip, port=port)
    except KeyboardInterrupt:
        print("已停止服务")
        exit()
