# HDR UI for Web

A tiny CSS utility for brighter-than-white HDR highlights on UI and DOM elements. On SDR output, elements remain unchanged.

## [Open the live HDR demo →](https://bbssppllvv.github.io/HDR-UI-for-web/)

Open it on an HDR-capable display. Screenshots and GIFs do not preserve the physical HDR brightness.

## Install

Until the package is published to npm, install it directly from this repository:

```bash
npm install github:bbssppllvv/HDR-UI-for-web
```

Import the stylesheet once:

```js
import 'hdr-ui-for-web/styles.css';
```

## Use

For most UI, add one class and stop there:

```html
<button class="hdr-ui">Continue</button>
```

This uses the recommended 400-nit source and 10% strength by default.

### Two controls

- `data-peak-nits` selects one of the embedded HDR sources. Supported values are `400`, `600`, and `1000`; any other value uses `400`. Leave it out for ordinary UI.
- `--hdr-ui-strength` controls how strongly that source is blended into your element.

They are independent: peak nits describe the encoded source, while strength sets how much of the effect you use. Actual display brightness depends on the browser, display, and available HDR headroom.

### Choose a peak

| Value | Use it for |
| --- | --- |
| No attribute / `400` | Buttons, inputs, navigation, cards, and most UI. Recommended default. |
| `600` | More noticeable UI or decorative highlights. On an HDR display, the rest of the page may appear slightly dimmer as the display reserves HDR headroom. |
| `1000` | Deliberately bright landing-page moments and artwork. On an HDR display, it can make the rest of the page appear noticeably dimmer. |

```html
<button class="hdr-ui">Safe UI default</button>
<button class="hdr-ui" data-peak-nits="600">Brighter UI</button>
<div class="hdr-ui" data-peak-nits="1000">Bright landing-page visual</div>
```

If you are unsure, use no attribute.

### Adjust the strength

Set a percentage in your component CSS:

```html
<button class="hdr-ui myButton">Continue</button>
```

```css
.myButton {
  --hdr-ui-strength: 12%;
}
```

The default strength is `10%`. The package does not assign meaning to hover, active, selected, or any other UI state.

### Use your own states

Change the same variable in whichever selectors your component already uses:

```css
.navigationItem {
  --hdr-ui-strength: 3%;
}

.navigationItem:hover,
.navigationItem:focus-visible,
.navigationItem[aria-current="page"] {
  --hdr-ui-strength: 10%;
}
```

This is only an example. State logic and animation remain entirely in your component CSS.

### What happens on a normal display?

Nothing special is required. When HDR output is unavailable, the browser renders your original element without the HDR layer. Keep the element's normal background, border, and contrast usable on their own; HDR should enhance the design, not provide essential contrast.

## How it works

The class adds a tiny inline PQ AVIF with explicit HDR luminance metadata through `::after`, stretches one copy across the element, and blends it with the element's background, texture, text, and icons using `multiply`. The default source peaks at 400 nits; `data-peak-nits` selects a brighter embedded source. Unsupported values fall back to 400. The value describes the encoded source, not guaranteed physical display luminance. The layer stays isolated and compositor-ready to avoid the Safari compositor demotion observed after opacity changes.

It is CSS-only: no JavaScript runtime, package build step, CDN, or network request.

## Browser behavior

- Chromium browsers render the effect on supported HDR output.
- Safari 26 and newer render the effect using the AVIF's explicit HDR luminance metadata.
- SDR output and browsers without an active HDR image pipeline receive the browser's SDR rendering.

`dynamic-range: high` detects HDR capability; it does not expose display peak brightness or guarantee that HDR headroom is currently available. The same strength can therefore look different across displays and viewing conditions.

## Limitations

- The effect covers the whole rendered box and works best when the element paints its own background.
- It uses `::after` and sets a low-specificity `position: relative` only when `dynamic-range: high` matches. For `<img>`, `<input>`, or an element that already uses `::after`, apply `.hdr-ui` to a wrapper.
- `.hdr-ui` creates an isolated stacking context and keeps its HDR overlay compositor-ready. Avoid applying it indiscriminately to large lists or grids.
- Ancestor compositing can change the result. Test the final component on real HDR hardware.
- An ancestor's `dynamic-range-limit` can cap or disable the HDR effect; the package respects that limit.
- `dynamic-range: high` is a capability gate, not a monitor model or peak-nits measurement. Screenshots and GIFs do not preserve physical HDR brightness.

## Run locally

From the repository root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/examples/` on an HDR display.

## Development

```bash
npm test
npm run pack:check
```

## License

MIT
