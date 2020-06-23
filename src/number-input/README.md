# @dojo/widgets/number-input

Dojo's `NumberInput` widget provides a basic number input widget with an optional label.

## Features

- Correctly handles a11y attributes
- Allows leading / trailing icons / text to be added

### Accessibility Features

- Ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, etc. are used
- Additional custom ARIA labels may be added with the `aria` property
- Sets `aria-invalid` when validation fails
