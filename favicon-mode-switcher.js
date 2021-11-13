/** @license MIT favicon-mode-switcher __VERSION__ (c) 2019 Jonas Kuske */

/** @typedef { import('index').ColorScheme } ColorScheme */
/** @typedef { import('index').Icon } Icon */
/** @typedef { import('index').FaviconTarget } FaviconTarget */
/** @typedef { import('index').default } FaviconModeSwitcher */

const DEBUG = true
const warn = (/** @type { string } */ msg) => typeof console !== 'undefined' && console.warn(msg)

/** @type { FaviconModeSwitcher } */
let faviconModeSwitcher = (options) => {
  let isBrowser = typeof window !== 'undefined'
  if (!isBrowser || !window.matchMedia) return () => {}

  options = Array.isArray(options) || options instanceof NodeList ? options : [options]

  /** @type { Icon[] } */
  let icons = []
  ;[].forEach.call(options, (/** @type { FaviconTarget } */ target) => {
    if (typeof target === 'string' || target instanceof HTMLLinkElement) {
      target = { element: target }
    }

    // prettier-ignore
    let linkElement = target && (
      typeof target.element === 'string' ? document.querySelector(target.element) : target.element
    )
    if (linkElement instanceof HTMLLinkElement) {
      icons.push({ linkElement, hrefConfig: target.href, baseHref: linkElement.href })
    } else if (DEBUG) {
      warn('[favicon-mode-switcher] Icon not found or not an HTMLLinkElement: ' + target)
    }
  })

  let addColorQuery = (/** @type { ColorScheme } */ colorScheme) => {
    let mediaQuery = matchMedia('(prefers-color-scheme:' + colorScheme + ')')

    // prettier-ignore
    let updateFn = () => mediaQuery.matches && icons.forEach(icon => (
      // If href config exists, set specified href. Else toggle "dark" / "light" on existing href.
      icon.linkElement.href = icon.hrefConfig
        ? icon.hrefConfig[colorScheme] || icon.baseHref
        : icon.linkElement.href.replace(/dark|light/, colorScheme)
    ))

    mediaQuery.addListener(updateFn)
    return updateFn(), () => mediaQuery.removeListener(updateFn)
  }

  let undoDarkQ = addColorQuery('dark')
  let undoLightQ = addColorQuery('light')

  return () => (undoDarkQ(), undoLightQ(), icons.forEach((i) => (i.linkElement.href = i.baseHref)))
}

export default faviconModeSwitcher
