# @dojo/widgets/accordion-pane widget

Dojo 2's `AccordionPane` component can be used to show multiple pieces of content inside collapsible panes within a common parent component. It provides a mechanism of control over multiple child `TitlePane` components.

## Features

- Optionally supports multiple panes open at once

### Accessibility Features

An `AccordionPane` expects all children to be `TitlePane` components, and as such, supports standard keyboard navigation for toggling child content open or closed.

**TitleBar Events**:

- Space bar: toggles the pane content of a closeable child `TitlePane`

## Themeing

The following CSS classes are used to style the `AccordionPane` widget and should be provided by custom themes:

- `root`: Applied to the top-level wrapper node

## Example Usage

*Basic Example*
```typescript
import AccordionPane from '@dojo/widgets/accordion-pane';
import TitlePane from '@dojo/widgets/title-pane';
import { w } from '@dojo/widget-core/d';

w(AccordionPane, {
	onRequestOpen: (key: string) => {
		this._openKey = key;
		this.invalidate();
	},
	onRequestClose: (key: string) => {
		this._openKey = null;
		this.invalidate();
	},
	openKeys: [ this._openKey ]
}, [
	w(TitlePane, {
		title: 'Pane 1',
		key: 'foo'
	}, [ 'Foo' ]),
	w(TitlePane, {
		title: 'Pane 2',
		key: 'bar'
	}, [ 'Bar' ])
])
```
