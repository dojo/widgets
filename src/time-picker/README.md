# @dojo/widgets/time-picker

Dojo's `TimePicker` widget provides a form control that allows users to manually enter a time or select a valid time from a dropdown of options. The non-native option wraps the `ComboBox` widget.

## Features

- Provides an option to use a native `<input type="time">` when needed.
- Automatically generates all possible valid options based on the starting time, ending time, and step.
- Completely keyboard accessible.

### Keyboard Usage

`TimePicker` supports standard keyboard navigation for toggling the options menu and navigating to/selecting results.

**Input Events**:

- Escape key: hides the options menu if it is open.
- Down Arrow: if the options menu is closed, pressing the down arrows opens the menu. If the menu is already open, then pressing the down arrow highlights the next option. If the last last option is highlighted, then the first option is highlighted and scrolled into view.
- Up Arrow: if the options menu is open, pressing the up arrow highlights the previous result. If the first result is currently highlighted, then the last option is highlighted and scrolled into view.
- Enter Key: if the options menu is open, pressing the enter key selects the highlighted option and sets its value as the input value.

**Arrow Button Events**

- Enter Key: opens the options menu.
- Space Key: opens the options menu.

**Clear Button Events**

- Enter Key: clears the input value.
- Space Key: clears the input value.

### Accessibility Features

Beyond complete keyboard accessibility, `TimePicker` ensures that all appropriate ARIA attributes are included. To guarantee an excellent experience for all users `TimePicker` should always have a text label, either through its `label` property or created separately and associated with its `widgetId`. Additional user hints like the accepted time format can be added using `inputProperties.aria.describedBy`.

### Internationalization Features

By default, all options are formatted in 24-hour standard time (`HHmmss`, or `HHmm` is the `step` is greater than or equal to 60). This format can be localized by setting a `getOptionLabel` property function that accepts an object containing `hour`, `minute`, and `second` properties and returns a locale-specific string. For example, if 12-hour time with the appropriate "am"/"pm" periods should be displayed to English-speaking users, then one of the date formatters from [`@dojo/framework/i18n/date`](https://github.com/dojo/i18n#date-and-number-formatting) could be used to do so (note that these methods [require CLDR data](https://github.com/dojo/i18n#loading-cldr-data)).