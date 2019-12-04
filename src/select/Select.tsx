import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { theme } from '@dojo/framework/core/middleware/theme';
import { focus } from '@dojo/framework/core/middleware/focus';
import { Menu, MenuOption, ItemRendererProperties } from '../menu';
import { uuid } from '@dojo/framework/core/util';

import * as css from './Select.m.css';
import { Keys } from '../common/util';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { Popup, PopupPosition } from '../popup';
import Label from '../label';
import HelperText from '../helper-text';
import Icon from '../icon';

interface SelectProperties {
	/** Callback called when user selects a value */
	onValue(value: string): void;
	/** The initial selected value */
	initialValue?: string;
	/** Options to display within the menu */
	options: MenuOption[];
	/** Property to determine how many items to render. Defaults to 6 */
	numberInView?: number;
	/** Custom renderer for item contents */
	itemRenderer?(properties: ItemRendererProperties): RenderResult;
	/** placement of the select menu; 'above' or 'below' */
	position?: PopupPosition;
	/** Placeholder value to show when nothing has been selected */
	placeholder?: string;
	/** Property to determine if the input is disabled */
	disabled?: boolean;
	/** Sets the helper text of the input */
	helperText?: string;
	/** The label to show */
	label?: RenderResult;
}

interface SelectICache {
	initial: string;
	value: string;
	id: string;
	expanded: boolean;
}

const icache = createICacheMiddleware<SelectICache>();

const factory = create({ icache, focus, theme }).properties<SelectProperties>();

export const Select = factory(function Select({
	properties,
	middleware: { icache, focus, theme }
}) {
	const {
		options,
		onValue,
		initialValue,
		numberInView = 6,
		itemRenderer,
		position,
		placeholder = '',
		label,
		disabled,
		classes,
		helperText,
		theme: themeProp
	} = properties();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
	}

	const value = icache.getOrSet('value', placeholder);
	const id = icache.getOrSet('id', uuid());

	const shouldFocus = focus.shouldFocus();

	return (
		<div classes={[css.root, disabled && css.disabled]} key="root">
			{label && (
				<Label theme={themeProp} classes={classes} disabled={disabled} forId={id}>
					{label}
				</Label>
			)}
			<Popup
				key="popup"
				onOpen={() => {
					icache.set('expanded', true);
				}}
				onClose={() => {
					icache.set('expanded', false);
				}}
				position={position}
			>
				{{
					trigger: (toggleOpen) => {
						function openMenu() {
							if (!disabled) {
								focus.focus();
								toggleOpen();
							}
						}

						return (
							<button
								aria-controls={id}
								aria-haspopup="listbox"
								aria-expanded={icache.getOrSet('expanded', false)}
								key="trigger"
								type="button"
								disabled={disabled}
								classes={css.trigger}
								onclick={openMenu}
								onkeydown={(event) => {
									if (
										event.which === Keys.Down ||
										event.which === Keys.Space ||
										event.which === Keys.Enter
									) {
										openMenu();
									}
								}}
							>
								<span classes={css.value}>{value}</span>
								<span classes={css.arrow}>
									<Icon type="downIcon" theme={theme} classes={classes} />
								</span>
							</button>
						);
					},
					content: (closeMenu) => (
						<div key="menu-wrapper" classes={css.menuWrapper}>
							<Menu
								key="menu"
								focus={() => shouldFocus}
								options={options}
								onValue={(value: string) => {
									closeMenu();
									value !== icache.get('value') && icache.set('value', value);
									onValue(value);
								}}
								onRequestClose={closeMenu}
								onBlur={closeMenu}
								initialValue={value}
								itemsInView={numberInView}
								itemRenderer={itemRenderer}
								listBox
								widgetId={id}
							/>
						</div>
					)
				}}
			</Popup>
			<HelperText key="helperText" text={helperText} />
		</div>
	);
});

export default Select;
