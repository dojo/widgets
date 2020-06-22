# @dojo/widgets/radio

Dojo's `Radio` widget provides a wrapped, styleable radio widget that uses the native `<input type="radio">` as a base.

## Features

- Creates a normal radio input.
- Correctly handles a11y attributes.
- Wraps the input in a visible or invisible but accessible `<label>`.
- Renders child content within a `label`.

### Accessibility Features

`Radio` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used.

If child content is not passed, a `label` will not be created. If you wish to handle this yourself, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.
