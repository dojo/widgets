import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Select, { SelectOption } from '../../Select';
import * as css from '../../styles/select.m.css';

const testOptions: SelectOption[] = [
	{
		label: 'One',
		value: 'one',
		id: 'first'
	},
	{
		label: 'Two',
		value: 'two',
		selected: true
	},
	{
		label: 'Three',
		value: 'three',
		disabled: true
	}
];

const keys = {
	escape: 27,
	enter: 13,
	space: 32,
	up: 38,
	down: 40,
	home: 36,
	end: 35
};

// event always mocks interacting with second test option
function event(key = 0, optionIndex = 1) {
	return <any> {
		which: key,
		target: {
			value: testOptions[optionIndex].value,
			parentElement: {
				hasAttribute: () => true,
				getAttribute: () => optionIndex + ''
			},
			hasAttribute: () => false,
			getAttribute: () => false
		},
		preventDefault() { }
	};
}

registerSuite({
	name: 'Select',

	'Native Single Select': {
		'Options with correct attributes'() {
			const select = new Select();
			select.setProperties({
				options: testOptions,
				useNativeSelect: true
			});
			const vnode = <VNode> select.__render__();
			const selectNode = vnode.children![0].children![0];

			assert.strictEqual(selectNode.children!.length, 3);
			assert.strictEqual(selectNode.children![0].vnodeSelector, 'option');
			assert.strictEqual(selectNode.children![0].properties!.innerHTML, 'One');
			assert.strictEqual(selectNode.children![1].properties!.value, 'two');
			assert.isNull(selectNode.children![0].properties!.selected);
			assert.isNull(selectNode.children![1].properties!.selected, 'option.selected shouldn\'t affect single-select widgets');
			assert.isTrue(selectNode.children![2].properties!.disabled);
		},

		'correct node attributes'() {
			const select = new Select();
			select.setProperties({
				describedBy: 'id1',
				disabled: true,
				invalid: true,
				name: 'bar',
				readOnly: true,
				required: true,
				useNativeSelect: true,
				value: 'one'
			});
			const vnode = <VNode> select.__render__();
			const selectNode = vnode.children![0].children![0];

			// select props
			assert.strictEqual(selectNode.vnodeSelector, 'select');
			assert.isTrue(selectNode.properties!.classes![css.input]);
			assert.strictEqual(selectNode.properties!['aria-describedby'], 'id1');
			assert.isTrue(selectNode.properties!.disabled);
			assert.strictEqual(selectNode.properties!['aria-invalid'], 'true');
			assert.strictEqual(selectNode.properties!.name, 'bar');
			assert.isTrue(selectNode.properties!.readOnly);
			assert.strictEqual(selectNode.properties!['aria-readonly'], 'true');
			assert.isTrue(selectNode.properties!.required);
			assert.strictEqual(selectNode.properties!.value, 'one');
		},

		'Arrow'() {
			const select = new Select();
			select.setProperties({
				useNativeSelect: true
			});
			const vnode = <VNode> select.__render__();

			assert.strictEqual(vnode.children![0].children!.length, 2, 'Select node and arrow node rendered');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'span');
			assert.isTrue(vnode.children![0].children![1].properties!.classes![css.arrow]);
		},

		'basic events'() {
			let blurred = false,
					clicked = false,
					focused = false,
					keydown = false;

			const select = new Select();
			select.setProperties({
				useNativeSelect: true,
				onBlur: () => { blurred = true; },
				onClick: () => { clicked = true; },
				onFocus: () => { focused = true; },
				onKeyDown: () => { keydown = true; }
			});

			(<any> select)._onBlur(<FocusEvent> {});
			assert.isTrue(blurred);
			(<any> select)._onClick(<MouseEvent> {});
			assert.isTrue(clicked);
			(<any> select)._onFocus(<FocusEvent> {});
			assert.isTrue(focused);
			(<any> select)._onKeyDown(<KeyboardEvent> {});
			assert.isTrue(keydown);
		},

		'onChange called with correct option'() {
			const select = new Select();
			select.setProperties({
				options: testOptions,
				useNativeSelect: true,
				onChange: (option) => optionValue = option.label
			});
			const event = {
				target: {
					value: 'two'
				}
			};
			let optionValue;
			(<any> select)._onNativeChange(<any> event);
			assert.strictEqual(optionValue, 'Two');
		}
	},

	'Native Multi-select': {
		'Uses option.selected'() {
			const select = new Select();
			select.setProperties({
				multiple: true,
				options: testOptions,
				useNativeSelect: true
			});
			const vnode = <VNode> select.__render__();
			const selectNode = vnode.children![0].children![0];

			assert.strictEqual(selectNode.children!.length, 3);
			assert.isTrue(selectNode.children![1].properties!.selected, 'Second option should be selected');
		},

		'Correct attributes'() {
			const select = new Select();
			select.setProperties({
				multiple: true,
				options: testOptions,
				useNativeSelect: true,
				value: 'one'
			});
			const vnode = <VNode> select.__render__();
			const selectNode = vnode.children![0].children![0];

			assert.isTrue(selectNode.properties!.multiple);
			assert.isNull(selectNode.children![0].properties!.selected, 'Value not used for multiselect');
		}
	},

	'Custom Options': {
		'Correct generic attributes'() {
			const select = new Select();
			select.setProperties({
				options: testOptions
			});
			const vnode = <VNode> select.__render__();
			const selectNode = vnode.children![0].children![1];

			assert.strictEqual(selectNode.children!.length, 3);
			assert.strictEqual(selectNode.children![0].vnodeSelector, 'div');
			assert.strictEqual(selectNode.children![0].properties!.role, 'option', 'All custom options should have the role of option');
			assert.strictEqual(selectNode.children![0].properties!.id, 'first', 'Custom id from option.id should be used');
			assert.strictEqual(selectNode.children![0].properties!['data-dojo-index'], '0', 'Should set data-dojo-index based on index in options array');
			assert.strictEqual(selectNode.children![0].text, 'One');
			assert.isTrue(selectNode.children![0].properties!.classes![css.option], 'All options should have the class css.option');
			assert.isTrue(selectNode.children![0].properties!.classes![css.focused], 'First option should be focused by default');
		},

		'State attributes'() {
			const select = new Select();
			select.setProperties({
				options: testOptions,
				value: 'three'
			});
			const vnode = <VNode> select.__render__();
			const selectNode = vnode.children![0].children![1];

			assert.strictEqual(selectNode.children![1].properties!['aria-selected'], 'false', 'Single select should use value, not option.selected');
			assert.strictEqual(selectNode.children![2].properties!['aria-selected'], 'true', 'Third option should be selected');
			assert.strictEqual(selectNode.children![2].properties!['aria-disabled'], 'true', 'Third option should be disabled');
		},

		'Custom option render'() {
			const select = new Select();
			select.setProperties({
				options: testOptions,
				renderOption: (option) => option.label + ' foo'
			});
			const vnode = <VNode> select.__render__();
			const selectNode = vnode.children![0].children![1];

			assert.strictEqual(selectNode.children![0].text, 'One foo');
			assert.strictEqual(selectNode.children![1].text, 'Two foo');
		},

		'Option click'() {
			const select = new Select();
			let clicked = false;
			let clickedOption;
			select.setProperties({
				options: testOptions,
				onClick: () => clicked = true,
				onChange: (option: SelectOption) => clickedOption = option.value
			});
			(<any> select)._onOptionClick(event());

			assert.isTrue(clicked, 'properties.onClick called');
			assert.strictEqual(clickedOption, 'two', 'onChange called with second option');

			(<any> select)._onOptionClick(event(0, 2));
			assert.strictEqual(clickedOption, 'two', 'onChange not called for disabled option');

			const falseClick = event();
			falseClick.parentElement = false;
			(<any> select)._onOptionClick(falseClick);
			assert.strictEqual(clickedOption, 'two', 'onChange not called non-option click');
		}
	},

	'Custom Single-select': {
		'Correct trigger attributes'() {
			const select = new Select();
			select.setProperties({
				disabled: true,
				options: testOptions,
				value: 'two'
			});
			const vnode = <VNode> select.__render__();
			const button = vnode.children![0].children![0];
			const dropdown = vnode.children![0].children![1];

			assert.strictEqual(button.vnodeSelector, 'button');
			assert.isTrue(button.properties!.classes![css.trigger]);
			assert.isTrue(button.properties!.classes![css.input]);
			assert.isTrue(button.properties!.disabled);
			assert.strictEqual(button.properties!['aria-controls'], dropdown.properties!.id);
			assert.strictEqual(button.properties!['aria-owns'], dropdown.properties!.id);
			assert.strictEqual(button.properties!['aria-expanded'], 'false');
			assert.strictEqual(button.properties!['aria-haspopup'], 'listbox');
			assert.strictEqual(button.properties!['aria-activedescendant'], 'first');
			assert.strictEqual(button.properties!.value, 'two');
			assert.strictEqual(button.text, 'Two');
		},
		'Correct listbox attributes'() {
			const select = new Select();
			select.setProperties({
				describedBy: 'foo',
				options: testOptions,
				invalid: true,
				readOnly: true,
				required: true
			});
			const vnode = <VNode> select.__render__();
			const button = vnode.children![0].children![0];
			const dropdown = vnode.children![0].children![1];

			assert.strictEqual(dropdown.vnodeSelector, 'div');
			assert.strictEqual(dropdown.properties!['role'], 'listbox');
			assert.strictEqual(dropdown.properties!.id, button.properties!['aria-controls']);
			assert.isTrue(dropdown.properties!.classes![css.dropdown]);
			assert.strictEqual(dropdown.properties!['aria-describedby'], 'foo');
			assert.strictEqual(dropdown.properties!['aria-invalid'], 'true');
			assert.strictEqual(dropdown.properties!['aria-readonly'], 'true');
			assert.strictEqual(dropdown.properties!['aria-required'], 'true');
			assert.strictEqual(dropdown.children!.length, 3);
		},
		'Open/close on trigger click'() {
			const select = new Select();
			let clicked = false;

			select.setProperties({
				onClick: () => clicked = true
			});

			(<any> select)._onTriggerClick(event());
			let vnode = <VNode> select.__render__();

			assert.isTrue(vnode.children![0].properties!.classes![css.open], 'Open dropdown on first click');
			assert.isTrue(clicked, 'properties.onClick called');

			(<any> select)._onTriggerClick(event());
			vnode = <VNode> select.__render__();

			assert.isFalse(vnode.children![0].properties!.classes![css.open], 'Close dropdown on second click');
		},
		'Close on trigger blur'() {
			const select = new Select();
			let blurred = false;
			(<any> select)._open = true;

			select.setProperties({
				onBlur: () => blurred = true
			});
			let vnode = <VNode> select.__render__();

			assert.isTrue(vnode.children![0].properties!.classes![css.open]);

			(<any> select)._onTriggerBlur();
			vnode = <VNode> select.__render__();

			assert.isFalse(vnode.children![0].properties!.classes![css.open], 'Dropdown closed on blur');
			assert.isTrue(blurred, 'properties.onBlur called');

			(<any> select)._open = true;
			blurred = false;
			(<any> select)._onOptionMouseDown();
			(<any> select)._onTriggerBlur();
			assert.isFalse(blurred, 'Dropdown not closed on option click');
		},
		'Open/close with keyboard'() {
			const select = new Select();
			(<any> select)._onListboxKeyDown(event(keys.down));

			assert.isTrue((<any> select)._open, 'Open with down arrow');

			(<any> select)._onListboxKeyDown(event(keys.escape));

			assert.isFalse((<any> select)._open, 'Close with escape');
		},
		'Navigate options with keyboard'() {
			const select = new Select();
			let selectedOption;
			let keydown = false;
			select.setProperties({
				options: testOptions,
				onChange: (option: SelectOption) => selectedOption = option.value,
				onKeyDown: () => keydown = true
			});
			(<any> select)._open = true;

			(<any> select)._onListboxKeyDown(event(keys.enter));
			assert.strictEqual(selectedOption, 'one', 'First option is focused by default');
			assert.isTrue(keydown, 'properties.onKeyDown called');

			(<any> select)._onListboxKeyDown(event(keys.down));
			(<any> select)._onListboxKeyDown(event(keys.space));
			assert.strictEqual(selectedOption, 'two', 'Down arrow navigates to second option');

			(<any> select)._onListboxKeyDown(event(keys.up));
			(<any> select)._onListboxKeyDown(event(keys.enter));
			assert.strictEqual(selectedOption, 'one', 'Up arrow navigates to first option');

			(<any> select)._onListboxKeyDown(event(keys.down));
			(<any> select)._onListboxKeyDown(event(keys.down));
			(<any> select)._onListboxKeyDown(event(keys.enter));
			assert.strictEqual(selectedOption, 'one', 'Third option is disabled and can\'t be selected');
			assert.strictEqual((<any> select)._focusedIndex, 2, 'Third option can still be focused');

			(<any> select)._onListboxKeyDown(event(keys.home));
			(<any> select)._onListboxKeyDown(event(keys.enter));
			assert.strictEqual(selectedOption, 'one', 'Home key navigates to first option');

			(<any> select)._onListboxKeyDown(event(keys.end));
			assert.strictEqual((<any> select)._focusedIndex, 2, 'End key navigates to last option');

			(<any> select)._onListboxKeyDown(event(keys.down));
			(<any> select)._onListboxKeyDown(event(keys.enter));
			assert.strictEqual(selectedOption, 'one', 'Down key wraps to start of list');
		}
	},

	'Custom multi-select': {
		'Correct listbox attributes'() {
			const select = new Select();
			select.setProperties({
				describedBy: 'foo',
				multiple: true,
				options: testOptions,
				invalid: true,
				readOnly: true,
				required: true
			});
			const vnode = <VNode> select.__render__();
			const listbox = vnode.children![0].children![0];

			assert.strictEqual(listbox.vnodeSelector, 'div');
			assert.strictEqual(listbox.properties!['role'], 'listbox');
			assert.isTrue(listbox.properties!.classes![css.input]);
			assert.strictEqual(listbox.properties!['aria-activedescendant'], testOptions[0].id, 'First option active by default');
			assert.strictEqual(listbox.properties!['aria-describedby'], 'foo');
			assert.strictEqual(listbox.properties!['aria-invalid'], 'true');
			assert.strictEqual(listbox.properties!['aria-multiselectable'], 'true');
			assert.strictEqual(listbox.properties!['aria-readonly'], 'true');
			assert.strictEqual(listbox.properties!['aria-required'], 'true');
			assert.strictEqual(listbox.children!.length, 3);
		},
		'Navigate options with keyboard'() {
			const select = new Select();
			let selectedOption;
			select.setProperties({
				multiple: true,
				options: testOptions,
				onChange: (option: SelectOption) => selectedOption = option.value
			});

			(<any> select)._onListboxKeyDown(event(keys.down));
			(<any> select)._onListboxKeyDown(event(keys.space));
			const vnode = <VNode> select.__render__();
			assert.strictEqual(selectedOption, 'two', 'Down arrow navigates to second option');
			assert.strictEqual(vnode.children![0].children![0].properties!['aria-activedescendant'], testOptions[1].id, 'Set activedescendant to second option id');

			(<any> select)._onListboxKeyDown(event(keys.up));
			(<any> select)._onListboxKeyDown(event(keys.enter));
			assert.strictEqual(selectedOption, 'one', 'Up arrow navigates to first option');
		}
	},

	'state classes'() {
		const select = new Select();
		select.setProperties({
			disabled: true,
			invalid: true,
			multiple: true,
			readOnly: true,
			required: true
		});
		let vnode = <VNode> select.__render__();

		assert.isTrue(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.invalid]);
		assert.isTrue(vnode.properties!.classes![css.multiselect]);
		assert.isTrue(vnode.properties!.classes![css.readonly]);
		assert.isTrue(vnode.properties!.classes![css.required]);

		select.setProperties({
			disabled: false,
			invalid: false,
			multiple: false,
			readOnly: false,
			required: false
		});
		vnode = <VNode> select.__render__();
		assert.isFalse(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
		assert.isFalse(vnode.properties!.classes![css.multiselect]);
		assert.isFalse(vnode.properties!.classes![css.readonly]);
		assert.isFalse(vnode.properties!.classes![css.required]);

		select.setProperties({
			invalid: undefined
		});
		vnode = <VNode> select.__render__();
		assert.isFalse(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
	},

	label() {
		const select = new Select();
		select.setProperties({
			label: 'foo',
			formId: 'bar'
		});
		let vnode = <VNode> select.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'label');
		assert.strictEqual(vnode.children![0].properties!.innerHTML, 'foo');
		assert.strictEqual(vnode.properties!['form'], 'bar');
		assert.isTrue(vnode.properties!.classes![css.root]);
	}
});
