import { theme, ThemeProperties } from '../middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/calendar.m.css';

export interface CalendarCellProperties extends ThemeProperties {
	/** Used to immediately call focus on the cell */
	callFocus?: boolean;
	/** The set date value */
	date: number;
	/** Whether the date is in the displayed month */
	disabled?: boolean;
	/** Whether the date can receive tab focus */
	focusable?: boolean;
	/** Handler for the click event */
	onClick?(date: number, disabled: boolean): void;
	/** Handler for when the cell receives focus */
	onFocusCalled?(): void;
	/** Handler for the key down event */
	onKeyDown?(key: number, preventDefault: () => void): void;
	/** if the date is outside the min/max */
	outOfRange?: boolean;
	/** if the date is currently selected */
	selected?: boolean;
	/** if the date the same as the current day */
	today?: boolean;
}

const factory = create({ theme }).properties<CalendarCellProperties>();

export const CalendarCell = factory(function CalendarCell({ middleware: { theme }, properties }) {
	const themeCss = theme.classes(css);
	const {
		callFocus,
		date,
		focusable = false,
		selected = false,
		onFocusCalled,
		disabled = false,
		outOfRange = false,
		today = false
	} = properties();

	function onClick(event: MouseEvent) {
		event.stopPropagation();
		const { date, disabled = false, onClick } = properties();
		onClick && onClick(date, disabled);
	}

	function onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		const { onKeyDown } = properties();
		onKeyDown &&
			onKeyDown(event.which, () => {
				event.preventDefault();
			});
	}

	if (callFocus) {
		onFocusCalled && onFocusCalled();
	}

	return (
		<td
			key="root"
			focus={callFocus}
			role="gridcell"
			aria-selected={`${selected}`}
			tabIndex={focusable ? 0 : -1}
			classes={[
				themeCss.date,
				disabled || outOfRange ? themeCss.inactiveDate : null,
				outOfRange ? themeCss.outOfRange : null,
				selected ? themeCss.selectedDate : null,
				today ? themeCss.todayDate : null
			]}
			onclick={onClick}
			onkeydown={onKeyDown}
		>
			<span>{`${date}`}</span>
		</td>
	);
});

export default CalendarCell;
