# @dojo/widgets/button widget

Dojo 2's `Button` widget creates a `<button>` element


## Features

- Provides an API for valid `<button>` attributes
- Can be used to create a toggle button (i.e. a button with an on/off state)
- Provides an easy API to create a button controlling a popup

### Accessibility Features

- The basic button provides a strongly typed `type` property, as well as `describedBy` and `disabled`
- Setting `pressed` to create a toggle button handles `aria-pressed`
- Creating a popup button with `popup` sets `aria-haspopup`, `aria-controls`, and `aria-expanded`

## Example Usage

```typescript
// Basic usage
w(Button, {
	type: 'submit',
	value: 'foo'
}, [ 'Submit' ]);

// Toggle button
// pressed must be a boolean to correctly set aria-pressed
w(Button, {
	describedBy: 'instructions',
	pressed: !!this.state.buttonPressed,
	onClick: (event: MouseEvent) => {
		this.setState({ buttonPressed: !this.state.buttonPressed });
	}
}, [ 'Click Me' ]),
v('p', {
	id: 'instructions'
}, [ 'You can use this pattern to provide extra information, if necessary' ]);

// Button that controls a popup (e.g. a modal or tooltip)
w(Button, {
	id: 'foo',
	popup: {
		id: 'bar',
		expanded: this.state.popupOpen
	},
	onClick: () => {
		this.setState({ popupOpen: !this.state.popupOpen });
	}
}, [ 'Open Popup' ]),
v('div', {
	id: 'bar',
	...
}, [ 'Popup Content' ])
```

## Theming

The following CSS classes are available on the root node of the `Button` widget for use with custom themes:

- `root`: Always available
- `disabled`: Applied if `properties.disabled` is true
- `popup`: Applied if `properties.popup` has a non-false value
- `pressed`: Applied if `properties.pressed` is true
- `addon`: Applied to the popup icon container if `properties.popup` has a non-false value
