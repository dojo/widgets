import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TitlePane from '../../src/titlepane/TitlePane';

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
		let called = false;

		const titlePane = new TitlePane({
			closeable: true,
			open: true,
			onRequestClose() {
				called = true;
			}
		});

		titlePane.onClickTitle();
		assert.isTrue(called, 'onRequestClose should be called on title click');
	},

	'click title to open'() {
		let called = false;

		const titlePane = new TitlePane({
			closeable: true,
			open: false,
			onRequestOpen() {
				called = true;
			}
		});

		titlePane.onClickTitle();
		assert.isTrue(called, 'onRequestOpen should be called on title click');
	}
});
