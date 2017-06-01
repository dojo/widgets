# @dojo/widgets/dialog/Dialog widget
Dojo 2's `Dialog` component can be used to show content inside of a window over top of application content. It provides default styling for a titlebar, content area, underlay, and a close button, and will respond to different screen sizes responsively.

## Features

![Image of basic dialog](http://placekitten.com/450/300)

### Accessibility Features
- The titlebar and content have screen-reader-accessible labels and instructions
- The close button is a `<button>` with screen-reader-accessible instructive text

### i18n Features
- A localized version of the close button instructive text can be passed in via the `closeText` property.

## Example Usage

*Basic Example*
```js
w(Dialog, {
	title: 'My Dialog',
	open: this.state.open,
	onRequestClose: () => this.setState({ open: false })
}, [ 'My dialog content...' ])
```

*Modal with underlay*
```js
w(Dialog, {
	title: 'My Dialog',
	open: this.state.open,
	modal: true,
	underlay: true,
	onRequestClose: () => this.setState({ open: false })
}, [ 'My dialog content...' ])
```

*Custom animations*
```js
w(Dialog, {
	title: 'My Dialog',
	open: this.state.open,
	enterAnimation: 'fly-in',
	exitAnimation: 'fly-out',
	onRequestClose: () => this.setState({ open: false })
}, [ 'My dialog content...' ])
```

*Dialog that can't be closed*
```js
w(Dialog, {
	title: 'My Dialog',
	open: this.state.open,
	closeable: false
}, [ 'My dialog content...' ])
```
