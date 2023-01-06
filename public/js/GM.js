// 所有通用函数请放置于此

/**
 * ### 获取一个从min到max的随机数
 * @param min 确定最小值  默认为0
 * @param max 确定最大值  默认为1
 * @returns 返回一个number
 */
function getRandom(min=0, max=1) {return Math.random() * (max - min) + min;}

/**
 * ### 在网页中输出提示信息，此消息会根据字符数量调整持续时间（每个字符150ms），最短持续时间为2.5s，最长时间为15s
 * @param type 提示类型 可用参数（normal,success,warning,error）默认为normal
 * @param message 提示信息 默认为message
 */
function showInfo(type="normal", message="message"){
    /**放置提示信息的盒子 */
    let box = document.getElementById("show-info-box");
    // 不存在则创建
    if (!box){
        box = document.createElement("div");
        box.id = "show-info-box";
        document.body.append(box);
    }
    /**提示信息的盒子 */
    let info = document.createElement("p");
    // 设置type，在此添加新类新
    if(type=="normal") info.setAttribute("type","normal");
    else if(type=="warning") info.setAttribute("type","warning");
    else if(type=="error") info.setAttribute("type","error");
    else if(type=="success") info.setAttribute("type","success");
    else {
        // 入参不正确则取消执行
        console.log("不正确类型")
        message = `不正确类型,showInfo没有${type}类型,如需此类型请修改函数并在main.css中设置相应css`;
        info.setAttribute("type","error");
    }
    /**动态时间 */
    let  timeDuration = message.length*150;
    timeDuration = timeDuration>2500?timeDuration:2500; // 判断是否有2s
    timeDuration = timeDuration<15000?timeDuration:15000;   // 判断是否超过10s
    info.innerText = message;   // 填充信息
    // 填入放置的盒子
    box.append(info);
    // 10ms后执行弹出动画
    setTimeout(() => {
        info.className = "show-info-open";
    }, 10);
    // 2s后执行退场动画，动画持续200ms
    let closeHandle = setTimeout(()=>{
        info.className = "show-info-close";
        // 动画结束250ms-200ms=50ms后删除元素
        setTimeout(()=>{box.removeChild(info)},250);
    },timeDuration)
    // 为info添加点击关闭的功能
    info.onclick = ()=>{
        clearTimeout(closeHandle);
        info.className = "show-info-click";
        navigator.clipboard.writeText(message);
        // 动画持续300ms，动画结束50ms后删除元素
        setTimeout(()=>{box.removeChild(info)},350);
    }
}