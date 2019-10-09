# @dojo/widgets/text-input

Dojo's `TextInput` widget provides a basic text input widget with an optional label.


## Features

- Allows specification of input type (e.g. `text`, `email`, `number`, etc)
- Correctly handles a11y attributes
- Associates a visible or invisible but accessible `<label>` with the input if the `label` property is added
- Allows leading / trailing icons / text to be added

### Accessibility Features

`TextInput` ensures that the proper attributes (ARIA or otherwise) are set along with classes when properties such as `disabled`, `readOnly`, etc. are used. It also provides an API for custom ARIA implementations of `aria-describedby` and `aria-controls`. It also sets `aria-invalid` when validation fails.

If the `label` property is not used, we recommend creating a separate `label` and pointing it at the input's `widgetId` property.

