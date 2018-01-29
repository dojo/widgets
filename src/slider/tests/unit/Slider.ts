const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';
import { v, w } from '@dojo/widget-core/d';
import harness from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import Slider from '../../Slider';
import * as css from '../../../theme/slider/slider.m.css';
import * as fixedCss from '../../styles/slider.m.css';
import { WNode } from '@dojo/widget-core/interfaces';

const compareId = { selector: '*', property: 'id', comparator: (property: any) => typeof property === 'string' };
const compareForId = { selector: '*', property: 'forId', comparator: (property: any) => typeof property === 'string' };
const compareFor = { selector: '*', property: 'for', comparator: (property: any) => typeof property === 'string' };
const noop: any = () => {};
const createHarnessWithCompare = (renderFunction: () => WNode) => {
	return harness(renderFunction, [ compareId, compareForId, compareFor ]);
};

const expected = function(label = false, tooltip = false, overrides = {}, child = '0', progress = '0%') {

	return v('div', {
		key: 'root',
		classes: [ css.root, null, null, null, null, null, null, fixedCss.rootFixed ]
	}, [
		label ? w(Label, {
			theme: undefined,
			disabled: undefined,
			hidden: undefined,
			invalid: undefined,
			readOnly: undefined,
			required: undefined,
			forId: ''
		}, [ 'foo' ]) : null,
		v('div', {
			classes: [ css.inputWrapper, fixedCss.inputWrapperFixed ],
			styles: {}
		}, [
			v('input', {
				key: 'input',
				classes: [ css.input, fixedCss.nativeInput ],
				disabled: undefined,
				id: '',
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
				onchange: noop,
				onclick: noop,
				onfocus: noop,
				oninput: noop,
				onkeydown: noop,
				onkeypress: noop,
				onkeyup: noop,
				onmousedown: noop,
				onmouseup: noop,
				ontouchstart: noop,
				ontouchend: noop,
				ontouchcancel: noop,
				...overrides
			}),
			v('div', {
				classes: [ css.track, fixedCss.trackFixed ],
				'aria-hidden': 'true',
				styles: {}
			}, [
				v('span', {
					classes: [ css.fill, fixedCss.fillFixed ],
					styles: { width: progress }
				}),
				v('span', {
					classes: [ css.thumb, fixedCss.thumbFixed ],
					styles: { left: progress }
				})
			]),
			v('output', {
				classes: [ css.output, tooltip ? fixedCss.outputTooltip : null ],
				for: '',
				styles: progress !== '0%' ? { left: progress } : {}
			}, [ child ])
		])
	]);
};

