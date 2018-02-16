# @dojo/widgets/toolbar widget

Dojo 2's `Toolbar` component can be used to display an application navigation bar that can show a title and action items. Action elements can be configured to automatically collapse into a `SlidePane` component, and the `Toolbar` itself can be configured to either be fixed or statically positioned.

## Features

- Capable of auto-collapsing action elements into `SlidePane`
- Capable of rendering either a fixed or statically positioned root element
- Capable of positioning a _fixed_ toolbar at the top or the bottom of the viewport. Note that statically positioning a toolbar at the bottom is not supported.
- Customizable `title` element

### Accessibility Features

The menu button displays screen-readable text that's visually hidden and its icon has an `aria-hidden` attribute. However, the `Toolbar` component makes no assumptions about what content will be inserted through `actions`. If you wish to create a site-wide navigation section, it would be best to wrap links in an element with the appropriate semantics (e.g. `<nav>` or `role="navigation"`.)

## Themeing

The following CSS classes are used to style the `Toolbar` widget and should be provided by custom themes:

- `action`: Applied to the parent of each action item
- `actions`: Applied to the parent of the actions container
- `collapsed`: Applied to the root node if the root width is less than `collapseWidth`
- `menuButton`: Applied to the menu trigger
- `root`: Applied to the top-level wrapper node
- `sticky`: Applied to the root node if `fixed` is `true`
- `title`: Applied to the node containing the title element

## Example Usage

*Basic Example*
```typescript
import Toolbar from '@dojo/widgets/toolbar';
import { w } from '@dojo/widget-core/d';

w(Toolbar, {
	heading: 'My Site',
	fixed: true,
	collapseWidth: 720
}, [
	v('a', { href: '/#home' }, [ 'Home' ]),
	v('a', { href: '/#about' }, [ 'About' ]),
	v('a', { href: '/#contact' }, [ 'Contact' ])
])
```
