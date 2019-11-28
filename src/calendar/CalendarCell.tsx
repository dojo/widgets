import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import Focus from '../meta/Focus';
import { v } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/calendar.m.css';

/**
 * @type CalendarCellProperties
 *
 * Properties that can be set on a Calendar Date Cell
 *
 * @property callFocus        Used to immediately call focus on the cell
 * @property date             Integer date value
 * @property disabled         Boolean, whether the date is in the displayed month
 * @property focusable        Boolean, whether the date can receive tab focus
 * @property onClick          Callback function for the click event
 * @property onFocusCalled    Callback function when the cell receives focus
 * @property onKeyDown        Callback function for the key down event
 * @property outOfRange       Boolean, true if the date is outside the min/max
 * @property selected         True if the date is currently selected
 * @property today            True if the date the same as the current day
 */
export interface CalendarCellProperties extends ThemedProperties {
	callFocus?: boolean;
	date: number;
	disabled?: boolean;
	focusable?: boolean;
	onClick?(date: number, disabled: boolean): void;
	onFocusCalled?(): void;
	onKeyDown?(key: number, preventDefault: () => void): void;
	outOfRange?: boolean;
	selected?: boolean;
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
			this.meta(Focus).set('root');
			onFocusCalled && onFocusCalled();
		}

		return v(
			'td',
			{
				key: 'root',
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