registerSuite('Slider', {

	tests: {
		'default properties'() {
			const h = createHarnessWithCompare(() => w(Slider, {}));
			h.expect(expected);
		},

		'custom properties'() {
			const h = createHarnessWithCompare(() => w(Slider, {
				aria: { describedBy: 'foo' },
				id: 'foo',
				max: 60,
				min: 10,
				name: 'bar',
				output: () => 'tribbles',
				outputIsTooltip: true,
				step: 5,
				value: 35
			}));

			h.expect(() => expected(false, true, {
				'aria-describedby': 'foo',
				id: 'foo',
				max: '60',
				min: '10',
				name: 'bar',
				step: '5',
				value: '35'
			}, 'tribbles', '50%'));
		},

		'vertical slider': {
			'default properties'() {
				const h = createHarnessWithCompare(() => w(Slider, {
					vertical: true
				}));

				h.expect(() => v('div', {
					key: 'root',
					classes: [ css.root, null, null, null, null, null, css.vertical, fixedCss.rootFixed ]
				}, [
					null,
					v('div', {
						classes: [ css.inputWrapper, fixedCss.inputWrapperFixed ],
						styles: {
							height: '200px'
						}
					}, [
						v('input', {
							key: 'input',
							classes: [ css.input, fixedCss.nativeInput ],
							disabled: undefined,
							id: '',
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
							onchange: noop,
							onclick: noop,
							onfocus: noop,
							oninput: noop,
							onkeydown: noop,
							onkeypress: noop,
							onkeyup: noop,
							onmousedown: noop,
							onmouseup: noop,
							ontouchstart: noop,
							ontouchend: noop,
							ontouchcancel: noop
						}),
						v('div', {
							classes: [ css.track, fixedCss.trackFixed ],
							'aria-hidden': 'true',
							styles: {
								width: '200px'
							}
						}, [
							v('span', {
								classes: [ css.fill, fixedCss.fillFixed ],
								styles: { width: '0%' }
							}),
							v('span', {
								classes: [ css.thumb, fixedCss.thumbFixed ],
								styles: { left: '0%' }
							})
						]),
						v('output', {
							classes: [ css.output, null ],
							for: '',
							styles: {}
						}, [ '0' ])
					])
				]));
			},

			'custom properties'() {
				const h = createHarnessWithCompare(() => w(Slider, {
					max: 10,
					min: 5,
					outputIsTooltip: true,
					value: 6,
					vertical: true,
					verticalHeight: '100px'
				}));

				h.expect(() => v('div', {
					key: 'root',
					classes: [ css.root, null, null, null, null, null, css.vertical, fixedCss.rootFixed ]
				}, [
					null,
					v('div', {
						classes: [ css.inputWrapper, fixedCss.inputWrapperFixed ],
						styles: {
							height: '100px'
						}
					}, [
						v('input', {
							key: 'input',
							classes: [ css.input, fixedCss.nativeInput ],
							disabled: undefined,
							id: '',
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
							onchange: noop,
							onclick: noop,
							onfocus: noop,
							oninput: noop,
							onkeydown: noop,
							onkeypress: noop,
							onkeyup: noop,
							onmousedown: noop,
							onmouseup: noop,
							ontouchstart: noop,
							ontouchend: noop,
							ontouchcancel: noop
						}),
						v('div', {
							classes: [ css.track, fixedCss.trackFixed ],
							'aria-hidden': 'true',
							styles: {
								width: '100px'
							}
						}, [
							v('span', {
								classes: [ css.fill, fixedCss.fillFixed ],
								styles: { width: '20%' }
							}),
							v('span', {
								classes: [ css.thumb, fixedCss.thumbFixed ],
								styles: { left: '20%' }
							})
						]),
						v('output', {
							classes: [ css.output, fixedCss.outputTooltip ],
							for: '',
							styles: { top: '80%' }
						}, [ '6' ])
					])
				]));
			}
		},

		'max value should be respected'() {
			const h = createHarnessWithCompare(() => w(Slider, {
				max: 40,
				value: 100
			}));

			h.expect(() => v('div', {
				key: 'root',
				classes: [ css.root, null, null, null, null, null, null, fixedCss.rootFixed ]
			}, [
				null,
				v('div', {
					classes: [ css.inputWrapper, fixedCss.inputWrapperFixed ],
					styles: {}
				}, [
					v('input', {
						key: 'input',
						classes: [ css.input, fixedCss.nativeInput ],
						disabled: undefined,
						id: '',
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
						onchange: noop,
						onclick: noop,
						onfocus: noop,
						oninput: noop,
						onkeydown: noop,
						onkeypress: noop,
						onkeyup: noop,
						onmousedown: noop,
						onmouseup: noop,
						ontouchstart: noop,
						ontouchend: noop,
						ontouchcancel: noop
					}),
					v('div', {
						classes: [ css.track, fixedCss.trackFixed ],
						'aria-hidden': 'true',
						styles: {}
					}, [
						v('span', {
							classes: [ css.fill, fixedCss.fillFixed ],
							styles: { width: '100%' }
						}),
						v('span', {
							classes: [ css.thumb, fixedCss.thumbFixed ],
							styles: { left: '100%' }
						})
					]),
					v('output', {
						classes: [ css.output, null ],
						for: '',
						styles: {}
					}, [ '40' ])
				])
			]));
		},

		'min value should be respected'() {
			const h = createHarnessWithCompare(() => w(Slider, {
				min: 30,
				value: 20
			}));

			h.expect(() => v('div', {
				key: 'root',
				classes: [ css.root, null, null, null, null, null, null, fixedCss.rootFixed ]
			}, [
				null,
				v('div', {
					classes: [ css.inputWrapper, fixedCss.inputWrapperFixed ],
					styles: {}
				}, [
					v('input', {
						key: 'input',
						classes: [ css.input, fixedCss.nativeInput ],
						disabled: undefined,
						id: '',
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
						onchange: noop,
						onclick: noop,
						onfocus: noop,
						oninput: noop,
						onkeydown: noop,
						onkeypress: noop,
						onkeyup: noop,
						onmousedown: noop,
						onmouseup: noop,
						ontouchstart: noop,
						ontouchend: noop,
						ontouchcancel: noop
					}),
					v('div', {
						classes: [ css.track, fixedCss.trackFixed ],
						'aria-hidden': 'true',
						styles: {}
					}, [
						v('span', {
							classes: [ css.fill, fixedCss.fillFixed ],
							styles: { width: '0%' }
						}),
						v('span', {
							classes: [ css.thumb, fixedCss.thumbFixed ],
							styles: { left: '0%' }
						})
					]),
					v('output', {
						classes: [ css.output, null ],
						for: '',
						styles: {}
					}, [ '30' ])
				])
			]));
		},

		'label'() {
			const h = createHarnessWithCompare(() => w(Slider, {
				label: 'foo'
			}));

			h.expect(() => expected(true));
		},

		'state classes'() {
			let properties = {
				invalid: true,
				disabled: true,
				readOnly: true,
				required: true
			};
			const h = createHarnessWithCompare(() => w(Slider, properties));

			h.expect(() => v('div', {
				key: 'root',
				classes: [ css.root, css.disabled, css.invalid, null, css.readonly, css.required, null, fixedCss.rootFixed ]
			}, [
				null,
				v('div', {
					classes: [ css.inputWrapper, fixedCss.inputWrapperFixed ],
					styles: {}
				}, [
					v('input', {
						disabled: true,
						'aria-invalid': 'true',
						readOnly: true,
						'aria-readonly': 'true',
						required: true,
						key: 'input',
						classes: [ css.input, fixedCss.nativeInput ],
						id: '',
						max: '100',
						min: '0',
						name: undefined,
						step: '1',
						styles: {},
						type: 'range',
						value: '0',
						onblur: noop,
						onchange: noop,
						onclick: noop,
						onfocus: noop,
						oninput: noop,
						onkeydown: noop,
						onkeypress: noop,
						onkeyup: noop,
						onmousedown: noop,
						onmouseup: noop,
						ontouchstart: noop,
						ontouchend: noop,
						ontouchcancel: noop
					}),
					v('div', {
						classes: [ css.track, fixedCss.trackFixed ],
						'aria-hidden': 'true',
						styles: {}
					}, [
						v('span', {
							classes: [ css.fill, fixedCss.fillFixed ],
							styles: { width: '0%' }
						}),
						v('span', {
							classes: [ css.thumb, fixedCss.thumbFixed ],
							styles: { left: '0%' }
						})
					]),
					v('output', {
						classes: [ css.output, null ],
						for: '',
						styles: {}
					}, [ '0' ])
				])
			]));

			properties = {
				invalid: false,
				disabled: false,
				readOnly: false,
				required: false
			};

			h.expect(() => v('div', {
				key: 'root',
				classes: [ css.root, null, null, css.valid, null, null, null, fixedCss.rootFixed ]
			}, [
				null,
				v('div', {
					classes: [ css.inputWrapper, fixedCss.inputWrapperFixed ],
					styles: {}
				}, [
					v('input', {
						disabled: false,
						'aria-invalid': null,
						readOnly: false,
						'aria-readonly': null,
						required: false,
						key: 'input',
						classes: [ css.input, fixedCss.nativeInput ],
						id: '',
						max: '100',
						min: '0',
						name: undefined,
						step: '1',
						styles: {},
						type: 'range',
						value: '0',
						onblur: noop,
						onchange: noop,
						onclick: noop,
						onfocus: noop,
						oninput: noop,
						onkeydown: noop,
						onkeypress: noop,
						onkeyup: noop,
						onmousedown: noop,
						onmouseup: noop,
						ontouchstart: noop,
						ontouchend: noop,
						ontouchcancel: noop
					}),
					v('div', {
						classes: [ css.track, fixedCss.trackFixed ],
						'aria-hidden': 'true',
						styles: {}
					}, [
						v('span', {
							classes: [ css.fill, fixedCss.fillFixed ],
							styles: { width: '0%' }
						}),
						v('span', {
							classes: [ css.thumb, fixedCss.thumbFixed ],
							styles: { left: '0%' }
						})
					]),
					v('output', {
						classes: [ css.output, null ],
						for: '',
						styles: {}
					}, [ '0' ])
				])
			]));
		},

		events() {
			const onBlur = sinon.stub();
			const onChange = sinon.stub();
			const onClick = sinon.stub();
			const onFocus = sinon.stub();
			const onInput = sinon.stub();
			const onKeyDown = sinon.stub();
			const onKeyPress = sinon.stub();
			const onKeyUp = sinon.stub();
			const onMouseDown = sinon.stub();
			const onMouseUp = sinon.stub();
			const onTouchStart = sinon.stub();
			const onTouchEnd = sinon.stub();
			const onTouchCancel = sinon.stub();

			const h = createHarnessWithCompare(() => w(Slider, {
				onBlur,
				onChange,
				onClick,
				onFocus,
				onInput,
				onKeyDown,
				onKeyPress,
				onKeyUp,
				onMouseDown,
				onMouseUp,
				onTouchStart,
				onTouchEnd,
				onTouchCancel
			}));

			h.trigger('@input', 'onblur');
			assert.isTrue(onBlur.called, 'onBlur called');

			h.trigger('@input', 'onchange');
			assert.isTrue(onChange.called, 'onChange called');

			h.trigger('@input', 'onclick');
			assert.isTrue(onClick.called, 'onClick called');

			h.trigger('@input', 'onfocus');
			assert.isTrue(onFocus.called, 'onFocus called');

			h.trigger('@input', 'oninput');
			assert.isTrue(onInput.called, 'onInput called');

			h.trigger('@input', 'onkeydown');
			assert.isTrue(onKeyDown.called, 'onKeyDown called');

			h.trigger('@input', 'onkeypress');
			assert.isTrue(onKeyPress.called, 'onKeyPress called');

			h.trigger('@input', 'onkeyup');
			assert.isTrue(onKeyUp.called, 'onKeyUp called');

			h.trigger('@input', 'onmousedown');
			assert.isTrue(onMouseDown.called, 'onMouseDown called');

			h.trigger('@input', 'onmouseup');
			assert.isTrue(onMouseUp.called, 'onMouseUp called');

			h.trigger('@input', 'ontouchstart');
			assert.isTrue(onTouchStart.called, 'onTouchStart called');

			h.trigger('@input', 'ontouchend');
			assert.isTrue(onTouchEnd.called, 'onTouchEnd called');

			h.trigger('@input', 'ontouchcancel');
			assert.isTrue(onTouchCancel.called, 'onTouchCancel called');
		}
	}
});
