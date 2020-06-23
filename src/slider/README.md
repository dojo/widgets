# @dojo/widgets/slider

Dojo's `Slider` widget creates a range slider control with a styleable track, fill, and draggable thumb control.

## Features

- Horizontal or vertical slider with a track, fill, and single thumb
- Output node with customizable text that can be used to display the current value

### Accessibility Features

`Slider` uses the native `<input type="range">`as its base, which ensures built-in keyboard and screen reader accessibility. All common form field attributes (`disabled`, `invalid`, `readOnly`, `required`) may be set, as well as a visible or hidden label. The output node used to display the current value uses `<output>` and is associated with the input.
