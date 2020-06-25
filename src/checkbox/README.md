# @dojo/widgets/checkbox

Dojo's `Checkbox` widget provides a wrapped, styleable checkbox widget that uses the native `<input type="checkbox">` as a base.

## Features

- Creates a normal checkbox.
- Correctly handles a11y attributes.
- Wraps the input in a visible or invisible but accessible `<label>`.

### Accessibility Features

`Checkbox` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used.
