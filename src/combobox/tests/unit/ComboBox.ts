
const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { v, w } from '@dojo/widget-core/d';
import Focus from '@dojo/widget-core/meta/Focus';
import { Keys } from '../../../common/util';

import ComboBox from '../../index';
import Icon from '../../../icon/index';
import Label from '../../../label/index';
import Listbox from '../../../listbox/index';
import TextInput from '../../../text-input/index';
import * as css from '../../../theme/combobox.m.css';
import {
	createHarness,
	compareId,
	compareAria,
	compareAriaControls,
	noop,
	MockMetaMixin,
	stubEvent
} from '../../../common/tests/support/test-helpers';

const harness = createHarness([ compareId, compareAria, compareAriaControls ]);

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
	id: 'foo',
	label: 'foo',
	results: testOptions,
	value: 'one',
	theme: {}
};

interface States {
	disabled?: boolean;
	invalid?: boolean;
	readOnly?: boolean;
	required?: boolean;
}

const getExpectedControls = function(useTestProperties: boolean, label: boolean, states: States = {}, callFocus = false) {
	const { disabled, invalid, readOnly, required } = states;
	const controlsVdom = v('div', {
		classes: css.controls
	}, [
		w(TextInput, {
			key: 'textinput',
			aria: {
				activedescendant: '',
				controls: '',
				owns: ''
			},
			disabled,
			focus: callFocus,
			id: useTestProperties ? 'foo' : '',
			invalid,
			readOnly,
			required,
			theme: useTestProperties ? {} : undefined,
			value: useTestProperties ? 'one' : '',
			onBlur: noop,
			onFocus: noop,
			onInput: noop,
			onKeyDown: noop
		}),
		useTestProperties ? v('button', {
			'aria-controls': '',
			key: 'clear',
			classes: css.clear,
			disabled: disabled || readOnly,
			type: 'button',
			onclick: noop
		}, [
			useTestProperties ? 'clear foo' : 'clear ',
			w(Icon, { type: 'closeIcon', onClick: noop })
		]) : null,
		v('button', {
			key: 'trigger',
			classes: css.trigger,
			disabled: disabled || readOnly,
			tabIndex: -1,
			type: 'button',
			onclick: noop
		}, [
			useTestProperties ? 'open foo' : 'open ',
			w(Icon, { type: 'downIcon', onClick: noop })
		])
	]);

	return controlsVdom;
};

const getExpectedMenu = function(useTestProperties: boolean, open: boolean, overrides = {}) {
	if (!open || !useTestProperties) {
		return null;
	}

	return v('div', {
		key: 'dropdown',
		classes: css.dropdown,
		onmouseover: noop,
		onmousedown: noop
	}, [
		w(Listbox, {
			activeIndex: 0,
			id: '',
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
			...overrides
		})
	]);
};

const getExpectedVdom = function(useTestProperties = false, open = false, label = false, states: States = {}, callFocus = false, focused = false) {
	const menuVdom = getExpectedMenu(useTestProperties, open);
	const controlsVdom = getExpectedControls(useTestProperties, label, states, callFocus);
	const { disabled, invalid, readOnly, required } = states;

	return v('div', {
		'aria-expanded': open ? 'true' : 'false',
		'aria-haspopup': 'true',
		'aria-readonly': readOnly ? `${readOnly}` : null,
		'aria-required': null,
		dir: '',
		classes: [
			css.root,
			open ? css.open : null,
			useTestProperties ? css.clearable : null,
			focused ? css.focused : null,
			null,
			null
		],
		key: 'root',
		lang: null,
		role: 'combobox'
	}, [
		label ? w(Label, {
			key: 'label',
			theme: useTestProperties ? {} : undefined,
			disabled,
			focused,
			hidden: undefined,
			invalid,
			readOnly,
			required,
			forId: useTestProperties ? 'foo' : ''
		}, [ 'foo' ]) : null,
		controlsVdom,
		menuVdom
	]);
};

