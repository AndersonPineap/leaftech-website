## 文件规范
1. 文件名不得夹带空格，如`test file.html`将是非法的，空格请使用`_`代替，如`test_file.html`
2. 文件名在易懂的情况下尽量简单
3. 文件放置位置
- `css文件`请放置于`static/public/css/`文件夹内
- `js文件`请放置于`static/public/js/`文件夹内
- <b>所有`html文件`</b>放置于`templates/`文件夹内
- <b>所有图片</b>请放置在`static/resource/images/`文件夹内
1. 可以通用的js代码请打包成函数并放置在`static/public/js/GM.js`内
2. 所有`html`文件请引入`static/public/css/main.css`和`static/public/js/GM.js`

---

## 文件说明
- `userdb` 用户数据库（通过base64加密过的
- `app.py` 后端服务（默认地址：http://0.0.0.0:8080
  - 依赖的库：
    - flask
    - gevent
    - hashlib
    - os
    - json
    - base64
- `reset_userdb.py` 重置userdb 生成一个admin用户，其密码默认为password
  - 依赖的库
    - base64
    - json
    - hashlib
- `templates/` 存储html模板
- `static/` 存储所有静态文件
  - `public/` 存储引用文件
    - `css/` 存储css文件 
    - `js` 存储js文件
  - `resource/` 存储网站资源
    - `images/` 存储图片文件
---

## 代码规范
1. 函数要注明有什么作用，必要的/不必要的参数，参数有什么用，返回了个什么东西，一定要写清楚
2. 程序先保证有用，再去优化
3. js代码<b>一定要</b>以 `;` 结尾
4. js变量和函数使用驼峰命名法，首字母不大写，如将`get random`命名为`getRandom`
5. js函数前标注好用途，参数意义，返回类型，如：
```javascript
/**
 * ### 获取一个从min到max的随机数
 * @param min 确定最小值 
 * @param max 确定最大值 
 * @returns 返回一个number
 */
function getRandom(min, max) {return Math.random() * (max - min) + min;}
```
6. css的id，class等名称，单词间用`-`连接，如：`first div`命名为`first-div`
7. <b>`html`内引用任何文件使用相对项目根目录的路径，如引用`GM.js`则路径为`/static/public/js/GM.js`</b>

---

## 代码说明
- `static/public/js/background.js`引用后确保你的`body`元素中有`<canvas id="background"></canvas>`这行代码且在引用前引用了`static/public/js/GM.js`
- `static/public/css/main.css`简易初始化
- `static/public/css/form.css`针对表单的设计文件
  - 注：使用form的html格式请满足以下结构
  - 在`form`中的元素都是竖着排列，`div`中的(除了根元素)是横向排列，你可以通过在标签中添加`style`属性并添入`flex-direction: [column/row];`来控制排列（`column`竖 `row`横），不生效就再加一个`!important`
```html
<!--根元素的classname至少包含有form-->
<div class="form">
    <h3>一个标题</h3>
    <!--一个表单-->
    <form action="api">
        <div>
            <input type="text" class="input_text" required>
            <i>对此空的注释</i>
        </div>
        <div>
            <input type="text" class="input_text" required>
            <i>对此空的注释</i>
        </div>
    </form>
    <!--一个 提交/取消 块-->
    <div>
        <input type="button" class="btn" value="取消">
        <input type="submit" class="btn" value="提交">
    </div>
</div>
```
- `login.js`使用的是md5加密

---

## GM.js函数说明
|函数|功能|返回值|
|--|--|--|
|getRandom(min,max)|获取一个从min到max的随机数|number|
|showInfo(type,message)|生成一个提示信息|无|
|md5(value)|使用md5加密value|string|
|quickFillForm|将formEle元素内所有input的键和值快速填充至一个FormData类|FormData|

---
