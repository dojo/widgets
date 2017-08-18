import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty, findKey, assignChildProperties, replaceChild } from '@dojo/test-extras/support/d';
import { v } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import DatePicker, { DatePickerProperties } from '../../DatePicker';
import { DEFAULT_MONTHS, DEFAULT_LABELS } from '../../Calendar';
import * as css from '../../styles/calendar.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

let widget: Harness<DatePickerProperties, typeof DatePicker>;
const testDate = new Date('June 3 2017');
const requiredProps = {
	labels: DEFAULT_LABELS,
	month: testDate.getMonth(),
	monthNames: DEFAULT_MONTHS,
	year: testDate.getFullYear()
};
let customProps: any = {};

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

const monthRadios = function(widget: any, open?: boolean) {
	return DEFAULT_MONTHS.map((monthName, i) => v('label', {
		key: <any> compareId,
		classes: widget.classes(css.monthRadio, i === 5 ? css.monthRadioChecked : null)
	}, [
		v('input', {
			checked: i === 5,
			classes: widget.classes(css.monthRadioInput),
			name: <any> compareId,
			tabIndex: open ? 0 : -1,
			type: 'radio',
			value: i + '',
			onchange: widget.listener,
			onmouseup: widget.listener
		}),
		v('abbr', {
			classes: widget.classes(css.monthRadioLabel),
			title: monthName.long
		}, [ monthName.short ])
	]));
};

const yearRadios = function(widget: any, open?: boolean, yearStart = 2000, yearEnd = 2020) {
	const radios = [];
	for (let i = yearStart; i < yearEnd; i++) {
		radios.push(v('label', {
			key: <any> compareId,
			classes: widget.classes(css.yearRadio, i === 2017 ? css.yearRadioChecked : null)
		}, [
			v('input', {
				checked: i === 2017,
				classes: widget.classes(css.yearRadioInput),
				name: <any> compareId,
				tabIndex: open ? 0 : -1,
				type: 'radio',
				value: `${ i }`,
				onchange: widget.listener,
				onmouseup: widget.listener
			}),
			v('abbr', {
				classes: widget.classes(css.yearRadioLabel)
			}, [ `${ i }` ])
		]));
	}
	return radios;
};

const expectedMonthPopup = function(widget: any, open: boolean) {
	return v('div', {
		key: 'month-grid',
		'aria-hidden': String(!open),
		'aria-labelledby': <any> compareId,
		classes: widget.classes(css.monthGrid, !open ? baseCss.visuallyHidden : null),
		id: <any> compareId,
		role: 'dialog'
	}, [
		v('fieldset', {
			classes: widget.classes(css.monthFields),
			onkeydown: widget.listener
		}, [
			v('legend', {
				classes: widget.classes(baseCss.visuallyHidden)
			}, [ DEFAULT_LABELS.chooseMonth ]),
			...monthRadios(widget, open)
		])
	]);
};

const expectedYearPopup = function(widget: any, open: boolean, yearStart?: number, yearEnd?: number) {
	return v('div', {
		key: 'year-grid',
		'aria-hidden': String(!open),
		'aria-labelledby': <any> compareId,
		classes: widget.classes(css.yearGrid, !open ? baseCss.visuallyHidden : null),
		id: <any> compareId,
		role: 'dialog'
	}, [
		v('fieldset', {
			classes: widget.classes(css.yearFields),
			onkeydown: widget.listener
		}, [
			v('legend', { classes: widget.classes(baseCss.visuallyHidden) }, [ DEFAULT_LABELS.chooseYear ]),
			...yearRadios(widget, open, yearStart, yearEnd)
		]),
		v('div', {
			classes: widget.classes(css.controls)
		}, [
			v('button', {
				classes: widget.classes(css.previous),
				tabIndex: open ? 0 : -1,
				onclick: widget.listener
			}, [
				v('i', { classes: widget.classes(iconCss.icon, iconCss.leftIcon),
					role: 'presentation', 'aria-hidden': 'true'
				}),
				v('span', { classes: widget.classes(baseCss.visuallyHidden) }, [ DEFAULT_LABELS.previousMonth ])
			]),
			v('button', {
				classes: widget.classes(css.next),
				tabIndex: open ? 0 : -1,
				onclick: widget.listener
			}, [
				v('i', { classes: widget.classes(iconCss.icon, iconCss.rightIcon),
					role: 'presentation', 'aria-hidden': 'true'
				}),
				v('span', { classes: widget.classes(baseCss.visuallyHidden) }, [ DEFAULT_LABELS.nextMonth ])
			])
		])
	]);
};

