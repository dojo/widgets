import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness, assignProperties } from '@dojo/test-extras/harness';
import assertRender from '@dojo/test-extras/support/assertRender';
// import { findIndex } from '@dojo/test-extras/support/d';
// import callListener from '@dojo/test-extras/support/callListener';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';
import Radio from '../../../radio/Radio';
import Button from '../../../button/Button';

import MonthPicker, { MonthPickerProperties } from '../../MonthPicker';
import { DEFAULT_MONTHS, DEFAULT_WEEKDAYS, DEFAULT_LABELS } from '../../Calendar';
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

const expectedPopup = function(widget) {
	return v('div', {
		'aria-hidden': 'true',
		'aria-labelledby': '', // widget._buttonId,
		classes: widget.classes(css.monthPopup, css.monthPopupHidden),
		id: '', // widget._dialogId,
		role: 'dialog',
		onkeydown: widget.listener
	}, [
		v('div', { classes: widget.classes(css.yearPicker) }, [
			v('label', {
				for: '', // widget._yearSpinnerId,
				classes: widget.classes(baseCss.visuallyHidden)
			}, [ DEFAULT_LABELS.chooseYear ]),
			v('span', {
				role: 'button',
				classes: widget.classes(css.spinnerPrevious),
				onclick: widget.listener
			}, [ '2016' ]),
			v('div', {
				key: 'year-spinner',
				id: '', // widget._yearSpinnerId,
				classes: widget.classes(css.spinner),
				role: 'spinbutton',
				'aria-valuemin': '1',
				'aria-valuenow': '2017',
				tabIndex: -1,
				onkeydown: widget.listener
			}, [ '2017' ]),
			v('span', {
				role: 'button',
				classes: widget.classes(css.spinnerNext),
				onclick: widget.listener
			}, [ '2018' ])
		]),
		v('fieldset', {
			classes: widget.classes(css.monthControl),
			onchange: widget.listener
		}, [
			v('legend', { classes: widget.classes(baseCss.visuallyHidden) }, [ DEFAULT_LABELS.chooseMonth ]),
			<any[]> DEFAULT_MONTHS.map((monthName, i) => w(Radio, {
				key: '', // widget._radiosName + i,
				overrideClasses: { root: css.monthRadio, input: css.monthRadioInput, checked: css.monthRadioChecked },
				checked: i === 5,
				label: {
					content: `<abbr title="${monthName.long}">${monthName.short}</abbr>`,
					before: false
				},
				name: '', // widget._radiosName,
				value: i + '',
				onMouseUp: widget.listener
			}))
		])
	]);
};

const expected = function(widget) {
	return v('div', {
		classes: widget.classes(css.header)
	}, [
		w(Button, {
			key: 'button',
			describedBy: '', // widget._labelId,
			id: '', // widget._buttonId,
			overrideClasses: { root: css.monthTrigger },
			popup: {
				id: '', // widget._dialogId,
				expanded: false
			},
			onClick: widget.listener
		}, [
			v('span', {
				classes: widget.classes(baseCss.visuallyHidden)
			}, [ DEFAULT_LABELS.chooseMonth ])
		]),
		v('label', {
			id: '', // widget._labelId,
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
		expectedPopup(widget)
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
			labels: DEFAULT_LABELS,
			month: testDate.getMonth(),
			monthNames: DEFAULT_MONTHS,
			year: testDate.getFullYear()
		});

		const renderedStuff = widget.getRender();

		const classes1 = widget.classes(css.monthTrigger);
		const classes2 = widget.classes(baseCss.visuallyHidden);

		assignProperties(renderedStuff!.children[0]!.children[0], {
			classes: classes2
		});

		assertRender(renderedStuff!.children[0], w(Button, {
			key: 'button',
			describedBy: '', // widget._labelId,
			id: '', // widget._buttonId,
			overrideClasses: { root: css.monthTrigger },
			popup: {
				id: '', // widget._dialogId,
				expanded: false
			},
			onClick: widget.listener
		}, [
			v('span', {
				classes: classes2
			}, [ DEFAULT_LABELS.chooseMonth ])
		]));
	},

	'Popup opens and closes on button click'() {
		let closed = true;
		widget.setProperties({
			onRequestOpen: () => { closed = false; },
			onRequestClose: () => { closed = true; },
			...requiredProps
		});
		const widgetDom = widget.getDom();

		// open
		callListener(widget, 'onClick', {
			key: 'button'
		});
		widget.getRender();
		assert.isFalse(closed, 'First click should open popup');
		assert.strictEqual(document.activeElement, widgetDom.querySelector('[role=spinbutton]'));

		// close
		callListener(widget, 'onClick', {
			key: 'button'
		});
		widget.getRender();
		assert.isTrue(closed, 'Second click should close popup');
		// TODO: make sure focus is back on button
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
			selector: ':nth-child(5)' // should be the popup div
		});
		widget.getRender();
		assert.isTrue(closed, 'Should close on escape key press');

		// enter key
		closed = false;
		widget.setProperties({
			open: true,
			onRequestClose: () => { closed = true; },
			...requiredProps
		});
		widget.sendEvent('keydown', {
			eventInit: {
				which: Keys.Enter
			},
			selector: ':nth-child(5)' // should be the popup div
		});
		widget.getRender();
		assert.isTrue(closed, 'Should close on enter key press');

		// space key
		closed = false;
		widget.setProperties({
			open: true,
			onRequestClose: () => { closed = true; },
			...requiredProps
		});
		widget.sendEvent('keydown', {
			eventInit: {
				which: Keys.Space
			},
			selector: ':nth-child(5)' // should be the popup div
		});
		widget.getRender();
		assert.isTrue(closed, 'Should close on space key press');

		// TODO: make sure focus is set on the trigger button
	}
});
