/**
 * @license
 * favicon-mode-switcher __VERSION__
 * (c) 2019 Jonas Kuske
 * Released under the MIT License.
 */

/** @typedef { import('index').ColorScheme } ColorScheme */
/** @typedef { import('index').IconConfig } IconConfig */
/** @typedef { import('index').default } FaviconModeSwitcher */
/** @typedef { IconConfig & {element: HTMLLinkElement} } Icon */

function warn(/** @type { string } */ message) {
  typeof console !== 'undefined' && console.warn(message)
}

function initIcons(/** @type { Icon[] } */ icons) {
  icons.forEach(icon => {
    icon.element.setAttribute('data-href', icon.element.href)
  })
}

function updateIcons(/** @type { Icon[] }*/ icons, /** @type { ColorScheme } */ scheme) {
  icons.forEach(icon => {
    const href = icon.href && (icon.href[scheme] || icon.element.getAttribute('data-href'))
    // If href is defined, set href, else toggle "dark" and "light" in href URI
    icon.element.href = icon.href ? href || '' : icon.element.href.replace(/dark|light/, scheme)
  })
}

function resetIcons(/** @type { Icon[] } */ icons) {
  icons.forEach(icon => {
    icon.element.href = icon.element.getAttribute('data-href') || ''
    icon.element.removeAttribute('data-href')
  })
}

/** @param { (query: MediaQueryList | MediaQueryListEvent) => any } queryHandler */
function addColorQuery(/** @type { ColorScheme } */ scheme, queryHandler) {
  const query = window.matchMedia(`(prefers-color-scheme: ${scheme})`)
  query.addListener(queryHandler)
  queryHandler(query)
  return () => query.removeListener(queryHandler)
}

/** @type { FaviconModeSwitcher } */
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

  const destroyFn = () => ((removeDarkQ(), removeLightQ(), resetIcons(icons)))
  return destroyFn
}
