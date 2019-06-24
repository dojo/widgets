const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { v, w } from '@dojo/framework/core/vdom';

import SlidePane, { Align, SlidePaneProperties } from '../../index';
import * as css from '../../../theme/slide-pane.m.css';
import * as fixedCss from '../../styles/slide-pane.m.css';
import * as animations from '../../../common/styles/animations.m.css';
import {
	createHarness,
	compareId,
	compareAriaLabelledBy,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import { assertionTemplate } from '@dojo/framework/testing/assertionTemplate';

const harness = createHarness([compareId, compareAriaLabelledBy]);

const GREEKING = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	Quisque id purus ipsum. Aenean ac purus purus.
	Nam sollicitudin varius augue, sed lacinia felis tempor in.`;

const closedTemplate = assertionTemplate(() =>
	v(
		'div',
		{
			'aria-labelledby': '',
			onmousedown: noop,
			onmousemove: noop,
			onmouseup: noop,
			ontouchend: noop,
			ontouchmove: noop,
			ontouchstart: noop,
			classes: css.root
		},
		[
			v(
				'div',
				{
					key: 'content',
					classes: [
						css.pane,
						css.left,
						null,
						null,
						null,
						fixedCss.paneFixed,
						null,
						fixedCss.leftFixed,
						null,
						null
					],
					transitionend: noop,
					styles: {
						transform: undefined,
						width: '320px',
						height: undefined
					}
				},
				[
					null,
					v(
						'div',
						{
							'~key': 'textContent',
							classes: [css.content, fixedCss.contentFixed]
						},
						[GREEKING]
					)
				]
			)
		]
	)
);
const closedTemplateRight = closedTemplate.setProperty('@content', 'classes', [
	css.pane,
	css.right,
	null,
	null,
	null,
	fixedCss.paneFixed,
	null,
	fixedCss.rightFixed,
	null,
	null
]);

const openTemplate = closedTemplate
	.insertBefore('@content', [
		v('div', {
			classes: [null, fixedCss.underlay],
			enterAnimation: animations.fadeIn,
			exitAnimation: animations.fadeOut,
			onmouseup: noop,
			ontouchend: noop,
			key: 'underlay'
		})
	])
	.setProperty('@content', 'classes', [
		css.pane,
		css.left,
		css.open,
		null,
		null,
		fixedCss.paneFixed,
		fixedCss.openFixed,
		fixedCss.leftFixed,
		null,
		null
	]);
const openTemplateRight = openTemplate.setProperty('@content', 'classes', [
	css.pane,
	css.right,
	css.open,
	null,
	null,
	fixedCss.paneFixed,
	fixedCss.openFixed,
	fixedCss.rightFixed,
	null,
	null
]);

registerSuite('SlidePane', {
	tests: {
		'Should construct SlidePane with passed properties'() {
			const h = harness(() =>
				w(
					SlidePane,
					{
						key: 'foo',
						align: Align.left,
						aria: { describedBy: 'foo' },
						open: true,
						underlay: true
					},
					[GREEKING]
				)
			);

			h.expect(
				() =>
					v(
						'div',
						{
							'aria-labelledby': '',
							classes: css.root,
							onmousedown: noop,
							onmousemove: noop,
							onmouseup: noop,
							ontouchend: noop,
							ontouchmove: noop,
							ontouchstart: noop
						},
						[
							v('div', {
								classes: [css.underlayVisible, fixedCss.underlay],
								enterAnimation: animations.fadeIn,
								exitAnimation: animations.fadeOut,
								onmouseup: noop,
								ontouchend: noop,
								key: 'underlay'
							}),
							v(
								'div',
								{
									key: 'content',
									'aria-describedby': 'foo',
									classes: [
										css.pane,
										css.left,
										css.open,
										css.slideIn,
										null,
										fixedCss.paneFixed,
										fixedCss.openFixed,
										fixedCss.leftFixed,
										fixedCss.slideInFixed,
										null
									],
									transitionend: noop,
									styles: {
										transform: undefined,
										width: '320px',
										height: undefined
									}
								},
								[
									null,
									v(
										'div',
										{
											classes: [css.content, fixedCss.contentFixed]
										},
										[GREEKING]
									)
								]
							)
						]
					),
				() => h.getRender()
			);
		},

		'Render correct children'() {
			const h = harness(() =>
				w(SlidePane, {
					key: 'foo',
					underlay: false
				})
			);

			h.expect(closedTemplate.setChildren('~textContent', []));
		},

		onOpen() {
			let called = false;
			harness(() =>
				w(SlidePane, {
					open: true,
					onOpen() {
						called = true;
					}
				})
			);
			assert.isTrue(called, 'onOpen should be called');
		},

		'change property to close'() {
			let properties = {
				open: true
			};
			const h = harness(() => w(SlidePane, properties));

			h.expect(() =>
				v(
					'div',
					{
						'aria-labelledby': '',
						onmousedown: noop,
						onmousemove: noop,
						onmouseup: noop,
						ontouchend: noop,
						ontouchmove: noop,
						ontouchstart: noop,
						classes: css.root
					},
					[
						v('div', {
							classes: [null, fixedCss.underlay],
							enterAnimation: animations.fadeIn,
							exitAnimation: animations.fadeOut,
							onmouseup: noop,
							ontouchend: noop,
							key: 'underlay'
						}),
						v(
							'div',
							{
								key: 'content',
								classes: [
									css.pane,
									css.left,
									css.open,
									css.slideIn,
									null,
									fixedCss.paneFixed,
									fixedCss.openFixed,
									fixedCss.leftFixed,
									fixedCss.slideInFixed,
									null
								],
								transitionend: noop,
								styles: {
									transform: undefined,
									width: '320px',
									height: undefined
								}
							},
							[
								null,
								v(
									'div',
									{
										classes: [css.content, fixedCss.contentFixed]
									},
									[]
								)
							]
						)
					]
				)
			);

			properties.open = false;
			h.expect(() =>
				v(
					'div',
					{
						'aria-labelledby': '',
						onmousedown: noop,
						onmousemove: noop,
						onmouseup: noop,
						ontouchend: noop,
						ontouchmove: noop,
						ontouchstart: noop,
						classes: css.root
					},
					[
						null,
						v(
							'div',
							{
								key: 'content',
								classes: [
									css.pane,
									css.left,
									null,
									null,
									css.slideOut,
									fixedCss.paneFixed,
									null,
									fixedCss.leftFixed,
									null,
									fixedCss.slideOutFixed
								],
								transitionend: noop,
								styles: {
									transform: undefined,
									width: '320px',
									height: undefined
								}
							},
							[
								null,
								v(
									'div',
									{
										classes: [css.content, fixedCss.contentFixed]
									},
									[]
								)
							]
						)
					]
				)
			);
		},

		'click underlay to close'() {
			let called = false;
			const h = harness(() =>
				w(SlidePane, {
					open: true,
					onRequestClose() {
						called = true;
					}
				})
			);
			h.trigger('@underlay', 'onmousedown', {
				pageX: 300,
				...stubEvent
			});
			h.trigger('@underlay', 'onmouseup', {
				pageX: 300,
				...stubEvent
			});
			assert.isTrue(called, 'onRequestClose should have been called');
		},

		'click close button to close'() {
			let called = false;

			const h = harness(() =>
				w(SlidePane, {
					open: true,
					title: 'foo',
					closeText: 'close',
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger(`.${css.close}`, 'onclick', stubEvent);
			assert.isTrue(called, 'onRequestClose should have been called');
		},

		'tap underlay to close'() {
			let called = false;

			const h = harness(() =>
				w(SlidePane, {
					open: true,
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger('@underlay', 'ontouchstart', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});
			h.trigger('@underlay', 'ontouchend', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});
			assert.isTrue(called, 'onRequestClose should be called on underlay tap');
		},

		'drag to close'() {
			let called = false;

			const h = harness(() =>
				w(SlidePane, {
					open: true,
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger('@underlay', 'onmousedown', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});
			h.trigger('@underlay', 'onmousemove', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});
			h.trigger('@underlay', 'onmouseup', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});

			assert.isTrue(called, 'onRequestClose should be called if dragged far enough');
		},

		'swipe to close'() {
			let called = false;

			const h = harness(() =>
				w(SlidePane, {
					open: true,
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger('@underlay', 'ontouchmove', {
				changedTouches: [{ screenX: 150 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchstart', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchmove', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchend', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});

			assert.isTrue(called, 'onRequestClose should be called if swiped far enough');
		},

		'swipe to close top'() {
			let called = false;

			const h = harness(() =>
				w(SlidePane, {
					open: true,
					align: Align.top,
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger('@underlay', 'ontouchmove', {
				changedTouches: [{ screenY: 150 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchstart', {
				changedTouches: [{ screenY: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchmove', {
				changedTouches: [{ screenY: 150 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchend', {
				changedTouches: [{ screenY: 50 }],
				...stubEvent
			});

			assert.isTrue(called, 'onRequestClose should be called if swiped far enough up');
		},

		'swipe to close right'() {
			let called = false;

			const h = harness(() =>
				w(SlidePane, {
					align: Align.right,
					open: true,
					width: 320,
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger('@underlay', 'ontouchstart', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchmove', {
				changedTouches: [{ screenX: 400 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchend', {
				changedTouches: [{ screenX: 500 }],
				...stubEvent
			});

			assert.isTrue(
				called,
				'onRequestClose should be called if swiped far enough to close right'
			);
		},

		'swipe to close bottom'() {
			let called = false;

			const h = harness(() =>
				w(SlidePane, {
					align: Align.bottom,
					open: true,
					width: 320,
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger('@underlay', 'ontouchstart', {
				changedTouches: [{ screenY: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchmove', {
				changedTouches: [{ screenY: 400 }],
				...stubEvent
			});

			h.trigger('@underlay', 'ontouchend', {
				changedTouches: [{ screenY: 500 }],
				...stubEvent
			});

			assert.isTrue(
				called,
				'onRequestClose should be called if swiped far enough to close bottom'
			);
		},

		'not dragged far enough to close'() {
			let called = false;

			const h = harness(() =>
				w(SlidePane, {
					open: true,
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger(`.${css.root}`, 'onmousedown', {
				pageX: 300,
				...stubEvent
			});

			h.trigger(`.${css.root}`, 'onmousemove', {
				pageX: 250,
				...stubEvent
			});

			h.trigger(`.${css.root}`, 'onmouseup', {
				pageX: 250,
				...stubEvent
			});

			assert.isFalse(
				called,
				'onRequestClose should not be called if not swiped far enough to close'
			);
		},

		'classes removed after transition'() {
			function expected(open: boolean, transitionDone?: boolean) {
				return v(
					'div',
					{
						'aria-labelledby': '',
						onmousedown: noop,
						onmousemove: noop,
						onmouseup: noop,
						ontouchend: noop,
						ontouchmove: noop,
						ontouchstart: noop,
						classes: css.root
					},
					[
						open
							? v('div', {
									classes: [null, fixedCss.underlay],
									enterAnimation: animations.fadeIn,
									exitAnimation: animations.fadeOut,
									onmouseup: noop,
									ontouchend: noop,
									key: 'underlay'
							  })
							: null,
						v(
							'div',
							{
								key: 'content',
								classes: [
									css.pane,
									css.left,
									open ? css.open : null,
									transitionDone ? null : open ? css.slideIn : null,
									transitionDone ? null : open ? null : css.slideOut,
									fixedCss.paneFixed,
									open ? fixedCss.openFixed : null,
									fixedCss.leftFixed,
									transitionDone ? null : open ? fixedCss.slideInFixed : null,
									transitionDone ? null : open ? null : fixedCss.slideOutFixed
								],
								transitionend: noop,
								styles: {
									transform: undefined,
									width: '320px',
									height: undefined
								}
							},
							[
								null,
								v(
									'div',
									{
										classes: [css.content, fixedCss.contentFixed]
									},
									[GREEKING]
								)
							]
						)
					]
				);
			}
			let properties = {
				open: true
			};
			const h = harness(() => w(SlidePane, properties, [GREEKING]));
			h.expect(() => expected(true, false), () => h.getRender());
			h.trigger('@content', 'transitionend');
			h.expect(() => expected(true, true));
			properties.open = false;
			h.expect(() => expected(false, false));

			h.trigger('@content', 'transitionend');
			h.expect(() => expected(false, true));
		},

		'transform styles are applied on next render if being swiped closed'() {
			let properties: SlidePaneProperties = {
				open: true
			};
			properties.onRequestClose = () => (properties.open = false);

			const h = harness(() => w(SlidePane, properties, [GREEKING]));
			h.expect(
				openTemplate.setProperty('@content', 'classes', [
					css.pane,
					css.left,
					css.open,
					css.slideIn,
					null,
					fixedCss.paneFixed,
					fixedCss.openFixed,
					fixedCss.leftFixed,
					fixedCss.slideInFixed,
					null
				]),
				() => h.getRender()
			);

			h.trigger(`.${css.root}`, 'onmousedown', { pageX: 300, ...stubEvent });
			h.trigger(`.${css.root}`, 'onmousemove', { pageX: 150, ...stubEvent });

			h.expect(
				openTemplate.setProperty('@content', 'styles', {
					transform: 'translateX(-46.875%)',
					width: '320px',
					height: undefined
				})
			);

			h.trigger(`.${css.root}`, 'onmouseup', { pageX: 50, ...stubEvent });
			assert(!properties.open);
			h.expect(
				closedTemplate.setProperty('@content', 'classes', [
					css.pane,
					css.left,
					null,
					null,
					css.slideOut,
					fixedCss.paneFixed,
					null,
					fixedCss.leftFixed,
					null,
					fixedCss.slideOutFixed
				])
			);

			// Next render does not have the slide styles
			h.expect(closedTemplate);
		},

		'transform styles are applied on next render if being swiped closed right'() {
			let properties: SlidePaneProperties = {
				align: Align.right,
				open: true
			};
			properties.onRequestClose = () => (properties.open = false);

			const h = harness(() => w(SlidePane, properties, [GREEKING]));
			h.expect(
				openTemplateRight.setProperty('@content', 'classes', [
					css.pane,
					css.right,
					css.open,
					css.slideIn,
					null,
					fixedCss.paneFixed,
					fixedCss.openFixed,
					fixedCss.rightFixed,
					fixedCss.slideInFixed,
					null
				]),
				() => h.getRender()
			);

			h.trigger(`.${css.root}`, 'onmousedown', { pageX: 300, ...stubEvent });
			h.trigger(`.${css.root}`, 'onmousemove', { pageX: 400, ...stubEvent });

			h.expect(
				openTemplateRight
					.setProperty('@content', 'classes', [
						css.pane,
						css.right,
						css.open,
						null,
						null,
						fixedCss.paneFixed,
						fixedCss.openFixed,
						fixedCss.rightFixed,
						null,
						null
					])
					.setProperty('@content', 'styles', {
						transform: 'translateX(31.25%)',
						width: '320px',
						height: undefined
					})
			);

			h.trigger(`.${css.root}`, 'onmouseup', { pageX: 500, ...stubEvent });

			h.expect(
				closedTemplateRight.setProperty('@content', 'classes', [
					css.pane,
					css.right,
					null,
					null,
					css.slideOut,
					fixedCss.paneFixed,
					null,
					fixedCss.rightFixed,
					null,
					fixedCss.slideOutFixed
				])
			);
			assert(!properties.open);

			// Next render does not have the slide styles
			h.expect(closedTemplateRight);
		}
	}
});
