class TinyZoom {
    constructor(selector) {
        const images = document.querySelectorAll(selector);

        images.forEach((image) => {
            image.style.cursor = 'pointer';
            image.addEventListener("click", () => {
                this.makeFullscreen(image);
            });

            image.addEventListener("touchstart", (event) => {
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

        let dragStartX, dragStartY, dragged;
        let scaleFactor = window.devicePixelRatio || 1;

        let isLandscape = screen.orientation.type.startsWith("portrait") ? false : true;

        canvas.style.maxWidth = '85%';
        canvas.style.maxHeight = '85%';
        canvas.width = image.width * scaleFactor;
        canvas.height = image.height * scaleFactor;

        ctx.scale(scaleFactor, scaleFactor);
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // If the image is too large for the screen, scale it to fit
        var viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        /*if (isLandscape) {
            var overscaleWidth = (image.width * 1.1 > viewportWidth) ? (viewportWidth / image.width) * 0.90 : 1;
            var overscaleHeight = (image.height * 1.1 > viewportHeight) ? (viewportHeight / image.height) * 0.90 : 1;
        } else {
            var overscaleWidth = (image.height * 1.1 > viewportHeight) ? (viewportHeight / image.height) * 0.90 : 1;
            var overscaleHeight = (image.width * 1.1 > viewportWidth) ? (viewportWidth / image.width) * 0.90 : 1;
        }*/

        var overscaleWidth = (image.width * 1.1 > viewportWidth) ? (viewportWidth / image.width) * 0.90 : 1;
        var overscaleHeight = (image.height * 1.1 > viewportHeight) ? (viewportHeight / image.height) * 0.90 : 1;

        fullscreen.appendChild(canvas);
        document.body.appendChild(fullscreen);

        fullscreen.addEventListener('click', (event) => {
            if (event.target === fullscreen) {
                fullscreen.remove();
            }
        });

        fullscreen.addEventListener('wheel', (event) => {
            if (event.target === fullscreen) {
                event.preventDefault();
            }
        });

        function zoom(scale) {
            scaleFactor *= scale;
            canvas.style.transform = `scale(${scaleFactor})`;
            redraw();
        }

        function redraw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, image.width, image.height);
        }

        // Set the position of the canvas to absolute
        canvas.style.position = 'fixed';
        canvas.style.left = (viewportWidth / 2) - (image.width / 2) + 'px';
        canvas.style.top = (viewportHeight / 2) - (image.height / 2) + 'px';
        canvas.style.cursor = 'move';

        canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const scale = event.deltaY > 0 ? 0.9 : 1.1;
            zoom(scale);
        });

        canvas.addEventListener('mousedown', (event) => {
            dragStartX = event.pageX - canvas.offsetLeft;
            dragStartY = event.pageY - canvas.offsetTop;
            dragged = true;
        });

        canvas.addEventListener('mousemove', (event) => {
            if (dragged) {
                // Calculate the new position of the element
                const x = event.pageX - dragStartX;
                const y = event.pageY - dragStartY;

                // Set the position of the element
                canvas.style.left = `${x}px`;
                canvas.style.top = `${y}px`;
            }
        });

        canvas.addEventListener('mouseup', () => {
            dragged = false;
        });

        canvas.addEventListener('dblclick', (event) => {
            zoom(event.shiftKey ? 0.5 : 2);
        });

        var overScale = Math.min(1.0, overscaleWidth, overscaleHeight);
        if (overScale != 1) {
            scaleFactor = overScale;
            canvas.style.left = (viewportWidth / 2) - ((image.width * scaleFactor) / 2) + 'px';
            canvas.style.top = (viewportHeight / 2) - ((image.height * scaleFactor) / 2) + 'px';
            zoom(1);
        }
    }
}

// Use the library
window.addEventListener("load", () => {
    new TinyZoom(".TinyZoom");
});
