const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/core/vdom';
import { Keys } from '../../../common/util';

import { DEFAULT_LABELS, DEFAULT_MONTHS } from '../support/defaults';
import DatePicker, { DatePickerProperties } from '../../DatePicker';
import Icon from '../../../icon/index';
import * as css from '../../../theme/default/calendar.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import {
	compareAriaLabelledBy,
	compareAriaControls,
	compareId,
	stubEvent,
	noop
} from '../../../common/tests/support/test-helpers';

const testDate = new Date('June 3 2017');
const requiredProps: DatePickerProperties = {
	labels: DEFAULT_LABELS,
	month: testDate.getMonth(),
	monthNames: DEFAULT_MONTHS,
	year: testDate.getFullYear()
};
let customProps: Partial<DatePickerProperties> = {};

const compareKey = {
	selector: 'label,input',
	property: 'key',
	comparator: (property: any) => typeof property === 'string'
};
const compareFor = {
	selector: 'label',
	property: 'for',
	comparator: (property: any) => typeof property === 'string'
};
const compareName = {
	selector: 'input',
	property: 'name',
	comparator: (property: any) => typeof property === 'string'
};

const monthRadios = function(open?: boolean) {
	return DEFAULT_MONTHS.map((monthName, i) =>
		v(
			'label',
			{
				key: '',
				classes: [css.monthRadio, i === 5 ? css.monthRadioChecked : null],
				for: '',
				onmouseup: noop
			},
			[
				v('input', {
					checked: i === 5,
					classes: css.monthRadioInput,
					id: '',
					key: '',
					name: '',
					tabIndex: open ? 0 : -1,
					type: 'radio',
					disabled: false,
					value: `${i}`,
					onchange: noop
				}),
				v(
					'abbr',
					{
						classes: css.monthRadioLabel,
						title: monthName.long
					},
					[monthName.short]
				)
			]
		)
	);
};

const yearRadios = function(
	open?: boolean,
	yearStart = 2000,
	yearEnd = 2020,
	checkedYear = 2017,
	minYear = yearStart,
	maxYear = yearEnd
) {
	const radios = [];
	for (let i = yearStart; i < yearEnd; i++) {
		radios.push(
			v(
				'label',
				{
					key: '',
					classes: [css.yearRadio, i === checkedYear ? css.yearRadioChecked : null],
					for: '',
					onmouseup: noop
				},
				[
					v('input', {
						checked: i === checkedYear,
						classes: css.yearRadioInput,
						id: '',
						tabIndex: open ? 0 : -1,
						type: 'radio',
						key: '',
						name: '',
						disabled: i < minYear || i > maxYear,
						value: `${i}`,
						onchange: noop
					}),
					v(
						'abbr',
						{
							classes: css.yearRadioLabel
						},
						[`${i}`]
					)
				]
			)
		);
	}
	return radios;
};

const expectedMonthPopup = function(open: boolean) {
	return v(
		'div',
		{
			id: '',
			key: 'month-grid',
			'aria-hidden': `${!open}`,
			'aria-labelledby': '',
			classes: [css.monthGrid, !open ? baseCss.visuallyHidden : null],
			role: 'dialog'
		},
		[
			v(
				'fieldset',
				{
					classes: css.monthFields,
					onkeydown: noop
				},
				[
					v(
						'legend',
						{
							classes: baseCss.visuallyHidden
						},
						[DEFAULT_LABELS.chooseMonth]
					),
					...monthRadios(open)
				]
			)
		]
	);
};

const expectedYearPopup = function(
	open: boolean,
	yearStart?: number,
	yearEnd?: number,
	minYear?: number,
	maxYear?: number
) {
	return v(
		'div',
		{
			key: 'year-grid',
			'aria-hidden': `${!open}`,
			'aria-labelledby': '',
			classes: [css.yearGrid, !open ? baseCss.visuallyHidden : null],
			id: '',
			role: 'dialog'
		},
		[
			v(
				'fieldset',
				{
					classes: css.yearFields,
					onkeydown: noop
				},
				[
					v('legend', { classes: [baseCss.visuallyHidden] }, [DEFAULT_LABELS.chooseYear]),
					...yearRadios(open, yearStart, yearEnd, undefined, minYear, maxYear)
				]
			),
			v(
				'div',
				{
					classes: css.controls
				},
				[
					v(
						'button',
						{
							classes: css.previous,
							tabIndex: open ? 0 : -1,
							type: 'button',
							disabled: false,
							onclick: noop
						},
						[
							w(Icon, { type: 'leftIcon', theme: undefined, classes: undefined }),
							v('span', { classes: baseCss.visuallyHidden }, [
								DEFAULT_LABELS.previousYears
							])
						]
					),
					v(
						'button',
						{
							classes: css.next,
							tabIndex: open ? 0 : -1,
							type: 'button',
							disabled: false,
							onclick: noop
						},
						[
							w(Icon, { type: 'rightIcon', theme: undefined, classes: undefined }),
							v('span', { classes: baseCss.visuallyHidden }, [
								DEFAULT_LABELS.nextYears
							])
						]
					)
				]
			)
		]
	);
};
interface ExpectedOptions {
	yearStart?: number;
	yearEnd?: number;
	monthLabel?: string;
	minDate?: Date;
	maxDate?: Date;
}

