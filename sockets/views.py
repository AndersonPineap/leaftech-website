from sockets import socket

@socket.on('connect','/')
def socket_root():
    print("有客户端连接")