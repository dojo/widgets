import { tsx, create, isWNode } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';

import * as fixedCss from './styles/stack.m.css';
import * as css from '../theme/default/stack.m.css';

import {
	DNode,
	WNodeFactory,
	OptionalWNodeFactory,
	DefaultChildrenWNodeFactory
} from '@dojo/framework/core/interfaces';
import Spacer from './Spacer';
export { Spacer } from './Spacer';

function typeOf(
	node: DNode,
	factory: WNodeFactory<any> | OptionalWNodeFactory<any> | DefaultChildrenWNodeFactory<any>
) {
	const compareTo = factory({}, []);
	return isWNode(node) && compareTo.widgetConstructor === node.widgetConstructor;
}

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

const factory = create({ theme }).properties<StackProperties>();

export const Stack = factory(function Stack({ properties, middleware: { theme }, children }) {
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

	const wrappedChildren = children().map((child) => {
		if (typeOf(child, Spacer)) {
			return child;
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
