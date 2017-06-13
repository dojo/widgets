# @dojo/widgets/combobox/ComboBox widget

Dojo 2's `ComboBox` widget provides a form control that allows users to either enter a value manually or to select a value from a list of results.

## Features

- Compatible with any underlying data provider, data format, or store
- Custom components can be used for the list of results and each individual result
- Completely keyboard accessible

![Image of basic dialog](http://placekitten.com/450/300)

### Keyboard Usage

`ComboBox` supports standard keyboard navigation for data entry, toggling the results menu, and navigating to/selecting a given result.

**Input Events**:

- Escape key: hides the results menu if it is open.
- Down Arrow: if the results menu is closed, pressing the down arrows opens the menu. If the menu is already open, then pressing the down arrow highlights the next option. If the last last option is highlighted, then the first option is highlighted and scrolled into view.
- Up Arrow: if the results menu is open, pressing the up arrow highlights the previous result. If the first result is currently highlighted, then the last option is highlighted and scrolled into view.
- Enter Key: if the results menu is open, pressing the enter key selects the highlighted option and sets its value as the input value.

**Arrow Button Events**

- Enter Key: opens the results menu.
- Space Key: opens the results menu.

**Clear Button Events**

- Enter Key: clears the input value.
- Space Key: clears the input value.

### Accessibility Features

Beyond complete keyboard accessibility, `ComboBox` ensures that all appropriate ARIA attributes are included. To guarantee an excellent experience for all users, however, the following should be included with every `ComboBox`:

- `inputProperties.describedBy`: the ID of an element that provides descriptive text for the input value's expected format. For example, if the input value should be the name of a US state, an element with the same ID as `inputProperties.describedBy` might be, "Accepts any valid US state name.".

### Internationalization Features

The `ComboBox` makes no assumptions about the format of its underlying data. A function can be passed via the `getResultLabel` property that allows the label of a result data item to be returned. Using this mechanism, any necessary localization can be done on the returned label.

## Example Usage

/**
 * @type ComboBoxProperties
 *
 * Properties that can be set on a ComboBox component
 *
 * @property autoBlur           Determines whether the input should blur after value selection
 * @property clearable          Determines whether the input should be able to be cleared
 * @property customResultItem   Can be used to render a custom result
 * @property customResultMenu   Can be used to render a custom result menu
 * @property disabled           Prevents user interaction and styles content accordingly
 * @property formId             ID of a form element associated with the form field
 * @property getResultLabel     Can be used to get the text label of a result based on the underlying result object
 * @property inputProperties    TextInput properties to set on the underlying input
 * @property invalid            Determines if this input is valid
 * @property isResultDisabled   Used to determine if an item should be disabled
 * @property label              Label to show for this input
 * @property onBlur             Called when the input is blurred
 * @property onChange           Called when the value changes
 * @property onFocus            Called when the input is focused
 * @property onMenuChange       Called when menu visibility changes
 * @property onRequestResults   Called when results are shown; should be used to set `results`
 * @property openOnFocus        Determines whether the result list should open when the input is focused
 * @property readOnly           Prevents user interaction
 * @property required           Determines if this input is required, styles accordingly
 * @property results            Results for the current search term; should be set in response to `onRequestResults`
 * @property value              Value to set on the input
 */

*Basic Example*
```typescript
import ComboBox from '@dojo/widgets/combobox/ComboBox';
import { w } from '@dojo/widget-core/d';

w(ComboBox, {
	results: ['foo', 'bar', 'baz'],
	value: this.state.currentValue,
	onChange: (value: string) => this.setState({ currentValue: value })
});
```

*Filtered results*
```typescript
import ComboBox from '@dojo/widgets/combobox/ComboBox';
import { w } from '@dojo/widget-core/d';

const data = ['foo', 'bar', 'baz'];

w(ComboBox, {
	results: this.state.results,
	value: this.state.currentValue,
	onChange: (value: string) => this.setState({ currentValue: value }),
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
import ComboBox from '@dojo/widgets/combobox/ComboBox';
import { w } from '@dojo/widget-core/d';
// A fictional store for example purposes only; this can be any data provider
import MyAwesomeStore from 'some/amazing/package';

const store = new MyAwesomeStore();

w(ComboBox, {
	results: this.state.results,
	value: this.state.currentValue,
	onChange: (value: string) => this.setState({ currentValue: value }),
	onRequestResults: (value: string) => {
		// Search for matching results; query whatever data source we
		// happen to be using, which in this example, is `MyAwesomeStore`
		store.query({ value }).then((results: any) => this.setState({ results }));
	}
});
```

*Validation*
```typescript
import ComboBox from '@dojo/widgets/combobox/ComboBox';
import { w } from '@dojo/widget-core/d';

w(ComboBox, {
	results: ['foo', 'bar', 'baz'],
	value: this.state.currentValue,
	invalid: this.state.invalid,
	onChange: (value: string) => this.setState({
		currentValue: value,
		// For this example, any value over 3 characters is deemed invalid
		invalid: value.length > 3
	})
});
```

*Custom Result Component*
```typescript
import ComboBox from '@dojo/widgets/combobox/ComboBox';
// The component used by default to render a result item
import ResultItem from '@dojo/widfgets/combobox/ResultItem';
import { w } from '@dojo/widget-core/d';

// Extend default ResultItem component to show an icon next to each label
class CustomResultItem extends ResultItem {
	// We only need to override one method. Normally this method just returns
	// the result; In this case, let's return an <img> and the result
	renderResult(result: any) {
		return v('div', [
			v('img', { src: 'icon.png' }),
			result
		]);
	}
}

w(ComboBox, {
	results: ['foo', 'bar', 'baz'],
	value: this.state.currentValue,,
	customResultItem: CustomResultItem,
	onChange: (value: string) => this.setState({ currentValue: value })
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
- `invalid`: Applied to both the input and optional label when the widget is invalid
- `readOnly`: Applied to both the input and optional label when the widget is read-only
- `required`: Applied to both the input and optional label when the widget is required
- `root`: Applied to the top-level wrapper node
- `timesIcon`: Applied to the clear icon
- `trigger`: Applied to button containing the down arrow
