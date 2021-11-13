it('Does not throw on require() in Node environment', () => {
  const fn = () => {
    require('../favicon-mode-switcher')
  }

  expect(fn).not.toThrow()
})

it('Returns destroy function', () => {
  const destroy = require('../favicon-mode-switcher')

  expect(typeof destroy).toBe('function')
  expect(destroy).not.toThrow()
})
