export as namespace faviconModeSwitcher

export type ColorScheme = 'dark' | 'light'

/**
 * *Keep these props in sync with minifier option --mangle-props in `package.json`*
 */
export type Icon = { linkElement: HTMLLinkElement; hrefConfig?: HrefConfig; baseHref: string }

export type Selector = Parameters<Document['querySelector']>[0]

export type HrefConfig = { [Key in ColorScheme]?: string }

/**
 * Object containing options for an icon that should be updated. Contains a selector string for
 * the HTMLLinkElement to control and an optional Object specifying the hrefs to use.
 *
 * If you don't pass the href Object, the substrings `"light"`/`"dark"` in the URI found on the
 * HTMLLinkElement will be updated/replaced according to the active color scheme.
 */
export type IconConfig = {
  /** An `HTMLLinkElement` or a CSS selector that must return an `HTMLLinkElement`
   *  when passed to `document.querySelector()`.
   */
  element: Selector | HTMLLinkElement
  /**
   * Specifies the resource URIs to use. If you omit this property, the substring `"light"` or
   * `"dark"` in the original URI found on the HTMLLinkElement will be *updated / replaced*
   * every time the active color scheme changes.
   *
   * The *key* is one of the color schemes, the *value* is the `href` used when the scheme is active
   *
   * If the currently active scheme matches none of the specified hrefs, the initial href that
   * was found on the HTMLLinkElement is used.
   */
  href?: HrefConfig
}

export type FaviconTarget = Selector | HTMLLinkElement | IconConfig

/** Remove the color scheme listeners and reset all icons to their original href. */
declare function DestroyFunction(): void

/**
 * Takes in icon configuration, sets up listeners for the active color scheme
 * and updates hrefs of the specified icons whenever the active scheme changes.
 * @param options A CSS selector, an HTMLLinkElement or a config object. Can also be an an array.
 */
declare function FaviconModeSwitcher(
  options: FaviconTarget | FaviconTarget[] | NodeListOf<HTMLLinkElement>,
): typeof DestroyFunction

export default FaviconModeSwitcher
