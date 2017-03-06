# @dojo/widgets

<!-- TODO: change and uncomment
[![Build Status](https://travis-ci.org/dojo/<< package-name >>.svg?branch=master)](https://travis-ci.org/dojo/<< package-name >>)
[![codecov](https://codecov.io/gh/dojo/<< package-name >>/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/<< package-name >>)
[![npm version](https://badge.fury.io/js/dojo-<< package-name >>.svg)](http://badge.fury.io/js/dojo-<< package-name >>)
-->

A suite of pre-built Dojo 2 widgets, ready to use in your application. These widgets are built using [(@dojo/widget-core)](https://github.com/dojo/widget-core).

**WARNING** This is *alpha* software. It is not yet production ready, so you should use at your own risk.

- [Features](#features)
- [How Do I use this package?](#how-do-i-use-this-package)
- [How Do I Contribute?](#how-do-i-contribute)
    - [Installation](#installation)
    - [Testing](#testing)
- [Licensing Information](#licensing-information)

## Features

Dojo 2 widgets are supported in all evergreen browsers (IE11+, Chrome, Firefox, Safari) as well as popular mobile browsers (Mobile Safari, Chrome on Android).

## Conventions

### Icons

We use [font awesome](http://fontawesome.io/) for icons.

### Coding conventions

`px vs em` - we specify font sizes in `px`. When creating a widget, spacing (margin, padding) should be specified using `px` unless the design calls for proportional spacing, in which case `em` can be used.


## How do I use this package?

***This package is not yet published.***

When published you can import all Dojo 2 widgets from `npm`: @dojo/widgets

```shell
npm install @dojo/widgets
```

as well as import each widget individually, e.g. for our `ComboBox`:

```shell
npm install @dojo/widget-combobox
```
The above details are preliminary and subject ot change.

## How do I contribute?

We appreciate your interest!  Please see the [Dojo 2 Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines and Style Guide.

## Testing

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
