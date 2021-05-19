import { tsx, create, isWNode, isVNode } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';

import * as fixedCss from './styles/stack.m.css';
import * as css from '../theme/default/stack.m.css';

export { Spacer } from './Spacer';

export interface StackProperties {
	/** The direction of the stack */
	direction: 'vertical' | 'horizontal';
	/** The sets the alignment of the stack for the opposite direction of the stack, i.e. for a vertical stack it is the horizontal alignment */
	align?: 'start' | 'middle' | 'end';
	/** The spacing between children */
	spacing?: 'small' | 'medium' | 'large';
	/** The padding for stack container */
	padding?: 'small' | 'medium' | 'large';
	/** Stretches the container to fit the space */
	stretch?: boolean;
}

const factory = create({ icache, theme }).properties<StackProperties>();

export const Stack = factory(function Stack({
	properties,
	middleware: { icache, theme },
	children
}) {
	const { direction, align, spacing, padding = false, stretch = false } = properties();
	const themeCss = theme.classes(css);
	let spacingClass: string | undefined;
	let paddingClass: string | undefined;
	let alignClass: string | undefined;

	switch (spacing) {
		case 'small':
			spacingClass = themeCss.smallSpacing;
			break;
		case 'medium':
			spacingClass = themeCss.mediumSpacing;
			break;
		case 'large':
			spacingClass = themeCss.largeSpacing;
			break;
		default:
			break;
	}
	switch (padding) {
		case 'small':
			paddingClass = themeCss.smallPadding;
			break;
		case 'medium':
			paddingClass = themeCss.mediumPadding;
			break;
		case 'large':
			paddingClass = themeCss.largePadding;
			break;
		default:
			break;
	}
	switch (align) {
		case 'start':
			alignClass = fixedCss.start;
			break;
		case 'middle':
			alignClass = fixedCss.middle;
			break;
		case 'end':
			alignClass = fixedCss.end;
			break;
		default:
			break;
	}

	const wrappedChildren = children().map((child, index) => {
		if (isWNode(child) || isVNode(child)) {
			child.properties.spanCallback = (span: number) => {
				icache.set(`span-${index}`, span);
			};
		}

		const span = icache.get(`span-${index}`);
		if (span) {
			return (
				<div styles={{ flex: `${span}` }} classes={[fixedCss.spacer]}>
					{child}
				</div>
			);
		}

		return (
			<div classes={[spacingClass, direction === 'vertical' && alignClass, fixedCss.child]}>
				{child}
			</div>
		);
	});

	return (
		<div
			classes={[
				theme.variant(),
				direction === 'horizontal' ? themeCss.horizontal : themeCss.vertical,
				direction === 'horizontal' ? fixedCss.horizontal : fixedCss.vertical,
				fixedCss.root,
				direction === 'horizontal' && alignClass,
				paddingClass,
				stretch && fixedCss.stretch
			]}
		>
			{wrappedChildren}
		</div>
	);
});

export default Stack;
