const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, assignChildProperties, compareProperty } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import ComboBox from '../../ComboBox';
import Listbox from '../../../listbox/Listbox';
import Label from '../../../label/Label';
import TextInput from '../../../textinput/TextInput';
import * as css from '../../styles/comboBox.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

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

const expectedControls = function(widget: Harness<ComboBox>, useTestProperties: boolean, label: boolean) {
	const controlsVdom = v('div', {
		classes: css.controls
	}, [
		w(TextInput, <any> {
			key: 'textinput',
			'aria-activedescendant': <any> compareId,
			'aria-owns': <any> compareId,
			classes: useTestProperties ? css.clearable : null,
			controls: <any> compareId,
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
			'aria-controls': <any> compareId,
			classes: css.clear,
			disabled: undefined,
			readOnly: undefined,
			onclick: widget.listener
		}, [
			'clear combo box',
			v('i', { classes: [ iconCss.icon, iconCss.closeIcon ],
				role: 'presentation', 'aria-hidden': 'true'
			})
		]) : null,
		v('button', {
			classes: css.trigger,
			disabled: undefined,
			readOnly: undefined,
			tabIndex: -1,
			onclick: widget.listener
		}, [
			'open combo box',
			v('i', {
				'aria-hidden': 'true',
				classes: [ iconCss.icon, iconCss.downIcon ],
				role: 'presentation'
			})
		])
	]);

	if (label) {
		return w(Label, {
			label: 'foo',
			theme: useTestProperties ? {} : undefined
		}, [ controlsVdom ]);
	}

	return controlsVdom;
};

function isOpen(widget: Harness<ComboBox>): boolean {
	const vdom = widget.getRender();
	return (<any> vdom)!.properties!['aria-expanded'] === 'true';
}

const expectedMenu = function(widget: Harness<ComboBox>, useTestProperties: boolean, open: boolean) {
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
			id: <any> compareId,
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

const expectedVdom = function(widget: Harness<ComboBox>, useTestProperties = false, open = false, label = false) {
	const menuVdom = expectedMenu(widget, useTestProperties, open);
	const controlsVdom = expectedControls(widget, useTestProperties, label);

	return v('div', {
		'aria-expanded': open ? 'true' : 'false',
		'aria-haspopup': 'true',
		'aria-readonly': 'false',
		'aria-required': 'false',
		id: useTestProperties ? 'foo' : undefined,
		classes: [
			css.root,
			open ? css.open : null,
			null,
			null
		],
		key: 'root',
		role: 'combobox'
	}, [
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
			const vdom = expectedVdom(widget);
			widget.expectRender(vdom);
		},

		'renders with custom properties'() {
			widget.setProperties(testProperties);
			const vdom = expectedVdom(widget, true, false, true);
			widget.expectRender(vdom);
		},

		'dropdown renders correctly when open'() {
			widget.setProperties(testProperties);
			widget.sendEvent('click', { selector: `.${css.trigger}` });

			let vdom = expectedVdom(widget, true, false, true);
			vdom = expectedVdom(widget, true, true, true);
			widget.expectRender(vdom);
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
			let vdom = expectedVdom(widget, true, true, true);

			// open dropdown
			widget.sendEvent('click', { selector: `.${css.trigger}` });
			widget.callListener('onActiveIndexChange', {
				args: [ 1 ],
				index: '1,0'
			});

			vdom = expectedVdom(widget, true, true, true);
			assignChildProperties(vdom, '1,0', { activeIndex: 1 });

			widget.expectRender(vdom);
		},

		'keyboard navigates options'() {
			const preventDefault = sinon.stub();
			let vdom = expectedVdom(widget, true, true, true);
			vdom = expectedVdom(widget, true, true, true);

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
			assignChildProperties(vdom, '1,0', {
				activeIndex: 1,
				visualFocus: true
			});
			widget.expectRender(vdom, 'down arrow moves active index to second option and sets visualFocus to true');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Up, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignChildProperties(vdom, '1,0', {
				activeIndex: 0
			});
			widget.expectRender(vdom, 'up arrow moves active index to first option');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Up, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignChildProperties(vdom, '1,0', {
				activeIndex: 2
			});
			widget.expectRender(vdom, 'up arrow wraps to last option');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Down, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignChildProperties(vdom, '1,0', {
				activeIndex: 0
			});
			widget.expectRender(vdom, 'down arrow wraps to first option');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.End, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignChildProperties(vdom, '1,0', {
				activeIndex: 2
			});
			widget.expectRender(vdom, 'end moves to last option');

			// shouldn't need this line with correct bind
			widget.setProperties({ ...testProperties, label: undefined });
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Home, preventDefault } ],
				key: 'textinput'
			});
			widget.setProperties(testProperties);
			assignChildProperties(vdom, '1,0', {
				activeIndex: 0
			});
			widget.expectRender(vdom, 'home moves to first option');

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
			let vdom = expectedVdom(widget);
			widget.setProperties({
				onChange
			});

			widget.sendEvent('click', { selector: `.${css.trigger}` });
			vdom = expectedVdom(widget, false, true);
			widget.expectRender(vdom, 'dropdown does not render with no results');

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

			const vdom = expectedVdom(widget);
			assignChildProperties(vdom, '0,0', { placeholder: 'foo' });

			widget.expectRender(vdom);
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

			let vdom = expectedVdom(widget, true, false, true);
			assignChildProperties(vdom, '0,0,0', {
				disabled: true,
				invalid: true,
				readOnly: true,
				required: true
			});
			assignChildProperties(vdom, '0,0,1', {
				disabled: true,
				readOnly: true
			});
			assignChildProperties(vdom, '0,0,2', {
				disabled: true,
				readOnly: true
			});
			assignProperties(vdom, {
				'aria-readonly': 'true',
				'aria-required': 'true',
				classes: [ css.root, null, css.invalid, null ]
			});
			widget.expectRender(vdom, 'disabled, invalid, readOnly, and required render');

			widget.setProperties({ invalid: false });
			vdom = expectedVdom(widget);
			assignChildProperties(vdom, '0,0', {
				invalid: false
			});
			assignProperties(vdom, {
				classes: [ css.root, null, null, css.valid ]
			});
			widget.expectRender(vdom, 'valid render');
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
			let vdom = expectedVdom(widget, true, true, true);
			vdom = expectedVdom(widget, true, true, true);

			widget.sendEvent('click', { selector: `.${css.trigger}` });

			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Up, preventDefault: sinon.stub() } ],
				key: 'textinput'
			});
			widget.callListener('onKeyDown', {
				args: [ { which: Keys.Down, preventDefault: sinon.stub() } ],
				key: 'textinput'
			});
			assignChildProperties(vdom, '1,0', {
				visualFocus: true
			});
			// only necessary for label scoping issue
			widget.setProperties(testProperties);
			widget.expectRender(vdom, 'keydown event sets visualFocus to true');

			widget.sendEvent('mouseover', { key: 'dropdown' });
			assignChildProperties(vdom, '1,0', {
				visualFocus: false
			});
			widget.expectRender(vdom, 'mouseover event sets visualFocus to false');
		}
	}
});