const expected = function(monthOpen = false, yearOpen = false, options: ExpectedOptions = {}) {
	const { yearStart, yearEnd, monthLabel = 'June 2017', minDate, maxDate } = options;
	// new
	return v(
		'div',
		{
			classes: css.datePicker
		},
		[
			v(
				'div',
				{
					classes: css.topMatter,
					role: 'menubar'
				},
				[
					// hidden label
					v(
						'label',
						{
							id: customProps.labelId ? customProps.labelId : '',
							classes: [baseCss.visuallyHidden],
							'aria-live': 'polite',
							'aria-atomic': 'false'
						},
						[monthLabel]
					),

					// month trigger
					v(
						'button',
						{
							key: 'month-button',
							'aria-controls': '',
							'aria-expanded': `${monthOpen}`,
							'aria-haspopup': 'true',
							id: '',
							classes: [css.monthTrigger, monthOpen ? css.monthTriggerActive : null],
							role: 'menuitem',
							type: 'button',
							onclick: noop
						},
						['June']
					),

					// year trigger
					v(
						'button',
						{
							key: 'year-button',
							'aria-controls': '',
							'aria-expanded': `${yearOpen}`,
							'aria-haspopup': 'true',
							id: '',
							classes: [css.yearTrigger, yearOpen ? css.yearTriggerActive : null],
							role: 'menuitem',
							type: 'button',
							onclick: noop
						},
						['2017']
					)
				]
			),

			// month picker
			expectedMonthPopup(monthOpen),

			// year picker
			expectedYearPopup(
				yearOpen,
				yearStart,
				yearEnd,
				minDate && minDate.getFullYear(),
				maxDate && maxDate.getFullYear()
			)
		]
	);
};

