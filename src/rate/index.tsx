import { RenderResult } from '@dojo/framework/core/interfaces';
import { uuid } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';
import i18n from '@dojo/framework/core/middleware/i18n';
import Icon from '@dojo/widgets/icon';
import Label from '@dojo/widgets/label';
import * as baseCss from '../common/styles/base.m.css';
import theme from '../middleware/theme';
import { radioGroup } from '../radio-group/middleware';
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
	max?: number;
}

export interface RateChildren {
	(fill: number, index: number): RenderResult;
}

const factory = create({ i18n, radioGroup, theme })
	.properties<RateProperties>()
	.children<RateChildren | undefined>();

export const Rate = factory(function Rate({
	children,
	properties,
	middleware: { i18n, radioGroup, theme }
}) {
	const { format } = i18n.localize(bundle);
	const { root, input, label: labelClasses, legend, characterFill } = theme.classes(css);
	const _uuid = uuid();
	const { name, label, initialValue = 0, onValue, max = 5, widgetId = _uuid } = properties();
	const radio = radioGroup(onValue as any, `${initialValue}`);
	const character = children()[0];
	const range = [];
	for (let i = 0; i <= max; i++) {
		range.push(i);
	}

	return (
		<fieldset key="root" classes={root} id={widgetId} name={name}>
			{label && <legend classes={legend}>{label}</legend>}
			{range.map((index) => {
				const id = `${widgetId}-${name}-${index}`;
				const { checked, value } = radio(`${index}`);
				const fill = index <= +(value() || 0) ? 1 : 0;
				return (
					<virtual>
						<input
							id={id}
							name={name}
							type="radio"
							checked={checked()}
							classes={[input, baseCss.visuallyHidden]}
							onclick={() => checked(true)}
						/>
						<Label
							extraClasses={{ root: labelClasses }}
							forId={id}
							hidden={index === 0}
						>
							<span classes={baseCss.visuallyHidden}>
								{format('starLabels', { index })}
							</span>
							{character ? (
								character(fill, index)
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
						</Label>
					</virtual>
				);
			})}
		</fieldset>
	);
});

export default Rate;
