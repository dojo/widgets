const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';
import { v, w } from '@dojo/framework/widget-core/d';

import Label from '../../../label/index';
import RangeSlider from '../../index';
import * as css from '../../../theme/range-slider.m.css';
import * as fixedCss from '../../styles/range-slider.m.css';
import Focus from '@dojo/framework/widget-core/meta/Focus';
import {
	compareId,
	compareForId,
	createHarness,
	MockMetaMixin,
	stubEvent, compareAriaDescribedBy, compareWidgetId, compareAriaLabelledBy
} from '../../../common/tests/support/test-helpers';
import Dimensions from '@dojo/framework/widget-core/meta/Dimensions';

const compareFor = { selector: '*', property: 'for', comparator: (property: any) => typeof property === 'string' };
const harness = createHarness([compareId, compareForId, compareFor]);

const sliderProps = {
	'aria-invalid': null,
	'aria-readonly': null,
	'aria-describedby': 'mock-uuid',
	'aria-labelledby': '',
	type: 'range',
	min: '0',
	max: '100',
	step: '1',
	readonly: undefined,
	required: undefined,
	disabled: undefined,
	onblur: () => {},
	onclick: () => {},
	onfocus: () => {},
	onchange: () => {},
	oninput: () => {},
	onkeydown: () => {},
	onkeypress: () => {},
	onkeyup: () => {},
	onmousedown: () => {},
	onmouseup: () => {},
	ontouchstart: () => {},
	ontouchend: () => {},
	ontouchcancel: () => {},
	classes: [css.input, fixedCss.nativeInput]
};

