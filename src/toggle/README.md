# @dojo/widgets/checkbox/Checkbox widget

Dojo 2's `Checkbox` widget provides either a wrapped, styleable checkbox widget or an on/off toggle. Both the normal and toggle `Checkbox` modes use the native `<input type="checkbox">` as a base.


## Features

- Creates either a normal checkbox or toggle switch
- Correctly handles a11y attributes
- Wraps the input in a visible or invisible but accessible `<label>` if the `label` property is added

### Accessibility Features

`Checkbox` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used.

When using the toggle mode, only one of `onLabel` and `offLabel` will be read, based on the current state. E.g. if checked with a label of "Sample Checkbox", the full screen reader-accessible label would read "Sample Checkbox On".

## Example Usage

```typescript
// Normal usage
w(Checkbox, {
	label: 'Sign up for updates',
	name: 'update-checkbox'
	checked: this.state.checked,
	value: 'updates',
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ checked: event.target.checked });
	},
});

// Toggle mode with description
w(Checkbox, {
	checked: this.state.musicChecked,
	describedBy: 'instructions',
	label: 'Play music',
	mode: Mode.toggle,
	name: 'music',
	onLabel: 'On',
	offLabel: 'Off',
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ musicChecked: event.target.checked });
	}
}),
v('p', {
	id: 'instructions'
}, [ 'Turns background music on or off' ]);
```

## Theming

The following CSS classes are available on the `Checkbox` widget for use with custom themes:

- `root`: Applied to either the wrapping `<label>`, or a `<div>` in the same position in the node hierarchy
- `checked`: Applied to the same level as `root` if `properties.checked` is true
- `disabled`: Applied to the same level as `root` if `properties.disabled` is true
- `readonly`: Applied to the same level as `root` if `properties.readOnly` is true
- `required`: Applied to the same level as `root` if `properties.required` is true
- `invalid`: Applied to the same level as `root` if `properties.invalid` is true
- `valid`: Applied to the same level as `root` if `properties.invalid` is set false (i.e. not only undefined)
- `toggle`: Applied to the same level as `root` if `properties.mode` is `Mode.toggle`
- `inputWrapper`: Applied to the immediate parent of the `<input>`
- `input`: Applied to the `<input>` element
- `onLabel`: Applied to the node used for the "on" text in toggle mode
- `offLabel`: Applied to the node used for the "off" text in toggle mode
