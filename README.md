# @dojo/widgets

[![Build Status](https://travis-ci.org/dojo/widgets.svg?branch=master)](https://travis-ci.org/dojo/widgets)
[![codecov](https://codecov.io/gh/dojo/widgets/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/widgets)
[![npm version](https://badge.fury.io/js/%40dojo%2Fwidgets.svg)](https://badge.fury.io/js/%40dojo%2Fwidgets)

A suite of pre-built Dojo widgets, ready to use in your web application.
These widgets are built using Dojo's widget authoring system [(@dojo/framework/core)](https://github.com/dojo/framework/blob/master/src/core/README.md).

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

[NativeSelect](src/native-select/README.md)

[Slider](src/slider/README.md)

[TextArea](src/text-area/README.md)

[TextInput](src/text-input/README.md)

[TimePicker](src/time-picker/README.md)

### Layout widgets
[Accordion](src/accordion/README.md)

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

Icon fonts are generated using [IcoMoon](https://icomoon.io/app). If a new icon is required, it is possible to upload the current `dojoSelect.json` from `src/theme/fonts` and then add new icons by selecting from the Font Awesome library. After selecting the new icons from the library, merge them down into the current icon set, then delete the rest of the Font Awesome icons that were added by IcoMoon. After this you can export and download them as a zip. Once downloaded you will also need to unzip them and replace the font files (svg, woff, ttf) in `src/theme/fonts`. Now download the new selection JSON file from the `projects` page of IcoMoon and replace the current `dojoSelection.json` file.

To make use of the new icons it is necessary to update the `icon.m.css` file in the theme folder with the new unicode icon like so:

```
.newIcon:before {
	content: "\f123";
}
```

Where `\f123` is the unicode character for the new icon. To check the new icon works you can render it in the `src/widgets/examples/icon/Basic.tsx` to make sure everything renders correctly.

There is an [icon widget](src/icon/README.md) that aids in creating in proper semantics and provides type-checking for the type of icon.

### Coding conventions

`px vs. em` - we specify font sizes in `px`.
When creating a widget, spacing (margin, padding) should be specified using `px` unless the design calls for proportional spacing, in which case `em` can be used.

### Z-index layering

Widgets adhere to a basic convention for using specific ranges of z-index values based on function and visual context. This convention is followed in both individual widget CSS and in the Dojo theme styles. These values can be overridden in a custom theme if necessary since no `z-index` values are set in fixed styles.

The range definitions are as follows:

- **0 - 100**: Any specific component layering, e.g. a caption over an image.
- **100 - 200**: Fixed position elements. Fixed headers and footers are clear examples of fixed page elements, but it could also include a drag-and-drop element in a drag state.
- **200 - 300**: Partial-page overlays such as Slide panes.
- **300 - 400**: Full-page overlays such as Dialogs.
- **400 - 500**: Body level popups, tooltips and alerts.


## How to customize a widget

There are many ways in which you can customize the behavior and appearance of Dojo widgets.
See the [`core`](https://github.com/dojo/framework/blob/master/src/core/README.md) README for examples of how to customize the theme or a specific CSS class of a widget.

Or can you write your own widget that extends an official widget.

### Extending widgets

Because all Dojo widgets are Classes, you can simply extend the Class to add or change its behavior.

```ts
export class MyWidget extends Button {
...
}
```

Dojo widgets provide standard extension points to allow you to customize their behavior. For more details, please refer to the [widget authoring system](https://github.com/dojo/framework/blob/master/src/core/README.md#decorator-lifecycle-hooks).

Individual widgets also provide certain types of extension points where applicable:
- `render*`: Large render functions are split up into multiple smaller pieces that can be more easily overridden to create custom vdom.
- `getModifierClasses`: Modify the array of conditionally applied classes like `css.selected` or `css.disabled`.
Not all widgets include these extension points, and some have additional overridable methods.

## Widget Variants

When writing a widget variant, ie. `RaisedButton`, you should ensure that you use `theme.compose` from the widget [theme middleware](https://github.com/dojo/widgets/blob/master/src/middleware/theme.ts). This allows your variant to interit css from it's base widget whilst allowing it to be themed separately.

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

### Widget Examples

The Dojo widget examples application is located in `src/examples`.

To add a new example, create a directory that matches the directory name of the widget e.g. `src/examples/src/widgets/text-input`. Each widget _must_ have an example called `Basic.tsx` and an entry in the `src/examples/src/config.ts` keyed by the name of the widget directory. The widget example should import widgets from `@dojo/widgets` and not via a relative import. It is very important that the config entry name (ie. `text-input`) matches the folder name / css file name of the widget otherwise the doc build will fail.

```js
{
    'text-input: {
        filename: 'index',
        overview: {
            example: {
                module: BasicCheckbox,
                filename: 'Basic'
            }
        },
        examples: [
            {
                title: 'The example title',
                description: 'Optional example description',
                module: OtherCheckbox,
                filename: 'Other'
            }
        ]
    }
}
```

 * filename: The name of the widget module, defaults to `index`
 * overview: The configuration for the basic example including the imported Basic module and the example filename (has to be `'Basic'`)
 * examples: Additional examples for the widget, an array of configuration that specifies the title, description, module and example filename.

 To view the examples locally run `npm run dev` in the root directory and navigate to http://localhost:9999, this starts the examples in watch mode and should update widget module are changed. Note that you do not have to install dependencies in the `src/examples` project, this will result in an error.

### Widget Documentation

The widget examples and documentation is automatically generated by the `examples` application when built with the `docs` feature flag set to `true`. The site relies on a few conventions in order to be able do this:

1. A widgets properties interface must be the name of the widget with a suffix of `Properties`, e.g. for `text-input` the properties interface would be `TextInputProperties`
2. The widget properties must be exported to ensure they are visible in the generated widget documentation.
3. All themeable styles must be added to the corresponding theme css module in `src/theme` and match the name of the widget directory e.g. `text-input.m.css`
4. For properties description docs must be included inline above each property, e.g.
5. All widgets must have a `README.md` file in their root directory.

```ts
interface ExampleProperties {
    /** This is the description for foo */
    foo: string;
    /** This is the description for bar */
    bar: string;
}
```

To build the documentation run `npm run build:docs` and to build and serve the documentation in watch mode run `npm run build:docs:dev`

### Running the examples on Codesandbox

The examples also run on Codesanbox, to run the examples on the master branch go to https://codesandbox.io/s/github/dojo/widgets/tree/master/src/examples. To run the examples for a specific user/branch/tag adjust the url as required.

## Licensing information

© 2018 [JS Foundation](https://js.foundation/). [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
