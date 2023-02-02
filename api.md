# 内网api说明

## 文章系 `/api/article/*`

### 获取文章 `/api/article/get`

用于：获取一篇指定的文章数据

方法：`GET`

参数：
- `id`: **必要** 文章id

返回一个 `json` 数据，内容如下
- `title:str`: 文章标题
- `article:str`: 文章内容，文本是markdown格式，需要在浏览器中解析[请使用marked库](https://github.com/markedjs/marked)并[配合highlight库](https://highlightjs.org/)使用
- `author:str`: 作者
- `edit:bool`: 服务器验证是否能够编辑，是则值为 **true** 否则为 **false**

实例：
javascript代码:
```javascript
let xhr = new XMLHttpRequest();
    xhr.open('get', '/api/article/get?id=63d3a97ed540bb2b13baa1d5');
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            console.log(data);
        }
    }
```

输出（假定服务器验证不能编辑）
```javascript
Object { title: "title", article: "# h1\n  ## h2", author: "admin", edit: false }
```

### 检索文章 `/api/article/search`

用于：获取一个 所有/搜索到 的文章的基本信息(即除了 *article*与*edit* 内容)组成的数组

方法：`GET`

参数：
- `start:num`： **必须** 返回数据从结果的第start条开始
- `keywords:str`： **不必要** 目标标题中存在的字符或符合目标标题的正则表达式，不带此参数或参数值为空时返回所有文章

返回一个 `json` 数据，内容如下：
- `status:num`：状态码，200时为正常
- `result:str`：附加的状态信息
- `allDatalen:num`：检索结果的总数量
- `data:array`：返回的20条检索结果，元素组成详细见[获取文章api](#获取文章-apiarticleget)
- `next:num|None`：如果这次检索的结果后还有数据则返回下一个start值