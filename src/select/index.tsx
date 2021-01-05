import { RenderResult } from '@dojo/framework/core/interfaces';
import { focus } from '@dojo/framework/core/middleware/focus';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { createResourceMiddleware, ResourceMeta } from '@dojo/framework/core/middleware/resources';
import { uuid } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';
import { Keys } from '../common/util';
import HelperText from '../helper-text';
import Icon from '../icon';
import Label from '../label';
import {
	ItemRendererProperties,
	List,
	ListOption,
	ListItemProperties,
	MenuItemProperties
} from '../list';
import theme from '../middleware/theme';
import { PopupPosition } from '../popup';
import TriggerPopup from '../trigger-popup';
import * as listCss from '../theme/default/list.m.css';
import * as labelCss from '../theme/default/label.m.css';
import * as iconCss from '../theme/default/icon.m.css';
import * as css from '../theme/default/select.m.css';
import bundle from './nls/Select';
import LoadingIndicator from '../loading-indicator';

export interface SelectProperties {
	/** Callback called when user selects a value */
	onValue(value: ListOption): void;
	/** The initial selected value */
	initialValue?: string;
	/** Controlled value property */
	value?: string;
	/** Property to determine how many items to render. Defaults to 6 */
	itemsInView?: number;
	/** placement of the select menu; 'above' or 'below' */
	position?: PopupPosition;
	/** Placeholder value to show when nothing has been selected */
	placeholder?: string;
	/** Property to determine if the input is disabled */
	disabled?: boolean;
	/** Sets the helper text of the input */
	helperText?: string;
	/** Boolean to indicate if field is required */
	required?: boolean;
	/** Callabck when valid state has changed */
	onValidate?(valid: boolean): void;
	/** The name property of the input */
	name?: string;
}

export interface SelectChildren {
	/** Custom renderer for item contents */
	items?(
		item: ItemRendererProperties,
		props: ListItemProperties & MenuItemProperties
	): RenderResult;
	/** The label to show */
	label?: RenderResult;
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
	meta?: ResourceMeta;
}

const icache = createICacheMiddleware<SelectICache>();

const factory = create({
	icache,
	focus,
	theme,
	i18n,
	resource: createResourceMiddleware<ListOption>()
})
	.properties<SelectProperties>()
	.children<SelectChildren | undefined>();

export const Select = factory(function Select({
	id,
	children,
	properties,
	middleware: { icache, focus, theme, i18n, resource }
}) {
	const { createOptions, isLoading, meta, find } = resource;
	const {
		classes,
		variant,
		theme: themeProp,
		disabled,
		helperText,
		initialValue,
		itemsInView = 6,
		onValidate,
		onValue,
		placeholder = '',
		position,
		required,
		name,
		resource: { template, options = createOptions(id) }
	} = properties();
	const [{ items, label } = { items: undefined, label: undefined }] = children();
	let { value } = properties();

	if (value === undefined) {
		if (initialValue !== undefined && initialValue !== icache.get('initial')) {
			icache.set('initial', initialValue);
			icache.set('value', initialValue);
		}
		value = icache.get('value');
	}

	const menuId = icache.getOrSet('menuId', uuid());
	const triggerId = icache.getOrSet('triggerId', uuid());
	const focusNode = icache.getOrSet('focusNode', 'trigger');
	const shouldFocus = focus.shouldFocus();
	const themedCss = theme.classes(css);
	let valid = icache.get('valid');
	const dirty = icache.get('dirty');
	const { messages } = i18n.localize(bundle);
	const expanded = icache.get('expanded');
	const metaInfo = icache.set('meta', (current) => {
		const newMeta = meta(template, options(), true);
		return newMeta || current;
	});

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
				theme.variant(),
				themedCss.root,
				disabled && themedCss.disabled,
				valid === true && themedCss.valid,
				valid === false && themedCss.invalid,
				shouldFocus === true && themedCss.focused,
				expanded && themedCss.expanded
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
					variant={variant}
					disabled={disabled}
					forId={triggerId}
					valid={valid}
					required={required}
					active={!!(value || icache.get('expanded'))}
					focused={shouldFocus}
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
				theme={themeProp}
				classes={classes}
				variant={variant}
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

						let valueOption: ListOption | undefined;
						if (value && metaInfo) {
							valueOption = (
								find(template, {
									options: options(),
									start: 0,
									query: { value },
									type: 'exact'
								}) || {
									item: undefined
								}
							).item;
						}

						return (
							<button
								name={name}
								value={value}
								focus={() => focusNode === 'trigger' && shouldFocus}
								aria-controls={menuId}
								aria-haspopup="listbox"
								aria-expanded={
									icache.getOrSet('expanded', false) ? 'true' : 'false'
								}
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
								<span
									classes={[themedCss.value, expanded && themedCss.valueExpanded]}
								>
									{(valueOption && valueOption.label) || value || (
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
										variant={variant}
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

						return metaInfo === undefined && isLoading(template, options()) ? (
							<LoadingIndicator
								key="loading"
								theme={themeProp}
								variant={variant}
								classes={classes}
							/>
						) : (
							<div key="menu-wrapper" classes={themedCss.menuWrapper}>
								<List
									key="menu"
									height="auto"
									focus={() => focusNode === 'menu' && shouldFocus}
									resource={resource({ template, options })}
									onValue={(value) => {
										focus.focus();
										closeMenu();
										value.value !== icache.get('value') &&
											icache.set('value', value.value);
										onValue(value);
									}}
									onRequestClose={closeMenu}
									onBlur={closeMenu}
									initialValue={value}
									itemsInView={itemsInView}
									theme={theme.compose(
										listCss,
										css,
										'menu'
									)}
									classes={classes}
									variant={variant}
									widgetId={menuId}
								>
									{items}
								</List>
							</div>
						);
					}
				}}
			</TriggerPopup>
			<HelperText
				key="helperText"
				text={valid === false ? messages.requiredMessage : helperText}
				valid={valid}
				classes={classes}
				variant={variant}
				theme={themeProp}
			/>
		</div>
	);
});

export default Select;
