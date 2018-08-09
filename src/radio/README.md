# @dojo/widgets/radio widget

Dojo's `Radio` widget provides a styleable radio widget with an optional label.


## Features

- Correctly handles a11y attributes
- Wraps the input in a visible or invisible but accessible `<label>` if the `label` property is added

### Accessibility Features

`Radio` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.

## Example Usage

```typescript
// Example usage
w(Radio, {
	checked: this.state.radioValue === 'radio1-1',
	describedBy: 'instructions',
	label: 'Choice A',
	name: 'radio1'
	value: 'radio1-1',
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ radioValue: event.target.value });
	},
}),
w(Radio, {
	checked: this.state.radioValue === 'radio1-2',
	describedBy: 'instructions',
	label: 'Choice B',
	name: 'radio1'
	value: 'radio1-2',
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ radioValue: event.target.value });
	},
}),
v('p', {
	id: 'instructions'
}, [ 'Extra helper text for radios' ]);
```

## Theming

The following CSS classes are available on the `Radio` widget for use with custom themes:

- `root`: Applied to either the wrapping `<label>`, or a `<div>` in the same position in the node hierarchy
- `checked`: Applied to the same level as `root` if `properties.checked` is true
- `disabled`: Applied to the same level as `root` if `properties.disabled` is true
- `readonly`: Applied to the same level as `root` if `properties.readOnly` is true
- `required`: Applied to the same level as `root` if `properties.required` is true
- `invalid`: Applied to the same level as `root` if `properties.invalid` is true
- `valid`: Applied to the same level as `root` if `properties.invalid` is set false (i.e. not only undefined)
- `inputWrapper`: Applied to the immediate parent of the `<input>`
- `input`: Applied to the `<input>` element
