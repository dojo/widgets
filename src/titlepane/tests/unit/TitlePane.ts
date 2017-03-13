import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TitlePane from '../../TitlePane';
import * as css from '../../styles/titlePane.css';

registerSuite({
	name: 'TitlePane',

	'Render correct children'() {
		const titlePane = new TitlePane();
		titlePane.setProperties({
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.lengthOf(vnode.children, 2);
	},

	'click title to close'() {
		const titlePane = new TitlePane();
		titlePane.setProperties({
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
		titlePane.setProperties({
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

	'property defaults'() {
		const titlePane = new TitlePane();
		titlePane.setProperties({
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
		titlePane.setProperties({
			ariaHeadingLevel: 5,
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.strictEqual(vnode.children![0].properties!['aria-level'], '5',
			'`ariaHeadingLevel` value should be set on title node');
	},

	closeable() {
		const titlePane = new TitlePane();
		titlePane.setProperties({
			closeable: false,
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.isUndefined(vnode.children![0].properties!.classes![css.closeable],
			'`closeable=false` should not apply CSS class');
	},

	open() {
		const titlePane = new TitlePane();
		titlePane.setProperties({
			open: false,
			title: 'test'
		});
		let vnode = <VNode> titlePane.__render__();

		assert.strictEqual(vnode.children![1].children!.length, 0,
			'`open=false` should not render content');
	}
});
