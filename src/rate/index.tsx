import { focus } from '@dojo/framework/core/middleware/focus';
import { create, tsx } from '@dojo/framework/core/vdom';

// import { formatAriaProperties } from '../common/util';
import theme from '../middleware/theme';
import * as css from '../theme/default/rate.m.css';
import * as baseCss from '../common/styles/base.m.css';
// import Label from '../label';
import RadioGroup from '../radio-group';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Icon from '../icon';
import { RenderResult } from '@dojo/framework/core/interfaces';

export interface RateProperties {
	/** Handler for when the value of the widget changes */
	onValue(value: number): void;
	/* Number of icons to show */
	max?: number;
	/* Initial value for this widget */
	initialValue?: number;
	/* Controlled value for this widget */
	value?: number;
}

export interface RateChildren {
	label?: RenderResult;
	icon?: RenderResult;
}

interface RateIcache {
	value: number;
	valueHovered: number;
	initialValue: number;
}

const factory = create({ focus, theme, icache: createICacheMiddleware<RateIcache>() })
	.properties<RateProperties>()
	.children<RateChildren | undefined>();

export const Rate = factory(function Radio({
	properties,
	id,
	children,
	middleware: { focus, theme, icache }
}) {
	const { onValue, max = 5, initialValue } = properties();
	let { value } = properties();
	const [{ label, icon } = { label: undefined, icon: undefined }] = children();

	const themeCss = theme.classes(css);
	const hoveredValue = icache.getOrSet('valueHovered', 0);

	if (value === undefined) {
		if (initialValue !== undefined) {
			const previousInitialValue = icache.get('initialValue');
			if (initialValue !== previousInitialValue) {
				icache.set('initialValue', initialValue);
				icache.set('value', initialValue);
			}
		}

		value = icache.getOrSet('value', 0);
	}

	const options = [];
	for (let i = 1; i <= max; i++) {
		options.push({ value: `${i}` });
	}

	return (
		<div classes={[themeCss.root, theme.variant()]}>
			<RadioGroup
				key="radio-group"
				name="rate"
				options={options}
				onValue={(value: string) => {
					const numberVal = parseInt(value, 10);
					icache.set('value', numberVal);
					icache.delete('valueHovered');
					onValue(numberVal);
				}}
			>
				{{
					label,
					radios: (name, radioGroup, options) => {
						return options.map(({ value: stringValue }) => {
							const numValue = parseInt(stringValue, 10);
							const { checked } = radioGroup(stringValue);
							const visiblyChecked = hoveredValue
								? numValue <= hoveredValue
								: !!value && numValue <= value;

							return (
								<label
									classes={[themeCss.icon, visiblyChecked && themeCss.checked]}
									onmouseenter={() => {
										icache.set('valueHovered', numValue);
									}}
									onmouseleave={() => {
										icache.delete('valueHovered');
									}}
									title={stringValue}
								>
									{icon || <Icon size="medium" type="starIcon" />}
									<input
										classes={baseCss.visuallyHidden}
										type="radio"
										checked={checked()}
										name={name}
										value={stringValue}
										onchange={(event: Event) => {
											event.stopPropagation();
											const radio = event.target as HTMLInputElement;
											checked(radio.checked);
										}}
									/>
								</label>
							);
						});
					}
				}}
			</RadioGroup>
		</div>
	);
});

export default Rate;
