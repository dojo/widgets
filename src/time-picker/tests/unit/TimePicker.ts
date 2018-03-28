const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import Focus from '@dojo/widget-core/meta/Focus';
import * as sinon from 'sinon';
import TimePicker, { getOptions, parseUnits } from '../../index';
import * as css from '../../../theme/time-picker.m.css';
import ComboBox from '../../../combobox/index';
import Label from '../../../label/index';
import { noop, compareId, comparewidgetId, compareForId, MockMetaMixin } from '../../../common/tests/support/test-helpers';

const testProperties = {
	clearable: true,
	disabled: false,
	widgetId: 'foo',
	invalid: true,
	label: 'Some Field',
	openOnFocus: false,
	readOnly: false,
	required: true,
	value: 'some value'
};

const getExpectedCombobox = function(useTestProperties = false, results?: any[]) {
	results = results ? results : getOptions();
	return w(ComboBox, {
		key: 'combo',
		clearable: useTestProperties ? true : undefined,
		disabled: useTestProperties ? false : undefined,
		getResultLabel: noop,
		widgetId: useTestProperties ? 'foo' : '',
		inputProperties: undefined,
		invalid: useTestProperties ? true : undefined,
		isResultDisabled: undefined,
		label: useTestProperties ? 'Some Field' : undefined,
		labelAfter: undefined,
		labelHidden: undefined,
		onBlur: noop,
		onChange: noop,
		onFocus: noop,
		onMenuChange: noop,
		onRequestResults: noop,
		openOnFocus: useTestProperties ? false : undefined,
		extraClasses: undefined,
		readOnly: useTestProperties ? false : undefined,
		required: useTestProperties ? true : undefined,
		results,
		theme: undefined,
		value: useTestProperties ? 'some value' : undefined
	});
};

