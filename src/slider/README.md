# @dojo/widgets/slider widget

Dojo's `Slider` widget creates a range slider control with a styleable track, fill, and draggable thumb control.


## Features

- Horizontal or vertical slider with a track, fill, and single thumb
- Output node with customizable text that can be used to display the current value

### Accessibility Features

`Slider` uses the native `<input type="range">`as its base, which ensures built-in keyboard and screen reader accessibility. All common form field attributes (`disabled`, `invalid`, `readOnly`, `required`) may be set, as well as a visible or hidden label. The output node used to display the current value uses `<output>` and is associated with the input.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.

## Example Usage

```typescript
// Basic horizontal slider
w(Slider, {
	label: 'Choose a number from 1 to 100',
	min: 0,
	max: 100,
	step: 1,
	value: this.state.sliderValue,
	onValue(value: number) => {
		this.setState({ sliderValue: value });
	},
});

// Horizontal slider with custom output
w(Slider, {
	label: 'How much do you like tribbles?',
	min: 0,
	max: 100,
	output: (value: number) => {
		if (value < 20) { return 'I am a Klingon'; }
		if (value < 40) { return 'Tribbles only cause trouble'; }
		if (value < 60) { return 'They\`re kind of cute'; }
		if (value < 80) { return 'Most of my salary goes to tribble food'; }
		else { return 'I permanently altered the ecology of a planet for my tribbles'; }
	},
	step: 1,
	value: this.state.tribbleValue,
	onValue(value: number) => {
		this.setState({ tribbleValue: value });
	}
});

// Vertical slider with validation
w(Slider, {
	label: 'Choose a value below 50',
	min: 0,
	max: 60,
	value: verticalValue,
	vertical: true,
	invalid: verticalInvalid,
	onValue(value: number) => {
		const value = value;
		this.setState({
			verticalValue: value,
			verticalInvalid: value > 50 ? true : false
		});
	}
});
```

## Theming

The following CSS classes are available on the `Slider` widget for use with custom themes:

- `root`: Applied to either the wrapping `<label>`, or a `<div>` in the same position in the node hierarchy
- `inputWrapper`: Applied to the immediate parent of the `<input>` and custom track
- `input`: Applied to the native `<input>` element
- `track`: Applied to the element used to render the custom track
- `fill`: Applied to the element used for the custom fill, a child of the track
- `thumb`: Applied to the element used as the custom thumb, a child of the track
- `output`: Applied to the `<output>` element used to display the current value

*Conditional Classes*
- `vertical`: Applied to the same level as `root` if `properties.vertical` is true
- `disabled`: Applied to the same level as `root` if `properties.disabled` is true
- `readonly`: Applied to the same level as `root` if `properties.readOnly` is true
- `required`: Applied to the same level as `root` if `properties.required` is true
- `invalid`: Applied to the same level as `root` if `properties.invalid` is true
- `valid`: Applied to the same level as `root` if `properties.invalid` is set false (i.e. not only undefined)
