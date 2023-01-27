// 全局变量请放置于此
/**页面滚动方向 */
var pageScrollDirection = null;
/**显示宽度 */
var viewWidth = document.body.clientWidth;
/**显示高度 */
var viewHeight = document.body.clientHeight;
/**顶部栏是否收缩 */
var pageNavChanged = false;

// 所有通用函数请放置于此

/**
 * ### 获取一个从min到max的随机数
 * @param min 确定最小值  默认为0
 * @param max 确定最大值  默认为1
 * @returns 返回一个number
 */
function getRandom(min = 0, max = 1) { return Math.random() * (max - min) + min; }

/**
 * ### 在网页中输出提示信息，此消息会根据字符数量调整持续时间（每个字符150ms），最短持续时间为2.5s，最长时间为15s
 * @param type 提示类型 可用参数（normal,success,warning,error）默认为normal
 * @param message 提示信息 默认为message
 * @param x 提示位置，默认为null使其在右侧堆叠显示，传入数值会使提示在指定位置出现
 * @param y 同上
 */
function showInfo(type = "normal", message = "message", x = null, y = null) {
    /**放置提示信息的盒子 */
    let box = document.getElementById("show-info-box");
    // 不存在则创建
    if (!box) {
        box = document.createElement("div");
        box.id = "show-info-box";
        document.body.append(box);
    }
    /**提示信息的盒子 */
    let info = document.createElement("p");
    if (x && y) {
        info.style.position = "fixed";
        info.style.left = x + "px";
        info.style.top = y + "px";
        info.style.transform = "translate(-50%,-120%)"
    }
    // 设置type，在此添加新类新
    if (type == "normal") info.setAttribute("type", "normal");
    else if (type == "warning") info.setAttribute("type", "warning");
    else if (type == "error") info.setAttribute("type", "error");
    else if (type == "success") info.setAttribute("type", "success");
    else {
        // 入参不正确则取消执行
        console.log("不正确类型")
        message = `不正确类型,showInfo没有${type}类型,如需此类型请修改函数并在main.css中设置相应css`;
        info.setAttribute("type", "error");
    }
    /**动态时间 */
    let timeDuration = message.length * 150;
    timeDuration = timeDuration > 2500 ? timeDuration : 2500; // 判断是否有2s
    timeDuration = timeDuration < 15000 ? timeDuration : 15000;   // 判断是否超过10s
    info.innerText = message;   // 填充信息
    // 填入放置的盒子
    box.append(info);
    // 10ms后执行弹出动画
    setTimeout(() => {
        info.className = "show-info-open";
    }, 10);
    // 2s后执行退场动画，动画持续200ms
    let closeHandle = setTimeout(() => {
        info.className = "show-info-close";
        // 动画结束250ms-200ms=50ms后删除元素
        setTimeout(() => { box.removeChild(info) }, 250);
    }, timeDuration)
    // 为info添加点击关闭的功能
    info.onclick = () => {
        clearTimeout(closeHandle);
        info.className = "show-info-click";
        navigator.clipboard.writeText(message);
        // 动画持续300ms，动画结束50ms后删除元素
        setTimeout(() => { box.removeChild(info) }, 350);
    }
}

/**
 * ### md5加密函数
 * 使用：
 * Calculate the (hex-encoded) MD5 hash of a given string value:
 * `var hash = md5('value') // "2063c1608d6e0baf80249c42e2be5804"`
 * Calculate the (hex-encoded) HMAC-MD5 hash of a given string value and key:
 * `var hash = md5('value', 'key') // "01433efd5f16327ea4b31144572c67f6"`
 * Calculate the raw MD5 hash of a given string value:
 * `var hash = md5('value', null, true)`
 * Calculate the raw HMAC-MD5 hash of a given string value and key:
 * `var hash = md5('value', 'key', true)`
 * 此函数来自 https://github.com/blueimp/JavaScript-MD5
 */
