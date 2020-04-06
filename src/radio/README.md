# @dojo/widgets/radio

Dojo's `Radio` widget provides a styleable radio widget with an optional label.

## Features

- Correctly handles a11y attributes

### Accessibility Features

`Radio` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, `invalid`, etc. are used.

`Label` is handled via a child renderer. Child content will be rendered within a Label.