const expected = function(widget: any, monthOpen = false, yearOpen = false, yearStart?: number, yearEnd?: number) {
	// new
	return v('div', {
		classes: widget.classes(css.datePicker)
	}, [
		v('div', {
			classes: widget.classes(css.topMatter),
			role: 'menubar'
		}, [
			// hidden label
			v('label', {
				id: customProps.labelId ? customProps.labelId : <any> compareId,
				classes: widget.classes(baseCss.visuallyHidden),
				'aria-live': 'polite',
				'aria-atomic': 'false'
			}, [ 'June 2017' ]),

			// month trigger
			v('button', {
				key: 'month-button',
				'aria-controls': <any> compareId,
				'aria-expanded': String(monthOpen),
				'aria-haspopup': 'true',
				id: <any> compareId,
				classes: widget.classes(css.monthTrigger, monthOpen ? css.monthTriggerActive : null),
				role: 'menuitem',
				onclick: widget.listener
			}, [ 'June' ]),

			// year trigger
			v('button', {
				key: 'year-button',
				'aria-controls': <any> compareId,
				'aria-expanded': String(yearOpen),
				'aria-haspopup': 'true',
				id: <any> compareId,
				classes: widget.classes(css.yearTrigger, yearOpen ? css.yearTriggerActive : null),
				role: 'menuitem',
				onclick: widget.listener
			}, [ '2017' ])
		]),

		// month picker
		expectedMonthPopup(widget, monthOpen),

		// year picker
		expectedYearPopup(widget, yearOpen, yearStart, yearEnd)
	]);
};

interface TestEventInit extends EventInit {
	which: number;
}

