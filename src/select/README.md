# @dojo/widgets/select widget

Dojo 2's `Select` provides a dropdown menu form control using either the native `<select>` element or a fully custom component. The custom version uses the `Listbox` widget as its list of options.

## Features

- Compatible with any underlying data provider, data format, or store
- Allows customization of option state and vdom through reactive patterns
- Keyboard accessible

### Keyboard Usage

The custom `Select` supports keyboard navigation for opening and closing the options menu and moving through options. If `useNativeElement` is true, it defers to native keyboard support.

**Trigger Button Events**

- Enter Key: opens the options menu
- Space Key: opens the options menu

**Options Menu Events**

- Enter Key: selects the current option and closes the menu
- Space Key: selects the current option and closes the menu
- Up Arrow: highlights the previous option
- Down Arrow: highlights the next option
- Home/Page Up: highlights the first option
- End/Page Down: highlights the last option
- Escape Key: closes the options menu without selecting an option

### Accessibility Features

The simplest way to create a an accessible select field that works across all browsers, devices, and assistive tech is to set `useNativeElement` to true. However, the custom element also sets appropriate ARIA attributes handles keyboard interactions.

All instances of this widget should make use of the `label` property or a separate `label` node associated with the select's `widgetId` property.

### Internationalization Features

Option text is handled through the `getOptionLabel` property. Localization is handled by the parent component and localized strings can be reactively passed in using this method.

## Example Usage

*Wrapped Native Select*
```typescript
import Select from '@dojo/widgets/select';
import { w } from '@dojo/widget-core/d';

interface OptionData {
	disabled: boolean;
	label: string;
	value: string;
};

let value: string;

w(Select, {
	getOptionDisabled: (option: OptionData) => option.disabled,
	getOptionLabel: (option: OptionData) => option.label,
	getOptionValue: (option: OptionData) => option.value,
	getOptionSelected: (option: OptionData) => !!value && option.value === value,
	label: 'Native select example',
	options: optionsData,
	useNativeElement: true,
	value,
	onChange: (option: OptionData) => {
		value = option.value;
	}
});
```

*Custom select using default option calculations*
```typescript
import Select from '@dojo/widgets/select';
import { w } from '@dojo/widget-core/d';

const options = ['foo', 'bar', 'baz'];
let value: string;

w(Select, {
	label: 'Option label defaults to option data',
	options,
	value,
	onChange: (option: string) => {
		value = option;
	}
});
```

*Custom select with formatted option text and placeholder*
```typescript
import Select from '@dojo/widgets/select';
import { w } from '@dojo/widget-core/d';

const options = ['foo', 'bar', 'baz'];
let value: string;

w(Select, {
	label: 'Option label defaults to option data',
	getOptionLabel: (option: string) => {
		return v('span', { classes: [ 'optionClass' ] }, [ option ])
	},
	options,
	placeholder: 'Choose one',
	value,
	onChange: (option: string) => {
		value = option;
	}
});
```

## Theming

The following CSS classes are used to style the `Select` widget and should be provided by custom themes:

- `arrow`: Applied to the custom arrow icon on both native and custom selects
- `disabled`: Applied to both the root node and optional label when the widget is disabled
- `dropdown`: Applied to the node wrapping the `Listbox` widget in the custom select
- `focused`: Applied to both the root node and label if the component contains focus
- `input`: Applied to the `select` node of the native component
- `inputWrapper`: Applied to the node wrapping either the `select` element or the custom trigger and listbox
- `invalid`: Applied to both the root node and optional label when the widget is invalid
- `open`: Applied to the `inputWrapper` of the custom component when the dropdown menu is open
- `placeholder`: Applied to the trigger button of the custom select when it is showing placeholder text
- `readOnly`: Applied to both the root node and optional label when the widget is read-only
- `required`: Applied to both the root node and optional label when the widget is required
- `root`: Applied to the top-level wrapper node
- `trigger`: Applied to the button containing the down arrow of the custom select
- `valid`: Applied to both the root node and optional label when the widget is valid
