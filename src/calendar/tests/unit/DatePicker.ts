const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import { DEFAULT_LABELS, DEFAULT_MONTHS } from '../support/defaults';
import DatePicker from '../../DatePicker';
import * as css from '../../../theme/calendar/calendar.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import * as iconCss from '../../../theme/common/icons.m.css';

const noop = () => {};
const testDate = new Date('June 3 2017');
const requiredProps = {
	labels: DEFAULT_LABELS,
	month: testDate.getMonth(),
	monthNames: DEFAULT_MONTHS,
	year: testDate.getFullYear()
};
let customProps: any = {};

const compareId = { selector: '*', property: 'id', comparator: (property: any) => typeof property === 'string' };
const compareLabelledBy = { selector: '*', property: 'aria-labelledby', comparator: (property: any) => typeof property === 'string' };
const compareControls = { selector: '*', property: 'aria-controls', comparator: (property: any) => typeof property === 'string' };
const compareKey = { selector: 'label,input', property: 'key', comparator: (property: any) => typeof property === 'string' };
const compareName = { selector: 'input', property: 'name', comparator: (property: any) => typeof property === 'string' };

const monthRadios = function(open?: boolean) {
	return DEFAULT_MONTHS.map((monthName, i) => v('label', {
		key: '',
		classes: [ css.monthRadio, i === 5 ? css.monthRadioChecked : null ]
	}, [
		v('input', {
			checked: i === 5,
			classes: css.monthRadioInput,
			key: '',
			name: '',
			tabIndex: open ? 0 : -1,
			type: 'radio',
			value: `${i}`,
			onchange: noop,
			onmouseup: noop
		}),
		v('abbr', {
			classes: css.monthRadioLabel,
			title: monthName.long
		}, [ monthName.short ])
	]));
};

const yearRadios = function(open?: boolean, yearStart = 2000, yearEnd = 2020) {
	const radios = [];
	for (let i = yearStart; i < yearEnd; i++) {
		radios.push(v('label', {
			key: '',
			classes: [ css.yearRadio, i === 2017 ? css.yearRadioChecked : null ]
		}, [
			v('input', {
				checked: i === 2017,
				classes: css.yearRadioInput,
				tabIndex: open ? 0 : -1,
				type: 'radio',
				key: '',
				name: '',
				value: `${ i }`,
				onchange: noop,
				onmouseup: noop
			}),
			v('abbr', {
				classes: css.yearRadioLabel
			}, [ `${ i }` ])
		]));
	}
	return radios;
};

const expectedMonthPopup = function(open: boolean) {
	return v('div', {
		id: '',
		key: 'month-grid',
		'aria-hidden': `${!open}`,
		'aria-labelledby': '',
		classes: [ css.monthGrid, !open ? baseCss.visuallyHidden : null ],
		role: 'dialog'
	}, [
		v('fieldset', {
			classes: css.monthFields,
			onkeydown: noop
		}, [
			v('legend', {
				classes: baseCss.visuallyHidden
			}, [ DEFAULT_LABELS.chooseMonth ]),
			...monthRadios(open)
		])
	]);
};

const expectedYearPopup = function(open: boolean, yearStart?: number, yearEnd?: number) {
	return v('div', {
		key: 'year-grid',
		'aria-hidden': `${!open}`,
		'aria-labelledby': '',
		classes: [ css.yearGrid, !open ? baseCss.visuallyHidden : null ],
		id: '',
		role: 'dialog'
	}, [
		v('fieldset', {
			classes: css.yearFields,
			onkeydown: noop
		}, [
			v('legend', { classes: [ baseCss.visuallyHidden ] }, [ DEFAULT_LABELS.chooseYear ]),
			...yearRadios(open, yearStart, yearEnd)
		]),
		v('div', {
			classes: css.controls
		}, [
			v('button', {
				classes: css.previous,
				tabIndex: open ? 0 : -1,
				onclick: noop
			}, [
				v('i', { classes: [ iconCss.icon, iconCss.leftIcon ],
					role: 'presentation', 'aria-hidden': 'true'
				}),
				v('span', { classes: baseCss.visuallyHidden }, [ DEFAULT_LABELS.previousYears ])
			]),
			v('button', {
				classes: css.next,
				tabIndex: open ? 0 : -1,
				onclick: noop
			}, [
				v('i', { classes: [ iconCss.icon, iconCss.rightIcon ],
					role: 'presentation', 'aria-hidden': 'true'
				}),
				v('span', { classes: baseCss.visuallyHidden }, [ DEFAULT_LABELS.nextYears ])
			])
		])
	]);
};

