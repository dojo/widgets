import { RenderResult } from '@dojo/framework/core/interfaces';
import { uuid } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';
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
	onValue?: (value: number) => void;
	steps?: number;
	max?: number;
}

export interface RateChildren {
	(
		fill: boolean,
		index: number,
		selected: boolean,
		hovering: boolean,
		over: boolean
	): RenderResult;
}

interface RateState {
	hover: string;
	hovering: boolean;
}

const icache = createICacheMiddleware<RateState>();

const factory = create({ i18n, icache, theme })
	.properties<RateProperties>()
	.children<RateChildren | undefined>();

export const Rate = factory(function Rate({
	children,
	properties,
	middleware: { i18n, icache, theme }
}) {
	const { format } = i18n.localize(bundle);
	const { root, radio, characterWrapper, characterFill, partialCharacter } = theme.classes(css);
	const _uuid = uuid();
	const {
		name,
		label,
		initialValue = 0,
		onValue,
		max = 5,
		steps: stepsLength = 1,
		widgetId = _uuid
	} = properties();
	const character = children()[0];
	const hovering = icache.getOrSet('hovering', false);

	const integers: number[] = [0];
	const steps: number[] = [];
	for (let step = 1; step <= stepsLength; step++) {
		steps.push(step);
	}
	const options = [
		{
			value: '0-4',
			label: format('starLabels', { index: 0 })
		}
	];
	for (let integer = 1; integer <= max; integer++) {
		integers.push(integer);
		for (const step of steps) {
			options.push({
				value: `${integer}-${step}`,
				label: format('starLabels', { index: integer })
			});
		}
	}
	steps.reverse();

	console.log('options', options);

	const _onValue = (value: string) => {
		console.log(value);
		const [base, step] = value.split('-').map((num) => +num);
		const index = base - 1 + step / stepsLength;
		onValue && onValue(index);
	};

	return (
		<div
			classes={root}
			onpointerenter={() => icache.set('hovering', true)}
			onpointerleave={() => icache.set('hovering', false)}
		>
			<RadioGroup
				initialValue={`${initialValue}`}
				label={label}
				name={name}
				onValue={_onValue}
				options={options}
				renderer={(name, middleware) => {
					const [hoverInteger, hoverStep] = icache
						.getOrSet('hover', '0-0')
						.split('-')
						.map((num) => +num);
					console.log('hover', hoverInteger, hoverStep);

					return integers.map((integer) => {
						return (
							<div
								key={integer}
								classes={[
									characterWrapper,
									integer === 0 ? baseCss.visuallyHidden : null
								]}
								styles={{ overflow: 'hidden' }}
							>
								{steps.map((step, index, steps) => {
									const key = `${integer}-${step}`;
									const id = `${widgetId}-${name}-${key}`;
									const { checked, value: selectedValue } = middleware(key);
									const [selectedInteger, selectedStep] = (
										selectedValue() || '0-0'
									)
										.split('-')
										.map((num) => +num);
									const activeInteger = hovering ? hoverInteger : selectedInteger;
									const activeStep = hovering ? hoverStep : selectedStep;
									const selected = integer === selectedInteger;
									const over = hovering ? integer === hoverInteger : false;
									let fill =
										integer < activeInteger ||
										(integer === activeInteger && activeStep === stepsLength);
									const styles: Partial<CSSStyleDeclaration> = {};
									const classes: string[] = [];
									if (stepsLength > 1) {
										if (step < stepsLength) {
											classes.push(partialCharacter);
											styles.width = `${(step / stepsLength) * 100}%`;
											if (integer === activeInteger) {
												fill = step <= activeStep;
											}
										}
									}
									console.log(`${integer} ${step}/${stepsLength}`, fill, styles);

									return (
										<div
											key={key}
											styles={styles}
											classes={classes}
											onpointerenter={() => icache.set('hover', key)}
										>
											<Radio
												widgetId={id}
												name={name}
												checked={checked()}
												onValue={checked}
												extraClasses={{
													root: radio,
													inputWrapper: baseCss.visuallyHidden
												}}
												label={
													<virtual>
														<span classes={baseCss.visuallyHidden}>
															{format('starLabels', {
																index: integer
															})}
														</span>
														{character ? (
															character(
																fill,
																integer,
																selected,
																hovering,
																over
															)
														) : (
															<Icon
																classes={{
																	'@dojo/widgets/icon': {
																		icon: [
																			fill
																				? characterFill
																				: null
																		]
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
								})}
							</div>
						);
					});
				}}
			/>
		</div>
	);
});

export default Rate;
