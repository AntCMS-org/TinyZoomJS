class TinyZoom {
    constructor(selector) {
        const images = document.querySelectorAll(selector);

        images.forEach((image) => {
            image.addEventListener("click", () => {
                this.makeFullscreen(image);
            });

            image.addEventListener("touchend", (event) => {
                event.preventDefault();
                this.makeFullscreen(image);
            });
        });
    }

    makeFullscreen(image) {
        const fullscreen = document.createElement('div');
        fullscreen.classList.add("fullscreen-image");

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        // If the image is too large for the screen, scale it to fit
        var viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        if (viewportWidth > 0) {
            var overscaleWidth = (image.width > viewportWidth) ? (viewportWidth / image.width) * 0.75 : 1;
        }

        if (viewportHeight > 0) {
            var overscaleHeight = (image.height > viewportHeight) ? (viewportHeight / image.height) * 0.75 : 1;
        }

        fullscreen.appendChild(canvas);
        document.body.appendChild(fullscreen);

        fullscreen.addEventListener('click', (event) => {
            if (event.target === fullscreen) {
                fullscreen.remove();
            }
        });

        let lastX, lastY;
        let dragStart, dragged;
        let scaleFactor = 1;

        function isPannable() {
            if (parseInt(canvas.style.width) > (viewportWidth * 0.75) || parseInt(canvas.style.height) > (viewportHeight * 0.75)) {
                return true;
            } else {
                return false;
            }
        }

        function zoom(scale) {
            scaleFactor *= scale;
            const newWidth = canvas.width * scaleFactor;
            const newHeight = canvas.height * scaleFactor;
            canvas.style.width = `${newWidth}px`;
            canvas.style.height = `${newHeight}px`;

            redraw(isPannable());
        }

        function redraw(restore = true) {
            ctx.save();

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (restore) {
                ctx.restore();
            }

            ctx.drawImage(image, 0, 0);
        }

        canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const scale = event.deltaY > 0 ? 0.9 : 1.1;
            zoom(scale);
        });

        canvas.addEventListener('mousedown', (event) => {
            lastX = event.offsetX || event.layerX;
            lastY = event.offsetY || event.layerY;
            dragStart = ctx.transformedPoint(lastX, lastY);
            dragged = false;
        });

        canvas.addEventListener('mousemove', (event) => {
            lastX = event.offsetX || event.layerX;
            lastY = event.offsetY || event.layerY;
            dragged = true;
            if (dragStart && isPannable()) {
                const pt = ctx.transformedPoint(lastX, lastY);
                ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
                redraw();
            }
        });

        canvas.addEventListener('mouseup', () => {
            dragStart = null;
        });

        canvas.addEventListener('dblclick', (event) => {
            zoom(event.shiftKey ? 0.5 : 2);
        });

        ctx.transformedPoint = (x, y) => {
            const pt = new DOMPoint(lastX, lastY);
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(ctx.getTransform().inverse());
        };

        var overScale = Math.min(1.0, overscaleWidth, overscaleHeight);
        if (overScale != 1) {
            zoom(overScale);
        }
    }
}

// Use the library
document.addEventListener("DOMContentLoaded", () => {
    new TinyZoom(".TinyZoom");
});
