# @dojo/widgets

[![Build Status](https://travis-ci.org/dojo/widgets.svg?branch=master)](https://travis-ci.org/dojo/widgets)
[![codecov](https://codecov.io/gh/dojo/widgets/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/widgets)
[![npm version](https://badge.fury.io/js/%40dojo%2Fwidgets.svg)](https://badge.fury.io/js/%40dojo%2Fwidgets)

A suite of pre-built Dojo 2 widgets, ready to use in your web application.
These widgets are built using Dojo 2's widget authoring system [(@dojo/widget-core)](https://github.com/dojo/widget-core).

**WARNING** This is _beta_ software. While we do not anticipate significant changes to the API at this stage, we may feel the need to do so.
This is not yet production ready, so you should use at your own risk.

- [Usage](#usage)
- [Features](#features)
- [Conventions](#conventions)
  - [Icons](#icons)
  - [Coding conventions](#coding-conventions)
- [How Do I Contribute?](#how-do-i-contribute)
    - [Installation](#installation)
    - [Testing](#testing)
- [Licensing Information](#licensing-information)

## Usage

To use `@dojo/widgets` in your project, you will need to install the package:

```bash
npm install @dojo/widgets
```
This package contains *all* of the widgets in this repo.

All of the widgets are on the same release schedule, that is to say, that we release all widgets at the same time.
Minor releases may include new widgets and/or features, whereas patch releases may contain fixes to more than 1 widget.

To use a widget in your application, you will need to import each widget individually:

```ts
import Button from '@dojo/widgets/button/Button';
```

Each widget module has a default export of the widget itself, as well as named exports for things such as properties specific to the widget:

```ts
import Button, { ButtonProperties } from '@dojo/widgets/button/Button';
```

Because each widget is a separate module, when you create a release build of your application, you will only include the widgets that you have explicitly imported.
This allows our [`dojo cli`](https://github.com/dojo/cli) build tooling to make sure that the production build of your application only includes the widgets you use and is as small as possible.

## Features

- All widgets are supported in all evergreen browsers (Chrome, Edge, Firefox, IE11+ and Safari) as well as popular mobile browsers (Mobile Safari, Chrome on Android).

- All widgets support accessibility (`a11y`) out of the box.

- All widgets are fully themeable.
In a future release we will ship with several official Dojo 2 themes that can be applied to the widgets.

- All widgets support internationalization (`i18n`)

## Widgets

Live examples of current widgets are available in the [widget showcase](https://dojo.github.io/examples/widget-showcase/).

### Form widgets
[Button](src/button/README.md)

[Calendar](src/calendar/README.md)

[Checkbox/Switch](src/checkbox/README.md)

[ComboBox](src/combobox/README.md)

[EnhancedTextInput](src/enhancedtextinput/README.md)

[Label](src/label/README.md)

[Listbox](src/listbox/README.md)

[Radio](src/radio/README.md)

[Select](src/select/README.md)

[Slider](src/slider/README.md)

[TextArea](src/textarea/README.md)

[TextInput](src/textinput/README.md)

[TimePicker](src/timepicker/README.md)

### Layout widgets
[AccordionPane](src/accordionpane/README.md)

[SlidePane](src/slidepane/README.md)

[SplitPane](src/splitpane/README.md)

[TabController](src/tabcontroller/README.md)

[TitlePane](src/titlepane/README.md)

### Misc widgets
[Dialog](src/dialog/README.md)

[Progress](src/progress/README.md)

[Toolbar](src/toolbar/README.md)

[Tooltip](src/tooltip/README.md)

## Conventions

### EventHandlers

You can register event handlers that get called when the corresponding events occur, by passing the handlers into a widget, in their `properties`.
The naming convention for event handlers is as follows:

- if the parent of the widget has the power to decide *if* an event is successful, i.e. can cancel the event, then the child widget will call an event handler in the following format:

`onRequest[X]`, e.g. for a `close` event, the event handler called by the child widget must be called `onRequestClose`

Here the child widget is requesting that the `close` event take place.

- for events that will occur regardless of child/parent interaction, then the `Request` naming convention is dropped:

`on[X]`, e.g. for a `dismiss` event, then event handler called by the child widget must be called `onDismiss`


### Icons

We use [font awesome](http://fontawesome.io/) for icons.
Where a theme requires specific icons that are not part of the Font Awesome set, then those themes will ship their own icons.

### Coding conventions

`px vs. em` - we specify font sizes in `px`.
When creating a widget, spacing (margin, padding) should be specified using `px` unless the design calls for proportional spacing, in which case `em` can be used.

### Z-index layering

Widgets adhere to a basic convention for using specific ranges of z-index values based on function and visual context. This convention is followed in both individual widget CSS and in the Dojo theme styles. These values can be overridden in a custom theme if necessary, since no `z-index` values are set in fixed styles.

The range definitions are as follows:

- **0 - 100**: Any specific component layering, e.g. a caption over an image.
- **100 - 200**: Tooltips and other small, local, interactive overlays.
- **200 - 300**: Dropdowns. Common examples include menus and select boxes.
- **300 - 400**: Fixed position elements. Fixed headers and footers are clear examples of fixed page elements, but it could also include a drag-and-drop element in a drag state.
- **400 - 500**: Dialogs and other full-page overlays. Slide panes are another good example of a common UI pattern in this range. It includes any widget that is intended to cover all page content, or that often is used with an underlay.
- **500 +***: Alerts and special cases. Toast notifications could potentially be in this range, or any component important enough to interrupt all other interaction.


## How to customize a widget

There are may ways in which you can customize the behavior and appearance of Dojo 2 widgets.
See the [`widget-core`](https://github.com/dojo/widget-core) README for examples of how to customize the theme or a specific CSS class of a widget.

Or can you write your own widget that extends an official widget.

### Extending widgets

Because all Dojo 2 widgets are Classes, you can simply extend the Class to add or change its behavior.

```ts
export class MyWidget extends Button {
...
}
```

Dojo 2 widgets provide standard extension points to allow you to customise their behavior. For more details, please refer to the [widget authoring system](https://github.com/dojo/widget-core).


## How do I contribute?

We appreciate your interest!  Please see the [Dojo 2 Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines and Style Guide.

### Installation

To start working with this package, clone the repository and run `npm install`.

In order to build the project run `grunt dev` or `grunt dist`.

### Testing

Test cases MUST be written using [Intern](https://theintern.github.io) using the Object test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

To test locally in node run:

`grunt test`

To test against browsers with a local selenium server run:

`grunt test:local`

To test against BrowserStack or Sauce Labs run:

`grunt test:browserstack`

or

`grunt test:saucelabs`

## Licensing information

© 2017 [JS Foundation](https://js.foundation/). [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
