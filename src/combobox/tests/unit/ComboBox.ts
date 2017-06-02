import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { findIndex } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';
import { HNode, WNode } from '@dojo/widget-core/interfaces';
import { WidgetRegistry } from '@dojo/widget-core/WidgetRegistry';
import { VNode } from '@dojo/interfaces/vdom';

import ComboBox, { ComboBoxProperties } from '../../ComboBox';
import TextInput from '../../../textinput/TextInput';
import Label from '../../../label/Label';
import ResultItem from '../../ResultItem';
import ResultMenu from '../../ResultMenu';
import * as css from '../../styles/comboBox.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

const registry = new WidgetRegistry();
registry.define('result-menu', ResultMenu);

let comboBox: Harness<ComboBoxProperties, typeof ComboBox>;

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

	beforeEach() {
		comboBox = harness(ComboBox);
	},

	afterEach() {
		comboBox.destroy();
	},

	render() {
		const controls = v('div', {
			classes: comboBox.classes(css.controls)
		}, [
			w(TextInput, {
				controls: '',
				disabled: undefined,
				invalid: undefined,
				readOnly: undefined,
				required: undefined,
				value: '',
				onBlur: comboBox.listener,
				onFocus: comboBox.listener,
				onInput: comboBox.listener,
				onKeyDown: comboBox.listener,
				extraClasses: css,
				theme: {}
			}),
			null,
			v('button', {
				'aria-controls': '',
				classes: comboBox.classes(css.trigger),
				disabled: undefined,
				readOnly: undefined,
				onclick: comboBox.listener
			}, [
				'open combo box',
				v('i', {
					classes: comboBox.classes(iconCss.icon, iconCss.downIcon),
					role: 'presentation',
					'aria-hidden': 'true'
				})
			])
		]);
		const expected = v('div', {
			afterCreate: comboBox.listener,
			afterUpdate: comboBox.listener,
			'aria-expanded': 'false',
			'aria-haspopup': 'true',
			'aria-readonly': 'false',
			'aria-required': 'false',
			classes: comboBox.classes(css.root),
			key: 'root',
			role: 'combobox'
		}, [
			controls,
			null
		]);

		comboBox.expectRender(expected);
	},

	'Menu should open when arrow clicked'() {
		comboBox.callListener('onclick', { index: '0,2'});
		comboBox.setProperties({
			results: ['abc']
		});
		const vnode = <HNode> comboBox.getRender();
		assert.lengthOf(vnode.vNodes, 2);
	},

	'Label should render'() {
		comboBox.setProperties({
			label: 'foo'
		});

		const vnode = <HNode> comboBox.getRender();
		const labelNode = <WNode<Label>> findIndex(vnode, '0');

		assert.strictEqual(labelNode.properties!.label, 'foo');
	},

	'Menu should open on input'() {
		comboBox.setProperties({ results: ['abc'] });

		comboBox.callListener('onInput', { index: '0,0'});
		// trigger another render
		comboBox.setProperties({ results: ['cba'] });
		const vnode = <HNode> comboBox.getRender();

		assert.lengthOf(vnode.vNodes, 2);
		assert(findIndex(vnode, 1), 'menu node should be rendered.');
	},

	'Menu should close when input blurred'() {
		comboBox.setProperties({
			results: ['abc']
		});

		comboBox.callListener('onInput', { index: '0,0'});
		comboBox.callListener('onBlur', { index: '0,0'}); // `_closeMenu()` triggers another render
		const vnode = <HNode> comboBox.getRender();

		assert.lengthOf(vnode.vNodes, 1);
		assert(!findIndex(vnode, 1), 'menu node should not be rendered.');
	},

	'Menu should close when result clicked'() {
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.down) ] });
		comboBox.setProperties({
			results: ['abc'],
			getResultLabel: (value: string) => value
		});

		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.down) ] });
		comboBox.callListener('onclick', { index: '0,2'});
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.down) ] });
		comboBox.callListener('onResultMouseUp', { index: 1 });
		const vnode = <HNode> comboBox.getRender();

		assert.lengthOf(vnode.vNodes, 1);
	},

	'Blur should be ignored when clicking result'() {
		const spy = sinon.spy();
		comboBox.callListener('onclick', { index: '0,2'});
		comboBox.setProperties({
			results: ['a', 'b'],
			onBlur: spy
		});
		comboBox.callListener('onResultMouseEnter', { index: 1 });
		comboBox.callListener('onResultMouseDown', { index: 1 });
		comboBox.callListener('onBlur', { index: '0,0'});

		assert.isFalse(spy.called);
	},

	'Down arrow should change selected result if open'() {
		comboBox.setProperties({
			results: ['1', '2'],
			required: true,
			customResultItem: ResultItem,
			customResultMenu: ResultMenu
		});

		comboBox.callListener('onclick', { index: '0,2'});
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.down) ] });
		let vnode = <HNode> comboBox.getRender();
		let menuNode = <WNode<ResultMenu>> findIndex(vnode, 1);
		assert.strictEqual(menuNode.properties.selectedIndex, 0);

		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.down) ] });
		vnode = <HNode> comboBox.getRender();
		menuNode = <WNode<ResultMenu>> findIndex(vnode, 1);
		assert.strictEqual(menuNode.properties.selectedIndex, 1);
	},

	'Down arrow should open results if closed'() {
		// this test can't be converted because `onElementCreated()` is not available, and ResultMenu sub widget is not rendered in a harnessed widget
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
		comboBox.setProperties({
			results: ['1', '2']
		});

		comboBox.callListener('onclick', { index: '0,2'});
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.up) ] });
		let vnode = <HNode> comboBox.getRender();
		let menuNode = <WNode<ResultMenu>> findIndex(vnode, 1);
		assert.strictEqual(menuNode.properties.selectedIndex, 1);

		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.up) ] });
		vnode = <HNode> comboBox.getRender();
		menuNode = <WNode<ResultMenu>> findIndex(vnode, 1);
		assert.strictEqual(menuNode.properties.selectedIndex, 0);
	},

	'Enter should select a result'() {
		let inputValue = 'foobar';
		comboBox.setProperties({
			results: ['1', '2'],
			onChange: (value: string) => inputValue = value
		});

		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.enter) ] });
		comboBox.callListener('onclick', { index: '0,2'});
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.enter) ] });
		const vnode = <HNode> comboBox.getRender();
		assert.lengthOf(vnode.vNodes, 1);

		comboBox.callListener('onclick', { index: '0,2'});
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.down) ] });
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.enter) ] });
		assert.strictEqual(inputValue, '1');
	},

	'Escape should close menu'() {
		comboBox.setProperties({ results: ['a', 'b', 'c']});
		comboBox.callListener('onclick', { index: '0,2'});
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.escape) ] });
		const vnode = <HNode> comboBox.getRender();

		assert.lengthOf(vnode.vNodes, 1);
	},

	'Input should blur if autoBlur is true'() {
		// this test can't be converted because `onElementCreated()` and `onElementUpdated` are not available in a harnessed widget
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
		comboBox.setProperties({
			clearable: true,
			onChange: (value: string) => inputValue = value
		});
		comboBox.callListener('onclick', { index: '0,1'});

		assert.strictEqual(inputValue, '');
	},

	'Allowed inputProperties are transferred to child input'() {
		comboBox.setProperties({
			inputProperties: {
				placeholder: 'foobar'
			}
		});

		const vnode = <HNode> comboBox.getRender();
		const textInputNode = <WNode<TextInput>> findIndex(vnode, '0,0');
		assert.strictEqual(textInputNode.properties.placeholder, 'foobar');
	},

	'Input should open on focus if openOnFocus is true'() {
		comboBox.setProperties({
			openOnFocus: true,
			results: ['abc']
		});
		comboBox.callListener('onFocus', { index: '0,0'});
		// trigger another render
		comboBox.setProperties({
			openOnFocus: true,
			results: ['cba']
		});
		const vnode = <HNode> comboBox.getRender();

		assert.lengthOf(vnode.vNodes, 2);
	},

	'value is set on underlying input'() {
		comboBox.setProperties({
			value: 'abc'
		});
		const vnode = <HNode> comboBox.getRender();
		const textInputNode = <WNode<TextInput>> findIndex(vnode, '0,0');

		assert.strictEqual(textInputNode.properties!.value, 'abc');
	},

	'onBlur should be called'() {
		const spy = sinon.spy();
		comboBox.setProperties({
			onBlur: spy
		});
		comboBox.callListener('onBlur', { index: '0,0', args: [ event() ]});

		assert.isTrue(spy.called);
	},

	'onChange should be called'() {
		const spy = sinon.spy();
		comboBox.setProperties({
			results: ['abc'],
			getResultLabel: value => value,
			clearable: true,
			onChange: spy
		});
		comboBox.callListener('onInput', { index: '0,0', args: [ event() ] });
		comboBox.callListener('onclick', { index: '0,1'});

		assert.isTrue(spy.calledTwice);
	},

	'onFocus should be called'() {
		const spy = sinon.spy();
		comboBox.setProperties({
			onFocus: spy
		});
		comboBox.callListener('onFocus', { index: '0,0', args: [ event() ] });

		assert.isTrue(spy.called);
	},

	'onRequestResults should be called'() {
		const spy = sinon.spy();
		comboBox.setProperties({
			onRequestResults: spy,
			openOnFocus: true
		});

		comboBox.callListener('onInput', { index: '0,0', args: [ event() ] });
		comboBox.callListener('onFocus', { index: '0,0', args: [ event() ] });
		comboBox.callListener('onclick', { index: '0,2'});
		assert.strictEqual(spy.callCount, 3);
	},

	'onMenuChange should be called'() {
		const spy = sinon.spy();
		comboBox.setProperties({
			results: ['a'],
			onMenuChange: spy
		});
		comboBox.callListener('onInput', { index: '0,0' });
		// trigger another render
		comboBox.setProperties({
			results: ['b'],
			onMenuChange: spy
		});
		comboBox.callListener('onBlur', { index: '0,0' });

		// trigger another render
		comboBox.setProperties({
			results: ['c'],
			onMenuChange: spy
		});
		comboBox.getRender();

		assert.isTrue(spy.calledTwice);
	},

	'Clicking arrow should not open menu if disabled'() {
		comboBox.setProperties({
			disabled: true
		});
		comboBox.callListener('onclick', { index: '0,2'});
		const vnode = <HNode> comboBox.getRender();
		assert.lengthOf(vnode.vNodes, 1);
	},

	'Clicking arrow should not open menu if readonly'() {
		comboBox.setProperties({
			readOnly: true,
			theme: {}
		});
		comboBox.callListener('onclick', { index: '0,2'});
		const vnode = <HNode> comboBox.getRender();
		assert.lengthOf(vnode.vNodes, 1);
	},

	'Selected element should stay visible when above viewport'() {
		// this test can't be converted because `onElementCreated()` and `onElementUpdated` are not available in a harnessed widget
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
		// this test can't be converted because `onElementCreated()` and `onElementUpdated` are not available in a harnessed widget
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
		// this test can't be converted because `onElementCreated()` and `onElementUpdated` are not available in a harnessed widget
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
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.down) ] });
		comboBox.setProperties({
			results: ['1', '2'],
			isResultDisabled: result => result === '1'
		});
		comboBox.callListener('onResultMouseUp', { index: 1, args: [null, 0] });
		comboBox.callListener('onResultMouseEnter', { index: 1, args: [null, 0] });
		comboBox.callListener('onclick', { index: '0,2'});
		comboBox.callListener('onKeyDown', { index: '0,0', args: [ event(keys.down) ] });
		const vnode = <HNode> comboBox.getRender();
		const menuNode = <WNode<ResultMenu>> findIndex(vnode, 1);

		assert.strictEqual(menuNode.properties.selectedIndex, 1);
	}
});
