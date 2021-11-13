/** @typedef { import('index').ColorScheme } ColorScheme */
/** @typedef { Parameters<MediaQueryList['addListener']>[0] } QueryListener */

/** @type { HTMLElement[] } */
let insertedElements = []

/**
 * @template { keyof HTMLElementTagNameMap } TagName
 * @param { TagName } tagName
 * @param { Partial<HTMLElementTagNameMap[TagName]> } props
 * @returns { HTMLElementTagNameMap[TagName] }
 */
export const createElement = (tagName, props = {}) => {
  const element = document.body.appendChild(Object.assign(document.createElement(tagName), props))
  insertedElements.push(element)
  return element
}

export const resetElements = () => {
  for (const element of insertedElements) element.remove()
  insertedElements = []
}

/*
 ! Since JSDOM does not support `window.matchMedia`, all of the following code
 ! is trying to crudely polyfill it.
 */

/**
 * Return which scheme the query string in the form of (prefers-color-scheme: scheme) is targeting.
 * @param { string } media
 */
const getColorSchemeFromMedia = (media) => (/dark/.test(media) ? 'dark' : 'light')

/**
 * Keep track of the fake color scheme that is currently active.
 *
 * Allows subscribing and unsubscribing to changes, which is necessary for the
 * `addListener` / `removeListener` capabilities of a MediaQuery.
 */
export const GlobalColorScheme = {
  get current() {
    return GlobalColorScheme._current
  },
  set current(colorScheme) {
    // Update the global color scheme...
    GlobalColorScheme._current = colorScheme
    // And run all the listener that are listening for color scheme changes.
    GlobalColorScheme.subscriptions.forEach(([listener, mediaQuery]) => {
      // @ts-ignore
      // Update MediaQueryList.matches of the MediaQuery associated with the Listener
      mediaQuery.matches = getColorSchemeFromMedia(mediaQuery.media) === GlobalColorScheme.current
      // Then run the Listener
      listener.call(mediaQuery, Object.assign(new Event('change'), mediaQuery))
    })
  },
  reset() {
    GlobalColorScheme.subscriptions = []
    GlobalColorScheme.current = null
  },
  /**
   * @param { QueryListener } callback
   * @param { MediaQueryList } mediaQuery
   */
  subscribe(callback, mediaQuery) {
    if (callback) GlobalColorScheme.subscriptions.push([callback, mediaQuery])
  },
  /** @param { QueryListener } callback */
  unsubscribe(callback) {
    if (!callback) return
    const index = GlobalColorScheme.subscriptions.findIndex(([listener]) => listener === callback)
    GlobalColorScheme.subscriptions.splice(index, 1)
  },
  /** @type { [NonNullable<QueryListener>, MediaQueryList][] } */ subscriptions: [],
  /** @type { ?ColorScheme } @private */ _current: null,
}

/**
 * Creates a new MediaQuery.
 * @type { Window['matchMedia'] }
 */
export const matchMedia = (media) => {
  /** @type { MediaQueryList } */
  const mediaQuery = {
    media,
    matches: getColorSchemeFromMedia(media) === GlobalColorScheme.current,
    addListener: (listener) => GlobalColorScheme.subscribe(listener, mediaQuery),
    removeListener: (listener) => GlobalColorScheme.unsubscribe(listener),

    // Not implemented
    onchange: () => {},
    dispatchEvent: () => false,
    addEventListener() {},
    removeEventListener() {},
  }

  return mediaQuery
}
