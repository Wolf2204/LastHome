(function () {
    'use strict';
    const PI = Math.PI;
    let canvas1 = document.querySelector('#canvas1'),
        canvas2 = document.querySelector('#canvas2'),
        div = document.querySelector('div');
    let ctx1 = canvas1.getContext('2d'),
        ctx2 = canvas2.getContext('2d');
    let height,
        width,
        cX,
        cY,
        radius;

    document.forms.fileForm.elements.file.addEventListener('change', function () {
        let file = this.files[0];
        this.blur();
        if (file) {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.addEventListener('load', function () {
                height = canvas1.height = this.height;
                width = canvas1.width = this.width;
                cX = width / 2;
                cY = height / 2;
                radius = width / 5;
                div.style.width = width + 'px';
                div.style.height = height + 'px';
                ctx1.drawImage(image, 0, 0, width, height);
                circle();
                URL.revokeObjectURL(image.src);
            });
        }
    });

    function circle() {
        canvas2.height = height;
        canvas2.width = width;
        ctx2.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx2.fillRect(0, 0, width, height);
        ctx2.fillStyle = 'white';
        ctx2.arc(cX, cY, radius, 0, 2 * PI);
        ctx2.globalCompositeOperation = 'destination-out';
        ctx2.fill();
    }

    canvas2.addEventListener('mousedown', function (event) {
        let element = this.getBoundingClientRect();
        let mouseX = event.clientX - element.left;
        let move = function (el) {
            cX = el.clientX - element.left;
            cY = el.clientY - element.top;
            circle();
        };
        let scale = function (el) {
            radius = Math.abs(el.clientX - element.left - cX);
            circle();
        };
        let remove = function () {
            canvas2.removeEventListener('mouseup', remove);
            canvas2.removeEventListener('mousemove', scale);
        };
        if ((cX + radius + 10 >= mouseX && cX + radius - 10 <= mouseX) || (cX - radius + 10 >= mouseX && cX - radius - 10 <= mouseX)) {
            canvas2.addEventListener('mousemove', scale);
            canvas2.addEventListener('mouseup', remove);
        } else {
            remove = function (el) {
                cX = el.clientX - element.left;
                cY = el.clientY - element.top;
                circle();
                this.removeEventListener('mouseup', remove);
                canvas2.removeEventListener('mousemove', move);
            };
            canvas2.addEventListener('mousemove', move);
            canvas2.addEventListener('mouseup', remove);
        }

    });

    document.forms.saveForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let filename = this.elements.fileName.value;
        let save = document.createElement('canvas'),
            ctx = save.getContext('2d');
        save.height = save.width = radius * 2;
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(canvas1, cX - radius, cY - radius, radius * 2, radius * 2, 0, 0, radius * 2, radius * 2);
        save.toBlob(function (blob) {
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename + '.png';
            a.dispatchEvent(new MouseEvent('click'));
            URL.revokeObjectURL(a.href);
        });

    });


}());