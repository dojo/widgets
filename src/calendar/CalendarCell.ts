import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import * as css from './styles/calendar.m.css';

/**
 * @type CalendarCellProperties
 *
 * Properties that can be set on a Calendar Date Cell
 *
 * @property callFocus        Used to immediately call focus on the cell
 * @property date             Integer date value
 * @property disabled         Boolean, whether or not the date is in the current month
 * @property focusable        Boolean, whether or not the date can receive focus
 * @property selected         True if the date is currently selected
 * @property onClick          Callback function for the click event
 * @property onFocusCalled    Callback function when the cell receives focus
 * @property onKeyDown        Callback function for the key down event
 */
export interface CalendarCellProperties extends ThemeableProperties {
	callFocus?: boolean;
	date: number;
	disabled?: boolean;
	focusable?: boolean;
	selected?: boolean;
	onClick?(date: number, disabled: boolean): void;
	onFocusCalled?(): void;
	onKeyDown?(event: KeyboardEvent): void;
};

export const CalendarCellBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class CalendarCell extends CalendarCellBase<CalendarCellProperties> {
	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'root') {
			const { callFocus, onFocusCalled } = this.properties;
			if (callFocus) {
				element.focus();
				onFocusCalled && onFocusCalled();
			}
		}
	}
	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'root') {
			const { callFocus, onFocusCalled } = this.properties;
			if (callFocus) {
				element.focus();
				onFocusCalled && onFocusCalled();
			}
		}
	}

	private _onClick(event: MouseEvent) {
		const { date, disabled = false, onClick } = this.properties;
		onClick && onClick(date, disabled);
	}

	private _onKeyDown(event: KeyboardEvent) {
		const { onKeyDown } = this.properties;
		onKeyDown && onKeyDown(event);
	}

	formatDate(date: number): DNode {
		return v('span', {}, [ String(date) ]);
	}

	render() {
		const {
			date,
			disabled = false,
			focusable = false,
			selected = false
		} = this.properties;

		const dateCellClasses = [
			css.date,
			disabled ? css.inactiveDate : null,
			selected ? css.selectedDate : null
		];

		return v('td', {
			key: 'root',
			role: 'gridcell',
			'aria-selected': String(selected),
			tabIndex: focusable ? 0 : -1,
			classes: this.classes(...dateCellClasses),
			onclick: this._onClick,
			onkeydown: this._onKeyDown
		}, [ this.formatDate(date) ]);
	}
}
