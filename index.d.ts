export as namespace faviconModeSwitcher

/** Supported color schemes. */
export type ColorScheme = 'dark' | 'light'

/**
 * Object containing options for an icon that should be updated. Contains a selector string for
 * the HTMLLinkElement to control and an optional Object specifying the hrefs to use.
 *
 * If you don't pass the href Object, the substrings `"light"`/`"dark"` in the URI found on the
 * HTMLLinkElement will be updated/replaced according to the active color scheme.
 */
export type IconConfig = {
  /** CSS selector to get the **`HTMLLinkElement`** whose href should be updated on mode change.
   *
   *  Passed to `document.querySelector()`.
   */
  element: string | HTMLLinkElement
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
  href?: { [Key in ColorScheme]?: string }
}

export type Icon = Pick<IconConfig, 'href'> & { linkElement: HTMLLinkElement }

/** Remove the color scheme listeners and reset all icons to their original href. */
declare function DestroyFunction(): void

/**
 * Takes in icon configuration, sets up listeners for the active color scheme
 * and updates hrefs of the specified icons whenever the active scheme changes.
 * @param options The configuration, either an object for one icon or an array of config objects.
 */
declare function FaviconModeSwitcher(options: IconConfig | IconConfig[]): typeof DestroyFunction
export default FaviconModeSwitcher
