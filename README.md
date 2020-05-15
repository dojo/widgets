# @dojo/widgets

[![Build Status](https://travis-ci.org/dojo/widgets.svg?branch=master)](https://travis-ci.org/dojo/widgets)
[![codecov](https://codecov.io/gh/dojo/widgets/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/widgets)
[![npm version](https://badge.fury.io/js/%40dojo%2Fwidgets.svg)](https://badge.fury.io/js/%40dojo%2Fwidgets)

A suite of pre-built Dojo widgets, ready to use in your web application.
These widgets are built using Dojo's widget authoring system [(@dojo/framework/core)](https://github.com/dojo/framework/blob/master/src/core/README.md).

- [Usage](#usage)
- [Features](#features)
- [Examples](#examples)
- [Conventions](#conventions)
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

- All widgets are fully themeable. Example themes are available in the [/theme](https://github.com/dojo/widgets/tree/master/src/theme) folder.

- All widgets support internationalization (`i18n`)

## Examples

Live examples of current widgets are available at [widgets.dojo.io](https://widgets.dojo.io ).

## Writing widgets

### Properties
- defining properties
- passing properties
- reading properties

### Event callbacks
- defining callbacks
- passing callbacks
- using event callbacks

### Control patterns

Widgets should work out of the box wherever possible and be easy to use without needing to be fully controlled. What we mean by this is that a widget should be able to manage it's own state and perform as would a native input component when placed on a page. As a result, we have re-written most of our widgets to use the icache middleware and maintain their own state.

```tsx
// place uncontrolled text-input on a page
<TextInput />
```

Most widgets offer both partial and fully controlled properties and callbacks as covered below.

#### Partial control

Partially controlled widgets accept properties prefixed with `initial`, the most common of which is `initialValue`. This will allow you to pass an initial value to a widget without needing to write a feedback function that constantly re-set's the value each time it's changed. If the `initialValue` changes from it's previous value, then the widget should react to this change and display the new value.

```tsx
// text-input with initial value of foo
<TextInput initialValue='foo' />
```

#### Fully controlled

Fully controlled widget properties are those which are **not** prefixed with `initial`. For example, if you were to set a `value` property on the above `TextInput` example without keeping it upto date each time it's accompanying `onValue` callback is called.
The lower level inputs, text-input, radio and checkbox are the exceptions to the "uncontrolled" approach as they are generally used as building blocks for more specialised widgets. For example, text-input allows you to control validation whereas the email-input, which utilises a text-input internally, is uncontrolled and manages its own validation state.
In the same fashion, checkboxes and radio buttons are fully controlled but we anticipate them to be used most frequently via checkbox-group and radio-group, both of which are partially controlled and follow the same initialValue pattern as other input widgets.

```tsx
// controlled input
let value = 'foo';
<TextInput value={value} onValue={(newValue) => { value = newValue; invalidator(); }} />

// uncontrolled input
<TextInput initialValue={'foo'} />
```

### Children
TBD

#### Normal children
If a node is rendered inside a widget, it should be passed as a child rather than via a child renderer. This child could be any RenderResult.

If the widget doesn’t need to determine where the children are rendered, or when they are rendered in a single location, then normal children are fine.

```tsx
<ParentWidget>
	<ChildWidget />
</ParentWidget>

<ParentWidget>
	<ChildWidget />
	<ChildWidget />
	<ChildWidget />
</ParentWidget>

<ParentWidget>
	Hello, World
</ParentWidget>
```

#### Child render functions
When a widget needs to inject functions or properties into the child widgets, a child function should be used:

```tsx
<ParentWidget>
	{ (foo) => <ChildWidget foo={foo('a')} /> }
</ParentWidget>
```

#### Named children
When multiple children are accepted and are to be placed in different locations by the parent widget, a child object should be used. This approach is use for example in our Card widget as it accepts content for different sections of the card and renders them in the appropriate locations with wrapping styles / classes. The child object can contain a mix of both RenderResult and functions that return a RenderResult.

```tsx
<ParentWidget>{{
	foo: (foo) => <ChildWidget foo={foo('a')} />,
	bar: <span>bar</span>,
	baz: 'hello, world'
}}</ParentWidget>
```

### Types of widgets

#### Form Inputs

- intro
- name / value
- native form submissions
- render result label
- example

#### Containers

- intro
- child renders / slots
- avoiding functions where possible
- example

#### Grouping

- radio / checkbox groups
- name / value / native forms
- middleware
- custom child renderers
- example

### Custom Elements

- intro - widgets are released as custom elements as well
- designed for ease of use
- add to dojorc

#### Simple children / named children over child renderers
- usage differences
- slots

#### Attributes over properties
- attributes directly on the widget
- props have to be set

### Styling

#### CSS modules
- simple class names
- avoid bem
- variables can be used but not imported
- don't use tag selectors

#### CSS unit conventions

`px vs. em` - we specify font sizes in `px`.
When creating a widget, spacing (margin, padding) should be specified using `px` unless the design calls for proportional spacing, in which case `em` can be used.

#### Z-index layering

Widgets adhere to a basic convention for using specific ranges of z-index values based on function and visual context. This convention is followed in both individual widget CSS and in the Dojo theme styles. These values can be overridden in a custom theme if necessary since no `z-index` values are set in fixed styles.

The range definitions are as follows:

- **0 - 100**: Any specific component layering, e.g. a caption over an image.
- **100 - 200**: Tooltips and other small, local, interactive overlays.
- **200 - 300**: Dropdowns. Common examples include menus and select boxes.
- **300 - 400**: Fixed position elements. Fixed headers and footers are clear examples of fixed page elements, but it could also include a drag-and-drop element in a drag state.
- **400 - 500**: Dialogs and other full-page overlays. Slide panes are another good example of a common UI pattern in this range. It includes any widget that is intended to cover all page content, or that often is used with an underlay.
- **500 +***: Alerts and special cases. Toast notifications could potentially be in this range, or any component important enough to interrupt all other interaction.

### Theming

- intro
- theme structure
- variants (link to section)

#### Theme classes

- intro
- theme middleware
- theme.classes
- fixed classes reference
- example

#### Theme variants

- structure
- usage
- example

#### Theme composition

- intro
- variant use
- prefix use
- example

### Pointer events

- intro
- example

### Widget state

- intro
- icache
- example

### Widget variants

- link back to theme-variants

When writing a widget variant, ie. `RaisedButton`, you should ensure that you use `theme.compose` from the widget [theme middleware](https://github.com/dojo/widgets/blob/master/src/middleware/theme.ts). This allows your variant to interit css from it's base widget whilst allowing it to be themed separately.

### Testing

- intern
- coverage

#### Unit Tests

- sinon
- assert chai
- example

#### Harness

- link to harness docs
- example

#### Assertion templates

- intro
- example

### Adding Examples

We use [Parade](https://github.com/dojo/parade) to showcase our widget examples. The latest deployment of this can be found at [widgets.dojo.io](https://widgets.dojo.io ).

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

## How do I contribute?

TODO: Where does this live now?

We appreciate your interest! Please see the [Dojo Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines and Style Guide.

### Installation

To start working with this package, clone the repository and run `npm install`.

In order to build the project run `npm run build`.

### Testing

Test cases MUST be written using [Intern](https://theintern.github.io) using the Object test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

To test locally in node run:

`npm run test`

### Widget Documentation

The widget examples and documentation is automatically generated by the `parade` application when built with the `docs` feature flag set to `true`. The site relies on a few conventions in order to be able do this:

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

© 2020 [JS Foundation](https://js.foundation/). [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
