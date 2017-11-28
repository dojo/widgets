# @dojo/widgets/decoratedtextinput/DecoratedTextInput widget

Dojo 2's `DecoratedTextInput` widget extends `TextInput` to provide optional addons before or after the input, similar to those in (bootstrap)[https://v4-alpha.getbootstrap.com/components/input-group/#basic-example].


## Features

- Allows any number of addons to be inserted before or after the input
- Includes all TextInput functionality

### Accessibility Features

The `DecoratedTextInput` does not add any built-in accessibility features above what is available in `TextInput`. If this widget is used, it should be done with careful consideration of what instructional text is needed to convey the information visually implied by the addon or addons. This should be done in the label text, and optionally supplemented by custom descriptive text and `aria-describedby`.

After careful consideration we decided not to automatically point the input's `aria-describedby` attribute to the `id` or `id`s of the addons, as Bootstrap does in their examples. In all the cases we examined, the text of the addon was insufficient to describe the input required of the user, and in many cases it was actually more confusing.

## Example Usage

```typescript
// Basic usage
w(DecoratedTextInput, {
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
w(DecoratedTextInput, {
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

The following CSS classes are available on the `DecoratedTextInput` widget for use with custom themes:

- `addon`: Applied to the span that contains the addon
- `inputWrapper`: Applied to the immediate parent of the `<input>`
- `input`: Applied to the `<input>` element
