import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/calendar.m.css';

export interface CalendarCellProperties extends ThemedProperties {
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

@theme(css)
export class CalendarCell extends ThemedMixin(WidgetBase)<CalendarCellProperties> {
	private _onClick(event: MouseEvent) {
		event.stopPropagation();
		const { date, disabled = false, onClick } = this.properties;
		onClick && onClick(date, disabled);
	}

	private _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		const { onKeyDown } = this.properties;
		onKeyDown &&
			onKeyDown(event.which, () => {
				event.preventDefault();
			});
	}

	protected formatDate(date: number): DNode {
		return v('span', [`${date}`]);
	}

	protected getModifierClasses(): (string | null)[] {
		const {
			disabled = false,
			outOfRange = false,
			selected = false,
			today = false
		} = this.properties;

		return [
			disabled || outOfRange ? css.inactiveDate : null,
			outOfRange ? css.outOfRange : null,
			selected ? css.selectedDate : null,
			today ? css.todayDate : null
		];
	}

	protected render(): DNode {
		const {
			callFocus,
			date,
			focusable = false,
			selected = false,
			onFocusCalled
		} = this.properties;

		if (callFocus) {
			onFocusCalled && onFocusCalled();
		}

		return v(
			'td',
			{
				key: 'root',
				focus: callFocus,
				role: 'gridcell',
				'aria-selected': `${selected}`,
				tabIndex: focusable ? 0 : -1,
				classes: this.theme([css.date, ...this.getModifierClasses()]),
				onclick: this._onClick,
				onkeydown: this._onKeyDown
			},
			[this.formatDate(date)]
		);
	}
}

export default CalendarCell;
