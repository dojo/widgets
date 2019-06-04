import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import Focus from '@dojo/framework/core/meta/Focus';
import { v, w } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import { DNode } from '@dojo/framework/core/interfaces';
import calendarBundle from './nls/Calendar';
import { Keys } from '../common/util';
import { monthInMin, monthInMax } from './date-utils';

import Icon from '../icon/index';
import * as baseCss from '../common/styles/base.m.css';
import * as css from '../theme/calendar.m.css';

/**
 * Enum for next/previous buttons
 */
export enum Paging {
	next = 'next',
	previous = 'previous'
}

/**
 * Enum for month or year controls
 */
export enum Controls {
	month = 'month',
	year = 'year'
}

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
 * @property minDate              Minimum date to be picked
 * @property maxDate              Maximum date to be picked
 * @property onPopupChange        Called when a user action occurs that triggers a change in the month or year popup state
 * @property onRequestMonthChange Called when a month should change; receives the zero-based month number
 * @property onRequestYearChange  Called when a year should change; receives the year as an integer
 */
export interface DatePickerProperties extends ThemedProperties {
	labelId?: string;
	labels: typeof calendarBundle.messages;
	month: number;
	monthNames: { short: string; long: string }[];
	year: number;
	yearRange?: number;
	minDate?: Date;
	maxDate?: Date;
	renderMonthLabel?(month: number, year: number): string;
	onPopupChange?(open: boolean): void;
	onRequestMonthChange?(month: number): void;
	onRequestYearChange?(year: number): void;
}

const BASE_YEAR = 2000;

@theme(css)
export class DatePicker extends ThemedMixin(WidgetBase)<DatePickerProperties> {
	private _idBase = uuid();
	private _monthPopupOpen = false;
	private _yearPopupOpen = false;
	private _yearPage = 0;

	private _closeMonthPopup(event?: MouseEvent) {
		if (event) {
			event.stopPropagation();
		}
		const { onPopupChange } = this.properties;
		this._monthPopupOpen = false;
		this.meta(Focus).set('month-button');
		this.invalidate();
		onPopupChange && onPopupChange(this._getPopupState());
	}

	private _closeYearPopup(event?: MouseEvent) {
		if (event) {
			event.stopPropagation();
		}
		const { onPopupChange } = this.properties;
		this._yearPopupOpen = false;
		this.meta(Focus).set('year-button');
		this.invalidate();
		onPopupChange && onPopupChange(this._getPopupState());
	}

	private _getMonthInputKey(month: number): string {
		return `${this._idBase}_month_input_${month}`;
	}

	private _getPopupState() {
		return this._monthPopupOpen || this._yearPopupOpen;
	}

	private _getYearInputKey(year: number): string {
		return `${this._idBase}_year_input_${year}`;
	}

	private _getYearRange() {
		const { year, yearRange = 20 } = this.properties;
		const offset = ((year - BASE_YEAR) % yearRange) - yearRange * this._yearPage;

		if (year >= BASE_YEAR) {
			return { first: year - offset, last: year + yearRange - offset };
		} else {
			return { first: year - (yearRange + offset), last: year - offset };
		}
	}

	private _onMonthButtonClick(event: MouseEvent) {
		event.stopPropagation();
		this._monthPopupOpen ? this._closeMonthPopup() : this._openMonthPopup();
	}

	private _onMonthRadioChange(event: Event) {
		event.stopPropagation();
		const { onRequestMonthChange } = this.properties;
		onRequestMonthChange &&
			onRequestMonthChange(parseInt((event.target as HTMLInputElement).value, 10));
	}

