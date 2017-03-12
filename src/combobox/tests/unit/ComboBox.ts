import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import ComboBox, { Operation } from '../../ComboBox';
import ResultItem from '../../ResultItem';
import ResultMenu from '../../ResultMenu';

const keys = {
	escape: 27,
	enter: 13,
	up: 38,
	down: 40
};

function inputElement() {
	return <any> {
		value: 'foobar',
		blur() { },
		focus() { }
	};
}

function parentElement(input?: any) {
	if (!input) {
		input = inputElement();
	}
	return <any> {
		querySelector() {
			return input;
		}
	};
}

function event(keyCode = 0) {
	return <any> {
		keyCode: keyCode,
		target: {
			value: '',
			getAttribute() { }
		},
		preventDefault() { }
	};
}

registerSuite({
	name: 'ComboBox',

	'Menu should open when arrow clicked'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['abc']
		});

		(<any> comboBox)._onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 3);
	},

	'Label should render'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			label: 'foo'
		});

		const vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![0].properties!.innerHTML, 'foo');
	},

	'Menu should open on input'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['abc']
		});

		(<any> comboBox)._onInput(event());
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 3);
	},

	'Menu should close when input blurred'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['abc']
		});

		(<any> comboBox)._onInput(event());
		(<any> comboBox)._onInputBlur(event());
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Menu should close when result clicked'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['abc'],
			getResultLabel: (value: string) => value
		});

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		(<any> comboBox)._onResultMouseUp();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Value should not change if no results exist'() {
		const comboBox = new ComboBox();
		let called = false;
		// Set properties individually to hit all branches in onPropertiesChanged
		comboBox.setProperties({
			getResultLabel: (value: string) => value
		});
		comboBox.setProperties({
			customResultItem: ResultItem
		});
		comboBox.setProperties({
			customResultMenu: ResultMenu
		});
		comboBox.setProperties({
			onChange: () => called = true
		});

		(<any> comboBox)._onResultMouseUp();
		assert.isFalse(called);
	},

	'Blur should be ignored when clicking result'() {
		const comboBox = new ComboBox();
		let called = false;
		comboBox.setProperties({
			results: ['a', 'b'],
			onBlur: () => called = true
		});

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onResultMouseEnter(1);
		(<any> comboBox)._onResultMouseDown();
		(<any> comboBox)._onInputBlur(event());
		assert.isFalse(called);
	},

	'Down arrow should change selected result if open'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['1', '2']
		});

		(<any> comboBox)._onArrowClick();
		(<any> comboBox).updateSelectedIndex();
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![0].properties!['data-selected'], 'true');

		(<any> comboBox)._onInputKeyDown(event(keys.down));
		vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![1].properties!['data-selected'], 'true');
	},

	'Down arrow should open results if closed'() {
		const comboBox = new ComboBox();
		let called = false;
		comboBox.setProperties({
			results: ['1', '2'],
			onRequestResults: () => called = true
		});
		(<any> comboBox)._afterCreate(parentElement());
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		const vnode = <VNode> comboBox.__render__();
		assert.isTrue(called);
		assert.lengthOf(vnode.children, 3);
	},

	'Up arrow should change selected result'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['1', '2']
		});

		(<any> comboBox)._onInputKeyDown(event(keys.up));
		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.up));
		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![1].properties!['data-selected'], 'true');

		(<any> comboBox)._onInputKeyDown(event(keys.up));
		vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![0].properties!['data-selected'], 'true');
	},

	'Enter should select a result'() {
		let inputValue = 'foobar';
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['1', '2'],
			onChange: (value: string) => inputValue = value,
			getResultLabel: (value: string) => value
		});

		(<any> comboBox)._onInputKeyDown(event(keys.enter));
		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.enter));
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		(<any> comboBox)._onInputKeyDown(event(keys.enter));
		assert.strictEqual(inputValue, '1');
	},

	'Escape should close menu'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({ results: ['a', 'b', 'c']});

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.escape));
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Input should blur if autoBlur is true'() {
		let blurred = false;
		const input = inputElement();
		input.blur = () => blurred = true;
		const parent = parentElement(input);
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['abc'],
			autoBlur: true
		});

		(<any> comboBox)._afterCreate(parent);
		parent.querySelector = () => null;
		(<any> comboBox)._selectResult('abc');
		(<any> comboBox)._afterUpdate(parent);
		assert.isTrue(blurred);
	},

	'Clearable should render clear button and allow input to be cleared'() {
		let inputValue = 'foobar';
		const comboBox: ComboBox = new ComboBox();
		comboBox.setProperties({
			clearable: true,
			onChange: (value: string) => inputValue = value
		});

		let vnode = <VNode> comboBox.__render__();
		(<any> comboBox)._afterCreate(parentElement());
		(<any> comboBox)._onClearClick();
		assert.strictEqual(inputValue, '');
		assert.lengthOf(vnode.children, 3);
	},

	'Allowed inputProperties are transferred to child input'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			inputProperties: {
				placeholder: 'foobar'
			}
		});

		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![0].children![0].children![0].properties!.placeholder, 'foobar');
	},

	'Input should open on focus if openOnFocus is true'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			openOnFocus: true,
			results: ['abc']
		});

		(<any> comboBox)._onInputFocus(event());
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 3);
	},

	'value is set on underlying input'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			value: 'abc'
		});

		const vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![0].children![0].children![0].properties!.value, 'abc');
	},

	'onBlur should be called'() {
		let called = false;
		const comboBox = new ComboBox();
		comboBox.setProperties({
			onBlur: () => called = true
		});

		(<any> comboBox)._onInputBlur(event());
		assert.isTrue(called);
	},

	'onChange should be called'() {
		let called = 0;
		const comboBox = new ComboBox();
		comboBox.setProperties({
			onChange: () => called++
		});

		(<any> comboBox)._onInput(event());
		(<any> comboBox)._onClearClick();
		(<any> comboBox)._selectResult('abc');
		assert.strictEqual(called, 3);
	},

	'onFocus should be called'() {
		let called = false;
		const parent = parentElement();
		const comboBox = new ComboBox();
		comboBox.setProperties({
			onFocus: () => called = true
		});

		(<any> comboBox)._onInputFocus(event());
		(<any> comboBox)._afterCreate(parent);
		parent.querySelector = () => null;
		(<any> comboBox)._afterUpdate(parent);
		assert.isTrue(called);
	},

	'onRequestResults should be called'() {
		let called = 0;
		const comboBox = new ComboBox();
		comboBox.setProperties({
			onRequestResults: () => called++,
			openOnFocus: true
		});

		(<any> comboBox)._afterCreate(parentElement());
		(<any> comboBox)._onInput(event());
		(<any> comboBox)._onInputFocus(event());
		(<any> comboBox)._onArrowClick();
		assert.strictEqual(called, 3);
	},

	'onMenuChange should be called'() {
		let called = 0;
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['a'],
			onMenuChange: () => called++
		});

		(<any> comboBox)._onInput(parentElement());
		<VNode> comboBox.__render__();
		(<any> comboBox)._onInputBlur(parentElement());
		<VNode> comboBox.__render__();
		assert.strictEqual(called, 2);
		(<any> comboBox)._wasOpen = false;
		(<any> comboBox)._open = false;
		(<any> comboBox)._notifyMenuChange();
	},

	'Clicking arrow should not open menu if disabled'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			disabled: true
		});

		(<any> comboBox)._onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Clicking arrow should not open menu if readonly'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			readOnly: true
		});

		(<any> comboBox)._onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Selected element should stay visible when above viewport'() {
		const comboBox = new ComboBox();
		const menu = {
			scrollTop: 200
		};
		const element = {
			offsetTop: 100,
			parentElement: menu
		};

		(<any> comboBox)._afterCreate(parentElement());
		(<any> comboBox)._afterUpdate(parentElement(element));
		assert.strictEqual(menu.scrollTop, element.offsetTop);
	},

	'Selected element should stay visible when below viewport'() {
		const comboBox = new ComboBox();
		const menu = {
			scrollTop: 200,
			clientHeight: 200
		};
		const element = {
			offsetTop: 500,
			offsetHeight: 100,
			parentElement: menu
		};

		(<any> comboBox)._afterCreate(parentElement());
		(<any> comboBox)._afterUpdate(parentElement(element));
		assert.strictEqual(menu.scrollTop, element.offsetTop - menu.clientHeight + element.offsetHeight);
	},

	'No scrolling should occur if result is in viewport'() {
		const comboBox = new ComboBox();
		const menu = {
			scrollTop: 50,
			clientHeight: 200
		};
		const element = {
			offsetTop: 100,
			offsetHeight: 100,
			parentElement: menu
		};

		(<any> comboBox)._afterCreate(parentElement());
		(<any> comboBox)._afterUpdate(parentElement(element));
		assert.strictEqual(menu.scrollTop, 50);
	},

	'Skip result should update index based on last direction'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({ results: ['a', 'b', 'c'] });
		(<any> comboBox)._open = true;
		(<any> comboBox)._selectedIndex = 0;
		(<any> comboBox)._direction = Operation.increase;
		(<any> comboBox)._skipResult();
		assert.strictEqual((<any> comboBox)._selectedIndex, 1);
	}
});
