const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { v, w } from '@dojo/framework/core/vdom';
import Focus from '../../../meta/Focus';
import { Keys } from '../../../common/util';

import ComboBox from '../../index';
import Icon from '../../../icon/index';
import Label from '../../../label/index';
import Listbox from '../../../listbox/index';
import TextInput from '../../../text-input/index';
import * as css from '../../../theme/default/combobox.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import {
	createHarness,
	compareId,
	compareWidgetId,
	compareAria,
	compareAriaControls,
	compareAriaOwns,
	isFocusedComparator,
	isNotFocusedComparator,
	noop,
	MockMetaMixin,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import HelperText from '../../../helper-text/index';

const harness = createHarness([
	compareId,
	compareWidgetId,
	compareAria,
	compareAriaControls,
	compareAriaOwns
]);

const helperText = 'This is helpertext';
const invalidMessage = 'This input is invalid';

const testOptions: any[] = [
	{
		label: 'One',
		value: 'one'
	},
	{
		label: 'Two',
		value: 'two'
	},
	{
		label: 'Three',
		value: 'three',
		disabled: true
	}
];

const testProperties = {
	clearable: true,
	getResultLabel: (result: any) => result.label,
	widgetId: 'foo',
	label: 'foo',
	results: testOptions,
	value: 'one',
	theme: {}
};

interface States {
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
}

const compareFocusFalse = {
	selector: '@textinput',
	property: 'focus',
	comparator: isNotFocusedComparator
};

const compareFocusTrue = {
	selector: '@textinput',
	property: 'focus',
	comparator: isFocusedComparator
};

const getExpectedControls = function(
	useTestProperties: boolean,
	label: boolean,
	open: boolean,
	states: States = {},
	validity: { valid: boolean | undefined; message: string | undefined },
	helperText?: string
) {
	const { disabled, readOnly, required } = states;
	const { valid = undefined } = validity;
	const controlsVdom = v(
		'div',
		{
			'aria-expanded': open ? 'true' : 'false',
			'aria-haspopup': 'listbox',
			'aria-owns': '',
			classes: css.controls,
			role: 'combobox',
			onpointerenter: noop,
			onpointerleave: noop
		},
		[
			w(TextInput, {
				key: 'textinput',
				aria: {
					activedescendant: '',
					autocomplete: 'list'
				},
				disabled,
				focus: noop,
				widgetId: useTestProperties ? 'foo' : '',
				valid,
				readOnly,
				required,
				theme: useTestProperties ? {} : undefined,
				classes: undefined,
				value: useTestProperties ? 'one' : '',
				onBlur: noop,
				onFocus: noop,
				onValue: noop,
				onKeyDown: noop,
				onValidate: undefined
			}),
			useTestProperties
				? v(
						'button',
						{
							'aria-hidden': 'true',
							key: 'clear',
							classes: css.clear,
							disabled: disabled || readOnly,
							tabIndex: -1,
							type: 'button',
							onclick: noop
						},
						[
							v('span', { classes: baseCss.visuallyHidden }, [
								useTestProperties ? 'clear foo' : 'clear '
							]),
							w(Icon, {
								type: 'closeIcon',
								theme: useTestProperties ? {} : undefined,
								classes: undefined
							})
						]
				  )
				: null,
			v(
				'button',
				{
					key: 'trigger',
					'aria-hidden': 'true',
					classes: css.trigger,
					disabled: disabled || readOnly,
					tabIndex: -1,
					type: 'button',
					onclick: noop
				},
				[
					v('span', { classes: baseCss.visuallyHidden }, [
						useTestProperties ? 'open foo' : 'open '
					]),
					w(Icon, {
						type: 'downIcon',
						theme: useTestProperties ? {} : undefined,
						classes: undefined
					})
				]
			)
		]
	);

	return controlsVdom;
};

const getExpectedMenu = function(useTestProperties: boolean, open: boolean, overrides = {}) {
	if (!open || !useTestProperties) {
		return null;
	}

	return v(
		'div',
		{
			key: 'dropdown',
			classes: css.dropdown,
			onmouseover: noop,
			onmousedown: noop
		},
		[
			w(Listbox, {
				activeIndex: 0,
				widgetId: '',
				key: 'listbox',
				visualFocus: false,
				optionData: testOptions,
				tabIndex: -1,
				getOptionDisabled: undefined,
				getOptionId: noop as any,
				getOptionLabel: noop as any,
				getOptionSelected: noop as any,
				onActiveIndexChange: noop,
				onOptionSelect: noop,
				theme: useTestProperties ? {} : undefined,
				classes: undefined,
				...overrides
			})
		]
	);
};

