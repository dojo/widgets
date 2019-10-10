# @dojo/widgets/listbox

Dojo's `Listbox` provides a base widget that can be used as an options menu within a `Select` or `ComboBox` component, or as a standalone multi-select component

## Features

- Compatible with any underlying data provider, data format, or store
- Allows customization of option state and vdom through reactive patterns
- Handles all keyboard interactions if given focus
- Can be controlled through `activeIndex` and `visualFocus`, e.g. in a `ComboBox` where focus stays on the text input

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
