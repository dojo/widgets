import { tsx, create } from '@dojo/framework/core/vdom';
import { HStack } from './HStack';
import { VStack } from './VStack';

export interface StackProperties {
	/** The direction of the stack */
	direction: 'vertical' | 'horizontal';
	/** The alignment of the stack */
	align?: 'start' | 'middle' | 'end';
	/** The spacing between children, defaults to `none` */
	spacing?: 'small' | 'medium' | 'large' | 'none';
	/** Adds padding to the stack container */
	padding?: 'small' | 'medium' | 'large' | 'none';
	/** Stretches the container to fit the space */
	stretch?: boolean;
}

const factory = create({}).properties<StackProperties>();

export const Stack = factory(function Stack({ children, properties }) {
	const { direction, ...props } = properties();
	if (direction === 'horizontal') {
		return <HStack {...props}>{children()}</HStack>;
	}
	return <VStack {...props}>{children()}</VStack>;
});

export default Stack;
