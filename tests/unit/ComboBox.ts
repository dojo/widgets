import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import ComboBox from '../../src/combobox/ComboBox';
import { v } from '@dojo/widget-core/d';

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

function event(key = '') {
	return <any> {
		key: key,
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
		const comboBox = new ComboBox({
			results: ['abc']
		});

		comboBox.onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 3);
	},

	'Menu should open on input'() {
		const comboBox = new ComboBox({
			results: ['abc']
		});

		comboBox.onInput(event());
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 3);
	},

	'Menu should close when input blurred'() {
		const comboBox = new ComboBox({
			results: ['abc']
		});

		comboBox.onInput(event());
		comboBox.onInputBlur(event());
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Menu should close when result clicked'() {
		const comboBox = new ComboBox({
			results: ['abc'],
			getResultValue: value => value
		});

		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event('ArrowDown'));
		comboBox.onInput(event());
		comboBox.onResultMouseEnter(event());
		comboBox.onResultMouseDown();
		comboBox.onInputBlur(event());
		comboBox.onResultMouseUp();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Down arrow should change selected result'() {
		const comboBox = new ComboBox({
			results: ['1', '2']
		});

		comboBox.onInputKeyDown(event('ArrowDown'));
		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event('ArrowDown'));
		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![0].properties!['data-selected'], 'true');

		comboBox.onInputKeyDown(event('ArrowDown'));
		vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![1].properties!['data-selected'], 'true');
	},

	'Up arrow should change selected result'() {
		const comboBox = new ComboBox({
			results: ['1', '2']
		});

		comboBox.onInputKeyDown(event('ArrowUp'));
		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event('ArrowUp'));
		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![1].properties!['data-selected'], 'true');

		comboBox.onInputKeyDown(event('ArrowUp'));
		vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![2].children![0].properties!['data-selected'], 'true');
	},

	'Enter should select a result'() {
		let inputValue = 'foobar';
		const comboBox = new ComboBox({
			results: ['1', '2'],
			onChange: (value: string) => inputValue = value,
			getResultValue: value => value
		});

		comboBox.onInputKeyDown(event('Enter'));
		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event('Enter'));
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);

		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event('ArrowDown'));
		comboBox.onInputKeyDown(event('Enter'));
		assert.strictEqual(inputValue, '1');
	},

	'Escape should close menu'() {
		const comboBox = new ComboBox({});

		comboBox.onArrowClick();
		comboBox.onInputKeyDown(event('Escape'));
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Input should blur if autoBlur is true'() {
		let blurred = false;
		const input = inputElement();
		input.blur = () => blurred = true;
		const parent = parentElement(input);
		const comboBox = new ComboBox({
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
		const comboBox: ComboBox = new ComboBox({
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
		const comboBox = new ComboBox({
			inputProperties: {
				placeholder: 'foobar'
			}
		});

		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![0].properties!.placeholder, 'foobar');
	},

	'Input should open on focus if openOnFocus is true'() {
		const comboBox: ComboBox = new ComboBox({
			openOnFocus: true,
			results: ['abc']
		});

		comboBox.onInputFocus(event());
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 3);
	},

	'value is set on underlying input'() {
		const comboBox = new ComboBox({
			value: 'abc'
		});

		const vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![0].properties!.value, 'abc');
	},

	'onBlur should be called'() {
		let called = false;
		const comboBox = new ComboBox({
			onBlur: () => called = true
		});

		comboBox.onInputBlur(event());
		assert.isTrue(called);
	},

	'onChange should be called'() {
		let called = 0;
		const comboBox = new ComboBox({
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
		const comboBox = new ComboBox({
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
		const comboBox = new ComboBox({
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
		const comboBox = new ComboBox({
			results: ['a'],
			onMenuChange: () => called++
		});

		comboBox.onInput(parentElement());
		<VNode> comboBox.__render__();
		comboBox.onInputBlur(parentElement());
		<VNode> comboBox.__render__();
		assert.strictEqual(called, 2);
	},

	'renderMenu should be called'() {
		let called = false;
		const comboBox = new ComboBox({
			getResultValue: value => value,
			renderMenu: () => {
				called = true;
				return v('div');
			}
		});

		comboBox.renderMenu(['a']);
		assert.isTrue(called);
	},

	'renderResult should be called'() {
		let called = false;
		const comboBox = new ComboBox({
			renderResult: () => {
				called = true;
				return v('div');
			}
		});

		comboBox.renderMenu(['a']);
		assert.isTrue(called);
	},

	'Clicking arrow should not open menu if disabled'() {
		const comboBox = new ComboBox({
			inputProperties: {
				disabled: true
			}
		});

		comboBox.onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Clicking arrow should not open menu if readonly'() {
		const comboBox = new ComboBox({
			inputProperties: {
				readOnly: true
			}
		});

		comboBox.onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Selected element should stay visible when above viewport'() {
		const comboBox = new ComboBox({});
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
		const comboBox = new ComboBox({});
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
		const comboBox = new ComboBox({});
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