const getExpectedVdom = function(
	useTestProperties = false,
	open = false,
	label = false,
	states: States = {},
	focused = false,
	validity: { valid: boolean | undefined; message: string | undefined } = {
		valid: undefined,
		message: undefined
	},
	helperText?: string
) {
	const menuVdom = getExpectedMenu(useTestProperties, open);
	const controlsVdom = getExpectedControls(
		useTestProperties,
		label,
		open,
		states,
		validity,
		helperText
	);
	const { disabled, readOnly, required } = states;
	const { valid, message } = validity;

	return v(
		'div',
		{
			classes: [
				css.root,
				open ? css.open : null,
				useTestProperties ? css.clearable : null,
				focused ? css.focused : null,
				validity.valid === false ? css.invalid : null,
				validity.valid === true ? css.valid : null
			],
			key: 'root'
		},
		[
			label
				? w(
						Label,
						{
							key: 'label',
							theme: useTestProperties ? {} : undefined,
							classes: undefined,
							disabled,
							focused,
							hidden: undefined,
							valid: validity.valid,
							readOnly,
							required,
							forId: useTestProperties ? 'foo' : ''
						},
						['foo']
				  )
				: null,
			controlsVdom,
			!open &&
				w(HelperText, {
					text: valid ? helperText : message,
					valid
				}),
			menuVdom
		]
	);
};

