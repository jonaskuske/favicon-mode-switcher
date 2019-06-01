/**
 * @license
 * favicon-mode-switcher __VERSION__
 * (c) 2019 Jonas Kuske
 * Released under the MIT License.
 */

/** @typedef {import('favicon-mode-switcher').ColorScheme} ColorScheme */
/** @typedef {import('favicon-mode-switcher').IconOption} IconOption */
/** @typedef {import('favicon-mode-switcher').Icon} Icon */
/** @typedef {import('favicon-mode-switcher').FaviconModeSwitcher} FaviconModeSwitcher */

const warn = (/** @type { string } */ message) => {
  typeof console !== 'undefined' && console.warn(message)
}

/** @param { Icon[] } icons */
const initIcons = icons => {
  icons.forEach(icon => {
    icon.element.setAttribute('data-href', icon.element.href)
  })
}

/** @param { Icon[] } icons @param { ColorScheme } scheme */
const updateIcons = (icons, scheme) => {
  icons.forEach(icon => {
    const href = icon.href && (icon.href[scheme] || icon.element.getAttribute('data-href'))
    // If href is defined, set href, else toggle "dark" and "light" in href URI
    icon.element.href = icon.href ? href || '' : icon.element.href.replace(/dark|light/, scheme)
  })
}

/** @param { Icon[] } icons */
const resetIcons = icons => {
  icons.forEach(icon => {
    icon.element.href = icon.element.getAttribute('data-href') || ''
    icon.element.removeAttribute('data-href')
  })
}

/**
 * @param { ColorScheme } scheme
 * @param { (query: MediaQueryList | MediaQueryListEvent) => any } queryHandler
 */
const addColorQuery = (scheme, queryHandler) => {
  const query = window.matchMedia(`(prefers-color-scheme: ${scheme})`)
  query.addListener(queryHandler)
  queryHandler(query)
  return () => query.removeListener(queryHandler)
}

/**
 * Takes in icon configuration, sets up listeners for the active color scheme
 * and updates hrefs of the icons whenever the active scheme changes.
 * @type {FaviconModeSwitcher}
 */
export default function faviconModeSwitcher(options) {
  const isBrowser = typeof window !== 'undefined'
  if (!isBrowser || !options || !window.matchMedia) return () => {}

  options = Array.isArray(options) ? options : [options]

  const icons = options.reduce(
    (arr, { selector, href }) => {
      const element = document.querySelector(selector)
      if (element && element instanceof HTMLLinkElement) arr.push({ element, href, selector })
      else warn(`[favicon-mode-switcher] Icon not found or not an HTMLLinkElement: ${selector}`)
      return arr
    },
    /** @type { Icon[] } */ ([]),
  )

  initIcons(icons)
  const removeDarkQ = addColorQuery('dark', query => query.matches && updateIcons(icons, 'dark'))
  const removeLightQ = addColorQuery('light', query => query.matches && updateIcons(icons, 'light'))

  return () => (removeDarkQ(), removeLightQ(), resetIcons(icons))
}