registerSuite({
	name: 'Calendar DatePicker',

	beforeEach() {
		widget = harness(DatePicker);
	},

	afterEach() {
		customProps = {};
		widget.destroy();
	},

	'Popup should render with default properties'() {
		widget.setProperties({
			...requiredProps
		});

		widget.expectRender(expected(widget));
	},

	'Popup should render with custom properties'() {
		customProps = {
			labelId: 'foo',
			yearRange: 25
		};
		widget.setProperties({
			renderMonthLabel: () => { return 'bar'; },
			...customProps,
			...requiredProps
		});

		let expectedVdom = expected(widget, false, false, 2000, 2025);
		replaceChild(expectedVdom, '0,0,0', 'bar');

		widget.expectRender(expectedVdom);
	},

	'Year below 2000 calculates correctly'() {
		// classes are easier to replace if we do this twice
		widget.setProperties({
			...requiredProps
		});
		let expectedVdom = expected(widget);
		widget.expectRender(expectedVdom);

		widget.setProperties({
			...requiredProps,
			year: 1997
		});
		expectedVdom = expected(widget, false, false, 1980, 2000);
		const yearGridVdom = findKey(expectedVdom, 'year-grid');
		replaceChild(expectedVdom, '0,0,0', 'June 1997');
		replaceChild(expectedVdom, '0,2,0', '1997');
		assignChildProperties(yearGridVdom!, '0,18', { classes: widget.classes(css.yearRadio, css.yearRadioChecked) });
		assignChildProperties(yearGridVdom!, '0,18,0', { checked: true });
		widget.expectRender(expectedVdom);
	},

	'Month popup opens and closes on button click'() {
		let isOpen;
		widget.setProperties({
			onPopupChange: open => { isOpen = open; },
			...requiredProps
		});

		widget.sendEvent('click', {
			key: 'month-button'
		});
		assert.isTrue(isOpen, 'First click should open popup');

		widget.sendEvent('click', {
			key: 'month-button'
		});
		assert.isFalse(isOpen, 'Second click should close popup');
	},

	'Year popup opens and closes on button click'() {
		let isOpen;
		widget.setProperties({
			onPopupChange: open => { isOpen = open; },
			...requiredProps
		});

		widget.sendEvent('click', {
			key: 'year-button'
		});
		assert.isTrue(isOpen, 'First click should open popup');

		widget.sendEvent('click', {
			key: 'year-button'
		});
		assert.isFalse(isOpen, 'Second click should close popup');
	},

	'Popup switches between month and year'() {
		let isOpen;
		let expectedVdom = expected(widget, false, false);
		widget.setProperties({
			onPopupChange: open => { isOpen = open; },
			...requiredProps
		});
		widget.expectRender(expectedVdom);

		widget.sendEvent('click', {
			key: 'month-button'
		});
		expectedVdom = expected(widget, true, false);
		assert.isTrue(isOpen, 'Month button opens popup');
		widget.expectRender(expectedVdom);

		widget.sendEvent('click', {
			key: 'year-button'
		});
		expectedVdom = expected(widget, false, true);
		assert.isTrue(isOpen, 'After clicking year button, popup is still open');
		widget.expectRender(expectedVdom);
	},

	'Month popup closes with correct keys'() {
		let isOpen;
		let expectedVdom = expected(widget, false, false);
		widget.setProperties({
			onPopupChange: open => { isOpen = open; },
			...requiredProps
		});
		widget.expectRender(expectedVdom);

		// escape key
		widget.sendEvent('click', { key: 'month-button' });
		widget.sendEvent<TestEventInit>('keydown', {
			eventInit: {
				which: Keys.Escape
			},
			selector: `.${css.monthGrid} fieldset`
		});
		expectedVdom = expected(widget, false, false);
		widget.expectRender(expectedVdom);
		assert.isFalse(isOpen, 'Should close on escape key press');

		// enter key
		widget.sendEvent('click', { key: 'month-button' });
		widget.sendEvent<TestEventInit>('keydown', {
			eventInit: {
				which: Keys.Enter
			},
			selector: `.${css.monthGrid} fieldset`
		});
		widget.expectRender(expectedVdom);
		assert.isFalse(isOpen, 'Should close on enter key press');

		// space key
		widget.sendEvent('click', { key: 'month-button' });
		widget.sendEvent<TestEventInit>('keydown', {
			eventInit: {
				which: Keys.Space
			},
			selector: `.${css.monthGrid} fieldset`
		});
		widget.expectRender(expectedVdom);
		assert.isFalse(isOpen, 'Should close on space key press');

		// random key
		widget.sendEvent('click', { key: 'month-button' });
		widget.sendEvent<TestEventInit>('keydown', {
			eventInit: {
				which: Keys.PageDown
			},
			selector: `.${css.monthGrid} fieldset`
		});
		expectedVdom = expected(widget, true, false);
		widget.expectRender(expectedVdom);
		assert.isTrue(isOpen, 'Other keys don\'t close popup');
	},

	'year popup closes with correct keys'() {
		let isOpen;
		let expectedVdom = expected(widget, false, false);
		expectedVdom = expected(widget, false, false);
		widget.setProperties({
			onPopupChange: open => { isOpen = open; },
			...requiredProps
		});

		// escape key
		widget.sendEvent('click', { key: 'year-button' });
		widget.sendEvent<TestEventInit>('keydown', {
			eventInit: {
				which: Keys.Escape
			},
			selector: `.${css.yearGrid} fieldset`
		});
		widget.expectRender(expectedVdom);
		assert.isFalse(isOpen, 'Should close on escape key press');

		// enter key
		widget.sendEvent('click', { key: 'year-button' });
		widget.sendEvent<TestEventInit>('keydown', {
			eventInit: {
				which: Keys.Enter
			},
			selector: `.${css.yearGrid} fieldset`
		});
		widget.expectRender(expectedVdom);
		assert.isFalse(isOpen, 'Should close on enter key press');

		// space key
		widget.sendEvent('click', { key: 'year-button' });
		widget.sendEvent<TestEventInit>('keydown', {
			eventInit: {
				which: Keys.Space
			},
			selector: `.${css.yearGrid} fieldset`
		});
		widget.expectRender(expectedVdom);
		assert.isFalse(isOpen, 'Should close on space key press');

		// random key
		widget.sendEvent('click', { key: 'year-button' });
		widget.sendEvent<TestEventInit>('keydown', {
			eventInit: {
				which: Keys.PageDown
			},
			selector: `.${css.yearGrid} fieldset`
		});
		expectedVdom = expected(widget, false, true);
		widget.expectRender(expectedVdom);
		assert.isTrue(isOpen, 'Other keys don\'t close popup');
	},

	'Clicking buttons changes year page'() {
		let expectedVdom = expected(widget);
		widget.setProperties({
			...requiredProps
		});
		widget.sendEvent('click', { key: 'year-button' });

		widget.sendEvent('click', {
			selector: `.${css.next}`
		});
		expectedVdom = expected(widget, false, true, 2020, 2040);
		widget.expectRender(expectedVdom);

		widget.sendEvent('click', {
			selector: '.' + css.previous
		});
		expectedVdom = expected(widget, false, true, 2000, 2020);
		widget.expectRender(expectedVdom);
	},

	'Change month radios'() {
		let currentMonth = testDate.getMonth();
		let isOpen = false;
		widget.setProperties({
			...requiredProps,
			onPopupChange: (open: boolean) => { isOpen = open; },
			onRequestMonthChange: (month: number) => { currentMonth = month; }
		});

		widget.sendEvent('click', { key: 'month-button' });
		assert.isTrue(isOpen, 'Month popup opens when clicking month button');

		widget.sendEvent('change', {
			selector: `.${css.monthRadio}:nth-of-type(7) input`
		});
		assert.strictEqual(currentMonth, 6, 'Change event on July sets month value');

		widget.sendEvent('mouseup', {
			selector: `.${css.monthRadio}:nth-of-type(7) input`
		});
		assert.isFalse(isOpen, 'Clicking radios closes popup');
	},

	'Change year radios'() {
		let currentYear = testDate.getMonth();
		let isOpen = false;
		widget.setProperties({
			...requiredProps,
			onPopupChange: (open: boolean) => { isOpen = open; },
			onRequestYearChange: (year: number) => { currentYear = year; }
		});

		widget.sendEvent('click', { key: 'year-button' });
		assert.isTrue(isOpen, 'Year popup opens when clicking year button');

		widget.sendEvent('change', {
			selector: `.${css.yearRadio}:nth-of-type(2) input`
		});
		assert.strictEqual(currentYear, 2001, 'Change event on second year radio changes year to 2001');

		widget.sendEvent('mouseup', {
			selector: `.${css.yearRadio}:nth-of-type(2) input`
		});
		assert.isFalse(isOpen, 'Clicking radios closes popup');
	}
});
