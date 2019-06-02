/** @typedef { import('index').ColorScheme } ColorScheme */
/** @typedef { Parameters<MediaQueryList['addListener']>[0] } QueryListener */

import faviconModeSwitcher from '../favicon-mode-switcher'

const insertLink = (props = {}) => {
  props = Object.assign({ rel: 'shortcut icon', href: '' }, props)
  return document.body.appendChild(Object.assign(document.createElement('link'), props))
}

const colorScheme = {
  /** @type { ?ColorScheme } */ current: null,
  /** @type { [NonNullable<QueryListener>, MediaQueryList][] } */ _subscriptions: [],
  set(/** @type { ColorScheme } */ scheme) {
    colorScheme.current = scheme
    colorScheme._subscriptions.forEach(([listener, query]) => {
      // @ts-ignore
      query.matches = query.media === scheme
      listener.call(query, Object.assign(new Event('change'), query))
    })
  },
  subscribe(/** @type { QueryListener } */ listener, /** @type { MediaQueryList } */ query) {
    if (listener) colorScheme._subscriptions.push([listener, query])
  },
  unsubscribe(/** @type { QueryListener } */ listener) {
    if (!listener) return
    const index = colorScheme._subscriptions.findIndex(([cb]) => cb === listener)
    colorScheme._subscriptions.splice(index, 1)
  },
}

beforeAll(() => {
  window.matchMedia = queryString => {
    /** @type { ColorScheme } */
    const targetedScheme = /dark/.test(queryString) ? 'dark' : 'light'
    /** @type { MediaQueryList } */
    const mediaQuery = {
      media: targetedScheme, // We abuse this prop to store which color scheme the query observes
      matches: targetedScheme === colorScheme.current,
      addListener: cb => colorScheme.subscribe(cb, mediaQuery),
      removeListener: cb => colorScheme.unsubscribe(cb),
      // Not implemented
      onchange: () => {},
      dispatchEvent: () => false,
      addEventListener() {},
      removeEventListener() {},
    }
    return mediaQuery
  }
})
afterEach(() => {
  colorScheme.current = null
  colorScheme._subscriptions = []
})

it('Replaces "dark"/"light" in original href if no href config is specified', () => {
  colorScheme.set('dark')

  const link = insertLink({ href: 'light.test.ico', id: 'replace' })
  const destroy = faviconModeSwitcher({ selector: '#replace' })

  expect(link.href).toEqual(expect.stringContaining('dark.test.ico'))
  colorScheme.set('light')
  expect(link.href).toEqual(expect.stringContaining('light.test.ico'))

  destroy()
})

it('Sets link.href to matching value from href config', () => {
  const link = insertLink({ href: 'base.ico', id: 'config' })
  const destroy = faviconModeSwitcher({
    selector: '#config',
    href: { dark: 'dark.ico', light: 'light.ico' },
  })

  expect(link.href).toEqual(expect.stringContaining('base.ico'))

  colorScheme.set('dark')
  expect(link.href).toEqual(expect.stringContaining('dark.ico'))
  colorScheme.set('light')
  expect(link.href).toEqual(expect.stringContaining('light.ico'))

  destroy()
})

it('Falls back to original href if config has no value for current scheme', () => {
  const link = insertLink({ href: 'original.ico', id: 'fallback' })
  const destroy = faviconModeSwitcher({ selector: '#fallback', href: { dark: 'dark.ico' } })

  colorScheme.set('dark')
  expect(link.href).toEqual(expect.stringContaining('dark.ico'))
  colorScheme.set('light')
  expect(link.href).toEqual(expect.stringContaining('original.ico'))

  destroy()
})

it('Removes listeners and resets icons when destroy() is called', () => {
  const link = insertLink({ href: 'original.ico', id: 'destroy' })
  const destroy = faviconModeSwitcher({
    selector: '#destroy',
    href: { dark: 'dark.ico', light: 'light.ico' },
  })

  expect(link.href).toEqual(expect.stringContaining('original.ico'))

  colorScheme.set('dark')
  expect(link.href).toEqual(expect.stringContaining('dark.ico'))

  // href is set back to original
  destroy()
  expect(link.href).toEqual(expect.stringContaining('original.ico'))

  // and listeners are removed, further changes don't update the href
  colorScheme.set('dark')
  expect(link.href).toEqual(expect.stringContaining('original.ico'))
})
