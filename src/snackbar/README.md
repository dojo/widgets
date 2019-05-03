# @dojo/widgets/snackbar widget

Dojo's `Snackbar` widget creates a brief display message that is positioned at the bottom of the screen.

## Features

- Provides a simple way to present information to a user
- Provides an easy API for dismissing snackbar messages

## Example usage

```tsx
// Basic usage
w(Snackbar, {
	open: true,
	title: 'Text to display'
});

// Display a success-styled message
w(Snackbar, {
	open: true,
	title: 'Text to display',
	success: true
});

// Display an error-styled message
w(Snackbar, {
	open: true,
	title: 'Text to display',
	success: false
});

// Handle closing the message
let open = true;
w(Snackbar, {
	open,
	title: 'Text to display',
	success: false,
	onDismiss: () => {
		open = false;
	}
});
```

## Theming

The following CSS classes are available on the `Snackbar` widget for use with custom themes:

- `root`: Applied to the top-level wrapping of the Snackbar
- `content` - Applied to the wrapper around the label and actions of the Snackbar
- `label` - Applied to the element displaying the message portion of the Snackbar
- `actions` - Applied to the wrapper around the actions (such as the Dismiss button)

*Conditional classes*

- `open` - Applied to the top-level element of the widget when the Snackbar is displayed
- `success` - Applied to the top-level element of the widget when `success: true`
- `error`  - Applied to the top-level element of the widget when `success: false`
