import has from '@dojo/has/has';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import Menu, { Orientation } from '../../Menu';
import MenuItem from '../../MenuItem';
import * as css from '../../styles/menu.m.css';

function getStyle(element: any) {
	return {
		getPropertyValue(name: string) {
			return element.style[name];
		}
	};
}

function raf(callback: () => void) {
	callback();
}

function getMockNavElement() {
	const classes: string[] = [];
	const styleHistory: { [key: string]: (string | null)[]; } = {
		height: [ null ],
		'max-height': [ null ],
		transition: [ '0.5s' ]
	};
	const styles = Object.create(null);
	const getDefinition = (name: string) => {
		const group = styleHistory[name];
		return {
			get() {
				return group[group.length - 1];
			},
			set(value: string) {
				group.push(value);
			}
		};
	};
	Object.defineProperty(styles, 'height', getDefinition('height'));
	Object.defineProperty(styles, 'max-height', getDefinition('max-height'));
	Object.defineProperty(styles, 'transition', getDefinition('transition'));

	return {
		get styleHistory() {
			return styleHistory;
		},
		get scrollHeight(){
			return 300;
		},
		scrollTop: null,
		style: styles,
		contains: () => true,
		classList: {
			add(name: string) {
				if (classes.indexOf(name) < 0) {
					classes.push(name);
				}
			},
			contains(name: string) {
				return classes.indexOf(name) > -1;
			},
			remove(name: string) {
				const index = classes.indexOf(name);
				if (index > -1) {
					classes.splice(index, 1);
				}
			}
		}
	};
}

