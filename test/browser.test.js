import { createElement, resetElements, matchMedia, GlobalColorScheme } from './util'

import iconModeSwitcher from '../favicon-mode-switcher'

beforeAll(() => (window.matchMedia = matchMedia))
afterEach(() => (GlobalColorScheme.reset(), resetElements()))

test('Warns when an invalid FaviconTarget is passed', () => {
  const originalConsoleWarn = console.warn
  console.warn = jest.fn()
  const warnSpy = jest.spyOn(console, 'warn')

  const invalidEl = createElement('meta', { id: 'meta' })
  const invalidTargets = [null, '#NULL', invalidEl]

  // The invalid targets both when passed "raw" an when passed as element prop in config object
  const testTargets = [...invalidTargets, ...invalidTargets.map(element => ({ element }))]

  // @ts-ignore
  // Passed separately as first argument
  const destroyFns = testTargets.map(t => iconModeSwitcher(t))
  // @ts-ignore
  // Passed all together as an array
  destroyFns.push(iconModeSwitcher(testTargets))
  // @ts-ignore
  // NodeList with wrong element
  destroyFns.push(iconModeSwitcher(document.querySelectorAll('#meta')))

  // Should warn 13x: 6 invalid targets + 6 invalid targets in array + 1 invalid target in NodeList
  expect(warnSpy).toBeCalledTimes(13)
  for (const destroyFn of destroyFns) destroyFn()
  console.warn = originalConsoleWarn
})

test('Updates href on first run', () => {
  GlobalColorScheme.current = 'dark'

  const element = createElement('link', { href: 'INITIAL' })
  const destroy = iconModeSwitcher({ element, href: { dark: 'SUCCESS' } })

  expect(element.href).toEqual(expect.stringContaining('SUCCESS'))
  destroy()
})

test('Updates href when scheme changes', () => {
  const element = createElement('link', { href: 'INITIAL' })
  const destroy = iconModeSwitcher({ element, href: { dark: 'DARK', light: 'LIGHT' } })

  expect(element.href).toEqual(expect.stringContaining('INITIAL'))
  GlobalColorScheme.current = 'dark'
  expect(element.href).toEqual(expect.stringContaining('DARK'))
  GlobalColorScheme.current = 'light'
  expect(element.href).toEqual(expect.stringContaining('LIGHT'))
  destroy()
})

test('Uses original href if config has no value for current scheme', () => {
  const element = createElement('link', { href: 'INITIAL' })
  const destroy = iconModeSwitcher({ element, href: { dark: 'DARK' } })

  GlobalColorScheme.current = 'dark'
  expect(element.href).toEqual(expect.stringContaining('DARK'))
  GlobalColorScheme.current = 'light'
  expect(element.href).toEqual(expect.stringContaining('INITIAL'))
  destroy()
})

test('Replaces "dark" / "light" in original href if no href config is specified', () => {
  const element = createElement('link', { href: 'INITIAL-light' })
  const destroy = iconModeSwitcher({ element })

  GlobalColorScheme.current = 'dark'
  expect(element.href).toEqual(expect.stringContaining('INITIAL-dark'))
  destroy()
})

test('Allows passing a CSS selector', () => {
  const element1 = createElement('link', { href: 'INITIAL-light', id: 'select-1' })
  const element2 = createElement('link', { href: 'INITIAL-light', id: 'select-2' })
  const element3 = createElement('link', { href: 'INITIAL-light', id: 'select-3' })
  const element4 = createElement('link', { href: 'INITIAL-light', id: 'select-4' })
  const destroy1 = iconModeSwitcher('#select-1') // directly
  const destroy2 = iconModeSwitcher(['#select-2']) // in array
  const destroy3 = iconModeSwitcher({ element: '#select-3' }) // as element prop
  const destroy4 = iconModeSwitcher([{ element: '#select-4' }]) // prop in array

  GlobalColorScheme.current = 'dark'
  expect(element1.href).toEqual(expect.stringContaining('INITIAL-dark'))
  expect(element2.href).toEqual(expect.stringContaining('INITIAL-dark'))
  expect(element3.href).toEqual(expect.stringContaining('INITIAL-dark'))
  expect(element4.href).toEqual(expect.stringContaining('INITIAL-dark'))

  destroy1()
  destroy2()
  destroy3()
  destroy4()
})

test('Allows passing an HTMLLinkElement', () => {
  const element1 = createElement('link', { href: 'INITIAL-light' })
  const element2 = createElement('link', { href: 'INITIAL-light' })
  const element3 = createElement('link', { href: 'INITIAL-light' })
  const element4 = createElement('link', { href: 'INITIAL-light' })
  const destroy1 = iconModeSwitcher(element1) // directly
  const destroy2 = iconModeSwitcher([element2]) // in array
  const destroy3 = iconModeSwitcher({ element: element3 }) // as element prop
  const destroy4 = iconModeSwitcher([{ element: element4 }]) // prop in array

  GlobalColorScheme.current = 'dark'
  expect(element1.href).toEqual(expect.stringContaining('INITIAL-dark'))
  expect(element2.href).toEqual(expect.stringContaining('INITIAL-dark'))
  expect(element3.href).toEqual(expect.stringContaining('INITIAL-dark'))
  expect(element4.href).toEqual(expect.stringContaining('INITIAL-dark'))

  destroy1()
  destroy2()
  destroy3()
  destroy4()
})

test('Allows passing a NodeList', () => {
  const element = createElement('link', { href: 'INITIAL-light', id: 'NodeList' })
  const destroy = iconModeSwitcher(document.querySelectorAll('#NodeList'))

  GlobalColorScheme.current = 'dark'
  expect(element.href).toEqual(expect.stringContaining('INITIAL-dark'))
  destroy()
})

test('Allows passing a mix of FaviconTargets', () => {
  const element1 = createElement('link', { href: 'INITIAL-light' })
  const element2 = createElement('link', { href: 'INITIAL-light' })
  const element3 = createElement('link', { href: 'INITIAL-light', id: 'mix-3' })
  const element4 = createElement('link', { href: 'INITIAL-light', id: 'mix-4' })
  const destroy = iconModeSwitcher([
    element1,
    { element: element2 },
    '#mix-3',
    { element: '#mix-4' },
  ])

  GlobalColorScheme.current = 'dark'
  expect(element1.href).toEqual(expect.stringContaining('INITIAL-dark'))
  expect(element2.href).toEqual(expect.stringContaining('INITIAL-dark'))
  expect(element3.href).toEqual(expect.stringContaining('INITIAL-dark'))
  expect(element4.href).toEqual(expect.stringContaining('INITIAL-dark'))
  destroy()
})

test('Removes listeners and resets icons when destroy() is called', () => {
  const element = createElement('link', { href: 'INITIAL' })
  const destroy = iconModeSwitcher({ element, href: { dark: 'DARK', light: 'LIGHT' } })

  GlobalColorScheme.current = 'dark'
  expect(element.href).toEqual(expect.stringContaining('DARK'))
  destroy()

  // The href is set back to original
  expect(element.href).toEqual(expect.stringContaining('INITIAL'))
  // And listeners are removed, further changes don't update the href
  GlobalColorScheme.current = 'dark'
  expect(element.href).toEqual(expect.stringContaining('INITIAL'))
})
