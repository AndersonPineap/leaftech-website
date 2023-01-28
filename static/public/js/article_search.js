let searchBox = document.querySelector("#search");
let submit = document.querySelector("#submit");
let output = document.querySelector("ul");
let index = document.querySelector("ol");
let start = 0;
top.document.title = "全部文章"
submit.addEventListener('click', () => {
    let keywors = searchBox.value;
    top.document.title = (keywors==''?"全部文章":`搜索 ${keywors}`);
    let xhr = new XMLHttpRequest();
    xhr.open('get', `api/article/search?start=${start}&keywords=${keywors}`);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            output.innerHTML = ""
            data['data'].forEach(e => {
                let li = document.createElement('li');
                li.innerHTML = `<a href="/article/${e['_id']}">${e['title']}——${e['author']}</a>`
                output.appendChild(li);
            });
            let pages = data['allDatalen'] % 20 == 0 ? data['allDatalen'] / 20 : Math.floor(data['allDatalen'] / 20) + 1;
        }
    }
})
submit.click();