# @dojo/widgets/calendar
Dojo's `Calendar` renders a date grid with a dropdown month and year picker. The displayed month and year are controlled via properties, defaulting to the current day. Given the limitations of scaling the date grid while maintaining usability, the calendar is not fully responsive at small screen sizes; it is instead recommended to use an alternative date picker for mobile.

## Features

- Defaults to the current month
- Renders a date grid with weekday headers
- Clicking on the current month or year label opens a picker that allows you to select a new value

### Keyboard Usage
- All controls are in the tab order and accessible by keyboard
- Arrow keys move focus in the date grid, and navigating to a disabled date updates the month
- Page up and page down move to the first and last date in the month
- Arrow keys change the selection within the month and year popup

### Accessibility Features
- The `month` label is read by screen readers when updated through `aria-live: polite`
- The month popup label, year control, month radios, and previous/next month arrows all have screen-reader-accessible labels and instructions
- The weekdays and month radios are marked up with `<abbr>` tags that contain unabbreviated titles
- Focus is controlled when opening and closing the month popup

### i18n Features
- Localized versions of `CalendarMessages`, `monthNames`, and `weekdayNames` can be passed in via properties.
