# @dojo/widgets/title-pane widget

Dojo 2's `TitlePane` component can be used to display content inside a window with a titlebar. When the titlebar is clicked, the content collapses. This component provides default styling for the titlebar, and content area, and will respond to different screen sizes responsively.

## Features

- Content can be prevented from collapsing

![Image of basic title pane](http://placekitten.com/450/300)

### Keyboard Usage

`TitlePane` supports standard keyboard navigation for toggling the content open or closed.

**TitleBar Events**:

- Space bar: toggles the pane content of a closeable `TitlePane`

### Accessibility Features

- The titlebar has a role of heading and accepts a `headingLevel` property to set the correct heading level
- The accordion panel has `aria-labelledby` set to the titlebar
- The accordion opens on Enter and Space
- `aria-expanded` is set to `true` or `false` on the toggle button depending on `properties.open`
- `aria-controls` on the toggle button points to the accordion content

## Themeing

The following CSS classes are used to style the `TitlePane` widget and should be provided by custom themes:

- `closeable`: Applied to a closeable titlebar
- `content`: Applied to content of the pane
- `root`: Applied to the top-level wrapper node
- `title`: Applied to the titlebar

## Example Usage

*Basic Example*
```typescript
import TitlePane from '@dojo/widgets/title-pane';
import { w } from '@dojo/widget-core/d';

w(Titlepane, {
	title: 'My Pane',
	open: this.state.open,
	onRequestOpen: () => this.setState({ open: true }),
	onRequestClose: () => this.setState({ open: false })
}, [ 'My content...' ])
```

*TitlePane that can't be closed*
*Basic Example*
```typescript
import TitlePane from '@dojo/widgets/title-pane';
import { w } from '@dojo/widget-core/d';

w(Titlepane, {
	title: 'My Pane',
	open: true,
	closeable: false
}, [ 'My content...' ])
```
