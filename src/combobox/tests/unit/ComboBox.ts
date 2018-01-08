const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, compareProperty, findKey } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import ComboBox from '../../ComboBox';
import Label from '../../../label/Label';
import Listbox from '../../../listbox/Listbox';
import TextInput from '../../../textinput/TextInput';
import * as css from '../../../theme/combobox/comboBox.m.css';
import * as iconCss from '../../../theme/common/icons.m.css';

let widget: Harness<ComboBox>;

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

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

const getExpectedControls = function(widget: Harness<ComboBox>, useTestProperties: boolean, label: boolean) {
	const controlsVdom = v('div', {
		classes: css.controls
	}, [
		w(TextInput, {
			key: 'textinput',
			aria: {
				activedescendant: compareId,
				controls: compareId,
				owns: compareId
			},
			disabled: undefined,
			invalid: undefined,
			readOnly: undefined,
			required: undefined,
			theme: useTestProperties ? {} : undefined,
			value: useTestProperties ? 'one' : '',
			onBlur: widget.listener,
			onFocus: widget.listener,
			onInput: widget.listener,
			onKeyDown: widget.listener
		}),
		useTestProperties ? v('button', {
			'aria-controls': compareId as any,
			key: 'clear',
			classes: css.clear,
			disabled: undefined,
			readOnly: undefined,
			onclick: widget.listener
		}, [
			useTestProperties ? 'clear foo' : 'clear ',
			v('i', { classes: [ iconCss.icon, iconCss.closeIcon ],
				role: 'presentation', 'aria-hidden': 'true'
			})
		]) : null,
		v('button', {
			key: 'trigger',
			classes: css.trigger,
			disabled: undefined,
			readOnly: undefined,
			tabIndex: -1,
			onclick: widget.listener
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

function isOpen(widget: Harness<ComboBox>): boolean {
	const vdom = widget.getRender();
	return (vdom as any)!.properties!['aria-expanded'] === 'true';
}

const getExpectedMenu = function(widget: Harness<ComboBox>, useTestProperties: boolean, open: boolean) {
	if (!open || !useTestProperties) {
		return null;
	}

	return v('div', {
		key: 'dropdown',
		classes: css.dropdown,
		onmouseover: widget.listener,
		onmousedown: widget.listener
	}, [
		w(Listbox, {
			activeIndex: 0,
			id: compareId as any,
			key: 'listbox',
			visualFocus: false,
			optionData: testOptions,
			tabIndex: -1,
			getOptionDisabled: undefined,
			getOptionId: widget.listener as any,
			getOptionLabel: widget.listener as any,
			onActiveIndexChange: widget.listener,
			onOptionSelect: widget.listener,
			theme: useTestProperties ? {} : undefined
		})
	]);
};

const getExpectedVdom = function(widget: Harness<ComboBox>, useTestProperties = false, open = false, label = false) {
	const menuVdom = getExpectedMenu(widget, useTestProperties, open);
	const controlsVdom = getExpectedControls(widget, useTestProperties, label);

	return v('div', {
		'aria-expanded': open ? 'true' : 'false',
		'aria-haspopup': 'true',
		'aria-readonly': null,
		'aria-required': null,
		dir: null,
		id: useTestProperties ? 'foo' : undefined,
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
			theme: undefined,
			disabled: undefined,
			hidden: undefined,
			invalid: undefined,
			readOnly: undefined,
			required: undefined,
			forId: compareId
		}, [ 'foo' ]) : null,
		controlsVdom,
		menuVdom
	]);
};

registerSuite('ComboBox', {
	beforeEach() {
		widget = harness(ComboBox);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'renders with default properties'() {
			const expected = getExpectedVdom(widget);
			widget.expectRender(expected);
		},

		'renders with custom properties'() {
			widget.setProperties(testProperties);
			const expected = getExpectedVdom(widget, true, false, true);
			widget.expectRender(expected);
		},

		'dropdown renders correctly when open'() {
			widget.setProperties(testProperties);
			widget.sendEvent('click', { selector: `.${css.trigger}` });

			let expected = getExpectedVdom(widget, true, false, true);
			expected = getExpectedVdom(widget, true, true, true);
			widget.expectRender(expected);
		},

		'arrow click opens menu'() {
			const onRequestResults = sinon.stub();
			const onMenuChange = sinon.stub();
			widget.setProperties({
				...testProperties,
				onRequestResults,
				onMenuChange
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			assert.isTrue(isOpen(widget), 'widget is open after arrow click');
			assert.isTrue(onRequestResults.calledOnce, 'onRequestResults called when menu is opened');
			assert.isTrue(onMenuChange.calledOnce, 'onMenuChange called when menu is opened');
		},

		'menu opens on input'() {
			const onChange = sinon.stub();
			const onRequestResults = sinon.stub();
			const onMenuChange = sinon.stub();
			widget.setProperties({
				...testProperties,
				label: undefined,
				onChange,
				onRequestResults,
				onMenuChange
			});

			widget.callListener('onInput', {
				args: [ { target: { value: 'foo' } } ],
				key: 'textinput'
			});

			assert.isTrue(isOpen(widget), 'widget is open after input event');
			assert.isTrue(onChange.calledWith('foo'), 'onChange callback called with input value');
			assert.isTrue(onRequestResults.calledOnce, 'onRequestResults callback called');
			assert.isTrue(onMenuChange.calledOnce, 'onMenuChange called when menu is opened');
		},

		'menu closes on input blur'() {
			const onBlur = sinon.stub();
			const onMenuChange = sinon.stub();
			widget.setProperties({
				...testProperties,
				label: undefined,
				onBlur,
				onMenuChange
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			assert.isTrue(isOpen(widget), 'widget is open after arrow click');

			widget.callListener('onBlur', {
				args: [ { target: { value: 'foo' } } ],
				key: 'textinput'
			});
			assert.isTrue(onBlur.calledWith('foo'), 'onBlur callback called with input value');
			assert.isFalse(isOpen(widget), 'widget is closed after input blur');
			assert.isTrue(onMenuChange.calledTwice, 'onMenuChange called twice');
		},

		'blur ignored when clicking option'() {
			const onBlur = sinon.stub();
			const onMenuChange = sinon.stub();
			widget.setProperties({
				...testProperties,
				label: undefined,
				onBlur,
				onMenuChange
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			assert.isTrue(isOpen(widget), 'widget is open after arrow click');

			widget.sendEvent('mousedown', { key: 'dropdown' });
			widget.callListener('onBlur', {
				args: [ { target: { value: 'foo' } } ],
				key: 'textinput'
			});

			assert.isFalse(onBlur.called, 'onBlur not called for dropdown click');
			assert.isTrue(isOpen(widget), 'dropdown not closed for dropdown click');
			assert.isFalse(onMenuChange.calledTwice, 'onMenuChange only called once');
		},

		'menu closes on result selection'() {
			const onChange = sinon.stub();
			widget.setProperties({
				...testProperties,
				label: undefined,
				onChange
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			assert.isTrue(isOpen(widget), 'widget is open after arrow click');

			widget.callListener('onOptionSelect', {
				args: [ testOptions[1], 1 ],
				index: '1,0'
			});
			assert.isTrue(onChange.calledWith('Two'), 'onChange callback called with label of second option');
			assert.isFalse(isOpen(widget), 'widget is closed after selecting option');
		},

		'keyboard opens and closes menu'() {
			const onRequestResults = sinon.stub();
			const preventDefault = sinon.stub();
			widget.setProperties({
				...testProperties,
				label: undefined,
				onRequestResults
			});

			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Down, preventDefault } ],
				key: 'textinput'
			});
			assert.isTrue(isOpen(widget), 'widget is open after down key press');
			assert.isTrue(onRequestResults.calledOnce, 'onRequestResults called when menu is opened');
			assert.isTrue(preventDefault.calledOnce, 'down key press prevents default page scroll');

			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Escape } ],
				key: 'textinput'
			});
			assert.isFalse(isOpen(widget), 'widget is closed after escape key press');
		},

		'listbox onActiveIndexChange'() {
			widget.setProperties(testProperties);
			let expected = getExpectedVdom(widget, true, true, true);

			// open dropdown
			widget.sendEvent('click', { selector: `.${css.trigger}` });
			widget.callListener('onActiveIndexChange', {
				args: [ 1 ],
				key: 'listbox'
			});

			expected = getExpectedVdom(widget, true, true, true);
			assignProperties(findKey(expected, 'listbox')!, { activeIndex: 1 });

			widget.expectRender(expected);
		},

		'keyboard navigates options'() {
			const preventDefault = sinon.stub();
			const expected = getExpectedVdom(widget, true, true, true);

			widget.setProperties({
				...testProperties,
				label: undefined
			});
			// open dropdown
			widget.sendEvent('click', { selector: `.${css.trigger}` });

			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Down, preventDefault } ],
				key: 'textinput'
			});

			// shouldn't need this line with correct bind
			widget.setProperties(testProperties);
			assignProperties(findKey(expected, 'listbox')!, {
				activeIndex: 1,
				visualFocus: true
			});
			widget.expectRender(expected, 'down arrow moves active index to second option and sets visualFocus to true');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Up, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignProperties(findKey(expected, 'listbox')!, {
				activeIndex: 0
			});
			widget.expectRender(expected, 'up arrow moves active index to first option');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Up, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignProperties(findKey(expected, 'listbox')!, {
				activeIndex: 2
			});
			widget.expectRender(expected, 'up arrow wraps to last option');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Down, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignProperties(findKey(expected, 'listbox')!, {
				activeIndex: 0
			});
			widget.expectRender(expected, 'down arrow wraps to first option');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.End, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignProperties(findKey(expected, 'listbox')!, {
				activeIndex: 2
			});
			widget.expectRender(expected, 'end moves to last option');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Home, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignProperties(findKey(expected, 'listbox')!, {
				activeIndex: 0
			});
			widget.expectRender(expected, 'home moves to first option');

			assert.strictEqual(preventDefault.callCount, 4, 'preventDefault called four times for up and down keys');
		},

		'enter and space select option'() {
			const onChange = sinon.stub();
			widget.setProperties({
				...testProperties,
				label: undefined,
				onChange
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Enter } ],
				key: 'textinput'
			});
			assert.isTrue(onChange.calledWith('One'), 'enter triggers onChange callback called with label of first option');
			assert.isFalse(isOpen(widget), 'widget is closed after selecting option');

			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Enter } ],
				key: 'textinput'
			});
			assert.isFalse(onChange.calledTwice, 'enter doesn\'t trigger onChange when menu is closed');

			onChange.reset();

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Space } ],
				key: 'textinput'
			});
			assert.isTrue(onChange.calledWith('One'), 'space triggers onChange callback called with label of first option');
			assert.isFalse(isOpen(widget), 'widget is closed after selecting option');
		},

		'disabled options are not selected'() {
			const onChange = sinon.stub();
			widget.setProperties({
				...testProperties,
				label: undefined,
				isResultDisabled: (result: any) => !!result.disabled,
				onChange
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Up, preventDefault: sinon.stub() } ],
				key: 'textinput'
			});
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Enter } ],
				key: 'textinput'
			});

			assert.isFalse(onChange.called, 'onChange not called for disabled option');
			assert.isTrue(isOpen(widget), 'widget not closed after attempting to select disabled option');
		},

		'keyboard does not trigger onChange with no results'() {
			const onChange = sinon.stub();
			let expected = getExpectedVdom(widget);
			widget.setProperties({
				onChange
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			expected = getExpectedVdom(widget, false, true);
			widget.expectRender(expected, 'dropdown does not render with no results');

			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Down, preventDefault: sinon.stub() } ],
				key: 'textinput'
			});
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Enter } ],
				key: 'textinput'
			});

			assert.isFalse(onChange.called, 'onChange not called for no results');
			assert.isTrue(isOpen(widget), 'widget technically open with no results');
		},

		'clear button clears input'() {
			const onChange = sinon.stub();
			widget.setProperties({
				...testProperties,
				onChange
			});

			widget.sendEvent('click', { selector: `.${css.clear}` });
			assert.isTrue(onChange.calledWith(''), 'clear button calls onChange with an empty string');
		},

		'inputProperties transferred to child input'() {
			widget.setProperties({
				inputProperties: {
					placeholder: 'foo'
				}
			});

			const expected = getExpectedVdom(widget);
			assignProperties(findKey(expected, 'textinput')!, { placeholder: 'foo' });

			widget.expectRender(expected);
		},

		'input opens on focus with openOnFocus'() {
			const onFocus = sinon.stub();
			widget.setProperties({
				...testProperties,
				label: undefined,
				openOnFocus: true,
				onFocus
			});

			widget.callListener('onFocus', {
				args: [ { target: { value: 'foo' } } ],
				key: 'textinput'
			});

			assert.isTrue(onFocus.calledWith('foo'), 'onFocus handler called with input value');
			assert.isTrue(isOpen(widget), 'widget opens on input focus');
		},

		'widget states render correctly'() {
			widget.setProperties({
				...testProperties,
				disabled: true,
				invalid: true,
				readOnly: true,
				required: true
			});

			let expected = getExpectedVdom(widget, true, false, true);
			assignProperties(findKey(expected, 'textinput')!, {
				disabled: true,
				invalid: true,
				readOnly: true,
				required: true
			});
			assignProperties(findKey(expected, 'label')!, {
				disabled: true,
				readOnly: true,
				invalid: true,
				required: true
			});
			assignProperties(findKey(expected, 'clear')!, {
				disabled: true,
				readOnly: true
			});
			assignProperties(findKey(expected, 'trigger')!, {
				disabled: true,
				readOnly: true
			});
			assignProperties(expected, {
				'aria-readonly': 'true',
				'aria-required': 'true',
				classes: [ css.root, null, css.clearable, css.invalid, null ]
			});
			widget.expectRender(expected, 'disabled, invalid, readOnly, and required render');

			widget.setProperties({ invalid: false });
			expected = getExpectedVdom(widget);
			assignProperties(findKey(expected, 'textinput')!, {
				invalid: false
			});
			assignProperties(expected, {
				classes: [ css.root, null, null, null, css.valid ]
			});
			widget.expectRender(expected, 'valid render');
		},

		'disabled state blocks menu opening'() {
			const onMenuChange = sinon.stub();
			const onRequestResults = sinon.stub();
			widget.setProperties({
				...testProperties,
				disabled: true,
				label: undefined,
				onMenuChange,
				onRequestResults
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			assert.isFalse(isOpen(widget), 'widget stays closed on arrow click');

			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Down, preventDefault: sinon.stub() } ],
				key: 'textinput'
			});
			assert.isFalse(isOpen(widget), 'widget stays closed on key down');

			assert.isFalse(onMenuChange.called, 'onMenuChange never called');
			assert.isFalse(onRequestResults.called, 'onRequestResults never called');
		},

		'readOnly state blocks menu opening'() {
			const onMenuChange = sinon.stub();
			const onRequestResults = sinon.stub();
			widget.setProperties({
				...testProperties,
				readOnly: true,
				label: undefined,
				onMenuChange,
				onRequestResults
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			assert.isFalse(isOpen(widget), 'widget stays closed on arrow click');

			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Down, preventDefault: sinon.stub() } ],
				key: 'textinput'
			});
			assert.isFalse(isOpen(widget), 'widget stays closed on key down');

			assert.isFalse(onMenuChange.called, 'onMenuChange never called');
			assert.isFalse(onRequestResults.called, 'onRequestResults never called');
		},

		'hover and keyboard events toggle visualFocus'() {
			widget.setProperties({ ...testProperties, label: undefined });
			let expected = getExpectedVdom(widget, true, true, true);
			expected = getExpectedVdom(widget, true, true, true);

			widget.sendEvent('click', { selector: `.${css.trigger}` });

			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Up, preventDefault: sinon.stub() } ],
				key: 'textinput'
			});
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Down, preventDefault: sinon.stub() } ],
				key: 'textinput'
			});
			assignProperties(findKey(expected, 'listbox')!, {
				visualFocus: true
			});
			// only necessary for label scoping issue
			widget.setProperties(testProperties);
			widget.expectRender(expected, 'keydown event sets visualFocus to true');

			widget.sendEvent('mouseover', { key: 'dropdown' });
			assignProperties(findKey(expected, 'listbox')!, {
				visualFocus: false
			});
			widget.expectRender(expected, 'mouseover event sets visualFocus to false');
		}
	}
});