const expected = function(monthOpen = false, yearOpen = false, options: { yearStart?: number; yearEnd?: number; monthLabel?: string; } = {}) {
	const { yearStart, yearEnd, monthLabel = 'June 2017' } = options;
	// new
	return v('div', {
		classes: css.datePicker
	}, [
		v('div', {
			classes: css.topMatter,
			role: 'menubar'
		}, [
			// hidden label
			v('label', {
				id: customProps.labelId ? customProps.labelId : '',
				classes: [ baseCss.visuallyHidden ],
				'aria-live': 'polite',
				'aria-atomic': 'false'
			}, [ monthLabel ]),

			// month trigger
			v('button', {
				key: 'month-button',
				'aria-controls': '',
				'aria-expanded': `${monthOpen}`,
				'aria-haspopup': 'true',
				id: '',
				classes: [ css.monthTrigger, monthOpen ? css.monthTriggerActive : null ],
				role: 'menuitem',
				onclick: noop
			}, [ 'June' ]),

			// year trigger
			v('button', {
				key: 'year-button',
				'aria-controls': '',
				'aria-expanded': `${yearOpen}`,
				'aria-haspopup': 'true',
				id: '',
				classes: [ css.yearTrigger, yearOpen ? css.yearTriggerActive : null ],
				role: 'menuitem',
				onclick: noop
			}, [ '2017' ])
		]),

		// month picker
		expectedMonthPopup(monthOpen),

		// year picker
		expectedYearPopup(yearOpen, yearStart, yearEnd)
	]);
};

interface TestEventInit extends EventInit {
	which: number;
}

