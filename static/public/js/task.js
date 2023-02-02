top.window.document.title = "活动任务";

document.querySelector("#create-task").onclick = ()=>{
    let ifm = document.createElement("iframe");
    ifm.src = '/task/create';
    ifm.style.height = "50%";
    ifm.style.width = "50%";
    ifm.style.position = "absolute";
    ifm.style.left = "50%";
    ifm.style.top = "50%";
    ifm.style.transform = "translate(-50%,-50%)";
    document.body.appendChild(ifm)
}