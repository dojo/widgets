import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import { Keys } from '../common/util';
import Radio from '../radio/Radio';
import Button from '../button/Button';
import * as css from './styles/calendar.m.css';
import * as baseCss from '../common/styles/base.m.css';

// will need to localize messages
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
 * @property selectedDate     The currently selected date
 * @property focusedDate      Date that can receive keyboard focus. Used for a11y and to open the calendar on a specific month without selecting a date.
 * @property onMonthChange    Function called when the month changes
 * @property onYearChange     Function called when the year changes
 * @property onDateSelect     Function called when the user selects a date
 * @property onDateFocus      Function called when a new date receives focus
 */
export interface MonthPickerProperties extends ThemeableProperties {
	callTriggerFocus?: boolean;
	callPopupFocus?: boolean;
	currentMonth: number;
	currentYear: number;
	currentMonthLabel?(month: string, year: string): string;
	labelId?: string;
	labels: CalendarMessages;
	monthNames: { short: string; long: string; }[];
	open?: boolean;
	onFocusCalled?(): void;
	onRequestOpen?(): void;
	onRequestClose?(): void;
	onRequestMonthChange?(month: number): void;
	onRequestYearChange?(year: number): void;
};

export const MonthPickerBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class MonthPicker extends MonthPickerBase<MonthPickerProperties> {
	private _buttonId = uuid();
	private _dialogId = uuid();
	private _labelId = uuid();
	private _yearSpinnerId = uuid();
	private _radiosName = uuid();

	private _callTriggerFocus = false;
	private _callPopupFocus = false;

	// move focus when opening/closing the popup
	protected onElementUpdated(element: HTMLElement, key: string) {
		// trigger button
		if (key === 'button') {
			if (this._callTriggerFocus) {
				// TODO: fix this to work with imported widgets
				element.focus();
				this._callTriggerFocus = false;
			}
		}
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
			currentYear,
			onRequestYearChange
		} = this.properties;

		onRequestYearChange && onRequestYearChange(currentYear - 1);
	}

	private _increaseYear() {
		const {
			currentYear,
			onRequestYearChange
		} = this.properties;

		onRequestYearChange && onRequestYearChange(currentYear + 1);
	}

	private _onButtonClick() {
		const {
			open = false
		} = this.properties;

		open ? this._closePopup() : this._openPopup();
	}

	private _onMonthDecrease() {
		const {
			currentMonth,
			currentYear,
			onRequestMonthChange,
			onRequestYearChange
		} = this.properties;

		if (currentMonth === 0) {
			onRequestMonthChange && onRequestMonthChange(11);
			onRequestYearChange && onRequestYearChange(currentYear - 1);
		}
		else {
			onRequestMonthChange && onRequestMonthChange(currentMonth - 1);
		}
	}

	private _onMonthIncrease() {
		const {
			currentMonth,
			currentYear,
			onRequestMonthChange,
			onRequestYearChange
		} = this.properties;

		if (currentMonth === 11) {
			onRequestMonthChange && onRequestMonthChange(0);
			onRequestYearChange && onRequestYearChange(currentYear + 1);
		}
		else {
			onRequestMonthChange && onRequestMonthChange(currentMonth + 1);
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

	private _onRadioChange(event: Event) {
		const {
			onRequestMonthChange
		} = this.properties;
		const month = parseInt((<HTMLInputElement> event.target).value, 10);

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

	private _renderMonthRadios() {
		const { currentMonth } = this.properties;

		return this.properties.monthNames.map((month, i) => w(Radio, {
			key: this._radiosName + i,
			overrideClasses: { root: css.monthRadio, input: css.monthRadioInput, checked: css.monthRadioChecked },
			checked: i === currentMonth,
			label: {
				content: `<abbr title="${month.long}">${month.short}</abbr>`,
				before: false
			},
			name: this._radiosName,
			// TODO: replace this with a method to "unfocus" components?
			// tabIndex: open ? 0 : -1,
			value: i + '',
			onMouseUp: () => {
				this._closePopup();
			}
		}));
	}

	render() {
		const {
			currentMonth,
			currentYear,
			labelId = this._labelId,
			labels,
			monthNames,
			open = false
		} = this.properties;

		return v('div', { classes: this.classes(css.header) }, [
			// button
			w(Button, {
				key: 'button',
				describedBy: labelId,
				id: this._buttonId,
				overrideClasses: { root: css.monthTrigger },
				popup: {
					id: this._dialogId,
					expanded: open
				},
				onClick: this._onButtonClick
			}, [
				v('span', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.chooseMonth ])
			]),
			v('label', {
				id: labelId,
				classes: this.classes(css.currentMonthLabel),
				'aria-live': 'polite',
				'aria-atomic': 'false',
				innerHTML: monthNames[currentMonth].long + ' ' + currentYear
			}),
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
				'aria-hidden': String(!open),
				'aria-labelledby': this._buttonId,
				classes: this.classes(css.monthPopup, open ? null : css.monthPopupHidden),
				id: this._dialogId,
				role: 'dialog',
				onkeydown: this._onPopupKeyDown
			}, [
				v('div', { classes: this.classes(css.monthPicker) }, [
					v('label', {
						for: this._yearSpinnerId,
						classes: this.classes().fixed(baseCss.visuallyHidden)
					}, [ labels.chooseYear ]),
					v('span', {
						role: 'button',
						classes: this.classes(css.spinnerPrevious),
						onclick: this._decreaseYear
					}, [ String(currentYear - 1) ]),
					v('div', {
						key: 'year-spinner',
						id: this._yearSpinnerId,
						classes: this.classes(css.spinner),
						role: 'spinbutton',
						'aria-valuemin': '1',
						'aria-valuenow': String(currentYear),
						tabIndex: open ? 0 : -1,
						onkeydown: this._onYearKeyDown
					}, [ String(currentYear) ]),
					v('span', {
						role: 'button',
						classes: this.classes(css.spinnerNext),
						onclick: this._increaseYear
					}, [ String(currentYear + 1) ])
				]),
				v('fieldset', {
					classes: this.classes(css.monthControl),
					onchange: this._onRadioChange
				}, [
					v('legend', { classes: this.classes().fixed(baseCss.visuallyHidden) }, [ labels.chooseMonth ]),
					...this._renderMonthRadios()
				])
			])
		]);
	}
}
