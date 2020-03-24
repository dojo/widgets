# @dojo/widgets/time-picker

Dojo's `TimePicker` widget provides a form control that allows users to manually enter a time or select a valid time from a dropdown of options.

## Features

- Automatically generates all possible valid options based on the starting time, ending time, and step
- Display times in 24-hour or 12-hour format.

### Keyboard Usage

`TimePicker` uses the `Menu` widget to display values. Any keyboard navigation supported by `Menu` will be supported by `TimePicker`. Pressing the down or enter keys will open the menu for keyboard navigation.

### Internationalization Features

By default, all options are formatted in 24-hour standard time (`HHmmss`, or `HHmm` is the `step` is greater than or equal to 60). The `format` option lets you specify if you want to display and input 12 hour time.
