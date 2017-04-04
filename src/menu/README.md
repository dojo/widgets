# `@dojo/widgets/menu/Menu`

`Menu` is a widget that provides a list of actions, with the ability to nest menus. Common examples include horizontal menubars used for app navigation on wider screens, vertical menubars used in a `SlidePane` on smaller screens, and the reply/reply all/forward menus found in mail applications. Due to the generic nature of `Menu`, there are certain patterns that should be followed when using it to guarantee the best experience for all app users.

## Basic Usage

`Menu` is used in tandem with `MenuItem`, a helper widget that provides mouse and keyboard handlers for menu operations and ensures menu items have the proper ARIA roles and properties.

```typescript
// Basic example
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
// Horizontal menubar
w(Menu, {
	// "horizontal" is the default orientation for menubars, so the `orientation` property
	// is not technically required here.
	orientation: 'horizontal',
	role: 'menubar'
}, [
	w(MenuItem, {
		tag: 'a',
		properties: {
			href: 'http://dojo.io'
		}
	}, [ 'Dojo 2' ]),

	w(MenuItem, {
		tag: 'a',
		properties: {
			href: 'https://github.com/dojo/widget-core'
		}
	}, [ 'Dojo 2 Widget Core' ]),

	w(MenuItem, {
		tag: 'a',
		properties: {
			href: 'https://github.com/dojo/widgets'
		}
	}, [ 'Dojo 2 Widgets' ])
]);
```

```typescript
// Menu toggled open/closed with a trigger
w(Menu, {
	hidden: this.state.hidden,
	label: 'More',
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

## Accessibility

### `Menu` types

`Menu` supports two `role` properties: `'menu'` and `'menubar'`. If the menu will always be visible, use `'menubar'`. Otherwise, the default `'menu'` can be used.

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

`Menu` follows the [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#menu) for menus to the extent that the various use cases are described. As such, menus exhibit the following behavior:

- One `tab` press into a top-level menu, one `tab` press out of it.
- Arrow keys control navigation between items within a menu (see below).
- Pressing the escape key within a submenu closes the submenu. When the submenu is re-opened, focus is placed on the first item.
- Pressing the enter key triggers an item's action. If the item is used as the trigger for a submenu, then the submenu is toggled opened/closed.
- Pressing the space key triggers an item's action. If the item is used as the trigger for a submenu, then the submenu is toggled opened/closed.

**Arrow key navigation with `orientation="horizontal"`**:
- Pressing the left arrow key moves focus to the previous item. If the first item is currently selected, focus is moved to the last item.
- Pressing the right arrow key moves focus to the next item. If the last item is currently selected, focus is moved to the first item.
- Pressing the down arrow key when focus is on a trigger for a submenu moves focus into the submenu, placing the focus on the previously-focused item. If the submenu is hidden, it will be displayed.
- Pressing the up arrow key when focus is on an item within a submenu moves focus back to the trigger item. The next time the submenu receives focus, the previously-focused item receives the focus. Pressing the up arrow key has no effect in other circumstances.

**Arrow key navigation with `orientation="vertical"` (the default)**:
- Pressing the up arrow key moves focus to the previous item. If the first item is currently selected, focus is moved to the last item.
- Pressing the down arrow key moves focus to the next item. If the last item is currently selected, focus is moved to the first item.
- Pressing the right arrow key when focus is on a trigger for a submenu moves focus into the submenu, placing the focus on the previously-focused item. If the submenu is hidden, it will be displayed.
- Pressing the left arrow key when focus is on an item within a submenu moves focus back to the trigger item. The next time the submenu receives focus, the previously-focused item receives the focus. Pressing the left arrow key has no effect in other circumstances.
