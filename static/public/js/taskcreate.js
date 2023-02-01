import './socket.min.js'
document.querySelector("#submit").onclick = (e) => {
    let form = new FormData(document.querySelector("form"));
    for (let ele of form.values()) {
        if (ele == '') { showInfo('warning', '请将表单填写完整', e.clientX, e.clientY); return }
    }
    let xhr = new XMLHttpRequest();
    xhr.open("post", "/api/task/create");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            if (data['code'] == 200) {
                showInfo('success', '成功');
                let socket = io();
                socket.emit('newTask', {from:`${data['class']}${data['user']}`,msg: form.get('message')});
                window.close()
            }
            else showInfo('error', data['result']);
        }
    }
    xhr.send(form);
}
document.querySelector("#cancel").onclick = ()=>{window.close();}