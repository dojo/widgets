const { registerSuite } = intern.getInterface('object');

import { Dimensions } from '@dojo/framework/core/meta/Dimensions';
import { v, w, isWNode } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness';
import { stub } from 'sinon';

import Icon from '../../../icon/index';
import Toolbar, { Align, ToolbarProperties } from '../../index';
import SlidePane from '../../../slide-pane/index';

import * as fixedCss from '../../styles/toolbar.m.css';
import * as css from '../../../theme/toolbar.m.css';
import { GlobalEvent } from '../../../global-event/index';
import { noop, MockMetaMixin, stubEvent } from '../../../common/tests/support/test-helpers';

registerSuite('Toolbar', {
	tests: {
		'default rendering'() {
			const h = harness(() => w(Toolbar, {}));
			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, null]
					},
					[w(GlobalEvent, { window: { resize: noop }, key: 'global' }), null, null, null]
				)
			);
		},

		'expanded rendering'() {
			const mockMeta = stub();
			const mockDimensionsGet = stub();
			mockDimensionsGet.returns({
				offset: { height: 100, left: 100, top: 100, width: 100 },
				position: { bottom: 200, left: 100, right: 200, top: 100 },
				scroll: { height: 100, left: 100, top: 100, width: 100 },
				size: { width: 100, height: 100 }
			});
			mockMeta.withArgs(Dimensions).returns({
				get: mockDimensionsGet
			});

			const h = harness(() => w(MockMetaMixin(Toolbar, mockMeta), { collapseWidth: 10 }));

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, null]
					},
					[w(GlobalEvent, { window: { resize: noop }, key: 'global' }), null, null, null]
				)
			);
		},

		'custom title rendering'() {
			const h = harness(() => w(Toolbar, { heading: 'test' }));
			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, null]
					},
					[
						w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
						v(
							'div',
							{
								classes: css.title
							},
							['test']
						),
						null,
						null
					]
				)
			);
		},

		'actions rendering'() {
			const h = harness(() => w(Toolbar, {}, ['test']));
			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, null]
					},
					[
						w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
						null,
						v(
							'div',
							{
								classes: css.actions,
								key: 'menu'
							},
							['test']
						),
						null
					]
				)
			);
		},

		'open and close menu'() {
			const mockMeta = stub();
			const mockDimensionsGet = stub();
			mockDimensionsGet.returns({
				offset: { height: 100, left: 100, top: 100, width: 100 },
				position: { bottom: 200, left: 100, right: 200, top: 100 },
				scroll: { height: 100, left: 100, top: 100, width: 100 },
				size: { width: 100, height: 100 }
			});
			mockMeta.withArgs(Dimensions).returns({
				get: mockDimensionsGet
			});
			let properties: ToolbarProperties = {
				collapseWidth: 1000,
				onCollapse: () => {}
			};
			const h = harness(() => w(MockMetaMixin(Toolbar, mockMeta), properties, ['test']));
			const slidePaneVDom = w(
				SlidePane,
				{
					align: Align.right,
					closeText: 'close',
					key: 'slide-pane-menu',
					onRequestClose: noop,
					open: false,
					theme: undefined,
					classes: undefined,
					title: 'foo'
				},
				[
					v(
						'div',
						{
							classes: css.actions,
							key: 'menu'
						},
						['test']
					)
				]
			);

			const buttonVDom = v(
				'button',
				{
					classes: css.menuButton,
					type: 'button',
					onclick: noop
				},
				['open', w(Icon, { type: 'barsIcon', theme: undefined, classes: undefined })]
			);

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, null]
					},
					[
						w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
						null,
						v(
							'div',
							{
								classes: css.actions,
								key: 'menu'
							},
							['test']
						),
						null
					]
				)
			);

			properties = { heading: 'foo' };
			h.trigger('@global', (node: any) => {
				if (isWNode<GlobalEvent>(node) && node.properties.window !== undefined) {
					return node.properties.window ? node.properties.window.resize : undefined;
				}
			});

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, css.collapsed]
					},
					[
						w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
						v(
							'div',
							{
								classes: css.title
							},
							['foo']
						),
						slidePaneVDom,
						buttonVDom
					]
				)
			);

			h.trigger(`.${css.menuButton}`, 'onclick', stubEvent);
			h.trigger('@slide-pane-menu', 'onRequestClose');

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, css.collapsed]
					},
					[
						w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
						v(
							'div',
							{
								classes: css.title
							},
							['foo']
						),
						slidePaneVDom,
						buttonVDom
					]
				)
			);
		},

		'menu on left'() {
			const mockMeta = stub();
			const mockDimensionsGet = stub();
			mockDimensionsGet.returns({
				offset: { height: 100, left: 100, top: 100, width: 100 },
				position: { bottom: 200, left: 100, right: 200, top: 100 },
				scroll: { height: 100, left: 100, top: 100, width: 100 },
				size: { width: 100, height: 100 }
			});
			mockMeta.withArgs(Dimensions).returns({
				get: mockDimensionsGet
			});
			let properties: ToolbarProperties = {
				align: Align.left,
				collapseWidth: 1000,
				onCollapse: () => {}
			};
			const h = harness(() => w(MockMetaMixin(Toolbar, mockMeta), properties, ['test']));
			const slidePaneVDom = w(
				SlidePane,
				{
					align: Align.left,
					closeText: 'close',
					key: 'slide-pane-menu',
					onRequestClose: noop,
					open: false,
					theme: undefined,
					classes: undefined,
					title: 'foo'
				},
				[
					v(
						'div',
						{
							classes: css.actions,
							key: 'menu'
						},
						['test']
					)
				]
			);

			const buttonVDom = v(
				'button',
				{
					classes: css.menuButton,
					type: 'button',
					onclick: noop
				},
				['open', w(Icon, { type: 'barsIcon', theme: undefined, classes: undefined })]
			);

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, null]
					},
					[
						w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
						null,
						v(
							'div',
							{
								classes: css.actions,
								key: 'menu'
							},
							['test']
						),
						null
					]
				)
			);

			properties = {
				align: Align.left,
				heading: 'foo'
			};

			h.trigger('@global', (node: any) => {
				if (isWNode<GlobalEvent>(node) && node.properties.window !== undefined) {
					return node.properties.window ? node.properties.window.resize : undefined;
				}
			});

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, css.collapsed]
					},
					[
						w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
						v(
							'div',
							{
								classes: css.title
							},
							['foo']
						),
						slidePaneVDom,
						buttonVDom
					]
				)
			);

			h.trigger(`.${css.menuButton}`, 'onclick', stubEvent);
			h.trigger('@slide-pane-menu', 'onRequestClose');

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [fixedCss.rootFixed, css.root, css.collapsed]
					},
					[
						w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
						v(
							'div',
							{
								classes: css.title
							},
							['foo']
						),
						slidePaneVDom,
						buttonVDom
					]
				)
			);
		}
	}
});
