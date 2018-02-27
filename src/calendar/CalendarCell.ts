import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import Focus from '@dojo/widget-core/meta/Focus';
import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import * as css from '../theme/calendar.m.css';

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
 * @property today            True if the date the same as the current day
 * @property onClick          Callback function for the click event
 * @property onFocusCalled    Callback function when the cell receives focus
 * @property onKeyDown        Callback function for the key down event
 */
export interface CalendarCellProperties extends ThemedProperties {
	callFocus?: boolean;
	date: number;
	disabled?: boolean;
	focusable?: boolean;
	selected?: boolean;
	today?: boolean;
	onClick?(date: number, disabled: boolean): void;
	onFocusCalled?(): void;
	onKeyDown?(key: number, preventDefault: () => void): void;
};

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export class CalendarCellBase<P extends CalendarCellProperties = CalendarCellProperties> extends ThemedBase<P, null> {
	private _onClick(event: MouseEvent) {
		event.stopPropagation();
		const { date, disabled = false, onClick } = this.properties;
		onClick && onClick(date, disabled);
	}

	private _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		const { onKeyDown } = this.properties;
		onKeyDown && onKeyDown(event.which, () => { event.preventDefault(); });
	}

	protected formatDate(date: number): DNode {
		return v('span', [ `${date}` ]);
	}

	protected getModifierClasses(): (string | null)[] {
		const {
			disabled = false,
			selected = false,
			today = false
		} = this.properties;

		return [
			disabled ? css.inactiveDate : null,
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

		return v('td', {
			key: 'root',
			role: 'gridcell',
			'aria-selected': `${selected}`,
			tabIndex: focusable ? 0 : -1,
			classes: this.theme([ css.date, ...this.getModifierClasses() ]),
			onclick: this._onClick,
			onkeydown: this._onKeyDown
		}, [ this.formatDate(date) ]);
	}
}

export default class CalendarCell extends CalendarCellBase<CalendarCellProperties> {};
