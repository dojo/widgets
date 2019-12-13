# @dojo/widgets/label

Dojo's `Label` widget creates a `<label>` element that wraps its children. It is included by default in all form input widgets (including `ComboBox` and `TimePicker`).

## Features

- The label may be visually hidden while remaining accessible to screen readers
- All form controls in `@dojo/widgets` make use of the label and share the same `properties.label` API

### Accessibility Features

- The label is implicitly tied to its form control, so it should not be passed children with non-label text content
- If the `hidden` property is true, it uses styles that leave the text content accessible to screen readers
