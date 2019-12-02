# @dojo/widgets/radio

Dojo's `Radio` widget provides a styleable radio widget with an optional label.

## Features

- Correctly handles a11y attributes
- Wraps the input in an accessible `<label>` when the `label` property is added

### Accessibility Features

`Radio` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.
