# Widgets 6 to 7 Migration Guide (In Progress)

## Breaking changes

Across the widget suite we have made a number of sweeping breaking changes

### Removal of touch/mouse/pointer events

We have standardised mouse / touch events to use `pointer` events under the covers and removed a large number of callbacks from our widgets adding in only what we feel is appropriate.
For example, `text-input` now provides `onOver` / `onOut` events rather than `mouseIn` / `mouseOut` which signify the cross device nature of the pointer events being used.

### Standardisation of input/value/change

We have consolidated the use of `onInput` / `onChange` etc to a consistent `onValue` callback. All widgets returning a value will do so using this callback. In addition to this change, any callbacks which previously returned a value or a key such as `onChange` / `onBlur` etc have either been removed or have been changed to return zero parameters.
To match the use of `onValue`, all widgets that accept a value now either take a `value` or `initialValue` property (in the case of partially controlled widgets). This will make it easier and more consistent to use the widget library.

### Partially controlled pattern

In an effort to make widgets easier and simpler to use out of the box we have changed many of our form widgets to use a partially controlled pattern. This means that our widgets that accept `initialValue` will manage their own value internally. They will still report back value changes via the `onValue` callback but you do not need to keep setting `value` on the widget. The same is true for widgets that accept an `onValidate` callback but do not accept `valid`. These widgets will self validate and inform you of their validation state.

### Validated widgets

Many of our form widgets are now capable of validating themselves. In many cases this is done in an uncontrolled way meaning the widget will display its valid state / error message and will call the `onValidate` callback when valid state changes.

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


### button

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


### checkbox

#### Property changes
##### Changed properties
- onBlur: () => void;
	- this prop now is passed zero arguments, whereas previously it was passed the current `value` and `checked` property values.
- onFocus: () => void;
	- this prop now is passed zero arguments, whereas previously it was passed the current `value` and `checked` property values.
##### Removed properties
- label: string;
	- Removed in favor of using a child to render the label
- onChange: (value: string, checked: boolean) => void;
	- replaced by `onValue(checked: boolean)`
- onClick: (value: string, checked: boolean) => void;
	- replaced by `onValue(checked: boolean)`
#### Example of migration from v6 to v7

```ts
// v6
import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Checkbox from '@dojo/widgets/checkbox';

const factory = create({ icache });

export default factory(function CheckboxExample({ middleware: { icache } }) {
	const checkboxStates = icache.getOrSet('checkboxStates', {});
	return [
		<Checkbox
			checked={checked.checkbox0}
			label="v6 Checkbox Example"
			value="checkbox0"
			onChange={(value, checked) => {
				icache.set('checkboxStates', {
					...checkboxStates,
					[value]: checked
				});
			}}
		/>,
		// other checkboxes...
	];
});
```

```ts
// v7
import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Checkbox from '@dojo/widgets/checkbox';

const factory = create({ icache });

export default factory(function CheckboxExample({ middleware: { icache } }) {
	const checkboxStates = icache.getOrSet('checkboxStates', {});
	return [
		<Checkbox
			checked={icache.get('isChecked0')}
			onValue={(checked) => {
				icache.set('isChecked0', checked);
			}}
		>
			v7 Checkbox Example
		</Checkbox>,
		// other checkboxes...
	];
});
```

Latest example can be found on [widgets.dojo.io/#widget/checkbox/overview](https://widgets.dojo.io/#widget/checkbox/overview)


### dialog

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


### global-event

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


### header
- used to be toolbar
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


### label

#### Property changes
##### Removed properties
- `invalid?: boolean`
	- replaced by `valid?: boolean`
	- inverted validation API for consistency
#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/label/overview](https://widgets.dojo.io/#widget/label/overview)


### list
- used to be listbox
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


### native-select
- used to live inside select
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


### progress

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


### range-slider

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
- now uses list, no longer has native
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


### switch
 - Split out of checkbox
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

### tab-controller

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


