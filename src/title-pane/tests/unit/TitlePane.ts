const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { v, w, isWNode } from '@dojo/framework/widget-core/d';
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

const harness = createHarness([compareId, compareAriaLabelledBy, compareAriaControls]);

interface TestEventInit extends EventInit {
	keyCode: number;
}

class StubMeta {
	// dimensions .get()
	public get(key: any) {
		return {
			offset: { height: 100 }
		};
	}
}

class StubbedTitlePane extends TitlePane {
	meta(MetaType: any): any {
		return new StubMeta();
	}
}

function createVNodeSelector(type: 'window' | 'document', name: string) {
	return (node: any) => {
		if (isWNode<GlobalEvent>(node) && node.properties[type] !== undefined) {
			const globalFuncs = node.properties[type];
			return globalFuncs ? globalFuncs[name] : undefined;
		}
	};
}

const expected = function(
	options: { open?: boolean; closeable?: boolean; heading?: string; transition?: boolean } = {}
) {
	const { open = true, closeable = true, heading = null, transition = true } = options;
	return v(
		'div',
		{
			classes: [css.root, open ? css.open : null, fixedCss.rootFixed]
		},
		[
			w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
			v(
				'div',
				{
					'aria-level': heading,
					classes: [
						css.title,
						closeable ? css.closeable : null,
						fixedCss.titleFixed,
						closeable ? fixedCss.closeableFixed : null
					],
					role: 'heading'
				},
				[
					v(
						'button',
						{
							'aria-controls': '',
							'aria-expanded': `${open}`,
							classes: [fixedCss.titleButtonFixed, css.titleButton],
							disabled: !closeable,
							focus: noop,
							id: '',
							type: 'button',
							onclick: noop
						},
						[
							v('span', { classes: css.arrow }, [
								w(Icon, {
									type: open ? 'downIcon' : 'rightIcon',
									theme: undefined,
									classes: undefined
								})
							]),
							'test'
						]
					)
				]
			),
			v(
				'div',
				{
					'aria-hidden': open ? null : 'true',
					'aria-labelledby': '',
					classes: [
						css.content,
						transition ? css.contentTransition : null,
						fixedCss.contentFixed
					],
					styles: {
						marginTop: open ? '0px' : '-100px'
					},
					id: '',
					key: 'content'
				},
				[]
			)
		]
	);
};

registerSuite('TitlePane', {
	tests: {
		'default rendering'() {
			const h = harness(() => w(StubbedTitlePane, { title: 'test' }));

			h.expect(expected);
		},

		'Should construct with the passed properties'() {
			const h = harness(() =>
				w(StubbedTitlePane, {
					closeable: false,
					headingLevel: 5,
					open: false,
					title: 'test'
				})
			);

			h.expect(() => expected({ open: false, closeable: false, heading: '5' }));
		},

		'click title to close'() {
			let called = false;
			const h = harness(() =>
				w(StubbedTitlePane, {
					closeable: true,
					onRequestClose() {
						called = true;
					},
					title: 'test'
				})
			);

			h.trigger(`.${css.titleButton}`, 'onclick', stubEvent);
			assert.isTrue(called, 'onRequestClose should be called on title click');
		},

		'click title to open'() {
			let called = false;
			const h = harness(() =>
				w(StubbedTitlePane, {
					closeable: true,
					open: false,
					onRequestOpen() {
						called = true;
					},
					title: 'test'
				})
			);
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

		'Can animate closed'() {
			let open = true;
			const h = harness(() =>
				w(StubbedTitlePane, {
					title: 'test',
					open
				})
			);
			h.expect(() => expected({ open: true }));
			open = false;
			h.expect(() => expected({ open: false }));
		},

		'Global resize event removes transition class'() {
			const h = harness(() =>
				w(StubbedTitlePane, {
					title: 'test'
				})
			);

			h.expect(() => expected({ open: true, transition: true }));
			h.trigger('@global', createVNodeSelector('window', 'resize'), stubEvent);
			h.expect(() => expected({ open: true, transition: false }));
		}
	}
});
