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

it('Allows passing a CSS selector instead of an element', () => {
  colorScheme.set('dark')

  const element = insertLink({ href: 'light.test.ico', id: 'select' })
  const destroy = faviconModeSwitcher({ element: '#select' })

  expect(element.href).toEqual(expect.stringContaining('dark.test.ico'))
  colorScheme.set('light')
  expect(element.href).toEqual(expect.stringContaining('light.test.ico'))

  destroy()
})

it('Warns when an invalid `element` prop is passed', () => {
  const originalConsoleWarn = console.warn
  console.warn = jest.fn()
  const warnSpy = jest.spyOn(console, 'warn')

  const destroyFirst = faviconModeSwitcher({ element: 'doesntExist' })
  expect(warnSpy).toBeCalledTimes(1)
  destroyFirst()

  // @ts-ignore
  const destroySecond = faviconModeSwitcher({ element: document.createElement('div') })
  expect(warnSpy).toBeCalledTimes(2)
  destroySecond()

  console.warn = originalConsoleWarn
})

it('Replaces "dark" / "light" in original href if no href config is specified', () => {
  colorScheme.set('dark')

  const element = insertLink({ href: 'light.test.ico' })
  const destroy = faviconModeSwitcher({ element })

  expect(element.href).toEqual(expect.stringContaining('dark.test.ico'))
  colorScheme.set('light')
  expect(element.href).toEqual(expect.stringContaining('light.test.ico'))

  destroy()
})

it('Sets link.href to matching value from href config', () => {
  const element = insertLink({ href: 'base.ico' })
  const destroy = faviconModeSwitcher({ element, href: { dark: 'dark.ico', light: 'light.ico' } })

  expect(element.href).toEqual(expect.stringContaining('base.ico'))

  colorScheme.set('dark')
  expect(element.href).toEqual(expect.stringContaining('dark.ico'))
  colorScheme.set('light')
  expect(element.href).toEqual(expect.stringContaining('light.ico'))

  destroy()
})

it('Falls back to original href if config has no value for current scheme', () => {
  const element = insertLink({ href: 'original.ico' })
  const destroy = faviconModeSwitcher({ element, href: { dark: 'dark.ico' } })

  colorScheme.set('dark')
  expect(element.href).toEqual(expect.stringContaining('dark.ico'))
  colorScheme.set('light')
  expect(element.href).toEqual(expect.stringContaining('original.ico'))

  destroy()
})

it('Removes listeners and resets icons when destroy() is called', () => {
  const element = insertLink({ href: 'original.ico' })
  const destroy = faviconModeSwitcher({ element, href: { dark: 'dark.ico', light: 'light.ico' } })

  expect(element.href).toEqual(expect.stringContaining('original.ico'))

  colorScheme.set('dark')
  expect(element.href).toEqual(expect.stringContaining('dark.ico'))

  // href is set back to original
  destroy()
  expect(element.href).toEqual(expect.stringContaining('original.ico'))

  // and listeners are removed, further changes don't update the href
  colorScheme.set('dark')
  expect(element.href).toEqual(expect.stringContaining('original.ico'))
})