registerSuite('ComboBox', {
	tests: {
		'renders with default properties'() {
			const h = harness(() => w(ComboBox, {}));
			h.expect(getExpectedVdom);
		},

		'renders with custom properties'() {
			const h = harness(() => w(ComboBox, testProperties));
			h.expect(() => getExpectedVdom(true, false, true));
		},

		'dropdown renders correctly when open'() {
			const h = harness(() => w(ComboBox, testProperties));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expect(() => getExpectedVdom(true, true, true, {}, true));
		},

		'arrow click opens menu'() {
			const onRequestResults = sinon.stub();
			const onMenuChange = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				onRequestResults,
				onMenuChange
			}));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expect(() => getExpectedVdom(true, true, true, {}, true));
			assert.isTrue(onRequestResults.calledOnce, 'onRequestResults called when menu is opened');
			assert.isTrue(onMenuChange.calledOnce, 'onMenuChange called when menu is opened');
		},

		'menu opens on input'() {
			const onChange = sinon.stub();
			const onRequestResults = sinon.stub();
			const onMenuChange = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				label: undefined,
				onChange,
				onRequestResults,
				onMenuChange
			}));

			h.trigger('@textinput', 'onInput', 'foo');
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));

			assert.isTrue(onChange.calledWith('foo'), 'onChange callback called with input value');
			assert.isTrue(onRequestResults.calledOnce, 'onRequestResults callback called');
			assert.isTrue(onMenuChange.calledOnce, 'onMenuChange called when menu is opened');
		},

		'menu closes on input blur'() {
			const onBlur = sinon.stub();
			const onMenuChange = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				onBlur,
				onMenuChange
			}));

			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));

			h.trigger('@textinput', 'onBlur', 'foo');
			h.expect(() => getExpectedVdom(true, false, true));
			assert.isTrue(onBlur.calledWith('foo'), 'onBlur callback called with input value');
			assert.isTrue(onMenuChange.calledTwice, 'onMenuChange called twice');
		},

		'blur ignored when clicking option'() {
			const onBlur = sinon.stub();
			const onMenuChange = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				onBlur,
				onMenuChange
			}));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));

			h.trigger('@dropdown', 'onmousedown', stubEvent);
			h.trigger('@textinput', 'onBlur', 'foo');

			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));
			assert.isFalse(onBlur.called, 'onBlur not called for dropdown click');
			assert.isFalse(onMenuChange.calledTwice, 'onMenuChange only called once');
		},

		'menu closes on result selection'() {
			const onChange = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				onChange
			}));

			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@listbox', 'onOptionSelect', testOptions[1], 1);
			assert.isTrue(onChange.calledWith('Two'), 'onChange callback called with label of second option');
			h.expect(() => getExpectedVdom(true, false, true, {}, true));
		},

		'keyboard opens and closes menu'() {
			const onRequestResults = sinon.stub();
			const preventDefault = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				onRequestResults
			}));

			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true }));
			assert.isTrue(onRequestResults.calledOnce, 'onRequestResults called when menu is opened');
			assert.isTrue(preventDefault.calledOnce, 'down key press prevents default page scroll');

			h.trigger('@textinput', 'onKeyDown', Keys.Escape, preventDefault);
			h.expect(() => getExpectedVdom(true, false, true));
		},

		'listbox onActiveIndexChange'() {
			const h = harness(() => w(ComboBox, testProperties ));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@listbox', 'onActiveIndexChange', 1);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { activeIndex: 1 }));
		},

		'keyboard navigates options'() {
			const preventDefault = sinon.stub();
			const h = harness(() => w(ComboBox, testProperties ));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 1 }));
			h.trigger('@textinput', 'onKeyDown', Keys.Up, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 0 }));
			h.trigger('@textinput', 'onKeyDown', Keys.Up, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 2 }));
			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 0 }));
			h.trigger('@textinput', 'onKeyDown', Keys.End, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 2 }));
			h.trigger('@textinput', 'onKeyDown', Keys.Home, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 0 }));
			assert.strictEqual(preventDefault.callCount, 4, 'preventDefault called four times for up and down keys');
		},

		'enter and space select option'() {
			const onChange = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				onChange
			}));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Enter, () => {});

			assert.isTrue(onChange.calledWith('One'), 'enter triggers onChange callback called with label of first option');
			h.expect(() => getExpectedVdom(true, false, true, {}, true));

			h.trigger('@textinput', 'onKeyDown', Keys.Enter, () => {});
			assert.isFalse(onChange.calledTwice, 'enter does not trigger onChange when menu is closed');
			onChange.reset();

			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Space, () => {});
			assert.isTrue(onChange.calledWith('One'), 'space triggers onChange callback called with label of first option');
			h.expect(() => getExpectedVdom(true, false, true, {}, true));
		},

		'disabled options are not selected'() {
			const onChange = sinon.stub();
			const preventDefault = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				isResultDisabled: (result: any) => !!result.disabled,
				onChange
			}));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Up, preventDefault);
			h.trigger('@textinput', 'onKeyDown', Keys.Enter, preventDefault);

			assert.isFalse(onChange.called, 'onChange not called for disabled option');
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, {
				visualFocus: true,
				getOptionDisabled: noop,
				activeIndex: 2
			}));
		},

		'keyboard does not trigger onChange with no results'() {
			const onChange = sinon.stub();
			const preventDefault = sinon.stub();
			const h = harness(() => w(ComboBox, { onChange }));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.expect(() => getExpectedVdom(false, true, false, {}, true));

			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.trigger('@textinput', 'onKeyDown', Keys.Enter, preventDefault);

			assert.isFalse(onChange.called, 'onChange not called for no results');
		},

		'clear button clears input'() {
			const onChange = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				onChange
			}));
			h.trigger(`.${css.clear}`, 'onclick', stubEvent);
			assert.isTrue(onChange.calledWith(''), 'clear button calls onChange with an empty string');
		},

		'inputProperties transferred to child input'() {
			const h = harness(() => w(ComboBox, {
				inputProperties: {
					placeholder: 'foo'
				}
			}));

			h.expectPartial('@textinput', () => w(TextInput, {
				key: 'textinput',
				aria: {
					activedescendant: '',
					controls: '',
					owns: ''
				},
				placeholder: 'foo',
				focus: false,
				disabled: undefined,
				id: '',
				invalid: undefined,
				readOnly: undefined,
				required: undefined,
				theme: undefined,
				value: '',
				onBlur: noop,
				onFocus: noop,
				onInput: noop,
				onKeyDown: noop
			}));
		},

		'input opens on focus with openOnFocus'() {
			const onFocus = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				openOnFocus: true,
				onFocus
			}));
			h.trigger('@textinput', 'onFocus', 'foo');

			assert.isTrue(onFocus.calledWith('foo'), 'onFocus handler called with input value');
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));
		},

		'widget states render correctly'() {
			let invalid = true;
			const h = harness(() => w(ComboBox, {
				...testProperties,
				disabled: true,
				invalid,
				readOnly: true,
				required: true
			}));

			h.expectPartial('@textinput', () => w(TextInput, {
				key: 'textinput',
				aria: {
					activedescendant: '',
					controls: '',
					owns: ''
				},
				id: 'foo',
				focus: false,
				disabled: true,
				invalid: true,
				readOnly: true,
				required: true,
				theme: {},
				value: 'one',
				onBlur: noop,
				onFocus: noop,
				onInput: noop,
				onKeyDown: noop
			}));

			h.expectPartial('@label', () => w(Label, {
				key: 'label',
				theme: {},
				disabled: true,
				focused: false,
				readOnly: true,
				invalid: true,
				required: true,
				hidden: undefined,
				forId: 'foo'
			}, [ 'foo' ]));

			h.expectPartial('@clear', () => v('button', {
				'aria-controls': '',
				key: 'clear',
				classes: css.clear,
				disabled: true,
				type: 'button',
				onclick: noop
			}, [
				'clear foo',
				w(Icon, { type: 'closeIcon', onClick: noop })
			]));

			h.expectPartial('@trigger', () => v('button', {
				key: 'trigger',
				classes: css.trigger,
				disabled: true,
				tabIndex: -1,
				type: 'button',
				onclick: noop
			}, [
				'open foo',
				w(Icon, { type: 'downIcon', onClick: noop })
			]));

			invalid = false;

			h.expectPartial('@textinput', () => w(TextInput, {
				key: 'textinput',
				aria: {
					activedescendant: '',
					controls: '',
					owns: ''
				},
				id: 'foo',
				focus: false,
				disabled: true,
				invalid: false,
				readOnly: true,
				required: true,
				theme: {},
				value: 'one',
				onBlur: noop,
				onFocus: noop,
				onInput: noop,
				onKeyDown: noop
			}));
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
			const h = harness(() => w(MockMetaMixin(ComboBox, mockMeta), {}), [ compareId ]);
			h.expect(() => getExpectedVdom(false, false, false, {}, false, true));
		},

		'disabled state blocks menu opening'() {
			const onMenuChange = sinon.stub();
			const onRequestResults = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				disabled: true,
				onMenuChange,
				onRequestResults
			}));

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
			const h = harness(() => w(ComboBox, {
				...testProperties,
				readOnly: true,
				onMenuChange,
				onRequestResults
			}));

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
			h.expect(() =>  getExpectedVdom(true, false, true));
			h.trigger(`.${css.trigger}`, 'onclick', stubEvent);
			h.trigger('@textinput', 'onKeyDown', Keys.Up, preventDefault);
			h.trigger('@textinput', 'onKeyDown', Keys.Down, preventDefault);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true }));
			h.trigger('@dropdown', 'onmouseover', stubEvent);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));
		}
	}
});
