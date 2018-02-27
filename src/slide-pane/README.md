# @dojo/widgets/slidepane/SlidePane widget

Dojo 2's `SlidePane` widget provides a component capable of moving content into or out of the viewport, as is commonly used for mobile navigation menus.


## Features

- Can be positioned on the left or right edge of the screen
- Position and animation powered by CSS transforms for maximum performance
- Pane follows the pointing device as it's opened or closed

## Example Usage

*Basic Example*
```typescript
import { w } from '@dojo/widget-core/d';
import SlidePane from '@dojo/widgets/slidepane/SlidePane';

w(SlidePane, {
	open: this.state.open,
	underlay: true,
	onRequestClose: () => this.setState({ open: false })
}, [ 'Some content...' ]);
```

*Right-aligned*
```typescript
import { w } from '@dojo/widget-core/d';
import SlidePane, { Align } from '@dojo/widgets/slidepane/SlidePane';

w(SlidePane, {
	open: this.state.open,
	align: Align.right,
	onRequestClose: () => this.setState({ open: false })
}, [ 'Some content...' ]);
```

## Theming

The following CSS classes are used to style the `SlidePane` widget and should be provided by custom themes:

- `content`: Applied to the content of the `SlidePane`
- `left`: Applied to the content of a left-aligned `SlidePane`
- `open`: Applied to the content of an open `SlidePane`
- `right`: Applied to the content of a right-aligned `SlidePane`
- `root`: Applied to the top-level wrapper node
- `slideIn`: Applied to the content of an opening `SlidePane`
- `slideOut`: Applied to the content of a closing `SlidePane`
- `underlay`: Applied to the element covering all content except this pane
