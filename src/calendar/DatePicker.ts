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
 * @type MonthPickerProperties
 *
 * Properties that can be set on a Calendar component
 *
 * @property labelId              Set id to reference label containing current month and year
 * @property labels               Customize or internationalize accessible helper text
 * @property month                Currently displayed month, zero-based
 * @property monthNames           Array of full and abbreviated month names
 * @property onMonthPopupChange   Called when a user action occurs that triggers the month popup to open
 * @property onRequestMonthChange Called when a month should change; receives the zero-based month number
 * @property onRequestYearChange  Called when a year should change; receives the year as an integer
 * @property renderMonthLabel     Format the displayed current month and year
 * @property year                 Currently displayed year
 */
export interface MonthPickerProperties extends ThemeableProperties {
	labelId?: string;
	labels: CalendarMessages;
	month: number;
	monthNames: { short: string; long: string; }[];
	onMonthPopupChange?(open: boolean): void;
	onRequestMonthChange?(month: number): void;
	onRequestYearChange?(year: number): void;
	onYearPopupChange?(open: boolean): void;
	renderMonthLabel?(month: number, year: number): string;
	year: number;
};

export const MonthPickerBase = ThemeableMixin(WidgetBase);

const YEAR_RANGE = 50;

@theme(css)
@theme(iconCss)
export default class MonthPicker extends MonthPickerBase<MonthPickerProperties> {
	private _callMonthTriggerFocus = false;
	private _callYearTriggerFocus = false;
	private _idBase = uuid();
	private _monthPopupOpen = false;
	private _yearPopupOpen = false;

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
	}

	private _onMonthButtonClick() {
		this._monthPopupOpen ? this._closeMonthPopup() : this._openMonthPopup();
	}

	private _onYearButtonClick() {
		this._yearPopupOpen ? this._closeYearPopup() : this._openYearPopup();
	}

	private _openMonthPopup() {
		const { onMonthPopupChange } = this.properties;
		this._monthPopupOpen = true;
		this._yearPopupOpen = false;
		this.invalidate();
		onMonthPopupChange && onMonthPopupChange(true);
	}

	private _openYearPopup() {
		const { onYearPopupChange } = this.properties;
		this._yearPopupOpen = true;
		this._monthPopupOpen = false;
		this.invalidate();
		onYearPopupChange && onYearPopupChange(true);
	}

	private _closeMonthPopup() {
		const { onMonthPopupChange } = this.properties;
		this._monthPopupOpen = false;
		this._callMonthTriggerFocus = true;
		this.invalidate();
		onMonthPopupChange && onMonthPopupChange(false);
	}

	private _closeYearPopup() {
		const { onYearPopupChange } = this.properties;
		this._yearPopupOpen = false;
		this._callYearTriggerFocus = true;
		this.invalidate();
		onYearPopupChange && onYearPopupChange(false);
	}

	private _onMonthDecrease() {
		const {
			month,
			year,
			onRequestMonthChange,
			onRequestYearChange
		} = this.properties;

		if (month === 0) {
			onRequestMonthChange && onRequestMonthChange(11);
			onRequestYearChange && onRequestYearChange(year - 1);
		}
		else {
			onRequestMonthChange && onRequestMonthChange(month - 1);
		}
	}

	private _onMonthIncrease() {
		const {
			month,
			year,
			onRequestMonthChange,
			onRequestYearChange
		} = this.properties;

		if (month === 11) {
			onRequestMonthChange && onRequestMonthChange(0);
			onRequestYearChange && onRequestYearChange(year + 1);
		}
		else {
			onRequestMonthChange && onRequestMonthChange(month + 1);
		}
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

	private _onMonthRadioChange(event: TypedTargetEvent<HTMLInputElement>) {
		const { onRequestMonthChange } = this.properties;
		onRequestMonthChange && onRequestMonthChange(parseInt(event.target.value, 10));
	}

	private _onYearRadioChange(event: TypedTargetEvent<HTMLInputElement>) {
		const { onRequestYearChange } = this.properties;
		onRequestYearChange && onRequestYearChange(parseInt(event.target.value, 10));
	}

	private _renderMonthRadios() {
		const { month } = this.properties;

		return this.properties.monthNames.map((monthName, i) => v('label', {
			key: `${this._idBase}_month_radios_${i}`,
			classes: this.classes(css._monthRadio, i === month ? css._monthRadioChecked : null)
		}, [
			v('input', {
				checked: i === month,
				classes: this.classes(css._monthRadioInput),
				name: `${this._idBase}_month_radios`,
				tabIndex: this._monthPopupOpen ? 0 : -1,
				type: 'radio',
				value: i + '',
				onchange: this._onMonthRadioChange,
				onmouseup: this._closeMonthPopup
			}),
			v('abbr', {
				classes: this.classes(css._monthRadioLabel),
				title: monthName.long
			}, [ monthName.short ])
		]));
	}

	private _renderYearRadios() {
		const { year } = this.properties;
		const radios = [];

		// TODO: Don't only show +/ 50 years
		for (let i = year - (YEAR_RANGE / 2); i < year + (YEAR_RANGE / 2); i++) {
			radios.push(v('label', {
				key: `${this._idBase}_year_radios_${i}`,
				classes: this.classes(css._yearRadio, i === year ? css._yearRadioChecked : null)
			}, [
				v('input', {
					checked: i === year,
					classes: this.classes(css._yearRadioInput),
					name: `${this._idBase}_year_radios`,
					tabIndex: this._yearPopupOpen ? 0 : -1,
					type: 'radio',
					value: i + '',
					onchange: this._onYearRadioChange,
					onmouseup: this._closeYearPopup
				}),
				v('abbr', {
					classes: this.classes(css._yearRadioLabel)
				}, [ `${ i }` ])
			]));
		}

		return radios;
	}

	private _renderMonthLabel(month: number, year: number) {
		const { monthNames, renderMonthLabel } = this.properties;
		return renderMonthLabel ? renderMonthLabel(month, year) : `${monthNames[month].long} ${year}`;
	}

	protected render(): DNode {
		const {
			labelId = `${this._idBase}_label`,
			labels,
			month,
			monthNames,
			year
		} = this.properties;

		return v('div', {
			classes: this.classes(css._datePicker)
		}, [
			v('div', { classes: this.classes(css._topMatter) }, [
				// hidden label
				v('label', {
					id: labelId,
					classes: this.classes().fixed(baseCss.visuallyHidden),
					'aria-live': 'polite',
					'aria-atomic': 'false'
				}, [ this._renderMonthLabel(month, year) ]),

				// month trigger
				v('button', {
					key: 'month-button',
					'aria-controls': `${this._idBase}_month_dialog`,
					'aria-describedby': labelId,
					'aria-expanded': String(this._monthPopupOpen),
					'aria-haspopup': 'true',
					classes: this.classes(
						css._monthTrigger,
						this._monthPopupOpen ? css._monthTriggerActive : null
					),
					onclick: this._onMonthButtonClick,
					id: `${this._idBase}_month_button`
				}, [ monthNames[month].long ]),

				// year trigger
				v('button', {
					key: 'year-button',
					'aria-controls': `${this._idBase}_year_dialog`,
					'aria-describedby': labelId,
					'aria-expanded': String(this._yearPopupOpen),
					'aria-haspopup': 'true',
					classes: this.classes(
						css._yearTrigger,
						this._yearPopupOpen ? css._yearTriggerActive : null
					),
					onclick: this._onYearButtonClick,
					id: `${this._idBase}_year_button`
				}, [ `${ year }` ]),

				// previous/next month buttons
				v('div', {
					classes: this.classes(css._controls)
				}, [
					v('button', {
						classes: this.classes(css._previousMonth),
						onclick: this._onMonthDecrease
					}, [
						v('i', { classes: this.classes(iconCss.icon, iconCss.leftIcon),
							role: 'presentation', 'aria-hidden': 'true'
						}),
						v('span', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.previousMonth ])
					]),
					v('button', {
						classes: this.classes(css._nextMonth),
						onclick: this._onMonthIncrease
					}, [
						v('i', { classes: this.classes(iconCss.icon, iconCss.rightIcon),
							role: 'presentation', 'aria-hidden': 'true'
						}),
						v('span', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.nextMonth ])
					])
				])
			]),

			// month grid
			v('div', {
				key: 'month-grid',
				'aria-hidden': String(!this._monthPopupOpen),
				'aria-labelledby': `${this._idBase}_month_button`,
				classes: this.classes(css._monthGrid).fixed(!this._monthPopupOpen ? baseCss.visuallyHidden : null),
				id: `${this._idBase}_month_dialog`,
				role: 'dialog',
				onkeydown: this._onPopupKeyDown
			}, [
				v('fieldset', { classes: this.classes(css._monthFields) }, [
					v('legend', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.chooseMonth ]),
					...this._renderMonthRadios()
				])
			]),

			// year grid
			v('div', {
				key: 'year-grid',
				'aria-hidden': String(!this._yearPopupOpen),
				'aria-labelledby': `${this._idBase}_year_button`,
				classes: this.classes(css._yearGrid).fixed(!this._yearPopupOpen ? baseCss.visuallyHidden : null),
				id: `${this._idBase}_year_dialog`,
				role: 'dialog',
				onkeydown: this._onPopupKeyDown
			}, [
				v('fieldset', { classes: this.classes(css._yearFields) }, [
					v('legend', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.chooseYear ]),
					...this._renderYearRadios()
				])
			])
		]);
	}
}
