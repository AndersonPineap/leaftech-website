const articleDiv = document.getElementById('article-output');
let article = '';
let xhr = new XMLHttpRequest();
xhr.open('get', '/api/article/get?id=' + document.getElementById('temp-data').value);
xhr.send();
xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
        let d = JSON.parse(xhr.responseText);
        document.querySelector("#article-title").innerHTML = `${d['title']}<sub> by: ${d['author']}</sub>`;
        top.document.title = d['title']
        article = d['article'];
        articleDiv.innerHTML = marked.parse(article);
        hljs.highlightAll();
        document.body.removeChild(document.getElementById('temp-data'));
        let ifms = document.querySelectorAll('iframe');
        if (ifms) {
            function re() {
                ifms.forEach(ele => {
                    let w = ele.clientWidth;
                    let h = w / 16 * 9;
                    ele.style.height = h + "px";
                });
                console.log('finish');
            }
            re();
            window.addEventListener('resize', re);
        }
        // 添加导航栏
        if (d['edit']) {
            let t = document.createElement('input');
            t.type = "button"
            t.className = 'btn';
            t.value = "修改"
            t.onclick = ()=>{
                window.location = "/article/editor?type=update&id="+d['_id'];
                console.log('done')
            }
            let b = document.createElement('input');
            b.type = "button"
            b.className = 'btn';
            b.value = "删除"
            b.onclick = ()=>{
                s = confirm("确定删除此文章吗(此操作不可逆，建议在操作前下载源文件进行备份处理)？");
                if (s) {
                    let xhr = new XMLHttpRequest();
                    let fd = new FormData();
                    fd.append('id', d['_id']);
                    xhr.open('post', '/api/article/delete');
                    xhr.send(fd)
                    xhr.onreadystatechange = ()=>{
                        if (xhr.readyState===4){
                            let t = JSON.parse(xhr.responseText);
                            if (t["code"]==200){
                                alert("成功");
                                window.location = "/article"
                                return;
                            }
                            alert("失败")
                        }
                    }
                }
            }
            document.querySelector("#nav-bar").insertBefore(t,document.querySelector("#nav-bar ul"))
            document.querySelector("#nav-bar").insertBefore(b,document.querySelector("#nav-bar ul"))
        }
        /**文章中所有h标签*/
        const articleTitles = articleDiv.querySelectorAll('h1,h2,h3,h4,h5,h6');
        const titleHeight = []; // 所有标题距离顶部的距离
        let nav_bar = document.getElementById('nav-bar').querySelector('ul');
        let articleBarDeep = { 'h1': 1, 'h2': 2, 'h3': 3, 'h4': 4, 'h5': 5, 'h6': 6 };
        let lastDeep = 1;
        articleBarStr = '';
        articleTitles.forEach(ele => {
            let nowDeep = articleBarDeep[ele.localName];
            if (nowDeep > lastDeep) { articleBarStr += "<ul>"; }
            else if (nowDeep < lastDeep) {
                let d = lastDeep - nowDeep;
                for (let i = 0; i < d; i++)articleBarStr += "</ul>";
            }
            articleBarStr += "<li><a href=\"\#" + ele.getAttribute('id') + "\">" + ele.innerText + "</a></li>"
            lastDeep = nowDeep;
            titleHeight.push(getElementTop(ele));
        })
        nav_bar.innerHTML = articleBarStr;
        // 下载功能
        document.getElementById("download").addEventListener('click', () => {
            const source = article;
            const blob = new Blob([source], {
                type: 'text/markdown'
            });
            const url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = document.getElementById("article-title").innerText + ".md";
            a.click()
            URL.revokeObjectURL(url);
        })
        console.log(titleHeight)
        // 滚动定位
        let linkBtn = document.querySelectorAll('#nav-bar ul li a');
        let nowLink = 0;
        linkBtn[nowLink].classList.add('active');
        window.onscroll = (e) => {
            // let margin = pageNavChanged ? 50 : 0;
            let margin = 0;
            let scrollTop = document.documentElement.scrollTop;
            if (titleHeight[nowLink + 1] - margin - scrollTop <= 0) {
                linkBtn[nowLink].classList.remove('active');
                linkBtn[nowLink + 1].classList.add('active');
                nowLink++;
            } else if (titleHeight[nowLink - 1] + margin - scrollTop >= 0 && nowLink > 0) {
                linkBtn[nowLink].classList.remove('active');
                linkBtn[nowLink - 1].classList.add('active');
                nowLink--;
            }
        }
        window.addEventListener('resize', () => {
            titleHeight = [];
            articleTitles.forEach(ele => {
                titleHeight.push(getElementTop(ele));
            })
        })
    }
}