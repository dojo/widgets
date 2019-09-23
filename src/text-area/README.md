# @dojo/widgets/text-area widget

Dojo's `TextArea` widget provides a wrapped native `textarea` input, optionally with a label.


## Features

- Provides an API for valid `<textarea>` attributes
- Correctly handles a11y attributes
- Associates a visible or invisible but accessible `<label>` with the `textarea` if the `label` property is added

### Accessibility Features

`TextArea` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `valid`, etc. are used. It also provides an API for custom ARIA implementations of `aria-describedby` and `aria-controls`. It also sets `aria-invalid` when validation fails.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.

## Example Usage

```typescript
// Basic usage
w(TextArea, {
	label: 'Your Message',
	value: textAreaValue,
	onValue: (value: string) => {
		textAreaValue = value;
	},
});

// Advanced usage
w(TextArea, {
	columns: 20,
	rows: 8,
	aria: { describedBy: 'descriptionId' },
	valid: true,
	label: 'Your Message',
	maxLength: 500,
	minLength: 100,
	name: 'message',
	placeholder: 'Type something...',
	required: true,
	value: textAreaValue = value;,
	wrapText: 'hard',
	onValue: (value: string) => {
		textAreaValue = value;
	}
})
```

## Theming

The following CSS classes are available on the `Textarea` widget for use with custom themes:

- `root`: Applied to either the wrapping `<label>`, or a `<div>` in the same position in the node hierarchy
- `disabled`: Applied to the same level as `root` if `properties.disabled` is true
- `readonly`: Applied to the same level as `root` if `properties.readOnly` is true
- `required`: Applied to the same level as `root` if `properties.required` is true
- `invalid`: Applied to the same level as `root` if `properties.valid` is false
- `valid`: Applied to the same level as `root` if `properties.valid` is set true
- `inputWrapper`: Applied to the immediate parent of the `<input>`
- `input`: Applied to the `<input>` element
