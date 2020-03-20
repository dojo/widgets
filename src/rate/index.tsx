import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import { uuid } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';
import focus from '@dojo/framework/core/middleware/focus';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Icon from '@dojo/widgets/icon';
import Radio from '@dojo/widgets/radio';
import RadioGroup from '@dojo/widgets/radio-group';
import * as baseCss from '../common/styles/base.m.css';
import theme from '../middleware/theme';
import * as css from '../theme/default/rate.m.css';
import bundle from './nls/Rate';

export interface MixedNumber {
	quotient: number;
	numerator: number;
	denominator: number;
}

export interface RateProperties {
	/** The name attribute for this rating group */
	name: string;
	/** The label to be displayed in the legend */
	label?: string;
	/** The id used for the radio input elements */
	widgetId?: string;
	/** The initial rating value */
	initialValue?: number;
	/** Callback fired when the rating value changes */
	onValue?: (value?: number, mixedValue?: MixedNumber) => void;
	steps?: number;
	max?: number;
	allowClear?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
}

export interface RateChildren {
	(fill: boolean, integer: number, selected?: number, over?: number): RenderResult;
}

interface RateState {
	hover: string;
	hovering: boolean;
	selectedInteger?: number;
	selectedStep?: number;
	focused: boolean;
}

const icache = createICacheMiddleware<RateState>();

function mixedNumber(integer: number, step: number, steps: number) {
	if (step === steps) {
		step = 0;
	} else {
		integer -= 1;
	}
	return { quotient: integer, numerator: step, denominator: steps };
}

const factory = create({ focus, i18n, icache, theme })
	.properties<RateProperties>()
	.children<RateChildren | undefined>();

