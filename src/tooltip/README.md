# @dojo/widgets/tooltip widget

Dojo's `Tooltip` component can be used to show or hide content around a child component based on specific events.

## Features

- Agnostic to an eventing implementation
- Supports top, right, bottom, and left orientations
- Optionally persistent

## Themeing

The following CSS classes are used to style the `Tooltip` widget and should be provided by custom themes:

- `bottom`: Applied to the top-level wrapper node for a bottom-oriented tooltip
- `content`: Applied to the node containing property-supplied tooltip content
- `left`: Applied to the top-level wrapper node for a left-oriented tooltip
- `right`: Applied to the top-level wrapper node for a right-oriented tooltip
- `root`: Applied to the top-level wrapper node
- `top`: Applied to the top-level wrapper node for a top-oriented tooltip

## Example Usage

*Basic Example*
```typescript
import TextInput from '@dojo/widgets/text-input';
import Tooltip from '@dojo/widgets/tooltip';
import { w } from '@dojo/framework/widget-core/d';

w(Tooltip, {
	key: 'foo',
	content: 'This is a tooltip!',
	open: this._tooltipShowing
}, [
	w(TextInput, {
		placeholder: 'Focus me',
		onFocus: () => {
			this._tooltipShowing = true;
			this.invalidate();
		},
		onBlur: () => {
			this._tooltipShowing = false;
			this.invalidate();
		}
	})
])
```
