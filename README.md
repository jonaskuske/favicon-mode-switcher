<p align="center">
  <a href="https://www.npmjs.com/package/favicon-mode-switcher"><img align="center" src="https://img.shields.io/npm/v/favicon-mode-switcher.svg" alt="NPM version"></a>
  <a href="https://travis-ci.org/jonaskuske/favicon-mode-switcher"><img align="center" src="https://travis-ci.org/jonaskuske/favicon-mode-switcher.svg?branch=master" alt="Build status"></a>
  <a href="https://bundlephobia.com/result?p=favicon-mode-switcher@latest"><img align="center" src="https://img.shields.io/bundlephobia/minzip/favicon-mode-switcher/latest.svg" alt="Bundle size"></a>
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
<script type="module">
  import faviconModeSwitcher from 'https://unpkg.com/favicon-mode-switcher/dist/index.min.mjs'
  // ...
</script>
```

or the UMD build:

```html
<script src="https://unpkg.com/favicon-mode-switcher">
```

> 💡 Since all browsers supporting `(prefers-color-scheme)` also support JavaScript modules, usage of the module version is highly recommended. The UMD build is only meant for scenarios where you can't use `<script type="module">`, for example when inserting the script using a WordPress hook.

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

faviconModeSwitcher('link[rel="shortcut icon"]')
// or
faviconModeSwitcher(document.querySelector('#favicon'))
// or
faviconModeSwitcher({
  element: document.querySelector('#favicon'),
  href: { dark: '/icons/favicon-light.ico' },
})
```

&nbsp;

The module exports a single function as **default export**. If the UMD build is used, this function will be exposed on **`window.faviconModeSwitcher.default`**. It has the following type signature:

```ts
function faviconModeSwitcher(FaviconTarget | FaviconTarget[] | NodeListOf<HTMLLinkElement>): DestroyFunction
```

It takes either the configuration for a single icon to be updated, or an Array containing multiple configurations if you want to keep many icons in sync with the active color scheme. `NodeList` is supported too, so you can use it with `document.querySelectorAll()`.

> 🕯 Even though it's technically not an icon, you can also update the web app manifest (`<link rel="manifest">`) of your website using `favicon-mode-switcher`!

<br>

The configuration for an icon is either:

- a CSS selector string, which has to return a `<link>` element when passed to `document.querySelector()`
- a `<link>` element itself
- an Object, containing one of the above as the `element` property, along with an _optional_ `href` config

```ts
type FaviconTarget =
  | string
  | HTMLLinkElement
  | {
      element: string | HTMLLinkElement
      href?: { dark?: string; light?: string }
    }
```

&nbsp;

### Automatic `href` updates

If you use a selector, Element or Object without `href` property as icon config, the icon's `href` will be updated automatically.
For this, `favicon-mode-switcher` will look for the substring "dark" or "light" in the `href` you specified in the HTML and replace it with the currently active color scheme.
<br><br>
**For example:** here, the `href` will be replaced with `./my-favicon.dark.ico` whenever the device is in dark mode:

```html
<link rel="shortcut icon" href="./my-favicon.light.ico" />
```

(if the `href` in the HTML doesn't contain either `"light"` or `"dark"`, nothing will happen)

&nbsp;

### Specyfing the `href` to use

Alternatively, you can specify `href` configuration when using an Object. The object keys must match a color scheme and the value is the `href` that should be used when the color scheme from the key is active.
<br><br>
**For example:** with the following config the `href` of `<link id="icon">` will be set to `./logo-teal.ico` while the device is in dark mode, and `logo-navyblue.ico` while the device is in light mode.

```js
{ element: '#icon', href: { dark: './logo-teal.ico', light: './logo-navyblue.ico' } }
```

**However, you only need to specify the `href` for one color scheme:**  
If there is no `href` defined for the color scheme that is currently active, `favicon-mode-switcher` will simply use the one that was initially specified in the HTML.

&nbsp;

### Stopping the mode switcher

The main function described above returns a destroy function when called. Run it and the switcher will stop and reset all the icons to their original `href`:

```js
const destroyIconSwitcher = faviconModeSwitcher(document.querySelectorAll('.favicon'))

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

© 2021, Jonas Kuske
