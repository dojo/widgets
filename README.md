# @dojo/widgets

[![Build Status](https://travis-ci.org/dojo/widgets.svg?branch=master)](https://travis-ci.org/dojo/widgets)
[![codecov](https://codecov.io/gh/dojo/widgets/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/widgets)
[![npm version](https://badge.fury.io/js/%40dojo%2Fwidgets.svg)](https://badge.fury.io/js/%40dojo%2Fwidgets)

A suite of pre-built Dojo widgets, ready to use in your web application.
These widgets are built using Dojo's widget authoring system [(@dojo/framework/widget-core)](https://github.com/dojo/framework/blob/master/src/widget-core/README.md).

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
import Button from '@dojo/widgets/button';
```

Each widget module has a default export of the widget itself, as well as named exports for things such as properties specific to the widget:

```ts
import Button, { ButtonProperties } from '@dojo/widgets/button';
```

Because each widget is a separate module, when you create a release build of your application, you will only include the widgets that you have explicitly imported.
This allows our [`dojo cli`](https://github.com/dojo/cli) build tooling to make sure that the production build of your application only includes the widgets you use and is as small as possible.

## Features

- All widgets are supported in all evergreen browsers (Chrome, Edge, Firefox, IE11+, and Safari) as well as popular mobile browsers (Mobile Safari, Chrome on Android).

- All widgets are designed to be accessible. If custom ARIA semantics are required, widgets have an `aria` property that may be passed an object with custom `aria-*` attributes.

- All widgets are fully themeable. Example themes are available in the [@dojo/themes](https://github.com/dojo/themes) repository.

- All widgets support internationalization (`i18n`)

## Widgets

Live examples of current widgets are available in the [widget showcase](https://dojo.github.io/examples/widget-showcase/).

### Form widgets
[Button](src/button/README.md)

[Calendar](src/calendar/README.md)

[Checkbox/Toggle](src/checkbox/README.md)

[ComboBox](src/combobox/README.md)

[Label](src/label/README.md)

[Listbox](src/listbox/README.md)

[Radio](src/radio/README.md)

[RangeSlider](src/range-slider/README.md)

[Select](src/select/README.md)

[Slider](src/slider/README.md)

[TextArea](src/text-area/README.md)

[TextInput](src/text-input/README.md)

[TimePicker](src/time-picker/README.md)

### Layout widgets
[AccordionPane](src/accordion-pane/README.md)

[SlidePane](src/slide-pane/README.md)

[SplitPane](src/split-pane/README.md)

[TabController](src/tab-controller/README.md)

[TitlePane](src/title-pane/README.md)

### Misc widgets
[Grid](src/grid/README.md)

[Dialog](src/dialog/README.md)

[GlobalEvent](src/global-event/README.md)

[Icon](src/icon/README.md)

[Progress](src/progress/README.md)

[Toolbar](src/toolbar/README.md)

[Tooltip](src/tooltip/README.md)

## Conventions

### EventHandlers

You can register event handlers that get called when the corresponding events occur by passing the handlers into a widget's `properties`.
The naming convention for event handlers is as follows:

- if the parent of the widget has the power to decide *if* an event is successful, i.e. can cancel the event, then the child widget will call an event handler in the following format:

 `onRequest[X]`, e.g. for a `close` event, the event handler called by the child widget must be called `onRequestClose`

 Here the child widget is requesting that the `close` event take place.

- for events that will occur regardless of child/parent interaction, then the `Request` naming convention is dropped:

`on[X]`, e.g. for a `dismiss` event, the event handler called by the child widget must be called `onDismiss`


### Icons

We use [font awesome](http://fontawesome.io/) for icons.
Where a theme requires specific icons that are not part of the Font Awesome set, then those themes will ship their own icons.

There is an [icon widget](src/icon/README.md) that aids in creating in proper semantics and provides type-checking for the type of icon.

### Coding conventions

`px vs. em` - we specify font sizes in `px`.
When creating a widget, spacing (margin, padding) should be specified using `px` unless the design calls for proportional spacing, in which case `em` can be used.

### Z-index layering

Widgets adhere to a basic convention for using specific ranges of z-index values based on function and visual context. This convention is followed in both individual widget CSS and in the Dojo theme styles. These values can be overridden in a custom theme if necessary since no `z-index` values are set in fixed styles.

The range definitions are as follows:

- **0 - 100**: Any specific component layering, e.g. a caption over an image.
- **100 - 200**: Tooltips and other small, local, interactive overlays.
- **200 - 300**: Dropdowns. Common examples include menus and select boxes.
- **300 - 400**: Fixed position elements. Fixed headers and footers are clear examples of fixed page elements, but it could also include a drag-and-drop element in a drag state.
- **400 - 500**: Dialogs and other full-page overlays. Slide panes are another good example of a common UI pattern in this range. It includes any widget that is intended to cover all page content, or that often is used with an underlay.
- **500 +***: Alerts and special cases. Toast notifications could potentially be in this range, or any component important enough to interrupt all other interaction.


## How to customize a widget

There are many ways in which you can customize the behavior and appearance of Dojo widgets.
See the [`widget-core`](https://github.com/dojo/framework/blob/master/src/widget-core/README.md) README for examples of how to customize the theme or a specific CSS class of a widget.

Or can you write your own widget that extends an official widget.

### Extending widgets

Because all Dojo widgets are Classes, you can simply extend the Class to add or change its behavior.

```ts
export class MyWidget extends Button {
...
}
```

Dojo widgets provide standard extension points to allow you to customize their behavior. For more details, please refer to the [widget authoring system](https://github.com/dojo/framework/blob/master/src/widget-core/README.md#decorator-lifecycle-hooks).

Individual widgets also provide certain types of extension points where applicable:
- `render*`: Large render functions are split up into multiple smaller pieces that can be more easily overridden to create custom vdom.
- `getModifierClasses`: Modify the array of conditionally applied classes like `css.selected` or `css.disabled`.
Not all widgets include these extension points, and some have additional overridable methods.


## How do I contribute?

We appreciate your interest!  Please see the [Dojo Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines and Style Guide.

Note that all changes to widgets should work with the [dojo theme](https://github.com/dojo/themes/). To test this start the example page (instructions at [Installation](#installation) section) and select the dojo option at the top of the page.

### Installation

To start working with this package, clone the repository and run `npm install`.

In order to build the project run `npm run build`.

### Testing

Test cases MUST be written using [Intern](https://theintern.github.io) using the Object test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

To test locally in node run:

`npm run test`

To test against browsers with a local selenium server run:

`npm run test:functional`


### Viewing widget examples locally

Each Dojo widget includes functioning example code so you can view the widget. To view individual widget example:

1. Run `npm run build:test` in your terminal
2. Run `npm run examples`
2. Open the newly built project at `http://localhost:5000/_build/common/example/` in your web browser
3. By default, no widget is selected, open the dropdown to select a widget
4. Observe the page reloads and the selected widget displays

#### Watching widget example code

Running `npm run build` each time you wish to view a small change can be tedious, instead to have your files watched run:

```
tsc -w
```

With that command, TypeScript watches for changes and recompiles when necessary.

## Licensing information

© 2018 [JS Foundation](https://js.foundation/). [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
