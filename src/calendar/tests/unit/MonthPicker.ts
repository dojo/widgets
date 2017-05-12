import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty, assignChildProperties, replaceChild } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';
import Radio from '../../../radio/Radio';
import Button from '../../../button/Button';

import MonthPicker, { MonthPickerProperties } from '../../MonthPicker';
import { DEFAULT_MONTHS, DEFAULT_LABELS } from '../../Calendar';
import * as css from '../../styles/calendar.m.css';
import * as baseCss from '../../../common/styles/base.m.css';

let widget: Harness<MonthPickerProperties, typeof MonthPicker>;
const testDate = new Date('June 3 2017');
const requiredProps = {
	labels: DEFAULT_LABELS,
	month: testDate.getMonth(),
	monthNames: DEFAULT_MONTHS,
	year: testDate.getFullYear()
};

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

const monthRadios = function(widget: any) {
	return DEFAULT_MONTHS.map((monthName, i) => w(Radio, {
		key: <any> compareId, // widget._radiosName + i,
		extraClasses: { root: css.monthRadio, input: css.monthRadioInput, checked: css.monthRadioChecked },
		checked: i === 5,
		label: {
			content: `<abbr title="${monthName.long}">${monthName.short}</abbr>`,
			before: false
		},
		name: <any> compareId, // widget._radiosName,
		value: i + '',
		onChange: widget.listener,
		onMouseUp: widget.listener
	}));
};

const expectedPopup = function(widget: any, open?: boolean) {
	return v('div', {
		afterCreate: widget.listener,
		afterUpdate: widget.listener,
		'aria-hidden': open ? 'false' : 'true',
		'aria-labelledby': <any> compareId, // widget._buttonId,
		classes: widget.classes(css.monthPopup, open ? null : css.monthPopupHidden),
		id: <any> compareId, // widget._dialogId,
		key: 'month-popup',
		role: 'dialog',
		onkeydown: widget.listener
	}, [
		v('div', { classes: widget.classes(css.yearPicker) }, [
			v('label', {
				for: <any> compareId, // widget._yearSpinnerId,
				classes: widget.classes(baseCss.visuallyHidden)
			}, [ DEFAULT_LABELS.chooseYear ]),
			v('span', {
				role: 'button',
				classes: widget.classes(css.spinnerPrevious),
				onclick: widget.listener
			}, [ '2016' ]),
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				key: 'year-spinner',
				id: <any> compareId, // widget._yearSpinnerId,
				classes: widget.classes(css.spinner),
				role: 'spinbutton',
				'aria-valuemin': '1',
				'aria-valuenow': '2017',
				tabIndex: open ? 0 : -1,
				onkeydown: widget.listener
			}, [ '2017' ]),
			v('span', {
				role: 'button',
				classes: widget.classes(css.spinnerNext),
				onclick: widget.listener
			}, [ '2018' ])
		]),
		v('fieldset', {
			classes: widget.classes(css.monthControl)
		}, [
			v('legend', { classes: widget.classes(baseCss.visuallyHidden) }, [ DEFAULT_LABELS.chooseMonth ]),
			...monthRadios(widget)
		])
	]);
};

const expected = function(widget: any, open?: boolean) {
	return v('div', {
		classes: widget.classes(css.header)
	}, [
		w(Button, {
			key: 'button',
			describedBy: <any> compareId, // widget._labelId,
			id: <any> compareId, // widget._buttonId,
			extraClasses: { root: css.monthTrigger },
			popup: {
				id: <any> compareId, // widget._dialogId,
				expanded: !!open
			},
			onClick: widget.listener
		}, [
			v('span', {
				classes: widget.classes(baseCss.visuallyHidden)
			}, [ DEFAULT_LABELS.chooseMonth ])
		]),
		v('label', {
			id: <any> compareId, // widget._labelId,
			classes: widget.classes(css.currentMonthLabel),
			'aria-live': 'polite',
			'aria-atomic': 'false'
		}, [ 'June 2017' ]),
		// previous/next month buttons
		v('button', {
			classes: widget.classes(css.previousMonth),
			onclick: widget.listener
		}, [
			v('span', {
				classes: widget.classes(baseCss.visuallyHidden)
			}, [ DEFAULT_LABELS.previousMonth ])
		]),
		v('button', {
			classes: widget.classes(css.nextMonth),
			onclick: widget.listener
		}, [
			v('span', {
				classes: widget.classes(baseCss.visuallyHidden)
			}, [ DEFAULT_LABELS.nextMonth ])
		]),
		expectedPopup(widget, open)
	]);
};

