let output = document.getElementById("output");
let input = document.getElementById("input");
let input_t = document.getElementById('title')
let ifms = document.querySelectorAll('iframe');
let uptype = document.querySelector('body').getAttribute('uptype')
function re() {
    ifms.forEach(ele => {
        let w = ele.clientWidth;
        let h = w / 16 * 9;
        ele.style.height = h + "px";
    });
    console.log('finish');
}
window.addEventListener('resize', re);
input.addEventListener('change', () => {
    let data = input.value;
    output.innerHTML = marked.parse(data);
    hljs.highlightAll();
    ifms = document.querySelectorAll('iframe');
    re();
})
if (uptype == "update") {
    let xhr = new XMLHttpRequest()
    xhr.open('get', '/api/article/get?id=' + document.querySelector('body').getAttribute('artid'));
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let t = JSON.parse(xhr.responseText)
            input_t.value = t['title'];
            input.value = t['article'];
        }
    }
}
document.getElementById("submit").addEventListener('click', (e) => {
    showInfo('normal', '正在提取数据');
    let article = input.value;
    let title = input_t.value;
    if (article.value == '') {
        showInfo("warning", "请填把表单填写完整", e.clientX, e.clientY);
        input.focus();
        return;
    }
    if (title == '') {
        showInfo("warning", "请填把表单填写完整", e.clientX, e.clientY);
        input_t.focus();
        return;
    }
    let form = new FormData();
    form.append('title', title);
    form.append('article', article);
    form.append('type', uptype);
    if (uptype == "update") {
        form.append('id', document.querySelector('body').getAttribute('artid'));
    }
    showInfo('normal', '开始提交表单');
    let xhr = new XMLHttpRequest();
    xhr.open('post', '/api/article/upload');
    showInfo('normal', '已发送数据');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let resp = xhr.responseText;
            resp = JSON.parse(resp);
            if (resp["code"] == 200) {
                showInfo('success', `上传成功`);
                input.value = '';
                input_t.value = '';
            } else if (resp["code"] == 300) {
                showInfo('error', '服务器读写错误');
            } else {
                showInfo('error', '前端请求参数错误');
            }
        }
    }
    xhr.send(form);
})
document.getElementById("cancel").addEventListener('click', () => {
    window.open("/home", "_self");
})