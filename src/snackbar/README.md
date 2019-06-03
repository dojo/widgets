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

## Properties


- `open: boolean` - Whether the snackbar is open and displayed
- `message: string` - The message to display on the snackbar
- `actionsRenderer?: () => RenderResult` -  A callback that returns what to render in the snackbar's actions section
- `type?: 'success' | 'error'` - The variant of snackbar to render. Can be `"success"` or `"error"`
- `leading?: boolean` - If true, render the snackbar on the leading side of the page
- `stacked?: boolean` - If true, stack the snackbar's message on top of the actions

## Theming

The following CSS classes are available on the `Snackbar` widget for use with custom themes:

- `root`: Applied to the top-level wrapping of the Snackbar
- `content` - Applied to the wrapper around the label and actions of the Snackbar
- `label` - Applied to the element displaying the message portion of the Snackbar
- `actions` - Applied to the wrapper around the content rendered in the `actionsRenderer` property.

*Conditional classes*

- `open` - Applied to the top-level element of the widget when the Snackbar is displayed
- `success` - Applied to the top-level element of the widget when `type` is `success`
- `error`  - Applied to the top-level element of the widget when `type` is `error`
- `leading` - When applied, the Snackbar will be aligned to the leading side of the screen
- `stacked` - When applied, the snackbar actions will appear below the message instead of beside it
