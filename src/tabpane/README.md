# @dojo/widgets/tabpane/TabPane widget

Dojo 2's `TabPane` widget provides a user interface capable of displaying tabbed content. The content shown at any given time is based on the currently-selected tab button.

## Features

- Tab buttons can be positioned above, below, before, or after tab content
- Tabs can be closeable, disabled, and can fetch data asynchronously
- Completely keyboard accessible

![Image of basic tabpane](http://placekitten.com/450/300)

### Keyboard Usage

`TabPane` supports standard keyboard navigation for switching between and closing tabs.

**Tab Button Events**

- Escape key: closes a closeable tab
- Left Arrow: If tab buttons are aligned above or below content, requests to select the previous tab 
- Right Arrow: If tab buttons are aligned above or below content, requests to select the next tab
- Up Arrow: If tab buttons are aligned before or after content, requests to select the previous tab 
- Down Arrow: If tab buttons are aligned before or after content, requests to select the next tab
- Home key: Requests to select the first tab
- End key: Requests to select the last tab

### Accessibility Features

Beyond complete keyboard accessibility, `TabPane` ensures that all appropriate ARIA attributes are included.

## Example Usage

*Basic Example*
```typescript
import TabPane from '@dojo/widgets/tabpane/TabPane';
import Tab from '@dojo/widgets/tabpane/Tab';
import { w } from '@dojo/widget-core/d';

w(TabPane, {
	activeIndex: this.state.activeIndex,
	onRequestTabChange: (index: number) => this.setState({ activeIndex: index })
}, [
	w(Tab, {
		key: 'foo',
		label: 'Foo'
	}, [ 'Some content...' ]),
	w(Tab, {
		key: 'bar',
		disabled: true,
		label: 'Bar'
	}, [ 'Some more content...' ])
]);
```

*Closeable Tab*
```typescript
import TabPane from '@dojo/widgets/tabpane/TabPane';
import Tab from '@dojo/widgets/tabpane/Tab';
import { w } from '@dojo/widget-core/d';

w(TabPane, {
	activeIndex: this.state.activeIndex,
	onRequestTabChange: (index: number) => this.setState({ activeIndex: index }),
	onRequestTabClose: (index: number, key: string) => {
		this.setState({ closedKeys: [...closedKeys, key] });
	}
}, [
	w(Tab, {
		key: 'foo',
		label: 'Foo'
	}, [ 'Some content...' ]),
	!this.state.closedKeys.includes('bar') ? w(Tab, {
		key: 'bar',
		label: 'Bar',
		closeable: true
	}, [ 'Some more content...' ]) : null
]);
```

*Align Buttons Under Content*
```typescript
import TabPane, { Align } from '@dojo/widgets/tabpane/TabPane';
import Tab from '@dojo/widgets/tabpane/Tab';
import { w } from '@dojo/widget-core/d';

w(TabPane, {
	activeIndex: this.state.activeIndex,
	alignButtons: Align.bottom,
	onRequestTabChange: (index: number) => this.setState({ activeIndex: index })
}, [
	w(Tab, {
		key: 'foo',
		label: 'Foo'
	}, [ 'Some content...' ]),
	w(Tab, {
		key: 'bar',
		label: 'Bar'
	}, [ 'Some more content...' ])
]);
```

## Theming

The following CSS classes are used to style the `TabPane` widget and should be provided by custom themes:

- `activeTabButton`: Applied to the button associated with the currently-active tab
- `alignBottom`: Applied to the top-level wrapper node when buttons are positioned under content
- `alignLeft`: Applied to the top-level wrapper node when buttons are positioned before content
- `alignRight`: Applied to the top-level wrapper node when buttons are positioned after content 
- `close`: Applied to a closeable tab button's close icon
- `disabledTabButton`: Applied to the button associated with a disabled tab
- `root`: Applied to the top-level wrapper node
- `tab`: Applied to the currently-visible content
- `tabButton`: Applied to the button associated with a given tab
- `tabButtons`: Applied to the element containing all tab buttons
- `tabs`: Applied to the element containing all tabs
