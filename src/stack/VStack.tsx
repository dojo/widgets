import { tsx, create, isWNode } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import * as fixedCss from './styles/vstack.m.css';
import * as css from '../theme/default/vstack.m.css';
import Spacer from './Spacer';

export interface VStackProperties {
	/** The spacing between children, defaults to `none` */
	spacing?: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'none';
	/** Adds padding to the stack container */
	padding?: boolean;
}

const spacer = <Spacer />;

const factory = create({ theme }).properties<VStackProperties>();

export const VStack = factory(function VStack({ properties, middleware: { theme }, children }) {
	const { spacing = 'none', padding = false } = properties();
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
		<div classes={[theme.variant(), fixedCss.root, padding && themeCss.padding]}>
			{wrappedChildren}
		</div>
	);
});

export default VStack;
