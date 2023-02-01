top.document.title = "账户管理";
document.querySelector("#sign-out").addEventListener('click', (e) => {
    if (confirm("确定？")) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/api/account/signout');
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                let t = JSON.parse(xhr.responseText);
                if (t['code']) {
                    top.window.location = "/";
                } else {
                    showInfo("error", "失败");
                }
            }
        }
    }
})

document.querySelector("#set-pwd").onclick = () => {
    if (confirm("确定？")) {
        let xhr = new XMLHttpRequest();
        let bd = new FormData();
        bd.append('new', md5(prompt("新密码：")));
        bd.append('pwd', md5(prompt("输入当前密码用于服务器验证身份：")));
        xhr.open('post', '/api/account/update');
        xhr.send(bd);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                let t = JSON.parse(xhr.responseText);
                if (t['code'] == 200) {
                    showInfo("success", t['result']);
                } else {
                    showInfo("error", t['result']);
                }
            }
        }
    }
}

(function () {
    let output = document.querySelector("#article-output")
    let xhr = new XMLHttpRequest();
    xhr.open('get', `api/account/article`);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            output.innerHTML = ""
            let data = JSON.parse(xhr.responseText);
            if (data['code'] == 200) {
                data['data'].forEach(ele => {
                    let li = document.createElement('li');
                    li.innerHTML = `<a href="/article/${ele['_id']}">${ele['title']}</a>`
                    output.appendChild(li);
                });
            } else {
                showInfo('error', data['result'])
            }
        }
    }
})()

let output = document.querySelector("#search-box ul");
let index = document.querySelector("#search-box ol");
let start = 0;
function search() {
    let xhr = new XMLHttpRequest();
    xhr.open('get', `api/account/list?start=${start}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            if (data['code'] == 200) {
                output.innerHTML = "";
                index.innerHTML = ""
                data['data'].forEach(e => {
                    let li = document.createElement('li');
                    li.innerHTML = `${e['class'] == "leaf studio" ? "leaf studio" : e['class'] == "programer" ? "编程部" : e['class'] == "painter" ? "画师部" : "频像部"}： ${e['username']}`;
                    if (!e['admin']) {
                        li.innerHTML += ` <input value="删除账户" type="button" class="btn" onclick="accdelete('${e['username']}')">`;
                    }
                    output.appendChild(li);
                });
                let pages = data['allDatalen'] % 20 == 0 ? data['allDatalen'] / 20 : Math.floor(data['allDatalen'] / 20) + 1;
                let now = Math.floor(start / 20) + 1;
                if (now >= 2) {
                    let li = document.createElement('li');
                    li.innerText = "页首";
                    li.onclick = () => { start = 0; search(); }
                    index.appendChild(li);
                    li = document.createElement('li');
                    li.innerText = "上一页";
                    li.onclick = () => { start -= 20; search(); }
                    index.appendChild(li);
                } else {
                    let li = document.createElement('li');
                    li.innerHTML = "<del>页首</del>";
                    index.appendChild(li);
                    li = document.createElement('li');
                    li.innerHTML = "<del>上一页</del>";
                    index.appendChild(li);
                }
                let li = document.createElement('li');
                li.id = "jump";
                li.innerHTML = `<input id='index' type='number' min='1' max='${pages}' step='1' value='${now}' oninput='this.value=Math.floor(this.value);'>/${pages}<input type="button" onclick="search()" value="跳转" class="btn">`;
                li.onchange = () => {
                    let t = li.querySelector('#index').value - 1;
                    start = t >= pages ? (pages - 1) * 20 : t <= 1 ? 1 : Math.floor(t) * 20;
                    search();
                }
                li.onkeydown = (e) => {
                    if (e.keyCode == 13 || e.key == "Enter") {
                        let t = li.querySelector('#index').value;
                        start = t >= pages ? (pages - 1) * 20 : t <= 1 ? 1 : Math.floor(t) * 20;
                        search();
                    }
                }
                index.appendChild(li);
                if (now <= pages - 1) {
                    let li = document.createElement('li');
                    li.innerText = "下一页";
                    index.appendChild(li);
                    li.onclick = () => { start += 20; search(); }
                    li = document.createElement('li');
                    li.innerText = "页末";
                    li.onclick = () => { start = (pages - 1) * 20; search(); }
                    index.appendChild(li);
                } else {
                    let li = document.createElement('li');
                    li.innerHTML = "<del>下一页</del>";
                    index.appendChild(li);
                    li = document.createElement('li');
                    li.innerHTML = "<del>页末</del>";
                    index.appendChild(li);
                }
            } else {
                showInfo('error', data['result'])
            }
        }
    }
    xhr.send();
}
search();

function accdelete(usr) {
    if (confirm(`此操作不可逆，确定删除${usr}（删除后${usr}所创作的文章等内容将仍保存于服务器）？`)) {
        let xhr = new XMLHttpRequest();
        let bd = new FormData();
        bd.append('usr', usr);
        xhr.open('post', 'api/account/delete');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                let req = JSON.parse(xhr.responseText);
                if (req['code'] == 200) {
                    showInfo("success", "成功");
                    search();
                } else {
                    showInfo('error', req['result']);
                }
            }
        }
        xhr.send(bd);
    }
}

document.querySelector("#cre-submit").addEventListener('click', (e) => {
    let form = new FormData(document.forms['createAccount']);
    for (let ele of form.values()) {
        if (ele == '') { showInfo('warning', '请将表单填写完整', e.clientX, e.clientY); return }
    }
    if (confirm(`请确认信息：\n用户名：${form.get("account-usr")}\n密码：${form.get("account-pwd")}\n所属部门：${form.get("account-class") == "programer" ? "编程部" : form.get("account-class") == "painter" ? "画师部" : "频像部"}\n是否为管理员：${form.get("account-admin") == "true" ? "是" : "否"}`)) {
        form.set("account-pwd", md5(form.get("account-pwd")));
        form.set("account-admin", form.get("account-admin") == "true" ? "1" : "")
        let xhr = new XMLHttpRequest();
        xhr.open('post', 'api/account/create');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                let req = JSON.parse(xhr.responseText);
                if (req['code'] == 200) {
                    showInfo("success", "成功");
                    search();
                    document.querySelector("#reset");
                } else {
                    showInfo('error', req['result']);
                }
            }
        }
        xhr.send(form);
    }
}) 