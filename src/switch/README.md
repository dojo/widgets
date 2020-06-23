# @dojo/widgets/switch widget

Dojo's `Switch` widget provides an on/off toggle that uses the native `<input type="checkbox">` as a base.


## Features

- Creates a toggle switch
- Correctly handles a11y attributes
- Wraps the input in a visible or invisible but accessible `<label>` if the `label` child is added

### Accessibility Features

`Switch` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used.

Only one of `onLabel` and `offLabel` will be read, based on the current state. E.g. if checked with a label of "Sample Checkbox", the full screen reader-accessible label would read "Sample Checkbox On".

If the `label` child is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.
