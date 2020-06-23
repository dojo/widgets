# @dojo/widgets/password-input

Dojo's `PasswordInput` provides a simple to use input box for entering passwords. The rules that which the password must follow are equivalent to the rules of the `ConstrainedInput` widget. 

## Features

- Handles validation state / messaging internally so the consumer does not have to
- Easily validates against a set of predefined rules
- Associates an accessible `<label>` with the input if a `label` child is added

### Accessibility Features

If a `label` child is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.