registerSuite('ComboBox', {
	tests: {
		'renders with default properties'() {
			const h = harness(() => w(ComboBox, {}), [compareFocusFalse]);
			h.expect(getExpectedVdom);
		},

		'renders with custom properties'() {
			const h = harness(() => w(ComboBox, testProperties), [compareFocusFalse]);
			h.expect(() => getExpectedVdom(true, false, true));
		},

		'dropdown renders correctly when open'() {
			const h = harness(() => w(ComboBox, testProperties), [compareFocusTrue]);
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expect(() => getExpectedVdom(true, true, true, {}));
		},

		'arrow click opens menu'() {
			const onRequestResults = sinon.stub();
			const onMenuChange = sinon.stub();
			const h = harness(
				() =>
					w(ComboBox, {
						...testProperties,
						onRequestResults,
						onMenuChange
					}),
				[compareFocusTrue]
			);
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expect(() => getExpectedVdom(true, true, true, {}));
			assert.isTrue(
				onRequestResults.calledOnce,
				'onRequestResults called when menu is opened'
			);
			assert.isTrue(onMenuChange.calledOnce, 'onMenuChange called when menu is opened');
		},

		'menu opens on input'() {
			const onValue = sinon.stub();
			const onRequestResults = sinon.stub();
			const onResultSelect = sinon.stub();
			const onMenuChange = sinon.stub();
			const h = harness(
				() =>
					w(ComboBox, {
						...testProperties,
						label: undefined,
						onValue,
						onRequestResults,
						onResultSelect,
						onMenuChange
					}),
				[compareFocusFalse]
			);

			h.trigger('@textinput', 'onValue', 'foo');
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));

			assert.isTrue(onValue.calledWith('foo'), 'onValue callback called with input value');
			assert.isTrue(onRequestResults.calledOnce, 'onRequestResults callback called');
			assert.isFalse(onResultSelect.called, 'onResultSelect is not called on input');
			assert.isTrue(onMenuChange.calledOnce, 'onMenuChange called when menu is opened');
		},

		'menu closes on input blur'() {
			const onBlur = sinon.stub();
			const onMenuChange = sinon.stub();
			const h = harness(
				() =>
					w(ComboBox, {
						...testProperties,
						onBlur,
						onMenuChange
					}),
				[compareFocusFalse]
			);

			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));

			h.trigger('@textinput', 'onBlur', 'foo');
			h.expect(() => getExpectedVdom(true, false, true));
			assert.isTrue(onBlur.called);
			assert.isTrue(onMenuChange.calledTwice, 'onMenuChange called twice');
		},

		'blur ignored when clicking option'() {
			const onBlur = sinon.stub();
			const onMenuChange = sinon.stub();
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					onBlur,
					onMenuChange
				})
			);
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));

			h.trigger('@dropdown', 'onmousedown', stubEvent);
			h.trigger('@textinput', 'onBlur', 'foo');

			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));
			assert.isFalse(onBlur.called, 'onBlur not called for dropdown click');
			assert.isFalse(onMenuChange.calledTwice, 'onMenuChange only called once');
		},

		'menu closes on result selection'() {
			const onValue = sinon.stub();
			const onResultSelect = sinon.stub();
			const h = harness(
				() =>
					w(ComboBox, {
						...testProperties,
						onValue,
						onResultSelect
					}),
				[compareFocusTrue]
			);

			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@listbox', 'onOptionSelect', testOptions[1], 1);
			assert.isTrue(
				onValue.calledWith('Two'),
				'onValue callback called with label of second option'
			);
			assert.isTrue(
				onResultSelect.calledWith(testOptions[1]),
				'onResultSelect callback called with second option'
			);
			h.expect(() => getExpectedVdom(true, false, true, {}));
		},

		'keyboard opens and closes menu'() {
			const onRequestResults = sinon.stub();
			const preventDefault = sinon.stub();
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					onRequestResults
				})
			);

			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true }));
			assert.isTrue(
				onRequestResults.calledOnce,
				'onRequestResults called when menu is opened'
			);
			assert.isTrue(preventDefault.calledOnce, 'down key press prevents default page scroll');

			h.trigger('@textinput', 'onKeyDown', Keys.Escape, preventDefault);
			h.expect(() => getExpectedVdom(true, false, true));
		},

		'listbox onActiveIndexChange'() {
			const h = harness(() => w(ComboBox, testProperties));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@listbox', 'onActiveIndexChange', 1);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { activeIndex: 1 }));
		},

		'keyboard navigates options'() {
			const preventDefault = sinon.stub();
			const h = harness(() => w(ComboBox, testProperties));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.expectPartial('@dropdown', () =>
				getExpectedMenu(true, true, { visualFocus: true, activeIndex: 1 })
			);
			h.trigger('@textinput', 'onKeyDown', Keys.Up, preventDefault);
			h.expectPartial('@dropdown', () =>
				getExpectedMenu(true, true, { visualFocus: true, activeIndex: 0 })
			);
			h.trigger('@textinput', 'onKeyDown', Keys.Up, preventDefault);
			h.expectPartial('@dropdown', () =>
				getExpectedMenu(true, true, { visualFocus: true, activeIndex: 2 })
			);
			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.expectPartial('@dropdown', () =>
				getExpectedMenu(true, true, { visualFocus: true, activeIndex: 0 })
			);
			h.trigger('@textinput', 'onKeyDown', Keys.End, preventDefault);
			h.expectPartial('@dropdown', () =>
				getExpectedMenu(true, true, { visualFocus: true, activeIndex: 2 })
			);
			h.trigger('@textinput', 'onKeyDown', Keys.Home, preventDefault);
			h.expectPartial('@dropdown', () =>
				getExpectedMenu(true, true, { visualFocus: true, activeIndex: 0 })
			);
			assert.strictEqual(
				preventDefault.callCount,
				4,
				'preventDefault called four times for up and down keys'
			);
		},

		'enter and space select option'() {
			const onValue = sinon.stub();
			const onResultSelect = sinon.stub();
			const h = harness(
				() =>
					w(ComboBox, {
						...testProperties,
						onValue,
						onResultSelect
					}),
				[compareFocusTrue]
			);
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Enter, () => {});

			assert.isTrue(
				onValue.calledWith('One'),
				'enter triggers onValue callback called with label of first option'
			);
			assert.isTrue(
				onResultSelect.calledWith(testOptions[0]),
				'enter triggers onResultSelect callback called with first option'
			);
			h.expect(() => getExpectedVdom(true, false, true, {}));

			h.trigger('@textinput', 'onKeyDown', Keys.Enter, () => {});
			assert.isFalse(
				onValue.calledTwice,
				'enter does not trigger onValue when menu is closed'
			);
			assert.isFalse(
				onResultSelect.calledTwice,
				'enter does not trigger onResultSelect when menu is closed'
			);
			onValue.reset();

			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Space, () => {});
			assert.isTrue(
				onValue.calledWith('One'),
				'space triggers onValue callback called with label of first option'
			);
			assert.isTrue(
				onResultSelect.calledWith(testOptions[0]),
				'space triggers onResultSelect callback called with first option'
			);
			h.expect(() => getExpectedVdom(true, false, true, {}));
		},

		'disabled options are not selected'() {
			const onValue = sinon.stub();
			const onResultSelect = sinon.stub();
			const preventDefault = sinon.stub();
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					isResultDisabled: (result: any) => !!result.disabled,
					onValue,
					onResultSelect
				})
			);
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Up, preventDefault);
			h.trigger('@textinput', 'onKeyDown', Keys.Enter, preventDefault);

			assert.isFalse(onValue.called, 'onValue not called for disabled option');
			assert.isFalse(onResultSelect.called, 'onResultSelect not called for disabled option');
			h.expectPartial('@dropdown', () =>
				getExpectedMenu(true, true, {
					visualFocus: true,
					getOptionDisabled: noop,
					activeIndex: 2
				})
			);
		},

		'keyboard does not trigger onValue with no results'() {
			const onValue = sinon.stub();
			const preventDefault = sinon.stub();
			const h = harness(() => w(ComboBox, { onValue }));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expect(() => getExpectedVdom(false, false, false, {}));

			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.trigger('@textinput', 'onKeyDown', Keys.Enter, preventDefault);

			assert.isFalse(onValue.called, 'onValue not called for no results');
		},

		'onValue uses custom getResultValue'() {
			const onValue = sinon.stub();
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					onValue,
					getResultValue: (result: any) => result.value
				})
			);

			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@listbox', 'onOptionSelect', testOptions[1], 1);
			assert.isTrue(
				onValue.calledWith('two'),
				'onValue callback called with value of second option'
			);
		},

		'clear button clears input'() {
			const onValue = sinon.stub();
			const onResultSelect = sinon.stub();
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					onValue,
					onResultSelect
				})
			);
			h.trigger(`.${css.clear}`, 'onclick', stubEvent);
			assert.isTrue(
				onValue.calledWith(''),
				'clear button calls onValue with an empty string'
			);
			assert.isFalse(onResultSelect.called, 'clear button does not call onResultSelect');
		},

		'inputProperties transferred to child input'() {
			const h = harness(() =>
				w(ComboBox, {
					inputProperties: {
						placeholder: 'foo'
					}
				})
			);

			h.expectPartial('@textinput', () =>
				w(TextInput, {
					key: 'textinput',
					aria: {
						activedescendant: '',
						controls: '',
						owns: ''
					},
					placeholder: 'foo',
					focus: noop,
					disabled: undefined,
					valid: undefined,
					widgetId: '',
					readOnly: undefined,
					required: undefined,
					theme: undefined,
					classes: undefined,
					value: '',
					onBlur: noop,
					onFocus: noop,
					onValue: noop,
					onKeyDown: noop,
					onValidate: undefined
				})
			);
		},

		'input opens on shouldFocus with openOnFocus'() {
			const onFocus = sinon.stub();
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					openOnFocus: true,
					onFocus
				})
			);
			h.trigger('@textinput', 'onFocus', 'foo');

			assert.isTrue(onFocus.called);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));
		},

		'widget states render correctly'() {
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					disabled: true,
					readOnly: true,
					required: true
				})
			);

			h.expectPartial('@textinput', () =>
				w(TextInput, {
					key: 'textinput',
					aria: {
						activedescendant: '',
						controls: '',
						owns: ''
					},
					widgetId: 'foo',
					valid: undefined,
					focus: noop,
					disabled: true,
					readOnly: true,
					required: true,
					theme: {},
					classes: undefined,
					value: 'one',
					onBlur: noop,
					onFocus: noop,
					onValue: noop,
					onKeyDown: noop,
					onValidate: undefined
				})
			);

			h.expectPartial('@label', () =>
				w(
					Label,
					{
						key: 'label',
						theme: {},
						classes: undefined,
						disabled: true,
						focused: false,
						readOnly: true,
						valid: undefined,
						required: true,
						hidden: undefined,
						forId: 'foo'
					},
					['foo']
				)
			);

			h.expectPartial('@clear', () =>
				v(
					'button',
					{
						key: 'clear',
						'aria-hidden': 'true',
						classes: css.clear,
						disabled: true,
						tabIndex: -1,
						type: 'button',
						onclick: noop
					},
					[
						v('span', { classes: baseCss.visuallyHidden }, ['clear foo']),
						w(Icon, { type: 'closeIcon', theme: {}, classes: undefined })
					]
				)
			);

			h.expectPartial('@trigger', () =>
				v(
					'button',
					{
						key: 'trigger',
						'aria-hidden': 'true',
						classes: css.trigger,
						disabled: true,
						tabIndex: -1,
						type: 'button',
						onclick: noop
					},
					[
						v('span', { classes: baseCss.visuallyHidden }, ['open foo']),
						w(Icon, { type: 'downIcon', theme: {}, classes: undefined })
					]
				)
			);

			h.expectPartial('@textinput', () =>
				w(TextInput, {
					key: 'textinput',
					classes: undefined,
					aria: {
						activedescendant: '',
						controls: '',
						owns: ''
					},
					widgetId: 'foo',
					valid: undefined,
					focus: noop,
					disabled: true,
					readOnly: true,
					required: true,
					theme: {},
					value: 'one',
					onBlur: noop,
					onFocus: noop,
					onValue: noop,
					onKeyDown: noop,
					onValidate: undefined
				})
			);
		},

		'focused widget renders correctly'() {
			const mockMeta = sinon.stub();
			const mockFocusGet = sinon.stub().returns({
				active: false,
				containsFocus: true
			});
			mockMeta.withArgs(Focus).returns({
				get: mockFocusGet
			});
			const h = harness(() => w(MockMetaMixin(ComboBox, mockMeta), {}), [compareId]);
			h.expect(() => getExpectedVdom(false, false, false, {}, true));
		},

		'disabled state blocks menu opening'() {
			const onMenuChange = sinon.stub();
			const onRequestResults = sinon.stub();
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					disabled: true,
					onMenuChange,
					onRequestResults
				})
			);

			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expect(() => getExpectedVdom(true, false, true, { disabled: true }));
			h.trigger('@textinput', 'onKeyDown', Keys.Down, () => {});
			h.expect(() => getExpectedVdom(true, false, true, { disabled: true }));
			assert.isFalse(onMenuChange.called, 'onMenuChange never called');
			assert.isFalse(onRequestResults.called, 'onRequestResults never called');
		},

		'readOnly state blocks menu opening'() {
			const onMenuChange = sinon.stub();
			const onRequestResults = sinon.stub();
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					readOnly: true,
					onMenuChange,
					onRequestResults
				})
			);

			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expect(() => getExpectedVdom(true, false, true, { readOnly: true }));
			h.trigger('@textinput', 'onKeyDown', Keys.Down, () => {});
			h.expect(() => getExpectedVdom(true, false, true, { readOnly: true }));

			assert.isFalse(onMenuChange.called, 'onMenuChange never called');
			assert.isFalse(onRequestResults.called, 'onRequestResults never called');
		},

		'hover and keyboard events toggle visualFocus'() {
			const preventDefault = sinon.stub();
			const h = harness(() => w(ComboBox, { ...testProperties }));
			h.expect(() => getExpectedVdom(true, false, true));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Up, preventDefault);
			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true }));
			h.trigger('@dropdown', 'onmouseover', stubEvent);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));
		},

		'renders helpertext'() {
			const h = harness(() =>
				w(ComboBox, {
					...testProperties,
					helperText: helperText
				})
			);
			h.expect(() =>
				getExpectedVdom(
					true,
					false,
					true,
					{},
					false,
					{ valid: undefined, message: undefined },
					helperText
				)
			);
		},

		'renders validity correctly'() {
			let h = harness(() =>
				w(ComboBox, {
					...testProperties,
					valid: undefined
				})
			);
			h.expect(() =>
				getExpectedVdom(true, false, true, {}, false, {
					valid: undefined,
					message: undefined
				})
			);

			h = harness(() =>
				w(ComboBox, {
					...testProperties,
					valid: true
				})
			);
			h.expect(() =>
				getExpectedVdom(true, false, true, {}, false, { valid: true, message: undefined })
			);

			h = harness(() =>
				w(ComboBox, {
					...testProperties,
					valid: false
				})
			);
			h.expect(() =>
				getExpectedVdom(true, false, true, {}, false, { valid: false, message: undefined })
			);

			h = harness(() =>
				w(ComboBox, {
					...testProperties,
					valid: { valid: true, message: invalidMessage }
				})
			);
			h.expect(() =>
				getExpectedVdom(true, false, true, {}, false, {
					valid: true,
					message: invalidMessage
				})
			);

			h = harness(() =>
				w(ComboBox, {
					...testProperties,
					valid: { valid: false, message: invalidMessage }
				})
			);
			h.expect(() =>
				getExpectedVdom(true, false, true, {}, false, {
					valid: false,
					message: invalidMessage
				})
			);

			h = harness(() =>
				w(ComboBox, {
					...testProperties,
					valid: { valid: false, message: undefined }
				})
			);
			h.expect(() =>
				getExpectedVdom(true, false, true, {}, false, { valid: false, message: undefined })
			);
		}
	}
});
