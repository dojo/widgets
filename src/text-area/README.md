# @dojo/widgets/text-area

Dojo's `TextArea` widget provides a wrapped native `textarea` input with an optional label.

## Features

- Provides an API for valid `<textarea>` attributes
- Correctly handles a11y attributes
- Associates an accessible `<label>` with the `textarea` if the `label` property is added

### Accessibility Features

`TextArea` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `valid`, etc. are used. It also provides an API for custom ARIA implementations of `aria-describedby` and `aria-controls`. It also sets `aria-invalid` when validation fails.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.
