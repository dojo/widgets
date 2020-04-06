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

### accordion
- `Accordion` used to be named `AccordionPane`.

#### Property changes

##### Added properties
- `exclusive?: boolean`
	- This property only allows one open child pane at a time.

#### Changed properties
- `children: AccordionPaneChildren`
	- This property no longer accepts `TitlePane` widgets.
	- This property accepts a renderer function that returns child panes.
	- Child panes use renderer function arguments as properties.

##### Removed properties
- `onRequestClose?(key: string): void`
	- This property was removed altogether.
	- Child panes can use `onClose` instead.
- `onRequestOpen?(key: string): void`
	- This property was removed altogether.
	- Child panes can use `onOpen` instead.
- `openKeys?: string[]`
	- This property was removed altogether.
	- Child pane open state is now internally managed.
	- Child panes can use `initialOpen` to set initial open state.

#### Changes in behaviour
The `Accordion` widget is now uncontrolled by default, meaning it manages its own child pane open state internally. Child panes can use an `initialOpen` property to set individual initial open state. Child panes can also use `onOpen` and `onClose` properties to detect when this open state changes.

The `Accordion` now uses a child renderer function to determine its child panes. This means that a function is passed as the widget's only child, and that function receives `onOpen`, `onClose`, and `open` arguments to be used as properties each returned pane. Child panes should be `Pane` widgets, a convenience wrapper around `TitlePane` with features specific to `Accordion`.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<AccordionPane
	onRequestClose={key => icache.set('keys', icache.get('keys').filter(k !== key))}
	onRequestOpen={key => icache.set('keys', [...icache.get('keys'), key])}
	openKeys={icache.get('keys')}
>
	<TitlePane
		title="Title"
		key="pane"
	>
		Content
	</TitlePane>
</AccordionPane>
```

##### v7 Example
```tsx
<Accordion>
	{(onOpen, onClose, open) => ([
		<Pane
			key="pane"
			onOpen={onOpen('pane')}
			onClose={onClose('pane')}
			open={open('pane')}
		>
			{{
				title: 'Title',
				content: 'Content'
			}}
		</Pane>
	])}
</Accordion>
```


### button

#### Property changes
##### Changed properties
- onDown?(): void;
	- Handler for events triggered by pointer down.
	- Replaces previous down event handlers.
##### Removed properties
- popup?: { expanded?: boolean; id?: string } | boolean;
	- Popup functionality was removed from `Button`.
	- The `TriggerPopup` widget provides popup functionality.
- onInput?(value?: string | number | boolean): void;
	- Not applicable to a button.
- onChange?(value?: string | number | boolean): void;
	- Not applicable to a button.
- The following interaction events were replaced by onDown:
	- onMouseDown?(): void;
	- onMouseUp?(): void;
	- onTouchStart?(): void;
	- onTouchEnd?(): void;
	- onTouchCancel?(): void;
	- onMouseDown?(): void;
	- onMouseUp?(): void;
	- onTouchStart?(): void;
	- onTouchEnd?(): void;
	- onTouchCancel?(): void;
#### Changes in behaviour

#### Example of migration from v6 to v7
```
<Button onMouseDown={() => {console.log('Down')}}>Example Button</Button>
```
```
<Button onDown={() => {console.log('Down')}}>Example Button</Button>
```

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
- onLabel: DNode
	- Removed in favor of using a child renderer
- offLabel: DNode
	- Removed in favor of using a child renderer
- mode: 'normal' | 'toggle'
	- "toggle" mode has been split into the `switch` widget (see below)
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

##### Changed properties
- title
  - Title is now specified in the child function and not passed as a property.
- modal
  - The modal property is now only valid when role="dialog"
##### Removed properties
- underlayEnterAnimation
	- Replaced by themeing `underlayEnter` class.
- underlayExitAnimation
  - Replaced by themeing `underlayExit` class.
- enterAnimation
  - Replaced by themeing `enter` class
- exitAnimation
  - Replaced by themeing `exit` class
#### Changes in behaviour

Dialog contents, title, and actions are now specified via a child function. Previously, the title was specified via a property and the dialog contents where passed as the children of the Dialog. Dialog actions are nodes that appear below the dialog contents, like cancel / ok buttons.

#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/dialog/overview](https://widgets.dojo.io/#widget/dialog/overview)


### header
- The `Header` used to be named `Toolbar`.

#### Property changes

##### Added properties
- `sticky?: boolean`
	- This property fixed the header to the top of a view.

##### Changed properties
- `children: HeaderChildren`
	- This property no longer accepts `DNode` actions.
	- This property accepts a child renderer object.
	- Leading, trailing, title, and actions are set using this renderer.

##### Removed properties
- `align?: Align`
	- This property was removed altogether.
	- Alignment functionality is no longer supported.
- `collapseWidth?: number`
	- This property was removed altogether.
	- Collapse functionality is no longer supported.
- `onCollapse?(collapsed: boolean): void`
	- This property was removed altogether.
	- Collapse functionality is no longer supported.
- `heading?: string`
	- This property was removed altogether.
	- The header title is now set using a child renderer.

#### Changes in behaviour
The `Header` now uses a child renderer object to determine its leading content, trailing content, title, and action items. This means that an object is passed as the widget's only child with keys for `leading` , `trailing`, `title`, and `actions`, each of which return elements to render accordingly.

The `Header` no longer auto-collapses action items into a `SlidePane`. Instead, to be more aligned with future Dojo application architecture, media-based middleware can be used to responsively change the `Header` out for a different widget depending on available space.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<Toolbar
	align={Align.right}
	collapseWidth={700}
	heading="Title"
	onCollapse={() => { console.log('collapsed'); }}
>
	<a href="#foo">Foo</a>
	<a href="#bar">Bar</a>
	<a href="#baz">Baz</a>
</Toolbar>
```

