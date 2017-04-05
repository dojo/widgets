import has from '@dojo/has/has';
import { VNode } from '@dojo/interfaces/vdom';
import { w } from '@dojo/widget-core/d';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import { Orientation } from '../../Menu';
import SubMenu from '../../SubMenu';
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
	name: 'SubMenu',

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
		const menu = new SubMenu();
		menu.setProperties({
			disabled: false,
			expandOnClick: false,
			hidden: true,
			key: 'foo',
			label: 'Menu Label'
		});

		assert.strictEqual(menu.properties.key, 'foo');
		assert.isFalse(menu.properties.disabled);
		assert.isFalse(menu.properties.expandOnClick);
		assert.isTrue(menu.properties.hidden);
		assert.strictEqual(menu.properties.label, 'Menu Label');
	},

	animate: {
		'when false': {
			'state classes added immediately'() {
				const menu = new SubMenu();
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
				const menu = new SubMenu();
				menu.setProperties({
					animate: false,
					label: 'Menu label'
				});
				const element: any = getMockNavElement();
				(<any> menu).onElementCreated(element, 'menu');

				assert.isNull(element.style.height, 'style.height should not be modified');
			},

			'style.height removed on subsequent renders'() {
				const menu = new SubMenu();
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
				const menu = new SubMenu();
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
				const menu = new SubMenu();
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
				const menu = new SubMenu();
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
				const menu = new SubMenu();
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
				const menu = new SubMenu();
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
				const menu = new SubMenu();
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
			const menu = new SubMenu();
			menu.setProperties({
				hidden: false,
				label: 'Menu label'
			});
			const vnode = <VNode> menu.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div', 'container node should be a div');
			assert.lengthOf(vnode.children, 2);
		},

		'renders the label as a link to the container'() {
			const menu = new SubMenu();
			menu.setProperties({
				label: 'Menu label'
			});
			const vnode = <VNode> menu.__render__();
			const label = <VNode> vnode.children![0];

			assert.strictEqual(label.vnodeSelector, 'span', 'label node should be a <span>');
			assert.strictEqual(label.text, 'Menu label', 'label node should have the label text');
		}
	},

	onRequestShow() {
		const menu = new SubMenu();
		menu.setProperties({
			label: 'Menu label',
			onRequestShow() {
				menu.setProperties({ hidden: false, label: 'Menu label' });
			}
		});
		(<any> menu)._onLabelClick();

		assert.isFalse(menu.properties.hidden, 'menu should not be hidden');
	},

	onRequestHide() {
		const menu = new SubMenu();
		menu.setProperties({
			hidden: false,
			label: 'Menu label',
			onRequestHide() {
				menu.setProperties({ hidden: true, label: 'Menu label' });
			}
		});
		(<any> menu)._onLabelClick();

		assert.isTrue(menu.properties.hidden, 'menu should be hidden');
	},

	onLabelClick: {
		'when `expandOnClick` is false'() {
			const menu = new SubMenu();
			menu.setProperties({
				expandOnClick: false,
				hidden: true,
				label: 'Menu label',
				onRequestShow() {
					menu.setProperties({ hidden: false, label: 'Menu label' });
				}
			});
			(<any> menu)._onLabelClick();

			assert.isTrue(menu.properties.hidden, 'menu should not be displayed on click');
		},

		'when `expandOnClick` is true'() {
			const menu = new SubMenu();
			const children: any[] = '01234'.split('').map(i => {
				return new MenuItem();
			});

			menu.setProperties({
				expandOnClick: true,
				hidden: true,
				label: 'Menu label',
				onRequestShow() {
					menu.setProperties({ hidden: false, label: 'Menu label' });
				}
			});
			menu.setChildren(children);
			(<any> menu)._onLabelClick();
			menu.__render__();

			assert.isFalse(menu.properties.hidden, 'menu should be displayed on click');
			children.forEach((child: MenuItem) => {
				assert.notOk(child.properties.active, 'menu items should be inactive');
			});
		}
	},

	onLabelKeyDown: {
		'enter key: when disabled'() {
			const menu = new SubMenu();
			menu.setProperties({
				disabled: true,
				hidden: true,
				label: 'Menu label',
				onRequestShow() {
					menu.setProperties({ hidden: false, label: 'Menu label' });
				}
			});

			(<any> menu)._onLabelKeyDown(<any> { keyCode: 13 });
			assert.isTrue(menu.properties.hidden, 'menu should remain hidden when disabled');
		},

		'enter key: when enabled'() {
			const menu = new SubMenu();
			menu.setProperties({
				hidden: true,
				label: 'Menu label',
				onRequestShow() {
					menu.setProperties({ hidden: false, label: 'Menu label' });
				}
			});

			(<any> menu)._onLabelKeyDown(<any> { keyCode: 13 });
			(<any> menu)._onLabelKeyDown(<any> {});
			assert.isFalse(menu.properties.hidden);
		},

		'down arrow: horizontal orientation'() {
			const menu = new SubMenu();
			menu.setChildren([
				w(MenuItem, { key: 'child' }, [ 'child' ])
			]);

			menu.setProperties({
				label: 'Menu label',
				orientation: 'horizontal'
			});

			const preventDefault = sinon.spy();
			(<any> menu)._onLabelKeyDown(<any> { keyCode: 40, preventDefault });
			(<any> menu)._onLabelKeyDown(<any> {});

			assert.isTrue(preventDefault.called, 'the default action should be prevented to prevent scrolling');
			assert.notOk(menu.properties.hidden, 'the submenu should not be hidden');
		},

		'right arrow: vertical orientation'() {
			const menu = new SubMenu();
			menu.setChildren([
				w(MenuItem, { key: 'child' }, [ 'child' ])
			]);

			menu.setProperties({
				hidden: false,
				label: 'Menu label'
			});
			(<any> menu)._onLabelKeyDown(<any> { keyCode: 39 });
			(<any> menu)._onLabelKeyDown(<any> {});

			assert.notOk(menu.properties.hidden, 'the submenu should not be hidden');
		}
	},

	onMenuKeyDown: (() => {
		const preventDefault = () => {};
		const stopPropagation = () => {};

		function getExitAssertion(keyCode = 37, orientation: Orientation = 'vertical') {
			return function () {
				const menu = new SubMenu();
				menu.setProperties({ label: 'Menu label', orientation });
				(<any> menu)._onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				sinon.spy(menu, 'invalidate');

				assert.isFalse((<any> menu.invalidate).called, 'menu should not be invalidated');

				menu.setProperties({ label: 'menu label', orientation });
				(<any> menu)._onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				assert.isFalse((<any> menu.invalidate).called, 'menu should not be invalidated while hidden');

				menu.setProperties({ label: 'menu label', hidden: false, orientation });
				const child = new MenuItem();
				child.setProperties({ active: true });
				menu.setChildren([ <any> child ]);
				(<any> menu)._onMenuKeyDown(<any> { keyCode, preventDefault, stopPropagation });
				menu.__render__();

				assert.isTrue((<any> menu.invalidate).called, 'menu should be invalidated');
				assert.isFalse(child.properties.active, 'menu item should not be active');
			};
		}

		return {
			'common operations': {
				'space key'() {
					const menu = new SubMenu();
					let onRequestHide = sinon.spy();

					menu.setProperties({ label: 'Menu label', onRequestHide });
					(<any> menu)._onMenuKeyDown(<any> { keyCode: 32 });
					assert.isTrue(onRequestHide.called, 'Menu should be hidden');

					onRequestHide = sinon.spy();
					menu.setProperties({ label: 'Menu label', hideOnActivate: false });
					(<any> menu)._onMenuKeyDown(<any> { keyCode: 32 });
					assert.isFalse(onRequestHide.called, 'Menu should not be hidden');

					onRequestHide = sinon.spy();
					menu.setProperties({ label: 'Menu label', hideOnActivate: true, role: 'menubar' });
					(<any> menu)._onMenuKeyDown(<any> { keyCode: 32 });
					assert.isFalse(onRequestHide.called, 'Menu should not be hidden');
				},

				'escape key'() {
					const menu = new SubMenu();
					const onRequestHide = sinon.spy();
					const renderLabel = menu.renderLabel;

					let label: any;
					menu.renderLabel = function () {
						label = renderLabel.call(menu);
						return label;
					};

					menu.setProperties({ label: 'menu label', onRequestHide });
					(<any> menu)._onMenuKeyDown(<any> { keyCode: 27, stopPropagation: () => {} });
					menu.__render__();

					assert.isTrue(label.properties.active, 'menu label should be active');
					assert.isTrue(onRequestHide.called, 'menu should be hidden');
				}
			},

			'left arrow key: vertical orientation': getExitAssertion(),
			'up arrow key: horizontal orientation': getExitAssertion(38, 'horizontal')
		};
	})(),

	onMenuMouseEnter: {
		'when `expandOnClick` is true'() {
			const menu = new SubMenu();
			menu.setProperties({
				hidden: true,
				label: 'Menu label',
				onRequestShow() {
					menu.setProperties({ label: 'Menu label', hidden: false });
				}
			});
			(<any> menu)._onMenuMouseEnter();

			assert.isTrue(menu.properties.hidden, 'mouseenter should be ignored');
		},

		'when `expandOnClick` is false'() {
			const menu = new SubMenu();
			menu.setProperties({
				expandOnClick: false,
				hidden: true,
				label: 'Menu label',
				onRequestShow() {
					menu.setProperties({ label: 'Menu label', hidden: false });
				}
			});

			(<any> menu)._onMenuMouseEnter();
			assert.isFalse(menu.properties.hidden, 'mouseenter should not be ignored');
		}
	},

	onMenuMouseLeave: {
		'when `expandOnClick` is true'() {
			const menu = new SubMenu();
			menu.setProperties({
				hidden: false,
				hideDelay: 0,
				label: 'Menu label',
				onRequestHide() {
					menu.setProperties({ label: 'Menu label', hidden: true });
				}
			});
			(<any> menu)._onMenuMouseLeave();

			assert.isFalse(menu.properties.hidden, 'mouseleave should be ignored');
		},

		'when `expandOnClick` is false'() {
			const menu = new SubMenu();
			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				hideDelay: 0,
				label: 'Menu label',
				onRequestHide() {
					menu.setProperties({ label: 'Menu label', hidden: true });
				}
			});

			(<any> menu)._onMenuMouseLeave();
			assert.isTrue(menu.properties.hidden, 'mouseleave should not be ignored');
		}
	},

	disabled() {
		const menu = new SubMenu();
		menu.setProperties({
			disabled: true,
			label: 'Menu label',
			onRequestShow() {
				menu.setProperties({ label: 'Menu label', hidden: false });
			}
		});
		menu.__render__();
		(<any> menu)._onLabelClick();

		assert.isUndefined(menu.properties.hidden, 'menu should not be displayed when disabled');
	},

	hidden() {
		const menu = new SubMenu();
		menu.setProperties({ label: 'Menu label' });
		const vnode: any = menu.__render__();

		assert.isTrue(vnode.children[1].properties.classes[css.hidden], 'menu should be hidden by default');
	},

	hideDelay: {
		'menu not hidden immediately'(this: any) {
			const dfd = this.async(500);
			const menu = new SubMenu();
			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				hideDelay: 200,
				label: 'Menu label',
				onRequestHide() {
					menu.setProperties({ label: 'Menu label', hidden: true });
				}
			});

			(<any> menu)._onMenuMouseLeave();
			assert.isFalse(menu.properties.hidden, 'menu should not be hidden immediately');
			setTimeout(dfd.callback(() => {
				assert.isTrue(menu.properties.hidden, 'menu should be hidden after a delay');
			}), 200);
		},

		'after show request'(this: any) {
			const dfd = this.async(500);
			const menu = new SubMenu();
			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				hideDelay: 200,
				label: 'Menu label',
				onRequestHide() {
					menu.setProperties({ label: 'Menu label', hidden: true });
				}
			});

			(<any> menu)._onMenuMouseLeave();
			(<any> menu)._onMenuMouseEnter();
			setTimeout(dfd.callback(() => {
				assert.isFalse(menu.properties.hidden, 'menu should not be hidden after show request');
			}), 200);
		},

		'subsequent hides'(this: any) {
			const dfd = this.async(500);
			const menu = new SubMenu();
			let callCount = 0;

			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				hideDelay: 200,
				label: 'Menu label',
				onRequestHide() {
					callCount++;
					menu.setProperties({ label: 'Menu label', hidden: true });
				}
			});

			(<any> menu)._onMenuMouseLeave();
			(<any> menu)._onMenuMouseLeave();
			(<any> menu)._onMenuMouseLeave();
			(<any> menu)._onMenuMouseLeave();
			(<any> menu)._onMenuMouseLeave();

			setTimeout(dfd.callback(() => {
				assert.strictEqual(callCount, 1, 'hide request should be called once');
			}), 200);
		},

		'after destroy'(this: any) {
			const dfd = this.async(500);
			const menu = new SubMenu();
			menu.setProperties({
				expandOnClick: false,
				hidden: false,
				label: 'Menu label',
				onRequestHide() {
					menu.setProperties({ label: 'Menu label', hidden: true });
				}
			});

			(<any> menu)._onMenuMouseLeave();
			menu.destroy();
			setTimeout(dfd.callback(() => {
				assert.isFalse(menu.properties.hidden, 'menu should not be hidden after the menu is destroyed');
			}), 300);
		}
	},

	hideOnActivate: {
		'when true'() {
			const menu = new SubMenu();
			const onRequestHide = sinon.spy();

			menu.setProperties({ label: 'Menu label', onRequestHide });
			(<any> menu)._onItemActivate();

			assert.isTrue(onRequestHide.called, 'Menu should be hidden');
		},

		'when false'() {
			const menu = new SubMenu();
			const onRequestHide = sinon.spy();

			menu.setProperties({ label: 'Menu label', hideOnActivate: false, onRequestHide });
			(<any> menu)._onItemActivate();

			assert.isFalse(onRequestHide.called, 'Menu should not be hidden');
		}
	},

	id() {
		const menu = new SubMenu();
		menu.setProperties({ label: 'Menu label' });
		let vnode: any = menu.__render__();

		assert.isString(vnode.children[1].properties.id, 'id should be generated');

		menu.setProperties({ id: 'menu-42', label: 'Menu label' });
		vnode = menu.__render__();
		assert.strictEqual(vnode.children[1].properties.id, 'menu-42');
	},

	onMenuFocusOut: {
		'when the event target node is within the menu'() {
			const menu = new SubMenu();
			const element: any = getMockNavElement();

			(<any> menu).onElementCreated(element, 'menu');
			(<any> menu).onElementCreated();
			(<any> menu)._toggleDisplay(true);
			(<any> menu)._onMenuFocusOut();

			assert.isTrue(menu.state.active, 'menu should remain active');
		},

		'when the event target node is outside the menu'() {
			const menu = new SubMenu();
			const element: any = getMockNavElement();
			element.contains = () => false;

			(<any> menu).onElementCreated(element, 'menu');
			(<any> menu)._toggleDisplay(true);
			(<any> menu)._onMenuFocusOut();

			assert.isFalse(menu.state.active, 'menu should be inactive');
		}
	}
});
