# @dojo/widgets/snackbar widget

Dojo's `Snackbar` widget creates a brief display message that is positioned at the bottom of the screen.

## Features

- Provides a simple way to present information to a user
- Provides an easy API for dismissing snackbar messages

## Example usage

```tsx
// basic usage
<Snackbar open={true} message="Text to display"/>

// Display a success-styled message
<Snackbar open={true} message="Text to display" type="success"/>

// Display a error-styled message
<Snackbar open={true} message="Text to display" type="error"/>

// Handle closing the message
let open = true;
<Snackbar
	open={open}
	message="Text to display"
	type="error"
	actionsRenderer={() => <Button onClick={() => open = false}>Dismiss</Button>}
/>
```

## Theming

The following CSS classes are available on the `Snackbar` widget for use with custom themes:

- `root`: Applied to the top-level wrapping of the Snackbar
- `content` - Applied to the wrapper around the label and actions of the Snackbar
- `label` - Applied to the element displaying the message portion of the Snackbar
- `actionsRenderer` - Callback whose return value is added to the actions wrapper

*Conditional classes*

- `open` - Applied to the top-level element of the widget when the Snackbar is displayed
- `success` - Applied to the top-level element of the widget when `type` is `success`
- `error`  - Applied to the top-level element of the widget when `type` is `error`
