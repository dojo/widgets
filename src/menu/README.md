# Creating Menus

Dojo 2 provides a set of widgets that can be used to create menus: `MenuItem`, which wraps a `DNode` and represents a single item within a menu; `Menu`, which renders a list of menu items; `SubMenu`, which renders a `Menu` with an additional `MenuItem` used to toggle the menu in and out of view; and `MenuBar`, which is a light widget that renders its children to a `SlidePane` beneath a specified breakpoint. Due to the generic nature of `Menu`, there are certain patterns that should be followed when using it to guarantee the best experience for all users.

## Basic Usage

`Menu` is used in tandem with `MenuItem`, a helper widget that provides mouse and keyboard handlers for menu operations and ensures menu items have the proper ARIA roles and properties.

```typescript
// Basic example: a simple menu that renders a list of actions
w(Menu, {}, [
	w(MenuItem, {
		onClick: () => {
			// reply
		}
	}, [ 'Reply' ]),

	w(MenuItem, {
		onClick: () => {
			// reply all
		}
	}, [ 'Reply All' ]),

	w(MenuItem, {
		onClick: () => {
			// forward
		}
	}, [ 'Forward' ]),
]);
```

```typescript
// Horizontal menu
w(Menu, {
	// "horizontal" is the default orientation for menubars, so the `orientation` property
	// is not technically required here.
	orientation: 'horizontal',
	role: 'menubar'
}, [
	w(MenuItem, {
		properties: {
			href: 'http://dojo.io'
		}
	}, [ 'Dojo 2' ]),

	w(MenuItem, {
		properties: {
			href: 'https://github.com/dojo/widget-core'
		}
	}, [ 'Dojo 2 Widget Core' ]),

	w(MenuItem, {
		properties: {
			href: 'https://github.com/dojo/widgets'
		}
	}, [ 'Dojo 2 Widgets' ])
]);
```

```typescript
// Menu toggled open/closed with a trigger, where `this` is parent widget
w(SubMenu, {
	hidden: this.state.hidden,
	label: 'More',
	type: 'dropdown', // render as a dropdown, rather than as an accordion
	onRequestHide: () => {
		this.setState({ hidden: true });
	},
	onRequestShow: () => {
		this.setState({ hidden: false });
	}
}, [
	w(MenuItem, {
		onClick: () => {
			// reply
		}
	}, [ 'Reply' ]),

	w(MenuItem, {
		onClick: () => {
			// reply all
		}
	}, [ 'Reply All' ]),

	w(MenuItem, {
		onClick: () => {
			// forward
		}
	}, [ 'Forward' ]),
]);
```

```typescript
// Responsive menubar
w(MenuBar, {
	// render as a `SlidePane` beneath 500px
	breakpoint: 500,
	open: this.state.slidePaneOpen,
	onRequestClose: () => {
		this.setState({ slidePaneOpen: false });
	},
	onRequestOpen: () => {
		this.setState({ slidePaneOpen: true });
	},
	slidePaneButtonLabel: 'Show Menu'
}, [
	w(Menu, {
		role: 'menubar'
	}, [
		w(MenuItem, {
			properties: {
				href: 'http://dojo.io'
			}
		}, [ 'Dojo 2' ]),

		w(MenuItem, {
			properties: {
				href: 'https://github.com/dojo/widget-core'
			}
		}, [ 'Dojo 2 Widget Core' ]),

		w(MenuItem, {
			properties: {
				href: 'https://github.com/dojo/widgets'
			}
		}, [ 'Dojo 2 Widgets' ])
	]);
]);
```

## Accessibility

### `Menu` types

`Menu` supports two `role` properties: `'menu'` and `'menubar'`. If the menu will always be visible, use `'menubar'`. Otherwise, the default `'menu'` can be used. `SubMenu` by nature is not persistent, so its `role` is always `menu`.

### `MenuItem` types

`MenuItem` provides a simple `type` property that can be used to specify the item type. Its values are `'item'` (the default), `'checkbox'`, and `'radio'`. When the item type is a `'checkbox'` or `'radio'`, the `selected` property should be used to control state:

```typescript
w(MenuItem, {
	type: 'checkbox',
	selected: this.state.italicSelected,
	onClick: () => {
		this.setState({ italicSelected: !this.state.italicSelected });
	}
}, [ 'Italic' ]);
```

When the `'radio'` type is used, however, the application must ensure that only one item within the menu is `selected` at a time:

```typescript
w(Menu, {}, [
	w(MenuItem, {
		type: 'radio',
		selected: this.state.fontSize === 'small',
		onClick: () => {
			this.setState({ fontSize: 'small' });
		}
	}, [ 'Small' ]),

	w(MenuItem, {
		type: 'radio',
		selected: this.state.fontSize === 'medium',
		onClick: () => {
			this.setState({ fontSize: 'medium' });
		}
	}, [ 'Medium' ]),

	w(MenuItem, {
		type: 'radio',
		selected: this.state.fontSize === 'large',
		onClick: () => {
			this.setState({ fontSize: 'large' });
		}
	}, [ 'Large' ])
]);
```

### Keyboard Navigation

`Menu` and `SubMenu` follow the [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#menu) for menus to the extent that the various use cases are described. As such, menus exhibit the following behavior:

- One `tab` press into a top-level menu, one `tab` press out of it.
- Arrow keys control navigation between items within a menu (see below).
- Pressing the escape key within a `SubMenu` closes its menu. When the menu is re-opened, focus is placed on the first item.
- Pressing the enter key triggers an item's action. If the item is used as the trigger for a `SubMenu`, then its menu is toggled opened/closed.
- Pressing the space key triggers an item's action. If the item is used as the trigger for a `SubMenu`, then its menu is toggled opened/closed.

**Arrow key navigation with `orientation="horizontal"`**:
- Pressing the left arrow key moves focus to the previous item. If the first item is currently selected, focus is moved to the last item.
- Pressing the right arrow key moves focus to the next item. If the last item is currently selected, focus is moved to the first item.
- Pressing the down arrow key when focus is on a trigger for a `SubMenu` moves focus into its menu, placing the focus on the previously-focused item. If the menu is hidden, it is displayed.
- Pressing the up arrow key when focus is on an item within a `SubMenu` moves focus back to its trigger. The next time the `SubMenu` receives focus, the previously-focused item receives the focus. Pressing the up arrow key has no effect in other circumstances.

**Arrow key navigation with `orientation="vertical"` (the default)**:
- Pressing the up arrow key moves focus to the previous item. If the first item is currently selected, focus is moved to the last item.
- Pressing the down arrow key moves focus to the next item. If the last item is currently selected, focus is moved to the first item.
- Pressing the right arrow key when focus is on a trigger for a `SubMenu` moves focus its menu, placing the focus on the previously-focused item. If the menu is hidden, it is displayed.
- Pressing the left arrow key when focus is on an item within a `SubMenu` moves focus back its trigger. The next time the `SubMenu` receives focus, the previously-focused item receives the focus. Pressing the left arrow key has no effect in other circumstances.
