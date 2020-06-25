# @dojo/widgets/typeahead

Dojo's `Typeahead` provides a form input with a filterable list of options. As the user types, the options are filtered and presented to the user.

## Features

- Compatible with any underlying data provider, data format, or store
- Allows customization of option state and vdom
- Keyboard accessible
- Can be partially or fully controlled

### Keyboard Usage

The `Typeahead` supports keyboard navigation for opening and closing the options menu and moving through options.

#### Trigger Button Events

- Down Key: opens the options menu
- Up Key: opens the options menu
- Any change to the input value opens the options menu

#### Options Menu Events

- Enter Key: selects the current option and closes the menu
- Up Arrow: highlights the previous option
- Down Arrow: highlights the next option
- Home/Page Up: highlights the first option
- End/Page Down: highlights the last option
- Escape Key: closes the options menu without selecting an option
