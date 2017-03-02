import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import ComboBox from '../../../src/combobox/ComboBox';
import ResultItem from '../../../src/combobox/ResultItem';
import ResultMenu from '../../../src/combobox/ResultMenu';

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

		comboBox.onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 3);
	},

	'Menu should open on input'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['abc']
		});

		comboBox.onInput(event());
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 3);
	},

	'Menu should close when input blurred'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['abc']
		});

		comboBox.onInput(event());
		comboBox.onInputBlur(event());
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Menu should close when result clicked'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['abc'],
			getResultLabel: (value: string) => value
		});

		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event(keys.down));
		comboBox.onResultMouseUp();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Value should not change if no results exist'() {
		const comboBox = new ComboBox();
		let called = false;
		comboBox.setProperties({
			customResultItem: ResultItem,
			customResultMenu: ResultMenu,
			getResultLabel: (value: string) => value,
			onChange: () => called = true
		});

		comboBox.onResultMouseUp();
		assert.isFalse(called);
	},

	'Blur should be ignored when clicking result'() {
		const comboBox = new ComboBox();
		let called = false;
		comboBox.setProperties({
			results: ['a', 'b'],
			onBlur: () => called = true
		});

		comboBox.onArrowClick();
		comboBox.onResultMouseEnter(1);
		comboBox.onResultMouseDown();
		comboBox.onInputBlur(event());
		assert.isFalse(called);
	},

	'Down arrow should change selected result'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['1', '2']
		});

		comboBox.onInputKeyDown(event(keys.down));
		comboBox.onArrowClick();
		comboBox.updateSelectedIndex();
		comboBox.onInputKeyDown(event(keys.down));
		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![0].properties!['data-selected'], 'true');

		comboBox.onInputKeyDown(event(keys.down));
		vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![1].properties!['data-selected'], 'true');
	},

	'Up arrow should change selected result'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['1', '2']
		});

		comboBox.onInputKeyDown(event(keys.up));
		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event(keys.up));
		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![1].properties!['data-selected'], 'true');

		comboBox.onInputKeyDown(event(keys.up));
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

		comboBox.onInputKeyDown(event(keys.enter));
		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event(keys.enter));
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);

		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event(keys.down));
		comboBox.onInputKeyDown(event(keys.enter));
		assert.strictEqual(inputValue, '1');
	},

	'Escape should close menu'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({ results: ['a', 'b', 'c']});

		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event(keys.escape));
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

		comboBox.afterCreate(parent);
		parent.querySelector = () => null;
		comboBox.selectResult('abc');
		comboBox.afterUpdate(parent);
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
		comboBox.afterCreate(parentElement());
		comboBox.onClearClick();
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
		assert.strictEqual(vnode.children![0].properties!.placeholder, 'foobar');
	},

	'Input should open on focus if openOnFocus is true'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			openOnFocus: true,
			results: ['abc']
		});

		comboBox.onInputFocus(event());
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 3);
	},

	'value is set on underlying input'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			value: 'abc'
		});

		const vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![0].properties!.value, 'abc');
	},

	'onBlur should be called'() {
		let called = false;
		const comboBox = new ComboBox();
		comboBox.setProperties({
			onBlur: () => called = true
		});

		comboBox.onInputBlur(event());
		assert.isTrue(called);
	},

	'onChange should be called'() {
		let called = 0;
		const comboBox = new ComboBox();
		comboBox.setProperties({
			onChange: () => called++
		});

		comboBox.onInput(event());
		comboBox.onClearClick();
		comboBox.selectResult('abc');
		assert.strictEqual(called, 3);
	},

	'onFocus should be called'() {
		let called = false;
		const parent = parentElement();
		const comboBox = new ComboBox();
		comboBox.setProperties({
			onFocus: () => called = true
		});

		comboBox.onInputFocus(event());
		comboBox.afterCreate(parent);
		parent.querySelector = () => null;
		comboBox.afterUpdate(parent);
		assert.isTrue(called);
	},

	'onRequestResults should be called'() {
		let called = 0;
		const comboBox = new ComboBox();
		comboBox.setProperties({
			onRequestResults: () => called++,
			openOnFocus: true
		});

		comboBox.afterCreate(parentElement());
		comboBox.onInput(event());
		comboBox.onInputFocus(event());
		comboBox.onArrowClick();
		assert.strictEqual(called, 3);
	},

	'onMenuChange should be called'() {
		let called = 0;
		const comboBox = new ComboBox();
		comboBox.setProperties({
			results: ['a'],
			onMenuChange: () => called++
		});

		comboBox.onInput(parentElement());
		<VNode> comboBox.__render__();
		comboBox.onInputBlur(parentElement());
		<VNode> comboBox.__render__();
		assert.strictEqual(called, 2);
	},

	'Clicking arrow should not open menu if disabled'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			inputProperties: {
				disabled: true
			}
		});

		comboBox.onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Clicking arrow should not open menu if readonly'() {
		const comboBox = new ComboBox();
		comboBox.setProperties({
			inputProperties: {
				readOnly: true
			}
		});

		comboBox.onArrowClick();
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

		comboBox.afterCreate(parentElement());
		comboBox.afterUpdate(parentElement(element));
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

		comboBox.afterCreate(parentElement());
		comboBox.afterUpdate(parentElement(element));
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

		comboBox.afterCreate(parentElement());
		comboBox.afterUpdate(parentElement(element));
		assert.strictEqual(menu.scrollTop, 50);
	}
});
