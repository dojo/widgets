const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';
import { v, w } from '@dojo/framework/core/vdom';
import Focus from '../../../meta/Focus';

import Label from '../../../label/index';
import Slider from '../../index';
import * as css from '../../../theme/slider.m.css';
import * as fixedCss from '../../styles/slider.m.css';
import {
	compareId,
	compareForId,
	createHarness,
	MockMetaMixin,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';

const compareFor = {
	selector: '*',
	property: 'for',
	comparator: (property: any) => typeof property === 'string'
};
const harness = createHarness([compareId, compareForId, compareFor]);

const expected = function(
	label = false,
	tooltip = false,
	overrides = {},
	child = '0',
	progress = '0%',
	focused = false,
	showOutput = true
) {
	return v(
		'div',
		{
			key: 'root',
			classes: [
				css.root,
				null,
				focused ? css.focused : null,
				null,
				null,
				null,
				null,
				null,
				fixedCss.rootFixed
			]
		},
		[
			label
				? w(
						Label,
						{
							theme: undefined,
							classes: undefined,
							disabled: undefined,
							focused,
							hidden: undefined,
							valid: undefined,
							readOnly: undefined,
							required: undefined,
							forId: ''
						},
						['foo']
				  )
				: null,
			v(
				'div',
				{
					classes: [css.inputWrapper, fixedCss.inputWrapperFixed],
					styles: {}
				},
				[
					v('input', {
						key: 'input',
						classes: [css.input, fixedCss.nativeInput],
						disabled: undefined,
						id: '',
						focus: noop,
						'aria-invalid': null,
						max: '100',
						min: '0',
						name: undefined,
						readOnly: undefined,
						'aria-readonly': null,
						required: undefined,
						step: '1',
						styles: {},
						type: 'range',
						value: '0',
						onblur: noop,
						onfocus: noop,
						oninput: noop,
						onpointerenter: noop,
						onpointerleave: noop,
						...overrides
					}),
					v(
						'div',
						{
							classes: [css.track, fixedCss.trackFixed],
							'aria-hidden': 'true',
							styles: {}
						},
						[
							v('span', {
								classes: [css.fill, fixedCss.fillFixed],
								styles: { width: progress }
							}),
							v('span', {
								classes: [css.thumb, fixedCss.thumbFixed],
								styles: { left: progress }
							})
						]
					),
					showOutput
						? v(
								'output',
								{
									classes: [css.output, tooltip ? css.outputTooltip : null],
									for: '',
									tabIndex: -1,
									styles: progress !== '0%' ? { left: progress } : {}
								},
								[child]
						  )
						: null
				]
			)
		]
	);
};

registerSuite('Slider', {
	tests: {
		'default properties'() {
			const h = harness(() => w(Slider, {}));
			h.expect(expected);
		},

		'custom properties'() {
			const h = harness(() =>
				w(Slider, {
					aria: { describedBy: 'foo' },
					widgetId: 'foo',
					max: 60,
					min: 10,
					name: 'bar',
					output: () => 'tribbles',
					outputIsTooltip: true,
					step: 5,
					value: 35
				})
			);

			h.expect(() =>
				expected(
					false,
					true,
					{
						'aria-describedby': 'foo',
						id: 'foo',
						max: '60',
						min: '10',
						name: 'bar',
						step: '5',
						value: '35'
					},
					'tribbles',
					'50%'
				)
			);
		},

		'with showOutput false'() {
			const h = harness(() =>
				w(Slider, {
					showOutput: false
				})
			);
			h.expect(() =>
				expected(undefined, undefined, {}, undefined, undefined, undefined, false)
			);
		},

		'focussed class'() {
			const mockMeta = sinon.stub();
			const mockFocusGet = sinon.stub().returns({
				active: false,
				containsFocus: true
			});
			mockMeta.withArgs(Focus).returns({
				get: mockFocusGet
			});
			const h = harness(() => w(MockMetaMixin(Slider, mockMeta), {}));
			h.expect(() => expected(false, false, {}, '0', '0%', true));
		},

		'vertical slider': {
			'default properties'() {
				const h = harness(() =>
					w(Slider, {
						vertical: true
					})
				);

				h.expect(() =>
					v(
						'div',
						{
							key: 'root',
							classes: [
								css.root,
								null,
								null,
								null,
								null,
								null,
								null,
								css.vertical,
								fixedCss.rootFixed
							]
						},
						[
							null,
							v(
								'div',
								{
									classes: [css.inputWrapper, fixedCss.inputWrapperFixed],
									styles: {
										height: '200px'
									}
								},
								[
									v('input', {
										key: 'input',
										classes: [css.input, fixedCss.nativeInput],
										disabled: undefined,
										id: '',
										focus: noop,
										'aria-invalid': null,
										max: '100',
										min: '0',
										name: undefined,
										readOnly: undefined,
										'aria-readonly': null,
										required: undefined,
										step: '1',
										styles: {
											width: '200px'
										},
										type: 'range',
										value: '0',
										onblur: noop,
										onfocus: noop,
										oninput: noop,
										onpointerenter: noop,
										onpointerleave: noop
									}),
									v(
										'div',
										{
											classes: [css.track, fixedCss.trackFixed],
											'aria-hidden': 'true',
											styles: {
												width: '200px'
											}
										},
										[
											v('span', {
												classes: [css.fill, fixedCss.fillFixed],
												styles: { width: '0%' }
											}),
											v('span', {
												classes: [css.thumb, fixedCss.thumbFixed],
												styles: { left: '0%' }
											})
										]
									),
									v(
										'output',
										{
											classes: [css.output, null],
											for: '',
											styles: {},
											tabIndex: -1
										},
										['0']
									)
								]
							)
						]
					)
				);
			},

			'custom properties'() {
				const h = harness(() =>
					w(Slider, {
						max: 10,
						min: 5,
						outputIsTooltip: true,
						value: 6,
						vertical: true,
						verticalHeight: '100px'
					})
				);

				h.expect(() =>
					v(
						'div',
						{
							key: 'root',
							classes: [
								css.root,
								null,
								null,
								null,
								null,
								null,
								null,
								css.vertical,
								fixedCss.rootFixed
							]
						},
						[
							null,
							v(
								'div',
								{
									classes: [css.inputWrapper, fixedCss.inputWrapperFixed],
									styles: {
										height: '100px'
									}
								},
								[
									v('input', {
										key: 'input',
										classes: [css.input, fixedCss.nativeInput],
										disabled: undefined,
										id: '',
										focus: noop,
										'aria-invalid': null,
										max: '10',
										min: '5',
										name: undefined,
										readOnly: undefined,
										'aria-readonly': null,
										required: undefined,
										step: '1',
										styles: { width: '100px' },
										type: 'range',
										value: '6',
										onblur: noop,
										onfocus: noop,
										oninput: noop,
										onpointerenter: noop,
										onpointerleave: noop
									}),
									v(
										'div',
										{
											classes: [css.track, fixedCss.trackFixed],
											'aria-hidden': 'true',
											styles: {
												width: '100px'
											}
										},
										[
											v('span', {
												classes: [css.fill, fixedCss.fillFixed],
												styles: { width: '20%' }
											}),
											v('span', {
												classes: [css.thumb, fixedCss.thumbFixed],
												styles: { left: '20%' }
											})
										]
									),
									v(
										'output',
										{
											classes: [css.output, css.outputTooltip],
											for: '',
											styles: { top: '80%' },
											tabIndex: -1
										},
										['6']
									)
								]
							)
						]
					)
				);
			}
		},

		'max value should be respected'() {
			const h = harness(() =>
				w(Slider, {
					max: 40,
					value: 100
				})
			);

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [
							css.root,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							fixedCss.rootFixed
						]
					},
					[
						null,
						v(
							'div',
							{
								classes: [css.inputWrapper, fixedCss.inputWrapperFixed],
								styles: {}
							},
							[
								v('input', {
									key: 'input',
									classes: [css.input, fixedCss.nativeInput],
									disabled: undefined,
									id: '',
									focus: noop,
									'aria-invalid': null,
									max: '40',
									min: '0',
									name: undefined,
									readOnly: undefined,
									'aria-readonly': null,
									required: undefined,
									step: '1',
									styles: {},
									type: 'range',
									value: '40',
									onblur: noop,
									onfocus: noop,
									oninput: noop,
									onpointerenter: noop,
									onpointerleave: noop
								}),
								v(
									'div',
									{
										classes: [css.track, fixedCss.trackFixed],
										'aria-hidden': 'true',
										styles: {}
									},
									[
										v('span', {
											classes: [css.fill, fixedCss.fillFixed],
											styles: { width: '100%' }
										}),
										v('span', {
											classes: [css.thumb, fixedCss.thumbFixed],
											styles: { left: '100%' }
										})
									]
								),
								v(
									'output',
									{
										classes: [css.output, null],
										for: '',
										styles: {},
										tabIndex: -1
									},
									['40']
								)
							]
						)
					]
				)
			);
		},

		'min value should be respected'() {
			const h = harness(() =>
				w(Slider, {
					min: 30,
					value: 20
				})
			);

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [
							css.root,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							fixedCss.rootFixed
						]
					},
					[
						null,
						v(
							'div',
							{
								classes: [css.inputWrapper, fixedCss.inputWrapperFixed],
								styles: {}
							},
							[
								v('input', {
									key: 'input',
									classes: [css.input, fixedCss.nativeInput],
									disabled: undefined,
									id: '',
									focus: noop,
									'aria-invalid': null,
									max: '100',
									min: '30',
									name: undefined,
									readOnly: undefined,
									'aria-readonly': null,
									required: undefined,
									step: '1',
									styles: {},
									type: 'range',
									value: '30',
									onblur: noop,
									onfocus: noop,
									oninput: noop,
									onpointerenter: noop,
									onpointerleave: noop
								}),
								v(
									'div',
									{
										classes: [css.track, fixedCss.trackFixed],
										'aria-hidden': 'true',
										styles: {}
									},
									[
										v('span', {
											classes: [css.fill, fixedCss.fillFixed],
											styles: { width: '0%' }
										}),
										v('span', {
											classes: [css.thumb, fixedCss.thumbFixed],
											styles: { left: '0%' }
										})
									]
								),
								v(
									'output',
									{
										classes: [css.output, null],
										for: '',
										styles: {},
										tabIndex: -1
									},
									['30']
								)
							]
						)
					]
				)
			);
		},

		label() {
			const h = harness(() =>
				w(Slider, {
					label: 'foo'
				})
			);

			h.expect(() => expected(true));
		},

		'state classes'() {
			let properties = {
				valid: false,
				disabled: true,
				readOnly: true,
				required: true
			};
			const h = harness(() => w(Slider, properties));

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [
							css.root,
							css.disabled,
							null,
							css.invalid,
							null,
							css.readonly,
							css.required,
							null,
							fixedCss.rootFixed
						]
					},
					[
						null,
						v(
							'div',
							{
								classes: [css.inputWrapper, fixedCss.inputWrapperFixed],
								styles: {}
							},
							[
								v('input', {
									disabled: true,
									'aria-invalid': 'true',
									readOnly: true,
									'aria-readonly': 'true',
									required: true,
									key: 'input',
									classes: [css.input, fixedCss.nativeInput],
									id: '',
									focus: noop,
									max: '100',
									min: '0',
									name: undefined,
									step: '1',
									styles: {},
									type: 'range',
									value: '0',
									onblur: noop,
									onfocus: noop,
									oninput: noop,
									onpointerenter: noop,
									onpointerleave: noop
								}),
								v(
									'div',
									{
										classes: [css.track, fixedCss.trackFixed],
										'aria-hidden': 'true',
										styles: {}
									},
									[
										v('span', {
											classes: [css.fill, fixedCss.fillFixed],
											styles: { width: '0%' }
										}),
										v('span', {
											classes: [css.thumb, fixedCss.thumbFixed],
											styles: { left: '0%' }
										})
									]
								),
								v(
									'output',
									{
										classes: [css.output, null],
										for: '',
										styles: {},
										tabIndex: -1
									},
									['0']
								)
							]
						)
					]
				)
			);

			properties = {
				valid: true,
				disabled: false,
				readOnly: false,
				required: false
			};

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [
							css.root,
							null,
							null,
							null,
							css.valid,
							null,
							null,
							null,
							fixedCss.rootFixed
						]
					},
					[
						null,
						v(
							'div',
							{
								classes: [css.inputWrapper, fixedCss.inputWrapperFixed],
								styles: {}
							},
							[
								v('input', {
									disabled: false,
									'aria-invalid': null,
									readOnly: false,
									'aria-readonly': null,
									required: false,
									key: 'input',
									classes: [css.input, fixedCss.nativeInput],
									id: '',
									focus: noop,
									max: '100',
									min: '0',
									name: undefined,
									step: '1',
									styles: {},
									type: 'range',
									value: '0',
									onblur: noop,
									onfocus: noop,
									oninput: noop,
									onpointerenter: noop,
									onpointerleave: noop
								}),
								v(
									'div',
									{
										classes: [css.track, fixedCss.trackFixed],
										'aria-hidden': 'true',
										styles: {}
									},
									[
										v('span', {
											classes: [css.fill, fixedCss.fillFixed],
											styles: { width: '0%' }
										}),
										v('span', {
											classes: [css.thumb, fixedCss.thumbFixed],
											styles: { left: '0%' }
										})
									]
								),
								v(
									'output',
									{
										classes: [css.output, null],
										for: '',
										styles: {},
										tabIndex: -1
									},
									['0']
								)
							]
						)
					]
				)
			);
		},

		events() {
			const onBlur = sinon.stub();
			const onFocus = sinon.stub();
			const onValue = sinon.stub();

			const h = harness(() =>
				w(Slider, {
					onBlur,
					onFocus,
					onValue
				})
			);

			h.trigger('@input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');

			h.trigger('@input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');

			h.trigger('@input', 'oninput', stubEvent);
			assert.isTrue(onValue.called, 'onValue called');
		}
	}
});
