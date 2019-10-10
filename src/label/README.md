# @dojo/widgets/label

Dojo's `Label` widget creates a `<label>` element that wraps its children and inserts a text node as either the first or last child. It is included by default in all form input widgets, including `ComboBox` and `TimePicker`. Input widgets control the text, visibility, and placement of the label through the following properties:
- `label`: String used as label text
- `labelAfter`: If true, the label node follows the input node in the generated vdom
- `labelHidden`: This corresponds to the `hidden` class on the Label widget.

## Features

- Provides an API to add an accessible label before (default) or after the form control
- The label may be visually hidden while remaining accessible to screen readers
- `properties.label` may take an options object or a string
- All form controls in `@dojo/widgets` make use of the label and share the same `properties.label` API

### Accessibility Features

- The label is implicitly tied to its form control, so it should not be passed children with non-label text content
- If `properties.label.hidden` is true, it uses styles that leave the text content accessible to screen readers
