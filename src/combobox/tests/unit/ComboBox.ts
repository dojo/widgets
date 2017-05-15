import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import ComboBox from '../../ComboBox';
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

function event(which = 0) {
	return <any> {
		which: which,
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
		comboBox.__setProperties__({
			results: ['abc']
		});

		(<any> comboBox)._onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Label should render'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			label: 'foo'
		});

		const vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![0].children![0].properties!.innerHTML, 'foo');
	},

	'Menu should open on input'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			results: ['abc']
		});

		(<any> comboBox)._onInput(event());
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Menu should close when input blurred'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			results: ['abc']
		});

		(<any> comboBox)._onInput(event());
		(<any> comboBox)._onInputBlur(event());
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 1);
	},

	'Menu should close when result clicked'() {
		const comboBox = new ComboBox();
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		comboBox.__setProperties__({
			results: ['abc'],
			getResultLabel: (value: string) => value
		});

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		(<any> comboBox)._onResultMouseUp();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 1);
	},

	'Blur should be ignored when clicking result'() {
		const comboBox = new ComboBox();
		let called = false;
		comboBox.__setProperties__({
			results: ['a', 'b']
		});
		comboBox.__setProperties__({
			customResultItem: ResultItem
		});
		comboBox.__setProperties__({
			customResultMenu: ResultMenu
		});
		comboBox.__setProperties__({
			onBlur: () => called = true
		});

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onResultMouseEnter(event(), 0);
		(<any> comboBox)._onResultMouseDown();
		(<any> comboBox)._onInputBlur(event());
		assert.isFalse(called);
	},

	'Down arrow should change selected result if open'() {
		const comboBox = new ComboBox();
		(<any> comboBox)._moveActiveIndex();
		comboBox.__setProperties__({
			results: ['1', '2'],
			required: true,
			customResultItem: ResultItem,
			customResultMenu: ResultMenu
		});

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![1].children![0].properties!['data-selected'], 'true');

		(<any> comboBox)._onInputKeyDown(event(keys.down));
		vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![1].children![1].properties!['data-selected'], 'true');
	},

	'Down arrow should open results if closed'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			results: ['abc']
		});

		(<any> comboBox).onElementCreated();
		(<any> comboBox).onElementCreated(parentElement(), 'root');
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Up arrow should change selected result'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			results: ['1', '2']
		});

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.up));
		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![1].children![1].properties!['data-selected'], 'true');

		(<any> comboBox)._onInputKeyDown(event(keys.up));
		vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![1].children![0].properties!['data-selected'], 'true');
	},

	'Enter should select a result'() {
		let inputValue = 'foobar';
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			results: ['1', '2'],
			onChange: (value: string) => inputValue = value
		});

		(<any> comboBox)._onInputKeyDown(event(keys.enter));
		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.enter));
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 1);

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		(<any> comboBox)._onInputKeyDown(event(keys.enter));
		assert.strictEqual(inputValue, '1');
	},

	'Escape should close menu'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({ results: ['a', 'b', 'c']});

		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.escape));
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 1);
	},

	'Input should blur if autoBlur is true'() {
		let blurred = false;
		const input = inputElement();
		input.blur = () => blurred = true;
		const parent = parentElement(input);
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			results: ['abc'],
			autoBlur: true
		});

		(<any> comboBox).onElementCreated(parent, 'root');
		parent.querySelector = () => null;
		(<any> comboBox)._selectIndex(0);
		(<any> comboBox).onElementUpdated();
		(<any> comboBox).onElementUpdated(parent, 'root');
		assert.isTrue(blurred);
	},

	'Clearable should render clear button and allow input to be cleared'() {
		let inputValue = 'foobar';
		const comboBox: ComboBox = new ComboBox();
		comboBox.__setProperties__({
			clearable: true,
			onChange: (value: string) => inputValue = value
		});

		<VNode> comboBox.__render__();
		(<any> comboBox).onElementCreated(parentElement(), 'root');
		(<any> comboBox)._onClearClick();
		assert.strictEqual(inputValue, '');
	},

	'Allowed inputProperties are transferred to child input'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			inputProperties: {
				placeholder: 'foobar'
			}
		});

		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![0].children![0].children![0].children![0].properties!.placeholder, 'foobar');
	},

	'Input should open on focus if openOnFocus is true'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			openOnFocus: true,
			results: ['abc']
		});

		(<any> comboBox)._onInputFocus(event());
		let vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'value is set on underlying input'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			value: 'abc'
		});

		const vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![0].children![0].children![0].children![0].properties!.value, 'abc');
	},

	'onBlur should be called'() {
		let called = false;
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			onBlur: () => called = true
		});

		(<any> comboBox)._onInputBlur(event());
		assert.isTrue(called);
	},

	'onChange should be called'() {
		let called = 0;
		const comboBox = new ComboBox();
		(<any> comboBox)._selectIndex(0);
		comboBox.__setProperties__({
			results: ['abc'],
			getResultLabel: value => value,
			onChange: () => called++
		});

		(<any> comboBox)._onInput(event());
		(<any> comboBox)._onClearClick();
		(<any> comboBox)._selectIndex(0);
		assert.strictEqual(called, 3);
	},

	'onFocus should be called'() {
		let called = false;
		const parent = parentElement();
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			onFocus: () => called = true
		});

		(<any> comboBox)._onInputFocus(event());
		(<any> comboBox).onElementCreated(parent, 'root');
		parent.querySelector = () => null;
		(<any> comboBox).onElementUpdated(parent, 'root');
		assert.isTrue(called);
	},

	'onRequestResults should be called'() {
		let called = 0;
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			onRequestResults: () => called++,
			openOnFocus: true
		});

		(<any> comboBox).onElementCreated(parentElement(), 'root');
		(<any> comboBox)._onInput(event());
		(<any> comboBox)._onInputFocus(event());
		(<any> comboBox)._onArrowClick();
		assert.strictEqual(called, 3);
	},

	'onMenuChange should be called'() {
		let called = 0;
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			results: ['a'],
			onMenuChange: () => called++
		});

		(<any> comboBox)._onInput(parentElement());
		<VNode> comboBox.__render__();
		(<any> comboBox)._onInputBlur(parentElement());
		<VNode> comboBox.__render__();
		assert.strictEqual(called, 2);
	},

	'Clicking arrow should not open menu if disabled'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			disabled: true
		});

		(<any> comboBox)._onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 1);
	},

	'Clicking arrow should not open menu if readonly'() {
		const comboBox = new ComboBox();
		comboBox.__setProperties__({
			readOnly: true,
			theme: {}
		});

		(<any> comboBox)._onArrowClick();
		const vnode = <VNode> comboBox.__render__();
		assert.lengthOf(vnode.children, 1);
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

		(<any> comboBox).onElementCreated(parentElement(), 'root');
		(<any> comboBox).onElementUpdated(parentElement(element), 'root');
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

		(<any> comboBox).onElementCreated(parentElement(), 'root');
		(<any> comboBox).onElementUpdated(parentElement(element), 'root');
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

		(<any> comboBox).onElementCreated(parentElement(), 'root');
		(<any> comboBox).onElementUpdated(parentElement(element), 'root');
		assert.strictEqual(menu.scrollTop, 50);
	},

	'disabled result should be skipped'() {
		const comboBox = new ComboBox();
		(<any> comboBox)._isIndexDisabled(0);
		comboBox.__setProperties__({
			results: ['1'],
			isResultDisabled: result => result === '1'
		});
		(<any> comboBox)._moveActiveIndex();
		comboBox.__setProperties__({
			results: ['1', '2'],
			isResultDisabled: result => result === '1'
		});

		(<any> comboBox)._onResultMouseUp(null, 0);
		(<any> comboBox)._onResultMouseEnter(null, 0);
		(<any> comboBox)._onArrowClick();
		(<any> comboBox)._onInputKeyDown(event(keys.down));
		let vnode = <VNode> comboBox.__render__();
		assert.strictEqual(vnode.children![1].children![1].properties!['data-selected'], 'true');
	}
});
