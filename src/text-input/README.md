# @dojo/widgets/text-input widget

Dojo 2's `TextInput` widget provides a basic text input widget with an optional label.


## Features

- Allows specification of input type (e.g. `text`, `email`, `number`, etc)
- Correctly handles a11y attributes
- Associates a visible or invisible but accessible `<label>` with the input if the `label` property is added

### Accessibility Features

`TextInput` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used. It also provides an API for custom ARIA implementations of `aria-describedby` and `aria-controls`.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.

## Example Usage

```typescript
// Basic usage
w(TextInput, {
	label: 'First Name',
	value: this.state.firstName,
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ firstName: event.target.value });
	},
});

// Advanced usage
w(TextInput, {
	aria: { describedBy: 'instructions' },
	invalid: this.state.passwordValid,
	label: 'Create Password',
	maxLength: 20,
	name: 'password',
	placeholder: 'Type password',
	required: true,
	type: 'password',
	value: this.state.password,
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ password: event.target.value });
		this.setState({ passwordValid: this._validatePassword() });
	}
}),
v('p', {
	id: 'instructions'
}, [ 'Password must be at least 6 characters' ]);
```

## Theming

The following CSS classes are available on the `TextInput` widget for use with custom themes:

- `root`: Applied to either the wrapping `<label>`, or a `<div>` in the same position in the node hierarchy
- `disabled`: Applied to the same level as `root` if `properties.disabled` is true
- `readonly`: Applied to the same level as `root` if `properties.readOnly` is true
- `required`: Applied to the same level as `root` if `properties.required` is true
- `invalid`: Applied to the same level as `root` if `properties.invalid` is true
- `valid`: Applied to the same level as `root` if `properties.invalid` is set false (i.e. not only undefined)
- `inputWrapper`: Applied to the immediate parent of the `<input>`
- `input`: Applied to the `<input>` element
