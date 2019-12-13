# @dojo/widgets/checkbox widget

Dojo's `Checkbox` widget provides a wrapped, styleable checkbox widget that uses the native `<input type="checkbox">` as a base.


## Features

- Creates a normal checkbox
- Correctly handles a11y attributes
- Wraps the input in a visible or invisible but accessible `<label>` if the `label` property is added

### Accessibility Features

`Checkbox` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.
