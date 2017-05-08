import has from '@dojo/has/has';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TitlePane from '../../TitlePane';
import * as css from '../../styles/titlePane.m.css';

const ENTER_KEY_CODE = 13;
const SPACE_KEY_CODE = 32;

function contentElement() {
	return {
		offsetHeight: 200,
		style: {
			marginTop: null
		}
	};
}

registerSuite({
	name: 'TitlePane',

	setup() {
		if (has('host-node')) {
			(<any> global).requestAnimationFrame = function (callback: () => void) {
				callback();
			};
		}
	},

	'Render correct children'() {
		const titlePane = new TitlePane();
		titlePane.__setProperties__({
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.lengthOf(vnode.children, 2);
	},

	'click title to close'() {
		const titlePane = new TitlePane();
		titlePane.__setProperties__({
			closeable: true,
			open: true,
			onRequestClose() {
				called = true;
			},
			title: 'test'
		});
		let called = false;

		(<any> titlePane)._onTitleClick();
		assert.isTrue(called, 'onRequestClose should be called on title click');
	},

	'click title to open'() {
		const titlePane = new TitlePane();
		titlePane.__setProperties__({
			closeable: true,
			open: false,
			onRequestOpen() {
				called = true;
			},
			title: 'test'
		});
		let called = false;

		(<any> titlePane)._onTitleClick();
		assert.isTrue(called, 'onRequestOpen should be called on title click');
	},

	'toggle open state on keyup'() {
		const props = {
			closeable: true,
			open: false,
			onRequestClose() {
				closeCount++;
			},
			onRequestOpen() {
				openCount++;
			},
			title: 'test'
		};
		const titlePane = new TitlePane();
		let openCount = 0;
		let closeCount = 0;

		titlePane.__setProperties__(props);
		(<any> titlePane)._onTitleKeyUp({ keyCode: ENTER_KEY_CODE });
		assert.strictEqual(openCount, 1, 'onRequestOpen should be called on title enter keyup');

		titlePane.__setProperties__(props);
		(<any> titlePane)._onTitleKeyUp({ keyCode: SPACE_KEY_CODE });
		assert.strictEqual(openCount, 2, 'onRequestOpen should be called on title space keyup');

		props.open = true;

		titlePane.__setProperties__(props);
		(<any> titlePane)._onTitleKeyUp({ keyCode: ENTER_KEY_CODE });
		assert.strictEqual(closeCount, 1, 'onRequestClose should be called on title enter keyup');

		titlePane.__setProperties__(props);
		(<any> titlePane)._onTitleKeyUp({ keyCode: SPACE_KEY_CODE });
		assert.strictEqual(closeCount, 2, 'onRequestClose should be called on title space keyup');
	},

	'keyup: only respond to enter and space'() {
		const titlePane = new TitlePane();
		titlePane.__setProperties__({
			closeable: true,
			open: false,
			onRequestClose() {
				called = true;
			},
			onRequestOpen() {
				called = true;
			},
			title: 'test'
		});
		let called = false;

		for (let i = 8; i < 223; i++) {
			if (i !== ENTER_KEY_CODE && i !== SPACE_KEY_CODE) {
				(<any> titlePane)._onTitleKeyUp({ keyCode: i });
				assert.isFalse(called, `keyCode {i} should be ignored`);
			}
		}
	},

	'property defaults'() {
		const titlePane = new TitlePane();
		titlePane.__setProperties__({
			onRequestClose() {
				called = true;
			},
			title: 'test'
		});
		let called = false;
		let vnode = <VNode> titlePane.__render__();

		(<any> titlePane)._onTitleClick();
		assert.isTrue(called, '`open` should default to `true` causing title click to call `onRequestClose`');

		assert.strictEqual(vnode.children![0].properties!['aria-level'], '',
			'`ariaHeadingLevel` should default to empty');
		assert.isTrue(vnode.children![0].properties!.classes![css.closeable],
			'`closeable` should default to `true` and apply CSS class');
		assert.strictEqual(vnode.children![0].children![0].properties!['aria-expanded'], 'true',
			'`open` should default to `true` and set `aria-expanded`');
	},

	ariaHeadingLevel() {
		const titlePane = new TitlePane();
		titlePane.__setProperties__({
			headingLevel: 5,
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.strictEqual(vnode.children![0].properties!['aria-level'], '5',
			'`ariaHeadingLevel` value should be set on title node');
	},

	closeable() {
		const titlePane = new TitlePane();
		titlePane.__setProperties__({
			closeable: false,
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.isUndefined(vnode.children![0].properties!.classes![css.closeable],
			'`closeable=false` should not apply CSS class');
	},

	open() {
		const titlePane = new TitlePane();
		titlePane.__setProperties__({
			open: false,
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.strictEqual(vnode.children![1].children!.length, 0,
			'`open=false` should not render content');
	},

	'By default, title pane should open'(this: any) {
		const dfd = this.async();
		const titlePane = new TitlePane();
		const content = contentElement();

		(<any> titlePane).onElementCreated(content, 'content');

		setTimeout(dfd.callback(() => {
			assert.strictEqual(content.style.marginTop, '0px', 'top margin should be 0px when open');
		}), 100);
	},

	'Title pane should open when `open` = true'(this: any) {
		const dfd = this.async();
		const titlePane = new TitlePane();
		const content = contentElement();

		titlePane.__setProperties__({
			title: 'foo',
			open: true
		});
		(<any> titlePane).onElementUpdated(content, 'content');

		setTimeout(dfd.callback(() => {
			assert.strictEqual(content.style.marginTop, '0px', 'top margin should be 0px when open');
		}), 100);
	},

	'Title pane should close when `open` = false'(this: any) {
		const dfd = this.async();
		const titlePane = new TitlePane();
		const content = contentElement();

		(<any> titlePane).onElementCreated(content, 'content');
		titlePane.__setProperties__({
			title: 'foo',
			open: false
		});
		(<any> titlePane).onElementCreated(content, 'content');

		setTimeout(dfd.callback(() => {
			assert.strictEqual(content.style.marginTop, '-200px', 'top margin should be -(content height) when closed');
		}), 100);
	}
});