registerSuite({
	name: 'Calendar MonthPicker',

	beforeEach() {
		widget = harness(MonthPicker);
	},

	afterEach() {
		widget.destroy();
	},

	'Popup should render with default properties'() {
		widget.setProperties({
			...requiredProps
		});

		widget.expectRender(expected(widget));
	},

	'Popup should render with custom properties'() {
		widget.setProperties({
			labelId: 'foo',
			open: true,
			renderMonthLabel: () => { return 'bar'; },
			...requiredProps
		});

		let expectedVdom = expected(widget, true);

		assignChildProperties(expectedVdom, '0', {
			describedBy: 'foo'
		});
		assignChildProperties(expectedVdom, '1', {
			id: 'foo'
		});
		replaceChild(expectedVdom, '1,0', 'bar');

		widget.expectRender(expectedVdom);
	},

	'Popup opens and closes on button click'() {
		let closed = true;
		widget.setProperties({
			onRequestOpen: () => { closed = false; },
			onRequestClose: () => { closed = true; },
			...requiredProps
		});

		// open
		widget.callListener('onClick', {
			key: 'button'
		});
		widget.getRender();
		assert.isFalse(closed, 'First click should open popup');

		// close
		widget.setProperties({
			open: !closed,
			onRequestOpen: () => { closed = false; },
			onRequestClose: () => { closed = true; },
			...requiredProps
		});
		widget.callListener('onClick', {
			key: 'button'
		});
		widget.getRender();
		assert.isTrue(closed, 'Second click should close popup');
	},

	'Popup closes with correct keys'() {
		let closed = false;
		widget.setProperties({
			open: true,
			onRequestClose: () => { closed = true; },
			...requiredProps
		});

		// escape key
		widget.sendEvent('keydown', {
			eventInit: {
				which: Keys.Escape
			},
			key: 'month-popup'
		});
		assert.isTrue(closed, 'Should close on escape key press');

		// enter key
		closed = false;
		widget.sendEvent('keydown', {
			eventInit: {
				which: Keys.Enter
			},
			key: 'month-popup'
		});
		assert.isTrue(closed, 'Should close on enter key press');

		// space key
		closed = false;
		widget.sendEvent('keydown', {
			eventInit: {
				which: Keys.Space
			},
			key: 'month-popup'
		});
		assert.isTrue(closed, 'Should close on space key press');

		// random key
		closed = false;
		widget.sendEvent('keydown', {
			eventInit: {
				which: Keys.PageDown
			},
			key: 'month-popup'
		});
		assert.isFalse(closed, 'Other keys don\'t close popup');
	},

	'Arrow keys change year spinner'() {
		let currentYear = 2017;
		widget.setProperties({
			...requiredProps,
			year: currentYear,
			onRequestYearChange: (year: number) => { currentYear = year; }
		});

		widget.sendEvent('keydown', {
			eventInit: {
				which: Keys.Right
			},
			key: 'year-spinner'
		});

		assert.strictEqual(currentYear, 2018, 'Right arrow key increased year');

		widget.sendEvent('keydown', {
			eventInit: {
				which: Keys.Left
			},
			key: 'year-spinner'
		});

		assert.strictEqual(currentYear, 2016, 'Left arrow key decreased year');
	},

	'Clicking buttons changes year'() {
		let currentYear = testDate.getFullYear();
		widget.setProperties({
			...requiredProps,
			year: currentYear,
			onRequestYearChange: (year: number) => { currentYear = year; }
		});

		widget.sendEvent('click', {
			selector: '.' + css.spinnerNext
		});
		assert.strictEqual(currentYear, testDate.getFullYear() + 1, 'clicking next year button increased year');

		widget.sendEvent('click', {
			selector: '.' + css.spinnerPrevious
		});
		assert.strictEqual(currentYear, testDate.getFullYear() - 1, 'clicking previous year button decreased year');
	},

	'Change month radios'() {
		let currentMonth = testDate.getMonth();
		let closed = false;
		widget.setProperties({
			...requiredProps,
			open: !closed,
			onRequestClose: () => { closed = true; },
			onRequestMonthChange: (month: number) => { currentMonth = month; }
		});

		widget.callListener('onChange', {
			args: [
				{
					target: { value: 6 }
				}
			],
			index: '4,1,8'
		});
		assert.strictEqual(currentMonth, 6, 'Change event sets month value');

		widget.callListener('onMouseUp', {
			index: '4,1,8'
		});
		assert.isTrue(closed, 'Clicking radios closes popup');
	},

	'Previous/next month buttons'() {
		let currentMonth = testDate.getMonth();
		let currentYear = testDate.getFullYear();
		widget.setProperties({
			...requiredProps,
			month: currentMonth,
			onRequestMonthChange: (month: number) => { currentMonth = month; }
		});

		widget.sendEvent('click', {
			selector: '.' + css.previousMonth
		});
		assert.strictEqual(currentMonth, testDate.getMonth() - 1, 'Previous month arrow decreases month');

		widget.sendEvent('click', {
			selector: '.' + css.nextMonth
		});
		assert.strictEqual(currentMonth, testDate.getMonth() + 1, 'Next month arrow increases month');

		widget.setProperties({
			...requiredProps,
			month: 0,
			year: testDate.getFullYear(),
			onRequestMonthChange: (month: number) => { currentMonth = month; },
			onRequestYearChange: (year: number) => { currentYear = year; }
		});
		widget.getRender();
		widget.sendEvent('click', {
			selector: '.' + css.previousMonth
		});
		assert.strictEqual(currentMonth, 11, 'Previous month wraps around');
		assert.strictEqual(currentYear, testDate.getFullYear() - 1, 'Year decreases when month wraps around');

		widget.setProperties({
			...requiredProps,
			month: 11,
			year: testDate.getFullYear(),
			onRequestMonthChange: (month: number) => { currentMonth = month; },
			onRequestYearChange: (year: number) => { currentYear = year; }
		});
		widget.getRender();
		widget.sendEvent('click', {
			selector: '.' + css.nextMonth
		});
		assert.strictEqual(currentMonth, 0, 'Next month wraps around');
		assert.strictEqual(currentYear, testDate.getFullYear() + 1, 'Year increases when month wraps around');
	}
});
