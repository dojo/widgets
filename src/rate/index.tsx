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

export interface MixedNumber {
	value: number;
	quotient: number;
	numerator: number;
	denominator: number;
}

export interface RateProperties {
	/** The name attribute for this rating group */
	name: string;
	/** The label to be displayed in the legend */
	label?: string;
	/** The initial rating value */
	initialValue?: number;
	/** Callback fired when the rating value changes */
	onValue?: (value?: number) => void;
	/** The number of times each star is divided */
	steps?: number;
	/** The highest rating for this rating group */
	max?: number;
	/** Allow undefined to be chosen with repeat click or with arrows */
	allowClear?: boolean;
	/** Prevent interaction with a visual indication */
	disabled?: boolean;
	/** Prevent interaction */
	readOnly?: boolean;
}

export interface RateChildren {
	(fill: boolean, integer: number, selected?: number, over?: number): RenderResult;
}

interface RateICache {
	hovering: boolean;
	hover: number;
	selected?: number;
	focused: boolean;
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
	const themedCss = theme.classes(css);
	const {
		name,
		label,
		initialValue,
		onValue,
		max = 5,
		steps = 1,
		allowClear,
		disabled,
		readOnly
	} = properties();
	const interaction = !disabled && !readOnly;
	const character = children()[0];
	const hovering = icache.getOrSet('hovering', false);
	const hover = icache.getOrSet('hover', 0);
	const selected = icache.getOrSet('selected', initialValue);
	const shouldFocus = hovering ? focus.shouldFocus() : icache.getOrSet('focused', false);

	const options = [];
	if (allowClear) {
		options.push({
			value: '',
			label: format('starLabels', { rating: 0 })
		});
	}
	for (let integer = 0; integer < max; integer++) {
		for (let step = 1; step <= steps; step++) {
			const value = integer + step / steps;
			options.push({
				value: `${value}`,
				label: format('starLabels', { rating: value })
			});
		}
	}

	const _onValue = (value?: string) => {
		if (!value) {
			icache.set('selected', undefined);
			onValue && onValue();
		} else {
			const decimal = parseFloat(value);
			icache.set('selected', decimal);
			onValue && onValue(decimal);
		}
		focus.focus();
	};

	const groupIsActive = shouldFocus && allowClear && selected === undefined;
	const over = hovering && !shouldFocus ? hover : undefined;
	const active = shouldFocus || !hovering ? selected : hover;

	const renderLabel = (value: number, fill: boolean) => (
		<virtual>
			<span key="radioLabel" classes={baseCss.visuallyHidden}>
				{format('starLabels', { rating: value })}
			</span>
			{character ? (
				character(fill, Math.ceil(value), selected, over)
			) : (
				<Icon
					theme={theme.compose(
						iconCss,
						css,
						'icon'
					)}
					classes={{
						'@dojo/widgets/icon': {
							icon: [
								fill ? themedCss.filled : null,
								over && Math.ceil(over) === Math.ceil(value) ? themedCss.over : null
							]
						}
					}}
					type="starIcon"
				/>
			)}
		</virtual>
	);

	const renderRadio = (forId: string, checked: RadioChecked, classes: string[], label: DNode) => (
		<Radio
			widgetId={forId}
			key="radio"
			name={name}
			checked={checked()}
			disabled={!interaction}
			onFocus={() => icache.set('focused', true)}
			onBlur={() => icache.set('focused', false)}
			onValue={checked}
			theme={theme.compose(
				radioCss,
				css,
				'radio'
			)}
			classes={{
				'@dojo/widgets/radio': {
					root: classes,
					inputWrapper: [baseCss.visuallyHidden]
				},
				'@dojo/widgets/label': {
					root: [themedCss.labelRoot]
				}
			}}
			label={label}
		/>
	);

	const renderStep = (
		value: number,
		styles: Partial<CSSStyleDeclaration>,
		classes: string[],
		clear: RadioChecked,
		radio: RenderResult
	) => (
		<div
			key={`${value === 0 ? '' : value}`}
			styles={styles}
			classes={classes}
			onpointerenter={() => interaction && icache.set('hover', value)}
			onclick={() => interaction && allowClear && value === selected && clear(true)}
		>
			{radio}
		</div>
	);

	const renderInteger = (integer: number, radios: RenderResult) => (
		<div
			key={integer}
			classes={[
				themedCss.characterWrapper,
				integer === 0 ? baseCss.visuallyHidden : null,
				shouldFocus &&
				(integer === (selected && Math.ceil(selected)) ||
					(!allowClear && selected === undefined && integer === 1))
					? themedCss.active
					: null
			]}
		>
			{radios}
		</div>
	);

	const renderChildren: RadioGroupChildren = (name, middleware, options) => {
		const radioIntegers: DNode[][] = [];
		for (const option of options) {
			const zero = option.value === '';
			const value = parseFloat(option.value) || 0;
			const integer = Math.ceil(value);
			const remainder = value % 1;
			const numerator = remainder === 0 ? steps : Math.round((value * steps) % steps);
			const key = zero ? '' : `${value}`;
			const forId = `${id}-${name}-${key}`;
			const { checked } = middleware(key);
			const { checked: clear } = middleware('');

			let fill = !zero && active !== undefined && value <= active;
			const styles: Partial<CSSStyleDeclaration> = {};
			const classes: string[] = [];
			const radioClasses: string[] = [];
			if (!zero && steps > 1 && numerator !== 1) {
				classes.push(themedCss.partialCharacter);
				radioClasses.push(themedCss.partialRadio);
				styles.width = `${((steps - numerator + 1) / steps) * 100}%`;
			}

			const label = renderLabel(value, fill);
			const radio = renderRadio(forId, checked, radioClasses, label);
			const step = renderStep(value, styles, classes, clear, radio);
			(radioIntegers[integer] = radioIntegers[integer] || []).push(step);
		}

		return (
			<div classes={[themedCss.groupWrapper, groupIsActive ? themedCss.active : null]}>
				{radioIntegers.reduce((nodes, radios, integer) => {
					nodes.push(renderInteger(integer, radios));
					return nodes;
				}, [])}
			</div>
		);
	};

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themedCss.root,
				readOnly ? themedCss.readOnly : null,
				disabled ? themedCss.disabled : null
			]}
			onpointerenter={() => interaction && icache.set('hovering', true)}
			onpointerleave={() => interaction && icache.set('hovering', false)}
		>
			<RadioGroup
				key="radioGroup"
				initialValue={`${initialValue}`}
				label={label}
				name={name}
				onValue={_onValue}
				options={options}
				theme={theme.compose(
					radioGroupCss,
					css,
					'radioGroup'
				)}
			>
				{renderChildren}
			</RadioGroup>
		</div>
	);
});

export default Rate;
