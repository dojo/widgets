import { tsx, create } from '@dojo/framework/core/vdom';
import { HStack } from './HStack';
import { VStack } from './VStack';

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

const factory = create({}).properties<StackProperties>();

export const Stack = factory(function Stack({ children, properties }) {
	const { direction, ...props } = properties();
	if (direction === 'horizontal') {
		return <HStack {...props}>{children()}</HStack>;
	}
	return <VStack {...props}>{children()}</VStack>;
});

export default Stack;
