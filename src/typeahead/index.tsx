import { create, tsx } from '@dojo/framework/core/vdom';
import { PopupPosition } from '@dojo/widgets/popup';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { createDataMiddleware } from '@dojo/framework/core/middleware/data';
import List, { ItemRendererProperties, ListOption } from '../list';
import theme from '../middleware/theme';
import focus from '@dojo/framework/core/middleware/focus';
import * as css from '../theme/default/typeahead.m.css';
import Label from '../label';
import * as labelCss from '../theme/default/label.m.css';
import TriggerPopup from '../trigger-popup';
import { find } from '@dojo/framework/shim/array';
import TextInput from '../text-input';
import bundle from '../select/select.nls';
import i18n from '@dojo/framework/core/middleware/i18n';
import HelperText from '../helper-text';
import * as listCss from '../theme/default/list.m.css';
import { Keys } from '../common/util';
import LoadingIndicator from '../loading-indicator';
import * as inputCss from '../theme/default/text-input.m.css';

export interface TypeaheadProperties {
	/** Callback called when user selects a value */
	onValue(value: string): void;
	/** The initial selected value */
	initialValue?: string;
	/** Property to determine how many items to render. Defaults to 6 */
	itemsInView?: number;
	/** Placement of the select menu; 'above' or 'below' */
	position?: PopupPosition;
	/** Property to determine if the input is disabled */
	disabled?: boolean;
	/** Sets the helper text of the input */
	helperText?: string;
	/** The label to show */
	label?: RenderResult;
	/** Boolean to indicate if field is required */
	required?: boolean;
	/** Callback when valid state has changed */
	onValidate?(valid?: boolean): void;
	/** The name property of the input */
	name?: string;
}

export interface TypeaheadICache {
	value: string;
	activeIndex: number;
	dirty: boolean;
	expanded: boolean;
	focusNode: string;
	initial: string;
	valid: boolean;
}

export interface SelectChildren {
	/** Custom renderer for item contents */
	(properties: ItemRendererProperties): RenderResult;
}

const factory = create({
	icache: createICacheMiddleware<TypeaheadICache>(),
	data: createDataMiddleware<ListOption>(),
	theme,
	focus,
	i18n
})
	.properties<TypeaheadProperties>()
	.children<SelectChildren | undefined>();

export const Typeahead = factory(function Typeahead({
	id,
	properties,
	children,
	middleware: { icache, data, theme, focus, i18n }
}) {
	const {
		initialValue,
		disabled,
		label,
		required,
		position,
		name,
		helperText,
		itemsInView,
		transform,
		onValidate
	} = properties();
	const themedCss = theme.classes(css);
	const { messages } = i18n.localize(bundle);
	const { get, getOptions, setOptions, shared, getTotal, isLoading } = data();
	const sharedResource = shared();

	const [itemRenderer] = children();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
	}

	let valid = icache.get('valid');
	const value = icache.get('value');
	const listId = `typeahead-list-${id}`;
	const triggerId = `typeahead-trigger-${id}`;
	const dirty = icache.get('dirty');

	if (required && dirty) {
		const isValid = Boolean(value);
		if (isValid !== valid) {
			icache.set('valid', isValid);
			valid = isValid;
			onValidate && onValidate(isValid);
		}
	}

	function onKeyDown(
		event: number,
		preventDefault: () => void,
		onOpen: () => boolean,
		onClose: () => void
	) {
		const activeIndex = icache.getOrSet('activeIndex', 0);
		const total = getTotal(getOptions()) || 0;

		switch (event) {
			case Keys.Escape:
				onClose();
				break;
			case Keys.Down:
				preventDefault();
				if (!onOpen()) {
					icache.set('activeIndex', (activeIndex + 1) % total);
				}
				break;
			case Keys.Up:
				preventDefault();
				if (!onOpen()) {
					icache.set('activeIndex', (activeIndex - 1 + total) % total);
				}
				break;
			case Keys.Enter:
				preventDefault();

				const allItems = get({ query: getOptions().query }) as ListOption[];
				if (allItems && allItems.length >= activeIndex) {
					const activeItem = allItems[activeIndex];
					if (!activeItem.disabled) {
						const { onValue } = properties();

						icache.set('value', activeItem.value);
						onClose();
						onValue(activeItem.value);
					}
				}
				break;
		}
	}

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themedCss.root,
				disabled && themedCss.disabled,
				valid === true && themedCss.valid,
				valid === false && themedCss.invalid
			]}
		>
			{label && (
				<Label
					key="label"
					theme={theme.compose(
						labelCss,
						css,
						'label'
					)}
					disabled={disabled}
					valid={valid}
					required={required}
					active={!!(value || icache.get('expanded'))}
				>
					{label}
				</Label>
			)}
			<TriggerPopup
				key="popup"
				onOpen={() => icache.set('expanded', true)}
				onClose={() => {
					icache.set('expanded', false);
					if (!icache.get('dirty')) {
						icache.set('dirty', true);
					}
				}}
				position={position}
			>
				{{
					trigger: (toggleOpen) => {
						function openMenu() {
							const { disabled } = properties();

							if (!disabled && !icache.get('expanded')) {
								toggleOpen();
								icache.set('expanded', true);
								icache.set('activeIndex', 0);
								return true;
							}

							return false;
						}

						function closeMenu() {
							if (icache.get('expanded')) {
								toggleOpen();
								icache.set('expanded', false);
							}
						}

						let valueOption: ListOption | undefined;
						const currentOptions = get(getOptions());
						if (currentOptions && currentOptions.length) {
							valueOption = find(currentOptions, (option) => option.value === value);
						}

						return (
							<TextInput
								onValue={(value) => {
									if (value !== icache.get('value')) {
										openMenu();

										setOptions({ query: { value: value } });
										icache.set('value', value || '');
									}
								}}
								theme={theme.compose(
									inputCss,
									css,
									'input'
								)}
								onBlur={() => {
									closeMenu();
								}}
								name={name}
								initialValue={valueOption ? valueOption.label : value}
								focus={() =>
									icache.get('focusNode') === 'trigger' && focus.shouldFocus()
								}
								aria={{
									controls: listId,
									haspopup: 'listbox',
									expanded: `${icache.getOrSet('expanded', false)}`
								}}
								key="trigger"
								widgetId={triggerId}
								disabled={disabled}
								classes={{
									'@dojo/widgets/text-input': {
										root: [themedCss.trigger]
									}
								}}
								onClick={openMenu}
								onKeyDown={(event, preventDefault) => {
									onKeyDown(event, preventDefault, openMenu, closeMenu);
								}}
								valid={valid}
							/>
						);
					},
					content: (toggleClosed) => {
						function closeMenu() {
							icache.set('focusNode', 'trigger');
							toggleClosed();
						}

						return isLoading(getOptions()) ? (
							<LoadingIndicator key="loading" />
						) : (
							<div key="menu-wrapper" classes={themedCss.menuWrapper}>
								<List
									key="menu"
									focusable={false}
									activeIndex={icache.get('activeIndex')}
									resource={sharedResource}
									transform={transform}
									onValue={(value) => {
										const { onValue } = properties();
										focus.focus();
										closeMenu();
										value !== icache.get('value') && icache.set('value', value);
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
									widgetId={listId}
								>
									{itemRenderer}
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
			/>
		</div>
	);
});

export default Typeahead;
