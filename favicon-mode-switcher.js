/** @license MIT favicon-mode-switcher __VERSION__ (c) 2019 Jonas Kuske */

/** @typedef { import('index').ColorScheme } ColorScheme */
/** @typedef { import('index').Icon } Icon */
/** @typedef { import('index').IconConfig } IconConfig */
/** @typedef { import('index').default } FaviconModeSwitcher */

function warn(/** @type { string } */ message) {
  typeof console !== 'undefined' && console.warn(message)
}

function initIcons(/** @type { Icon[] } */ icons) {
  icons.forEach(icon => icon.linkElement.setAttribute('data-href', icon.linkElement.href))
}

function updateIcons(/** @type { Icon[] }*/ icons, /** @type { ColorScheme } */ scheme) {
  icons.forEach(icon => {
    const hrefConfig = icon.href
    // If href config exists set href to specified one, else toggle "dark" / "light" in HTML href
    if (hrefConfig) {
      icon.linkElement.href = hrefConfig[scheme] || icon.linkElement.getAttribute('data-href') || ''
    } else icon.linkElement.href = icon.linkElement.href.replace(/dark|light/, scheme)
  })
}

function resetIcons(/** @type { Icon[] } */ icons) {
  icons.forEach(icon => {
    icon.linkElement.href = icon.linkElement.getAttribute('data-href') || ''
    icon.linkElement.removeAttribute('data-href')
  })
}

/** @param { (query: MediaQueryList | MediaQueryListEvent) => any } queryHandler */
function addColorQuery(/** @type { ColorScheme } */ scheme, queryHandler) {
  const query = matchMedia('(prefers-color-scheme:' + scheme + ')')
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
    (arr, { element, href }) => {
      const linkElement = typeof element === 'string' ? document.querySelector(element) : element
      if (linkElement && linkElement instanceof HTMLLinkElement) arr.push({ linkElement, href })
      else warn('[favicon-mode-switcher] Icon not found or not an HTMLLinkElement: ' + element)
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
