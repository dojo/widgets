# @dojo/widgets/progress/Progress widget

Dojo 2's `progress` widget provides a themeable progress bar with a customisable output display.


## Features

- Correctly handles a11y attributes
- Displays progress
- Defaults to percentages
- Can specify min / max
- Customisable output

### Accessibility Features

Appropiate aria attributes added to the progress bar for `valuenow`, `valuemax`, `valuemin` and `valuetext`.

## Example Usage

```typescript
// Example usage
w(Progress, { value: 50 }) // will create a 50% filled bar

w(Progress, { value: 0.2, max: 1 }) // will create a 20% filled bar

w(Progress, { value: 40, max: 350, output: (value) => `processed ${value} files` })
```

## Theming

The following CSS classes are available on the `Progress` widget for use with custom themes:

- `root`: Applied to the outermost node of the widget
- `bar`: Applied to the progress bar container
- `progress`: Applied to the completed part of the bar
- `output`: Applied to the output text
