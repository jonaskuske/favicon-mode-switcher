/**
 * @license
 * favicon-mode-switcher __VERSION__
 * (c) 2019 Jonas Kuske
 * Released under the MIT License.
 */

/** @typedef { 'dark' | 'light' } ColorScheme */
/** @typedef { {selector: string, href?: {[Key in ColorScheme]: string}} } IconOption */
/** @typedef { Array<IconOption & {element: HTMLLinkElement}> } IconList */

const warn = (/** @type { string } */ message) => {
  window.console && console.warn(message)
}

/** @param { IconList } icons */
const initIcons = icons => {
  icons.forEach(icon => {
    icon.element.setAttribute('data-href', icon.element.href)
  })
}

/** @param { IconList } icons @param { ColorScheme } scheme */
const updateIcons = (icons, scheme) => {
  icons.forEach(icon => {
    const href = icon.href && (icon.href[scheme] || icon.element.getAttribute('data-href'))
    // If href is defined, set href, else toggle "dark" and "light" in href URI
    icon.element.href = icon.href ? href || '' : icon.element.href.replace(/dark|light/, scheme)
  })
}

/** @param { IconList } icons */
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

/** @param { IconOption | IconOption[] } options */
const iconModeSwitcher = options => {
  const isBrowser = typeof window !== 'undefined'
  if (!isBrowser || !options || !window.matchMedia) return
  options = Array.isArray(options) ? options : [options]

  const icons = options.reduce(
    (arr, { selector, href }) => {
      const element = document.querySelector(selector)
      if (element && element instanceof HTMLLinkElement) arr.push({ element, href, selector })
      warn(`[favicon-mode-switcher] Icon not found or not a LinkElement: "${selector}"`)
      return arr
    },
    /** @type {IconList} */ ([])
  )

  initIcons(icons)
  const removeDarkQ = addColorQuery('dark', query => query.matches && updateIcons(icons, 'dark'))
  const removeLightQ = addColorQuery('light', query => query.matches && updateIcons(icons, 'light'))

  return () => (removeDarkQ(), removeLightQ(), resetIcons(icons))
}

export default iconModeSwitcher