registerSuite({
	name: 'Menu',

	setup() {
		if (has('host-node')) {
			(<any> global).document = Object.create(null);
			(<any> global).requestAnimationFrame = function (callback: () => void) {
				callback();
			};
			(<any> global).getComputedStyle = function (element: any) {
				return {
					getPropertyValue(name: string) {
						return element.style[name];
					}
				};
			};
		}
		else if (has('host-browser')) {
			sinon.stub(window, 'requestAnimationFrame', raf);
			sinon.stub(window, 'getComputedStyle', getStyle);
		}
	},

	teardown() {
		if (has('host-browser')) {
			(<any> window.requestAnimationFrame).restore();
			(<any> window.getComputedStyle).restore();
		}
	},

	'Should construct menu with passed properties'() {
		const menu = new Menu();
		menu.setProperties({
			key: 'foo',
			disabled: false,
			orientation: 'horizontal',
			role: 'menubar'
		});

		assert.strictEqual(menu.properties.key, 'foo');
		assert.isFalse(menu.properties.disabled);
		assert.strictEqual(menu.properties.orientation, 'horizontal');
		assert.strictEqual(menu.properties.role, 'menubar');
	},

	'constructor'() {
		const menu = new Menu();
		const element = getMockNavElement();
		(<any> menu).onElementCreated(element, 'root');
		assert((<any> menu)._domNode);
		menu.destroy();
		assert.notOk((<any> menu)._domNode);
	},

	orientation() {
		const menu = new Menu();
		let vnode: any = menu.__render__();
		assert.notOk(vnode.properties.classes[css.horizontal], 'should not have horizontal class by default');

		menu.setProperties({ orientation: 'horizontal' });
		vnode = menu.__render__();
		assert.isTrue(vnode.properties.classes[css.horizontal], 'should have horizontal class');

		menu.setProperties({ orientation: 'vertical' });
		vnode = menu.__render__();
		assert.notOk(vnode.properties.classes[css.horizontal], 'horizontal class should be removed');
	},

	onMenuFocusOut: {
		'when the event target node is within the menu'() {
			const menu = new Menu();
			const child: any = new MenuItem();
			const element: any = getMockNavElement();

			menu.setChildren([ child ]);
			(<any> menu).onElementCreated(element, 'root');
			(<any> menu).onElementCreated();
			(<any> menu)._onMenuFocusOut();
			(<any> menu)._onMenuFocus();
			(<any> menu)._onMenuFocus();
			(<any> menu)._onMenuFocusOut();
			menu.__render__();

			assert.isTrue(child.properties.active, 'menu should remain active');
		},

		'when the event target node is outside the menu'() {
			const menu = new Menu();
			const child: any = new MenuItem();
			const element: any = getMockNavElement();
			element.contains = () => false;

			menu.setChildren([ child ]);
			(<any> menu).onElementCreated(element, 'root');
			(<any> menu)._onMenuFocus();
			(<any> menu)._onMenuFocusOut();
			menu.__render__();

			assert.isFalse(child.properties.active, 'menu should be inactive');
		}
	},

	onMenuKeyDown: (() => {
		const preventDefault = () => {};
		const stopPropagation = () => {};

		function getDecreaseAssertion(keyCode = 38, orientation: Orientation = 'vertical') {
			return function () {
				const menu = new Menu();
				const first = new MenuItem();
				const second = new MenuItem();

				menu.setProperties({ orientation });
				menu.setChildren(<any> [ first, second ]);
				(<any> menu)._onMenuFocus();
				(<any> menu)._onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				(<any> menu)._renderChildren();

				assert.isTrue(second.properties.active, 'active status should cycle from the first to last child');
				assert.notOk(first.properties.active, 'only one child should be active');

				(<any> menu)._onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				(<any> menu)._renderChildren();

				assert.notOk(second.properties.active, 'previously-active child should be inactive');
				assert.isTrue(first.properties.active, 'previous child should be active');
			};
		}

		function getIncreaseAssertion(keyCode = 40, orientation: Orientation = 'vertical') {
			return function () {
				const menu = new Menu();
				const first = new MenuItem();
				const second = new MenuItem();

				menu.setProperties({ orientation });
				menu.setChildren(<any> [ first, second ]);
				(<any> menu)._onMenuFocus();
				(<any> menu)._onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				(<any> menu)._renderChildren();

				assert.isTrue(second.properties.active, 'next child should be active');
				assert.notOk(first.properties.active, 'only one child should be active');

				(<any> menu)._onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				(<any> menu)._renderChildren();

				assert.notOk(second.properties.active, 'previously-active child should be inactive');
				assert.isTrue(first.properties.active, 'active status should cycle from the last to first child');
			};
		}

		return {
			'tab key'() {
				const menu = new Menu();
				const child = new MenuItem();
				child.setProperties({ active: true });
				menu.setChildren([ <any> child ]);
				(<any> menu)._onMenuKeyDown(<any> { keyCode: 9, stopPropagation: () => {} });
				menu.__render__();

				assert.notOk(child.properties.active, 'Child should be marked as inactive');
			},

			'vertical orientation': {
				'up arrow key': getDecreaseAssertion(),
				'down arrow key': getIncreaseAssertion()
			},

			'horizontal orientation': {
				'left arrow key': getDecreaseAssertion(37, 'horizontal'),
				'right arrow key': getIncreaseAssertion(39, 'horizontal')
			}
		};
	})(),

	onMenuItemMouseDown: {
		'with an item index'() {
			const menu = new Menu();
			const children: any[] = '01234'.split('').map(i => {
				return new MenuItem();
			});

			menu.setChildren(children);
			(<any> menu)._onMenuItemMouseDown(2);
			(<any> menu)._onMenuFocus();
			(<any> menu)._renderChildren();

			children.forEach((child: MenuItem, i) => {
				if (i === 2) {
					assert.isTrue(child.properties.active);
				}
				else {
					assert.isFalse(child.properties.active);
				}
			});
		},

		'without an item index'() {
			const menu = new Menu();
			const children: any[] = '01234'.split('').map(i => {
				return new MenuItem();
			});

			menu.setChildren(children);
			(<any> menu)._onMenuItemMouseDown();
			(<any> menu)._onMenuFocus();
			(<any> menu)._renderChildren();

			children.forEach((child: MenuItem, i) => {
				if (i === 0) {
					assert.isTrue(child.properties.active);
				}
				else {
					assert.isFalse(child.properties.active);
				}
			});
		},

		'with an overriding `activeIndex` property'() {
			const menu = new Menu();
			const children: any[] = '01234'.split('').map(i => {
				return new MenuItem();
			});

			menu.setProperties({ id: 'menu-id' });
			menu.setChildren(children);
			(<any> menu)._onMenuItemMouseDown(2);
			(<any> menu)._onMenuFocus();
			menu.setProperties({ activeIndex: 4 });
			(<any> menu)._renderChildren();

			children.forEach((child: MenuItem, i) => {
				if (i === 4) {
					assert.isTrue(child.properties.active);
				}
				else {
					assert.isFalse(child.properties.active);
				}
			});
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
	}
});