	private _onPopupKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		// close popup on escape, or if a value is selected with enter/space
		if (
			event.which === Keys.Escape ||
			event.which === Keys.Enter ||
			event.which === Keys.Space
		) {
			event.preventDefault();
			this._monthPopupOpen && this._closeMonthPopup();
			this._yearPopupOpen && this._closeYearPopup();
		}
	}

	private _onYearButtonClick(event: MouseEvent) {
		event.stopPropagation();
		this._yearPopupOpen ? this._closeYearPopup() : this._openYearPopup();
	}

	private _onYearPageDown(event: MouseEvent) {
		event.stopPropagation();
		this._yearPage--;
		this._yearPopupOpen && this.invalidate();
	}

	private _onYearPageUp(event: MouseEvent) {
		event.stopPropagation();
		this._yearPage++;
		this._yearPopupOpen && this.invalidate();
	}

	private _onYearRadioChange(event: Event) {
		event.stopPropagation();
		const { onRequestYearChange, month } = this.properties;
		const newYear = parseInt((event.target as HTMLInputElement).value, 10);
		if (!this._monthInMinMax(newYear, month)) {
			// we know the year is valid but the month is out of range
			const { minDate, maxDate, onRequestMonthChange } = this.properties;
			if (minDate && newYear === minDate.getFullYear()) {
				onRequestMonthChange && onRequestMonthChange(minDate.getMonth());
			} else if (maxDate && newYear === maxDate.getFullYear()) {
				onRequestMonthChange && onRequestMonthChange(maxDate.getMonth());
			}
		}
		this._yearPage = 0;
		onRequestYearChange && onRequestYearChange(newYear);
	}

	private _openMonthPopup() {
		const { month, onPopupChange } = this.properties;
		this._monthPopupOpen = true;
		this.meta(Focus).set(this._getMonthInputKey(month));
		this._yearPopupOpen = false;
		this.invalidate();
		onPopupChange && onPopupChange(this._getPopupState());
	}

	private _openYearPopup() {
		const { year, onPopupChange } = this.properties;
		this._yearPopupOpen = true;
		this.meta(Focus).set(this._getYearInputKey(year));
		this._monthPopupOpen = false;
		this.invalidate();
		onPopupChange && onPopupChange(this._getPopupState());
	}

	private _monthInMinMax(year: number, month: number) {
		let { minDate, maxDate } = this.properties;

		return monthInMin(year, month, minDate) && monthInMax(year, month, maxDate);
	}

	private _yearInMinMax(year: number) {
		const { minDate, maxDate } = this.properties;
		const minYear = minDate ? minDate.getFullYear() : year;
		const maxYear = maxDate ? maxDate.getFullYear() : year;
		return year >= minYear && year <= maxYear;
	}

	protected renderControlsTrigger(type: Controls): DNode {
		const { month, monthNames, year } = this.properties;

		const content = type === Controls.month ? monthNames[month].long : `${year}`;
		const open = type === Controls.month ? this._monthPopupOpen : this._yearPopupOpen;
		const onclick =
			type === Controls.month ? this._onMonthButtonClick : this._onYearButtonClick;

		return v(
			'button',
			{
				key: `${type}-button`,
				'aria-controls': `${this._idBase}_${type}_dialog`,
				'aria-expanded': `${open}`,
				'aria-haspopup': 'true',
				id: `${this._idBase}_${type}_button`,
				classes: this.theme([
					(css as any)[`${type}Trigger`],
					open ? (css as any)[`${type}TriggerActive`] : null
				]),
				role: 'menuitem',
				type: 'button',
				onclick
			},
			[content]
		);
	}

	protected renderMonthLabel(month: number, year: number): DNode {
		const { monthNames, renderMonthLabel } = this.properties;
		return renderMonthLabel
			? renderMonthLabel(month, year)
			: `${monthNames[month].long} ${year}`;
	}

	protected renderMonthRadios(): DNode[] {
		const { year, month } = this.properties;

		return this.properties.monthNames.map((monthName, i) =>
			v(
				'label',
				{
					key: `${this._idBase}_month_radios_${i}`,
					classes: this.theme([
						css.monthRadio,
						i === month ? css.monthRadioChecked : null
					]),
					for: this._getMonthInputKey(i),
					onmouseup: this._closeMonthPopup
				},
				[
					v('input', {
						checked: i === month,
						classes: this.theme(css.monthRadioInput),
						id: this._getMonthInputKey(i),
						key: this._getMonthInputKey(i),
						name: `${this._idBase}_month_radios`,
						tabIndex: this._monthPopupOpen ? 0 : -1,
						type: 'radio',
						value: `${i}`,
						disabled: !this._monthInMinMax(year, i),
						onchange: this._onMonthRadioChange
					}),
					v(
						'abbr',
						{
							classes: this.theme(css.monthRadioLabel),
							title: monthName.long
						},
						[monthName.short]
					)
				]
			)
		);
	}

	protected renderPagingButtonContent(type: Paging): DNode[] {
		const { labels, theme, classes } = this.properties;
		const iconType = type === Paging.next ? 'rightIcon' : 'leftIcon';
		const labelText = type === Paging.next ? labels.nextYears : labels.previousYears;

		return [
			w(Icon, { type: iconType, theme, classes }),
			v('span', { classes: baseCss.visuallyHidden }, [labelText])
		];
	}

	protected renderYearRadios(): DNode[] {
		const { year } = this.properties;
		const radios = [];

		const yearLimits = this._getYearRange();
		for (let i = yearLimits.first; i < yearLimits.last; i++) {
			radios.push(
				v(
					'label',
					{
						key: `${this._idBase}_year_radios_${i}`,
						classes: this.theme([
							css.yearRadio,
							i === year ? css.yearRadioChecked : null
						]),
						for: this._getYearInputKey(i),
						onmouseup: this._closeYearPopup
					},
					[
						v('input', {
							checked: i === year,
							classes: this.theme(css.yearRadioInput),
							id: this._getYearInputKey(i),
							key: this._getYearInputKey(i),
							name: `${this._idBase}_year_radios`,
							tabIndex: this._yearPopupOpen ? 0 : -1,
							type: 'radio',
							value: `${i}`,
							disabled: !this._yearInMinMax(i),
							onchange: this._onYearRadioChange
						}),
						v(
							'abbr',
							{
								classes: this.theme(css.yearRadioLabel)
							},
							[`${i}`]
						)
					]
				)
			);
		}

		return radios;
	}

	protected render(): DNode {
		const { labelId = `${this._idBase}_label`, labels, month, year } = this.properties;

		return v(
			'div',
			{
				classes: this.theme(css.datePicker)
			},
			[
				v(
					'div',
					{
						classes: this.theme(css.topMatter),
						role: 'menubar'
					},
					[
						// hidden label
						v(
							'label',
							{
								id: labelId,
								classes: [baseCss.visuallyHidden],
								'aria-live': 'polite',
								'aria-atomic': 'false'
							},
							[this.renderMonthLabel(month, year)]
						),

						// month trigger
						this.renderControlsTrigger(Controls.month),

						// year trigger
						this.renderControlsTrigger(Controls.year)
					]
				),

				// month grid
				v(
					'div',
					{
						key: 'month-grid',
						'aria-hidden': `${!this._monthPopupOpen}`,
						'aria-labelledby': `${this._idBase}_month_button`,
						classes: [
							this.theme(css.monthGrid),
							!this._monthPopupOpen ? baseCss.visuallyHidden : null
						],
						id: `${this._idBase}_month_dialog`,
						role: 'dialog'
					},
					[
						v(
							'fieldset',
							{
								classes: this.theme(css.monthFields),
								onkeydown: this._onPopupKeyDown
							},
							[
								v('legend', { classes: baseCss.visuallyHidden }, [
									labels.chooseMonth
								]),
								...this.renderMonthRadios()
							]
						)
					]
				),

				// year grid
				v(
					'div',
					{
						key: 'year-grid',
						'aria-hidden': `${!this._yearPopupOpen}`,
						'aria-labelledby': `${this._idBase}_year_button`,
						classes: [
							this.theme(css.yearGrid),
							!this._yearPopupOpen ? baseCss.visuallyHidden : null
						],
						id: `${this._idBase}_year_dialog`,
						role: 'dialog'
					},
					[
						v(
							'fieldset',
							{
								classes: this.theme(css.yearFields),
								onkeydown: this._onPopupKeyDown
							},
							[
								v('legend', { classes: [baseCss.visuallyHidden] }, [
									labels.chooseYear
								]),
								...this.renderYearRadios()
							]
						),
						v(
							'div',
							{
								classes: this.theme(css.controls)
							},
							[
								v(
									'button',
									{
										classes: this.theme(css.previous),
										tabIndex: this._yearPopupOpen ? 0 : -1,
										type: 'button',
										onclick: this._onYearPageDown,
										disabled: !this._yearInMinMax(year - 1)
									},
									this.renderPagingButtonContent(Paging.previous)
								),
								v(
									'button',
									{
										classes: this.theme(css.next),
										tabIndex: this._yearPopupOpen ? 0 : -1,
										type: 'button',
										onclick: this._onYearPageUp,
										disabled: !this._yearInMinMax(year + 1)
									},
									this.renderPagingButtonContent(Paging.next)
								)
							]
						)
					]
				)
			]
		);
	}
}

export default DatePicker;
