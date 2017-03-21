import has from '@dojo/has/has';
import { VNode } from '@dojo/interfaces/vdom';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import Menu from '../../Menu';
import * as css from '../../styles/menu.css';

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
		style: styles,
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

				vnode.properties.afterCreate.call(menu, element);
				vnode.properties.afterUpdate.call(menu, element);
				assert.isTrue(vnode.properties.classes[css.hidden]);

				menu.setProperties({
					hidden: false
				});

				vnode = menu.__render__();
				element = getMockNavElement();

				vnode.properties.afterCreate.call(menu, element);
				vnode.properties.afterUpdate.call(menu, element);
				assert.isTrue(vnode.properties.classes[css.visible]);
			},

			'not animated'() {
				const menu = new Menu();
				const vnode: any = menu.__render__();
				const element = getMockNavElement();

				vnode.properties.afterCreate.call(menu, element);
				vnode.properties.afterUpdate.call(menu, element);

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

				menuNode.properties.afterCreate.call(menu, element);
				menuNode.properties.afterUpdate.call(menu, element);
				assert.isTrue(menuNode.properties.classes[css.hidden]);

				menu.setProperties({
					animate: false,
					label: 'Menu label',
					hidden: false
				});

				vnode = menu.__render__();
				menuNode = vnode.children[1];
				element = getMockNavElement();

				menuNode.properties.afterCreate.call(menu, element);
				menuNode.properties.afterUpdate.call(menu, element);
				assert.isTrue(menuNode.properties.classes[css.visible]);
			},

			'style.height not reset on initialization'() {
				const menu = new Menu();
				menu.setProperties({
					animate: false,
					label: 'Menu label'
				});
				const vnode: any = menu.__render__();
				const menuNode = vnode.children[1];
				const element: any = getMockNavElement();
				menuNode.properties.afterCreate.call(menu, element);

				assert.isNull(element.style.height, 'style.height should not be modified');
			},

			'style.height removed on subsequent renders'() {
				const menu = new Menu();
				const element = getMockNavElement();
				menu.setProperties({
					animate: false,
					label: 'Menu label'
				});

				let vnode: any = menu.__render__();
				let menuNode = vnode.children[1];
				menuNode.properties.afterCreate.call(menu, element);
				menuNode.properties.afterUpdate.call(menu, element);

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

				menuNode.properties.afterCreate.call(menu, element);

				menu.setProperties({
					label: 'Other label'
				});
				vnode = menu.__render__();
				menuNode = vnode.children[1];
				menuNode.properties.afterUpdate.call(menu, element);

				assert.notOk(menuNode.properties.classes[css.hidden]);
			},

			'style.height zeroed when hidden'() {
				const menu = new Menu();
				menu.setProperties({
					label: 'Menu label'
				});

				const vnode: any = menu.__render__();
				const menuNode = vnode.children[1];
				let element = getMockNavElement();

				element.classList.add(css.hidden);
				menuNode.properties.afterCreate.call(menu, element);
				assert.strictEqual(element.style.height, '0');

				element = getMockNavElement();
				menuNode.properties.afterCreate.call(menu, element);
				assert.isNull(element.style.height);
			},

			'collapsed from the scroll height to 0'() {
				const menu = new Menu();
				menu.setProperties({
					label: 'Menu label'
				});

				const vnode: any = menu.__render__();
				const menuNode = vnode.children[1];
				const element = getMockNavElement();

				menuNode.properties.afterCreate.call(menu, element);
				menuNode.properties.afterUpdate.call(menu, element);

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null, '300px', '0' ]);
				assert.sameMembers(styleHistory.transition, [ '0.5s', null, '0.5s' ]);
			},

			'collapsed from the max-height if it is set'() {
				const menu = new Menu();
				menu.setProperties({
					label: 'Menu label'
				});

				const vnode: any = menu.__render__();
				const menuNode = vnode.children[1];
				const element = getMockNavElement();
				element.style['max-height'] = '100px';

				menuNode.properties.afterCreate.call(menu, element);
				menuNode.properties.afterUpdate.call(menu, element);

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null, '100px', '0' ]);
			},

			'expanded to the scroll height'() {
				const menu = new Menu();
				menu.setProperties({
					hidden: false,
					label: 'Menu label'
				});

				const vnode: any = menu.__render__();
				const menuNode = vnode.children[1];
				const element = getMockNavElement();

				menuNode.properties.afterCreate.call(menu, element);
				menuNode.properties.afterUpdate.call(menu, element);

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null, '300px' ]);
			},

			'animates to the max-height when set'() {
				const menu = new Menu();
				menu.setProperties({
					hidden: false,
					label: 'Menu label'
				});

				const vnode: any = menu.__render__();
				const menuNode = vnode.children[1];
				const element = getMockNavElement();
				element.style['max-height'] = '100px';

				menuNode.properties.afterCreate.call(menu, element);
				menuNode.properties.afterUpdate.call(menu, element);

				const styleHistory = element.styleHistory;
				assert.sameMembers(styleHistory.height, [ null, '100px' ]);
			}
		}
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

	onLabelKeypress: {
		'when disabled'() {
			const menu = new Menu();
			menu.setProperties({
				disabled: true,
				hidden: true,
				onRequestShow() {
					menu.setProperties({ hidden: false });
				}
			});

			menu.onLabelKeypress(<any> { key: 'Enter' });
			assert.isTrue(menu.properties.hidden, 'menu should remain hidden when disabled');
		},

		'when enabled'() {
			const menu = new Menu();
			menu.setProperties({
				hidden: true,
				onRequestShow() {
					menu.setProperties({ hidden: false });
				}
			});

			menu.onLabelKeypress(<any> { key: 'Enter' });
			assert.isFalse(menu.properties.hidden);
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

			menu.onMenuFocus();
			assert.isTrue(menu.properties.hidden, 'menu should remain hidden when disabled');
		},

		'when enabled and hidden'() {
			const menu = new Menu();
			menu.setProperties({
				hidden: true,
				onRequestShow() {
					menu.setProperties({ hidden: false });
				}
			});

			menu.onMenuFocus();
			assert.isFalse(menu.properties.hidden, 'menu should open when focused');
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

			menu.onMenuFocus();
			assert.isFalse(hideCalled, 'onRequestHide not called');
			assert.isFalse(showCalled, 'onRequestShow not called');
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
