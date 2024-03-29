# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2021-11-13

### Changed

- Upgraded all dependencies
- Updated year in copyright notice

## [1.1.0] - 2019-06-11

### Added

- You can now pass selector strings or `<link>` elements directly, rather than wrapping it in a config object.
- When using an Array to specify multiple icons to target, the different options (selector, `HTMLLinkElement`, config object) can be mixed-and-matched
- In addition to Arrays, `favicon-mode-switcher` now also supports `NodeList` so you can use it with `document.querySelectorAll()`

### Changed

- Update tests and docs to match new options

## [1.0.4] - 2019-06-02

### Changed

- Rewritten main function to get bundle size to ~350B 🎉

## [1.0.3] - 2019-06-02

### Fixed

- Fix entry points in `package.json`

## [1.0.2] - 2019-06-02

### Changed

- Improved terser settings to get minzipped size <600B

## [1.0.0] - 2019-06-02

### Added

- IconConfig can now take an HTMLLinkElement directly, rather than passing a selector string. Passing selectors is still supported.

### Changed

- BREAKING: IconConfig['selector'] is now called IconConfig['element']

## [0.5.2] - 2019-06-02

### Added

- Tests added 🏗

## [0.5.1] - 2019-06-02

### Added

- Documentation / README added

## [0.5.0] - 2019-06-02

### Fixed

- Module should now export correct typings

## [0.4.1] - 2019-06-01

## Fixed

- Correctly compile minified UMD build instead of overwriting it with CJS

## [0.4.0] - 2019-06-01

### Added

- Changed build options: `index.js` is now CommonJS and exports the default export directly, UMD available as `index.umd.js`, there `.default` is necessary to access the export

### Fixed

- Correctly abort if no options are passed

## [0.3.0] - 2019-06-01

### Added

- TypeScript types (experimental)
- Better build setup with Linting
- Tests to ensure the module runs in a Node environment (SSR)

### Changed

- BREAKING: UMD default export now directly on window as faviconModeSwitcher

### Fixed

- Only show warning if specified selector didn't match an HTMLLinkElement

## [0.0.1] - 2019-06-01

### Added

- Initial version added
