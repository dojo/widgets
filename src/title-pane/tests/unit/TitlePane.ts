
const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { v, w } from '@dojo/widget-core/d';
import Icon from '../../../icon/index';
import TitlePane, { TitlePaneProperties } from '../../index';
import * as css from '../../../theme/title-pane.m.css';
import * as fixedCss from '../../styles/title-pane.m.css';
import {
	compareId,
	compareAriaControls,
	compareAriaLabelledBy,
	createHarness,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import { GlobalEvent } from '../../../global-event/index';

const harness = createHarness([ compareId, compareAriaLabelledBy, compareAriaControls ]);

interface TestEventInit extends EventInit {
	keyCode: number;
}

registerSuite('TitlePane', {

	tests: {
		'default rendering'() {
			const h = harness(() => w(TitlePane, { title: 'test' }));

			h.expect(() => v('div', {
				classes: [ css.root, css.open, fixedCss.rootFixed ]
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					'aria-level': null,
					classes: [ css.title, css.closeable, fixedCss.titleFixed, fixedCss.closeableFixed ],
					role: 'heading'
				}, [
					v('button', {
						'aria-controls': '',
						'aria-expanded': 'true',
						classes: css.titleButton,
						disabled: false,
						id: '',
						type: 'button',
						onclick: noop
					}, [
						v('span', { classes: css.arrow }, [
							w(Icon, { type: 'downIcon' })
						]),
						'test'
					])
				]),
				v('div', {
					'aria-hidden': null,
					'aria-labelledby': '',
					classes: [ css.content, fixedCss.contentFixed ],
					styles: {
						marginTop: '0px'
					},
					id: '',
					key: 'content'
				}, [ ])
			]));
		},

		'Should construct with the passed properties'() {
			const h = harness(() => w(TitlePane, {
				closeable: false,
				headingLevel: 5,
				open: false,
				title: 'test'
			}));

			h.expect(() => v('div', {
				classes: [ css.root, null, fixedCss.rootFixed ]
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					'aria-level': '5',
					classes: [ css.title, null, fixedCss.titleFixed, null ],
					role: 'heading'
				}, [
					v('button', {
						'aria-controls': '',
						'aria-expanded': 'false',
						classes: css.titleButton,
						disabled: true,
						id: '',
						type: 'button',
						onclick: noop
					}, [
						v('span', { classes: css.arrow }, [
							w(Icon, { type: 'rightIcon' })
						]),
						'test'
					])
				]),
				v('div', {
					'aria-hidden': 'true',
					'aria-labelledby': '',
					classes: [ css.content, fixedCss.contentFixed ],
					id: '',
					styles: {
						marginTop: '-0px'
					},
					key: 'content'
				}, [])
			]));
		},

		'click title to close'() {
			let called = false;
			const h = harness(() => w(TitlePane, {
				closeable: true,
				onRequestClose() {
					called = true;
				},
				title: 'test'
			}));

			h.trigger(`.${css.titleButton}`, 'onclick', stubEvent);
			assert.isTrue(called, 'onRequestClose should be called on title click');
		},

		'click title to open'() {
			let called = false;
			const h = harness(() => w(TitlePane, {
				closeable: true,
				open: false,
				onRequestOpen() {
					called = true;
				},
				title: 'test'
			}));
			h.trigger(`.${css.titleButton}`, 'onclick', stubEvent);
			assert.isTrue(called, 'onRequestOpen should be called on title click');
		},

		'can not open pane on click'() {
			let called = 0;
			let properties: TitlePaneProperties = {
				closeable: false,
				open: true,
				onRequestClose() {
					called++;
				},
				title: 'test'
			};
			const h = harness(() => w(TitlePane, properties));
			h.trigger(`.${css.titleButton}`, 'onclick', stubEvent);

			properties = {
				open: true,
				onRequestClose() {
					called++;
				},
				title: 'test'
			};
			h.trigger(`.${css.titleButton}`, 'onclick', stubEvent);
			assert.strictEqual(called, 1, 'onRequestClose should only becalled once');
		}
	}
});
