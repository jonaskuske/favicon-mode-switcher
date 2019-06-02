<p align="center">
  <a href="https://www.npmjs.com/package/favicon-mode-switcher"><img align="center" src="https://img.shields.io/npm/v/favicon-mode-switcher.svg" alt="NPM version"></a>
  <a href="https://travis-ci.org/jonaskuske/favicon-mode-switcher"><img align="center" src="https://travis-ci.org/jonaskuske/favicon-mode-switcher.svg?branch=master" alt="Build status"></a>
  <a href="https://bundlephobia.com/result?p=favicon-mode-switcher"><img align="center" src="https://badgen.net/bundlephobia/minzip/favicon-mode-switcher" alt="Bundle size"></a>
  <a href="./LICENSE"><img align="center" src="https://img.shields.io/npm/l/favicon-mode-switcher.svg" alt="License"></a>
</p>

&nbsp;  
&nbsp;

<h1 align="center">favicon-mode-switcher</h1>
<p align="center">🕯 Make your favicon adapt to dark and light mode</p>

&nbsp;
&nbsp;  
&nbsp;
&nbsp;

## Installation

You can install `favicon-mode-switcher` using the package manager of your choice or load it through a CDN:

**npm:**

```bash
npm install favicon-mode-switcher
```

**yarn:**

```bash
yarn add favicon-mode-switcher
```

**CDN ([unpkg](https://unpkg.com)):**

```html
<script src="https://unpkg.com/favicon-mode-switcher">
```

> ⚠ When using a CDN other than **unpkg**, make sure to specify `/dist/index.umd.min.js` in the URL!

&nbsp;

## Usage

#### TL;DR

```js
import faviconModeSwitcher from 'favicon-mode-switcher'
// or
const faviconModeSwitcher = require('favicon-mode-switcher')
// or
const faviconModeSwitcher = window.faviconModeSwitcher.default

// then...
faviconModeSwitcher({
  selector: 'link[rel="shortcut icon"]',
  href: { dark: '/icons/favicon-light.ico' },
})
```

&nbsp;

The module exports a single function as **default export**. If loaded through a CDN, this function will be exposed on **`window.faviconModeSwitcher.default`**. It has the following type signature:

```ts
function faviconModeSwitcher(IconConfig | IconConfig[]): DestroyFn
```

It takes either an configuration object for a single icon to be updated, or an Array containing multiple config objects if you want to keep many icons in sync with the active color scheme. The configuration object looks like this:

```ts
type IconConfig = {
  selector: string
  href?: {
    dark?: string
    light?: string
  }
}
```

The `selector` is a CSS selector. It will be passed to `document.querySelector()` and must return a `<link>` element.

The `href` property is _optional_:

- If you omit it, `favicon-mode-switcher` will look for `"light"` or `"dark"` substrings in the `href` you specified in the HTML and replace them with the currently active color scheme. For example: if your HTML is `<link rel="shortcut icon" href="./my-favicon.light.ico">`, the `href` will automatically be changed to `./my-favicon.dark.ico` whenever the device is in dark mode. (if the `href` in the HTML doesn't contain either `"light"` or `"dark"`, nothing will happen)
- Alternatively, you can pass `href` configuration in the form of an object. The object keys must match a color scheme and the value is the `href` that should be used when the color scheme from the key is active. For example, with the config `{ dark: './foo.ico' }`, the `<link>` element's `href` will be set to `./foo.ico` while the device is in dark mode.  
  If there is no `href` defined for the color scheme that is currently active, `favicon-mode-switcher` will simply use the one that was initially specified in the HTML.

> 💡 Even though it's technically not an icon, you can also update the web app manifest (`<link rel="manifest">`) of your website using `favicon-mode-switcher!`

#### Stopping the mode switcher

The main function described above returns a destroy function when called. Run it and the switcher will stop and reset all the icons to their original `href`:

```js
const destroyIconSwitcher = faviconModeSwitcher({ selector: 'link[rel="shortcut icon"]' })

// later...
destroyIconSwitcher()
```

&nbsp;

### Browser Support & SSR

Detecting the active color scheme is a relatively new feature and as such has [limited browser support](https://caniuse.com/#feat=prefers-color-scheme). The script itself should run in any browser from at least Internet Explorer 9 upwards without throwing an error, so you can use it for Progressive Enhancement.  
It also doesn't throw if `window` is `undefined`, so you can safely require and execute it in a Node environment for SSR.

Note that the ESModule versions (`.mjs` file extension) only work in browsers with support for `ES2015 / ES6`. Modern bundlers like webpack will automatically import these versions by default. If you're using such a bundler and need legacy browser support, either transpile the module yourself or directly import the CommonJS version at `dist/index.js`.

&nbsp;
&nbsp;  
&nbsp;

---

**PRs welcome!**

&nbsp;

© 2019, Jonas Kuske
