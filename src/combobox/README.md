# @dojo/widgets/combobox widget

Dojo's `ComboBox` widget provides a form control that allows users to either enter a value manually or to select a value from a list of results.

## Features

- Compatible with any underlying data provider, data format, or store
- Keyboard accessible

### Keyboard Usage

`ComboBox` supports standard keyboard navigation for data entry, toggling the results menu, and navigating to/selecting a given result.

**Input Events**:

- Escape key: hides the results menu if it is open
- Down Arrow: if the results menu is closed, pressing the down arrow opens the menu. If the menu is already open, then pressing the down arrow highlights the next option. If the last last option is highlighted, then the first option is highlighted and scrolled into view
- Up Arrow: if the results menu is open, pressing the up arrow highlights the previous result. If the first result is currently highlighted, then the last option is highlighted and scrolled into view
- Enter Key: if the results menu is open, pressing the enter key selects the highlighted option and sets its value as the input value

**Arrow Button Events**

- Enter Key: opens the results menu
- Space Key: opens the results menu

**Clear Button Events**

- Enter Key: clears the input value
- Space Key: clears the input value

### Accessibility Features

Beyond complete keyboard accessibility, `ComboBox` ensures that all appropriate ARIA attributes are included. All instances of this widget should make use of the `label` property or a separate `label` node associated with the combobox's `widgetId` property.

### Internationalization Features

The `ComboBox` makes no assumptions about the format of its underlying data. A function can be passed via the `getResultLabel` property that allows the label of a result data item to be returned. Using this mechanism, any necessary localization can be done on the returned label.

## Example Usage

*Basic Example*
```typescript
import ComboBox from '@dojo/widgets/combobox';
import { w } from '@dojo/framework/core/vdom';

w(ComboBox, {
	results: ['foo', 'bar', 'baz'],
	value: this.state.currentValue,
	onValue: (value: string) => this.setState({ currentValue: value })
});
```

*Filtered results*
```typescript
import ComboBox from '@dojo/widgets/combobox';
import { w } from '@dojo/framework/core/vdom';

const data = ['foo', 'bar', 'baz'];

w(ComboBox, {
	results: this.state.results,
	value: this.state.currentValue,
	onValue: (value: string) => this.setState({ currentValue: value }),
	onRequestResults: (value: string) => {
		// Search for matching results; though a simple array of
		// data is used in this example, any data provider or store
		// could be queried here instead. See the "Custom Data Provider"
		// example.
		const results = data.filter(item => {
			const match = item.match(new RegExp(`^${ value }`));
			return Boolean(match && match.length > 0);
		});

		this.setState({ results });
	}
});
```

*Custom Data Format / Provider*
```typescript
import ComboBox from '@dojo/widgets/combobox';
import { w } from '@dojo/framework/core/vdom';
// A fictional store for example purposes only; this can be any data provider
import MyAwesomeStore from 'some/amazing/package';

const store = new MyAwesomeStore();

w(ComboBox, {
	results: this.state.results,
	value: this.state.currentValue,
	onValue: (value: string) => this.setState({ currentValue: value }),
	onRequestResults: (value: string) => {
		// Search for matching results; query whatever data source we
		// happen to be using, which in this example, is `MyAwesomeStore`
		store.query({ value }).then((results: any) => this.setState({ results }));
	}
});
```

*Validation*
```typescript
import ComboBox from '@dojo/widgets/combobox';
import { w } from '@dojo/framework/core/vdom';

w(ComboBox, {
	results: ['foo', 'bar', 'baz'],
	value: this.state.currentValue,
	valid: this.state.valid,
	onValue: (value: string) => this.setState({
		currentValue: value,
		// For this example, any value over 3 characters is deemed valid
		valid: value.length > 3
	})
});
```

*Custom formatted option*
```typescript
import ComboBox from '@dojo/widgets/combobox';
import { v, w } from '@dojo/framework/core/vdom';

w(ComboBox, {
	getResultLabel: (result: string) => v('span', { style: 'color: blue' }, [ result ]),
	results: ['foo', 'bar', 'baz'],
	value: this.state.currentValue,,
	onValue: (value: string) => this.setState({ currentValue: value })
});
```

## Theming

The following CSS classes are used to style the `ComboBox` widget and should be provided by custom themes:

- `arrow`: Applied to the custom arrow button
- `clear`: Applied to the custom "clear input" button
- `clearable`: Applied to the input (non-native) when the widget is clearable
- `controls`: Applied to the controls (clear and arrow buttons) container for non-native instances
- `disabled`: Applied to both the input and optional label when the widget is disabled
- `downIcon`: Applied to the down arrow icon
- `icon`: Applied to the clear icon and the down arrow icon
- `input`: Applied to the input node
- `valid`: Applied to both the input and optional label when the widget is valid
- `readOnly`: Applied to both the input and optional label when the widget is read-only
- `required`: Applied to both the input and optional label when the widget is required
- `root`: Applied to the top-level wrapper node
- `closeIcon`: Applied to the clear icon
- `trigger`: Applied to button containing the down arrow
