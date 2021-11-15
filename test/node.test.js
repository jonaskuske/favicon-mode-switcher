it('Does not throw on require() in Node environment', () => {
  const fn = () => {
    require('../favicon-mode-switcher')
  }

  expect(fn).not.toThrow()
})

it('Returns destroy function', () => {
  /** @type {any} */
  const _faviconModeSwitcher = require('../favicon-mode-switcher')

  /** @type {import('../favicon-mode-switcher').FaviconModeSwitcher} */
  const faviconModeSwitcher = _faviconModeSwitcher

  const destroy = faviconModeSwitcher([])

  expect(typeof destroy).toBe('function')
  expect(destroy).not.toThrow()
})
