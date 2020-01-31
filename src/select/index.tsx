import { RenderResult } from '@dojo/framework/core/interfaces';
import { focus } from '@dojo/framework/core/middleware/focus';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { uuid } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';
import { Keys } from '../common/util';
import HelperText from '../helper-text';
import Icon from '../icon';
import Label from '../label';
import { ItemRendererProperties, Menu, MenuOption } from '../menu';
import theme from '../middleware/theme';
import { PopupPosition } from '../popup';
import TriggerPopup from '../trigger-popup';
import * as menuCss from '../theme/default/menu.m.css';
import * as labelCss from '../theme/default/label.m.css';
import * as iconCss from '../theme/default/icon.m.css';
import * as css from '../theme/default/select.m.css';
import bundle from './select.nls';

interface SelectProperties {
	/** Callback called when user selects a value */
	onValue(value: string): void;
	/** The initial selected value */
	initialValue?: string;
	/** Options to display within the menu */
	options: MenuOption[];
	/** Property to determine how many items to render. Defaults to 6 */
	itemsInView?: number;
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
	/** Boolean to indicate if field is required */
	required?: boolean;
	/** Callabck when valid state has changed */
	onValidate?(valid: boolean): void;
}

interface SelectICache {
	dirty: boolean;
	expanded: boolean;
	focusNode: string;
	initial: string;
	menuId: string;
	triggerId: string;
	valid: boolean;
	value: string;
}

const icache = createICacheMiddleware<SelectICache>();

const factory = create({ icache, focus, theme, i18n }).properties<SelectProperties>();

export const Select = factory(function Select({
	properties,
	middleware: { icache, focus, theme, i18n }
}) {
	const {
		classes,
		disabled,
		helperText,
		initialValue,
		itemRenderer,
		itemsInView = 6,
		label,
		onValidate,
		onValue,
		options,
		placeholder = '',
		position,
		required
	} = properties();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
	}

	const value = icache.get('value');
	const menuId = icache.getOrSet('menuId', uuid());
	const triggerId = icache.getOrSet('triggerId', uuid());
	const focusNode = icache.getOrSet('focusNode', 'trigger');
	const shouldFocus = focus.shouldFocus();
	const themedCss = theme.classes(css);
	let valid = icache.get('valid');
	const dirty = icache.get('dirty');
	const { messages } = i18n.localize(bundle);

	if (required && dirty) {
		const isValid = value !== undefined;
		if (isValid !== valid) {
			icache.set('valid', isValid);
			valid = isValid;
			onValidate && onValidate(isValid);
		}
	}

	return (
		<div
			classes={[
				themedCss.root,
				disabled && themedCss.disabled,
				valid === true && themedCss.valid,
				valid === false && themedCss.invalid
			]}
			key="root"
		>
			{label && (
				<Label
					theme={theme.compose(
						labelCss,
						css,
						'label'
					)}
					classes={classes}
					disabled={disabled}
					forId={triggerId}
					valid={valid}
					required={required}
					active={!!(value || icache.get('expanded'))}
				>
					{label}
				</Label>
			)}
			<TriggerPopup
				key="popup"
				onOpen={() => {
					icache.set('expanded', true);
				}}
				onClose={() => {
					icache.set('expanded', false);
					if (!dirty) {
						icache.set('dirty', true);
					}
				}}
				position={position}
			>
				{{
					trigger: (toggleOpen) => {
						function openMenu() {
							if (!disabled) {
								icache.set('focusNode', 'menu');
								focus.focus();
								toggleOpen();
							}
						}

						return (
							<button
								focus={() => focusNode === 'trigger' && shouldFocus}
								aria-controls={menuId}
								aria-haspopup="listbox"
								aria-expanded={icache.getOrSet('expanded', false)}
								key="trigger"
								type="button"
								id={triggerId}
								disabled={disabled}
								classes={themedCss.trigger}
								onclick={openMenu}
								onkeydown={(event) => {
									if (
										event.which === Keys.Down ||
										event.which === Keys.Space ||
										event.which === Keys.Enter
									) {
										event.preventDefault();
										openMenu();
									}
								}}
							>
								<span classes={themedCss.value}>
									{value || (
										<span classes={themedCss.placeholder}>{placeholder}</span>
									)}
								</span>
								<span classes={themedCss.arrow}>
									<Icon
										type="downIcon"
										theme={theme.compose(
											iconCss,
											css,
											'icon'
										)}
										classes={classes}
									/>
								</span>
							</button>
						);
					},
					content: (close) => {
						function closeMenu() {
							icache.set('focusNode', 'trigger');
							close();
						}

						return (
							<div key="menu-wrapper" classes={themedCss.menuWrapper}>
								<Menu
									key="menu"
									focus={() => focusNode === 'menu' && shouldFocus}
									options={options}
									total={options.length}
									onValue={(value: string) => {
										focus.focus();
										closeMenu();
										value !== icache.get('value') && icache.set('value', value);
										onValue(value);
									}}
									onRequestClose={closeMenu}
									onBlur={closeMenu}
									initialValue={value}
									itemsInView={itemsInView}
									itemRenderer={itemRenderer}
									theme={theme.compose(
										menuCss,
										css,
										'menu'
									)}
									classes={classes}
									listBox
									widgetId={menuId}
								/>
							</div>
						);
					}
				}}
			</TriggerPopup>
			<HelperText
				key="helperText"
				text={valid === false ? messages.requiredMessage : helperText}
				valid={valid}
			/>
		</div>
	);
});

export default Select;
