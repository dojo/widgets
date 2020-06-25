# Widgets 6 to 7 Migration Guide

## Breaking changes


### Removal of touch/mouse/pointer events

We have standardized mouse / touch events to use `pointer` events and removed a large number of callbacks. For example, `text-input` now provides `onOver` / `onOut` events rather than `mouseIn` / `mouseOut` which signify the cross device nature of the pointer events being used.

### Standardization of input/value/change
We have consolidated the use of `onInput` / `onChange` / etc to a consistent `onValue` callback. All widgets returning a value will do so using this callback. In addition to this change, any callbacks which previously returned a value or a key such as `onChange` / `onBlur` have either been removed or have been changed to return zero parameters.

To match the use of `onValue`, all widgets that accept a value now either take a `value` or `initialValue` property (in the case of partially controlled widgets). This will make it easier and more consistent to use the widget library.

### Partially controlled pattern
In an effort to make widgets easier and simpler to use out of the box we have changed many of our form widgets to use a partially controlled pattern. This means widgets that accept `initialValue` will manage their own value internally. They will still report back value changes via the `onValue` callback but you do not need to keep setting `value` on the widget. The same is true for widgets that accept an `onValidate` callback but do not accept `valid`. These widgets will self validate and inform you of their validation state.

### Validated widgets
Many of our form widgets are now capable of validating themselves. In many cases this is done in an uncontrolled way meaning the widget will display its valid state / error message and will call the `onValidate` callback when valid state changes.

---

## Individual Widget Changes

### AccordionPane

- Renamed to `Accordion`.

#### Property changes
##### Added properties
- `exclusive?: boolean;`
	- This property only allows one open child pane at a time.

##### Changed properties
- `children: AccordionPaneChildren;`
	- This property no longer accepts `TitlePane` widgets.
	- This property accepts a renderer function that returns child panes.
	- Child panes use renderer function arguments as properties.
	- `Pane` is exported from `Accordion`

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

#### Changes in behavior

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

