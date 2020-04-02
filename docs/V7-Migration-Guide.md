# Widgets 6 to 7 Migration Guide (In Progress)

## Breaking changes

Across the widget suite we have made a number of sweeping breaking changes

### Removal of touch/mouse/pointer events

We have standardised mouse / touch events to use `pointer` events under the covers and removed a large number of callbacks from our widgets adding in only what we feel is appropriate.
For example, `text-input` now provides `onOver` / `onOut` events rather than `mouseIn` / `mouseOut` which signify the cross device nature of the pointer events being used.

### Standardisation of input/value/change

We have consolidated the use of `onInput` / `onChange` etc to a consistent `onValue` callback. All widgets returning a value will do so using this callback. In addition to this change, any callbacks with previously returned a value or a key such as `onChange` / `onBlur` etc have either been removed or have been changed to return zero parameters.
To match the use of `onValue`, all widgets that accept a value now either take a `value` or `initialValue` property (in the case of partially controlled widgets). This will make it easier and more consistent to use the widget library.

### Partially controlled pattern

In an effort to make widgets easier and simpler to use out of the box we have changed many of our form widgets to use a partially controlled pattern. This means that our widgets that accept `initialValue` will manage their own value internally. They will still report back value changes via the `onValue` callback but you do not need to keep setting `value` on the widget. The same is true for widgets that accept an `onValidate` callback but do not accept `valid`. This widgets will self validate and inform you of their validation state.

### Validated widgets

Many of our form widgets are now capable of validating themselves. In many cases this is done in an uncontrolled way meanign the widget will display it's valid state / error message and will call the `onValidate` callback when valid state changes.

* Overview of breaking changes
	* Normalisation of properties across the library, eg onValue, value/initialValue
  * Simplification of properties for some widgets
  * Removal/Replacement of certain widgets like combobox/listbox for select/typeahead
  * Other general breaking changes

## Per widget we should cover:
* Summarise the changes to the widget properties
   * Additional mandatory properties
   * Replaced properties/functionality by other properties
   * Removed properties, if the functionality can still be done, explain how (maybe via children instead etc)
* Summarise changes to behaviour that are not covered in the above
* Simple example of a v6 widget moving to a v7 widget.
* link to the widget examples on widgets.dojo.io

## Widget Changes

