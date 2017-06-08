# @dojo/widgets/label/Label widget

Dojo 2's `Label` widget creates a `<label>` element that wraps its children and inserts a text node as either the first or last child.


## Features

- Provides an API to add an accessible label before or after the form control
- The label may be visually hidden while remaining accessible to screen readers
- `properties.label` may take an options object or a string
- All form controls in `@dojo/widgets` make use of the label and share the same `properties.label` API

### Accessibility Features

- The label is implicitly tied to its form control, so it should not be passed children with non-label text content
- If `properties.label.hidden` is true, it uses styles that leave the text content accessible to screen readers

## Example Usage

```typescript
// Basic usage, creates a label before the input
w(Label, {
	label: 'Your Name'
}, [
	v('input', { type: 'text' })
]);

// Label after the input
w(Label, {
	label: {
		content: 'Email',
		before: false
	}
}, [
	v('input', { type: 'email' })
]);

// Hidden label
w(Label, {
	label: {
		content: 'Favorite color',
		hidden: true
	}
}, [
	v('input', { type: 'color' })
]);
```