Latest example can be found at [widgets.dojo.io/#widget/accordion/overview](https://widgets.dojo.io/#widget/accordion/overview)

---

### Button

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

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<Button onMouseDown={() => {console.log('Down')}}>Example Button</Button>
```

##### v7 Example
```tsx
<Button onDown={() => {console.log('Down')}}>Example Button</Button>
```

Latest example can be found at [widgets.dojo.io/#widget/button/overview](https://widgets.dojo.io/#widget/button/overview)

---

### Calendar

#### Property changes
##### Changed properties
- initialValue?: Date
	- This property can be used to provide an initial value or can be used to partially control the component, which responds to changes in this value
- value?: Date
	- This property replaced `selectedDate`
- onValue?(value: Date): void
	- This property replaced `onDateSelect`
	- The name was changed to follow a more consistent pattern
- initialMonth?: number
	- This property can be used to specify the initial month that should be displayed or can be used together with `onMonth` to partially control the month displayed, which will responod to changes in this value
- onMonth?(month: number): void
	- This property replaced `onMonthChange`
	- The name was changed to follow a more consistent pattern
- initialYear?: number
	- This property can be used to specify the initial year that should be displayed or can be used together with `onYear` to partially control the year displayed, which will respond to changes in this value
- onYear?(year: number): void
	- This property replaced `onYearChange`
	- The name was changed to follow a more consistent pattern

#### Changes in behavior

The calendar widget is now uncontrolled by default. Initial values can be provided but the calendar will maintain its own internal state, tracking the displayed month and year and the currently selected value. The calendar can be partially controlled using the `initial` properties as it will update when those values change. For use cases where the component needs to be fully controlled, the `value`, `month`, and `year` properties can be used.

#### Example of migration from v6 to v7

##### v6 Example
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

##### v7 Example
```tsx
<Calendar
	onValue={date => {
		icache.set('date', date);
	}}
/>
```

Latest example can be found at [widgets.dojo.io/#widget/calendar/overview](https://widgets.dojo.io/#widget/calendar/overview)

---

### Checkbox

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

##### v6 Example
```tsx
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

##### v7 Example
```tsx
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

Latest example can be found at [widgets.dojo.io/#widget/checkbox/overview](https://widgets.dojo.io/#widget/checkbox/overview)

---

### Dialog

#### Property changes
##### Changed properties
- `title?: DNode;`
	- Title is now specified in the child function and not passed as a property.
- `modal?: boolean;`
	- The modal property is now only valid when role="dialog"
##### Removed properties
- `underlayEnterAnimation`
	- Replaced by theming `underlayEnter` class.
- `underlayExitAnimation`
	- Replaced by theming `underlayExit` class.
- `enterAnimation`
	- Replaced by theming `enter` class
- `exitAnimation`
	- Replaced by theming `exit` class

#### Changes in behavior

Dialog contents, title, and actions are now specified via a child function. Previously, the title was specified via a property and the dialog contents where passed as the children of the Dialog. Dialog actions are nodes that appear below the dialog contents, like cancel / ok buttons.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<Dialog
    title='Basic Dialog'
    open={this._open}
    onRequestClose={() => {
        this._open = false;
        this.meta(Focus).set('button');
        this.invalidate();
    }}
>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Quisque id purus ipsum. Aenean ac purus purus.
    Nam sollicitudin varius augue, sed lacinia felis tempor in.
</Dialog>
```

##### v7 Example
```tsx
<Dialog open={isOpen} onRequestClose={() => icache.set('isOpen', false)}>
	{{
		title: 'Basic Dialog',
		content: (
			<virtual>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
				purus ipsum. Aenean ac purus purus. Nam sollicitudin varius augue, sed
				lacinia felis tempor in.
			</virtual>
		)
	}}
</Dialog>
```

Latest example can be found at [widgets.dojo.io/#widget/dialog/overview](https://widgets.dojo.io/#widget/dialog/overview)

---

### Toolbar
- Renamed to `Header`.

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

#### Changes in behavior

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
		title: 'Title',
		actions: [
			<Link to="#foo">Foo</Link>,
			<Link to="#bar">Bar</Link>,
			<Link to="#baz">Baz</Link>
		]
	}}
</Header>
```

#### Example of responsive toolbar behaviour using `Header` and `SlidePane`

```tsx
import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import breakpoint from '@dojo/framework/core/middleware/breakpoint';
import icache from '@dojo/framework/core/middleware/icache';
import { Header } from '@dojo/widgets/header';
import { SlidePane } from '@dojo/widgets/slide-pane';
import { Icon } from '@dojo/widgets/icon';
import * as css from './CollapsingHeader.m.css';

const factory = create({ theme, breakpoint, icache });
export default factory(function CollapsingHeader({ middleware: { theme, breakpoint, icache } }) {

	const size = breakpoint.get('root');
	const open = icache.getOrSet('open', false);
	const collapse = size && (size.breakpoint === 'SM' || size.breakpoint === 'MD');

	const appTitle = 'My App';
	const actions = (
		<virtual>
			<a classes={css.action}>foo</a>
			<a classes={css.action}>bar</a>
			<a classes={css.action}>baz</a>
		</virtual>
	);

	return (
		<div key='root' classes={[css.root, theme.variant()]}>
			<Header>{{
				title: appTitle,
				actions: !collapse && <div classes={css.headerActions}>{ actions }</div>,
				leading: collapse && 
					<button onclick={() => { icache.set('open', !open) }} type='button'>
						<Icon size='large' type='barsIcon' />
					</button>
			}}</Header>
			{collapse && 
				<SlidePane title={appTitle} open={open} onRequestClose={() => { icache.set('open', false)}}>
					<div classes={css.collapsedActions}>
						{ actions }
					</div>				
				</SlidePane>
			}
		</div>
	);
});
```

```css
.headerActions {
	display: flex;
	flex-direction: row;
}

.collapsedActions {
	display: flex;
	flex-direction: column;
}

