# @dojo/widgets/card widget

Dojo's `Card` widget provides a simple wrapper for elements that should be designated and styled as a card component.

### Features

- Create a wrapper with a consistent style
- Easily add actions to the card

### Example Usage

```tsx
<Card
	actionsRenderer={() => [
		<Button onClick={() => onOK()}>OK</Button>,
		<Button onClick={() => onCancel()}>Cancel</Button>
	]}
>
	<p> Card Content </p>
</Card>
```

## Theming

The following CSS classes are available on the `Card` widget for use with custom themes:

- `root` - Applied to the top-level wrapping of the card
- `actions` - Applied to the wrapper around the actions, which is where the return value of the `actionsRenderer` are rendered
