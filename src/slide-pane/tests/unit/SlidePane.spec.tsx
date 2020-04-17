const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { tsx, v, w } from '@dojo/framework/core/vdom';

import SlidePane, { SlidePaneProperties } from '../../index';
import * as css from '../../../theme/default/slide-pane.m.css';
import * as fixedCss from '../../styles/slide-pane.m.css';
import * as animations from '../../../common/styles/animations.m.css';
import {
	createHarness,
	compareId,
	compareAriaLabelledBy,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import { assertionTemplate } from '@dojo/framework/testing/harness/assertionTemplate';

const harness = createHarness([compareId, compareAriaLabelledBy]);

const GREEKING = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	Quisque id purus ipsum. Aenean ac purus purus.
	Nam sollicitudin varius augue, sed lacinia felis tempor in.`;

const closedTemplate = assertionTemplate(() => (
	<div
		aria-labelledby=""
		classes={[undefined, css.root]}
		onpointerup={noop}
		onpointerdown={noop}
		onpointermove={noop}
		onpointercancel={noop}
	>
		<div
			key="content"
			classes={[css.pane, css.left, null, null, null, fixedCss.paneFixed, fixedCss.leftFixed]}
			styles={{
				transform: undefined,
				width: '320px',
				height: undefined
			}}
		>
			<div assertion-key="textContent" classes={[css.content, fixedCss.contentFixed]}>
				{GREEKING}
			</div>
		</div>
	</div>
));
const closedTemplateRight = closedTemplate.setProperty('@content', 'classes', [
	css.pane,
	css.right,
	null,
	null,
	null,
	fixedCss.paneFixed,
	fixedCss.rightFixed
]);

const openTemplate = closedTemplate
	.insertBefore('@content', [
		v('div', {
			classes: [null, fixedCss.underlay],
			enterAnimation: animations.fadeIn,
			exitAnimation: animations.fadeOut,
			onpointerup: noop,
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
		fixedCss.leftFixed
	]);
const openTemplateRight = openTemplate.setProperty('@content', 'classes', [
	css.pane,
	css.right,
	css.open,
	null,
	null,
	fixedCss.paneFixed,
	fixedCss.rightFixed
]);

registerSuite('SlidePane', {
	tests: {
		'Should construct SlidePane with passed properties'() {
			const h = harness(() => (
				<SlidePane key="foo" align="left" aria={{ describedBy: 'foo' }} open underlay>
					{GREEKING}
				</SlidePane>
			));

			h.expect(() => (
				<div
					aria-labelledby=""
					classes={[undefined, css.root]}
					onpointerup={noop}
					onpointerdown={noop}
					onpointermove={noop}
					onpointercancel={noop}
				>
					<div
						classes={[css.underlayVisible, fixedCss.underlay]}
						enterAnimation={animations.fadeIn}
						exitAnimation={animations.fadeOut}
						onpointerup={noop}
						key="underlay"
					/>
					<div
						key="content"
						aria-describedby="foo"
						classes={[
							css.pane,
							css.left,
							css.open,
							css.slideIn,
							null,
							fixedCss.paneFixed,
							fixedCss.leftFixed
						]}
						styles={{
							transform: undefined,
							width: '320px',
							height: undefined
						}}
					>
						<div classes={[css.content, fixedCss.contentFixed]}>{GREEKING}</div>
					</div>
				</div>
			));
		},

		'Render correct children'() {
			const h = harness(() => <SlidePane key="foo" underlay={false} />);

			h.expect(closedTemplate.setChildren('~textContent', []));
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
						onpointerup: noop,
						onpointerdown: noop,
						onpointermove: noop,
						onpointercancel: noop,
						classes: [undefined, css.root]
					},
					[
						v('div', {
							classes: [null, fixedCss.underlay],
							enterAnimation: animations.fadeIn,
							exitAnimation: animations.fadeOut,
							onpointerup: noop,
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
									fixedCss.leftFixed
								],
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
						onpointerup: noop,
						onpointerdown: noop,
						onpointermove: noop,
						onpointercancel: noop,
						classes: [undefined, css.root]
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
									fixedCss.leftFixed
								],
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
			h.trigger('@underlay', 'onpointerdown', {
				pageX: 300,
				...stubEvent
			});
			h.trigger('@underlay', 'onpointerup', {
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

			h.trigger('@underlay', 'onpointerdown', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});
			h.trigger('@underlay', 'onpointerup', {
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

			h.trigger('@underlay', 'onpointerdown', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});
			h.trigger('@underlay', 'onpointerdown', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});
			h.trigger('@underlay', 'onpointerup', {
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

			h.trigger('@underlay', 'onpointermove', {
				changedTouches: [{ screenX: 150 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointerdown', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointermove', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointerup', {
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
					align: 'top',
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger('@underlay', 'onpointermove', {
				changedTouches: [{ screenY: 150 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointerdown', {
				changedTouches: [{ screenY: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointermove', {
				changedTouches: [{ screenY: 150 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointerup', {
				changedTouches: [{ screenY: 50 }],
				...stubEvent
			});

			assert.isTrue(called, 'onRequestClose should be called if swiped far enough up');
		},

		'swipe to close right'() {
			let called = false;

			const h = harness(() =>
				w(SlidePane, {
					align: 'right',
					open: true,
					width: 320,
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger('@underlay', 'onpointerdown', {
				changedTouches: [{ screenX: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointermove', {
				changedTouches: [{ screenX: 400 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointerup', {
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
					align: 'bottom',
					open: true,
					width: 320,
					onRequestClose() {
						called = true;
					}
				})
			);

			h.trigger('@underlay', 'onpointerdown', {
				changedTouches: [{ screenY: 300 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointermove', {
				changedTouches: [{ screenY: 400 }],
				...stubEvent
			});

			h.trigger('@underlay', 'onpointerup', {
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

			h.trigger(`.${css.root}`, 'onpointerdown', {
				pageX: 300,
				...stubEvent
			});

			h.trigger(`.${css.root}`, 'onpointermove', {
				pageX: 250,
				...stubEvent
			});

			h.trigger(`.${css.root}`, 'onpointerup', {
				pageX: 250,
				...stubEvent
			});

			assert.isFalse(
				called,
				'onRequestClose should not be called if not swiped far enough to close'
			);
		},

		'transform styles are applied on next render if being swiped closed'() {
			let properties: SlidePaneProperties = {
				open: true
			};
			properties.onRequestClose = () => (properties.open = false);

			const h = harness(() => <SlidePane {...properties}>{GREEKING}</SlidePane>);

			h.expect(
				openTemplate.setProperty('@content', 'classes', [
					css.pane,
					css.left,
					css.open,
					css.slideIn,
					null,
					fixedCss.paneFixed,
					fixedCss.leftFixed
				])
			);

			h.trigger(`.${css.root}`, 'onpointerdown', { pageX: 300, ...stubEvent });
			h.trigger(`.${css.root}`, 'onpointermove', { pageX: 150, ...stubEvent });

			h.expect(
				openTemplate.setProperty('@content', 'styles', {
					transform: 'translateX(-46.875%)',
					width: '320px',
					height: undefined
				})
			);

			h.trigger(`.${css.root}`, 'onpointerup', { pageX: 50, ...stubEvent });
			assert(!properties.open);
			h.expect(
				closedTemplate.setProperty('@content', 'classes', [
					css.pane,
					css.left,
					null,
					null,
					css.slideOut,
					fixedCss.paneFixed,
					fixedCss.leftFixed
				])
			);
		},

		'transform styles are applied on next render if being swiped closed right'() {
			let properties: SlidePaneProperties = {
				align: 'right',
				open: true
			};
			properties.onRequestClose = () => (properties.open = false);

			const h = harness(() => <SlidePane {...properties}>{GREEKING}</SlidePane>);
			h.expect(
				openTemplateRight.setProperty('@content', 'classes', [
					css.pane,
					css.right,
					css.open,
					css.slideIn,
					null,
					fixedCss.paneFixed,
					fixedCss.rightFixed
				])
			);

			h.trigger(`.${css.root}`, 'onpointerdown', { pageX: 300, ...stubEvent });
			h.trigger(`.${css.root}`, 'onpointermove', { pageX: 400, ...stubEvent });

			h.expect(
				openTemplateRight
					.setProperty('@content', 'classes', [
						css.pane,
						css.right,
						css.open,
						null,
						null,
						fixedCss.paneFixed,
						fixedCss.rightFixed
					])
					.setProperty('@content', 'styles', {
						transform: 'translateX(31.25%)',
						width: '320px',
						height: undefined
					})
			);

			h.trigger(`.${css.root}`, 'onpointerup', { pageX: 500, ...stubEvent });

			h.expect(
				closedTemplateRight.setProperty('@content', 'classes', [
					css.pane,
					css.right,
					null,
					null,
					css.slideOut,
					fixedCss.paneFixed,
					fixedCss.rightFixed
				])
			);
			assert(!properties.open);
		}
	}
});
