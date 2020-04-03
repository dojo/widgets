import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';

import * as fixedCss from './styles/tooltip.m.css';
import * as css from '../theme/default/tooltip.m.css';
import { formatAriaProperties } from '../common/util';
import { RenderResult } from '@dojo/framework/core/interfaces';

export interface TooltipProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Determines if this tooltip is visible */
	open?: boolean;
	/** Where this tooltip should render relative to its child */
	orientation?: Orientation;
}

export interface TooltipChildren {
	trigger?: RenderResult;
	content: RenderResult;
}

// Enum used to position the Tooltip
export enum Orientation {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
}

const factory = create({ theme })
	.properties<TooltipProperties>()
	.children<TooltipChildren>();

export const Tooltip = factory(function Tooltip({ children, properties, middleware: { theme } }) {
	const { open, aria = {}, orientation = Orientation.right } = properties();
	const classes = theme.classes(css);
	const fixedClasses = theme.classes(fixedCss);
	const [{ trigger, content }] = children();

	let fixedOrientation;
	let classesOrientation;

	if (orientation === 'bottom') {
		fixedOrientation = fixedClasses.bottomFixed;
		classesOrientation = classes.bottom;
	} else if (orientation === 'right') {
		fixedOrientation = fixedClasses.rightFixed;
		classesOrientation = classes.right;
	} else if (orientation === 'left') {
		fixedOrientation = fixedClasses.leftFixed;
		classesOrientation = classes.left;
	} else if (orientation === 'top') {
		fixedOrientation = fixedClasses.topFixed;
		classesOrientation = classes.top;
	}

	return (
		<div
			classes={[
				theme.variant(),
				classesOrientation,
				fixedClasses.rootFixed,
				fixedOrientation
			]}
		>
			<div key="target">
				{trigger}
				{open ? (
					<div
						key="content"
						{...formatAriaProperties(aria)}
						classes={[classes.content, fixedClasses.contentFixed]}
					>
						{content}
					</div>
				) : null}
			</div>
		</div>
	);
});

export default Tooltip;
