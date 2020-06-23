# @dojo/widgets/range-slider

Dojo's `RangeSlider` widget creates a range slider control with a styleable track, fill, and draggable thumb controls.

## Features

- Horizontal slider with a track, fill, and two thumbs
- Output node with customizable text that can be used to display the current minimum/maximum values.

### Accessibility Features

`RangeSlider` uses two native `<input type="range">` elements as its base, which ensures built-in keyboard and screen reader accessibility. All common form field attributes (`disabled`, `invalid`, `readOnly`, `required`) may be set, as well as a visible or hidden label. The output node used to display the current value uses `<output>` and is associated with the inputs.

Separate `minimumLabel` and `maximumLabel` properties are provided to customize the aria labels of each range element.
