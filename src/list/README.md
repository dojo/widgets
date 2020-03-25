# @dojo/widgets/list

Dojo's `List` provides a base widget that can be used as a List or an options List within a `Select`, `Typeahead`, etc.

## Features

- Handles keyboard interactions if given focus
- Can be controlled through `activeIndex` and `onActiveIndexChange` in conjunction with `focusable: false`.
- Handles native style scrolling
- Provides a custom renderer for more complex List items
- Active selection follows mouse as per native behavior

### Keyboard Usage

`List` supports keyboard navigation for highlighting and selecting options.

- Enter Key: selects the current option
- Space Key: selects the current option
- Up Arrow: highlights the previous option
- Down Arrow: highlights the next option
- a-z, 0-9: highlights matching entries, ie. `ne` would match `nevada` in a list of states.
