const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import keys from '@theintern/leadfoot/keys';
import { services } from '@theintern/a11y';
import * as css from '../../../theme/calendar.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import { uuid } from '@dojo/framework/core/util';

const axe = services.axe;

const DELAY = 500;

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

function firstDayCssSelector(firstDayOfMonth = firstDay) {
	return `tbody > tr:first-child > td:nth-child(${firstDayOfMonth + 1})`;
}

function openMonthPicker(remote: Remote) {
	return remote
		.get(`http://localhost:9000/_build/common/example/?id=${uuid()}#calendar`)
		.setFindTimeout(5000)
		.findByClassName(css.monthTrigger)
		.click()
		.sleep(DELAY)
		.end();
}

function openYearPicker(remote: Remote) {
	return remote
		.get(`http://localhost:9000/_build/common/example/?id=${uuid()}#calendar`)
		.setFindTimeout(5000)
		.findByClassName(css.yearTrigger)
		.click()
		.sleep(DELAY)
		.end();
}

function clickDate(remote: Remote) {
	return remote
		.get(`http://localhost:9000/_build/common/example/?id=${uuid()}#calendar`)
		.setFindTimeout(5000)
		.findByCssSelector(firstDayCssSelector())
		.click()
		.sleep(DELAY)
		.end();
}

