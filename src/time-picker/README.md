# @dojo/widgets/time-picker widget

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

Beyond complete keyboard accessibility, `TimePicker` ensures that all appropriate ARIA attributes are included. To guarantee an excellent experience for all users `TimePicker` should always have a text label, either through its `label` property or created separately and associated with its `widgetId`.

Additional user hints like the accepted time format can be added using `inputProperties.aria.describedBy`:

```typescript
v('div', {
	id: 'descriptionId'
}, [ 'Accepts 24-hour time' ]),
w(TimePicker, {
	// ...
	inputProperties: {
		aria: { describedBy: 'descriptionId' }
	}
})
```

### Internationalization Features

By default, all options are formatted in 24-hour standard time (`HHmmss`, or `HHmm` is the `step` is greater than or equal to 60). This format can be localized by setting a `getOptionLabel` property function that accepts an object containing `hour`, `minute`, and `second` properties and returns a locale-specific string. For example, if 12-hour time with the appropriate "am"/"pm" periods should be displayed to English-speaking users, then one of the date formatters from [`@dojo/framework/i18n/date`](https://github.com/dojo/i18n#date-and-number-formatting) could be used to do so (note that these methods [require CLDR data](https://github.com/dojo/i18n#loading-cldr-data)):

```typescript
import { getDateFormatter } from '@dojo/framework/i18n/date';
import { w } from '@dojo/framework/widget-core/d';
import TimePicker, { TimeUnits } from '@dojo/widgets/time-picker';

const getShorTime = getDateFormatter({ time: 'short' });
const date = new Date();

w(TimePicker, {
	// ...
	getOptionLabel: (units: TimeUnits) {
		date.setHours(units.hour);
		date.setMinutes(units.minute);
		return getShortTime(date);
	}
});
```

## Example Usage

```typescript
import { w } from '@dojo/framework/widget-core/d';
import TimePicker from '@dojo/widgets/time-picker';

// Custom (Non-Native) TimePicker
w(TimePicker, {
	clearable: true,
	disabled: false,
	end: '23:59',
	inputProperties: {
		aria: { describedBy: 'descriptionId' }
	},
	invalid: this.state.timeInvalid,
	// prevent `12:00` and `12:30` from being selected
	isOptionDisabled: (option: TimeUnits) => option.hour === 12,
	label: 'Meeting Time',
	// Perform simple validation
	onChange: (value: string) => {
		const timeInvalid = !/^\d{2}:\d{2}$/.test(value);
		this.setState({ timeInvalid });
	},
	readOnly: false,
	required: true,
	start: '00:00',
	step: 60,
	value: '10:30'
});

// Using the native `<input type="time">`
w(TimePicker, {
	disabled: false,
	end: '23:59',
	inputProperties: {
		aria: { describedBy: 'descriptionId' }
	},
	invalid: this.state.timeInvalid,
	label: 'Meeting Time',
	// Perform simple validation
	onChange: (value: string) => {
		const timeInvalid = !/^\d{2}:\d{2}$/.test(value);
		this.setState({ timeInvalid });
	},
	readOnly: false,
	required: true,
	start: '00:00',
	step: 60,
	useNativeElement: true,
	value: '10:30'
});
```

## Theming

The following CSS classes are used to style the `TimePicker` widget and should be provided by custom themes:

- `arrow`: Applied to the custom arrow button.
- `clear`: Applied to the custom "clear input" button.
- `clearable`: Applied to the input (non-native) when the widget is clearable.
- `controls`: Applied to the controls (clear and arrow buttons) container for non-native instances.
- `disabled`: Applied to both the input and optional label when the widget is disabled.
- `input`: Applied to the input node.
- `invalid`: Applied to both the input and optional label when the widget is invalid.
- `readOnly`: Applied to both the input and optional label when the widget is read-only.
- `required`: Applied to both the input and optional label when the widget is required.
- `root`: Applied to the top-level wrapper node.
