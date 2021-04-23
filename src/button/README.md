# @dojo/widgets/button

Dojo's `Button` widget creates a `<button>` element with support `pressed` and `disabled` states.

## Features

- Provides an API for valid `<button>` attributes
- Can be used to create a toggle button (i.e. a button with an on/off state)
- Supports adding icons with correct padding

### Icon Only Buttons

Icon only buttons will be sized to support a `24px` icon instead of the default `18px` icon that would accompany a button with an icon and text label. If you are using dojo widget's `<Icon>` widget you will need to pass a size of `medium`. An example of this can be seen in the `Icon Button` example.

### Accessibility Features

- The basic button provides a strongly typed `type` property, as well as `disabled`
- Setting `pressed` to create a toggle button handles `aria-pressed`
