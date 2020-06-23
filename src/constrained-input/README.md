# @dojo/widgets/constrained-input

Dojo's `ConstrainedInput` component creates a text input that follows certain pre-defined validation constraints. This can be used to quickly create an input that meets certain minimum standards like a username or password input.

## Features

- Handles validation state / messaging internally so the consumer does not have to
- Easily validates against a set of predefined rules

## Validation Rules

A number of validation options exist for validating common username / password scenarios.


| Property                     | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| `length.min`                 | The input value must be at least `min` characters long.      |
| `length.max`                 | The input value cannot be longer than `max` characters.      |
| `contains.uppercase`         | The input value must contain at least `uppercase` number of uppercase characters. |
| `contains.numbers`           | The input value must contain at least `numbers` number of numeric characters. |
| `contains.specialCharacters` | The input value must contain at least `specialCharacters` number of special characters. |
| `contains.atLeast`           | The input value must match `atLeast` number of the `uppercase`, `numbers`, and `specialCharacters` rules. |
