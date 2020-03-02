import * as css from '../theme/default/loading-indicator.m.css';
import theme from '../middleware/theme';
import { ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { create, tsx } from '@dojo/framework/core/vdom';

export interface LoadingIndicatorProperties extends ThemedProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
}

const factory = create({ theme }).properties<LoadingIndicatorProperties>();

export const LoadingIndicator = factory(function LoadingIndicator({
	properties,
	middleware: { theme }
}) {
	const classes = theme.classes(css);
	const { aria = {} } = properties();

	return (
		<div
			aria-label={aria.label}
			aria-valuemax={aria.valuemax}
			aria-valuemin={aria.valuemin}
			aria-valuenow={aria.valuenow}
			classes={classes.root}
			role="progressbar"
		>
			<div classes={classes.buffer} />
			<div classes={[classes.bar, classes.primary]}>
				<span classes={classes.inner} />
			</div>
		</div>
	);
});

export default LoadingIndicator;