### accordion-pane
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/accordion-pane/overview](https://widgets.dojo.io/#widget/accordion-pane/overview)


### avatar
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/avatar/overview](https://widgets.dojo.io/#widget/avatar/overview)


### breadcrumb-group
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/breadcrumb-group/overview](https://widgets.dojo.io/#widget/breadcrumb-group/overview)


### button
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/button/overview](https://widgets.dojo.io/#widget/button/overview)


### calendar
#### Property changes
##### Changed properties
- initialValue?: Date
	- This property replaced `selectedDate`
	- This property can be used to simply provide an initial value or can
	  be used together with `onValue` to control the value
- onValue?(value: Date): void
    - This property replaced `onDateSelect`
    - The name was changed to follow a more consistent pattern
- initialMonth?: number
   - This property replaced `month`
   - This property can be used to specify the initial month that should be displayed
     or can be used together with `onMonth` to control the month displayed
- onMonth?(month: number): void
    - This property replaced `onMonthChange`
    - The name was changed to follow a more consistent pattern
- initialYear?: number
   - This property replaced `year`
   - This property can be used to specify the initial year that should be displayed
     or can be used together with `onYear` to control the year displayed
- onYear?(year: number): void
    - This property replaced `onYearChange`
    - The name was changed to follow a more consistent pattern
#### Changes in behaviour
The calendar widget is now uncontrolled by default. Initial values can be
provided but the calendar will maintain its own internal state, tracking the
displayed month and year and the currently selected value. The calendar can
still be controlled by using the callbacks and initial properties to track
and update the value.
#### Example of migration from v6 to v7
```tsx
const selectedDate = icache.getOrSet('date', new Date());
const month = icache.getOrSet('month', selectedDate.getMonth());
const year = icache.getOrSet('year', selectedDate.getFullYear());
<Calendar
    selectedDate={selectedDate}
    month={month}
    year={year}
    onDateSelect={date => {
        icache.set('date', date);
    }}
    onMonthChange={month => {
        icache.set('month', month);
    }}
    onYearChange={year => {
        icache.set('year', year);
    }}
/>
```

```tsx
<Calendar
    onValue={date => {
        icache.set('date', date);
    }}
/>
```

Latest example can be found on [widgets.dojo.io/#widget/calendar/overview](https://widgets.dojo.io/#widget/calendar/overview)


### card
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/card/overview](https://widgets.dojo.io/#widget/card/overview)


### checkbox
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/checkbox/overview](https://widgets.dojo.io/#widget/checkbox/overview)


### checkbox-group
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/checkbox-group/overview](https://widgets.dojo.io/#widget/checkbox-group/overview)


### constrained-input
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/constrained-input/overview](https://widgets.dojo.io/#widget/constrained-input/overview)


### date-input
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/date-input/overview](https://widgets.dojo.io/#widget/date-input/overview)


### dialog
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/dialog/overview](https://widgets.dojo.io/#widget/dialog/overview)


### email-input
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/email-input/overview](https://widgets.dojo.io/#widget/email-input/overview)


### form
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/form/overview](https://widgets.dojo.io/#widget/form/overview)


### global-event
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/global-event/overview](https://widgets.dojo.io/#widget/global-event/overview)


### grid
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/grid/overview](https://widgets.dojo.io/#widget/grid/overview)


### header
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/header/overview](https://widgets.dojo.io/#widget/header/overview)


### header-card
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/header-card/overview](https://widgets.dojo.io/#widget/header-card/overview)


### helper-text
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/helper-text/overview](https://widgets.dojo.io/#widget/helper-text/overview)


### icon
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/icon/overview](https://widgets.dojo.io/#widget/icon/overview)


### label
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/label/overview](https://widgets.dojo.io/#widget/label/overview)


### list
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/list/overview](https://widgets.dojo.io/#widget/list/overview)


### loading-indicator
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/loading-indicator/overview](https://widgets.dojo.io/#widget/loading-indicator/overview)


### native-select
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/native-select/overview](https://widgets.dojo.io/#widget/native-select/overview)


### number-input
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/number-input/overview](https://widgets.dojo.io/#widget/number-input/overview)


### outlined-button
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/outlined-button/overview](https://widgets.dojo.io/#widget/outlined-button/overview)


### password-input
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/password-input/overview](https://widgets.dojo.io/#widget/password-input/overview)


### progress
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/progress/overview](https://widgets.dojo.io/#widget/progress/overview)


### radio
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/radio/overview](https://widgets.dojo.io/#widget/radio/overview)


### radio-group
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/radio-group/overview](https://widgets.dojo.io/#widget/radio-group/overview)


### raised-button
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/raised-button/overview](https://widgets.dojo.io/#widget/raised-button/overview)


### range-slider
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/range-slider/overview](https://widgets.dojo.io/#widget/range-slider/overview)


### select
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/select/overview](https://widgets.dojo.io/#widget/select/overview)


### slide-pane
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/slide-pane/overview](https://widgets.dojo.io/#widget/slide-pane/overview)


### slider
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/slider/overview](https://widgets.dojo.io/#widget/slider/overview)


### snackbar
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/snackbar/overview](https://widgets.dojo.io/#widget/snackbar/overview)


### switch
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/switch/overview](https://widgets.dojo.io/#widget/switch/overview)


### tab
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/tab/overview](https://widgets.dojo.io/#widget/tab/overview)


### tab-controller
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/tab-controller/overview](https://widgets.dojo.io/#widget/tab-controller/overview)


### text-area
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/text-area/overview](https://widgets.dojo.io/#widget/text-area/overview)


### text-input
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/text-input/overview](https://widgets.dojo.io/#widget/text-input/overview)


### time-picker
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/time-picker/overview](https://widgets.dojo.io/#widget/time-picker/overview)


### title-pane
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/title-pane/overview](https://widgets.dojo.io/#widget/title-pane/overview)


### tooltip
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/tooltip/overview](https://widgets.dojo.io/#widget/tooltip/overview)


### trigger-popup
**New Widget** (delete if innapropriate)
#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- bar: string
	- this prop replaced x
	- this prop does foo bar baz
	- more info
##### Removed properties
- baz: string
	- replaced by foo
	- any additional info
#### Changes in behaviour
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/trigger-popup/overview](https://widgets.dojo.io/#widget/trigger-popup/overview)