registerSuite('RangeSlider', {
	tests: {
		'renders two sliders'() {
			const h = harness(() => w(RangeSlider, {}), [compareAriaDescribedBy, compareAriaLabelledBy]);
			h.expectPartial('@slider1', () => v('input', {
				...sliderProps,
				key: 'slider1',
				name: '_min',
				value: '0',
				styles: {
					clip: 'rect(auto, 0px, auto, auto)'
				}
			}));

			h.expectPartial('@slider2', () => v('input', {
				...sliderProps,
				key: 'slider2',
				name: '_max',
				value: '100',
				styles: {
					clip: 'rect(auto, auto, auto, 0px)'
				}
			}));
		},

		'renders two thumbs'() {
			const h = harness(() => w(RangeSlider, {}));
			h.expectPartial('@leftThumb', () => v('div', {
				key: 'leftThumb',
				classes: [css.thumb, css.leftThumb, undefined, fixedCss.thumbFixed],
				styles: {
					left: '0%'
				}
			}));
			h.expectPartial('@rightThumb', () => v('div', {
				key: 'rightThumb',
				classes: [css.thumb, css.rightThumb, undefined, fixedCss.thumbFixed],
				styles: {
					left: '100%'
				}
			}));
		},

		'renders a track'() {
			const h = harness(() => w(RangeSlider, {}));
			h.expectPartial('@track', () => v('div', {
				key: 'track',
				classes: [css.filled, fixedCss.filledFixed],
				styles: {
					left: '0%',
					width: '100%'
				}
			}));
		},

		'name': {
			'uses a default name'() {
				const h = harness(() => w(RangeSlider, {
					name: 'test'
				}), [compareAriaDescribedBy, compareAriaLabelledBy]);
				h.expectPartial('@slider1', () => v('input', {
					...sliderProps,
					key: 'slider1',
					name: 'test_min',
					value: '0',
					styles: {
						clip: 'rect(auto, 0px, auto, auto)'
					}
				}));

				h.expectPartial('@slider2', () => v('input', {
					...sliderProps,
					key: 'slider2',
					name: 'test_max',
					value: '100',
					styles: {
						clip: 'rect(auto, auto, auto, 0px)'
					}
				}));
			},
			'uses custom names'() {
				const h = harness(() => w(RangeSlider, {
					minName: 'minValue',
					maxName: 'maxValue'
				}), [compareAriaDescribedBy, compareAriaLabelledBy]);
				h.expectPartial('@slider1', () => v('input', {
					...sliderProps,
					key: 'slider1',
					name: 'minValue',
					value: '0',
					styles: {
						clip: 'rect(auto, 0px, auto, auto)'
					}
				}));

				h.expectPartial('@slider2', () => v('input', {
					...sliderProps,
					key: 'slider2',
					name: 'maxValue',
					value: '100',
					styles: {
						clip: 'rect(auto, auto, auto, 0px)'
					}
				}));
			}
		},
		'disabled'() {
			const h = harness(() => w(RangeSlider, {
				disabled: true
			}), [compareAriaDescribedBy, compareAriaLabelledBy]);
			h.expectPartial('@slider1', () => v('input', {
				...sliderProps,
				key: 'slider1',
				disabled: true,
				name: '_min',
				value: '0',
				styles: {
					clip: 'rect(auto, 0px, auto, auto)'
				}
			}));

			h.expectPartial('@slider2', () => v('input', {
				...sliderProps,
				key: 'slider2',
				disabled: true,
				name: '_max',
				value: '100',
				styles: {
					clip: 'rect(auto, auto, auto, 0px)'
				}
			}));
		},
		'readonly'() {
			const h = harness(() => w(RangeSlider, {
				readOnly: true
			}), [compareAriaDescribedBy, compareAriaLabelledBy]);
			h.expectPartial('@slider1', () => v('input', {
				...sliderProps,
				'aria-readonly': 'true',
				key: 'slider1',
				readonly: true,
				name: '_min',
				value: '0',
				styles: {
					clip: 'rect(auto, 0px, auto, auto)'
				}
			}));

			h.expectPartial('@slider2', () => v('input', {
				...sliderProps,
				'aria-readonly': 'true',
				key: 'slider2',
				readonly: true,
				name: '_max',
				value: '100',
				styles: {
					clip: 'rect(auto, auto, auto, 0px)'
				}
			}));
		},
		'required'() {
			const h = harness(() => w(RangeSlider, {
				required: true
			}), [compareAriaDescribedBy, compareAriaLabelledBy]);
			h.expectPartial('@slider1', () => v('input', {
				...sliderProps,
				key: 'slider1',
				required: true,
				name: '_min',
				value: '0',
				styles: {
					clip: 'rect(auto, 0px, auto, auto)'
				}
			}));

			h.expectPartial('@slider2', () => v('input', {
				...sliderProps,
				key: 'slider2',
				required: true,
				name: '_max',
				value: '100',
				styles: {
					clip: 'rect(auto, auto, auto, 0px)'
				}
			}));
		},
		'invalid'() {
			const h = harness(() => w(RangeSlider, {
				invalid: true
			}), [compareAriaDescribedBy, compareAriaLabelledBy]);
			h.expectPartial('@slider1', () => v('input', {
				...sliderProps,
				'aria-invalid': 'true',
				key: 'slider1',
				name: '_min',
				value: '0',
				styles: {
					clip: 'rect(auto, 0px, auto, auto)'
				}
			}));

			h.expectPartial('@slider2', () => v('input', {
				...sliderProps,
				'aria-invalid': 'true',
				key: 'slider2',
				name: '_max',
				value: '100',
				styles: {
					clip: 'rect(auto, auto, auto, 0px)'
				}
			}));
		},
		'slider values'() {
			const h = harness(() => w(RangeSlider, {
				min: 25,
				max: 50,
				minValue: 25,
				maxValue: 50,
				step: 5
			}), [compareAriaDescribedBy, compareAriaLabelledBy]);

			h.expectPartial('@slider1', () => v('input', {
				...sliderProps,
				key: 'slider1',
				name: '_min',
				value: '25',
				min: '25',
				max: '50',
				step: '5',
				styles: {
					clip: 'rect(auto, 0px, auto, auto)'
				}
			}));

			h.expectPartial('@slider2', () => v('input', {
				...sliderProps,
				key: 'slider2',
				name: '_max',
				value: '50',
				min: '25',
				max: '50',
				step: '5',
				styles: {
					clip: 'rect(auto, auto, auto, 0px)'
				}
			}));
		},
		'events': {
			'onChange'() {
				const onChange = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onChange
				}));

				h.trigger('@slider1', 'onchange', {
					stopPropagation: sinon.stub(),
					target: {
						value: '25'
					}
				});

				assert(onChange.calledWith(25, 100));

				h.trigger('@slider2', 'onchange', {
					stopPropagation: sinon.stub(),
					target: {
						value: '50'
					}
				});

				assert(onChange.calledWith(0, 50));
			},
			'onInput'() {
				const onInput = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onInput
				}));

				h.trigger('@slider1', 'oninput', {
					stopPropagation: sinon.stub(),
					target: {
						value: '25'
					}
				});

				assert(onInput.calledWith(25, 100));

				h.trigger('@slider2', 'oninput', {
					stopPropagation: sinon.stub(),
					target: {
						value: '50'
					}
				});

				assert(onInput.calledWith(0, 50));
			},

			'onBlur'() {
				const onBlur = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onBlur
				}));

				h.trigger('@slider1', 'onblur', {
					stopPropagation: sinon.stub(),
					target: {
						value: '25'
					}
				});

				assert(onBlur.calledWith(25, 100));

				h.trigger('@slider2', 'onblur', {
					stopPropagation: sinon.stub(),
					target: {
						value: '50'
					}
				});

				assert(onBlur.calledWith(0, 50));
			},
			'onFocus'() {
				const onFocus = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onFocus
				}));

				h.trigger('@slider1', 'onfocus', {
					stopPropagation: sinon.stub(),
					target: {
						value: '25'
					}
				});

				assert(onFocus.calledWith(25, 100));

				h.trigger('@slider2', 'onfocus', {
					stopPropagation: sinon.stub(),
					target: {
						value: '50'
					}
				});

				assert(onFocus.calledWith(0, 50));
			},
			'onClick'() {
				const onClick = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onClick
				}));

				h.trigger('@slider1', 'onclick', {
					stopPropagation: sinon.stub(),
					target: {
						value: '25'
					}
				});

				assert(onClick.calledWith(25, 100));

				h.trigger('@slider2', 'onclick', {
					stopPropagation: sinon.stub(),
					target: {
						value: '50'
					}
				});

				assert(onClick.calledWith(0, 50));
			},
			'onKeyDown'() {
				const onKeyDown = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onKeyDown
				}));

				h.trigger('@slider1', 'onkeydown', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onKeyDown.calledOnce);

				h.trigger('@slider2', 'onkeydown', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onKeyDown.calledTwice);
			},

			'onKeyUp'() {
				const onKeyUp = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onKeyUp
				}));

				h.trigger('@slider1', 'onkeyup', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onKeyUp.calledOnce);

				h.trigger('@slider2', 'onkeyup', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onKeyUp.calledTwice);
			},

			'onKeyPress'() {
				const onKeyPress = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onKeyPress
				}));

				h.trigger('@slider1', 'onkeypress', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onKeyPress.calledOnce);

				h.trigger('@slider2', 'onkeypress', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onKeyPress.calledTwice);
			},

			'onMouseDown'() {
				const onMouseDown = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onMouseDown
				}));

				h.trigger('@slider1', 'onmousedown', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onMouseDown.calledOnce);

				h.trigger('@slider2', 'onmousedown', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onMouseDown.calledTwice);
			},

			'onMouseUp'() {
				const onMouseUp = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onMouseUp
				}));

				h.trigger('@slider1', 'onmouseup', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onMouseUp.calledOnce);

				h.trigger('@slider2', 'onmouseup', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onMouseUp.calledTwice);
			},

			'onTouchStart'() {
				const onTouchStart = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onTouchStart
				}));

				h.trigger('@slider1', 'ontouchstart', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onTouchStart.calledOnce);

				h.trigger('@slider2', 'ontouchstart', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onTouchStart.calledTwice);
			},

			'onTouchEnd'() {
				const onTouchEnd = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onTouchEnd
				}));

				h.trigger('@slider1', 'ontouchend', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onTouchEnd.calledOnce);

				h.trigger('@slider2', 'ontouchend', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onTouchEnd.calledTwice);
			},

			'onTouchCancel'() {
				const onTouchCancel = sinon.stub();

				const h = harness(() => w(RangeSlider, {
					onTouchCancel
				}));

				h.trigger('@slider1', 'ontouchcancel', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onTouchCancel.calledOnce);

				h.trigger('@slider2', 'ontouchcancel', {
					preventDefault: sinon.stub(),
					stopPropagation: sinon.stub()
				});

				assert(onTouchCancel.calledTwice);
			},

			'does not error on missing events'() {
				const h = harness(() => w(RangeSlider, {}));

				[
					'onblur',
					'onclick',
					'onfocus',
					'onchange',
					'oninput',
					'onkeydown',
					'onkeypress',
					'onkeyup',
					'onmousedown',
					'onmouseup',
					'ontouchstart',
					'ontouchend',
					'ontouchcancel'
				].forEach(key => {
					h.trigger('@slider1', key, stubEvent);
					h.trigger('@slider2', key, stubEvent);
				});
			}
		},
		'label': {
			'plain label'() {
				const h = harness(() => w(RangeSlider, {
					label: 'Test'
				}), [compareWidgetId]);

				h.expectPartial('@label', () => w(Label, {
					key: 'label',
					theme: undefined,
					disabled: undefined,
					focused: false,
					invalid: undefined,
					readOnly: undefined,
					required: undefined,
					hidden: undefined,
					widgetId: ''
				}, ['Test']));
			},

			'disabled/required/readonly label'() {
				const h = harness(() => w(RangeSlider, {
					label: 'Test',
					disabled: true,
					required: true,
					readOnly: true
				}), [compareWidgetId]);

				h.expectPartial('@label', () => w(Label, {
					key: 'label',
					theme: undefined,
					disabled: true,
					focused: false,
					invalid: undefined,
					readOnly: true,
					required: true,
					hidden: undefined,
					widgetId: ''
				}, ['Test']));
			}
		},

		'focus': {
			'detects focus'() {
				const mockMeta = sinon.stub();
				const mockFocusGet = sinon.stub().returns({
					active: true,
					containsFocus: true
				});
				const mockDimensionsGet = sinon.stub().returns({
					client: {
						width: 100
					}
				});
				mockMeta.withArgs(Focus).returns({
					get: mockFocusGet
				});
				mockMeta.withArgs(Dimensions).returns({
					get: mockDimensionsGet
				});

				const h = harness(() => w(MockMetaMixin(RangeSlider, mockMeta), {
					label: 'Test'
				}), [compareWidgetId]);
				h.expectPartial('@label', () => w(Label, {
					key: 'label',
					theme: undefined,
					disabled: undefined,
					focused: true,
					invalid: undefined,
					readOnly: undefined,
					required: undefined,
					hidden: undefined,
					widgetId: ''
				}, ['Test']));

				h.expectPartial('@leftThumb', () => v('div', {
					key: 'leftThumb',
					classes: [css.thumb, css.leftThumb, css.focused, fixedCss.thumbFixed],
					styles: {
						left: '0%'
					}
				}));

				h.expectPartial('@rightThumb', () => v('div', {
					key: 'rightThumb',
					classes: [css.thumb, css.rightThumb, css.focused, fixedCss.thumbFixed],
					styles: {
						left: '100%'
					}
				}));
			}
		}
	}
});
