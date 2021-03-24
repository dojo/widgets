import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from './styles/spacer.m.css';

interface SpacerProperties {
	/** The size the spacer needs to take up. The default will take up an equal space */
	size?: 'default' | 'double';
}

const factory = create().properties<SpacerProperties>();

export const Spacer = factory(function Spacer({ children, properties }) {
	const { size = 'default' } = properties();
	return (
		<div classes={[css.root, size === 'default' ? css.normal : css.double]}>{children()}</div>
	);
});

export default Spacer;
