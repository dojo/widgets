import * as css from '../theme/default/loading-indicator.m.css';
import theme from '../middleware/theme';
import { ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { create, tsx } from '@dojo/framework/core/vdom';

export interface LoadingIndicatorProperties extends ThemedProperties {
	/** If the element is actively loading. Defaults to true */
	active?: boolean;
	/* Sets loader type to linear or circular */
	type?: 'linear' | 'circular';
	/* Size of circular loader */
	size?: 'small' | 'medium' | 'large';
}

const factory = create({ theme }).properties<LoadingIndicatorProperties>();

export const LoadingIndicator = factory(function LoadingIndicator({
	properties,
	middleware: { theme }
}) {
	const classes = theme.classes(css);
	const { active = true, type = 'linear', size = 'small' } = properties();

	const sizeClass = size && classes[size as keyof typeof classes];
	return (
		<virtual>
			{type === 'linear' && (
				<div
					classes={[
						theme.variant(),
						classes.root,
						!active && classes.inactive,
						classes.linear
					]}
					role="progressbar"
				>
					<div classes={classes.buffer} />
					{active ? (
						<div classes={[classes.bar, classes.primary]}>
							<span classes={classes.inner} />
						</div>
					) : null}
				</div>
			)}
			{type === 'circular' && (
				<div
					classes={[
						theme.variant(),
						classes.root,
						!active && classes.inactive,
						classes.circular,
						sizeClass
					]}
					role="progressbar"
				>
					{active ? (
						<div classes={classes.circularContainer}>
							<div classes={classes.spinnerLayer}>
								<div classes={[classes.circleClipper, classes.circleLeft]}>
									<svg
										classes={classes.circleGraphic}
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle
											cx="12"
											cy="12"
											r="8.75"
											stroke-dasharray="54.978"
											stroke-dashoffset="27.489"
											stroke-width="2.5"
										/>
									</svg>
								</div>
								<div classes={classes.gapPatch}>
									<svg
										classes={classes.circleGraphic}
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle
											cx="12"
											cy="12"
											r="8.75"
											stroke-dasharray="54.978"
											stroke-dashoffset="27.489"
											stroke-width="2"
										/>
									</svg>
								</div>
								<div classes={[classes.circleClipper, classes.circleRight]}>
									<svg
										classes={classes.circleGraphic}
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle
											cx="12"
											cy="12"
											r="8.75"
											stroke-dasharray="54.978"
											stroke-dashoffset="27.489"
											stroke-width="2.5"
										/>
									</svg>
								</div>
							</div>
						</div>
					) : null}
				</div>
			)}
		</virtual>
	);
});

export default LoadingIndicator;
