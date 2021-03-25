import { tsx, create, isWNode } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import * as fixedCss from './styles/vstack.m.css';
import * as css from '../theme/default/vstack.m.css';
import Spacer from './Spacer';
import {
	DNode,
	WNodeFactory,
	OptionalWNodeFactory,
	DefaultChildrenWNodeFactory
} from '@dojo/framework/core/interfaces';

export interface VStackProperties {
	/** The sets the horizontal alignment of the stack */
	align?: 'start' | 'middle' | 'end';
	/** The spacing between children */
	spacing?: 'small' | 'medium' | 'large';
	/** The padding for stack container */
	padding?: 'small' | 'medium' | 'large';
	/** Stretches the container to fit the space */
	stretch?: boolean;
}

function typeOf(
	node: DNode,
	factory: WNodeFactory<any> | OptionalWNodeFactory<any> | DefaultChildrenWNodeFactory<any>
) {
	const compareTo = factory({}, []);
	return isWNode(node) && compareTo.widgetConstructor === node.widgetConstructor;
}

const factory = create({ theme }).properties<VStackProperties>();

export const VStack = factory(function VStack({ properties, middleware: { theme }, children }) {
	const { align, spacing, padding, stretch = false } = properties();
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
			alignClass = fixedCss.left;
			break;
		case 'middle':
			alignClass = fixedCss.center;
			break;
		case 'end':
			alignClass = fixedCss.right;
			break;
		default:
			break;
	}

	const wrappedChildren = children().map((child) => {
		if (typeOf(child, Spacer)) {
			return child;
		}
		return <div classes={[spacingClass, alignClass, fixedCss.child]}>{child}</div>;
	});

	return (
		<div classes={[theme.variant(), fixedCss.root, paddingClass, stretch && fixedCss.stretch]}>
			{wrappedChildren}
		</div>
	);
});

export default VStack;
