const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import ComboBox from '../../ComboBox';
import Label from '../../../label/Label';
import Listbox from '../../../listbox/Listbox';
import TextInput from '../../../textinput/TextInput';
import * as css from '../../../theme/combobox/comboBox.m.css';
import * as iconCss from '../../../theme/common/icons.m.css';
import {
	createHarness,
	compareId,
	compareAria,
	compareAriaControls,
	noop
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

const getExpectedControls = function(useTestProperties: boolean, label: boolean, states: States = {}, focus = false) {
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
			focus,
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
			disabled,
			readOnly,
			onclick: noop
		}, [
			useTestProperties ? 'clear foo' : 'clear ',
			v('i', { classes: [ iconCss.icon, iconCss.closeIcon ],
				role: 'presentation', 'aria-hidden': 'true'
			})
		]) : null,
		v('button', {
			key: 'trigger',
			classes: css.trigger,
			disabled,
			readOnly,
			tabIndex: -1,
			onclick: noop
		}, [
			useTestProperties ? 'open foo' : 'open ',
			v('i', {
				'aria-hidden': 'true',
				classes: [ iconCss.icon, iconCss.downIcon ],
				role: 'presentation'
			})
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
			onActiveIndexChange: noop,
			onOptionSelect: noop,
			theme: useTestProperties ? {} : undefined,
			...overrides
		})
	]);
};

const getExpectedVdom = function(useTestProperties = false, open = false, label = false, states: States = {}, focus = false) {
	const menuVdom = getExpectedMenu(useTestProperties, open);
	const controlsVdom = getExpectedControls(useTestProperties, label, states, focus);
	const { disabled, invalid, readOnly, required } = states;

	return v('div', {
		'aria-expanded': open ? 'true' : 'false',
		'aria-haspopup': 'true',
		'aria-readonly': readOnly ? `${readOnly}` : null,
		'aria-required': null,
		dir: null,
		classes: [
			css.root,
			open ? css.open : null,
			useTestProperties ? css.clearable : null,
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
			h.trigger(`.${css.trigger}`, 'onclick');
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
			h.trigger(`.${css.trigger}`, 'onclick');
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

			h.trigger('@textinput', 'onInput', { target: { value: 'foo' } });
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

			h.trigger(`.${css.trigger}`, 'onclick');
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));

			h.trigger('@textinput', 'onBlur', { target: { value: 'foo' } });
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
			h.trigger(`.${css.trigger}`, 'onclick');
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));

			h.trigger('@dropdown', 'onmousedown');
			h.trigger('@textinput', 'onBlur', { target: { value: 'foo' } });

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

			h.trigger(`.${css.trigger}`, 'onclick');
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

			h.trigger('@textinput', 'onKeyDown', { which: Keys.Down, preventDefault });
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true }));
			assert.isTrue(onRequestResults.calledOnce, 'onRequestResults called when menu is opened');
			assert.isTrue(preventDefault.calledOnce, 'down key press prevents default page scroll');

			h.trigger('@textinput', 'onKeyDown', { which: Keys.Escape });
			h.expect(() => getExpectedVdom(true, false, true));
		},

		'listbox onActiveIndexChange'() {
			const h = harness(() => w(ComboBox, testProperties ));
			h.trigger(`.${css.trigger}`, 'onclick');
			h.trigger('@listbox', 'onActiveIndexChange', 1);
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { activeIndex: 1 }));
		},

		'keyboard navigates options'() {
			const preventDefault = sinon.stub();
			const h = harness(() => w(ComboBox, testProperties ));
			h.trigger(`.${css.trigger}`, 'onclick');
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Down, preventDefault });
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 1 }));
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Up, preventDefault });
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 0 }));
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Up, preventDefault });
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 2 }));
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Down, preventDefault });
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 0 }));
			h.trigger('@textinput', 'onKeyDown', { which: Keys.End, preventDefault });
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 2 }));
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Home, preventDefault });
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true, activeIndex: 0 }));
			assert.strictEqual(preventDefault.callCount, 4, 'preventDefault called four times for up and down keys');
		},

		'enter and space select option'() {
			const onChange = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				onChange
			}));
			h.trigger(`.${css.trigger}`, 'onclick');
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Enter });

			assert.isTrue(onChange.calledWith('One'), 'enter triggers onChange callback called with label of first option');
			h.expect(() => getExpectedVdom(true, false, true, {}, true));

			h.trigger('@textinput', 'onKeyDown', { which: Keys.Enter });
			assert.isFalse(onChange.calledTwice, 'enter does not trigger onChange when menu is closed');
			onChange.reset();

			h.trigger(`.${css.trigger}`, 'onclick');
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Space });
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
			h.trigger(`.${css.trigger}`, 'onclick');
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Up, preventDefault });
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Enter, preventDefault });

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
			h.trigger(`.${css.trigger}`, 'onclick');
			h.expect(() => getExpectedVdom(false, true, false, {}, true));

			h.trigger('@textinput', 'onKeyDown', { which: Keys.Down, preventDefault });
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Enter, preventDefault });

			assert.isFalse(onChange.called, 'onChange not called for no results');
		},

		'clear button clears input'() {
			const onChange = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				onChange
			}));
			h.trigger(`.${css.clear}`, 'onclick');
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
			h.trigger('@textinput', 'onFocus', { target: { value: 'foo' } });

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
				readOnly: true,
				onclick: noop
			}, [
				'clear foo',
				v('i', { classes: [ iconCss.icon, iconCss.closeIcon ],
					role: 'presentation', 'aria-hidden': 'true'
				})
			]));

			h.expectPartial('@trigger', () => v('button', {
				key: 'trigger',
				classes: css.trigger,
				disabled: true,
				readOnly: true,
				tabIndex: -1,
				onclick: noop
			}, [
				'open foo',
				v('i', {
					'aria-hidden': 'true',
					classes: [ iconCss.icon, iconCss.downIcon ],
					role: 'presentation'
				})
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

		'disabled state blocks menu opening'() {
			const onMenuChange = sinon.stub();
			const onRequestResults = sinon.stub();
			const h = harness(() => w(ComboBox, {
				...testProperties,
				disabled: true,
				onMenuChange,
				onRequestResults
			}));

			h.trigger(`.${css.trigger}`, 'onclick');
			h.expect(() => getExpectedVdom(true, false, true, { disabled: true }));
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Down, preventDefault: sinon.stub() });
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

			h.trigger(`.${css.trigger}`, 'onclick');
			h.expect(() => getExpectedVdom(true, false, true, { readOnly: true }));
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Down, preventDefault: sinon.stub() });
			h.expect(() => getExpectedVdom(true, false, true, { readOnly: true }));

			assert.isFalse(onMenuChange.called, 'onMenuChange never called');
			assert.isFalse(onRequestResults.called, 'onRequestResults never called');
		},

		'hover and keyboard events toggle visualFocus'() {
			const preventDefault = sinon.stub();
			const h = harness(() => w(ComboBox, { ...testProperties }));
			h.expect(() =>  getExpectedVdom(true, false, true));
			h.trigger(`.${css.trigger}`, 'onclick');
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Up, preventDefault });
			h.trigger('@textinput', 'onKeyDown', { which: Keys.Down, preventDefault });
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true, { visualFocus: true }));
			h.trigger('@dropdown', 'onmouseover');
			h.expectPartial('@dropdown', () => getExpectedMenu(true, true));
		}
	}
});
