# @dojo/widgets/text-input widget

Dojo's `TextInput` widget provides a basic text input widget with an optional label.


## Features

- Allows specification of input type (e.g. `text`, `email`, `number`, etc)
- Correctly handles a11y attributes
- Associates a visible or invisible but accessible `<label>` with the input if the `label` property is added
- Allows leading / trailing icons / text to be added

### Accessibility Features

`TextInput` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, etc. are used. It also provides an API for custom ARIA implementations of `aria-describedby` and `aria-controls`. It also sets `aria-invalid` when validation fails.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `id` property.

## Example Usage

```typescript
// Basic usage
w(TextInput, {
	label: 'Email Address',
	value: this.state.firstName,
    type: 'email',
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ firstName: event.target.value });
	},
});

// Advanced usage
w(TextInput, {
	aria: { describedBy: 'instructions' },
	label: 'Create Password',
	maxLength: 20,
	name: 'password',
	placeholder: 'Type password',
	required: true,
	type: 'password',
	helperText: 'Password must contain letters and numbers',
	value: this.state.password,
    valid: this.state.valid,
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ password: event.target.value });
		this.setState({ passwordValid: this._validatePassword() });
	}
}),
v('p', {
	id: 'instructions'
}, [ 'Password must be at least 6 characters' ]);
```

## Validation

Native validation information is provided to the `onValidate` callback via two arguments: `(valid?: boolean, message?: string)`. This does not have any affect on how the input is rendered, though. To set validation state, pass `valid: boolean` to the widget, or for a more advanced use case, pass `valid: { valid: boolean; message: string}` to render the error message as custom helperText below the input.

```typescript
w(TextInput, {
	type: 'text',
	label: 'Type "foo" or "bar"',
	value: this.state.value,
	valid: this.state.valid,
	required: true,
	helperText: 'helper text',
	onValidate: (valid?: boolean, message?: string) => {
		this.setState(valid: { valid, message });
		this.invalidate();
	},
	pattern: 'foo|bar',
	onInput: (value: string) => {
		this.setState({ value });
		this.invalidate();
	}
})
```

### Custom validation

By default, the values passed to the `onValidate` callback are from the native browser validation APIs, `element.valdiity.valid` and `element.validationMessage`, respectively. A `customValdiator` property can be defined as a function which receives the current value and can optionally return `{ valid?: boolean; message?: string; }` to override the values passed to `onValidate`. Note that `customValidator` will only be called after the native validation returns `valid: true`.

```typescript
w(TextInput, {
	type: 'text',
	value: this.state.value,
	valid: this.state.valid,
	required: true,
	minLength: 6,
	valid: this.state.valid,
	customValidator(value) {
		if (value.includes('foo')) {
			return { valid: false, message: 'string must contain "foo"' };
		}
	},
	onValidate: (valid?: boolean, message?: string) => {
		this.setState(valid: { valid, message });
		this.invalidate();
	},
	pattern: 'foo|bar',
	onInput: (value: string) => {
		this.setState({ value });
		this.invalidate();
	}
})
```

### Leading / Trailing icons

The `TextInput` widget can display a `leading` or `trailing` `Dnode` passed via the appropriate render property. These could be used to display an icon or a unit of measurement etc.

```typescript
w(TextInput, {
	type: 'number',
	value: this.state.value,
	onInput: (value: string) => {
		this.setState({ value });
		this.invalidate();
	},
	leading: () => v('span', {}, [ '£' ]),
	trailing: () => v('span', {}, [ '.00' ]),
})
```

## Theming

The following CSS classes are available on the `TextInput` widget for use with custom themes:

- `root`: Applied to either the wrapping `<label>`, or a `<div>` in the same position in the node hierarchy
- `disabled`: Applied to the same level as `root` if `properties.disabled` is true
- `readonly`: Applied to the same level as `root` if `properties.readOnly` is true
- `required`: Applied to the same level as `root` if `properties.required` is true
- `invalid`: Applied to the same level as `root` if validation is enabled and returns `{ valid: false }`.
- `valid`: Applied to the same level as `root` if validation is enabled and returns `{ valid: true }`.
- `inputWrapper`: Applied to the immediate parent of the `<input>`
- `input`: Applied to the `<input>` element
