import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import { Keys } from '../common/util';
import { DNode, TypedTargetEvent } from '@dojo/widget-core/interfaces';
import * as css from './styles/calendar.m.css';
import * as baseCss from '../common/styles/base.m.css';
import * as iconCss from '../common/styles/icons.m.css';

/**
 * @type CalendarMessages
 *
 * Accessible text for Month Picker controls. Messages can be localized by passing a CalendarMessages object into the Calendar widget's labels property
 *
 * @property chooseMonth          Labels the button that opens the month picker popup
 * @property chooseYear           Labels the year spinner within the popup
 * @property previousMonth        Labels the prvious month arrow button
 * @property nextMonth            Labels the next month arrow button
 */
export interface CalendarMessages {
	chooseMonth: string;
	chooseYear: string;
	previousMonth: string;
	nextMonth: string;
};

/**
 * @type DatePickerProperties
 *
 * Properties that can be set on a Calendar component
 *
 * @property labelId              Set id to reference label containing current month and year
 * @property labels               Customize or internationalize accessible helper text
 * @property month                Currently displayed month, zero-based
 * @property monthNames           Array of full and abbreviated month names
 * @property year                 Currently displayed year
 * @property yearRange            Number of years to display in a single page of the year popup
 * @property renderMonthLabel     Format the displayed current month and year
 * @property onPopupChange        Called when a user action occurs that triggers a change in the month or year popup state
 * @property onRequestMonthChange Called when a month should change; receives the zero-based month number
 * @property onRequestYearChange  Called when a year should change; receives the year as an integer
 */
export interface DatePickerProperties extends ThemeableProperties {
	labelId?: string;
	labels: CalendarMessages;
	month: number;
	monthNames: { short: string; long: string; }[];
	year: number;
	yearRange?: number;
	renderMonthLabel?(month: number, year: number): string;
	onPopupChange?(open: boolean): void;
	onRequestMonthChange?(month: number): void;
	onRequestYearChange?(year: number): void;
};

export const DatePickerBase = ThemeableMixin(WidgetBase);

const BASE_YEAR = 2000;

@theme(css)
@theme(iconCss)
export default class DatePicker extends DatePickerBase<DatePickerProperties> {
	private _callMonthTriggerFocus = false;
	private _callYearTriggerFocus = false;
	private _callMonthPopupFocus = false;
	private _callYearPopupFocus = false;
	private _idBase = uuid();
	private _monthPopupOpen = false;
	private _yearPopupOpen = false;
	private _yearPage = 0;

	private _closeMonthPopup() {
		const { onPopupChange } = this.properties;
		this._monthPopupOpen = false;
		this._callMonthTriggerFocus = true;
		this.invalidate();
		onPopupChange && onPopupChange(this._getPopupState());
	}

	private _closeYearPopup() {
		const { onPopupChange } = this.properties;
		this._yearPopupOpen = false;
		this._callYearTriggerFocus = true;
		this.invalidate();
		onPopupChange && onPopupChange(this._getPopupState());
	}

	private _getPopupState() {
		return this._monthPopupOpen || this._yearPopupOpen;
	}

	private _getYearRange() {
		const { year, yearRange = 20 } = this.properties;
		const offset = (year - BASE_YEAR) % yearRange - yearRange * this._yearPage;

		if ( year >= BASE_YEAR) {
			return { first: year - offset, last: year + yearRange - offset };
		}
		else {
			return { first: year - (yearRange + offset), last: year - offset };
		}
	}

