declare module 'favicon-mode-switcher' {
  export type ColorScheme = 'dark' | 'light'

  /**
   * Object containing options for an icon that should be updated. Contains a selector string for
   * the HTMLLinkElement to control and an optional Object specifying the hrefs to use.
   *
   * If you don't pass the href Object,
   */
  export type IconOption = {
    /** CSS selector to get the HTMLLinkElement whose href should be updated on mode change.
     *
     *  Passed to document.querySelector().
     */
    selector: string
    /**
     * Specifies the ressource URIs to use. If you omit this argument, the substring "light" or
     * "dark" in the original URI found on the HTMLLinkElement will be updated/replaced depending
     * on the currently active color scheme.
     *
     * The key is one of the color schemes, the value is the href used while the scheme is active.
     *
     * If the currently active scheme matches none of the specified hrefs, the initial href that
     * was found on the HTMLLinkElement is used.
     */
    href?: { [Key in ColorScheme]?: string }
  }

  export interface Icon extends IconOption {
    element: HTMLLinkElement
  }

  export type DestroyFunction = () => void
  export type FaviconModeSwitcher = (options: IconOption | IconOption[]) => DestroyFunction

  export = FaviconModeSwitcher
}