registerSuite('Calendar DatePicker', {
	tests: {
		'Popup should render with default properties'() {
			const h = harness(() => w(DatePicker, {
				...requiredProps
			}), [ compareId, compareLabelledBy, compareControls, compareKey, compareName ]);

			h.expect(() => expected());
		},

		'Popup should render with custom properties'() {
			customProps = {
				labelId: 'foo',
				yearRange: 25
			};

			const h = harness(() => w(DatePicker, {
				renderMonthLabel: () => { return 'bar'; },
				...customProps,
				...requiredProps
			}), [ compareId, compareLabelledBy, compareControls, compareKey, compareName ]);

			h.expect(() => expected(false, false, { yearStart: 2000, yearEnd: 2025, monthLabel: 'bar'}));
		},

		// 'Year below 2000 calculates correctly'() {
		// 	// classes are easier to replace if we do this twice
		// 	widget.setProperties({
		// 		...requiredProps
		// 	});
		// 	let expectedVdom = expected(widget);
		// 	widget.expectRender(expectedVdom);

		// 	widget.setProperties({
		// 		...requiredProps,
		// 		year: 1997
		// 	});
		// 	expectedVdom = expected(widget, false, false, 1980, 2000);
		// 	const yearGridVdom = findKey(expectedVdom, 'year-grid');
		// 	replaceChild(expectedVdom, '0,0,0', 'June 1997');
		// 	replaceChild(expectedVdom, '0,2,0', '1997');
		// 	assignChildProperties(yearGridVdom!, '0,18', { classes: [ css.yearRadio, css.yearRadioChecked ] });
		// 	assignChildProperties(yearGridVdom!, '0,18,0', { checked: true });
		// 	widget.expectRender(expectedVdom);
		// },

		'Month popup opens and closes on button click'() {
			let isOpen;
			const h = harness(() => w(DatePicker, {
				onPopupChange: (open: boolean) => { isOpen = open; },
				...requiredProps
			}));

			h.trigger('@month-button', 'onclick');
			assert.isTrue(isOpen, 'First click should open popup');
			h.trigger('@month-button', 'onclick');
			assert.isFalse(isOpen, 'Second click should close popup');
		},

		'Year popup opens and closes on button click'() {
			let isOpen;
			const h = harness(() => w(DatePicker, {
				onPopupChange: (open: boolean) => { isOpen = open; },
				...requiredProps
			}));

			h.trigger('@year-button', 'onclick');
			assert.isTrue(isOpen, 'First click should open popup');

			h.trigger('@year-button', 'onclick');
			assert.isFalse(isOpen, 'Second click should close popup');
		},

		'Popup switches between month and year'() {
			let isOpen;
			const h = harness(() => w(DatePicker, {
				onPopupChange: (open: boolean) => { isOpen = open; },
				...requiredProps
			}), [ compareId, compareLabelledBy, compareControls, compareKey, compareName ]);
			h.expect(() => expected(false, false));

			h.trigger('@month-button', 'onclick');
			h.expect(() => expected(true, false));
			assert.isTrue(isOpen, 'Month button opens popup');

			h.trigger('@year-button', 'onclick');
			h.expect(() => expected(false, true));
			assert.isTrue(isOpen, 'After clicking year button, popup is still open');
		},

		'Month popup closes with correct keys'() {
			let isOpen = true;
			const h = harness(() => w(DatePicker, {
				onPopupChange: (open: boolean) => { isOpen = open; },
				...requiredProps
			}), [ compareId, compareLabelledBy, compareControls, compareKey, compareName ]);
			h.expect(() => expected(false, false));

			// escape key
			assert.isTrue(isOpen);
			h.trigger('@month-button', 'onclick');
			h.expect(() => expected(true, false));
			h.trigger(`.${css.monthGrid} fieldset`, 'onkeydown', { which: Keys.Escape });
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on escape key press');

			// enter key
			h.trigger('@month-button', 'onclick');
			h.expect(() => expected(true, false));
			h.trigger(`.${css.monthGrid} fieldset`, 'onkeydown', { which: Keys.Enter });
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on enter key press');

			// space key
			h.trigger('@month-button', 'onclick');
			h.expect(() => expected(true, false));
			h.trigger(`.${css.monthGrid} fieldset`, 'onkeydown', { which: Keys.Space });
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on space key press');

			// random key
			h.trigger('@month-button', 'onclick');
			h.expect(() => expected(true, false));
			h.trigger(`.${css.monthGrid} fieldset`, 'onkeydown', { which: Keys.PageDown });
			h.expect(() => expected(true, false));
			assert.isTrue(isOpen, 'Other keys don\'t close popup');
		},

		'year popup closes with correct keys'() {
			let isOpen = true;
			const h = harness(() => w(DatePicker, {
				onPopupChange: (open: boolean) => { isOpen = open; },
				...requiredProps
			}), [ compareId, compareLabelledBy, compareControls, compareKey, compareName ]);
			h.expect(() => expected(false, false));

			// escape key
			assert.isTrue(isOpen);
			h.trigger('@year-button', 'onclick');
			h.expect(() => expected(false, true));
			h.trigger(`.${css.yearGrid} fieldset`, 'onkeydown', { which: Keys.Escape });
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on escape key press');

			// enter key
			h.trigger('@year-button', 'onclick');
			h.expect(() => expected(false, true));
			h.trigger(`.${css.yearGrid} fieldset`, 'onkeydown', { which: Keys.Enter });
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on enter key press');

			// space key
			h.trigger('@year-button', 'onclick');
			h.expect(() => expected(false, true));
			h.trigger(`.${css.yearGrid} fieldset`, 'onkeydown', { which: Keys.Space });
			h.expect(() => expected(false, false));
			assert.isFalse(isOpen, 'Should close on space key press');

			// random key
			h.trigger('@year-button', 'onclick');
			h.expect(() => expected(false, true));
			h.trigger(`.${css.yearGrid} fieldset`, 'onkeydown', { which: Keys.PageDown });
			h.expect(() => expected(false, true));
			assert.isTrue(isOpen, 'Other keys don\'t close popup');
		},

		'Clicking buttons changes year page'() {
			const h = harness(() => w(DatePicker, {
				...requiredProps
			}), [ compareId, compareLabelledBy, compareControls, compareKey, compareName ]);
			h.trigger('@year-button', 'onclick');
			h.expect(() => expected(false, true));

			h.trigger(`.${css.next}`, 'onclick');
			h.expect(() => expected(false, true, { yearStart: 2020, yearEnd: 2040 }));

			h.trigger(`.${css.previous}`, 'onclick');
			h.expect(() => expected(false, true, { yearStart: 2000, yearEnd: 2020 }));
		},

		'Change month radios'() {
			let currentMonth = testDate.getMonth();
			let isOpen = false;
			const h = harness(() => w(DatePicker, {
				...requiredProps,
				onPopupChange: (open: boolean) => { isOpen = open; },
				onRequestMonthChange: (month: number) => { currentMonth = month; }
			}), [ compareId, compareLabelledBy, compareControls, compareKey, compareName ]);

			h.trigger('@month-button', 'onclick');
			assert.isTrue(isOpen, 'Month popup opens when clicking month button');

			h.trigger(`.${css.monthRadio}:nth-of-type(7) input`, 'onchange', { target: { value: 6 } });
			assert.strictEqual(currentMonth, 6, 'Change event on July sets month value');

			h.trigger(`.${css.monthRadio}:nth-of-type(7) input`, 'onmouseup');
			assert.isFalse(isOpen, 'Clicking radios closes popup');
		},

		'Change year radios'() {
			let currentYear = testDate.getMonth();
			let isOpen = false;
			const h = harness(() => w(DatePicker, {
				...requiredProps,
				onPopupChange: (open: boolean) => { isOpen = open; },
				onRequestYearChange: (year: number) => { currentYear = year; }
			}), [ compareId, compareLabelledBy, compareControls, compareKey, compareName ]);

			h.trigger('@year-button', 'onclick');
			assert.isTrue(isOpen, 'Year popup opens when clicking month button');

			h.trigger(`.${css.yearRadio}:nth-of-type(2) input`, 'onchange', { target: { value: 2001 } });
			assert.strictEqual(currentYear, 2001, 'Change event on second year radio changes year to 2001');

			h.trigger(`.${css.yearRadio}:nth-of-type(2) input`, 'onmouseup');
			assert.isFalse(isOpen, 'Clicking radios closes popup');
		}
	}
});