	// move focus when opening/closing the popup
	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'month-button') {
			if (!this._monthPopupOpen && this._callMonthTriggerFocus) {
				element.focus();
				this._callMonthTriggerFocus = false;
			}
		}
		if (key === 'year-button') {
			if (!this._yearPopupOpen && this._callYearTriggerFocus) {
				element.focus();
				this._callYearTriggerFocus = false;
			}
		}
		if (this._callMonthPopupFocus && key.indexOf(`${this._idBase}_month_radios`) > -1) {
			const month = key.split('_')[3];
			if (this._monthPopupOpen && month === `${this.properties.month}`) {
				(<HTMLInputElement> element.children[0]).focus();
				this._callMonthPopupFocus = false;
			}
		}
		if (this._callYearPopupFocus && key.indexOf(`${this._idBase}_year_radios`) > -1) {
			const year = key.split('_')[3];
			if (this._yearPopupOpen && year === `${this.properties.year}`) {
				(<HTMLInputElement> element.children[0]).focus();
				this._callYearPopupFocus = false;
			}
		}
	}

	private _onMonthButtonClick() {
		this._monthPopupOpen ? this._closeMonthPopup() : this._openMonthPopup();
	}

	private _onMonthRadioChange(event: TypedTargetEvent<HTMLInputElement>) {
		const { onRequestMonthChange } = this.properties;
		onRequestMonthChange && onRequestMonthChange(parseInt(event.target.value, 10));
	}

	private _onPopupKeyDown(event: KeyboardEvent) {
		// close popup on escape, or if a value is selected with enter/space
		if (
			event.which === Keys.Escape ||
			event.which === Keys.Enter ||
			event.which === Keys.Space
		) {
			this._closeMonthPopup();
			this._closeYearPopup();
		}
	}

	private _onYearButtonClick() {
		this._yearPopupOpen ? this._closeYearPopup() : this._openYearPopup();
	}

	private _onYearPageDown() {
		this._yearPage--;
		this._yearPopupOpen && this.invalidate();
	}

	private _onYearPageUp() {
		this._yearPage++;
		this._yearPopupOpen && this.invalidate();
	}

	private _onYearRadioChange(event: TypedTargetEvent<HTMLInputElement>) {
		const { onRequestYearChange } = this.properties;
		this._yearPage = 0;
		onRequestYearChange && onRequestYearChange(parseInt(event.target.value, 10));
	}

	private _openMonthPopup() {
		const { onPopupChange } = this.properties;
		this._monthPopupOpen = true;
		this._callMonthPopupFocus = true;
		this._yearPopupOpen = false;
		this.invalidate();
		onPopupChange && onPopupChange(this._getPopupState());
	}

	private _openYearPopup() {
		const { onPopupChange } = this.properties;
		this._yearPopupOpen = true;
		this._callYearPopupFocus = true;
		this._monthPopupOpen = false;
		this.invalidate();
		onPopupChange && onPopupChange(this._getPopupState());
	}

	protected renderControlsTrigger(type: 'month' | 'year'): DNode {
		const {
			month,
			monthNames,
			year
		} = this.properties;

		const content = type === 'month' ? monthNames[month].long : `${year}`;
		const open = type === 'month' ? this._monthPopupOpen : this._yearPopupOpen;
		const onclick = type === 'month' ? this._onMonthButtonClick : this._onYearButtonClick;

		return v('button', {
			key: `${type}-button`,
			'aria-controls': `${this._idBase}_${type}_dialog`,
			'aria-expanded': `${open}`,
			'aria-haspopup': 'true',
			id: `${this._idBase}_${type}_button`,
			classes: this.classes(
				(css as any)[`${type}Trigger`],
				open ? (css as any)[`${type}TriggerActive`] : null
			),
			role: 'menuitem',
			onclick
		}, [ content ]);
	}

	protected renderMonthLabel(month: number, year: number) {
		const { monthNames, renderMonthLabel } = this.properties;
		return renderMonthLabel ? renderMonthLabel(month, year) : `${monthNames[month].long} ${year}`;
	}

	protected renderMonthRadios() {
		const { month } = this.properties;

		return this.properties.monthNames.map((monthName, i) => v('label', {
			key: `${this._idBase}_month_radios_${i}`,
			classes: this.classes(css.monthRadio, i === month ? css.monthRadioChecked : null)
		}, [
			v('input', {
				checked: i === month,
				classes: this.classes(css.monthRadioInput),
				name: `${this._idBase}_month_radios`,
				tabIndex: this._monthPopupOpen ? 0 : -1,
				type: 'radio',
				value: `${i}`,
				onchange: this._onMonthRadioChange,
				onmouseup: this._closeMonthPopup
			}),
			v('abbr', {
				classes: this.classes(css.monthRadioLabel),
				title: monthName.long
			}, [ monthName.short ])
		]));
	}

	protected renderPagingButtonContent(type: 'next' | 'previous') {
		const { labels } = this.properties;
		const iconClass = type === 'next' ? iconCss.rightIcon : iconCss.leftIcon;
		const labelText = type === 'next' ? labels.nextMonth : labels.previousMonth;

		return [
			v('i', { classes: this.classes(iconCss.icon, iconClass),
				role: 'presentation', 'aria-hidden': 'true'
			}),
			v('span', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labelText ])
		];
	}

	protected renderYearRadios() {
		const { year } = this.properties;
		const radios = [];

		const yearLimits = this._getYearRange();
		for (let i = yearLimits.first; i < yearLimits.last; i++) {
			radios.push(v('label', {
				key: `${this._idBase}_year_radios_${i}`,
				classes: this.classes(css.yearRadio, i === year ? css.yearRadioChecked : null)
			}, [
				v('input', {
					checked: i === year,
					classes: this.classes(css.yearRadioInput),
					name: `${this._idBase}_year_radios`,
					tabIndex: this._yearPopupOpen ? 0 : -1,
					type: 'radio',
					value: `${i}`,
					onchange: this._onYearRadioChange,
					onmouseup: this._closeYearPopup
				}),
				v('abbr', {
					classes: this.classes(css.yearRadioLabel)
				}, [ `${ i }` ])
			]));
		}

		return radios;
	}

	protected render(): DNode {
		const {
			labelId = `${this._idBase}_label`,
			labels,
			month,
			year
		} = this.properties;

		return v('div', {
			classes: this.classes(css.datePicker)
		}, [
			v('div', {
				classes: this.classes(css.topMatter),
				role: 'menubar'
			}, [
				// hidden label
				v('label', {
					id: labelId,
					classes: this.classes().fixed(baseCss.visuallyHidden),
					'aria-live': 'polite',
					'aria-atomic': 'false'
				}, [ this.renderMonthLabel(month, year) ]),

				// month trigger
				this.renderControlsTrigger('month'),

				// year trigger
				this.renderControlsTrigger('year')
			]),

			// month grid
			v('div', {
				key: 'month-grid',
				'aria-hidden': `${!this._monthPopupOpen}`,
				'aria-labelledby': `${this._idBase}_month_button`,
				classes: this.classes(css.monthGrid).fixed(!this._monthPopupOpen ? baseCss.visuallyHidden : null),
				id: `${this._idBase}_month_dialog`,
				role: 'dialog'
			}, [
				v('fieldset', {
					classes: this.classes(css.monthFields),
					onkeydown: this._onPopupKeyDown
				}, [
					v('legend', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.chooseMonth ]),
					...this.renderMonthRadios()
				])
			]),

			// year grid
			v('div', {
				key: 'year-grid',
				'aria-hidden': `${!this._yearPopupOpen}`,
				'aria-labelledby': `${this._idBase}_year_button`,
				classes: this.classes(css.yearGrid).fixed(!this._yearPopupOpen ? baseCss.visuallyHidden : null),
				id: `${this._idBase}_year_dialog`,
				role: 'dialog'
			}, [
				v('fieldset', {
					classes: this.classes(css.yearFields),
					onkeydown: this._onPopupKeyDown
				}, [
					v('legend', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.chooseYear ]),
					...this.renderYearRadios()
				]),
				v('div', {
					classes: this.classes(css.controls)
				}, [
					v('button', {
						classes: this.classes(css.previous),
						tabIndex: this._yearPopupOpen ? 0 : -1,
						onclick: this._onYearPageDown
					}, this.renderPagingButtonContent('previous')),
					v('button', {
						classes: this.classes(css.next),
						tabIndex: this._yearPopupOpen ? 0 : -1,
						onclick: this._onYearPageUp
					}, this.renderPagingButtonContent('next'))
				])
			])
		]);
	}
}
