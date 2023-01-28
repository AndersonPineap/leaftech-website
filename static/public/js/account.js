top.document.title = "账户管理";
document.querySelector("#sign-out").addEventListener('click',(e)=>{
    let xhr = new XMLHttpRequest()
    xhr.open('post', '/api/account/signout')
    xhr.send()
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState===4) {
            let t = JSON.parse(xhr.responseText)
            if(t['result']){
                top.window.location = "/"
            } else {
                showInfo("error","失败")
            }
        }
    }
})