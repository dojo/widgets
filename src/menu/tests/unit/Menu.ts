import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Menu from '../../Menu';
import * as css from '../../styles/menu.css';

registerSuite({
	name: 'Menu',

	'Should construct menu with passed properties'() {
		const menu = new Menu();
		menu.setProperties({
			key: 'foo',
			disabled: false,
			expandOnClick: false,
			hidden: true
		});

		assert.strictEqual(menu.properties.key, 'foo');
		assert.isFalse(menu.properties.disabled);
		assert.isFalse(menu.properties.expandOnClick);
		assert.isTrue(menu.properties.hidden);
	},

	label: {
		'renders the menu within a container'() {
			const menu = new Menu();
			menu.setProperties({
				hidden: false,
				label: 'Menu label'
			});
			const vnode = <VNode> menu.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div', 'container node should be a div');
			assert.lengthOf(vnode.children, 2);
		},

		'renders the label as a link to the container'() {
			const menu = new Menu();
			menu.setProperties({
				label: 'Menu label'
			});
			const vnode = <VNode> menu.__render__();
			const label = <VNode> vnode.children![0];

			assert.strictEqual(label.vnodeSelector, 'a', 'label node should be a link');
			assert.strictEqual(label.text, 'Menu label', 'label node should have the label text');
		},

		'does not use a container if there is no label'() {
			const menu = new Menu();
			menu.setChildren([ 'first', 'second', 'third' ]);
			const vnode = <VNode> menu.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'nav', 'menu node should be a nav');
			assert.lengthOf(vnode.children, 3, 'menu node should have all children');
		},

		'allows label properties instead of a label string'() {
			const menu = new Menu();
			menu.setProperties({
				label: { label: 'Menu label' }
			});
			const vnode = <VNode> menu.__render__();
			const label = <VNode> vnode.children![0];

			assert.strictEqual(label.text, 'Menu label', 'label node should have the label text');
		}
	},

	onRequestShow() {
		const menu = new Menu();
		menu.setProperties({
			label: 'Menu label',
			onRequestShow() {
				menu.setProperties({ hidden: false });
			}
		});
		menu.onLabelClick();

		assert.isFalse(menu.properties.hidden, 'menu should not be hidden');
	},

	onRequestHide() {
		const menu = new Menu();
		menu.setProperties({
			hidden: false,
			label: 'Menu label',
			onRequestHide() {
				menu.setProperties({ hidden: true });
			}
		});
		menu.onLabelClick();

		assert.isTrue(menu.properties.hidden, 'menu should be hidden');
	},

	onLabelClick() {
		const menu = new Menu();
		menu.setProperties({
			expandOnClick: false,
			hidden: true,
			onRequestShow() {
				menu.setProperties({ hidden: false });
			}
		});
		menu.onLabelClick();

		assert.isTrue(menu.properties.hidden, 'menu should not be shown on click when `expandOnClick` is false');
	},

	onMenuMouseEnter: {
		'when `expandOnClick` is true'() {
			const menu = new Menu();
			menu.setProperties({
				hidden: true,
				onRequestShow() {
					menu.setProperties({ hidden: false });
				}
			});
			menu.onMenuMouseEnter();

			assert.isTrue(menu.properties.hidden, 'mouseenter should be ignored');
		},

		'when `expandOnClick` is false'() {
			const menu = new Menu();
			menu.setProperties({
				expandOnClick: false,
				hidden: true,
				onRequestShow() {
					menu.setProperties({ hidden: false });
				}
			});

			menu.onMenuMouseEnter();
			assert.isFalse(menu.properties.hidden, 'mouseenter should not be ignored');
		}
	},

	onMenuMouseLeave: {
		'when `expandOnClick` is true'() {
			const menu = new Menu();
			menu.setProperties({
				hidden: false,
				hideDelay: 0,
				onRequestHide() {
					menu.setProperties({ hidden: true });
				}
			});
			menu.onMenuMouseLeave();

			assert.isFalse(menu.properties.hidden, 'mouseleave should be ignored');
		},

		'when `expandOnClick` is false'() {
			const menu = new Menu();
			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				hideDelay: 0,
				onRequestHide() {
					menu.setProperties({ hidden: true });
				}
			});

			menu.onMenuMouseLeave();
			assert.isTrue(menu.properties.hidden, 'mouseleave should not be ignored');
		}
	},

	disabled() {
		const menu = new Menu();
		menu.setProperties({
			disabled: true,
			label: 'Menu label',
			onRequestShow() {
				menu.setProperties({ hidden: false });
			}
		});
		menu.__render__();
		menu.onLabelClick();

		assert.isUndefined(menu.properties.hidden, 'menu should not be displayed when disabled');
	},

	hidden: {
		'hidden by default with a label'() {
			const menu = new Menu();
			menu.setProperties({ label: 'Menu label' });
			const vnode: any = menu.__render__();

			assert.isTrue(vnode.children[1].properties.classes[css.hidden]);
		},

		'displayed by default without a label'() {
			const menu = new Menu();
			const vnode: any = menu.__render__();

			assert.notOk(vnode.properties.classes[css.hidden]);
		},

		'can still be hidden without a label'() {
			const menu = new Menu();
			menu.setProperties({ hidden: true });
			const vnode: any = menu.__render__();

			assert.isTrue(vnode.properties.classes[css.hidden]);
		}
	},

	hideDelay: {
		'menu not hidden immediately'(this: any) {
			const dfd = this.async(500);
			const menu = new Menu();
			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				hideDelay: 200,
				onRequestHide() {
					menu.setProperties({ hidden: true });
				}
			});

			menu.onMenuMouseLeave();
			assert.isFalse(menu.properties.hidden, 'menu should not be hidden immediately');
			setTimeout(dfd.callback(() => {
				assert.isTrue(menu.properties.hidden, 'menu should be hidden after a delay');
			}), 200);
		},

		'after show request'(this: any) {
			const dfd = this.async(500);
			const menu = new Menu();
			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				hideDelay: 200,
				onRequestHide() {
					menu.setProperties({ hidden: true });
				}
			});

			menu.onMenuMouseLeave();
			menu.onMenuMouseEnter();
			setTimeout(dfd.callback(() => {
				assert.isFalse(menu.properties.hidden, 'menu should not be hidden after show request');
			}), 200);
		},

		'subsequent hides'(this: any) {
			const dfd = this.async(500);
			const menu = new Menu();
			let callCount = 0;

			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				hideDelay: 200,
				onRequestHide() {
					callCount++;
					menu.setProperties({ hidden: true });
				}
			});

			menu.onMenuMouseLeave();
			menu.onMenuMouseLeave();
			menu.onMenuMouseLeave();
			menu.onMenuMouseLeave();
			menu.onMenuMouseLeave();

			setTimeout(dfd.callback(() => {
				assert.strictEqual(callCount, 1, 'hide request should be called once');
			}), 200);
		},

		'after destroy'(this: any) {
			const dfd = this.async(500);
			const menu = new Menu();
			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				onRequestHide() {
					menu.setProperties({ hidden: true });
				}
			});

			menu.onMenuMouseLeave();
			menu.destroy();
			setTimeout(dfd.callback(() => {
				assert.isFalse(menu.properties.hidden, 'menu should not be hidden after the menu is destroyed');
			}), 300);
		}
	},

	id() {
		const menu = new Menu();
		let vnode: any = menu.__render__();

		assert.isString(vnode.properties.id, 'id should be generated');

		menu.setProperties({ id: 'menu-42' });
		vnode = menu.__render__();
		assert.strictEqual(vnode.properties.id, 'menu-42');
	},

	role() {
		const menu = new Menu();
		let vnode: any = menu.__render__();

		assert.strictEqual(vnode.properties.role, 'menu', 'role should default to "menu"');

		menu.setProperties({ role: 'menubar' });
		vnode = menu.__render__();
		assert.strictEqual(vnode.properties.role, 'menubar');
	},

	nested: {
		'adds `nestedMenu` class to menu when there is no label'() {
			const menu = new Menu();
			menu.setProperties({ nested: true });
			const vnode: any = menu.__render__();

			assert.isTrue(vnode.properties.classes[css.nestedMenu]);
		},

		'adds `nestedMenuContainer` class to container when there is a label'() {
			const menu = new Menu();
			menu.setProperties({ label: 'Menu Label', nested: true });
			const vnode: any = menu.__render__();

			assert.isTrue(vnode.properties.classes[css.nestedMenuContainer]);
		}
	}
});
