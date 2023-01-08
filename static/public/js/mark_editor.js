let output = document.getElementById("output");
let input = document.getElementById("input");
let input_t = document.getElementById('title')

input.addEventListener('change',()=>{
    let data = input.value;
    output.innerHTML = marked.parse(data);
    hljs.highlightAll();
})

document.getElementById("submit").addEventListener('click',(e)=>{
    showInfo('normal','正在提取数据');
    let article = input.value;
    let title = input_t.value;
    console.log(title);
    if(article.value==''){
        showInfo("warning","请填把表单填写完整",e.clientX,e.clientY);
        input.focus();
        return;
    }
    if(title == ''){
        showInfo("warning","请填把表单填写完整",e.clientX,e.clientY);
        input_t.focus();
        return;
    }
    let form = new FormData();
    form.append('title',title);
    form.append('article',article);
    showInfo('normal','开始提交表单');
    let xhr = new XMLHttpRequest();
    xhr.open('POST','/article/upload');
    showInfo('normal','已发送数据');
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState===4){
            let resp = xhr.responseText;
            console.log(resp);
            resp = JSON.parse(resp);
            if (resp["code"]==200){
                showInfo('success',`上传成功，你的文章uid为${resp["uid"]}`);
                input.value = '';
                input_t.value = '';
                window.open("/","_self");
            } else if (resp["code"]==300) {
                showInfo('error', '服务器读写错误');
            } else {
                showInfo('warning','请先登录');
                window.open('/','_blank')
            }
        }
    }
    xhr.send(form);
})
document.getElementById("cancel").addEventListener('click',()=>{
    window.open("/","_self");
})