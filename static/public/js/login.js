document.getElementById('submit').addEventListener('click',(e)=>{
    /**请求对象 */
    let xhr = new XMLHttpRequest();
    /**表单数据 */
    let formData = new FormData();
    /**html中的表单数据 */
    let inputs = document.querySelector('form').querySelectorAll('input');
    let finish = true;
    for(let ele of inputs){
        if(ele.value==''){
            showInfo("warning","请填把表单填写完整",e.clientX,e.clientY);
            ele.focus();
            finish = false;
            break;
        }
    }
    if(!finish)return;
    formData.append("username",inputs[0].value);
    formData.append("password",md5(inputs[1].value));
    xhr.open('post','/login');
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState===4){
            let status = xhr.responseText;
            status = JSON.parse(status);
            if(status["code"]==200){
                showInfo("success",`欢迎回来，${inputs[0].value}!`);
                setTimeout(()=>{window.open('/','_self');},1000);
            } else if (status["code"]==300) {
                showInfo("error","密码错误");
                inputs[1].focus();
            } else if (status["code"]==400){
                showInfo("error","用户名不存在");
                inputs[0].focus();
            } else {
                showInfo("error","未知错误");
            }
        }
    }
    xhr.send(formData);
});