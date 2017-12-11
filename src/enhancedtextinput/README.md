# @dojo/widgets/enhancedtextinput/EnhancedTextInput widget

Dojo 2's `EnhancedTextInput` widget extends `TextInput` to provide optional addons before or after the input, similar to those in [bootstrap](https://v4-alpha.getbootstrap.com/components/input-group/#basic-example).


## Features

- Allows any number of addons to be inserted before or after the input
- Includes all TextInput functionality

### Accessibility Features

The `EnhancedTextInput` does not add any built-in accessibility features above what is available in `TextInput`. If this widget is used, it should be done with attention to what instructional text is needed to convey the information visually implied by the addon or addons. This can be done in the label text, and optionally supplemented by custom descriptive text and `aria-describedby`.

After careful consideration we decided not to automatically point the input's `aria-describedby` attribute to the `id` or `id`s of the addons, as Bootstrap does in some of their examples. While this may be a helpful technique in a few select cases, many of the common addon text snippets -- e.g. `@` or `.00` -- were either insufficient to describe the user input required, or even potentially more confusing than nothing at all. Input addons rely so heavily on visual context to convey meaning that any programmatic attempt to generate good descriptive text will likely fail too often to be useful.

## Example Usage

```typescript
// Basic usage
w(EnhancedTextInput, {
	addonBefore: [ '@' ],
	describedBy: 'twitter-desc',
	label: 'Twitter Username',
	placeholder: 'username',
	value: this.state.firstName,
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ firstName: event.target.value });
	},
}),
v('span', {
	id: 'twitter-desc'
}, [ 'Not including the "@" symbol' ]);

// Advanced usage
w(EnhancedTextInput, {
	addonBefore: [ '$' ],
	addonAfter: [ '.00' ],
	label: 'Price, rounded to the nearest dollar',
	type: 'number',
	value: this.state.price,
	onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
		this.setState({ price: event.target.value });
	}
});
```

## Theming

The following CSS classes are available on the `EnhancedTextInput` widget for use with custom themes:

- `addon`: Applied to the span that contains the addon
- `addonBefore`: Applied to addons that come before the input
- `addonAfter`: Applied to addons positioned after the input
- `inputWrapper`: Applied to the immediate parent of the `<input>`
- `input`: Applied to the `<input>` element