registerSuite('Calendar DatePicker', {
	tests: {
		'Popup should render with default properties'() {
			const h = harness(
				() =>
					w(DatePicker, {
						...requiredProps
					}),
				[
					compareId,
					compareAriaLabelledBy,
					compareAriaControls,
					compareKey,
					compareFor,
					compareName
				]
			);

			h.expect(() => expected());
		},

		'Popup should render with custom properties'() {
			customProps = {
				labelId: 'foo',
				yearRange: 25,
				minDate: new Date('Oct 5, 2001'),
				maxDate: new Date('March 14, 2019')
			};

			const h = harness(
				() =>
					w(DatePicker, {
						renderMonthLabel: () => {
							return 'bar';
						},
						...customProps,
						...requiredProps
					}),
				[
					compareId,
					compareAriaLabelledBy,
					compareAriaControls,
					compareKey,
					compareFor,
					compareName
				]
			);

			h.expect(() =>
				expected(false, false, {
					yearStart: 2000,
					yearEnd: 2025,
					monthLabel: 'bar',
					minDate: customProps.minDate,
					maxDate: customProps.maxDate
				})
			);
		},

		'Year below 2000 calculates correctly'() {
			let properties = {
				...requiredProps
			};
			const h = harness(() => w(DatePicker, properties), [
				compareKey,
				compareFor,
				compareName,
				compareId,
				compareAriaLabelledBy,
				compareAriaControls
			]);
			h.expect(expected);

			properties = {
				...requiredProps,
				year: 1997
			};

			h.expect(() =>
				v(
					'div',
					{
						classes: css.datePicker
					},
					[
						v(
							'div',
							{
								classes: css.topMatter,
								role: 'menubar'
							},
							[
								// hidden label
								v(
									'label',
									{
										id: '',
										classes: [baseCss.visuallyHidden],
										'aria-live': 'polite',
										'aria-atomic': 'false'
									},
									['June 1997']
								),

								// month trigger
								v(
									'button',
									{
										key: 'month-button',
										'aria-controls': '',
										'aria-expanded': 'false',
										'aria-haspopup': 'true',
										id: '',
										classes: [css.monthTrigger, null],
										role: 'menuitem',
										type: 'button',
										onclick: noop
									},
									['June']
								),

								// year trigger
								v(
									'button',
									{
										key: 'year-button',
										'aria-controls': '',
										'aria-expanded': 'false',
										'aria-haspopup': 'true',
										id: '',
										classes: [css.yearTrigger, null],
										role: 'menuitem',
										type: 'button',
										onclick: noop
									},
									['1997']
								)
							]
						),
						v(
							'div',
							{
								id: '',
								key: 'month-grid',
								'aria-hidden': 'true',
								'aria-labelledby': '',
								classes: [css.monthGrid, baseCss.visuallyHidden],
								role: 'dialog'
							},
							[
								v(
									'fieldset',
									{
										classes: css.monthFields,
										onkeydown: noop
									},
									[
										v(
											'legend',
											{
												classes: baseCss.visuallyHidden
											},
											[DEFAULT_LABELS.chooseMonth]
										),
										...DEFAULT_MONTHS.map((monthName, i) =>
											v(
												'label',
												{
													for: '',
													key: '',
													classes: [
														css.monthRadio,
														i === 5 ? css.monthRadioChecked : null
													],
													onmouseup: noop
												},
												[
													v('input', {
														checked: i === 5,
														classes: css.monthRadioInput,
														disabled: false,
														id: '',
														key: '',
														name: '',
														tabIndex: -1,
														type: 'radio',
														value: `${i}`,
														onchange: noop
													}),
													v(
														'abbr',
														{
															classes: css.monthRadioLabel,
															title: monthName.long
														},
														[monthName.short]
													)
												]
											)
										)
									]
								)
							]
						),
						v(
							'div',
							{
								key: 'year-grid',
								'aria-hidden': 'true',
								'aria-labelledby': '',
								classes: [css.yearGrid, baseCss.visuallyHidden],
								id: '',
								role: 'dialog'
							},
							[
								v(
									'fieldset',
									{
										classes: css.yearFields,
										onkeydown: noop
									},
									[
										v('legend', { classes: [baseCss.visuallyHidden] }, [
											DEFAULT_LABELS.chooseYear
										]),
										...yearRadios(false, 1980, 2000, 1997)
									]
								),
								v(
									'div',
									{
										classes: css.controls
									},
									[
										v(
											'button',
											{
												classes: css.previous,
												disabled: false,
												tabIndex: -1,
												type: 'button',
												onclick: noop
											},
											[
												w(Icon, {
													type: 'leftIcon',
													theme: undefined,
													classes: undefined
												}),
												v('span', { classes: baseCss.visuallyHidden }, [
													DEFAULT_LABELS.previousYears
												])
											]
										),
										v(
											'button',
											{
												classes: css.next,
												disabled: false,
												tabIndex: -1,
												type: 'button',
												onclick: noop
											},
											[
												w(Icon, {
													type: 'rightIcon',
													theme: undefined,
													classes: undefined
												}),
												v('span', { classes: baseCss.visuallyHidden }, [
													DEFAULT_LABELS.nextYears
												])
											]
										)
									]
								)
							]
						)
					]
				)
			);
		},

		'Month popup opens and closes on button click'() {
			let isOpen;
			const h = harness(() =>
				w(DatePicker, {
					onPopupChange: (open: boolean) => {
						isOpen = open;
					},
					...requiredProps
				})
			);

			h.trigger('@month-button', 'onclick', stubEvent);
			assert.isTrue(isOpen, 'First click should open popup');
			h.trigger('@month-button', 'onclick', stubEvent);
			assert.isFalse(isOpen, 'Second click should close popup');
		},

		'Year popup opens and closes on button click'() {
			let isOpen;
			const h = harness(() =>
				w(DatePicker, {
					onPopupChange: (open: boolean) => {
						isOpen = open;
					},
					...requiredProps
				})
			);

			h.trigger('@year-button', 'onclick', stubEvent);
			assert.isTrue(isOpen, 'First click should open popup');

			h.trigger('@year-button', 'onclick', stubEvent);
			assert.isFalse(isOpen, 'Second click should close popup');
		},

		'Popup switches between month and year'() {
			let isOpen;
			const h = harness(
				() =>
					w(DatePicker, {
						onPopupChange: (open: boolean) => {
							isOpen = open;
						},
						...requiredProps
					}),
				[
					compareId,
					compareAriaLabelledBy,
					compareAriaControls,
					compareKey,
					compareFor,
					compareName
				]
			);
			h.expect(() => expected(false, false));

			h.trigger('@month-button', 'onclick', stubEvent);
			h.expect(() => expected(true, false));
			assert.isTrue(isOpen, 'Month button opens popup');

			h.trigger('@year-button', 'onclick', stubEvent);
			h.expect(() => expected(false, true));
			assert.isTrue(isOpen, 'After clicking year button, popup is still open');
		},

		'Month popup closes with correct keys'() {
			let isOpen = true;
			const h = harness(
				() =>
					w(DatePicker, {
						onPopupChange: (open: boolean) => {
							isOpen = open;
						},
						...requiredProps
					}),
				[
					compareId,
					compareAriaLabelledBy,
					compareAriaControls,
					compareKey,
					compareFor,
					compareName
				]
			);
			h.expect(() => expected(false, false));

			// escape key
			assert.isTrue(isOpen);
			h.trigger('@month-button', 'onclick', stubEvent);
			h.expect(() => expected(true, false));
			h.trigger(`.${css.monthGrid} fieldset`, 'onkeydown', {
				which: Keys.Escape,
				...stubEvent
			});
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on escape key press');

			// enter key
			h.trigger('@month-button', 'onclick', stubEvent);
			h.expect(() => expected(true, false));
			h.trigger(`.${css.monthGrid} fieldset`, 'onkeydown', {
				which: Keys.Enter,
				...stubEvent
			});
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on enter key press');

			// space key
			h.trigger('@month-button', 'onclick', stubEvent);
			h.expect(() => expected(true, false));
			h.trigger(`.${css.monthGrid} fieldset`, 'onkeydown', {
				which: Keys.Space,
				...stubEvent
			});
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on space key press');

			// random key
			h.trigger('@month-button', 'onclick', stubEvent);
			h.expect(() => expected(true, false));
			h.trigger(`.${css.monthGrid} fieldset`, 'onkeydown', {
				which: Keys.PageDown,
				...stubEvent
			});
			h.expect(() => expected(true, false));
			assert.isTrue(isOpen, "Other keys don't close popup");
		},

		'year popup closes with correct keys'() {
			let isOpen = true;
			const h = harness(
				() =>
					w(DatePicker, {
						onPopupChange: (open: boolean) => {
							isOpen = open;
						},
						...requiredProps
					}),
				[
					compareId,
					compareAriaLabelledBy,
					compareAriaControls,
					compareKey,
					compareFor,
					compareName
				]
			);
			h.expect(() => expected(false, false));

			// escape key
			assert.isTrue(isOpen);
			h.trigger('@year-button', 'onclick', stubEvent);
			h.expect(() => expected(false, true));
			h.trigger(`.${css.yearGrid} fieldset`, 'onkeydown', {
				which: Keys.Escape,
				...stubEvent
			});
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on escape key press');

			// enter key
			h.trigger('@year-button', 'onclick', stubEvent);
			h.expect(() => expected(false, true));
			h.trigger(`.${css.yearGrid} fieldset`, 'onkeydown', {
				which: Keys.Enter,
				...stubEvent
			});
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on enter key press');

			// space key
			h.trigger('@year-button', 'onclick', stubEvent);
			h.expect(() => expected(false, true));
			h.trigger(`.${css.yearGrid} fieldset`, 'onkeydown', {
				which: Keys.Space,
				...stubEvent
			});
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on space key press');

			// random key
			h.trigger('@year-button', 'onclick', stubEvent);
			h.expect(() => expected(false, true));
			h.trigger(`.${css.yearGrid} fieldset`, 'onkeydown', {
				which: Keys.PageDown,
				...stubEvent
			});
			h.expect(() => expected(false, true));
			assert.isTrue(isOpen, "Other keys don't close popup");
		},

		'Clicking buttons changes year page'() {
			const h = harness(
				() =>
					w(DatePicker, {
						...requiredProps
					}),
				[
					compareId,
					compareAriaLabelledBy,
					compareAriaControls,
					compareKey,
					compareFor,
					compareName
				]
			);
			h.trigger('@year-button', 'onclick', stubEvent);
			h.expect(() => expected(false, true));

			h.trigger(`.${css.next}`, 'onclick', stubEvent);
			h.expect(() => expected(false, true, { yearStart: 2020, yearEnd: 2040 }));

			h.trigger(`.${css.previous}`, 'onclick', stubEvent);
			h.expect(() => expected(false, true, { yearStart: 2000, yearEnd: 2020 }));
		},

		'Change month radios'() {
			let currentMonth = testDate.getMonth();
			let isOpen = false;
			const h = harness(
				() =>
					w(DatePicker, {
						...requiredProps,
						onPopupChange: (open: boolean) => {
							isOpen = open;
						},
						onRequestMonthChange: (month: number) => {
							currentMonth = month;
						}
					}),
				[
					compareId,
					compareAriaLabelledBy,
					compareAriaControls,
					compareKey,
					compareFor,
					compareName
				]
			);

			h.trigger('@month-button', 'onclick', stubEvent);
			assert.isTrue(isOpen, 'Month popup opens when clicking month button');

			h.trigger(`.${css.monthRadio}:nth-of-type(7) input`, 'onchange', {
				...stubEvent,
				target: { value: 6 }
			});
			assert.strictEqual(currentMonth, 6, 'Change event on July sets month value');

			h.trigger(`.${css.monthRadio}:nth-of-type(7)`, 'onmouseup', stubEvent);
			assert.isFalse(isOpen, 'Clicking radios closes popup');
		},

		'Change year radios'() {
			let currentYear = testDate.getMonth();
			let isOpen = false;
			const h = harness(
				() =>
					w(DatePicker, {
						...requiredProps,
						onPopupChange: (open: boolean) => {
							isOpen = open;
						},
						onRequestYearChange: (year: number) => {
							currentYear = year;
						}
					}),
				[
					compareId,
					compareAriaLabelledBy,
					compareAriaControls,
					compareKey,
					compareFor,
					compareName
				]
			);

			h.trigger('@year-button', 'onclick', stubEvent);
			assert.isTrue(isOpen, 'Year popup opens when clicking year button');

			h.trigger(`.${css.yearRadio}:nth-of-type(2) input`, 'onchange', {
				...stubEvent,
				target: { value: 2001 }
			});
			assert.strictEqual(
				currentYear,
				2001,
				'Change event on second year radio changes year to 2001'
			);

			h.trigger(`.${css.yearRadio}:nth-of-type(2)`, 'onmouseup', stubEvent);
			assert.isFalse(isOpen, 'Clicking radios closes popup');
		},

		'Change year radios with invalid month'() {
			let currentMonth = testDate.getMonth();
			let currentYear = testDate.getFullYear();
			let isOpen = false;
			const h = harness(
				() =>
					w(DatePicker, {
						minDate: new Date('Nov 20, 2016'),
						maxDate: new Date('Feb 2, 2018'),
						...requiredProps,
						onPopupChange: (open: boolean) => {
							isOpen = open;
						},
						onRequestMonthChange: (month: number) => {
							currentMonth = month;
						},
						onRequestYearChange: (year: number) => {
							currentYear = year;
						}
					}),
				[
					compareId,
					compareAriaLabelledBy,
					compareAriaControls,
					compareKey,
					compareFor,
					compareName
				]
			);

			h.trigger('@year-button', 'onclick', stubEvent);
			h.trigger(`.${css.yearRadio}:nth-of-type(17) input`, 'onchange', {
				...stubEvent,
				target: { value: 2016 }
			});
			assert.strictEqual(currentMonth, 10, 'Change event changed the month to November');
			assert.strictEqual(
				currentYear,
				2016,
				'Change event on second year radio changes year to 2016'
			);
			h.trigger(`.${css.yearRadio}:nth-of-type(17) input`, 'onmouseup', stubEvent);

			h.trigger('@year-button', 'onclick', stubEvent);
			h.trigger(`.${css.yearRadio}:nth-of-type(19) input`, 'onchange', {
				...stubEvent,
				target: { value: 2018 }
			});
			assert.strictEqual(currentMonth, 1, 'Change event changed the month to February');
			assert.strictEqual(
				currentYear,
				2018,
				'Change event on second year radio changes year to 2018'
			);
			h.trigger(`.${css.yearRadio}:nth-of-type(19) input`, 'onmouseup', stubEvent);

			assert.isFalse(isOpen, 'Clicking radios closes popup');
		}
	}
});
