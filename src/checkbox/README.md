# @dojo/widgets/checkbox widget

Dojo's `Checkbox` widget provides either a wrapped, styleable checkbox widget or an on/off toggle. Both the normal and toggle `Checkbox` modes use the native `<input type="checkbox">` as a base.


## Features

- Creates either a normal checkbox or toggle switch
- Correctly handles a11y attributes
- Wraps the input in a visible or invisible but accessible `<label>` if the `label` property is added

### Accessibility Features

`Checkbox` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used.

When using the toggle mode, only one of `onLabel` and `offLabel` will be read, based on the current state. E.g. if checked with a label of "Sample Checkbox", the full screen reader-accessible label would read "Sample Checkbox On".

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.
