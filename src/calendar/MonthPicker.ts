import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import { Keys } from '../common/util';
import { DNode, TypedTargetEvent } from '@dojo/widget-core/interfaces';
import Radio from '../radio/Radio';
import Button from '../button/Button';
import * as css from './styles/calendar.m.css';
import * as baseCss from '../common/styles/base.m.css';

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
 * @property open                 Boolean, sets state of popup
 * @property renderMonthLabel     Format the displayed current month and year
 * @property year                 Currently displayed year
 * @property onRequestOpen        Called when a user action occurs that should trigger the popup opening
 * @property onRequestClose       Called when a user action occurs that should close the popup
 * @property onRequestMonthChange Called when a month should change; receives the zero-based month number
 * @property onRequestYearChange  Called when a year should change; receives the year as an integer
 */
export interface MonthPickerProperties extends ThemeableProperties {
	labelId?: string;
	labels: CalendarMessages;
	month: number;
	monthNames: { short: string; long: string; }[];
	open?: boolean;
	renderMonthLabel?(month: number, year: number): string;
	year: number;
	onRequestOpen?(): void;
	onRequestClose?(): void;
	onRequestMonthChange?(month: number): void;
	onRequestYearChange?(year: number): void;
};

export const MonthPickerBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class MonthPicker extends MonthPickerBase<MonthPickerProperties> {
	private _idBase = uuid();

	private _callTriggerFocus = false;
	private _callPopupFocus = false;

	// move focus when opening/closing the popup
	protected onElementUpdated(element: HTMLElement, key: string) {
		// TODO: When the focus manager issue is resolved, use it to set focus on the button widget: https://github.com/dojo/widget-core/issues/107

		// popup
		if (key === 'year-spinner') {
			const { open } = this.properties;
			if (open && this._callPopupFocus) {
				element.focus();
				this._callPopupFocus = false;
			}
		}
	}

	private _closePopup() {
		const { onRequestClose } = this.properties;

		// TODO: When the focus manager issue is resolved, use it to set unfocus the popup when closed: https://github.com/dojo/widget-core/issues/107

		this._callTriggerFocus = true;
		onRequestClose && onRequestClose();
	}

	private _openPopup() {
		const { onRequestOpen } = this.properties;

		this._callPopupFocus = true;
		onRequestOpen && onRequestOpen();
	}

	private _decreaseYear() {
		const {
			year,
			onRequestYearChange
		} = this.properties;

		onRequestYearChange && onRequestYearChange(year - 1);
	}

	private _increaseYear() {
		const {
			year,
			onRequestYearChange
		} = this.properties;

		onRequestYearChange && onRequestYearChange(year + 1);
	}

	private _onButtonClick() {
		const {
			open = false
		} = this.properties;

		open ? this._closePopup() : this._openPopup();
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
			this._closePopup();
		}
	}

	private _onRadioChange(event: TypedTargetEvent<HTMLInputElement>) {
		const {
			onRequestMonthChange
		} = this.properties;
		const month = parseInt(event.target.value, 10);

		onRequestMonthChange && onRequestMonthChange(month);
	}

	private _onYearKeyDown(event: KeyboardEvent) {
		switch (event.which) {
			case Keys.Right:
				this._increaseYear();
				break;
			case Keys.Left:
				this._decreaseYear();
				break;
		}
	}

	private _renderMonthLabel(month: number, year: number) {
		const { monthNames, renderMonthLabel } = this.properties;
		return renderMonthLabel ? renderMonthLabel(month, year) : `${monthNames[month].long} ${year}`;
	}

	private _renderMonthRadios() {
		const { month, theme = {} } = this.properties;

		return this.properties.monthNames.map((monthName, i) => w(Radio, {
			key: `${this._idBase}_radios_${i}`,
			extraClasses: { root: css.monthRadio, input: css.monthRadioInput, checked: css.monthRadioChecked },
			checked: i === month,
			label: {
				content: `<abbr title="${monthName.long}">${monthName.short}</abbr>`,
				before: false
			},
			name: `${this._idBase}_radios`,
			theme,
			value: i + '',
			onChange: this._onRadioChange,
			onMouseUp: this._closePopup
		}));
	}

	protected render(): DNode {
		const {
			month,
			year,
			labelId = `${this._idBase}_label`,
			labels,
			open = false,
			theme = {}
		} = this.properties;

		return v('div', { classes: this.classes(css.header) }, [
			// button
			w(Button, {
				key: 'button',
				describedBy: labelId,
				id: `${this._idBase}_button`,
				extraClasses: { root: css.monthTrigger },
				popup: {
					id: `${this._idBase}_dialog`,
					expanded: open
				},
				theme,
				onClick: this._onButtonClick
			}, [
				v('span', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.chooseMonth ])
			]),
			v('label', {
				id: labelId,
				classes: this.classes(css.currentMonthLabel),
				'aria-live': 'polite',
				'aria-atomic': 'false'
			}, [ this._renderMonthLabel(month, year) ]),
			// previous/next month buttons
			v('button', {
				classes: this.classes(css.previousMonth),
				onclick: this._onMonthDecrease
			}, [
				v('span', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.previousMonth ])
			]),
			v('button', {
				classes: this.classes(css.nextMonth),
				onclick: this._onMonthIncrease
			}, [
				v('span', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.nextMonth ])
			]),
			// popup
			v('div', {
				key: 'month-popup',
				'aria-hidden': String(!open),
				'aria-labelledby': `${this._idBase}_button`,
				classes: this.classes(css.monthPopup, open ? null : css.monthPopupHidden),
				id: `${this._idBase}_dialog`,
				role: 'dialog',
				onkeydown: this._onPopupKeyDown
			}, [
				v('div', { classes: this.classes(css.yearPicker) }, [
					v('label', {
						for: `${this._idBase}_year`,
						classes: this.classes().fixed(baseCss.visuallyHidden)
					}, [ labels.chooseYear ]),
					v('span', {
						role: 'button',
						classes: this.classes(css.spinnerPrevious),
						onclick: this._decreaseYear
					}, [ String(year - 1) ]),
					v('div', {
						key: 'year-spinner',
						id: `${this._idBase}_year`,
						classes: this.classes(css.spinner),
						role: 'spinbutton',
						'aria-valuemin': '1',
						'aria-valuenow': String(year),
						tabIndex: open ? 0 : -1,
						onkeydown: this._onYearKeyDown
					}, [ String(year) ]),
					v('span', {
						role: 'button',
						classes: this.classes(css.spinnerNext),
						onclick: this._increaseYear
					}, [ String(year + 1) ])
				]),
				v('fieldset', {
					classes: this.classes(css.monthControl)
				}, [
					v('legend', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.chooseMonth ]),
					...this._renderMonthRadios()
				])
			])
		]);
	}
}
