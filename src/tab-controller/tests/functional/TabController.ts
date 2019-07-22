const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import { services } from '@theintern/a11y';
import * as css from '../../../theme/tab-controller.m.css';
import { uuid } from '@dojo/framework/core/util';
import pollUntilTruthy from '@theintern/leadfoot/helpers/pollUntilTruthy';

const axe = services.axe;
const CLICK_WAIT_TIMEOUT = 1000;
const POLL_INTERVAL = 20;

function getPage(remote: Remote) {
	return remote
		.get(`http://localhost:9000/dist/dev/src/common/example/?id=${uuid()}#tab-controller`)
		.setFindTimeout(5000);
}

registerSuite('TabController', {
	'tab pane should be visible'() {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
			.getSize()
			.then(({ height, width }) => {
				assert.isAbove(height, 0, 'The tab pane should be greater than zero.');
				assert.isAbove(width, 0, 'The tab pane should be greater than zero.');
			})
			.end();
	},
	'tabs should be changable'() {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
			.findByCssSelector(`.${css.tabButton}:last-child`)
			.getAttribute('class')
			.then((className: string) => {
				assert.notInclude(
					className,
					css.activeTabButton,
					'The last tab should not be selected initially.'
				);
			})
			.click()
			.end()
			.then(
				pollUntilTruthy(
					function(rootClass, activeTabButtonClass) {
						const activeTab = document.querySelector(
							`.${rootClass} .${activeTabButtonClass}`
						);
						return document.activeElement === activeTab;
					},
					[css.root, css.activeTabButton],
					CLICK_WAIT_TIMEOUT,
					POLL_INTERVAL
				)
			)
			.then((isEqual) => {
				assert.isTrue(isEqual);
			})
			.end()
			.end();
	},

	'tab content should be changed when tab is changed'() {
		let tabContent: string;
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
			.findByCssSelector(`.${css.tab}`)
			.getVisibleText()
			.then((text) => {
				tabContent = text;
			})
			.end()

			.findByCssSelector(`.${css.tabButton}:last-child`)
			.click()
			.end()

			.sleep(300)

			.findByCssSelector(`.${css.tab}`)
			.getVisibleText()
			.then((text) => {
				assert.notStrictEqual(text, tabContent);
			})
			.end()
			.end();
	},
	'disabled tab should not be selectable'() {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
			.findByCssSelector(`.${css.disabledTabButton}`)
			.getProperty('className')
			.then((className: string) => {
				assert.notInclude(
					className,
					css.activeTabButton,
					'Disabled tab should not be selected.'
				);
			})
			.click()
			.end()
			.findByCssSelector(`.${css.disabledTabButton}`)
			.getProperty('className')
			.then((className: string) => {
				assert.notInclude(
					className,
					css.activeTabButton,
					'Disabled tab should be selected after being clicked.'
				);
			})
			.end()
			.end();
	},
	'tabs should be closeable'() {
		let childElementCount: number;
		return getPage(this.remote)
			.findByCssSelector(`.${css.tabButtons}`)
			.getProperty('childElementCount')
			.then((count: number) => {
				childElementCount = count;
			})
			.findByCssSelector(`.${css.close}`)
			.click()
			.end()
			.end()
			.sleep(300)
			.findByCssSelector(`.${css.tabButtons}`)
			.getProperty('childElementCount')
			.then((count: number) => {
				assert.strictEqual(count, childElementCount - 1);
			})
			.end();
	},

	'check accessibility'() {
		return getPage(this.remote).then(axe.createChecker());
	}
});