registerSuite('TimePicker', {

	getOptions: {
		'Should include each minute for a full day by default'() {
			const options = getOptions();

			assert.lengthOf(options, 1440);
		},

		'Should allow steps under 60 seconds'() {
			const options = getOptions('00:00:00', '00:00:10', 1);

			assert.lengthOf(options, 11);
			options.forEach((option, i) => {
				const { hour, minute, second } = option;

				assert.strictEqual(hour, 0);
				assert.strictEqual(minute, 0);
				assert.strictEqual(second, i);
			});
		}
	},

	parseUnits() {
		assert.throws(parseUnits.bind(null, ''));
		assert.throws(parseUnits.bind(null, '273:00:00'));
		assert.throws(parseUnits.bind(null, 'x@1235s'));
		assert.throws(parseUnits.bind(null, '7:00'));
		assert.throws(parseUnits.bind(null, '07:0a'));

		const units = { hour: 13 };
		assert.strictEqual(parseUnits(units), units);
		assert.deepEqual(parseUnits('23:44:50'), {
			hour: 23,
			minute: 44,
			second: 50
		});
		assert.deepEqual(parseUnits('00:00'), {
			hour: 0,
			minute: 0,
			second: 0
		});
		assert.deepEqual(parseUnits('55:98:72'), {
			hour: 55,
			minute: 98,
			second: 72
		}, 'does not check for invalid units');
	},

	'Custom input': {
		'Should delegate to ComboBox'() {
			const h = harness(() => w(TimePicker, testProperties));
			h.expect(() => getExpectedCombobox(true));
		},

		'Should use `getOptionLabel` to format menu options'() {
			const getOptionLabel = sinon.spy();
			const option = { hour: 0 };

			const h = harness(() => w(TimePicker, { getOptionLabel }));
			h.trigger('@combo', 'getResultLabel', option);
			assert.isTrue(getOptionLabel.calledWith(option));
		},

		'Should format options as `HH:mm` by default'() {
			const h = harness(() => w(TimePicker, {}));
			const result = h.trigger('@combo', 'getResultLabel', { hour: 4, minute: 22, second: 0 });
			assert.strictEqual(result, '04:22');
		},

		'Should format options as `HH:mm:ss` when the step is less than 60 seconds'() {
			const h = harness(() => w(TimePicker, { step: 1 }));
			const result = h.trigger('@combo', 'getResultLabel', { hour: 4, minute: 22, second: 0 });
			assert.strictEqual(result, '04:22:00');
		},

		'Should set options with step and default start and end'() {
			const h = harness(() => w(TimePicker, { step: 3600 }), [ comparewidgetId ]);
			const expectedOptions = getOptions(undefined, undefined, 3600);

			h.expect(() => getExpectedCombobox(false, expectedOptions));
		},

		'Should set options with start, end, and step'() {
			const h = harness(() => w(TimePicker, { end: '01:00', start: '00:00' }), [ comparewidgetId ]);
			const expectedOptions = getOptions('00:00', '01:00');

			h.expect(() => getExpectedCombobox(false, expectedOptions));
		},

		'Should call onRequestOptions'() {
			const onRequestOptions = sinon.spy();
			const h = harness(() => w(TimePicker, {
				key: 'foo',
				onRequestOptions,
				step: 3600
			}));
			h.trigger('@combo', 'onRequestResults');
			assert.isTrue(onRequestOptions.calledWith('foo'));
		}
	},

	'Native input': {
		basic() {
			const h = harness(() => w(TimePicker, {
				name: 'some-field',
				useNativeElement: true
			}), [ compareId ]);

			h.expect(() => v('div', {
				classes: [ css.root, null, null, null, null, null ],
				key: 'root'
			}, [
				null,
				v('input', {
					'aria-invalid': null,
					'aria-readonly': null,
					classes: css.input,
					disabled: undefined,
					invalid: undefined,
					key: 'native-input',
					id: '',
					max: undefined,
					min: undefined,
					name: 'some-field',
					onblur: noop,
					onchange: noop,
					onfocus: noop,
					readOnly: undefined,
					required: undefined,
					step: undefined,
					type: 'time',
					value: undefined
				})
			]));
		},

		'Attributes added'() {
			const h = harness(() => w(TimePicker, {
				disabled: true,
				end: '12:00',
				inputProperties: {
					aria: { describedBy: 'Some descriptive text' }
				},
				invalid: true,
				name: 'some-field',
				readOnly: true,
				required: true,
				start: '10:00',
				step: 60,
				useNativeElement: true,
				value: '11:30'
			}), [ compareId ]);

			h.expect(() => v('div', {
				classes: [ css.root,
					css.disabled,
					null,
					css.invalid,
					css.readonly,
					css.required
				],
				key: 'root'
			}, [
				null,
				v('input', {
					'aria-describedby': 'Some descriptive text',
					'aria-invalid': 'true',
					'aria-readonly': 'true',
					classes: css.input,
					id: '',
					disabled: true,
					invalid: true,
					key: 'native-input',
					max: '12:00',
					min: '10:00',
					name: 'some-field',
					onblur: noop,
					onchange: noop,
					onfocus: noop,
					readOnly: true,
					required: true,
					step: 60,
					type: 'time',
					value: '11:30'
				})
			]));
		},

		'focused class'() {
			const mockMeta = sinon.stub();
			const mockFocusGet = sinon.stub().returns({
				active: false,
				containsFocus: true
			});
			mockMeta.withArgs(Focus).returns({
				get: mockFocusGet
			});
			const h = harness(() => w(MockMetaMixin(TimePicker, mockMeta), {
				name: 'some-field',
				useNativeElement: true
			}), [ compareId ]);

			h.expect(() => v('div', {
				classes: [ css.root, null, css.focused, null, null, null ],
				key: 'root'
			}, [
				null,
				v('input', {
					'aria-invalid': null,
					'aria-readonly': null,
					classes: css.input,
					disabled: undefined,
					invalid: undefined,
					key: 'native-input',
					id: '',
					max: undefined,
					min: undefined,
					name: 'some-field',
					onblur: noop,
					onchange: noop,
					onfocus: noop,
					readOnly: undefined,
					required: undefined,
					step: undefined,
					type: 'time',
					value: undefined
				})
			]));
		},

		'Label should render'() {
			const h = harness(() => w(TimePicker, {
				label: 'foo',
				useNativeElement: true
			}), [ compareId, compareForId ]);
			h.expect(() => v('div', {
				classes: [ css.root, null, null, null, null, null ],
				key: 'root'
			}, [
				w(Label, {
					theme: undefined,
					disabled: undefined,
					focused: false,
					hidden: false,
					invalid: undefined,
					readOnly: undefined,
					required: undefined,
					forId: ''
				}, [ 'foo' ]),
				v('input', {
					'aria-invalid': null,
					'aria-readonly': null,
					classes: css.input,
					disabled: undefined,
					invalid: undefined,
					key: 'native-input',
					id: '',
					max: undefined,
					min: undefined,
					name: undefined,
					onblur: noop,
					onchange: noop,
					onfocus: noop,
					readOnly: undefined,
					required: undefined,
					step: undefined,
					type: 'time',
					value: undefined
				})
			]));
		},

		'`onBlur` should be called'() {
			const onBlur = sinon.spy();
			const h = harness(() => w(TimePicker, {
				onBlur,
				useNativeElement: true,
				value: '12:34:56'
			}));
			h.trigger('input[type=time]', 'onblur', { target: { value: '12:34:56' }});
			assert.isTrue(onBlur.calledWith('12:34:56'), '`onBlur` should be called with the value');
		},

		'`onChange` should be called'() {
			const onChange = sinon.spy();

			const h = harness(() => w(TimePicker, {
				onChange,
				useNativeElement: true,
				value: '12:34:56'
			}));
			h.trigger('input[type=time]', 'onchange', { target: { value: '12:34:56' }});
			assert.isTrue(onChange.calledWith('12:34:56'), '`onChange` should be called with the value');
		},

		'`onFocus` should be called'() {
			const onFocus = sinon.spy();
			const h = harness(() => w(TimePicker, {
				onFocus,
				useNativeElement: true,
				value: '12:34:56'
			}));

			h.trigger('input[type=time]', 'onfocus', { target: { value: '12:34:56' }});
			assert.isTrue(onFocus.calledWith('12:34:56'), '`onFocus` should be called with the value');
		}
	}
});
