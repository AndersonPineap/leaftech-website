top.window.document.title = "首页";
(function () {
    let p = document.querySelector("#hitokoto");
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'https://v1.hitokoto.cn');
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState===4) {
            let data = JSON.parse(xhr.responseText);
            t = data['hitokoto']
            f = data['from']
            w = data['from_who']==null?'':data['from_who']
            p.innerHTML = `${t}<br>——${w}『${f}』`;
        }
    }
    xhr.send()
})()