# @dojo/widgets/listbox widget

Dojo 2's `Listbox` provides a base widget that can be used as an options menu within a Select or ComboBox component, or as a standalone multi-select component

## Features

- Compatible with any underlying data provider, data format, or store
- Allows customization of option state and vdom through reactive patterns
- Handles all keyboard interactions if given focus
- Can be controlled through `activeIndex` and `visualFocus`, e.g. in a ComboBox where focus stays on the text input

### Keyboard Usage

`Listbox` supports keyboard navigation for highlighting and selecting options

- Enter Key: selects the current option and closes the menu
- Space Key: selects the current option and closes the menu
- Up Arrow: highlights the previous option
- Down Arrow: highlights the next option
- Home/Page Up: highlights the first option
- End/Page Down: highlights the last option

### Accessibility Features

Since `Listbox` is primarily intended for use as a base for other components like `Select` and `ComboBox`, it does not have a `label` property. When used as a standalone component, a separate `label` node should be created and associated with the listbox's `widgetId` property.

### Internationalization Features

Option text is handled through the `getOptionLabel` property. Localization is handled by the parent component and localized strings can be reactively passed in using this method.

## Example Usage

*Basic Listbox*
```typescript
import Listbox from '@dojo/widgets/listbox';
import { w } from '@dojo/widget-core/d';

interface OptionData {
	disabled: boolean;
	label: string;
	value: string;
};

let listboxIndex = 0;
let optionData: CustomOption[];
let value: string;

v('label', {
	for: 'listbox1'
}, [ 'Simple listbox example' ]),
w(Listbox, {
	key: 'listbox1',
	activeIndex: listboxIndex,
	widgetId: 'listbox1',
	optionData,
	getOptionLabel: (option: CustomOption) => option.value,
	getOptionDisabled: (option: CustomOption) => !!option.disabled,
	getOptionSelected: (option: CustomOption) => option.value === value,
	onActiveIndexChange: (index: number) => {
		listboxIndex = index;
		this.invalidate();
	},
	onOptionSelect: (option: any, index: number) => {
		value = option.value;
		this.invalidate();
	}
});
```

*Multi-select Listbox*
```typescript
import Listbox from '@dojo/widgets/listbox';
import { w } from '@dojo/widget-core/d';

interface OptionData {
	disabled: boolean;
	label: string;
	selected: boolean;
	value: string;
};

let listboxIndex = 0;
let optionData: CustomOption[];

v('label', {
	for: 'listbox2'
}, [ 'Select multiple options' ]),
w(Listbox, {
	key: 'listbox2',
	activeIndex: listboxIndex,
	widgetId: 'listbox2',
	optionData,
	getOptionLabel: (option: CustomOption) => option.value,
	getOptionDisabled: (option: CustomOption) => !!option.disabled,
	getOptionSelected: (option: CustomOption) => !!option.selected,
	onActiveIndexChange: (index: number) => {
		listboxIndex = index;
		this.invalidate();
	},
	onOptionSelect: (option: any, index: number) => {
		optionData[index].selected = !optionData[index].selected;
		optionData = [ ...optionData ];
		this.invalidate();
	}
});
```

## Theming

The following CSS classes are used to style the `Select` widget and should be provided by custom themes:

- `focused`: Applied to both the root node if the component is focused or contains focus
- `option`: Applied to the option nodes
- `activeOption`: Applied to the currently highlighted option
- `disabledOption`: Applied to any disabled options
- `selectedOption`: Applied to any selected options
- `root`: Applied to both the root node
