# @dojo/widgets/range-slider widget

Dojo's `RangeSlider` widget creates a range slider control with a styleable track, fill, and draggable thumb controls.


## Features

- Horizontal slider with a track, fill, and two thumbs
- Output node with customizable text that can be used to display the current minimum/maximum values.

### Accessibility Features

`RangeSlider` uses two native `<input type="range">` elements as its base, which ensures built-in keyboard and screen reader accessibility. All common form field attributes (`disabled`, `invalid`, `readOnly`, `required`) may be set, as well as a visible or hidden label. The output node used to display the current value uses `<output>` and is associated with the inputs.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.

Separate `minimumLabel` and `maximumLabel` properties are provided to customize the aria labels of each range element.

## Example Usage

```typescript
// Basic horizontal slider
w(RangeSlider, {
	label: 'Choose a number range from 1 to 100',
	min: 0,
	max: 100,
	step: 1,
	minValue: this.state.min,
    maxValue: this.state.max,
	onValue: (min: number, max: number) => {
		this.setState({ min, max });
	},
});
```

## Theming

The following CSS classes are available on the `RangeSlider` widget for use with custom themes:

- `root`: Applied to either the wrapping `<label>`, or a `<div>` in the same position in the node hierarchy
- `inputWrapper`: Applied to the immediate parent of the `<input>` and custom track. This element is used to render the custom track.
- `input`: Applied to the native `<input>` elements
- `fill`: Applied to the element used for the custom fill, a child of the track
- `thumb`: Applied to the element used as a custom thumb, a child of the `inputWrapper`
- `thumbLeft`: Applied to the element representing the minimum custom thumb, a child of the `inputWrapper`
- `thumbRight`: Applied to the element representing the maximum custom thumb, a child of the `inputWrapper`
- `output`: Applied to the `<output>` element used to display the current value
- `leftThumb`: Applied to the thumb representing the minimum value
- `rightThumb`: Applied to the thumb representing the maximum value

*Conditional Classes*

- `disabled`: Applied to the same level as `root` if `properties.disabled` is true
- `readonly`: Applied to the same level as `root` if `properties.readOnly` is true
- `required`: Applied to the same level as `root` if `properties.required` is true
- `invalid`: Applied to the same level as `root` if `properties.invalid` is true
- `focus`: Applied to a custom thumb when it has focus
- `outputIsTooltip`: Applied to the `<output>` element if the `outputIsTooltip` property is true.
