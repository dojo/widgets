import has from '@dojo/has/has';
import { VNode } from '@dojo/interfaces/vdom';
import { w } from '@dojo/widget-core/d';
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
			expandOnClick: false,
			hidden: true
		});

		assert.strictEqual(menu.properties.key, 'foo');
		assert.isFalse(menu.properties.disabled);
		assert.isFalse(menu.properties.expandOnClick);
		assert.isTrue(menu.properties.hidden);
	},

	animate: {
		'without a label': {
			'state classes added immediately'() {
				const menu = new Menu();
				menu.setProperties({
					hidden: true
				});

				let vnode: any = menu.__render__();
				let element: any = getMockNavElement();

				(<any> menu).onElementCreated(element, 'menu');
				(<any> menu).onElementUpdated(element, 'menu');
				assert.isTrue(vnode.properties.classes[css.hidden]);

				menu.setProperties({
					hidden: false
				});

				vnode = menu.__render__();
				element = getMockNavElement();

				(<any> menu).onElementCreated(element, 'menu');
				(<any> menu).onElementUpdated(element, 'menu');
				assert.isTrue(vnode.properties.classes[css.visible]);
			},

			'not animated'() {
				const menu = new Menu();
				const element = getMockNavElement();

				(<any> menu).onElementCreated(element, 'menu');
				(<any> menu).onElementUpdated(element, 'menu');

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null ]);
			}
		},

		'when false': {
			'state classes added immediately'() {
				const menu = new Menu();
				menu.setProperties({
					animate: false,
					label: 'Menu label'
				});

				let vnode: any = menu.__render__();
				let menuNode = vnode.children[1];
				let element: any = getMockNavElement();

				(<any> menu).onElementCreated(element, 'menu');
				(<any> menu).onElementUpdated(element, 'menu');
				assert.isTrue(menuNode.properties.classes[css.hidden]);

				menu.setProperties({
					animate: false,
					label: 'Menu label',
					hidden: false
				});

				vnode = menu.__render__();
				menuNode = vnode.children[1];
				element = getMockNavElement();

				(<any> menu).onElementCreated(element, 'menu');
				(<any> menu).onElementUpdated(element, 'menu');
				assert.isTrue(menuNode.properties.classes[css.visible]);
			},

			'style.height not reset on initialization'() {
				const menu = new Menu();
				menu.setProperties({
					animate: false,
					label: 'Menu label'
				});
				const element: any = getMockNavElement();
				(<any> menu).onElementCreated(element, 'menu');

				assert.isNull(element.style.height, 'style.height should not be modified');
			},

			'style.height removed on subsequent renders'() {
				const menu = new Menu();
				const element = getMockNavElement();
				menu.setProperties({
					animate: false,
					label: 'Menu label'
				});

				(<any> menu).onElementCreated(element, 'menu');
				(<any> menu).onElementUpdated(element, 'menu');

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null, null ], 'style.height should be reset');
			}
		},

		'when true': {
			'state classes not added immediately after the initial render'() {
				const menu = new Menu();
				menu.setProperties({
					label: 'Menu label'
				});

				const element = getMockNavElement();
				let vnode: any = menu.__render__();
				let menuNode = vnode.children[1];

				(<any> menu).onElementCreated(element);
				(<any> menu).onElementCreated(element, 'menu');

				menu.setProperties({
					label: 'Other label'
				});
				vnode = menu.__render__();
				menuNode = vnode.children[1];
				(<any> menu).onElementUpdated(element);
				(<any> menu).onElementUpdated(element, 'menu');

				assert.notOk(menuNode.properties.classes[css.hidden]);
			},

			'style.height zeroed when hidden'() {
				const menu = new Menu();
				menu.setProperties({
					label: 'Menu label'
				});

				let element = getMockNavElement();

				(<any> menu).onElementCreated(element, 'menu');
				assert.strictEqual(element.style.height, '0');

				menu.setProperties({ hidden: false, label: 'Menu label' });
				element = getMockNavElement();
				(<any> menu).onElementCreated(element, 'menu');
				assert.isNull(element.style.height);
			},

			'collapsed from the scroll height to 0'() {
				const menu = new Menu();
				menu.setProperties({ hidden: false, label: 'Menu label' });
				const element = getMockNavElement();

				(<any> menu).onElementCreated(element, 'menu');
				menu.setProperties({ hidden: true, label: 'Menu label' });
				(<any> menu).onElementUpdated(element, 'menu');

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null, '300px', '0' ]);
				assert.sameMembers(styleHistory.transition, [ '0.5s', null, '0.5s' ]);
			},

			'collapsed from the max-height if it is set'() {
				const menu = new Menu();
				menu.setProperties({ hidden: false, label: 'Menu label' });

				const element = getMockNavElement();
				element.style['max-height'] = '100px';

				(<any> menu).onElementCreated(element, 'menu');
				menu.setProperties({ label: 'Menu label', hidden: true });
				(<any> menu).onElementUpdated(element, 'menu');

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null, '100px', '0' ]);
			},

			'expanded to the scroll height'() {
				const menu = new Menu();
				menu.setProperties({ hidden: true, label: 'Menu label' });

				const element = getMockNavElement();

				(<any> menu).onElementCreated(element, 'menu');
				menu.setProperties({ hidden: false, label: 'Menu label' });
				(<any> menu).onElementUpdated(element, 'menu');

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null, '0', '300px' ]);
				assert.strictEqual(element.scrollTop, 0, 'The nav should be scrolled top');
			},

			'animates to the max-height when set'() {
				const menu = new Menu();
				menu.setProperties({ hidden: true, label: 'Menu label' });

				const element = getMockNavElement();
				element.style['max-height'] = '100px';

				(<any> menu).onElementCreated(element, 'menu');
				menu.setProperties({ hidden: false, label: 'Menu label' });
				(<any> menu).onElementUpdated(element, 'menu');

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null, '0', '100px' ]);
			}
		}
	},

	label: {
		'renders the menu within a MenuItem'() {
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

			assert.strictEqual(label.vnodeSelector, 'span', 'label node should be a <span>');
			assert.strictEqual(label.text, 'Menu label', 'label node should have the label text');
		},

		'does not use a container if there is no label'() {
			const menu = new Menu();
			menu.setChildren([ 'first', 'second', 'third' ]);
			const vnode = <VNode> menu.__render__();

			assert.lengthOf(vnode.children, 3, 'menu node should have all children');
		}
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

	onRequestShow() {
		const menu = new Menu();
		menu.setProperties({
			label: 'Menu label',
			onRequestShow() {
				menu.setProperties({ hidden: false });
			}
		});
		(<any> menu).onLabelClick();

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
		(<any> menu).onLabelClick();

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
		(<any> menu).onLabelClick();

		assert.isTrue(menu.properties.hidden, 'menu should not be shown on click when `expandOnClick` is false');
	},

	onLabelKeyDown: {
		'enter key: when disabled'() {
			const menu = new Menu();
			menu.setProperties({
				disabled: true,
				hidden: true,
				onRequestShow() {
					menu.setProperties({ hidden: false });
				}
			});

			(<any> menu).onLabelKeyDown(<any> { keyCode: 13 });
			assert.isTrue(menu.properties.hidden, 'menu should remain hidden when disabled');
		},

		'enter key: when enabled'() {
			const menu = new Menu();
			menu.setProperties({
				hidden: true,
				onRequestShow() {
					menu.setProperties({ hidden: false });
				}
			});

			(<any> menu).onLabelKeyDown(<any> { keyCode: 13 });
			(<any> menu).onLabelKeyDown(<any> {});
			assert.isFalse(menu.properties.hidden);
		},

		'down arrow: horizontal orientation'() {
			const menu = new Menu();
			menu.setChildren([
				w(MenuItem, { key: 'child' }, [ 'child' ])
			]);

			menu.setProperties({
				label: 'Menu label',
				orientation: 'horizontal'
			});
			(<any> menu).onLabelKeyDown(<any> { keyCode: 40 });
			(<any> menu).onLabelKeyDown(<any> {});

			assert.notOk(menu.properties.hidden, 'the submenu should not be hidden');
		},

		'right arrow: vertical orientation'() {
			const menu = new Menu();
			menu.setChildren([
				w(MenuItem, { key: 'child' }, [ 'child' ])
			]);

			menu.setProperties({
				hidden: false,
				label: 'Menu label'
			});
			(<any> menu).onLabelKeyDown(<any> { keyCode: 39 });
			(<any> menu).onLabelKeyDown(<any> {});

			assert.notOk(menu.properties.hidden, 'the submenu should not be hidden');
		}
	},

	onMenuFocus: {
		'when disabled'() {
			const menu = new Menu();
			menu.setProperties({
				disabled: true,
				hidden: true,
				onRequestShow() {
					menu.setProperties({ hidden: false });
				}
			});

			(<any> menu).onMenuFocus();
			assert.isTrue(menu.properties.hidden, 'menu should remain hidden when disabled');
		},

		'when enabled and visible'() {
			const menu = new Menu();
			let hideCalled = false;
			let showCalled = false;
			menu.setProperties({
				onRequestHide() {
					hideCalled = true;
				},
				onRequestShow() {
					showCalled = true;
				}
			});

			(<any> menu).onMenuFocus();
			assert.isFalse(hideCalled, 'onRequestHide not called');
			assert.isFalse(showCalled, 'onRequestShow not called');
		}
	},

	onMenuFocusOut: {
		'with a label: submenu has focus'() {
			const menu = new Menu();
			menu.setProperties({ label: 'menu label' });
			const element: any = getMockNavElement();

			(<any> menu).onElementCreated(element, 'menu');
			(<any> menu).onMenuFocus();
			(<any> menu).onMenuFocusOut();

			assert.isTrue(menu.state.active, 'menu should remain active');
		},

		'with a label: submenu loses focus'() {
			const menu = new Menu();
			menu.setProperties({ label: 'menu label' });
			const element: any = getMockNavElement();
			element.contains = () => false;

			(<any> menu).onElementCreated(element, 'menu');
			(<any> menu).onMenuFocus();
			(<any> menu).onMenuFocusOut();

			assert.isFalse(menu.state.active, 'menu should be inactive');
		},

		'without a label'() {
			const menu = new Menu();
			const element: any = getMockNavElement();
			element.contains = () => false;

			(<any> menu).onElementCreated(element, 'menu');
			(<any> menu).onMenuFocus();
			(<any> menu).onMenuFocusOut();

			assert.isFalse(menu.state.active, 'menu should be inactive');
		}
	},

	onMenuKeyDown: (() => {
		const preventDefault = () => {};
		const stopPropagation = () => {};

		function getExitAssertion(keyCode = 37, orientation: Orientation = 'vertical') {
			return function () {
				const menu = new Menu();
				menu.setProperties({ orientation });
				(<any> menu).onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				sinon.spy(menu, 'invalidate');

				assert.isFalse((<any> menu.invalidate).called, 'menu should not be invalidated');

				menu.setProperties({ label: 'menu label', orientation });
				(<any> menu).onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				assert.isFalse((<any> menu.invalidate).called, 'menu should not be invalidated while hidden');

				menu.setProperties({ label: 'menu label', hidden: false, orientation });
				const child = new MenuItem();
				child.setProperties({ active: true });
				menu.setChildren([ <any> child ]);
				(<any> menu).onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				menu.__render__();

				assert.isTrue((<any> menu.invalidate).called, 'menu should be invalidated');
				assert.isFalse(child.properties.active, 'menu item should not be active');
			};
		}

		function getDecreaseAssertion(keyCode = 38, orientation: Orientation = 'vertical') {
			return function () {
				const menu = new Menu();
				const first = new MenuItem();
				const second = new MenuItem();

				menu.setProperties({ label: 'menu label', hidden: false, orientation });
				menu.setChildren(<any> [ first, second ]);
				(<any> menu).onMenuFocus();
				(<any> menu).onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				(<any> menu).renderChildren();

				assert.isTrue(second.properties.active, 'active status should cycle from the first to last child');
				assert.notOk(first.properties.active, 'only one child should be active');

				(<any> menu).onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				(<any> menu).renderChildren();

				assert.notOk(second.properties.active, 'previously-active child should be inactive');
				assert.isTrue(first.properties.active, 'previous child should be active');
			};
		}

		function getIncreaseAssertion(keyCode = 40, orientation: Orientation = 'vertical') {
			return function () {
				const menu = new Menu();
				const first = new MenuItem();
				const second = new MenuItem();

				menu.setProperties({ label: 'menu label', hidden: false, orientation });
				menu.setChildren(<any> [ first, second ]);
				(<any> menu).onMenuFocus();
				(<any> menu).onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				(<any> menu).renderChildren();

				assert.isTrue(second.properties.active, 'next child should be active');
				assert.notOk(first.properties.active, 'only one child should be active');

				(<any> menu).onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				(<any> menu).renderChildren();

				assert.notOk(second.properties.active, 'previously-active child should be inactive');
				assert.isTrue(first.properties.active, 'active status should cycle from the last to first child');
			};
		}

		return {
			'common operations': {
				'space key'() {
					const menu = new Menu();
					let onRequestHide = sinon.spy();

					menu.setProperties({ onRequestHide });
					(<any> menu).onMenuKeyDown(<any> { keyCode: 32 });
					assert.isTrue(onRequestHide.called, 'Menu should be hidden');

					onRequestHide = sinon.spy();
					menu.setProperties({ hideOnActivate: false });
					(<any> menu).onMenuKeyDown(<any> { keyCode: 32 });
					assert.isFalse(onRequestHide.called, 'Menu should not be hidden');

					onRequestHide = sinon.spy();
					menu.setProperties({ hideOnActivate: true, role: 'menubar' });
					(<any> menu).onMenuKeyDown(<any> { keyCode: 32 });
					assert.isFalse(onRequestHide.called, 'Menu should not be hidden');
				},

				'tab key'() {
					const menu = new Menu();
					const child = new MenuItem();
					child.setProperties({ active: true });
					menu.setChildren([ <any> child ]);
					(<any> menu).onMenuKeyDown(<any> { keyCode: 9, stopPropagation: () => {} });
					menu.__render__();

					assert.notOk(child.properties.active, 'Child should be marked as inactive');
				},

				'escape key'() {
					const menu = new Menu();
					let onRequestHide = sinon.spy();

					menu.setProperties({ onRequestHide });
					(<any> menu).onMenuKeyDown(<any> { keyCode: 27, stopPropagation: () => {} });
					menu.__render__();

					assert.isFalse(onRequestHide.called, 'top-level menu should not be hidden');

					const renderLabel = menu.renderLabel;
					let label: any;
					menu.renderLabel = function () {
						label = renderLabel.call(menu);
						return label;
					};

					onRequestHide = sinon.spy();
					menu.setProperties({ label: 'menu label', onRequestHide });
					(<any> menu).onMenuKeyDown(<any> { keyCode: 27, stopPropagation: () => {} });
					menu.__render__();

					assert.isTrue(label.properties.active, 'menu label should be active');
					assert.isTrue(onRequestHide.called, 'menu should be hidden');
				}
			},

			'vertical orientation': {
				'left arrow key': getExitAssertion(),
				'up arrow key': getDecreaseAssertion(),
				'down arrow key': getIncreaseAssertion()
			},

			'horizontal orientation': {
				'up arrow key': getExitAssertion(38, 'horizontal'),
				'left arrow key': getDecreaseAssertion(37, 'horizontal'),
				'right arrow key': getIncreaseAssertion(39, 'horizontal')
			}
		};
	})(),

	onMenuMouseDown: {
		'item with `data-dojo-index` property'() {
			const menu = new Menu();
			const children: any[] = '01234'.split('').map(i => {
				return new MenuItem();
			});

			menu.setChildren(children);
			(<any> menu).onMenuMouseDown(<any> {
				target: {
					hasAttribute: () => false,
					parentElement: {
						getAttribute: () => '2',
						hasAttribute: () => true
					}
				}
			});
			(<any> menu).onMenuFocus();
			(<any> menu).renderChildren();

			children.forEach((child: MenuItem, i) => {
				if (i === 2) {
					assert.isTrue(child.properties.active);
				}
				else {
					assert.isFalse(child.properties.active);
				}
			});
		},

		'item without `data-dojo-index` property'() {
			const menu = new Menu();
			const children: any[] = '01234'.split('').map(i => {
				return new MenuItem();
			});

			menu.setChildren(children);
			(<any> menu).onMenuMouseDown(<any> {
				target: {
					hasAttribute: () => true,
					getAttribute: () => null
				}
			});
			(<any> menu).onMenuFocus();
			(<any> menu).renderChildren();

			children.forEach((child: MenuItem, i) => {
				if (i === 0) {
					assert.isTrue(child.properties.active);
				}
				else {
					assert.isFalse(child.properties.active);
				}
			});
		}
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
			(<any> menu).onMenuMouseEnter();

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

			(<any> menu).onMenuMouseEnter();
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
			(<any> menu).onMenuMouseLeave();

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

			(<any> menu).onMenuMouseLeave();
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
		(<any> menu).onLabelClick();

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

			(<any> menu).onMenuMouseLeave();
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

			(<any> menu).onMenuMouseLeave();
			(<any> menu).onMenuMouseEnter();
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

			(<any> menu).onMenuMouseLeave();
			(<any> menu).onMenuMouseLeave();
			(<any> menu).onMenuMouseLeave();
			(<any> menu).onMenuMouseLeave();
			(<any> menu).onMenuMouseLeave();

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

			(<any> menu).onMenuMouseLeave();
			menu.destroy();
			setTimeout(dfd.callback(() => {
				assert.isFalse(menu.properties.hidden, 'menu should not be hidden after the menu is destroyed');
			}), 300);
		}
	},

	hideOnActivate: {
		'when true'() {
			const menu = new Menu();
			const onRequestHide = sinon.spy();

			menu.setProperties({ onRequestHide });
			(<any> menu).onItemActivate();

			assert.isTrue(onRequestHide.called, 'Menu should be hidden');
		},

		'when false'() {
			const menu = new Menu();
			const onRequestHide = sinon.spy();

			menu.setProperties({ hideOnActivate: false, onRequestHide });
			(<any> menu).onItemActivate();

			assert.isFalse(onRequestHide.called, 'Menu should not be hidden');
		},

		'ignored for menu bars'() {
			const menu = new Menu();
			const onRequestHide = sinon.spy();

			menu.setProperties({ onRequestHide, role: 'menubar' });
			(<any> menu).onItemActivate();

			assert.isFalse(onRequestHide.called, 'Menu bars should not be hidden');
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

		'adds `nestedMenuRoot` class to container when there is a label'() {
			const menu = new Menu();
			menu.setProperties({ label: 'Menu Label', nested: true });
			const vnode: any = menu.__render__();

			assert.isTrue(vnode.properties.classes[css.nestedMenuRoot]);
		}
	}
});
