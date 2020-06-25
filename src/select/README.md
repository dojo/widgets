# @dojo/widgets/select

Dojo's `Select` provides a dropdown menu form control using either the native `<select>` element or a fully custom component. The custom version uses the `Listbox` widget as its list of options.

## Features

- Compatible with any underlying data provider, data format, or store
- Allows customization of option state and vdom
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

The simplest way to create an accessible select field that works across all browsers, devices, and assistive tech is to set `useNativeElement` to true. However, the custom element also sets appropriate ARIA attributes handles keyboard interactions.

### Internationalization Features

Option text is handled through the `getOptionLabel` property. Localization is handled by the parent component and localized strings can be reactively passed in using this method.
