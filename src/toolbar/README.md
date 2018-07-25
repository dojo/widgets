# @dojo/widgets/toolbar widget

Dojo 2's `Toolbar` component can be used to display an application navigation bar that can show a title and action items. Action elements can be configured to automatically collapse into a `SlidePane` component.

## Features

- Capable of auto-collapsing action elements into `SlidePane`

### Accessibility Features

The menu button displays screen-readable text that's visually hidden and its icon has an `aria-hidden` attribute. However, the `Toolbar` component makes no assumptions about what content will be inserted through `actions`. If you wish to create a site-wide navigation section, it would be best to wrap links in an element with the appropriate semantics (e.g. `<nav>` or `role="navigation"`.)

## Themeing

The following CSS classes are used to style the `Toolbar` widget and should be provided by custom themes:

- `actions`: Applied to the parent of the actions container
- `collapsed`: Applied to the root node if the root width is less than `collapseWidth`
- `menuButton`: Applied to the menu trigger
- `root`: Applied to the top-level wrapper node
- `title`: Applied to the node containing the title element

## Example Usage

*Basic Example*
```typescript
import Toolbar from '@dojo/widgets/toolbar';
import { w } from '@dojo/framework/widget-core/d';

w(Toolbar, {
	heading: 'My Site',
	collapseWidth: 720
}, [
	v('a', { href: '/#home' }, [ 'Home' ]),
	v('a', { href: '/#about' }, [ 'About' ]),
	v('a', { href: '/#contact' }, [ 'Contact' ])
])
```

*Fixed position Example*
```typescript
import Toolbar from '@dojo/widgets/toolbar';
import { w } from '@dojo/framework/widget-core/d';

// wrap toolbar in a fixed element
v('div', { styles: { position: fixed, top: 0 } }, [
	w(Toolbar, {
		heading: 'My Site',
		collapseWidth: 720
	}, [
		v('a', { href: '/#home' }, [ 'Home' ]),
		v('a', { href: '/#about' }, [ 'About' ]),
		v('a', { href: '/#contact' }, [ 'Contact' ])
	])
]);

```
