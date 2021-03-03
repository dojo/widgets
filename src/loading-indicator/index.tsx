import * as css from '../theme/default/loading-indicator.m.css';
import theme from '../middleware/theme';
import { ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { create, tsx } from '@dojo/framework/core/vdom';

export interface LoadingIndicatorProperties extends ThemedProperties {
	/** If the element is actively loading. Defaults to true */
	active?: boolean;
}

const factory = create({ theme }).properties<LoadingIndicatorProperties>();

export const LoadingIndicator = factory(function LoadingIndicator({
	properties,
	middleware: { theme }
}) {
	const classes = theme.classes(css);
	const { active = true } = properties();

	return (
		<div
			classes={[theme.variant(), classes.root, !active && classes.inactive]}
			role="progressbar"
		>
			<div classes={classes.buffer} />
			{active ? (
				<div classes={[classes.bar, classes.primary]}>
					<span classes={classes.inner} />
				</div>
			) : null}
		</div>
	);
});

export default LoadingIndicator;
