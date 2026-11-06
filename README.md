<p align="center">
  <h1 align="center">TinyZoom.JS</h1>
  <p align="center">
    A dead simple JS script for fullscreening images with pan &amp; zoom support.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/vanilla-JS-no_dependencies-2ea44f" alt="Vanilla JS, no dependencies">
  <img src="https://img.shields.io/badge/size-3.4_KB-blue" alt="3.4 KB">
</p>

---

### Features

- **Zero dependencies** — one file, plain vanilla JS.
- **Click to fullscreen** — images open in a blurred overlay.
- **Pan & zoom** — mouse wheel, double-click, and click-drag.
- **Link friendly** — images inside anchors keep behaving like links.

---

## Quick Start

**1.** Include the script:

```html
<script src="src/TinyZoom.js" defer></script>
```

**2.** Add a class to the images you want to make zoomable:

```html
<img src="photo.jpg" class="TinyZoom">
```

**3.** Hook it up once the DOM is ready:

```html
<script>
    document.addEventListener("DOMContentLoaded", () => {
        new TinyZoom(".TinyZoom");
    });
</script>
```

**4.** Add the overlay styling (the fullscreen container is injected into the page as a `.fullscreen-image` div):

```css
.fullscreen-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    backdrop-filter: blur(5px);
}
```

That's it — click an image to open it fullscreen.

> 💡 See [`example.html`](example.html) for a complete working example.

## Usage

```js
new TinyZoom(selector)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `selector` | `string` | A CSS selector matching the images to enable. All matching elements are queried once at construction time. |

Images nested inside an `<a href>` are skipped, so image links keep working as links.

## Controls

| Action | Result |
| --- | --- |
| Click image | Open fullscreen |
| Click background overlay | Close fullscreen |
| Mouse wheel | Zoom in / out (1.1× per tick) |
| Double-click | Zoom in (2×) |
| Shift + double-click | Zoom out (0.5×) |
| Click + drag | Pan the image |

The image is initially scaled to fit ~85% of the viewport when it would otherwise be too large.

## Notes

- Pure vanilla JS, no dependencies. Exposes a single global `TinyZoom` class.
- The image is drawn onto a `<canvas>`, so panning/zooming stays crisp and cheap.
- The overlay blocks page scrolling with `event.preventDefault()` on the wheel while open.