export const Rate = factory(function Rate({
	children,
	properties,
	middleware: { focus, i18n, icache, theme }
}) {
	const { format } = i18n.localize(bundle);
	const {
		root,
		active,
		disabled: disabledClasses,
		readOnly: readOnlyClasses,
		label: labelClasses,
		radioGroup,
		radio,
		characterWrapper,
		characterFill,
		partialCharacter,
		partialRadio
	} = theme.classes(css);
	const _uuid = uuid();
	const {
		name,
		label,
		initialValue: initialNumber = undefined,
		onValue,
		max = 5,
		steps: stepsLength = 1,
		widgetId = _uuid,
		allowClear = false,
		disabled = false,
		readOnly = false
	} = properties();
	const interaction = !disabled && !readOnly;
	const initialStep = initialNumber ? Math.round((initialNumber % 1) * stepsLength) : undefined;
	const initialInteger = initialNumber ? Math.ceil(initialNumber) : undefined;
	const initialValue = initialNumber
		? `${initialInteger}-${initialStep || stepsLength}`
		: undefined;
	const character = children()[0];
	const hovering = icache.getOrSet('hovering', false);
	const selectedInteger = icache.getOrSet('selectedInteger', initialInteger);
	const selectedStep = icache.getOrSet('selectedStep', initialStep);
	const shouldFocus = hovering ? focus.shouldFocus() : icache.getOrSet('focused', false);

	const integers: number[] = [];
	const steps: number[] = [];
	for (let step = 1; step <= stepsLength; step++) {
		steps.push(step);
	}
	const options = [];
	if (allowClear) {
		integers.push(0);
		options.push({
			value: '',
			label: format('starLabels', { quotient: 0, numerator: 0, denominator: 1 })
		});
	}
	for (let integer = 1; integer <= max; integer++) {
		integers.push(integer);
		for (const step of steps) {
			options.push({
				value: `${integer}-${step}`,
				label: format('starLabels', mixedNumber(integer, step, stepsLength))
			});
		}
	}

	const onFocus = () => icache.set('focused', true);
	const onBlur = () => icache.set('focused', false);

	const _onValue = (value?: string) => {
		if (!value) {
			icache.set('selectedInteger', undefined);
			icache.set('selectedStep', undefined);
			onValue && onValue();
		} else {
			const [integer, step] = value.split('-').map((num) => +num);
			const mixed = mixedNumber(integer, step, stepsLength);
			icache.set('selectedInteger', integer);
			icache.set('selectedStep', step);
			onValue && onValue(mixed.quotient + mixed.numerator / mixed.denominator, mixed);
		}
		focus.focus();
	};

	return (
		<div
			classes={[root, readOnly ? readOnlyClasses : null, disabled ? disabledClasses : null]}
			onpointerenter={() => interaction && icache.set('hovering', true)}
			onpointerleave={() => interaction && icache.set('hovering', false)}
		>
			<RadioGroup
				initialValue={initialValue}
				label={label}
				name={name}
				onValue={_onValue}
				options={options}
				classes={{
					'@dojo/widgets/radio-group': {
						root: [
							radioGroup,
							shouldFocus && allowClear && selectedInteger === undefined
								? active
								: null
						]
					}
				}}
				renderer={(name, middleware) => {
					const [hoverInteger, hoverStep] = icache
						.getOrSet('hover', '0-0')
						.split('-')
						.map((num) => +num);

					return integers.map((integer) => {
						const selected =
							selectedInteger !== undefined && selectedStep !== undefined
								? selectedInteger - 1 + selectedStep / stepsLength
								: undefined;

						const radios: DNode[] = [];
						steps.forEach((step) => {
							if (integer === 0 && step !== stepsLength) {
								return;
							}

							const key = integer === 0 ? '' : `${integer}-${step}`;
							const id = `${widgetId}-${name}-${key}`;
							const { checked } = middleware(key);
							const activeInteger =
								shouldFocus || !hovering ? selectedInteger : hoverInteger;
							const activeStep = shouldFocus || !hovering ? selectedStep : hoverStep;
							const over =
								hovering && !shouldFocus
									? hoverInteger - 1 + hoverStep / stepsLength
									: undefined;
							let fill = activeInteger !== undefined && integer <= activeInteger;
							const styles: Partial<CSSStyleDeclaration> = {};
							const classes: string[] = [];
							const radioClasses: string[] = [];
							if (stepsLength > 1) {
								if (step > 1) {
									classes.push(partialCharacter);
									radioClasses.push(partialRadio);
									styles.width = `${((stepsLength - step + 1) / stepsLength) *
										100}%`;
									if (integer === activeInteger && activeStep !== undefined) {
										fill = step <= activeStep;
									}
								}
							}

							radios.push(
								<div
									key={key}
									styles={styles}
									classes={classes}
									onpointerenter={() => interaction && icache.set('hover', key)}
									onclick={() =>
										interaction &&
										allowClear &&
										integer === selectedInteger &&
										step === selectedStep &&
										middleware('').checked(true)
									}
								>
									<Radio
										widgetId={id}
										name={name}
										checked={checked()}
										disabled={!interaction}
										onFocus={onFocus}
										onBlur={onBlur}
										onValue={checked}
										classes={{
											'@dojo/widgets/radio': {
												root: [radio, ...radioClasses],
												inputWrapper: [baseCss.visuallyHidden]
											},
											'@dojo/widgets/label': { root: [labelClasses] }
										}}
										label={
											<virtual>
												<span classes={baseCss.visuallyHidden}>
													{format(
														'starLabels',
														mixedNumber(integer, step, stepsLength)
													)}
												</span>
												{character ? (
													character(fill, integer, selected, over)
												) : (
													<Icon
														classes={{
															'@dojo/widgets/icon': {
																icon: [fill ? characterFill : null]
															}
														}}
														type="settingsIcon"
													/>
												)}
											</virtual>
										}
									/>
								</div>
							);
						});
						return (
							<div
								key={integer}
								classes={[
									characterWrapper,
									integer === 0 ? baseCss.visuallyHidden : null,
									shouldFocus &&
									(integer === selectedInteger ||
										(!allowClear &&
											selectedInteger === undefined &&
											integer === 1))
										? active
										: null
								]}
							>
								{radios}
							</div>
						);
					});
				}}
			/>
		</div>
	);
});

export default Rate;
