
const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

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

const animateStub = sinon.spy();
class StubMeta {
	// dimensions .get()
	public get(key: any) {
		return {
				offset: { height: 100 }
		};
	}

	// scroll meta
	public animate(key: string | number, options: any) {
		const { effects, controls } = options;
		animateStub({key, effects, playbackRate: controls.playbackRate});
	}
}

class StubbedTitlePane extends TitlePane {
	meta(MetaType: any): any {
		return new StubMeta();
	}
}

const expected = function(options: {open?: boolean, closeable?: boolean, heading?: string} = {}) {
	const {
		open = true,
		closeable = true,
		heading = null
	} = options;
	return v('div', {
		classes: [ css.root, open ? css.open : null, fixedCss.rootFixed ]
	}, [
		w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
		v('div', {
			'aria-level': heading,
			classes: [ css.title, closeable ? css.closeable : null, fixedCss.titleFixed, closeable ? fixedCss.closeableFixed : null ],
			role: 'heading'
		}, [
			v('button', {
				'aria-controls': '',
				'aria-expanded': `${open}`,
				classes: [ fixedCss.titleButtonFixed, css.titleButton ],
				disabled: !closeable,
				id: '',
				type: 'button',
				onclick: noop
			}, [
				v('span', { classes: css.arrow }, [
					w(Icon, { type: open ? 'downIcon' : 'rightIcon' })
				]),
				'test'
			])
		]),
		v('div', {
			'aria-hidden': open ? null : 'true',
			'aria-labelledby': '',
			classes: [ css.content, fixedCss.contentFixed ],
			styles: {
				marginTop: open ? '0px' : '-100px'
			},
			id: '',
			key: 'content'
		}, [ ])
	]);
};

registerSuite('TitlePane', {
	beforeEach() {
		animateStub.reset();
	},

	tests: {
		'default rendering'() {
			const h = harness(() => w(StubbedTitlePane, { title: 'test' }));

			h.expect(expected);
		},

		'Should construct with the passed properties'() {
			const h = harness(() => w(StubbedTitlePane, {
				closeable: false,
				headingLevel: 5,
				open: false,
				title: 'test'
			}));

			h.expect(() => expected({open: false, closeable: false, heading: '5'}));
		},

		'click title to close'() {
			let called = false;
			const h = harness(() => w(StubbedTitlePane, {
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
			const h = harness(() => w(StubbedTitlePane, {
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
			const h = harness(() => w(StubbedTitlePane, properties));
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
		},

		'Calls animate with correct effects'() {
			let open = true;
			const h = harness(() => w(StubbedTitlePane, {
				title: 'test',
				open
			}));

			assert.isTrue(animateStub.getCall(0).calledWith({
				key: 'content',
				effects: [
					{ marginTop: '0px' },
					{ marginTop: '-100px' }
				],
				playbackRate: -1
			}));

			open = false;
			h.expect(() => expected({ open: false }));
			assert.isTrue(animateStub.getCall(1).calledWith({
				key: 'content',
				effects: [
					{ marginTop: '0px' },
					{ marginTop: '-100px' }
				],
				playbackRate: 1
			}));
		}
	}
});
