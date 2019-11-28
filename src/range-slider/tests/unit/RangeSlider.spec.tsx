const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';
import { v, w } from '@dojo/framework/core/vdom';

import Label from '../../../label/index';
import RangeSlider from '../../index';
import * as css from '../../../theme/default/range-slider.m.css';
import * as fixedCss from '../../styles/range-slider.m.css';
import Focus from '../../../meta/Focus';
import {
	compareId,
	compareForId,
	createHarness,
	MockMetaMixin,
	stubEvent,
	compareAriaDescribedBy,
	compareWidgetId,
	compareAriaLabelledBy
} from '../../../common/tests/support/test-helpers';
import Dimensions from '@dojo/framework/core/meta/Dimensions';

const compareFor = {
	selector: '*',
	property: 'for',
	comparator: (property: any) => typeof property === 'string'
};
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
	onfocus: () => {},
	oninput: () => {},
	classes: [css.input, fixedCss.nativeInput]
};

registerSuite('RangeSlider', {
	tests: {
		'renders two sliders'() {
			const h = harness(() => w(RangeSlider, {}), [
				compareAriaDescribedBy,
				compareAriaLabelledBy
			]);
			h.expectPartial('@slider1', () =>
				v('input', {
					...sliderProps,
					key: 'slider1',
					name: '_min',
					value: '0',
					styles: {
						clip: 'rect(auto, 0px, auto, auto)'
					}
				})
			);

			h.expectPartial('@slider2', () =>
				v('input', {
					...sliderProps,
					key: 'slider2',
					name: '_max',
					value: '100',
					styles: {
						clip: 'rect(auto, auto, auto, 0px)'
					}
				})
			);
		},

		'renders two thumbs'() {
			const h = harness(() => w(RangeSlider, {}));
			h.expectPartial('@leftThumb', () =>
				v('div', {
					key: 'leftThumb',
					classes: [css.thumb, css.leftThumb, undefined, fixedCss.thumbFixed],
					styles: {
						left: '0%'
					}
				})
			);
			h.expectPartial('@rightThumb', () =>
				v('div', {
					key: 'rightThumb',
					classes: [css.thumb, css.rightThumb, undefined, fixedCss.thumbFixed],
					styles: {
						left: '100%'
					}
				})
			);
		},

		'renders a track'() {
			const h = harness(() => w(RangeSlider, {}));
			h.expectPartial('@track', () =>
				v('div', {
					key: 'track',
					classes: [css.filled, fixedCss.filledFixed],
					styles: {
						left: '0%',
						width: '100%'
					}
				})
			);
		},

		name: {
			'uses a default name'() {
				const h = harness(
					() =>
						w(RangeSlider, {
							name: 'test'
						}),
					[compareAriaDescribedBy, compareAriaLabelledBy]
				);
				h.expectPartial('@slider1', () =>
					v('input', {
						...sliderProps,
						key: 'slider1',
						name: 'test_min',
						value: '0',
						styles: {
							clip: 'rect(auto, 0px, auto, auto)'
						}
					})
				);

				h.expectPartial('@slider2', () =>
					v('input', {
						...sliderProps,
						key: 'slider2',
						name: 'test_max',
						value: '100',
						styles: {
							clip: 'rect(auto, auto, auto, 0px)'
						}
					})
				);
			},
			'uses custom names'() {
				const h = harness(
					() =>
						w(RangeSlider, {
							minName: 'minValue',
							maxName: 'maxValue'
						}),
					[compareAriaDescribedBy, compareAriaLabelledBy]
				);
				h.expectPartial('@slider1', () =>
					v('input', {
						...sliderProps,
						key: 'slider1',
						name: 'minValue',
						value: '0',
						styles: {
							clip: 'rect(auto, 0px, auto, auto)'
						}
					})
				);

				h.expectPartial('@slider2', () =>
					v('input', {
						...sliderProps,
						key: 'slider2',
						name: 'maxValue',
						value: '100',
						styles: {
							clip: 'rect(auto, auto, auto, 0px)'
						}
					})
				);
			}
		},
		disabled() {
			const h = harness(
				() =>
					w(RangeSlider, {
						disabled: true
					}),
				[compareAriaDescribedBy, compareAriaLabelledBy]
			);
			h.expectPartial('@slider1', () =>
				v('input', {
					...sliderProps,
					key: 'slider1',
					disabled: true,
					name: '_min',
					value: '0',
					styles: {
						clip: 'rect(auto, 0px, auto, auto)'
					}
				})
			);

			h.expectPartial('@slider2', () =>
				v('input', {
					...sliderProps,
					key: 'slider2',
					disabled: true,
					name: '_max',
					value: '100',
					styles: {
						clip: 'rect(auto, auto, auto, 0px)'
					}
				})
			);
		},
		readonly() {
			const h = harness(
				() =>
					w(RangeSlider, {
						readOnly: true
					}),
				[compareAriaDescribedBy, compareAriaLabelledBy]
			);
			h.expectPartial('@slider1', () =>
				v('input', {
					...sliderProps,
					'aria-readonly': 'true',
					key: 'slider1',
					readonly: true,
					name: '_min',
					value: '0',
					styles: {
						clip: 'rect(auto, 0px, auto, auto)'
					}
				})
			);

			h.expectPartial('@slider2', () =>
				v('input', {
					...sliderProps,
					'aria-readonly': 'true',
					key: 'slider2',
					readonly: true,
					name: '_max',
					value: '100',
					styles: {
						clip: 'rect(auto, auto, auto, 0px)'
					}
				})
			);
		},
		required() {
			const h = harness(
				() =>
					w(RangeSlider, {
						required: true
					}),
				[compareAriaDescribedBy, compareAriaLabelledBy]
			);
			h.expectPartial('@slider1', () =>
				v('input', {
					...sliderProps,
					key: 'slider1',
					required: true,
					name: '_min',
					value: '0',
					styles: {
						clip: 'rect(auto, 0px, auto, auto)'
					}
				})
			);

			h.expectPartial('@slider2', () =>
				v('input', {
					...sliderProps,
					key: 'slider2',
					required: true,
					name: '_max',
					value: '100',
					styles: {
						clip: 'rect(auto, auto, auto, 0px)'
					}
				})
			);
		},
		invalid() {
			const h = harness(
				() =>
					w(RangeSlider, {
						valid: false
					}),
				[compareAriaDescribedBy, compareAriaLabelledBy]
			);
			h.expectPartial('@slider1', () =>
				v('input', {
					...sliderProps,
					'aria-invalid': 'true',
					key: 'slider1',
					name: '_min',
					value: '0',
					styles: {
						clip: 'rect(auto, 0px, auto, auto)'
					}
				})
			);

			h.expectPartial('@slider2', () =>
				v('input', {
					...sliderProps,
					'aria-invalid': 'true',
					key: 'slider2',
					name: '_max',
					value: '100',
					styles: {
						clip: 'rect(auto, auto, auto, 0px)'
					}
				})
			);
		},
		'slider values'() {
			const h = harness(
				() =>
					w(RangeSlider, {
						min: 25,
						max: 50,
						value: { min: 25, max: 50 },
						step: 5
					}),
				[compareAriaDescribedBy, compareAriaLabelledBy]
			);

			h.expectPartial('@slider1', () =>
				v('input', {
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
				})
			);

			h.expectPartial('@slider2', () =>
				v('input', {
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
				})
			);
		},
		events: {
			onValue() {
				const onValue = sinon.stub();

				const h = harness(() =>
					w(RangeSlider, {
						onValue
					})
				);

				h.trigger('@slider1', 'oninput', {
					stopPropagation: sinon.stub(),
					target: {
						value: '25'
					}
				});

				assert(onValue.calledWith({ min: 25, max: 100 }));

				h.trigger('@slider2', 'oninput', {
					stopPropagation: sinon.stub(),
					target: {
						value: '50'
					}
				});

				assert(onValue.calledWith({ min: 0, max: 50 }));
			},

			onBlur() {
				const onBlur = sinon.stub();

				const h = harness(() =>
					w(RangeSlider, {
						onBlur
					})
				);

				h.trigger('@slider1', 'onblur', {
					stopPropagation: sinon.stub(),
					target: {
						value: '25'
					}
				});

				assert(onBlur.called);
			},
			onFocus() {
				const onFocus = sinon.stub();

				const h = harness(() =>
					w(RangeSlider, {
						onFocus
					})
				);

				h.trigger('@slider1', 'onfocus', {
					stopPropagation: sinon.stub(),
					target: {
						value: '25'
					}
				});

				assert(onFocus.called);
			},

			'does not error on missing events'() {
				const h = harness(() => w(RangeSlider, {}));

				['onblur', 'onfocus', 'oninput'].forEach((key) => {
					h.trigger('@slider1', key, stubEvent);
					h.trigger('@slider2', key, stubEvent);
				});
			}
		},
		label: {
			'plain label'() {
				const h = harness(
					() =>
						w(RangeSlider, {
							label: 'Test'
						}),
					[compareWidgetId]
				);

				h.expectPartial('@label', () =>
					w(
						Label,
						{
							key: 'label',
							theme: undefined,
							classes: undefined,
							disabled: undefined,
							focused: false,
							valid: undefined,
							readOnly: undefined,
							required: undefined,
							hidden: undefined,
							widgetId: ''
						},
						['Test']
					)
				);
			},

			'disabled/required/readonly label'() {
				const h = harness(
					() =>
						w(RangeSlider, {
							label: 'Test',
							disabled: true,
							required: true,
							readOnly: true
						}),
					[compareWidgetId]
				);

				h.expectPartial('@label', () =>
					w(
						Label,
						{
							key: 'label',
							theme: undefined,
							classes: undefined,
							disabled: true,
							focused: false,
							valid: undefined,
							readOnly: true,
							required: true,
							hidden: undefined,
							widgetId: ''
						},
						['Test']
					)
				);
			}
		},

		focus: {
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

				const h = harness(
					() =>
						w(MockMetaMixin(RangeSlider, mockMeta), {
							label: 'Test'
						}),
					[compareWidgetId]
				);
				h.expectPartial('@label', () =>
					w(
						Label,
						{
							key: 'label',
							theme: undefined,
							classes: undefined,
							disabled: undefined,
							focused: true,
							valid: undefined,
							readOnly: undefined,
							required: undefined,
							hidden: undefined,
							widgetId: ''
						},
						['Test']
					)
				);

				h.expectPartial('@leftThumb', () =>
					v('div', {
						key: 'leftThumb',
						classes: [css.thumb, css.leftThumb, css.focused, fixedCss.thumbFixed],
						styles: {
							left: '0%'
						}
					})
				);

				h.expectPartial('@rightThumb', () =>
					v('div', {
						key: 'rightThumb',
						classes: [css.thumb, css.rightThumb, css.focused, fixedCss.thumbFixed],
						styles: {
							left: '100%'
						}
					})
				);
			}
		}
	}
});