.action {
	padding: 10px;
}
```

Latest example can be found at [widgets.dojo.io/#widget/header/overview](https://widgets.dojo.io/#widget/header/overview)

---

### Label

#### Property changes
##### Removed properties
- `invalid?: boolean`
	- replaced by `valid?: boolean`
	- inverted validation API for consistency

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<Label invalid={true}>Invalid Label</Label>
```

##### v7 Example
```tsx
<Label valid={false}>Invalid Label</Label>
```

Latest example can be found at [widgets.dojo.io/#widget/label/overview](https://widgets.dojo.io/#widget/label/overview)

---

### ListBox
- Rewritten and renamed to `List`
- Now uses a `resource` and the `data` middleware.

#### Property changes
##### Additional Mandatory Properties
- `onValue(value: string)`
	- this is the callback on value change.
- `resource`
	- this is the data resource for the List to use to generate the list items
- `transform`
	- a transform is required for the List as it uses a typed data middleware.
	- a `defaultTransform` is exported from `List`

##### Changed properties
- `getOptionDisabled`
	- replaced by `disabled(item: ListOption): boolean` callback
- `optionData`
	- replaced by `resource`
	- widget is now data aware and uses `resources`
- `visualFocus`
	- replaced by `focusable: boolean`.
	- determines if the List can be focused and capture key press events
- `onActiveIndexChange`
	- only received the index of the item requesting to be made active
	- keyboard navigation is now partially controlled, you need only pass the `onActiveIndexChange` & `activeIndex` properties if you wish to fully control them.
- `onOptionSelect`
	- replaced by `onValue` which returns the selected item value
- `getOptionSelected`
	- replaced by partial control via internal state or fully controlled selections via `value` & `onValue` properties

##### Removed properties
- `multiselect: boolean;`
	- list is now single select but can be used as part of a multiselect typeahead implementation
- `getOptionLabel`
	- `label` is now passed via a `ListOption` from the `resource`. If a label is not passed, the `value` is used instead.
- `getOptionId`
	- an id is generated and used internally for each list item.
- `tabIndex`
	- the tab index is managed internally
	- focus can be disabled via the `focusable` property.

#### Changes in behavior

#### Example of migration from v6 to v7

##### v6 Example

```tsx
<Listbox
	key='listbox1'
	activeIndex={this._listbox1Index}
	widgetId='listbox1'
	optionData={this._options}
	getOptionLabel={(option: CustomOption) => option.value}
	getOptionDisabled={(option: CustomOption) => !!option.disabled}
	getOptionSelected={(option: CustomOption) => option.value === this._listbox1Value}
	onActiveIndexChange={(index: number) => {
		this._listbox1Index = index;
		this.invalidate();
	}}
	onOptionSelect={(option: any, index: number) => {
		this._listbox1Value = option.value;
		this._options = [...this._options];
		this.invalidate();
	}}
></Listbox>
```

##### v7 Example

```tsx
const animals = [{ value: 'cat' }, { value: 'dog' }, { value: 'mouse' }, { value: 'rat' }];
const resource = createResource(createMemoryTemplate());

<List
	widgetId='listbox1'
	initialValue='cat'
	resource={{ resource: () => resource, data: animals }}
	transform={defaultTransform}
	onValue={(value: string) => {
		icache.set('value', value);
	}}
/>
```

Latest example can be found at [widgets.dojo.io/#widget/list/overview](https://widgets.dojo.io/#widget/list/overview)

---

### Progress

#### Property changes
##### Changed properties
- `output?: () => RenderResult;`
	- `output` was moved to a child renderer and should be handled in a child function.

#### Changes in behavior

Output is now handled via an optional child renderer of type RenderResult.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<Progress
	value={value}
	max={max}
	output={(value, percent) => `${value} of ${max} is ${percent}%`}
/>
```

##### v7 Example
```tsx
<Progress value={value} max={max}>
	{{
		output: (value, percent) => `${value} of ${max} is ${percent}%`
	}}
</Progress>
```

Latest example can be found at [widgets.dojo.io/#widget/progress/overview](https://widgets.dojo.io/#widget/progress/overview)

---

### Radio

#### Property changes
##### Changed properties
- `label?: RenderResult;`
	- Label is now handled in a child renderer. Child content of the Radio widget is displayed in a Label.

##### Removed properties
- `labelAfter?: boolean;`
	- Removed in favor of a single label handled via a child renderer.

#### Changes in behavior

Label is now handled via an optional child renderer of type RenderResult.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<Radio label={'Radio Button 1'} />
```

##### v7 Example
```tsx
<Radio>Radio Button 1</Radio>

```

Latest example can be found at [widgets.dojo.io/#widget/radio/overview](https://widgets.dojo.io/#widget/radio/overview)

---

### RangeSlider

#### Property changes
##### Changed properties
- `initialValue?: RangeValue`
	- This property can be used to partially control the range slider by setting an initial value.
- `value?: RangeValue`
	- The range-slider now internally manages its value by default and it is no longer necessary to pass the current value
	- Passing a value allows the range-slider to be fully controlled
- `label?: RenderResult;`
	- Replaced with a child renderer
- `output?(value: RangeValue): RenderResult;`
	- Replaced with a child renderer

##### Removed properties
- `labelAfter`
	- No longer supported

#### Changes in behavior

The range slider widget now internally manages its own value by default and can be changed via the `initialValue` property. The range slider can be fully controlled using the `value` property.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<RangeSlider
    onInput={(min: number, max: number) => {
        this._state.value1Min = min;
        this._state.value1Max = max;
        this.invalidate();
    }}
    onChange={(min: number, max: number) => {
        this._state.value1Min = min;
        this._state.value1Max = max;
        this.invalidate();
    }}
/>
```

##### v7 Example
```tsx
<RangeSlider
	initialValue={{
		min: 0,
		max: 100
	}}
/>
```

Latest example can be found at [widgets.dojo.io/#widget/range-slider/overview](https://widgets.dojo.io/#widget/range-slider/overview)

---

### Select
- Now uses list, no longer supports using the native element.
- `NativeSelect` is now it's own widget
- Select now uses `resource` and the `data` middleware.

#### Property changes
##### Changed properties
- `onValue: (value: string) => void;`
	- Replaces `onChange`
- `initialValue?: string;`
	- Can be used to an initial value and then let the component act in an uncontrolled manner.

##### Removed properties
- `useNativeElement: boolean;`
	- Native use case is now supported by its own widget

#### Changes in behavior

- Can now be used in an uncontrolled or controlled manner.
- Accepts a resource, please see `Listbox` migration for more information as this is used internally by `Select`.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<Select
	onChange={value => {
		icache.set('value', value);
	}}
	value={icache.get('value')}
/>
```

##### v7 Example
```tsx
const animals = [{ value: 'cat' }, { value: 'dog' }, { value: 'mouse' }, { value: 'rat' }];
const resource = createResource(createMemoryTemplate());

<Select
	initialValue='cat'
	resource={{ resource: () => resource, data: animals }}
	transform={defaultTransform}
	onValue={(value: string) => {
		icache.set('value', value);
	}}
/>
```

Latest example can be found at [widgets.dojo.io/#widget/select/overview](https://widgets.dojo.io/#widget/select/overview)

#### Example using select and resource within a class-based widget

To use a widget that requires a resource within a class-bassed widget, you must inject the resource middleware via a wrapping widget.
An example of this approach can be seen below. (Example taken from [github.com/agubler/dojo-resource-wrapper](https://github.com/agubler/dojo-resource-wrapper))

```tsx
// Resource wrapper
import { create } from '@dojo/framework/core/vdom';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import { RenderResult } from '@dojo/framework/core/interfaces';

const resourceMiddleware = createResourceMiddleware();

const factory = create({ resource: resourceMiddleware }).children<(resource: ReturnType<typeof resourceMiddleware>['api']) => RenderResult>();

export default factory(function ResourceWrapper({ middleware: { resource }, children }) {
    const [renderer] = children();
    return renderer(resource);
});
```

```tsx
// Resource wrapper use within a class
import renderer, { w, v } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import watch from '@dojo/framework/core/decorators/watch';
import Select from '@dojo/widgets/select';
import theme from '@dojo/widgets/theme/dojo';
import Registry from '@dojo/framework/core/Registry'
import { registerThemeInjector } from '@dojo/framework/core/mixins/Themed';
import { createMemoryResourceTemplate } from '@dojo/framework/core/middleware/resources';
import ResourceWrapper from './ResourceWrapper';

interface Animals {
    value: string;
}

const template = createMemoryResourceTemplate<Animals>()

class App extends WidgetBase {
    @watch()
    private _selectedValue = '';

    private _id = uuid();

    private _onValue = (value: string) => {
        this._selectedValue = value;
    }

    render() {
        return (
            v('div', [
                w(ResourceWrapper, {}, [(resource) => {
                    return w(Select, {
                        resource: resource({ template,  initOptions: { id: this._id, data: [{ value: 'panda'} ] }}),
                        onValue: this._onValue
                    })
                }]),
                v('div', [this._selectedValue])
            ])
        );
    }
}

const registry = new Registry();
registerThemeInjector(theme, registry)

const r = renderer(() => w(App, {}));
r.mount({ registry });
```

---

### SlidePane

#### Property changes
##### Added properties
- `aria?: { [key: string]: string | null }`
	- This property is used to pass custom `aria-*` attributes DOM nodes.

##### Removed properties
- `onOpen?(): void`
	- This property was removed altogether.
	- This functionality is no longer supported.

#### Changes in behavior

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

Latest example can be found at [widgets.dojo.io/#widget/slide-pane/overview](https://widgets.dojo.io/#widget/slide-pane/overview)

---

### Slider

#### Property changes
##### Added properties
- `initialValue`: `number`
	- Can be used to provide an initial value or can be used to partially control the slider.

##### Removed properties
- `label`: `string`
	- Removed in favor of a single label handled via a child renderer.
- `labelAfter`: `boolean`
	- Removed in favor of a single label handled via a child renderer.
- `output`: `() => RenderResult`
	- `output` was moved to a child renderer and should be handled in a child function.
- `onChange`: `(value: number) => void`
	- replaced by `onValue(value: number)`
	- since `Slider` is now uncontrolled, the new `onValue` property is used to read the slider's value on change, not set it.
- `onInput`: `(value: number) => void`
	- removed in favor of controlling input handling internally.

#### Changes in behavior
- `Slider` is now uncontrolled by default, meaning that parents no longer must manually update the slider's current value in response to user interaction.
- The `Slider` can be controlled by using the `value` property.
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

Latest example can be found at [widgets.dojo.io/#widget/slider/overview](https://widgets.dojo.io/#widget/slider/overview)

---

### Snackbar

#### Property changes
##### Removed properties
- `messageRenderer: () => RenderResult`
	- replaced by children.message: RenderResult
- `actionsRenderer: () => RenderResult`
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

Latest example can be found at [widgets.dojo.io/#widget/snackbar/overview](https://widgets.dojo.io/#widget/snackbar/overview)

---

### Switch

- Split out of `Checkbox`, now a separate widget.

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
	onChange={this.onChange}
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

Latest example can be found at [widgets.dojo.io/#widget/switch/overview](https://widgets.dojo.io/#widget/switch/overview)

---

### TabController

#### Structural changes
- `<TabController>` takes a renderer function as its child instead of a list of `<Tab>` widgets.
- The `<Tab>` widget previously used to manage both the tab button and tab content properties has been split into a `tabs` property passed to `<TabController>` and a `<TabContent>` widget that defines the tab content.

#### Property changes
##### Additional Mandatory Properties
- `tabs: TabItem[];`
	- this prop defines the label and initial state of each tab.

##### Removed properties
- `activeIndex: number;`
	- the active tab index is now controlled internally.
	- the tab that should be opened by default can be controlled with the new `initialId` property that takes the tab's `id` rather than its numerical index.
- `onRequestTabChange: (index: number, key: string) => void;`
	- parents no longer must control which tab is active.
- `onRequestTabClose: (index: number, key: string) => void;`
	- parents no longer must control which tabs are closed.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Set from '@dojo/framework/shim/Set';
import TabController from '@dojo/widgets/tab-controller';
import Tab from '@dojo/widgets/tab';

const factory = create();

export default factory(function Closeable() {

	const closed = icache.getOrSet('closed', new Set<string>());
	const activeIndex = icache.getOrSet('activeIndex', 2);

	return (
		<TabController
			activeIndex={activeIndex}
			onRequestTabClose={(index, key) => {
				icache.set('closed', new Set([...closed, key]));
			}}
			onRequestTabChange={(index, key) => {
				icache.set('activeIndex', index);
			}}
		>
			{!closed.has('tab0') && (
				<Tab key="tab0" closeable={true} label="Tab One">
					Hello Tab One
				</Tab>
			)}
			<Tab key="tab1" disabled={true} label="Tab Two">
				Hello Tab Two
			</Tab>
			<Tab key="tab2" label="Tab Three">
				Hello Tab Three
			</Tab>
			<Tab key="tab3" label="Tab Four">
				Hello Tab Four
			</Tab>
		</TabController>
	);
});
```

##### v7 Example
```tsx
import { tsx, create } from '@dojo/framework/core/vdom';
import TabController, { TabItem } from '@dojo/widgets/tab-controller';
import TabContent from '@dojo/widgets/tab-controller/TabContent';

const factory = create();

export default factory(function Closeable() {
const tabs = [
	{ closeable: true, id: 'tab0', label: 'Tab One' },
	{ disabled: true, id: 'tab1', label: 'Tab Two' },
	{ id: 'tab2', label: 'Tab Three' },
	{ id: 'tab3', label: 'Tab Four' }
];


return (
	<TabController initialId="tab2" tabs={tabs}>
		{(
			tabs: TabItem[],
			isActive: (id: string) => boolean,
			isClosed: (id: string) => boolean
		) => [
			<TabContent key="tab0" active={isActive('tab0')} closed={isClosed('tab0')}>
				Hello Tab One
			</TabContent>,
			<TabContent key="tab1" active={isActive('tab1')} closed={isClosed('tab1')}>
				Hello Tab Two
			</TabContent>,
			<TabContent key="tab2" active={isActive('tab2')} closed={isClosed('tab2')}>
				Hello Tab Three
			</TabContent>,
			<TabContent key="tab3" active={isActive('tab3')} closed={isClosed('tab3')}>
				Hello Tab Four
			</TabContent>
		]}
	</TabController>
	);
});
```

Latest example can be found at [widgets.dojo.io/#widget/tab-controller/overview](https://widgets.dojo.io/#widget/tab-controller/overview)

---

### TextArea

#### Property changes
##### Added properties
- `initialValue?: string;`
	- Can be used to provide an initial value or can be used to partially control the text area.

##### Removed properties
- `label`: `string;`
	- `<TextArea>` now takes an optional child that will be rendered as its label.

#### Changes in behavior
- `TextArea` is now uncontrolled by default, meaning parent widgets are no longer responsible for updating the current value in response to changes or events. The widget is controllable with `value`.

#### Example of migration from v6 to v7

##### v6 example
```tsx
<TextArea label="Textarea with label" />
```

##### v7 example
```tsx
<TextArea>Textarea with label</TextArea>
```

Latest example can be found at [widgets.dojo.io/#widget/text-area/overview](https://widgets.dojo.io/#widget/text-area/overview)

---

### TextInput

#### Property changes
##### Added properties
- `initialValue?: T['value'];`
	- Can be used to provide an initial value or can be used to partially control the text input.

##### Removed properties
- `label`: `string`
	- Specifying a label is now done with a `label` key on a child renderer object (see the example below)
- `leading`: `() => DNode`
	- Specifying leading content is now done with a `leading` key on a child renderer object (see the example below)
	- Since the original property function receives no arguments, the child renderer object expects a static value instead of a function.
- `trailing`: `() => DNode`
	- Specifying trailing content is now done with a `trailing` key on a child renderer object (see the example below)
	- Since the original property function receives no arguments, the child renderer object expects a static value instead of a function.

#### Changes in behavior

- `TextInput` is now uncontrolled by default, meaning parent widgets are no longer responsible for updating the current value in response to changes or events. The widget is controllable with `value`.
- `Addon` widget is now exported from `TextInput` which can be used to wrap the `leading` / `trailing` sections.

#### Example of migration from v6 to v7

##### v6 example
```tsx
<TextInput
	type="text"
	label="Input Label"
	value="Initial value"
	leading={() => <span>A</span>}
	trailing={() => <span>Z</span>}
/>
```

##### v7 example
```tsx
<TextInput type="text" value="Initial value">
	{{
		label: 'Input Label',
		leading: <Addon>A</Addon>,
		trailing: <Addon filled>Z</Addon>
	}}
</TextInput>
```

Latest example can be found at [widgets.dojo.io/#widget/text-input/overview](https://widgets.dojo.io/#widget/text-input/overview)

---

### TimePicker

#### Property changes
##### Additional Properties
- `format?: '24' | '12';`
	- Specifies whether or not the time is displayed in 24h or 12h format
- `onValidate?(valid: boolean, message: string): void;`
	- Called when validation occurs on the time picker.
- `initialValue?: string;`
	- Used to set the initial value of the time picker.
	- The time picker is now internally managed by default and does not need to be managed by the parent widget, but can still be controlled using `value` and `onValue`.

##### Changed properties
- `start`
	- Renamed to `min` to match with native time picker
- `end`
	- Renamed to `max` to match with native time picker
- `isOptionDisabled`
	- Renamed to `timeDisabled`
	- Takes a function with a single `Date` parameter. The option is disabled if the function returns falsey
- `label`
	- Replaced with child renderer

##### Removed properties
- `widgetId`
	- No longer needed
- `valid`
	- Validation is now handled internally by the time picker and exposed via the `onValidate` property
- `useNativeElement`
	- No longer supported
- `readOnly`
	- No longer supported. Time picker can be `disabled` if required
- `options`
	- It is no longer necessary to manually specify the options. The options may be configured via the `start`, `end`, and `step` properties.
- `openOnFocus`
	- No longer supported. Clicking the button or using the enter/down arrow is required to open the time picker menu
- `onRequestOptions`
	- No longer supported
- `onOver`
	- No longer supported
- `onOut`
	- No longer supported
- `onMenuChange`
	- No longer supported
- `onFocus`
	- No longer supported
- `onClick`
	- No longer supported
- `onBlur`
	- No longer supported
- `labelHidden`
	- No longer supported
- `labelAfter`
	- No longer supported
- `inputProperties`
	- No longer supported
- `clearable`
	- No longer supported, the time picker is not clearable
- `autoBlur`
	- No longer supported

#### Changes in behavior

The time picker will generate its own time options manually now, and therefore does not require the parent widget to pass in a list of time options.

#### Example of migration from v6 to v7

##### v6 Example
```tsx
<TimePicker
	start="12:00:00"
	end="12:00:59"
	step={1}
	onValue={(value) => icache.set('value', value)}
	label="Time: "
/>
```

##### v7 Example
```tsx
<TimePicker min="12:00:00" max="12:00:59" step={1} onValue={(value) => icache.set('value', value)}>
	{{ label: 'Time: ' }}
</TimePicker>
```

Latest example can be found at [widgets.dojo.io/#widget/time-picker/overview](https://widgets.dojo.io/#widget/time-picker/overview)

---

### TitlePane

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

#### Changes in behavior
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

Latest example can be found at [widgets.dojo.io/#widget/title-pane/overview](https://widgets.dojo.io/#widget/title-pane/overview)

---

### Tooltip

#### Property changes
##### Changed properties
- `children`: `DNode`
	- This property no longer accepts `DNode` triggers.
	- This property accepts a child renderer object.
	- The trigger and contents are set using this renderer.

##### Removed properties
- `content`: `DNode`
	- The tooltip content is now set via a child renderer object.

#### Changes in behavior

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

Latest example can be found at [widgets.dojo.io/#widget/tooltip/overview](https://widgets.dojo.io/#widget/tooltip/overview)
