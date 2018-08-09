# @dojo/widgets/split-pane widget

Dojo's `SplitPane` component divides a container into two resizable panes that can oriented horizontally or vertically. It expects two child nodes.

## Features

- Can be nested to create more than two panes
- Panes can be in a horizontal or vertical orientation
- Will collapse to a stacked layout at a set width

## Themeing

The following CSS classes are used to style the `SplitPane` widget and should be provided by custom themes:

- `collapsed`: Applied to the root node when the width is below `collapseWidth`
- `column`: Applied to the root node if `direction` is set to `Direction.column`
- `divider`: Applied to the divider node
- `leading`: Applied to the first pane in the DOM
- `root`: Applied to the top-level node
- `row`: Applied to the root node if `direction` is set to `Direction.row`
- `trailing`: Applied to the last pane in the DOM

## Example Usage

*Basic Row Example*
```typescript
import SplitPane, { Direction } from '@dojo/widgets/split-pane';
import { w } from '@dojo/framework/widget-core/d';

w(SplitPane, {
	key: 'splitpane1',
	direction: Direction.row,
	onResize: (size: number) => {
		this.setState({ rowSize: size });
	},
	size: this.state.rowSize
}, [
	v('div', [ 'top' ]),
	v('div', [ 'bottom' ])
]);
```

*Column example that collapses at 600px*
```typescript
import SplitPane, { Direction } from '@dojo/widgets/split-pane';
import { w } from '@dojo/framework/widget-core/d';

w(SplitPane, {
	key: 'splitpane2',
	collapseWidth: 600,
	direction: Direction.column,
	onResize: (size: number) => {
		this.setState({ columnSize: size });
	},
	size: this.state.columnSize
}, [
	v('div', [ 'left' ]),
	v('div', [ 'right' ])
]);
```

*Nested SplitPanes*
```typescript
import SplitPane, { Direction } from '@dojo/widgets/split-pane';
import { w } from '@dojo/framework/widget-core/d';

w(SplitPane, {
	key: 'nested',
	direction: Direction.column,
	onResize: (size: number) => {
		this.setState({ nestedSizeA: size });
	},
	size: this.state.nestedSizeA
}, [
	v('div'),
	w(SplitPane, {
		key: 'inner',
		direction: Direction.row,
		onResize: (size: number) => {
			this.setState({ nestedSizeB: size });
		},
		size: this.state.nestedSizeB
	})
])
```