registerSuite('Calendar', {
	'Open month picker'() {
		return openMonthPicker(this.remote)
			.findByClassName(css.monthGrid)
			.getAttribute('aria-hidden')
			.then((hidden: string) => {
				assert.strictEqual(hidden, 'false', 'The month dialog should open on first click');
			})
			.end()
			.findByClassName(css.dateGrid)
			.getAttribute('class')
			.then((className: string) => {
				assert.include(
					className,
					baseCss.visuallyHidden,
					'date grid is hidden when month popup is open'
				);
			})
			.getActiveElement()
			.getAttribute('value')
			.then((value: string) => {
				assert.strictEqual(
					value,
					`${today.getMonth()}`,
					'focus moved to current month radio inside popup'
				);
			});
	},

	'Close month picker'() {
		return openMonthPicker(this.remote)
			.findByClassName(css.monthTrigger)
			.click()
			.sleep(DELAY)
			.end()
			.findByClassName(css.monthGrid)
			.getAttribute('aria-hidden')
			.then((hidden: string) => {
				assert.strictEqual(hidden, 'true', 'The month dialog should close on second click');
			})
			.end()
			.getActiveElement()
			.getAttribute('class')
			.then((className: string) => {
				assert.include(className, css.monthTrigger, 'focus moved to button');
			});
	},

	'Open year picker'() {
		return openYearPicker(this.remote)
			.findByClassName(css.yearGrid)
			.getAttribute('aria-hidden')
			.then((hidden: string) => {
				assert.strictEqual(hidden, 'false', 'The month dialog should open on first click');
			})
			.end()
			.findByClassName(css.dateGrid)
			.getAttribute('class')
			.then((className: string) => {
				assert.include(
					className,
					baseCss.visuallyHidden,
					'date grid is hidden when month popup is open'
				);
			})
			.getActiveElement()
			.getAttribute('value')
			.then((value: string) => {
				assert.strictEqual(
					value,
					`${today.getFullYear()}`,
					'focus moved to current year radio inside popup'
				);
			});
	},

	'Clicking month radio selects month and closes popup'() {
		const { browserName = '' } = this.remote.session.capabilities;
		if (browserName.toLowerCase() === 'microsoftedge') {
			this.skip('Edge driver does not handle mouseup on click.');
		}

		return openMonthPicker(this.remote)
			.findByCssSelector('input[type=radio]')
			.click()
			.sleep(DELAY)
			.end()
			.getActiveElement()
			.getVisibleText()
			.then((label) => {
				assert.include(
					label,
					'January',
					'Clicking first month radio focuses button and changes text to January'
				);
			})
			.end()
			.findByClassName(css.monthGrid)
			.getAttribute('aria-hidden')
			.then((hidden: string) => {
				assert.strictEqual(hidden, 'true', 'Clicking month radio closes popup');
			});
	},

	'Correct dates are disabled'() {
		const disabledDateSelector =
			firstDay === 0
				? 'tbody tr:last-child td:last-child'
				: `tbody tr:first-child td:nth-child(${firstDay})`;
		return clickDate(this.remote)
			.findByCssSelector(firstDayCssSelector())
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, '1', 'Month starts on correct day');
			})
			.end()
			.findByCssSelector(disabledDateSelector)
			.getAttribute('class')
			.then((className: string) => {
				assert.include(className, css.inactiveDate, 'Disabled date has correct css class');
			});
	},

	'Arrow keys move date focus'() {
		const { supportsKeysCommand, browserName = '' } = this.remote.session.capabilities;
		if (!supportsKeysCommand || browserName.toLowerCase() === 'safari') {
			this.skip('Arrow keys must be supported');
		}
		if (browserName.toLowerCase() === 'microsoftedge') {
			this.skip('Edge driver does not handle focus on click');
		}

		return clickDate(this.remote)
			.findByCssSelector(firstDayCssSelector())
			.pressKeys(keys.ARROW_RIGHT)
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, '2', 'Right arrow moves active element to second day');
			})
			.end()
			.findByCssSelector(firstDayCssSelector())
			.pressKeys(keys.ARROW_DOWN)
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, '9', 'Down arrow moves active element to next week');
			})
			.end()
			.findByCssSelector(firstDayCssSelector())
			.pressKeys(keys.ARROW_LEFT)
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, '8', 'Left arrow moves active element to previous day');
			})
			.end()
			.findByCssSelector(firstDayCssSelector())
			.pressKeys(keys.ARROW_UP)
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, '1', 'Up arrow moves active element to previous week');
			})
			.end()
			.findByCssSelector(firstDayCssSelector())
			.pressKeys(keys.PAGE_DOWN)
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				const today = new Date();
				const monthLengh = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
				assert.strictEqual(text, `${monthLengh}`, 'Page down moves to last day');
			})
			.end()
			.findByCssSelector(firstDayCssSelector())
			.pressKeys(keys.PAGE_UP)
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, '1', 'Page up moves to first day');
			})
			.end();
	},

	'Clicking other month date moves focus'() {
		let clickedDate = '';
		return clickDate(this.remote)
			.findByClassName(css.inactiveDate)
			.getVisibleText()
			.then((text) => {
				clickedDate = text;
			})
			.click()
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, clickedDate, 'Clicked date has focus');
			})
			.getAttribute('class')
			.then((className: string) => {
				assert.include(className, css.selectedDate, 'Clicked date has selected class');
			});
	},

	'The calendar is constrained by the max date'() {
		const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1).getDay();
		return clickDate(this.remote)
			.findDisplayedByClassName(css.next)
			.click()
			.end()
			.sleep(DELAY)
			.findDisplayedByClassName(css.next)
			.isEnabled()
			.then((enabled) => {
				assert.isFalse(enabled, 'The next month button should be disabled');
			})
			.end()
			.findByCssSelector(firstDayCssSelector(firstDayOfNextMonth))
			.click()
			.sleep(DELAY)
			.pressKeys([keys.ARROW_DOWN, keys.ARROW_DOWN])
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, '15', 'Max date is able to have focus');
			})
			.pressKeys(keys.ARROW_RIGHT)
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, '15', 'Focus does not go beyond max date');
			})
			.pressKeys(keys.ARROW_DOWN)
			.end()
			.sleep(DELAY)
			.getActiveElement()
			.getVisibleText()
			.then((text) => {
				assert.strictEqual(text, '15', 'Focus does not go beyond max date');
			})
			.end()
			.findByCssSelector(`tbody > tr:nth-child(4) > td:first-child`)
			.getAttribute('class')
			.then((className: string) => {
				assert.include(
					className,
					css.inactiveDate,
					'The second half of next month is innactive'
				);
			});
	},

	'check accessibility'() {
		return openMonthPicker(this.remote).then(axe.createChecker());
	}
});