##### v7 Example
```tsx
<Header>
	{{
		title: () => 'Title',
		actions: () => [
			<Link to="#foo">Foo</Link>,
			<Link to="#bar">Bar</Link>,
			<Link to="#baz">Baz</Link>
		]
	}}
</Header>
```


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
##### Changed properties
- output?: () => RenderResult
	- `output` was moved to a child renderer and should be handled in a child function.
#### Changes in behaviour
Output is now handled via an optional child renderer of type RenderResult.
#### Example of migration from v6 to v7
```
<Progress
	value={value}
	max={max}
	output={(value, percent) => `${value} of ${max} is ${percent}%`}
/>
```
```
<Progress value={value} max={max}>
	{{
		output: (value, percent) => `${value} of ${max} is ${percent}%`
	}}
</Progress>
```

Latest example can be found on [widgets.dojo.io/#widget/progress/overview](https://widgets.dojo.io/#widget/progress/overview)


### radio

#### Property changes
##### Changed properties
- label?: RenderResult
	- Label is now handled in a child renderer. Child content of the Radio widget is displayed in a Label.
##### Removed properties
- labelAfter?: boolean;
	- Removed in favor of a single label handled via a child renderer.
#### Changes in behaviour
Label is now handled via an optional child renderer of type RenderResult.
#### Example of migration from v6 to v7
```
<Radio label={'Radio Button 1'} />
```
```
<Radio>Radio Button 1</Radio>
```

Latest example can be found on [widgets.dojo.io/#widget/radio/overview](https://widgets.dojo.io/#widget/radio/overview)


### range-slider

#### Property changes
##### Changed properties
- value
	- This property has been replaced by `initialValue`
	- The range-slider now internally manages its value and it is no longer necessary to pass the current value into the range slider from the parent
- label
  - Replaced with a child renderer
- output
  - Replaced with a child renderer
##### Removed properties
- labelAfter
  - No longer supported
#### Changes in behaviour

The range slider widget now internally manages its own value. The value can be changed via the `initialValue` property, and updates are exposed via the `onValue` callback.

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

##### Added properties
- `aria?: { [key: string]: string | null }`
	- This property is used to pass custom `aria-*` attributes DOM nodes.

##### Removed properties
- `onOpen?(): void`
	- This property was removed altogether.
	- This functionality is no longer supported.

#### Changes in behaviour
The `SlidePane` no longer supports an `onOpen` property and instead only uses `onRequestClose` to update externally-managed open state.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<SlidePane
	open={icache.get('open')}
	onOpen={() => icache.set('open', false)}
	onRequestClose={() => icache.set('open', false)}
/>
```

##### v7 Example
```tsx
<SlidePane
	open={icache.get('open')}
	onRequestClose={() => icache.set('open', false)}
/>
```

### slider

#### Property changes
##### Removed properties
- `label`: `string`
	- Removed in favor of a single label handled via a child renderer.
- `labelAfter`: `boolean`
	- Removed in favor of a single label handled via a child renderer.
- `value`: `number`
  - Changed to `initialValue`
- `output`: `() => RenderResult`
	- `output` was moved to a child renderer and should be handled in a child function.
- `onChange`: `(value: number) => void`
	- replaced by `onValue(value: number)`
	- since `Slider` is now uncontrolled, the new `onValue` property is used to read the slider's value on change, not set it.
- `onInput`: `(value: number) => void`
	- removed in favor of controlling input handling internally
#### Changes in behaviour
- `Slider` is now uncontrolled, meaning that parents no longer must manually update the slider's current value in response to user interaction.
- Rendering the label and output is now handled via an optional child renderer of type `RenderResult`.
#### Example of migration from v6 to v7

##### v6 Example

```tsx
<Slider
	label="How much do you like tribbles?"
	min={0}
	max={100}
	output={(value: number) => {
		if (value < 20) {
			return 'I am a Klingon';
		}
		if (value < 40) {
			return 'Tribbles only cause trouble';
		}
		if (value < 60) {
			return 'They\`re kind of cute';
		}
		if (value < 80) {
			return 'Most of my salary goes to tribble food';
		} else {
			return 'I permanently altered the ecology of a planet for my tribbles';
		}
	}}
	step={1}
	value={icache.get('tribbleValue')}
	onChange={(value) => {
		icache.set('tribbleValue', value);
	}}
	onInput={(value) => {
		icache.set('tribbleValue', value);
	}}
/>
```

##### v7 Example

```tsx
<Slider
	initialValue={0}
	min={0}
	max={100}
	step={1}
>
	{{
		label: 'How much do you like tribbles?',
		output: (value: number) => {
			if (value < 20) {
				return 'I am a Klingon';
			}
			if (value < 40) {
				return 'Tribbles only cause trouble';
			}
			if (value < 60) {
				return 'They\`re kind of cute';
			}
			if (value < 80) {
				return 'Most of my salary goes to tribble food';
			} else {
				return 'I permanently altered the ecology of a planet for my tribbles';
			}
		}
	}}
</Slider>
```


Latest example can be found on [widgets.dojo.io/#widget/slider/overview](https://widgets.dojo.io/#widget/slider/overview)

### snackbar
#### Property changes
##### Removed properties
- messageRenderer: () => RenderResult
	- replaced by children.message: RenderResult
- actionsRenderer: () => RenderResult
	- replaced by children.actions: RenderResult

#### Example of migration from v6 to v7

##### v6 implementation
```tsx
<Snackbar
	messageRenderer={() => 'Snackbar'}
	actionsRenderer={() => 'Actions'} open={true}
/>
```

##### v7 implementation
```tsx
<Snackbar open={true}>
	{{
		message: 'Snackbar',
		actions: 'Actions'
	}}
</Snackbar>
```

Latest example can be found on [widgets.dojo.io/#widget/snackbar/overview](https://widgets.dojo.io/#widget/snackbar/overview)

### switch
 - Split out of checkbox
#### Property changes
##### Removed properties
- `label`: `string`;
	- Removed in favor of using a child renderer
- `onLabel`: `DNode`
	- Removed in favor of using a child renderer
- `offLabel`: `DNode`
	- Removed in favor of using a child renderer
- `onChange`: `(value: string, checked: boolean) => void`;
	- replaced by `onValue(checked: boolean)`
#### Example of migration from v6 to v7

##### v6 Example

```tsx
<Checkbox
	checked={icache.get('checked')}
	label="On/Off"
	mode={Mode.toggle}
	onChange: this.onChange
/>
```

##### v7 Example

```tsx
<Switch
	value={icache.get('checked')}
	onValue={(value) => {
		icache.set('checked', true);
	}}
>
	{{ label: 'On/Off' }}
</Switch>
```

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
##### Additional  Properties
- format
	- Specifies whether or not the time is displayed in 24h or 12h format
- onValidate
  - Called when validation occurs on the time picker.
##### Changed properties
- value
  - Changed to `initialValue`
  - The time picker value is now internally managed and does not need to be managed by the parent widget
- start
  - Renamed to `min` to match with native time picker
- end
  - Renamed to `max` to match with native time picker
- isOptionDisabled
  - Renamed to `timeDisabled`
  - Takes a function with a single `Date` parameter. The option is disabled if the function returns falsey
- label
  - Replaced with child renderer
##### Removed properties
- widgetId
  - No longer needed
- valid
  - Validation is now handled internally by the time picker and exposed via the `onValidate` property
- useNativeElement
  - No longer supported
- readOnly
  - No longer supported. Time picker can be `disabled` if required
- options
  - It is no longer necessary to manually specify the options. The options may be configured via the `start`, `end`, and `step` properties.
- openOnFocus
  - No longer supported. Clicking the button or using the enter/down arrow is required to open the time picker menu
- onRequestOptions
  - No longer supported
- onOver
  - No longer supported
- onOut
  - No longer supported
- onMenuChange
  - No longer supported
- onFocus
  - No longer supported
- onClick
  - No longer supported
- onBlur
  - No longer supported
- labelHidden
  - No longer supported
- labelAfter
  - No longer supported
- inputProperties
  - No longer supported
- clearable
  - No longer supported, the time picker is not clearable
- autoBlur
  - No longer supported
#### Changes in behaviour

The time picker will generate its own time options manually now, and therefore does not require the parent widget to pass in a list of time options.

#### Example of migration from v6 to v7

Latest example can be found on [widgets.dojo.io/#widget/time-picker/overview](https://widgets.dojo.io/#widget/time-picker/overview)


### title-pane

#### Property changes

##### Changed properties
- `onClose?(): void`
	- This property replaces `onRequestClose`.
	- This property receives no arguments.
- `onOpen?(): void`
	- This property replaces `onRequestOpen`.
	- This property receives no arguments.
- `initialOpen?: boolean`
	- This property sets initial open state.
	- This widget then manages its open state internally.
	- The `open` property can alternatively be used for full control.
- `children: TitlePaneChildren`
	- This property no longer accepts `DNode` content.
	- This property accepts a child renderer object.
	- Pane title and content are set using this renderer.

##### Removed properties
- `title: DNode`
	- This property was removed altogether.
	- Pane titles are now set using a child renderer.

#### Changes in behaviour
The `TitlePane` widget is now uncontrolled by default, meaning it manages its own open state internally. An `initialOpen` property can be used to set initial open state, and `onOpen` and `onClose` properties can be used to detect when this open state changes. If full-control is needed to support complex use-cases - such as restrictions around opening or closing - the `open` property can be used instead of `initialOpen` to mandate open state.

The `TitlePane` now uses a child renderer object to determine its title and content. This means that an object is passed as the widget's only child with keys for `title` and `content`, each of which return elements to render accordingly.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<TitlePane
	title="Title"
	onRequestClose={() => icache.set('open', false)}
	onRequestOpen={() => icache.set('open', true)}
	open={icache.get('open')}
>
	Content
</TitlePane>
```

##### v7 Example
```tsx
<TitlePane>
	{{
		title: 'Title',
		content: 'Content'
	}}
</TitlePane>
```

### tooltip

#### Property changes
##### Additional Mandatory Properties
- foo: string
	- this prop does x
##### Changed properties
- `children`: `DNode`
	- This property no longer accepts `DNode` triggers.
	- This property accepts a child renderer object.
	- The trigger and contents are set using this renderer.
##### Removed properties
- `content`: DNode
	- The tooltip content is now set via a child renderer object.
#### Changes in behaviour
- Both the tooltip trigger and content are specified on a child renderer object rather than as a child `DNode` and property, respectively.
#### Example of migration from v6 to v7

##### v6 Example

```tsx
<Tooltip content="This tooltip shows on click" open={icache.get('show')}>
	<button
		onclick={() => {
			icache.set('show', !icache.get('show'));
		}}
	>
		Toggle Tooltip
	</button>
</Tooltip>
```

##### v7 Example

```tsx
<Tooltip open={icache.get('show')}>
	{{
		content: 'This tooltip shows on click',
		trigger: (
			<button
				onclick={() => {
					icache.set('show', !icache.get('show'));
				}}
			>
				Toggle Tooltip
			</button>
		)
	}}
</Tooltip>
```

Latest example can be found on [widgets.dojo.io/#widget/tooltip/overview](https://widgets.dojo.io/#widget/tooltip/overview)


