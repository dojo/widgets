# @dojo/widgets/time-picker

Dojo's `TimePicker` widget provides a form control that allows users to manually enter a time or select a valid time from a dropdown of options.

## Features

- Automatically generates all possible valid options based on the starting time, ending time, and step
- Display times in 24-hour, 12-hour, or locale-specific formats.

### Keyboard Usage

`TimePicker` uses the `Select` widget to display values. Any keyboard navigation supported by `Select` will be supported by `TimePicker`.

### Internationalization Features

By default, all options are formatted in 24-hour standard time (`HHmmss`, or `HHmm` is the `step` is greater than or equal to 60).
