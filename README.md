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

## Features

- All widgets are supported in all evergreen browsers (IE11+, Chrome, Firefox, Safari) as well as popular mobile browsers (Mobile Safari, Chrome on Android).

- All widgets support accessibility (`a11y`) out of the box.

- All widgets are fully themeable.
In a future release we will ship with several official Dojo 2 themes that can be applied to the widgets (all themes will live in a separate repo).

- All widgets support internationalisation (`i18n`)

## Widgets

### Form widgets
[Button](src/button/README.md)

[Checkbox](src/checkbox/README.md)

[ComboBox](src/combobox/README.md)

[Label](src/label/README.md)

[Radio](src/radio/README.md)

[Slider](src/slider/README.md)

[TextArea](src/TextArea/README.md)

[TextInput](src/TextInput/README.md)

### Layout widgets
[SlidePane](src/slidepane/README.md)

[TabPane](src/tabpane/README.md)

### Misc widgets
[Dialog](src/dialog/README.md)

## Conventions

### EventHandlers

You can register event handlers that get called when the corresponding events occur, by passing the handlers into a widget, in their `properties`.
The naming convention for event handlers is as follows:

- if the parent of the widget has the power to decide *if* an event is successful, i.e. can cancel the event, then the child widget will call an event handler in the following format:

`onRequest[X]`, e.g. for a `close` event, the event handler called by the child widget must be called `onRequestClose`

- for events that will occur regardless of child/parent interaction, then the `Request` naming convention is dropped:

`on[X]`, e.g. for a `dismiss` event, then event handler called by the child widget must be called `onDismiss`

### Controlled vs uncontrolled form widgets
Currently, all of our *form* widgets are 'controlled' widgets. This means that a parent widget is responsible to the 'state' of the child widget.
'Controlled' widgets are also known as 'stateless' widgets.

### Icons

We use [font awesome](http://fontawesome.io/) for icons.
Where a theme requires specific icons that are not part of the Font Awesome set, then those themes will ship their own icons.

### Coding conventions

`px vs em` - we specify font sizes in `px`.
When creating a widget, spacing (margin, padding) should be specified using `px` unless the design calls for proportional spacing, in which case `em` can be used.


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
