(function () {
    /**动画id */
    var animateId
    /**背景画布元素 */
    const canvas = document.getElementById("background");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    /**这个变量控制粒子之间连线的最大距离 */
    const distanceLimit = 175;
    /**这个变量控制粒子的最大数量 */
    const pointNum = 80;
    /**控制粒子颜色 */
    const colorRGB = '30, 180, 20';
    /**存储所有粒子的数组 */
    let points = [];
    /**鼠标控制的粒子 */
    let mousePoint = null;
    /**
     * ### 粒子类
     */
    class point {
        /** 
         * ### 粒子的构造函数
         * @param  x 确定粒子在X轴的初始位置
         * @param  y 确定粒子在Y轴的初始位置
         * @param  speedX 确定粒子在X轴的速度
         * @param  speedY 确定粒子在Y轴的速度
         * @param  size 粒子的大小
         * @param  color 粒子的颜色
         */
        constructor(x, y, speedX, speedY, size, color) {
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.size = size;
            this.color = color;
        }
        /**
         * ### 用于在画布上绘制粒子
         */
        drow() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        /**
         * ### 用于更新粒子位置
         */
        update() {
            // 碰壁反转速度
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY *= -1;
            }
            this.x += this.speedX;
            this.y += this.speedY;
            // 每次更新数据后绘制
            this.drow();
        }
    }
    /**
     * ### 创建点的函数
     */
    function createPoint() {
        for (let i = 0; i < pointNum; i++) {
            let size = getRandom(1, 2); // 修改此句中的min和max可以控制点的大小
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            // 修改以下两句可以控制粒子速度
            let speedX = getRandom(-2.5, 2.5);
            let speedY = getRandom(-2.5, 2.5);
            let color = 'rgba(' + colorRGB + ',' + (1 - size / 3)+')';
            points.push(new point(x, y, speedX, speedY, size, color))
        }
    }
    /**
     * ### 连接符合条件的粒子的函数
     */
    function link() {
        // 双循环挨个排查
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const p1 = points[i];
                const p2 = points[j];
                // 运用勾股定理计算两点距离
                let distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                // 距离小于distanceLimit则连接
                if (distance <= distanceLimit) {
                    ctx.strokeStyle = 'rgba(' + colorRGB + ',' + (1 - distance / distanceLimit)+')';
                    ctx.beginPath();
                    ctx.lineWidth = .8;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }
    /**### 创建动画的函数 */
    function animate() {
        animateId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach(point => {
            point.update();
        });
        link();
    }
    /**### 鼠标事件 */
    function mouseEve() {
        // 鼠标指针进入画布范围时若鼠标粒子不存在则创建粒子
        canvas.addEventListener('mouseover', e => {
            if (!mousePoint) {
                mousePoint = new point(e.x, e.y, 0, 0, 1, 'rgba(' + colorRGB + '), 1')
                points.push(mousePoint)
            }
        })
        // 根据鼠标位置更新粒子位置
        canvas.addEventListener('mousemove', e => {
            mousePoint.x = e.x;
            mousePoint.y = e.y;
        })
        // 鼠标移出画布位置则清除粒子
        canvas.addEventListener('mouseout', () => {
            mousePoint.x = null;
            mousePoint.y = null;
        })
    }

    mouseEve();
    createPoint();
    animate();

    /* 这个给window添加了监听 */
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cancelAnimationFrame(animateId);
        points = [];
        mousePoint = null;
        mouseEve();
        createPoint();
        animate();
    });
}());