import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import MenuItem from '../../MenuItem';
import * as css from '../../styles/menu.css';

registerSuite({
	name: 'MenuItem',

	'Should construct menu item with passed properties'() {
		const item = new MenuItem();
		item.setProperties({
			key: 'foo',
			disabled: false,
			external: true,
			label: 'Label',
			selected: false,
			url: 'http://dojo.io'
		});

		assert.strictEqual(item.properties.key, 'foo');
		assert.isFalse(item.properties.disabled);
		assert.isTrue(item.properties.external);
		assert.strictEqual(item.properties.label, 'Label');
		assert.isFalse(item.properties.selected);
		assert.strictEqual(item.properties.url, 'http://dojo.io');
	},

	children: {
		'without children'() {
			const item = new MenuItem();
			const vnode: any = item.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'a');
			assert.lengthOf(vnode.children, 0);
		},

		'with children'() {
			const item = new MenuItem();
			item.setChildren([ 'Child' ]);
			const vnode: any = item.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'span');
			assert.isTrue(vnode.properties.classes[css.menuItem]);
			assert.lengthOf(vnode.children, 2);
		}
	},

	onClick: {
		'when disabled'() {
			const item = new MenuItem();
			let called = false;
			item.setProperties({
				disabled: true,
				onClick() {
					called = true;
				}
			});

			item.onClick(<any> {});
			assert.isFalse(called, '`onClick` should not be called when the menu item is disabled.');
		},

		'when not disabled'() {
			const item = new MenuItem();
			let called = false;
			item.setProperties({
				onClick() {
					called = true;
				}
			});

			item.onClick(<any> {});
			assert.isTrue(called, '`onClick` should be called when the menu item is enabled.');
		}
	},

	onKeypress: {
		'when disabled'() {
			const item = new MenuItem();
			let event: any;
			item.setProperties({
				disabled: true,
				onKeypress(_event: any) {
					event = _event;
				}
			});

			item.onKeypress(<any> { type: 'keypress' });
			assert.isUndefined(event, '`onKeypress` should not be called when the menu item is disabled.');
		},

		'when enabled'() {
			const item = new MenuItem();
			let event: any;
			item.setProperties({
				onKeypress(_event: any) {
					event = _event;
				}
			});

			item.onKeypress(<any> { type: 'keypress' });
			assert.strictEqual(event!.type, 'keypress', '`onKeypress` should be called when the menu item is enabled.');
		}
	},

	disabled() {
		const item = new MenuItem();
		let vnode: any = item.__render__();

		assert.notOk(vnode.properties.classes[css.disabled]);

		item.setProperties({ disabled: true });
		vnode = item.__render__();
		assert.isTrue(vnode.properties.classes[css.disabled]);
	},

	external() {
		const item = new MenuItem();
		item.setProperties({ external: true });
		let vnode: any = item.__render__();

		assert.notOk(vnode.properties.target, 'target should not be set without a url');

		item.setProperties({ external: true, url: 'http://dojo.io' });
		vnode = item.__render__();
		assert.strictEqual(vnode.properties.target, '_blank');
	},

	getAriaProperties() {
		const item = new MenuItem();
		item.setProperties({
			getAriaProperties() {
				return { 'aria-expanded': 'false' };
			}
		});
		const vnode: any = item.__render__();
		assert.strictEqual(vnode.properties['aria-expanded'], 'false',
			'Aria properties should be added to the node');
	},

	hasMenu: {
		'when false'() {
			const item = new MenuItem();
			const vnode: any = item.__render__();

			assert.isTrue(vnode.properties.classes[css.menuItem]);
			assert.notOk(vnode.properties.classes[css.menuLabel]);
		},

		'when true'() {
			const item = new MenuItem();
			item.setProperties({ hasMenu: true });

			const vnode: any = item.__render__();
			const classes = css.menuLabel.split(' ');

			classes.forEach((className: string) => {
				assert.isTrue(vnode.properties.classes[className]);
			});
		}
	},

	label() {
		const item = new MenuItem();
		item.setProperties({ label: 'Label' });
		const vnode: any = item.__render__();

		assert.strictEqual(vnode.text, 'Label');
	},

	selected() {
		const item = new MenuItem();
		let vnode: any = item.__render__();

		assert.notOk(vnode.properties.classes[css.selected]);

		item.setProperties({ selected: true });
		vnode = item.__render__();
		assert.isTrue(vnode.properties.classes[css.selected]);
	},

	tabIndex: {
		'when disabled'() {
			const item = new MenuItem();
			item.setProperties({ disabled: true, tabIndex: 1 });
			const vnode: any = item.__render__();

			assert.strictEqual(vnode.properties.tabIndex, -1, 'Specified tabIndex should be ignored');
		},

		'when enabled'() {
			const item = new MenuItem();
			item.setProperties({ tabIndex: 1 });
			const vnode: any = item.__render__();

			assert.strictEqual(vnode.properties.tabIndex, 1);
		},

		'defaults to 0'() {
			const item = new MenuItem();
			const vnode: any = item.__render__();

			assert.strictEqual(vnode.properties.tabIndex, 0);
		}
	},

	url() {
		const item = new MenuItem();
		item.setProperties({ url: 'http://dojo.io' });
		const vnode: any = item.__render__();

		assert.strictEqual(vnode.properties.href, 'http://dojo.io');
	}
});
