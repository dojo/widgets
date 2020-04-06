import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import { createDataMiddleware } from '@dojo/framework/core/middleware/data';
import Typeahead from '../typeahead';
import * as css from '../theme/default/multi-select-typeahead.m.css';
import { ItemRendererProperties, ListOption } from '../list';
import Chip from '../chip';
import Icon from '../icon';
import focus from '@dojo/framework/core/middleware/focus';
import * as typeaheadCss from '../theme/default/typeahead.m.css';
import * as chipCss from '../theme/default/chip.m.css';
import * as iconCss from '../theme/default/icon.m.css';
import * as labelCss from '../theme/default/label.m.css';
import { PopupPosition } from '@dojo/widgets/popup';
import { find } from '@dojo/framework/shim/array';
import Label from '../label';

export interface MultiSelectTypeaheadProperties {
	/** The initial selected value */
	initialValue?: string[];
	/** Callback called when user selects an option from the typeahead */
	onValue?: (value: string[]) => void;
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
	/** Placement of the selected values. Default is 'bottom' */
	placement?: 'inline' | 'bottom';
}

export interface MultiSelectTypeaheadChildren {
	/** Adds a <label> element with the supplied text */
	label?: RenderResult;
	/** Custom renderer for item contents */
	items?: (properties: ItemRendererProperties) => RenderResult;
	/** Custom renderer for selected items */
	selected?: (value: string, label?: string) => RenderResult;
}

export interface MultiSelectTypeaheadIcache {
	initialValue: string[];
	value: string[];
	focused: boolean;
}

const factory = create({
	icache: createICacheMiddleware<MultiSelectTypeaheadIcache>(),
	theme,
	data: createDataMiddleware<ListOption>(),
	focus
})
	.properties<MultiSelectTypeaheadProperties>()
	.children<MultiSelectTypeaheadChildren>();

export function arraysDifferent(arr1: string[], arr2: string[]): boolean {
	if (arr1.length !== arr2.length) {
		return true;
	}

	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return true;
		}
	}

	return false;
}

export const MultiSelectTypeahead = factory(function MultiSelectTypeahead({
	middleware: { icache, theme, focus, data },
	properties,
	children
}) {
	const {
		initialValue = [],
		resource,
		transform,
		disabled,
		itemsInView,
		position,
		name,
		placement = 'inline'
	} = properties();
	const [{ label, items, selected } = {} as MultiSelectTypeaheadChildren] = children();
	const themeCss = theme.classes(css);
	const { value } = properties();
	const { get, getOptions } = data();
	const focused = icache.getOrSet('focused', false);

	if (value !== undefined && arraysDifferent(value || [], icache.get('value') || [])) {
		icache.set('value', value || []);
	}

	if (value === undefined && arraysDifferent(icache.getOrSet('initialValue', []), initialValue)) {
		icache.set('value', initialValue);
		icache.set('initialValue', initialValue);
	}

	const currentOptions = get(getOptions());
	const chips = icache.getOrSet('value', []).map((value) => {
		let option = find(currentOptions || [], (option) => option.value === value);

		return (
			<Chip
				theme={theme.compose(
					css,
					chipCss
				)}
				key={`value-${value}`}
				classes={{
					'@dojo/widgets/chip': {
						root: [themeCss.value]
					}
				}}
				onClose={
					disabled
						? undefined
						: () => {
								const { onValue } = properties();
								const values = [...icache.getOrSet('value', [])];

								const valueIndex = values.indexOf(value);

								if (valueIndex >= 0) {
									values.splice(valueIndex, 1);
									icache.set('value', values);

									onValue && onValue(values);
								}

								focus.focus();
						  }
				}
			>
				{{
					label: selected
						? selected(value, option && option.label)
						: (option && option.label) || value
				}}
			</Chip>
		);
	});

	const values = icache.getOrSet('value', []);
	const active = focused || values.length > 0;

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themeCss.root,
				values.length > 0 ? themeCss.hasValue : null,
				focused ? themeCss.focused : null,
				label ? themeCss.hasLabel : null
			]}
		>
			{label && (
				<Label
					focused={focused}
					active={active}
					theme={theme.compose(
						css,
						labelCss
					)}
					classes={{
						'@dojo/widgets/label': {
							root: [themeCss.label]
						}
					}}
				>
					{label}
				</Label>
			)}
			<Typeahead
				key="typeahead"
				theme={theme.compose(
					css,
					typeaheadCss
				)}
				itemsInView={itemsInView}
				position={position}
				name={name}
				focus={focus.shouldFocus}
				disabled={disabled}
				resource={resource}
				onValue={(value) => {
					const { onValue } = properties();

					const values = [...icache.getOrSet('value', [])];
					const valueIndex = values.indexOf(value);

					if (valueIndex === -1) {
						icache.set('value', [...values, value]);
					} else {
						values.splice(valueIndex, 1);
						icache.set('value', values);
					}

					focus.focus();

					onValue && onValue(icache.get('value') || []);
				}}
				transform={transform}
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
			>
				{{
					items: (item: ItemRendererProperties) => {
						const selected = icache.getOrSet('value', []).indexOf(item.value) !== -1;

						if (items) {
							return items({
								...item,
								selected
							});
						}

						return (
							<div classes={[themeCss.item, selected ? themeCss.selected : null]}>
								{selected ? (
									<Icon
										type="checkIcon"
										theme={theme.compose(
											css,
											iconCss
										)}
										classes={{
											'@dojo/widgets/icon': {
												icon: [themeCss.selectedIcon]
											}
										}}
									/>
								) : null}
								{item.label || item.value}
							</div>
						);
					},
					leading: placement === 'inline' ? chips : undefined
				}}
			</Typeahead>
			{placement === 'bottom' && <div classes={themeCss.values}>{chips}</div>}
		</div>
	);
});

export default MultiSelectTypeahead;
