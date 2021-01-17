import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import Typeahead from '../typeahead';
import * as css from '../theme/default/chip-typeahead.m.css';
import {
	ItemRendererProperties,
	ListOption,
	ListItem,
	ListItemProperties,
	MenuItemProperties
} from '../list';
import Chip from '../chip';
import focus from '@dojo/framework/core/middleware/focus';
import * as typeaheadCss from '../theme/default/typeahead.m.css';
import * as chipCss from '../theme/default/chip.m.css';
import * as labelCss from '../theme/default/label.m.css';
import { PopupPosition } from '@dojo/widgets/popup';
import Label from '../label';
import { find } from '@dojo/framework/shim/array';

export interface ChipTypeaheadProperties {
	/** The initial selected value */
	initialValue?: string[];
	/** Callback called when user selects an option from the typeahead */
	onValue?: (value: ListOption[]) => void;
	/** Optional controlled value */
	value?: string[];
	/** Property to determine if the input is disabled */
	disabled?: boolean;
	/** Property to determine how many items to render. Defaults to 6 */
	itemsInView?: number;
	/** The name of the input */
	name?: string;
	/** Placement of the select menu; 'above' or 'below' */
	position?: PopupPosition;
	/** Placement of the selected values. Default is 'inline' */
	placement?: 'inline' | 'bottom';
	/** Allow duplicates of the same value to be selected. Default is false */
	duplicates?: boolean;
	/** Flag to indicate if values other than those in the resource can be entered, defaults to true */
	strict?: boolean;
}

export interface ChipTypeaheadChildren {
	/** Adds a <label> element with the supplied text */
	label?: RenderResult;
	/** Custom renderer for item contents */
	items?: (
		item: ItemRendererProperties,
		props: ListItemProperties & MenuItemProperties
	) => RenderResult;
	/** Custom renderer for selected items */
	selected?: (value: string, label: string) => RenderResult;
}

export interface ChipTypeaheadIcache {
	initialValue: string[];
	options: ListOption[];
	focused: boolean;
}

const factory = create({
	icache: createICacheMiddleware<ChipTypeaheadIcache>(),
	theme,
	resource: createResourceMiddleware<{ data: ListOption }>(),
	focus
})
	.properties<ChipTypeaheadProperties>()
	.children<ChipTypeaheadChildren>();

function valueChanged(values: string[] = [], options: ListOption[] = []): boolean {
	if (values.length !== options.length) {
		return true;
	}

	for (let i = 0; i < values.length; i++) {
		if (!options[i] || options[i].value !== values[i]) {
			return true;
		}
	}

	return false;
}

export const ChipTypeahead = factory(function ChipTypeahead({
	id,
	middleware: { icache, theme, focus, resource },
	properties,
	children
}) {
	const { createOptions, getOrRead } = resource;
	const {
		value,
		classes = {},
		variant,
		initialValue = [],
		disabled,
		itemsInView,
		position,
		name,
		placement = 'inline',
		strict,
		resource: { template, options = createOptions((curr, next) => ({ ...curr, ...next })) }
	} = properties();
	const [{ label, items, selected } = {} as ChipTypeaheadChildren] = children();
	const themeCss = theme.classes(css);
	const focused = icache.getOrSet('focused', false);
	const selectedOptions = icache.set('options', (current) => {
		if (!current && initialValue && !value) {
			const items = getOrRead(template, options());
			const initialSelectedOptions = initialValue.map((valueId) => {
				if (items) {
					const findResult = find(items, (item) => item.value === valueId);
					if (findResult) {
						return findResult;
					}
				}
				return {
					value: '',
					label: ''
				};
			});
			if (valueChanged(initialValue, initialSelectedOptions)) {
				return current || [];
			}
			return initialSelectedOptions;
		} else if (value && valueChanged(value, current)) {
			const controlledOptions = value.map((valueId) => {
				const items = getOrRead(template, options());
				if (items) {
					const findResult = find(items, (item) => item.value === valueId);
					if (findResult) {
						return findResult;
					}
				}
				return {
					value: '',
					label: ''
				};
			});
			if (valueChanged(value, controlledOptions)) {
				return current || [];
			}
			return controlledOptions;
		}
		return current || [];
	});

	const chips = selectedOptions.map(({ value, label }, index) => {
		return (
			<Chip
				theme={theme.compose(
					chipCss,
					css,
					'selection'
				)}
				key={`value-${value}`}
				classes={{
					...classes,
					'@dojo/widgets/chip': {
						...classes['@dojo/widgets/chip'],
						root: [themeCss.value]
					}
				}}
				variant={variant}
				onClose={
					disabled
						? undefined
						: () => {
								const { onValue } = properties();
								const options = [...icache.getOrSet('options', [])];
								options.splice(index, 1);
								icache.set('options', options);
								onValue && onValue(options);
								focus.focus();
						  }
				}
			>
				{{
					label: selected ? selected(value, label) : label
				}}
			</Chip>
		);
	});

	const active = focused || selectedOptions.length > 0;

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themeCss.root,
				selectedOptions.length > 0 ? themeCss.hasValue : null,
				focused ? themeCss.focused : null,
				label ? themeCss.hasLabel : null
			]}
		>
			{label && (
				<Label
					focused={focused}
					active={active}
					theme={theme.compose(
						labelCss,
						css,
						'label'
					)}
					classes={{
						'@dojo/widgets/label': {
							root: [themeCss.label]
						}
					}}
					variant={variant}
				>
					{label}
				</Label>
			)}
			<Typeahead
				key="typeahead"
				theme={theme.compose(
					typeaheadCss,
					css,
					'input'
				)}
				variant={variant}
				strict={strict}
				itemsInView={itemsInView}
				position={position}
				name={name}
				focus={focus.shouldFocus}
				disabled={disabled}
				resource={resource({ template, options })}
				onValue={(value) => {
					const { onValue } = properties();
					const options = icache.set('options', (values = []) => {
						return [...values, value];
					});
					onValue && onValue(options);
					focus.focus();
				}}
				value=""
				onFocus={() => icache.set('focused', true)}
				onBlur={() => icache.set('focused', false)}
				classes={{
					'@dojo/widgets/text-input': {
						inputWrapper: [themeCss.inputWrapper],
						input: [themeCss.input],
						wrapper: [themeCss.wrapper]
					}
				}}
				itemDisabled={(item) => {
					const { duplicates = false, strict = true } = properties();
					const selected =
						icache
							.getOrSet('options', [])
							.findIndex((option) => option.value === item.value) !== -1;
					return item.disabled || (!duplicates && strict && selected);
				}}
			>
				{{
					items: (item, props) => {
						const selected =
							icache
								.getOrSet('options', [])
								.findIndex((option) => option.value === item.value) !== -1;

						if (items) {
							return items(
								{
									...item,
									selected
								},
								{
									...props,
									selected
								}
							);
						}

						return (
							<ListItem {...props} selected={selected}>
								<div classes={[themeCss.item, selected ? themeCss.selected : null]}>
									{item.label}
								</div>
							</ListItem>
						);
					},
					leading: placement === 'inline' ? chips : undefined
				}}
			</Typeahead>
			{placement === 'bottom' && <div classes={themeCss.values}>{chips}</div>}
		</div>
	);
});

export default ChipTypeahead;
