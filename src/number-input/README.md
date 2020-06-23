# @dojo/widgets/number-input

Dojo's `NumberInput` widget provides a basic number input widget with an optional label.

## Features

- Correctly handles a11y attributes
- Associates an accessible `<label>` with the input if a `label` child is added
- Allows leading / trailing icons / text to be added

### Accessibility Features

- Ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, etc. are used
- Additional custom ARIA labels may be added with the `aria` property
- Sets `aria-invalid` when validation fails

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.

