# @dojo/widgets/dialog/Dialog widget

Dojo 2's `Dialog` component can be used to show content inside a window over top the application content. It provides default styling for a titlebar, content area, underlay, and a close button, and will respond to different screen sizes responsively.

## Features

- Can be used as a modal window or classic dialog
- Possible to show a semi-transparent underlay
- Custom CSS animations can be provided

![Image of basic dialog](http://placekitten.com/450/300)

### Accessibility Features

- The titlebar and content have screen-reader-accessible labels and instructions
- The close button is a `<button>` with screen-reader-accessible instructive text

### i18n Features
- A localized version of the close button instructive text can be passed in via the `closeText` property.

## Example Usage

*Basic Example*
```typescript
import Dialog from '@dojo/widgets/dialog/Dialog';
import { w } from '@dojo/widget-core/d';

w(Dialog, {
	title: 'My Dialog',
	open: this.state.open,
	onRequestClose: () => this.setState({ open: false })
}, [ 'My dialog content...' ])
```

*Modal with underlay*
```typescript
import Dialog from '@dojo/widgets/dialog/Dialog';
import { w } from '@dojo/widget-core/d';

w(Dialog, {
	title: 'My Dialog',
	open: this.state.open,
	modal: true,
	underlay: true,
	onRequestClose: () => this.setState({ open: false })
}, [ 'My dialog content...' ])
```

*Custom animations*
```typescript
import Dialog from '@dojo/widgets/dialog/Dialog';
import { w } from '@dojo/widget-core/d';

w(Dialog, {
	title: 'My Dialog',
	open: this.state.open,
	enterAnimation: 'fly-in',
	exitAnimation: 'fly-out',
	onRequestClose: () => this.setState({ open: false })
}, [ 'My dialog content...' ])
```

*Dialog that can't be closed*
```typescript
import Dialog from '@dojo/widgets/dialog/Dialog';
import { w } from '@dojo/widget-core/d';

w(Dialog, {
	title: 'My Dialog',
	open: this.state.open,
	closeable: false
}, [ 'My dialog content...' ])
```
