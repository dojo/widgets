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

export interface RateProperties {
	/** The name attribute for this rating group */
	name: string;
	/** The label to be displayed in the legend */
	label?: string;
	/** The id used for the radio input elements */
	widgetId?: string;
	initialValue?: number;
	onValue?: (value?: number) => void;
	steps?: number;
	max?: number;
	allowClear?: boolean;
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
		allowClear = false
	} = properties();
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
			label: format('starLabels', { index: 0 })
		});
	}
	for (let integer = 1; integer <= max; integer++) {
		integers.push(integer);
		for (const step of steps) {
			options.push({
				value: `${integer}-${step}`,
				label: format('starLabels', { index: integer })
			});
		}
	}

	const onFocus = () => icache.set('focused', true);
	const onBlur = () => icache.set('focused', false);

	const _onValue = (value?: string) => {
		let resolved;
		if (!value) {
			icache.set('selectedInteger', undefined);
			icache.set('selectedStep', undefined);
			resolved = undefined;
		} else {
			const [integer, step] = value.split('-').map((num) => +num);
			icache.set('selectedInteger', integer);
			icache.set('selectedStep', step);
			resolved = integer - 1 + step / stepsLength;
		}
		onValue && onValue(resolved);
		focus.focus();
	};

	return (
		<div
			classes={root}
			onpointerenter={() => icache.set('hovering', true)}
			onpointerleave={() => icache.set('hovering', false)}
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
									onpointerenter={() => icache.set('hover', key)}
									onclick={() =>
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
													{format('starLabels', {
														index: integer
													})}
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
