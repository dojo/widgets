import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from './styles/spacer.m.css';

interface SpacerProperties {
	/** The number of columns/rows that the spacer should span, defaults to 1 */
	span?: number;
}

const factory = create().properties<SpacerProperties>();

export const Spacer = factory(function Spacer({ children, properties }) {
	const { span = 1 } = properties();
	return (
		<div styles={{ flex: `${span}` }} classes={[css.root]}>
			{children()}
		</div>
	);
});

export default Spacer;
