let searchBox = document.querySelector("#search");
let sortBox = document.querySelector("#sort")
let submit = document.querySelector("#submit");
let output = document.querySelector("ul");
let index = document.querySelector("ol");
let start = 0;
top.document.title = "全部文章"
function search() {
    output.innerHTML = '<span class="loading"></span>'
    let keywors = searchBox.value;
    let sort = sortBox.value;
    let sortkey = sort=="time-down"||sort=="time-up"?"_id":sort=="name-up"||sort=="name-down"?"title":"author";
    let sortindex = sort=="time-down"||sort=="name-down"||sort=="author-down"?-1:1;
    top.document.title = (keywors == '' ? "全部文章" : `搜索 ${keywors}`);
    let xhr = new XMLHttpRequest();
    xhr.open('get', `api/article/search?start=${start}&keywords=${keywors}&sortk=${sortkey}&sorti=${sortindex}`);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            if (data['code'] == 200) {
                output.innerHTML = "";
                index.innerHTML = ""
                data['data'].forEach(e => {
                    let li = document.createElement('li');
                    li.innerHTML = `<a href="/article/${e['_id']}">${e['title']}——${e['author']}</a>`
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
                    let t = li.querySelector('#index').value-1;
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
                }else {
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
}
searchBox.addEventListener('change', () => { start = 0 })
searchBox.addEventListener('keydown', (e)=>{
    if(e.keyCode == 13)search();
})
sortBox.addEventListener('change', search);
submit.addEventListener('click', search);
search();