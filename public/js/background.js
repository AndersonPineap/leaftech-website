// 连线背景代码
// 配合canvas使用
canvas = null;
(function(){})(function () {
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })
    const canvas = document.getElementById("background");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const distanceLimit = 175;  // 这个变量是粒子之间连线的最大距离
    const pointNum = 80;        // 这个变量是粒子的最大数量
    const colorRGB = '254,250,224';
    let points = [];
    let mousePoint = null;
    class point {
        constructor(x, y, speedX, speedY, size, color) {
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.size = size;
            this.color = color;
        }
        drow() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY *= -1;
            }
            this.x += this.speedX;
            this.y += this.speedY;
            this.drow();
        }
    }
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    function createPoint() {
        for (let i = 0; i < pointNum; i++) {
            let size = getRandom(1, 2);
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let speedX = getRandom(-2.5, 2.5);
            let speedY = getRandom(-2.5, 2.5);
            let color = 'rgba(' + colorRGB + '),' + (1 - size / 3);
            points.push(new point(x, y, speedX, speedY, size, color))
        }
    }

    function link() {
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const p1 = points[i];
                const p2 = points[j];
                let distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                if (distance <= distanceLimit) {
                    ctx.strokeStyle = 'rgba(' + colorRGB + '),' + (1 - distance / distanceLimit);
                    ctx.beginPath();
                    ctx.lineWidth = .8;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach(point => {
            point.update();
        });
        link();
    }

    function mouseEve() {
        canvas.addEventListener('mouseover', e => {
            if (!mousePoint) {
                mousePoint = new point(e.x, e.y, 0, 0, 1, 'rgba(' + colorRGB + '), 1')
                points.push(mousePoint)
            }
        })
        canvas.addEventListener('mousemove', e => {
            mousePoint.x = e.x;
            mousePoint.y = e.y;
        })
        canvas.addEventListener('mouseout', () => {
            mousePoint.x = null;
            mousePoint.y = null;
        })
    }

    mouseEve();
    createPoint();
    animate();
}());