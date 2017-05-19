# @dojo/widgets/calendar/Calendar widget
Dojo 2's `Calendar` renders a date grid with a dropdown month and year picker. The displayed month and year are controlled via properties, defaulting to the current day. Given the limitations of scaling date grid while maintaining usability, the calendar is not fully responsive at small screen sizes; it is instead recommended to switch to an alternative date picker for mobile.

## Example Usage

*Basic Example*
```js
import Calendar from '@dojo/widgets/calendar/Calendar';

protected render: DNode () {
  return v('div', [
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
	]);
}
```

*Example with custom month heading, custom weekday format, and an extended CalendarCell widget with custom content*
```js
import Calendar from '@dojo/widgets/calendar/Calendar';
import CalendarCell from '@dojo/widgets/calendar/CalendarCell';

class MyCalendarCell extends CalendarCell {
	formatDate(date: number): DNode {
		const { selected } = this.properties;
		return v('div', [
			String(date),
			selected ? v('span', { classes: this.classes(iconCss.checkMark) }) : null
		]);
	}
}

[ ... ]

protected render: DNode () {
  return v('div', [
		w(Calendar, {
			customDateCell: MyCalendarCell,
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
	]);
}
```

## Properties

customDateCell?: any;
labels?: CalendarMessages;
month?: number;
monthNames?: { short: string; long: string; }[];
selectedDate?: Date;
weekdayNames?: { short: string; long: string; }[];
year?: number;
renderMonthLabel?(month: number, year: number): string;
renderWeekdayCell?(day: { short: string; long: string; }): DNode;
onMonthChange?(month: number): void;
onYearChange?(year: number): void;
onDateSelect?(date: Date): void;

| Property | Description | Default value |
| customDateCell | Custom widget constructor for calendar cells, extended from `@dojo/widgets/calendar/CalendarCell` | |
| month | Currently displayed month using a 0-based index | The current month |
| selectedDate | A date object that sets the selected date | |
| year | Currently displayed year | The current year |
| renderMonthLabel | Function that takes the month and year and returns a DNode | `${monthNames[month].long} ${year}` |
| renderWeekdayCell | Function that takes the weekday name and returns a DNode | `v('abbr', { title: day.long }, [ day.short ])` |

### i18n properties
| Property | Description | Default value |
| labels | A set of accessible text labels for UI controls | `DEFAULT_LABELS` from `@dojo/widgets/calendar/Calendar` |
| monthNames | An object with abbreviated and full month names | `DEFAULT_Months` from `@dojo/widgets/calendar/Calendar` |
| weekdayNames | An object with abbreviated and full weekday names | `DEFAULT_WEEKDAYS` from `@dojo/widgets/calendar/Calendar` |

### Event Handlers
| Event name | Description |
| onMonthChange | Called when a month change is requested |
| onYearChange | Called when a year change is requested |
| onDateSelect | Called when a date is selected |
