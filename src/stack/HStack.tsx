import { tsx, create, isWNode } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import * as fixedCss from './styles/hstack.m.css';
import * as css from '../theme/default/hstack.m.css';
import Spacer from './Spacer';

export interface HStackProperties {
	/**  */
	align?: 'top' | 'middle' | 'bottom';
	/** The spacing between children, defaults to `none` */
	spacing?: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'none';
	/** Adds padding to the stack container */
	padding?: boolean;
}

const factory = create({ theme }).properties<HStackProperties>();

const spacer = <Spacer />;

export const HStack = factory(function HStack({ properties, middleware: { theme }, children }) {
	const { align = 'middle', spacing = 'none', padding = false } = properties();
	const themeCss = theme.classes(css);
	let spacingClass: string;
	switch (spacing) {
		case 'extra-small':
			spacingClass = themeCss.extraSmall;
			break;
		case 'small':
			spacingClass = themeCss.small;
			break;
		case 'medium':
			spacingClass = themeCss.medium;
			break;
		case 'large':
			spacingClass = themeCss.large;
			break;
		case 'extra-large':
			spacingClass = themeCss.extraLarge;
			break;
		default:
			break;
	}

	let alignClass: string | undefined;
	switch (align) {
		case 'top':
			alignClass = fixedCss.top;
			break;
		case 'middle':
			alignClass = fixedCss.middle;
			break;
		case 'bottom':
			alignClass = fixedCss.bottom;
			break;
		default:
			break;
	}

	const wrappedChildren = children().map((child, index) => {
		if (isWNode(child) && spacer.widgetConstructor === child.widgetConstructor) {
			return child;
		}
		return (
			<div key={index} classes={[spacingClass, fixedCss.child]}>
				{child}
			</div>
		);
	});

	return (
		<div classes={[theme.variant(), fixedCss.root, alignClass, padding && themeCss.padding]}>
			{wrappedChildren}
		</div>
	);
});

export default HStack;
