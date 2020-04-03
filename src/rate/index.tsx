import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import focus from '@dojo/framework/core/middleware/focus';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Icon from '../icon';
import Radio from '../radio';
import RadioGroup, { RadioGroupChildren } from '../radio-group';
import theme from '../middleware/theme';
import * as baseCss from '../common/styles/base.m.css';
import * as iconCss from '../theme/default/icon.m.css';
import * as radioCss from '../theme/default/radio.m.css';
import * as radioGroupCss from '../theme/default/radio-group.m.css';
import * as css from '../theme/default/rate.m.css';
import bundle from './nls/Rate';

export interface RateProperties {
	/** The name attribute for this rating group */
	name: string;
	/** The initial rating value */
	initialValue?: number;
	/** Callback fired when the rating value changes */
	onValue?: (value?: number) => void;
	/** The highest rating for this rating group */
	max?: number;
	/** Allow undefined to be chosen with repeat click or with arrows */
	allowClear?: boolean;
	/** Allow half values to be used */
	allowHalf?: boolean;
	/** Prevent interaction with a visual indication */
	disabled?: boolean;
	/** Prevent interaction */
	readOnly?: boolean;
}

export interface RateChildren {
	label?: RenderResult;
	character?: (filled: boolean, integer: number) => RenderResult;
}

interface RateICache {
	selected?: number;
}

const icache = createICacheMiddleware<RateICache>();

type RadioChecked = (checked?: boolean) => boolean | undefined;

const factory = create({ focus, i18n, icache, theme })
	.properties<RateProperties>()
	.children<RateChildren | undefined>();

export const Rate = factory(function Rate({
	id,
	children,
	properties,
	middleware: { focus, i18n, icache, theme }
}) {
	const { format } = i18n.localize(bundle);
	const themeCss = theme.classes(css);
	const {
		name,
		initialValue,
		onValue,
		max = 5,
		allowClear,
		allowHalf,
		disabled,
		readOnly
	} = properties();
	const interaction = !disabled && !readOnly;
	const [{ character, label } = {} as RateChildren] = children();
	const selected = icache.getOrSet('selected', initialValue);
	const shouldFocus = focus.shouldFocus();

	const _onValue = (value?: string) => {
		if (!value) {
			icache.set('selected', undefined);
			onValue && onValue();
		} else {
			const decimal = parseFloat(value);
			icache.set('selected', decimal);
			onValue && onValue(decimal);
		}
	};

	const createOption = (value?: number) => ({
		value: `${value === undefined ? '' : value}`,
		label: format('starLabels', { rating: value || 0 })
	});
	const options = [];
	if (allowClear) {
		options.push(createOption());
	}
	for (let integer = 0; integer < max; integer++) {
		allowHalf && options.push(createOption(integer + 0.5));
		options.push(createOption(integer + 1));
	}

	const renderIcon = (filled: boolean, value: number) =>
		character ? (
			character(filled, Math.ceil(value))
		) : (
			<Icon
				theme={theme.compose(
					iconCss,
					css,
					'icon'
				)}
				type="starIcon"
			/>
		);

	const renderLabel = (value: number) => (
		<virtual>
			<span key="radioLabel" classes={baseCss.visuallyHidden}>
				{format('starLabels', { rating: value })}
			</span>
			<span classes={[themeCss.on, themeCss.filled]}>{renderIcon(true, value)}</span>
			<span classes={[themeCss.off, themeCss.empty]}>{renderIcon(false, value)}</span>
		</virtual>
	);

	const renderRadio = (value: number, forId: string, checked: RadioChecked, label: DNode) => (
		<Radio
			widgetId={forId}
			key="radio"
			name={name}
			focus={() => false}
			checked={checked()}
			disabled={!interaction}
			onValue={checked}
			theme={theme.compose(
				radioCss,
				css,
				'radio'
			)}
			classes={{
				'@dojo/widgets/radio': {
					inputWrapper: [baseCss.visuallyHidden]
				},
				'@dojo/widgets/label': {
					root: [themeCss.labelRoot]
				}
			}}
			label={label}
		/>
	);

	const renderCharacter = (value: number, clear: RadioChecked, radio: RenderResult) => (
		<div
			key={`${value === 0 ? '' : value}`}
			classes={[
				themeCss.character,
				selected && value === selected ? themeCss.selectedCharacter : null
			]}
			onclick={() => interaction && allowClear && value === selected && clear(true)}
		>
			{radio}
		</div>
	);

	const renderInteger = (integer: number, radios: RenderResult) => (
		<div
			key={integer}
			classes={[
				themeCss.integer,
				themeCss.star,
				selected && Math.ceil(selected) === integer ? themeCss.selectedInteger : null
			]}
		>
			{radios}
		</div>
	);

	const renderChildren: RadioGroupChildren['radios'] = (name, middleware, options) => {
		const radioIntegers: DNode[][] = [];
		for (const option of options) {
			const value = parseFloat(option.value) || 0;
			const key = option.value ? `${value}` : '';
			const label = renderLabel(value);
			const radio = renderRadio(
				value,
				`${id}-${name}-${key}`,
				middleware(key).checked,
				label
			);
			const step = renderCharacter(value, middleware('').checked, radio);
			const integer = Math.ceil(value);
			(radioIntegers[integer] = radioIntegers[integer] || []).push(step);
		}

		return radioIntegers.reduce((nodes, radios, integer) => {
			nodes.push(renderInteger(integer, radios));
			return nodes;
		}, []);
	};

	return (
		<div
			key="root"
			tabIndex={0}
			focus={shouldFocus}
			classes={[
				theme.variant(),
				themeCss.root,
				themeCss.hoverable,
				selected === undefined ? themeCss.unselected : null,
				allowHalf ? themeCss.halfCharacters : null,
				readOnly ? themeCss.readOnly : null,
				disabled ? themeCss.disabled : null
			]}
		>
			<RadioGroup
				key="radioGroup"
				initialValue={`${initialValue}`}
				name={name}
				onValue={_onValue}
				options={options}
				theme={theme.compose(
					radioGroupCss,
					css,
					'group'
				)}
			>
				{{ label, radios: renderChildren }}
			</RadioGroup>
		</div>
	);
});

export default Rate;