!function (n) {
    "use strict";
    function d(n, t) {
        var r = (65535 & n) + (65535 & t);
        return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
    }
    function f(n, t, r, e, o, u) {
        return d((u = d(d(t, n), d(e, u))) << o | u >>> 32 - o, r)
    }
    function l(n, t, r, e, o, u, c) {
        return f(t & r | ~t & e, n, t, o, u, c)
    }
    function g(n, t, r, e, o, u, c) {
        return f(t & e | r & ~e, n, t, o, u, c)
    }
    function v(n, t, r, e, o, u, c) {
        return f(t ^ r ^ e, n, t, o, u, c)
    }
    function m(n, t, r, e, o, u, c) {
        return f(r ^ (t | ~e), n, t, o, u, c)
    } function c(n, t) {
        var r, e, o, u;
        n[t >> 5] |= 128 << t % 32, n[14 + (t + 64 >>> 9 << 4)] = t;
        for (var c = 1732584193, f = -271733879, i = -1732584194, a = 271733878, h = 0; h < n.length; h += 16)
            c = l(r = c, e = f, o = i, u = a, n[h], 7, -680876936),
                a = l(a, c, f, i, n[h + 1], 12, -389564586),
                i = l(i, a, c, f, n[h + 2], 17, 606105819),
                f = l(f, i, a, c, n[h + 3], 22, -1044525330),
                c = l(c, f, i, a, n[h + 4], 7, -176418897),
                a = l(a, c, f, i, n[h + 5], 12, 1200080426),
                i = l(i, a, c, f, n[h + 6], 17, -1473231341),
                f = l(f, i, a, c, n[h + 7], 22, -45705983),
                c = l(c, f, i, a, n[h + 8], 7, 1770035416),
                a = l(a, c, f, i, n[h + 9], 12, -1958414417),
                i = l(i, a, c, f, n[h + 10], 17, -42063),
                f = l(f, i, a, c, n[h + 11], 22, -1990404162),
                c = l(c, f, i, a, n[h + 12], 7, 1804603682),
                a = l(a, c, f, i, n[h + 13], 12, -40341101),
                i = l(i, a, c, f, n[h + 14], 17, -1502002290),
                c = g(c, f = l(f, i, a, c, n[h + 15], 22, 1236535329), i, a, n[h + 1], 5, -165796510),
                a = g(a, c, f, i, n[h + 6], 9, -1069501632),
                i = g(i, a, c, f, n[h + 11], 14, 643717713),
                f = g(f, i, a, c, n[h], 20, -373897302),
                c = g(c, f, i, a, n[h + 5], 5, -701558691),
                a = g(a, c, f, i, n[h + 10], 9, 38016083),
                i = g(i, a, c, f, n[h + 15], 14, -660478335),
                f = g(f, i, a, c, n[h + 4], 20, -405537848),
                c = g(c, f, i, a, n[h + 9], 5, 568446438),
                a = g(a, c, f, i, n[h + 14], 9, -1019803690),
                i = g(i, a, c, f, n[h + 3], 14, -187363961),
                f = g(f, i, a, c, n[h + 8], 20, 1163531501),
                c = g(c, f, i, a, n[h + 13], 5, -1444681467),
                a = g(a, c, f, i, n[h + 2], 9, -51403784),
                i = g(i, a, c, f, n[h + 7], 14, 1735328473),
                c = v(c, f = g(f, i, a, c, n[h + 12], 20, -1926607734),
                    i,
                    a,
                    n[h + 5], 4, -378558),
                a = v(a, c, f, i, n[h + 8], 11, -2022574463),
                i = v(i, a, c, f, n[h + 11], 16, 1839030562),
                f = v(f, i, a, c, n[h + 14], 23, -35309556),
                c = v(c, f, i, a, n[h + 1], 4, -1530992060),
                a = v(a, c, f, i, n[h + 4], 11, 1272893353),
                i = v(i, a, c, f, n[h + 7], 16, -155497632),
                f = v(f, i, a, c, n[h + 10], 23, -1094730640),
                c = v(c, f, i, a, n[h + 13], 4, 681279174),
                a = v(a, c, f, i, n[h], 11, -358537222),
                i = v(i, a, c, f, n[h + 3], 16, -722521979),
                f = v(f, i, a, c, n[h + 6], 23, 76029189),
                c = v(c, f, i, a, n[h + 9], 4, -640364487),
                a = v(a, c, f, i, n[h + 12], 11, -421815835),
                i = v(i, a, c, f, n[h + 15], 16, 530742520),
                c = m(c, f = v(f, i, a, c, n[h + 2], 23, -995338651), i, a, n[h], 6, -198630844),
                a = m(a, c, f, i, n[h + 7], 10, 1126891415),
                i = m(i, a, c, f, n[h + 14], 15, -1416354905),
                f = m(f, i, a, c, n[h + 5], 21, -57434055),
                c = m(c, f, i, a, n[h + 12], 6, 1700485571),
                a = m(a, c, f, i, n[h + 3], 10, -1894986606),
                i = m(i, a, c, f, n[h + 10], 15, -1051523),
                f = m(f, i, a, c, n[h + 1], 21, -2054922799),
                c = m(c, f, i, a, n[h + 8], 6, 1873313359),
                a = m(a, c, f, i, n[h + 15], 10, -30611744),
                i = m(i, a, c, f, n[h + 6], 15, -1560198380),
                f = m(f, i, a, c, n[h + 13], 21, 1309151649),
                c = m(c, f, i, a, n[h + 4], 6, -145523070),
                a = m(a, c, f, i, n[h + 11], 10, -1120210379),
                i = m(i, a, c, f, n[h + 2], 15, 718787259),
                f = m(f, i, a, c, n[h + 9], 21, -343485551),
                c = d(c, r),
                f = d(f, e),
                i = d(i, o),
                a = d(a, u);
        return [c, f, i, a]
    }
    function i(n) {
        for (var t = "", r = 32 * n.length, e = 0; e < r; e += 8)
            t += String.fromCharCode(n[e >> 5] >>> e % 32 & 255);
        return t
    }
    function a(n) {
        var t = [];
        for (t[(n.length >> 2) - 1] = void 0, e = 0; e < t.length; e += 1)
            t[e] = 0;
        for (var r = 8 * n.length, e = 0; e < r; e += 8)
            t[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32;
        return t
    }
    function e(n) {
        for (var t, r = "0123456789abcdef", e = "", o = 0; o < n.length; o += 1)
            t = n.charCodeAt(o),
                e += r.charAt(t >>> 4 & 15) + r.charAt(15 & t);
        return e
    }
    function r(n) {
        return unescape(encodeURIComponent(n))
    }
    function o(n) {
        return i(c(a(n = r(n)), 8 * n.length))
    }
    function u(n, t) {
        return function (n, t) {
            var r, e = a(n), o = [], u = [];
            for (o[15] = u[15] = void 0, 16 < e.length && (e = c(e, 8 * n.length)), r = 0; r < 16; r += 1)
                o[r] = 909522486 ^ e[r], u[r] = 1549556828 ^ e[r];
            return t = c(o.concat(a(t)), 512 + 8 * t.length), i(c(u.concat(t), 640))
        }(r(n), r(t))
    }
    function t(n, t, r) {
        return t ? r ? u(t, n) : e(u(t, n)) : r ? o(n) : e(o(n))
    } "function" == typeof define && define.amd ? define(function () { return t }) : "object" == typeof module && module.exports ? module.exports = t : n.md5 = t
}(this);

/**
 * ### 将formEle元素内所有input的键和值快速填充至一个FormData类
 * @param formEle 通过dom获取的form元素节点
 * @returns FormData
 */
function quickFillForm(formEle) {
    let formData = new FormData();
    inputs = formEle.querySelectorAll('input');
    inputs.forEach(ele => {
        formData.append(ele.name, ele, value);
    });
    return formData;
}

// 右侧底部功能栏
// window.addEventListener('scroll', ()=>{
//     pageScrollDistance = document.documentElement.scrollTop;
//     if (pageScrollDistance>=viewHeight) {
//         let outDiv = document.createElement('div');
//         let scrollButton = document.createElement('button');
//         scrollButton.innerHTML = 'back to top';
//         scrollButton.onclick = ()=>{
//             window.scrollTo(0);
//         }
//         outDiv.appendChild(scrollButton);
//         document.body.appendChild(scrollButton);
//     }
// })
/**
 * 
 * @param el 需要获取高度的元素
 * @returns 高度
 */
function getElementTop(el) {
    var actualTop = el.offsetTop
    var current = el.offsetParent
    while (current !== null) {
        actualTop += current.offsetTop
        current = current.offsetParent
    }
    return actualTop
}

