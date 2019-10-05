# @dojo/widgets/chip widget

Dojo's `Chip` widget allows content and particularly user inputs to be displayed more clearly and enables interaction such as removing entered values or clicking them to trigger some action


## Features

- Displays a label, optional icon, and an optional close icon

## Example Usage

```typescript jsx
// Basic chip
<Chip label="Displayed value" icon="plusIcon"/>
```

## Theming

The following CSS classes are available on the `Chip` widget for use with custom themes:

- `root`: Applied to the wrapping div at the root of the hierarchy
- `label`: Applied to the `span` wrapping the provided `label`

*Conditional Classes*

- `clickable`: Applied to the root when an `onClick` callback is provided and the component is not `disabled`
- `disabled`: Applied to the root when the `disabled` property is provided
- `closeIcon`: Applied to the div wrapping the `closeIcon` if an `onClose` callback is provided
