import * as css from '../theme/default/loading-indicator.m.css';
import theme from '../middleware/theme';
import { ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { create, tsx } from '@dojo/framework/core/vdom';

export interface LoadingIndicatorProperties extends ThemedProperties {}

const factory = create({ theme }).properties<LoadingIndicatorProperties>();

export const LoadingIndicator = factory(function LoadingIndicator({ middleware: { theme } }) {
	const classes = theme.classes(css);

	return (
		<div classes={[theme.variant(), classes.root]} role="progressbar">
			<div classes={classes.buffer} />
			<div classes={[classes.bar, classes.primary]}>
				<span classes={classes.inner} />
			</div>
		</div>
	);
});

export default LoadingIndicator;
