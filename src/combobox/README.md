# @dojo/widgets/combobox

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
