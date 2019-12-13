# @dojo/widgets/toolbar

Dojo's `Toolbar` component can be used to display an application navigation bar that can show a title and action items. Action elements can be configured to automatically collapse into a `SlidePane` component.

## Features

- Capable of auto-collapsing action elements into `SlidePane`

### Accessibility Features

The menu button displays screen-readable text that's visually hidden and its icon has an `aria-hidden` attribute. However, the `Toolbar` component makes no assumptions about what content will be inserted through `actions`. If you wish to create a site-wide navigation section, it would be best to wrap links in an element with the appropriate semantics (e.g. `<nav>` or `role="navigation"`).
