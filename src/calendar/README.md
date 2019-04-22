# @dojo/widgets/calendar widget
Dojo's `Calendar` renders a date grid with a dropdown month and year picker. The displayed month and year are controlled via properties, defaulting to the current day. Given the limitations of scaling date grid while maintaining usability, the calendar is not fully responsive at small screen sizes; it is instead recommended to switch to an alternative date picker for mobile.

## Features

- Renders a date grid with weekday headers, defaulting to the current month

![Image of basic calendar](../../.github/calendar-dategrid.png)

- Clicking on the current month label opens a month picker that allows you to infinitely cycle through years and choose a month

![Image of open month picker](../../.github/calendar-months.png)

### Keyboard Usage
- All controls are in the tab order and accessible by keyboard
- Arrow keys move focus in the date grid, and navigating to a disabled date updates the month
- Page up and page down move to the first and last date in the month
- Arrow keys change the year within the month control popup

### Accessibility Features
- The month label is read by screen readers when updated through `aria-live: polite`
- The month popup trigger, year control, month radios, and previous/next month arrows all have screen-reader-accessible labels and instructions
- The weekdays and month radios are marked up with `<abbr>` tags that contain unabbreviated titles
- Focus is controlled when opening and closing the month popup

### i18n Features
- Localized versions of `CalendarMessages`, `monthNames`, and `weekdayNames` can be passed in via properties.

## Example Usage

*Basic Example*
```js
w(Calendar, {
	month: this.state.month,
	selectedDate: this.state.selectedDate,
	year: this.state.year,
	onMonthChange: (month: number) => { this.setState({ 'month': month }); },
	onYearChange: (year: number) => { this.setState({ 'year': year }); },
	onDateSelect: (date: Date) => {
		this.setState({ 'selectedDate': date });
	}
})
```

*Example with custom month heading, custom weekday format, and an extended CalendarCell widget with custom content*
```js
class MyCalendarCell extends CalendarCell {
	formatDate(date: number): DNode {
		const { selected } = this.properties;
		return v('div', [
			`${date}`,
			selected ? w(Icon, { type: 'checkMark' }) : null
		]);
	}
}

[ ... ]

w(Calendar, {
	CustomDateCell: MyCalendarCell,
	month: this.state.month,
	selectedDate: this.state.selectedDate,
	year: this.state.year,
	renderMonthLabel: (month: number, year: number) => {
		// Instead of e.g. "March 2017", you would get 3-2017
		return `${month + 1}-${year}`;
	},
	renderWeekdayCell: (day: { short: string; long: string; }) => {
		// Labels weekdays with only their first letter
		return day.short.substring(0,1);
	},
	onMonthChange: (month: number) => { this.setState({ 'month': month }); },
	onYearChange: (year: number) => { this.setState({ 'year': year }); },
	onDateSelect: (date: Date) => {
		this.setState({ 'selectedDate': date });
	}
})
```

## Theming

The following css classes are used to style the `Calendar` widget and should be provided by custom themes:

- `root`: Applied to the calendar container
- `inacitveDate`: Applied to disabled or out of range dates
- `outOfRange`: Applied to out of range dates
- `selectedDate`: Applied to currently selected date
- `todayDay`: Applied to today's date
- `date`: Applied to all date cells
- `dateGrid`: Applied to grid containing the calendar
- `weekday`: Applied to weekday headers

### DatePicker themes

- `datePicker`: Applied to date picker container
- `topMatter`: Applied to wrapper of controls
- `controls`: Applied to wrapper of previous/next paging buttons
- `previous`: Applied to previous month paging button
- `next`: Applied to next month paging button
- `monthGrid`: Applied to wrapper of month selector
- `monthFields`: Applied to month selector fieldset
- `yearGrid`: Applied to wrapper of year selector
- `yearFields`: Applied to year selector fieldset
- `monthRadio`: Applied to the month selector radio label wrapper
- `yearRadio`: Applied to the year selector radio label wrapper
- `monthRadioChecked`: Applied to the active month's radio label
- `yearRadioChecked`: Applied to the active year's radio label
- `monthRadioInput`: Applied to the month selector radio input
- `monthRadioLabel`: Applied to the month selector radio label text
- `yearRadioInput`: Applied to the year selector radio input
- `yearRadioLabel`: Applied to the year selector radio label text
- `monthTrigger`: Applied to the button which opens the month selector
- `yearTrigger`: Applied to the button which opens the year selector
- `monthTriggerActive`: Applied to when the `monthTrigger` is active
- `yearTriggerActive`: Applied to when the `yearTrigger` is active
