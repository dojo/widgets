import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TitlePane from '../../src/titlepane/TitlePane';
import * as animations from '../../src/styles/animations.css';
import * as css from '../../src/titlepane/styles/titlePane.css';

registerSuite({
	name: 'TitlePane',

	'Render correct children'() {
		const titlePane = new TitlePane({
			id: 'foo',
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.lengthOf(vnode.children, 2);
	},

	'click title to close'() {
		const titlePane = new TitlePane({
			closeable: true,
			open: true,
			onRequestClose() {
				called = true;
			},
			title: 'test'
		});
		let called = false;

		titlePane.onClickTitle();
		assert.isTrue(called, 'onRequestClose should be called on title click');
	},

	'click title to open'() {
		const titlePane = new TitlePane({
			closeable: true,
			open: false,
			onRequestOpen() {
				called = true;
			},
			title: 'test'
		});
		let called = false;

		titlePane.onClickTitle();
		assert.isTrue(called, 'onRequestOpen should be called on title click');
	},

	'property defaults'() {
		const titlePane = new TitlePane({
			onRequestClose() {
				called = true;
			},
			title: 'test'
		});
		let called = false;
		let vnode = <VNode> titlePane.__render__();

		titlePane.onClickTitle();
		assert.isTrue(called, '`open` should default to `true` causing title click to call `onRequestClose`');

		assert.strictEqual(vnode.children![0].properties!['aria-level'], '',
			'`ariaHeadingLevel` should default to empty');
		assert.isTrue(vnode.children![0].properties!.classes![css.closeable],
			'`closeable` should default to `true` and apply CSS class');
		assert.strictEqual(vnode.children![0].children![0].properties!['aria-expanded'], 'true',
			'`open` should default to `true` and set `aria-expanded`');
		assert.strictEqual(vnode.children![1].properties!.enterAnimation, animations.expandDown,
			'`enterAnimation` should use default value');
		assert.strictEqual(vnode.children![1].properties!.exitAnimation, animations.collapseUp,
			'`exitAnimation` should use default value');
	},

	'animation CSS classes'() {
		const titlePane = new TitlePane({
			enterAnimation: 'enter',
			exitAnimation: 'exit',
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.strictEqual(vnode.children![1].properties!.enterAnimation, 'enter',
			'should set provided value for `enterAnimation` on node');
		assert.strictEqual(vnode.children![1].properties!.exitAnimation, 'exit',
			'should set provided value for `exitAnimation` on node');
	},

	ariaHeadingLevel() {
		const titlePane = new TitlePane({
			ariaHeadingLevel: 5,
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.strictEqual(vnode.children![0].properties!['aria-level'], '5',
			'`ariaHeadingLevel` value should be set on title node');
	},

	closeable() {
		const titlePane = new TitlePane({
			closeable: false,
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.isFalse(vnode.children![0].properties!.classes![css.closeable],
			'`closeable=false` should not apply CSS class');
	},

	open() {
		const titlePane = new TitlePane({
			open: false,
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.strictEqual(vnode.children![1].children!.length, 0,
			'`open=false` should not render content');
	}
});
