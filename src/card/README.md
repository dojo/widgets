# @dojo/widgets/card widget

Dojo's `Card` widget provides a simple wrapper for elements that should be designated and styled as a card component.

### Features

- Create a wrapper with a consistent style
- Easily add actions to the card

### Example Usage

```tsx
// Simple Card usage
<Card
	actionsRenderer={() => [
		<Button onClick={() => onOK()}>OK</Button>,
		<Button onClick={() => onCancel()}>Cancel</Button>
	]}
>
	<p> Card Content </p>
</Card>

// Media Card
<Card>
	<div
		classes={[cardCss.media, cardCss.media16by9]}
		styles={{
			background: 'url(path/to/image.png)'
		}}
	/>
	<p classes={cardCss.secondary}>Lorem ipsum</p>
</Card>
```

## Theming

The following CSS classes are available on the `Card` widget for use with custom themes:

- `root` - Applied to the top-level wrapping of the card
- `actions` - Applied to the wrapper around the actions, which is where the return value of the `actionsRenderer` are rendered

**Conditional Classes**

- `.actionButtons` - Applied to the wrapper around action buttons on the card
- `.actionIcons` - Applied to the wrapper around action icons on the card
- `.primaryAction` - Applied to the primary action of the card, makes it appear clickable
- `.media` - Applied to media content of a card that should be used to style the media to fit within the card
- `.mediaContent` - Applied to content that should appear within the card media
- `.mediaSquare` - Applied to the `.media` item, ensures that the media is square in shape
- `.media16by9` - Applied to the `.media` item, ensures that the media has 16x9 dimensions
- `.primary` - Applied to content that should have the primary padding applied
- `.secondary` - Applied to content that should have the secondary padding applied
