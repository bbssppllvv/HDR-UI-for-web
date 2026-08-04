# HDR UI for Web

A tiny, dependency-free CSS primitive for brighter-than-white HDR highlights on UI and DOM elements.

HDR UI for Web uses one inline 1×1 PQ AVIF, `mix-blend-mode: multiply`, and CSS opacity. The HDR layer is created only when the browser matches `@media (dynamic-range: high)`. On SDR output, no HDR layer is created.

## [Open the live HDR demo →](https://bbssppllvv.github.io/HDR-UI-for-web/)

Open it on an HDR-capable display. Screenshots and GIFs do not preserve the physical HDR brightness.

## Install from GitHub

Until the package is published to npm, install it directly from this repository:

```bash
npm install github:bbssppllvv/HDR-UI-for-web
```

Import the stylesheet once:

```js
import 'hdr-ui-for-web/styles.css';
```

## Use

Add one class:

```html
<button class="hdr-ui">Continue</button>
```

Set the strength with one CSS variable. It accepts a percentage or an opacity number:

```css
.heroAction {
  --hdr-ui-strength: 12%;
}
```

```html
<button class="hdr-ui heroAction">Continue</button>
```

The default strength is `10%`. The package does not assign meaning to hover, active, selected, or any other UI state.

## Control it with your own states

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

This is only an example. HDR UI for Web itself has no state selectors and does not decide when the effect changes.

## Images

Pseudo-elements are unreliable on replaced elements such as `<img>`. Put the class on a wrapper instead:

```html
<div class="hdr-ui imageWrapper">
  <img src="product.jpg" alt="Product">
</div>
```

```css
.imageWrapper {
  display: inline-block;
  border-radius: 16px;
}

.imageWrapper img {
  display: block;
  border-radius: inherit;
}
```

This brightens the whole image. Lighting only one region inside an image requires an image-specific HDR luminance map, which is outside this package's scope.

## Variables

| Variable | Default | Purpose |
| --- | ---: | --- |
| `--hdr-ui-strength` | `10%` | Amount of the HDR layer |
| `--hdr-ui-duration` | `180ms` | Opacity transition duration |

## How it works

HDR UI for Web adds an `::after` layer filled with an inline Base64 PQ AVIF. `multiply` combines the HDR luminance with the element's existing color, gradient, texture, text, and icons. `--hdr-ui-strength` controls how much of that HDR layer participates in the result. It is an artistic strength control, not a measurement of extra nits.

The package itself has no JavaScript runtime or build step, and it makes no external image request or CDN request.

## Important notes

- The element should paint its own background. A transparent element may blend with content behind it.
- The low-specificity package rule sets `position: relative` and uses the element's `::after` pseudo-element. Any explicit `position` in your component wins, but a previously static element becomes a containing block for its absolutely positioned children.
- It cannot share that `::after` with another effect. Use an extra wrapper if the element already owns the pseudo-element.
- Put the class on a wrapper around replaced elements such as `<img>` and `<input>`.
- HDR UI for Web does not add `overflow`, masks, filters, or `isolation`; these can alter layout or clamp HDR compositing in some browsers.
- Parent `opacity`, CSS filters, transforms, backdrop filters, and complex stacking contexts can change the result. Test the final component on real hardware.
- `dynamic-range: high` is a capability gate, not a monitor model or peak-nits measurement.
- Normal screenshots do not reliably preserve physical HDR brightness.

## Run the example

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
