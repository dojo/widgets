import { tsx, create, isWNode } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import * as fixedCss from './styles/hstack.m.css';
import * as css from '../theme/default/hstack.m.css';
import Spacer from './Spacer';
import {
	DNode,
	WNodeFactory,
	OptionalWNodeFactory,
	DefaultChildrenWNodeFactory
} from '@dojo/framework/core/interfaces';

export interface HStackProperties {
	/** The vertical alignment of the stack */
	align?: 'start' | 'middle' | 'end';
	/** The spacing between children */
	spacing?: 'small' | 'medium' | 'large';
	/** The padding for stack container */
	padding?: 'small' | 'medium' | 'large';
	/** Stretches the container to fit the space */
	stretch?: boolean;
}

const factory = create({ theme }).properties<HStackProperties>();

function typeOf(
	node: DNode,
	factory: WNodeFactory<any> | OptionalWNodeFactory<any> | DefaultChildrenWNodeFactory<any>
) {
	const compareTo = factory({}, []);
	return isWNode(node) && compareTo.widgetConstructor === node.widgetConstructor;
}

export const HStack = factory(function HStack({ properties, middleware: { theme }, children }) {
	const { align, spacing, padding = false, stretch = false } = properties();
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
			alignClass = fixedCss.top;
			break;
		case 'middle':
			alignClass = fixedCss.middle;
			break;
		case 'end':
			alignClass = fixedCss.bottom;
			break;
		default:
			break;
	}

	const wrappedChildren = children().map((child) => {
		if (typeOf(child, Spacer)) {
			return child;
		}
		return <div classes={[spacingClass, fixedCss.child]}>{child}</div>;
	});

	return (
		<div
			classes={[
				theme.variant(),
				fixedCss.root,
				alignClass,
				paddingClass,
				stretch && fixedCss.stretch
			]}
		>
			{wrappedChildren}
		</div>
	);
});

export default HStack;
