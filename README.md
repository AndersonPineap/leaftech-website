<b>罗师傅请注意</b>
<del>目前只是搞好了文件关系，里面的文件我之后再写</del>

## 文件规范
1. 文件名不得夹带空格，如`test file.html`将是非法的，空格请使用`_`代替，如`test_file.html`
2. 文件名在易懂的情况下尽量简单
3. 文件放置位置
- `css文件`请放置于`public/css/`文件夹内
- `js文件`请放置于`public/js/`文件夹内
- <b>非index</b>的`html文件`请放置于`resource/pages/`文件夹内(无法斟酌可以商量)
- 在其他html内引用(`<iframe>`)的`html文件`请放置于`resource/iframe`
- <b>所有图片</b>请放置在`resource/images/`文件夹内
4. 可以通用的js代码请打包成函数并放置在`public/js/GM.js`内

## 代码规范
1. 函数要注明有什么作用，必要的/不必要的参数，参数有什么用，返回了个什么东西，一定要写清楚
2. 程序先保证有用，再去优化
3. js代码<b>一定要</b>以 `;` 结尾

## 代码说明
- `public/js/background.js`网上抄的，我尽量在里面标注清楚，引用后确保你的`body`元素中有`<canvas id="background"></canvas>`这行代码且在引用前引用了`public/js/GM.js`
- `public/css/main.css`简易初始化
- `public/css/form.css`针对表单的设计文件
- - 注：使用form的html格式请满足以下结构
```html
<!--根元素的classname至少包含有form-->
<div class="form">
    <h3>一个标题</h3>
    <!--一个表单-->
    <form action="api">
        <div>
            <input type="text" class="input_text">
            <i>对此空的注释</i>
        </div>
        <div>
            <input type="text" class="input_text">
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
- - 在`form`中的元素都是竖着排列，`div`中的(除了根元素)是横向排列，你可以通过在标签中添加`style`属性并添入`flex-direction: [column/row];`来控制排列（`column`竖 `row`横），不生效就再加一个`!important`